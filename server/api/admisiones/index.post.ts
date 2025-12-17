import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { pacienteId, servicioId, fechaCita, observaciones, tipoComprobante, metodoPago, archivos } = body

    if (!pacienteId || !fechaCita || !servicioId) {
        return { ok: false, message: 'Datos incompletos' }
    }

    try {
        // Get Service details
        const servicio = await prisma.servicios_medicos.findUnique({ where: { id: servicioId } })
        if (!servicio) {
            return { ok: false, message: 'Servicio no encontrado' }
        }

        const precio = Number(servicio.precio) || 0
        const subtotal = precio / 1.18
        const igv = precio - subtotal

        // Create admission, appointment, invoice, and files
        const result = await prisma.$transaction(async (tx) => {
            const admision = await tx.admisiones.create({
                data: {
                    paciente_id: pacienteId,
                    fecha: new Date(fechaCita),
                    tipo_examen: servicio.nombre || 'Examen', // Use service name
                    estado: 'PROGRAMADO',
                    observaciones: observaciones,
                    facturas: {
                        create: {
                            serie: 'F001',
                            correlativo: Math.floor(Math.random() * 10000), // Temp
                            total: precio,
                            subtotal: subtotal,
                            igv: igv,
                            tipo_comprobante: tipoComprobante || 'Boleta',
                            metodo_pago: metodoPago || 'Efectivo',
                            estado_sunat: 'PENDIENTE'
                        }
                    },
                    archivos_historia: {
                        create: (archivos || []).map((f: any) => ({
                            nombre: f.nombre,
                            url: f.url,
                            size: f.size || 0
                        }))
                    }
                },
                include: {
                    pacientes: {
                        include: {
                            usuarios: true,
                            empresas: true
                        }
                    },
                    facturas: true
                }
            })

            const cita = await tx.citas.create({
                data: {
                    admision_id: admision.id,
                    fecha_hora: new Date(fechaCita),
                    duracion_min: servicio.duracion_min || 30,
                    medico_id: null, // Could assign based on servicio.medico_responsable if we had user lookups
                    estado: 'AGENDADO'
                }
            })

            return { admision, cita }
        })

        const admision = result.admision

        // Webhook integration (W1: Nueva Admisión)
        const config = useRuntimeConfig()
        const webhookUrl = config.n8nAdmisionWebhook

        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        admisionId: admision.id,
                        pacienteId: admision.paciente_id,
                        pacienteNombre: admision.pacientes?.usuarios?.nombre,
                        pacienteCorreo: admision.pacientes?.usuarios?.correo,
                        pacienteDni: admision.pacientes?.usuarios?.dni,
                        pacienteTelefono: admision.pacientes?.telefono,
                        empresa: admision.pacientes?.empresas?.razon_social,
                        fechaCita: admision.fecha,
                        tipoExamen: admision.tipo_examen,
                        medicoResponsable: servicio.medico_responsable,
                        servicioCodigo: servicio.codigo,
                        servicioDescripcion: servicio.descripcion,
                        servicioDuracion: servicio.duracion_min,
                        total: admision.facturas?.total,
                        subtotal: admision.facturas?.subtotal,
                        igv: admision.facturas?.igv,
                        tipoComprobante: admision.facturas?.tipo_comprobante,
                        metodoPago: admision.facturas?.metodo_pago,
                        estadoFactura: admision.facturas?.estado_sunat
                    }),
                })
            } catch (err) {
                console.error('Error llamando a n8n (W1 admision):', err)
            }
        }

        return {
            ok: true,
            message: 'Admisión creada exitosamente',
            id: admision.id
        }

    } catch (e: any) {
        console.error('Error creating admission:', e)
        return { ok: false, message: 'Error interno: ' + e.message }
    }
})

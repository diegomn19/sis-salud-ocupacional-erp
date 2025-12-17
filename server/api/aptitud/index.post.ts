import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { admision_id, resultado, observaciones } = body

    // Validar datos básicos
    if (!admision_id || !resultado) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan datos requeridos (admision_id, resultado)'
        })
    }

    try {
        // Verificar si ya existe un concepto para esta admisión
        const existing = await prisma.concepto_aptitud.findFirst({
            where: { admision_id }
        })

        let conceptoId = ''

        if (existing) {
            // Actualizar existente
            const updated = await prisma.concepto_aptitud.update({
                where: { id: existing.id },
                data: {
                    resultado,
                    firmado_en: new Date()
                }
            })
            conceptoId = updated.id
        } else {
            // Crear nuevo
            const created = await prisma.concepto_aptitud.create({
                data: {
                    admision_id,
                    resultado,
                    firmado_en: new Date()
                }
            })
            conceptoId = created.id
        }

        // Actualizar estado de la admisión
        const admision = await prisma.admisiones.update({
            where: { id: admision_id },
            data: { estado: 'COMPLETADO' },
            include: {
                pacientes: {
                    include: {
                        usuarios: { select: { nombre: true, correo: true, dni: true } },
                        empresas: { select: { razon_social: true } }
                    }
                }
            }
        })

        // Webhook integration (W2: Aptitud Finalizada)
        const config = useRuntimeConfig()
        const webhookUrl = config.n8nAptitudWebhook

        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        admisionId: admision.id,
                        conceptoId: conceptoId,
                        resultado: resultado,
                        pacienteNombre: admision.pacientes?.usuarios?.nombre,
                        pacienteCorreo: admision.pacientes?.usuarios?.correo,
                        pacienteDni: admision.pacientes?.usuarios?.dni,
                        empresa: admision.pacientes?.empresas?.razon_social,
                    }),
                })
            } catch (err) {
                console.error('Error llamando a n8n (W2 aptitud):', err)
            }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Error saving aptitud:', error)
        // Return specific error for debugging
        return {
            success: false,
            message: error.meta?.cause || error.message || 'Error desconocido al guardar'
        }
    }
})

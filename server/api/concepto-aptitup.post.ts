import { defineEventHandler, readBody, createError } from 'h3'


type BodyConcepto = {
    admisionId: string
    resultado: 'APTO' | 'APTO CON RESTRICCIONES' | 'NO APTO'
}

export default defineEventHandler(async (event) => {
    const body = await readBody<BodyConcepto>(event)
    const { admisionId, resultado } = body

    if (!admisionId || !resultado) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan campos obligatorios (admisionId, resultado)',
        })
    }

    // 1) Buscar la admisión con info del paciente y Empresa
    const admision = await prisma.admisiones.findUnique({
        where: { id: admisionId },
        include: {
            pacientes: {
                include: {
                    usuarios: true,
                    empresas: true, // Incluir empresa para obtener correo
                },
            },
        },
    })

    if (!admision) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Admision no encontrada',
        })
    }

    // 2) Crear o actualizar el concepto de aptitud
    const concepto = await prisma.concepto_aptitud.upsert({
        where: { admision_id: admisionId },
        update: {
            resultado,
            firmado_en: new Date(),
        },
        create: {
            admision_id: admisionId,
            resultado,
            firmado_en: new Date(),
        },
    })

    // Extraer datos de empresa
    const empresa = admision.pacientes?.empresas
    const contactoEmpresa = empresa?.contacto as any // JSONB
    const correoEmpresa = contactoEmpresa?.email || ''

    // 3) Llamar a n8n (Workflow 2: Generación + Notificación de Informe de Aptitud)
    try {
        await fetch('http://localhost:5678/webhook/aptitud/finalizada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                admisionId,
                conceptoId: concepto.id,
                resultado,
                pacienteNombre: admision.pacientes?.usuarios?.nombre,
                pacienteCorreo: admision.pacientes?.usuarios?.correo,
                pacienteDni: admision.pacientes?.usuarios?.dni,
                empresaNombre: empresa?.razon_social,
                empresaCorreo: correoEmpresa,
                empresaRuc: empresa?.ruc,
                fecha: admision.fecha, // Para el reporte
            }),
        })
    } catch (err) {
        console.error('Error llamando a n8n (concepto_finalizado):', err)
    }

    return { ok: true, concepto }
})

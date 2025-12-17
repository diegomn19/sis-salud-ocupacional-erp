import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { admision_id, total, serie } = body

    if (!admision_id || !total) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Admisión y total son requeridos'
        })
    }

    try {
        // 1. Obtener último correlativo
        const lastInvoice = await prisma.facturas.findFirst({
            where: { serie: serie || 'F001' },
            orderBy: { correlativo: 'desc' }
        })

        const nextCorrelativo = (lastInvoice?.correlativo || 0) + 1

        // 2. Transacción para crear factura y actualizar admisión
        const result = await prisma.$transaction(async (tx) => {
            // Crear Factura
            const factura = await tx.facturas.create({
                data: {
                    admision_id: admision_id,
                    serie: serie || 'F001',
                    correlativo: nextCorrelativo,
                    total: Number(total),
                    estado_sunat: 'PENDIENTE',
                    pdf_path: 'dummy.pdf'
                }
            })

            // Actualizar Admisión
            await tx.admisiones.update({
                where: { id: admision_id },
                data: { factura_id: factura.id }
            })

            return factura
        })

        return { success: true, factura: result }

    } catch (error: any) {
        console.error('Error creando factura:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Error interno al crear factura'
        })
    }
})

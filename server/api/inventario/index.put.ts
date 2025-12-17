import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id, nombre, stock_actual, stock_min } = body

    if (!id || !nombre) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan datos requeridos'
        })
    }

    try {
        const producto = await prisma.productos.update({
            where: { id },
            data: {
                nombre,
                stock_actual: Number(stock_actual),
                stock_min: Number(stock_min)
            }
        })
        return { success: true, producto }
    } catch (error: any) {
        console.error('Error updating product:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al actualizar producto'
        })
    }
})

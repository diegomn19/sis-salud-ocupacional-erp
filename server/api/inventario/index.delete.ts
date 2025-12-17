import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID requerido'
        })
    }

    try {
        await prisma.productos.delete({
            where: { id }
        })
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting product:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al eliminar producto'
        })
    }
})

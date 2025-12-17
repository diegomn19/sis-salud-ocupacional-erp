import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // DELETE (si se envía solo ID)
    if (event.method === 'DELETE' || (body.id && !body.nombre)) {
        const { id } = body
        await prisma.productos.delete({ where: { id } })
        return { ok: true }
    }

    // CREATE (si es POST regular)
    const { nombre, stock_min, stock_actual } = body

    const producto = await prisma.productos.create({
        data: {
            nombre,
            stock_min: Number(stock_min),
            stock_actual: Number(stock_actual)
        }
    })

    return producto
})

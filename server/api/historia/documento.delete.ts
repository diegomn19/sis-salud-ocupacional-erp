import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { id } = body

    await prisma.archivos_historia.delete({
        where: { id }
    })

    return { ok: true }
})

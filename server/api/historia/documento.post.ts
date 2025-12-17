import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { admision_id, nombre, url, size } = body

    const doc = await prisma.archivos_historia.create({
        data: {
            admision_id,
            nombre,
            url,
            size: Number(size)
        }
    })

    return doc
})

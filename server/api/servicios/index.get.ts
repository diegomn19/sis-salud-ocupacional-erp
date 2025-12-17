
import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const services = await prisma.servicios_medicos.findMany({
            orderBy: { nombre: 'asc' }
        })
        return { ok: true, data: services }
    } catch (e: any) {
        return { ok: false, message: e.message }
    }
})

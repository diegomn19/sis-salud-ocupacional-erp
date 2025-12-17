import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
    const empresas = await prisma.empresas.findMany({
        orderBy: { razon_social: 'asc' }
    })
    return empresas
})

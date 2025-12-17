import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { ruc, razon_social, contacto } = body

    if (!ruc || !razon_social) {
        return { ok: false, message: 'RUC y razón social son requeridos' }
    }

    try {
        const empresa = await prisma.empresas.create({
            data: {
                ruc,
                razon_social,
                contacto: contacto || null
            }
        })
        return { ok: true, empresa }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { ok: false, message: 'Ya existe una empresa con ese RUC' }
        }
        return { ok: false, message: 'Error al crear empresa' }
    }
})

// server/api/pacientes/search.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    const url = new URL(event.node.req.url || '', 'http://localhost')
    const dni = String(url.searchParams.get('dni') || '').trim()

    if (!dni) {
        return { ok: false, message: 'Debe enviar el parámetro dni' }
    }

    const usuario = await prisma.usuarios.findUnique({
        where: { dni },
        include: {
            pacientes: {
                include: {
                    admisiones: true,
                },
            },
        },
    })

    if (!usuario) {
        return { ok: false, found: false, message: 'No se encontró paciente con ese DNI' }
    }

    return {
        ok: true,
        found: true,
        usuario,
    }
})

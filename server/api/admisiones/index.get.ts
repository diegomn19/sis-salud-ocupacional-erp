import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const estado = query.estado as string | undefined
    const search = query.search as string | undefined
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20

    const where: any = {}

    if (estado && estado !== 'TODOS') {
        where.estado = estado
    }

    if (search) {
        where.OR = [
            { pacientes: { usuarios: { nombre: { contains: search, mode: 'insensitive' } } } },
            { pacientes: { usuarios: { dni: { contains: search } } } }
        ]
    }

    const [admisiones, total] = await Promise.all([
        prisma.admisiones.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { fecha: 'desc' },
            include: {
                pacientes: {
                    include: {
                        usuarios: { select: { nombre: true, dni: true } },
                        empresas: { select: { razon_social: true } }
                    }
                }
            }
        }),
        prisma.admisiones.count({ where })
    ])

    const data = admisiones.map((a) => ({
        id: a.id,
        fecha: a.fecha.toISOString(),
        paciente_nombre: a.pacientes?.usuarios?.nombre || 'Sin nombre',
        dni: a.pacientes?.usuarios?.dni || '',
        empresa: a.pacientes?.empresas?.razon_social || 'Particular',
        tipo_examen: a.tipo_examen || 'General',
        estado: a.estado || 'PENDIENTE',
        observaciones: a.observaciones
    }))

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
})

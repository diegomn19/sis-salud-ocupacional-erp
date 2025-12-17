import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
    try {
        const pacientes = await prisma.pacientes.findMany({
            take: 100, // Limit to 100 for now to valid performance
            orderBy: {
                usuarios: { nombre: 'asc' }
            },
            include: {
                usuarios: {
                    select: { nombre: true, dni: true }
                }
            }
        })

        return pacientes.map(p => ({
            id: p.id, // paciente_id
            nombre: p.usuarios?.nombre || 'Sin Nombre',
            dni: p.usuarios?.dni || 'Sin DNI'
        }))
    } catch (error) {
        console.error('Error fetching patients:', error)
        return []
    }
})

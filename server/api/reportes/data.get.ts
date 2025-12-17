import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { tipo, fechaInicio, fechaFin } = getQuery(event)

  // Ensure dates are valid Date objects or strings
  const start = new Date(fechaInicio as string)
  const end = new Date(fechaFin as string)

  if (tipo === 'admisiones') {
    const res = await prisma.admisiones.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end
        }
      },
      select: {
        id: true,
        fecha: true,
        tipo_examen: true,
        estado: true
      },
      orderBy: { fecha: 'desc' }
    })
    return res
  }

  if (tipo === 'ingresos') {
    const res = await prisma.facturas.findMany({
      where: {
        admisiones: {
          fecha: {
            gte: start,
            lte: end
          }
        }
      },
      include: {
        admisiones: {
          select: { fecha: true }
        }
      },
      orderBy: { correlativo: 'desc' }
    })

    return res.map(f => ({
      id: f.id,
      serie: f.serie,
      total: f.total,
      estado_sunat: f.estado_sunat,
      fecha_emision: f.admisiones?.fecha
    }))
  }

  return []
})

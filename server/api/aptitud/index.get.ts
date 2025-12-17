import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const admisiones = await prisma.admisiones.findMany({
    where: { estado: { not: 'ANULADO' } },
    include: {
      pacientes: {
        include: {
          usuarios: true,
          empresas: true
        }
      },
      concepto_aptitud: true
    },
    orderBy: { fecha: 'desc' }
  })

  return admisiones.map(a => ({
    id: a.id,
    fecha: a.fecha,
    paciente: a.pacientes?.usuarios?.nombre,
    dni: a.pacientes?.usuarios?.dni,
    empresa: a.pacientes?.empresas?.razon_social || 'Particular',
    examen: a.tipo_examen,
    resultado: a.concepto_aptitud?.resultado || 'PENDIENTE'
  }))
})

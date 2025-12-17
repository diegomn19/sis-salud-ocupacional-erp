import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Admisiones que no tienen factura asociada
  const pendientes = await prisma.admisiones.findMany({
    where: {
      factura_id: null,
      estado: { not: 'ANULADO' }
    },
    include: {
      pacientes: {
        include: {
          usuarios: true,
          empresas: true
        }
      }
    },
    orderBy: { fecha: 'desc' }
  })

  return pendientes.map(p => ({
    id: p.id,
    fecha: p.fecha,
    paciente_id: p.paciente_id,
    paciente_nombre: p.pacientes?.usuarios?.nombre,
    dni: p.pacientes?.usuarios?.dni,
    empresa: p.pacientes?.empresas?.razon_social,
    tipo_examen: p.tipo_examen
  }))
})

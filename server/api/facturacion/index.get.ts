import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const facturas = await prisma.facturas.findMany({
    include: {
      admisiones: {
        include: {
          pacientes: {
            include: {
              usuarios: { select: { nombre: true, dni: true } },
              empresas: { select: { razon_social: true, ruc: true } }
            }
          }
        }
      }
    },
    orderBy: { correlativo: 'desc' }
  })

  return facturas.map(f => ({
    id: f.id,
    serie: f.serie,
    correlativo: f.correlativo,
    total: f.total,
    estado_sunat: f.estado_sunat,
    admision_id: f.admision_id,
    fecha: f.admisiones?.fecha,
    cliente: f.admisiones?.pacientes?.empresas?.razon_social || f.admisiones?.pacientes?.usuarios?.nombre || 'Cliente',
    ruc: f.admisiones?.pacientes?.empresas?.ruc || null
  }))
})

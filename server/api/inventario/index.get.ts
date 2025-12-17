import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const productos = await prisma.productos.findMany({
    orderBy: { nombre: 'asc' }
  })
  return productos
})

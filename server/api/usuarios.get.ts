import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const usuarios = await prisma.usuarios.findMany({
    select: {
      id: true,
      dni: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      creado_en: true,
    },
  })

  return usuarios
})

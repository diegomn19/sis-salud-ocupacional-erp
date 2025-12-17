import prisma from '../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    dni: string
    nombre: string
    correo?: string
    password: string
    rol: string
  }>(event)

  const hashed = await bcrypt.hash(body.password, 10)

  const usuario = await prisma.usuarios.create({
    data: {
      dni: body.dni,
      nombre: body.nombre,
      correo: body.correo,
      password_hash: hashed,
      rol: body.rol,
    },
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

  return usuario
})

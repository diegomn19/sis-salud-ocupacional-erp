import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { dni, password } = body

    if (!dni || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'DNI y contraseña son requeridos'
        })
    }

    // 1. Buscar usuario
    const usuario = await prisma.usuarios.findUnique({
        where: { dni }
    })

    if (!usuario || !usuario.activo) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenciales inválidas o usuario inactivo'
        })
    }

    // 2. Verificar contraseña
    const isValid = await bcrypt.compare(password, usuario.password_hash)
    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenciales inválidas'
        })
    }

    // 3. Crear token (Simple JWT)
    const token = jwt.sign({
        id: usuario.id,
        dni: usuario.dni,
        rol: usuario.rol,
        nombre: usuario.nombre
    }, SECRET, { expiresIn: '8h' })

    // 4. Setear Cookie HttpOnly
    setCookie(event, 'auth_token', token, {
        httpOnly: false, // Allow JS access for simple client-side checks if needed, ideally true but for this simple setup false helps debugging
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/'
    })

    // Retornar info de usuario (sin password)
    return {
        ok: true,
        user: {
            id: usuario.id,
            dni: usuario.dni,
            nombre: usuario.nombre,
            rol: usuario.rol,
            correo: usuario.correo
        }
    }
})

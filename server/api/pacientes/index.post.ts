import { defineEventHandler, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { dni, nombres, apellidos, telefono, email, fechaNac, sexo, tipoSangre, alergias, empresaId } = body

    if (!dni || !nombres || !apellidos) {
        return { ok: false, message: 'DNI, Nombres y Apellidos son requeridos' }
    }

    const nombreCompleto = `${nombres} ${apellidos}`.trim()

    try {
        // Check if user already exists
        const existingUser = await prisma.usuarios.findUnique({ where: { dni } })
        if (existingUser) {
            return { ok: false, message: 'Ya existe un usuario con este DNI' }
        }

        // Create user and patient in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create usuario
            const usuario = await tx.usuarios.create({
                data: {
                    dni,
                    nombre: nombreCompleto,
                    correo: email || null,
                    password_hash: '$2b$10$EpOd/W.0Z./H.w/H.w/H.w/H.w/H.w/H.w/H.w/H.w/H.w', // Placeholder hash
                    rol: 'PACIENTE',
                    activo: true
                }
            })

            // Create paciente
            const paciente = await tx.pacientes.create({
                data: {
                    usuario_id: usuario.id,
                    fecha_nac: fechaNac ? new Date(fechaNac) : new Date('1990-01-01'),
                    sexo: sexo || 'M',
                    telefono: telefono || null,
                    tipo_sangre: tipoSangre || null,
                    alergias: alergias || null,
                    empresa_id: empresaId || null
                },
                include: {
                    empresas: true
                }
            })

            return { usuario, paciente }
        })

        return {
            ok: true,
            message: 'Paciente creado exitosamente',
            paciente: {
                id: result.paciente.id,
                usuarioId: result.usuario.id,
                nombre: result.usuario.nombre,
                dni: result.usuario.dni,
                empresa: result.paciente.empresas?.razon_social
            }
        }
    } catch (error: any) {
        console.error('Error creating patient:', error)

        // Handle Unique Constraint Violation (P2002)
        if (error.code === 'P2002') {
            const target = error.meta?.target
            if (Array.isArray(target)) {
                if (target.includes('correo')) {
                    return { ok: false, message: 'El correo electrónico ya está registrado por otro usuario.' }
                }
                if (target.includes('dni')) {
                    return { ok: false, message: 'El DNI ya existe en el sistema.' }
                }
            }
        }

        return { ok: false, message: 'Error al crear paciente: ' + (error.message || 'Error desconocido') }
    }
})

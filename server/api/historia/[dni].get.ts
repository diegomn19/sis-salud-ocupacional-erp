import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const dni = event.context.params?.dni

    if (!dni) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debe enviar DNI en la URL',
        })
    }

    // Find user by DNI with deep nested relations
    const usuario = await prisma.usuarios.findUnique({
        where: { dni },
        include: {
            pacientes: {
                include: {
                    empresas: true,
                    admisiones: {
                        orderBy: { fecha: 'desc' },
                        include: {
                            citas: true,
                            facturas: true,
                            archivos_historia: true, // Include attached files
                            concepto_aptitud: true,
                            ordenes_examenes: {
                                include: {
                                    examenes: true,
                                    resultados_lab: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    if (!usuario || usuario.pacientes.length === 0) {
        return { ok: false, found: false, message: 'No se encontró historia para ese DNI' }
    }

    // We assume the most relevant patient profile is the first one (or the only one)
    // In a multi-role system, we might need logic to pick the right "paciente" record, 
    // but typically a user has one patient profile.
    const pacienteData = usuario.pacientes[0]

    // Format the response
    const paciente = {
        id: pacienteData.id,
        nombre: usuario.nombre,
        apellidos: pacienteData.apellidos, // From pacientes table now
        nombre_completo: `${usuario.nombre} ${pacienteData.apellidos || ''}`.trim(),
        dni: usuario.dni,
        correo: usuario.correo,
        fecha_nacimiento: pacienteData.fecha_nac,
        sexo: pacienteData.sexo,
        tipo_sangre: pacienteData.tipo_sangre,
        alergias: pacienteData.alergias,
        empresa: pacienteData.empresas ? {
            id: pacienteData.empresas.id,
            razon_social: pacienteData.empresas.razon_social
        } : null
    }

    const historia = pacienteData.admisiones.map(adm => ({
        id: adm.id,
        fecha: adm.fecha,
        tipo_examen: adm.tipo_examen,
        estado: adm.estado,
        observaciones: adm.observaciones,
        archivos: adm.archivos_historia,
        aptitud: adm.concepto_aptitud,
        cita: adm.citas[0] || null
    }))

    return {
        ok: true,
        found: true,
        paciente,
        historia
    }
})

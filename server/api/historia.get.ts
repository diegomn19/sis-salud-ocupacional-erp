// server/api/historia.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'


interface PacienteRow {
    id: string
    nombre: string
    apellidos: string
    dni: string
    empresa: string | null
}

interface AdmisionRow {
    id: string
    fecha: string
    tipo_examen: string
    estado: string
}

interface ArchivoRow {
    id: string
    admision_id: string
    nombre: string
    url: string
}

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const dni = q.dni?.toString() || ''

    if (!dni) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes enviar el DNI en la query (?dni=...)'
        })
    }

    // Join con usuarios y empresas para obtener datos reales
    const pacientes = await query<PacienteRow>(
        `SELECT 
       p.id, 
       u.nombre, 
       '' as apellidos, 
       u.dni, 
       e.razon_social as empresa 
     FROM pacientes p
     JOIN usuarios u ON p.usuario_id = u.id
     LEFT JOIN empresas e ON p.empresa_id = e.id
     WHERE u.dni = $1`,
        [dni]
    )

    if (!pacientes.length) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Paciente no encontrado'
        })
    }

    // 👇 Aquí forzamos a TS a entender que NO es undefined
    const paciente: PacienteRow = pacientes[0]!

    const admisiones = await query<AdmisionRow>(
        'SELECT id, fecha, tipo_examen, estado FROM admisiones WHERE paciente_id = $1 ORDER BY fecha DESC',
        [paciente.id]
    )

    const archivos = await query<ArchivoRow>(
        `SELECT a.id, a.admision_id, a.nombre, a.url 
         FROM archivos_historia a
         JOIN admisiones ad ON a.admision_id = ad.id
         WHERE ad.paciente_id = $1`,
        [paciente.id]
    )

    const admisionesConArchivos = admisiones.map((a) => ({
        ...a,
        archivos: archivos.filter((f) => f.admision_id === a.id)
    }))

    return {
        paciente,
        admisiones: admisionesConArchivos
    }
})

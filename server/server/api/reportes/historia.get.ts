import { defineEventHandler, getQuery, createError } from 'h3'


export default defineEventHandler(async (event) => {
    const { dni } = getQuery(event)

    if (!dni) {
        throw createError({
            statusCode: 400,
            statusMessage: 'dni es requerido'
        })
    }

    const clinica = {
        nombre: 'Centro Médico Ocupacional San José',
        ruc: '20123456789',
        direccion: 'Av. Los Héroes 123, Lima',
        telefono: '(01) 234-5678'
    }

    // Buscar paciente
    const userData = await query(`
    SELECT 
      u.id,
      u.nombre,
      u.dni,
      u.fecha_nacimiento,
      u.correo,
      u.telefono,
      u.direccion,
      CASE WHEN u.sexo = 'M' THEN 'Masculino' ELSE 'Femenino' END as sexo,
      EXTRACT(YEAR FROM AGE(u.fecha_nacimiento)) as edad,
      p.id as paciente_id
    FROM usuario u
    LEFT JOIN pacientes p ON p.usuario_id = u.id
    WHERE u.dni = $1
  `, [dni])

    if (!userData || !userData[0] || !userData[0].paciente_id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Paciente no encontrado'
        })
    }

    const user = userData[0]

    // Consultar admisiones del paciente
    const admisiones = await query(`
    SELECT 
      a.id,
      a.fecha,
      a.tipo_examen,
      a.estado,
      e.razon_social as empresa
    FROM admisiones a
    LEFT JOIN pacientes p ON a.paciente_id = p.id
    LEFT JOIN empresas e ON p.empresa_id = e.id
    WHERE a.paciente_id = $1
    ORDER BY a.fecha DESC
  `, [user.paciente_id])

    const data = {
        clinica,
        paciente: {
            nombreCompleto: user.nombre,
            dni: user.dni,
            fechaNacimiento: new Date(user.fecha_nacimiento).toLocaleDateString('es-PE'),
            edad: user.edad,
            sexo: user.sexo,
            direccion: user.direccion || '-',
            telefono: user.telefono || '-'
        },
        empresa: {
            razonSocial: admisiones[0]?.empresa || '',
            ruc: ''
        },
        resumen: {
            totalAdmisiones: admisiones.length,
            primeraAtencion: admisiones.length > 0 ? new Date(admisiones[admisiones.length - 1].fecha).toLocaleDateString('es-PE') : '-',
            ultimaAtencion: admisiones.length > 0 ? new Date(admisiones[0].fecha).toLocaleDateString('es-PE') : '-'
        },
        admisiones: admisiones.map((a: any) => ({
            fecha: new Date(a.fecha).toLocaleDateString('es-PE'),
            tipo_examen: a.tipo_examen,
            empresa: a.empresa || 'Particular',
            resultado: a.estado === 'COMPLETADO' ? 'APTO' : '-',
            estado: a.estado,
            medico: 'Dr. Juan Pérez'
        })),
        generado: {
            usuario: 'Administrador',
            fechaHora: new Date().toLocaleString('es-PE')
        }
    }

    const html = await compileTemplate('historia-resumen', data)
    const pdfBuffer = await htmlToPdfBuffer(html)

    event.node.res.setHeader('Content-Type', 'application/pdf')
    event.node.res.setHeader('Content-Disposition', `attachment; filename="historia-clinica-${dni}.pdf"`)

    return pdfBuffer
})

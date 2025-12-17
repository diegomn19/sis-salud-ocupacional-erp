import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tipo = query.tipo as string || 'admisiones'

    let csv = ''
    let filename = ''

    if (tipo === 'admisiones') {
        const admisiones = await prisma.admisiones.findMany({
            include: {
                pacientes: {
                    include: {
                        usuarios: { select: { nombre: true, dni: true } },
                        empresas: { select: { razon_social: true } }
                    }
                }
            },
            orderBy: { fecha: 'desc' }
        })

        csv = 'Fecha,Paciente,DNI,Empresa,Tipo Examen,Estado\n'
        csv += admisiones.map(a =>
            `"${new Date(a.fecha).toLocaleDateString('es-PE')}","${a.pacientes?.usuarios?.nombre || ''}","${a.pacientes?.usuarios?.dni || ''}","${a.pacientes?.empresas?.razon_social || 'Particular'}","${a.tipo_examen || ''}","${a.estado || 'PENDIENTE'}"`
        ).join('\n')

        filename = 'admisiones.csv'
    } else if (tipo === 'pacientes') {
        const pacientes = await prisma.pacientes.findMany({
            include: {
                usuarios: { select: { nombre: true, dni: true, correo: true } },
                empresas: { select: { razon_social: true } }
            }
        })

        csv = 'Nombre,DNI,Email,Empresa,Fecha Nacimiento,Sexo,Telefono\n'
        csv += pacientes.map(p =>
            `"${p.usuarios?.nombre || ''}","${p.usuarios?.dni || ''}","${p.usuarios?.correo || ''}","${p.empresas?.razon_social || 'Particular'}","${p.fecha_nac ? new Date(p.fecha_nac).toLocaleDateString('es-PE') : ''}","${p.sexo || ''}","${p.telefono || ''}"`
        ).join('\n')

        filename = 'pacientes.csv'
    } else {
        return { error: 'Tipo no válido' }
    }

    // Add BOM for Excel compatibility
    const bom = '\uFEFF'

    setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
    return bom + csv
})

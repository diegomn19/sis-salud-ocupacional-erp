import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Count admissions by date range
    const [hoy, semana, mes, total] = await Promise.all([
        prisma.admisiones.count({ where: { fecha: { gte: startOfToday } } }),
        prisma.admisiones.count({ where: { fecha: { gte: startOfWeek } } }),
        prisma.admisiones.count({ where: { fecha: { gte: startOfMonth } } }),
        prisma.admisiones.count()
    ])

    // Count by estado
    const estadoCounts = await prisma.admisiones.groupBy({
        by: ['estado'],
        _count: { id: true }
    })

    const porEstado = {
        PROGRAMADO: 0,
        CONFIRMADO: 0,
        EN_PROCESO: 0,
        COMPLETADO: 0,
        CANCELADO: 0,
        PENDIENTE: 0
    }
    estadoCounts.forEach((e) => {
        const key = e.estado?.toUpperCase() || 'PENDIENTE'
        if (key in porEstado) {
            porEstado[key as keyof typeof porEstado] = e._count.id
        }
    })

    // Count by tipo_examen (top 5)
    const tipoExamenCounts = await prisma.admisiones.groupBy({
        by: ['tipo_examen'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
    })
    const porTipoExamen = tipoExamenCounts.map((t) => ({
        tipo: t.tipo_examen || 'Sin tipo',
        count: t._count.id
    }))

    // Count by empresa (top 5)
    const admisionesConEmpresa = await prisma.admisiones.findMany({
        select: {
            pacientes: {
                select: {
                    empresas: { select: { razon_social: true } }
                }
            }
        }
    })

    const empresaMap: Record<string, number> = {}
    admisionesConEmpresa.forEach((a) => {
        const nombre = a.pacientes?.empresas?.razon_social || 'Particular'
        empresaMap[nombre] = (empresaMap[nombre] || 0) + 1
    })
    const porEmpresa = Object.entries(empresaMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([empresa, count]) => ({ empresa, count }))

    // Totals for dashboard cards
    const totalPacientes = await prisma.pacientes.count()
    const totalConceptos = await prisma.concepto_aptitud.count()

    // Ingresos del mes
    const ingresosRes = await prisma.facturas.aggregate({
        _sum: { total: true }
    })
    const totalIngresos = ingresosRes._sum.total ? Number(ingresosRes._sum.total) : 0

    // Recent admissions (last 5)
    const recentAdmissions = await prisma.admisiones.findMany({
        take: 5,
        orderBy: { fecha: 'desc' },
        include: {
            pacientes: {
                include: { usuarios: { select: { nombre: true, dni: true } } }
            }
        }
    })

    const admisionesRecientes = recentAdmissions.map((a) => {
        const nombre = a.pacientes?.usuarios?.nombre || 'Sin nombre'
        const iniciales = nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        return {
            id: a.id,
            paciente: nombre,
            dni: a.pacientes?.usuarios?.dni || '',
            fecha: a.fecha.toISOString(),
            estado: a.estado?.toLowerCase() || 'pendiente',
            estadoLabel: a.estado || 'Pendiente',
            iniciales
        }
    })

    return {
        resumen: { hoy, semana, mes, total },
        porEstado,
        porTipoExamen,
        porEmpresa,
        dashboard: {
            pacientes: totalPacientes,
            admisiones: total,
            conceptos: totalConceptos,
            ingresos: totalIngresos,
            pendientes: porEstado.PENDIENTE,
            programadas: porEstado.PROGRAMADO,
            completadas: porEstado.COMPLETADO
        },
        admisionesRecientes
    }
})

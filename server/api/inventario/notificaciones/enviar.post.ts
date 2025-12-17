import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { tipo } = body // 'BAJO_STOCK' | 'GENERAL'

    if (!['BAJO_STOCK', 'GENERAL'].includes(tipo)) {
        throw createError({ statusCode: 400, statusMessage: 'Tipo de reporte inválido' })
    }

    let productos = []
    let tituloReporte = ''

    if (tipo === 'BAJO_STOCK') {
        tituloReporte = 'Reporte de Bajo Stock'
        // Prisma doesn't support direct comparison of two columns (stock_actual <= stock_min) in `where` easily in all versions without raw query or extensions, 
        // but for now we can fetch all and filter or use raw query.
        // Given the schema, let's try raw query for efficiency or just fetch all since inventory isn't huge yet.
        // Actually, let's fetch all and filter in JS for safety and simplicity unless dataset is massive.
        const allProds = await prisma.productos.findMany()
        productos = allProds.filter(p => p.stock_actual <= (p.stock_min || 0))
    } else {
        tituloReporte = 'Reporte General de Inventario'
        productos = await prisma.productos.findMany()
    }

    // Send to n8n
    const webhookUrl = process.env.N8N_INVENTARIO_WEBHOOK || 'http://localhost:5678/webhook/inventario/reporte'

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo,
                titulo: tituloReporte,
                fecha: new Date(),
                productos: productos.map(p => ({
                    nombre: p.nombre,
                    stockActual: p.stock_actual,
                    stockMinimo: p.stock_min,
                    estado: p.stock_actual <= (p.stock_min || 0) ? 'CRÍTICO' : 'OK'
                }))
            })
        })
    } catch (e) {
        console.error('Error enviando a n8n:', e)
        return { ok: false, message: 'Error conectando con servicio de notificaciones' }
    }

    return {
        ok: true,
        message: `Notificación enviada con ${productos.length} productos.`
    }
})

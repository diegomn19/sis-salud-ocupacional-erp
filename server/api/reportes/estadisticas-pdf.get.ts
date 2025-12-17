import { defineEventHandler, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
        totalPacientes,
        totalAdmisiones,
        admisionesMes,
        totalConceptos,
        conceptosAptos,
        totalFacturas,
        ingresosMes
    ] = await Promise.all([
        prisma.pacientes.count(),
        prisma.admisiones.count(),
        prisma.admisiones.count({ where: { fecha: { gte: startOfMonth } } }),
        prisma.concepto_aptitud.count(),
        prisma.concepto_aptitud.count({ where: { resultado: 'APTO' } }),
        prisma.facturas.count(),
        prisma.facturas.aggregate({ _sum: { total: true } })
    ])

    const estadoCounts = await prisma.admisiones.groupBy({
        by: ['estado'],
        _count: { id: true }
    })

    const tipoExamenCounts = await prisma.admisiones.groupBy({
        by: ['tipo_examen'],
        _count: { id: true }
    })

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Estadísticas Generales del Sistema</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
    h1 { color: #0891b2; font-size: 18px; margin-bottom: 5px; }
    .subtitle { color: #666; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
    .card { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; }
    .card h2 { margin: 0; font-size: 24px; color: #0891b2; }
    .card p { margin: 5px 0 0; color: #666; }
    h3 { color: #0891b2; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #0891b2; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
    @media print { body { margin: 20px; } .grid { grid-template-columns: repeat(3, 1fr); } }
  </style>
</head>
<body>
  <h1>Estadísticas Generales del Sistema</h1>
  <p class="subtitle">Generado el ${new Date().toLocaleString('es-PE')}</p>
  
  <div class="grid">
    <div class="card">
      <h2>${totalPacientes}</h2>
      <p>Pacientes Registrados</p>
    </div>
    <div class="card">
      <h2>${totalAdmisiones}</h2>
      <p>Admisiones Totales</p>
    </div>
    <div class="card">
      <h2>${admisionesMes}</h2>
      <p>Admisiones Este Mes</p>
    </div>
    <div class="card">
      <h2>${totalConceptos}</h2>
      <p>Conceptos Emitidos</p>
    </div>
    <div class="card">
      <h2>${conceptosAptos}</h2>
      <p>Aptos</p>
    </div>
    <div class="card">
      <h2>S/ ${Number(ingresosMes._sum.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</h2>
      <p>Ingresos Totales</p>
    </div>
  </div>

  <h3>Admisiones por Estado</h3>
  <table>
    <thead><tr><th>Estado</th><th>Cantidad</th></tr></thead>
    <tbody>
      ${estadoCounts.map(e => `<tr><td>${e.estado || 'PENDIENTE'}</td><td>${e._count.id}</td></tr>`).join('')}
    </tbody>
  </table>

  <h3>Admisiones por Tipo de Examen</h3>
  <table>
    <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
    <tbody>
      ${tipoExamenCounts.map(t => `<tr><td>${t.tipo_examen || 'Sin tipo'}</td><td>${t._count.id}</td></tr>`).join('')}
    </tbody>
  </table>
  
  <p class="footer">
    Sistema de Salud Laboral<br>
    <small>Para guardar como PDF: Ctrl+P → Guardar como PDF</small>
  </p>
</body>
</html>
  `

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
})

import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const mes = query.mes as string || new Date().toISOString().slice(0, 7)

    const [year, month] = mes.split('-').map(Number)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const facturas = await prisma.facturas.findMany({
        include: {
            admisiones: {
                include: {
                    pacientes: {
                        include: {
                            usuarios: { select: { nombre: true } },
                            empresas: { select: { razon_social: true } }
                        }
                    }
                }
            }
        }
    })

    // Filter by date through admisiones
    const facturasFiltradas = facturas.filter(f => {
        if (!f.admisiones?.fecha) return false
        const fecha = new Date(f.admisiones.fecha)
        return fecha >= startDate && fecha <= endDate
    })

    const total = facturasFiltradas.reduce((sum, f) => sum + (Number(f.total) || 0), 0)

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reporte de Ingresos - ${mes}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
    h1 { color: #d97706; font-size: 18px; margin-bottom: 5px; }
    .subtitle { color: #666; margin-bottom: 20px; }
    .summary { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .summary h2 { margin: 0; color: #92400e; font-size: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #d97706; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
    .total { text-align: right; font-weight: bold; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Reporte de Ingresos</h1>
  <p class="subtitle">Mes: ${mes} | Facturas: ${facturasFiltradas.length}</p>
  
  <div class="summary">
    <p>Total del Mes</p>
    <h2>S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</h2>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Serie-Correlativo</th>
        <th>Paciente</th>
        <th>Empresa</th>
        <th>Estado SUNAT</th>
        <th class="total">Total</th>
      </tr>
    </thead>
    <tbody>
      ${facturasFiltradas.map(f => `
        <tr>
          <td>${f.serie || '-'}-${f.correlativo || '-'}</td>
          <td>${f.admisiones?.pacientes?.usuarios?.nombre || '-'}</td>
          <td>${f.admisiones?.pacientes?.empresas?.razon_social || 'Particular'}</td>
          <td>${f.estado_sunat || 'PENDIENTE'}</td>
          <td class="total">S/ ${Number(f.total || 0).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <p class="footer">
    Sistema de Salud Laboral - Generado el ${new Date().toLocaleString('es-PE')}<br>
    <small>Para guardar como PDF: Ctrl+P → Guardar como PDF</small>
  </p>
</body>
</html>
  `

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    setHeader(event, 'Content-Disposition', `inline; filename="ingresos-${mes}.html"`)
    return html
})

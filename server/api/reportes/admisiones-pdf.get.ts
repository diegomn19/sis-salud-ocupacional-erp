import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const desde = query.desde as string || new Date().toISOString().slice(0, 10)
    const hasta = query.hasta as string || new Date().toISOString().slice(0, 10)

    const admisiones = await prisma.admisiones.findMany({
        where: {
            fecha: {
                gte: new Date(desde),
                lte: new Date(hasta + 'T23:59:59')
            }
        },
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

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reporte de Admisiones</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
    h1 { color: #1e40af; font-size: 18px; margin-bottom: 5px; }
    .subtitle { color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #1e40af; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
    .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; }
    .pendiente { background: #fef3c7; color: #92400e; }
    .completado { background: #d1fae5; color: #065f46; }
  </style>
</head>
<body>
  <h1>Reporte de Admisiones</h1>
  <p class="subtitle">Período: ${desde} al ${hasta} | Total: ${admisiones.length} registros</p>
  
  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Paciente</th>
        <th>DNI</th>
        <th>Empresa</th>
        <th>Tipo Examen</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${admisiones.map(a => `
        <tr>
          <td>${new Date(a.fecha).toLocaleDateString('es-PE')}</td>
          <td>${a.pacientes?.usuarios?.nombre || '-'}</td>
          <td>${a.pacientes?.usuarios?.dni || '-'}</td>
          <td>${a.pacientes?.empresas?.razon_social || 'Particular'}</td>
          <td>${a.tipo_examen || '-'}</td>
          <td><span class="badge ${(a.estado || '').toLowerCase()}">${a.estado || 'PENDIENTE'}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <p class="footer">
    Sistema de Salud Laboral - Generado el ${new Date().toLocaleString('es-PE')}
  </p>
</body>
</html>
  `

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
})

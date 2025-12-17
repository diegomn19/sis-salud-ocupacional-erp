import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const empresaId = query.empresaId as string

    const where: any = {}
    if (empresaId) {
        where.pacientes = { empresa_id: empresaId }
    }

    const admisiones = await prisma.admisiones.findMany({
        where,
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

    const empresaNombre = admisiones[0]?.pacientes?.empresas?.razon_social || 'Todas las Empresas'

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reporte por Empresa - ${empresaNombre}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
    h1 { color: #7c3aed; font-size: 18px; margin-bottom: 5px; }
    .subtitle { color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #7c3aed; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f9f9f9; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Reporte por Empresa</h1>
  <p class="subtitle">Empresa: ${empresaNombre} | Total: ${admisiones.length} admisiones</p>
  
  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Paciente</th>
        <th>DNI</th>
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
          <td>${a.tipo_examen || '-'}</td>
          <td>${a.estado || 'PENDIENTE'}</td>
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
    return html
})

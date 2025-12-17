import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const id = query.id as string

    if (!id) {
        return { error: 'ID de factura requerido' }
    }

    const factura = await prisma.facturas.findUnique({
        where: { id },
        include: {
            admisiones: {
                include: {
                    pacientes: {
                        include: {
                            usuarios: { select: { nombre: true, dni: true } },
                            empresas: { select: { razon_social: true, ruc: true } }
                        }
                    }
                }
            }
        }
    })

    if (!factura) {
        return { error: 'Factura no encontrada' }
    }

    const paciente = factura.admisiones?.pacientes
    const empresa = paciente?.empresas

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Factura ${factura.serie}-${factura.correlativo}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
    .header { border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #1e40af; margin: 0; font-size: 24px; }
    .company { float: right; text-align: right; }
    .company-name { font-size: 18px; font-weight: bold; color: #333; }
    .invoice-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .label { font-weight: bold; color: #333; }
    .value { color: #555; }
    .client-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .client-box h3 { margin: 0 0 10px; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #1e40af; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .totals { text-align: right; }
    .totals .total-row { font-size: 18px; font-weight: bold; color: #1e40af; }
    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      <div class="company-name">Sistema de Salud Laboral</div>
      <div>RUC: 20123456789</div>
    </div>
    <h1>FACTURA ELECTRÓNICA</h1>
    <p>${factura.serie}-${factura.correlativo}</p>
  </div>

  <div class="invoice-info">
    <div class="row"><span class="label">Fecha de Emisión:</span><span class="value">${factura.admisiones?.fecha ? new Date(factura.admisiones.fecha).toLocaleDateString('es-PE') : new Date().toLocaleDateString('es-PE')}</span></div>
    <div class="row"><span class="label">Estado SUNAT:</span><span class="value">${factura.estado_sunat || 'PENDIENTE'}</span></div>
  </div>

  <div class="client-box">
    <h3>Cliente</h3>
    <div class="row"><span class="label">Nombre:</span><span class="value">${paciente?.usuarios?.nombre || 'Cliente General'}</span></div>
    <div class="row"><span class="label">DNI:</span><span class="value">${paciente?.usuarios?.dni || '-'}</span></div>
    <div class="row"><span class="label">Empresa:</span><span class="value">${empresa?.razon_social || 'Particular'}</span></div>
    <div class="row"><span class="label">RUC Empresa:</span><span class="value">${empresa?.ruc || '-'}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Cantidad</th>
        <th>P. Unitario</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Examen Ocupacional - ${factura.admisiones?.tipo_examen || 'General'}</td>
        <td>1</td>
        <td>S/ ${Number(factura.total || 0).toFixed(2)}</td>
        <td>S/ ${Number(factura.total || 0).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <p>Subtotal: S/ ${(Number(factura.total || 0) / 1.18).toFixed(2)}</p>
    <p>IGV (18%): S/ ${(Number(factura.total || 0) - Number(factura.total || 0) / 1.18).toFixed(2)}</p>
    <p class="total-row">TOTAL: S/ ${Number(factura.total || 0).toFixed(2)}</p>
  </div>

  <p class="footer">
    Documento generado electrónicamente<br>
    <small>Para guardar: Ctrl+P → Guardar como PDF</small>
  </p>
</body>
</html>
  `

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
})

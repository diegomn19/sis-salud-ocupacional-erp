import { defineEventHandler, getQuery, setHeader } from 'h3'
import prisma from '../../utils/prisma'

// API for generating concepto de aptitud PDF (called by n8n workflow)
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const conceptoId = query.conceptoId as string

    if (!conceptoId) {
        return { error: 'conceptoId required' }
    }

    const concepto = await prisma.concepto_aptitud.findUnique({
        where: { id: conceptoId },
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
            },
            usuarios: { select: { nombre: true } }
        }
    })

    if (!concepto) {
        return { error: 'Concepto not found' }
    }

    const paciente = concepto.admisiones?.pacientes
    const empresa = paciente?.empresas

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificado de Aptitud Ocupacional</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
    .header h1 { color: #1e40af; margin: 0; font-size: 24px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #1e40af; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
    .row { display: flex; margin-bottom: 8px; }
    .label { width: 150px; font-weight: bold; color: #333; }
    .value { flex: 1; color: #555; }
    .result { text-align: center; padding: 20px; margin: 20px 0; border-radius: 10px; }
    .result.apto { background: #d1fae5; color: #065f46; }
    .result.no_apto { background: #fee2e2; color: #991b1b; }
    .result.observado { background: #fef3c7; color: #92400e; }
    .result h2 { margin: 0; font-size: 28px; }
    .signature { margin-top: 60px; text-align: center; }
    .signature-line { border-top: 1px solid #333; width: 200px; margin: 0 auto; padding-top: 5px; }
    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CERTIFICADO DE APTITUD OCUPACIONAL</h1>
    <p>Sistema de Salud Laboral</p>
  </div>

  <div class="section">
    <h2>Datos del Trabajador</h2>
    <div class="row"><span class="label">Nombre:</span><span class="value">${paciente?.usuarios?.nombre || '-'}</span></div>
    <div class="row"><span class="label">DNI:</span><span class="value">${paciente?.usuarios?.dni || '-'}</span></div>
    <div class="row"><span class="label">Empresa:</span><span class="value">${empresa?.razon_social || 'Particular'}</span></div>
    <div class="row"><span class="label">RUC Empresa:</span><span class="value">${empresa?.ruc || '-'}</span></div>
  </div>

  <div class="section">
    <h2>Datos del Examen</h2>
    <div class="row"><span class="label">Tipo de Examen:</span><span class="value">${concepto.admisiones?.tipo_examen || '-'}</span></div>
    <div class="row"><span class="label">Fecha de Examen:</span><span class="value">${concepto.admisiones?.fecha ? new Date(concepto.admisiones.fecha).toLocaleDateString('es-PE') : '-'}</span></div>
    <div class="row"><span class="label">Fecha de Emisión:</span><span class="value">${concepto.firmado_en ? new Date(concepto.firmado_en).toLocaleDateString('es-PE') : new Date().toLocaleDateString('es-PE')}</span></div>
  </div>

  <div class="result ${(concepto.resultado || 'PENDIENTE').toLowerCase().replace(' ', '_')}">
    <h2>${concepto.resultado || 'PENDIENTE'}</h2>
  </div>

  <div class="signature">
    <div class="signature-line">
      ${concepto.usuarios?.nombre || 'Médico Ocupacional'}
    </div>
    <p>Médico Ocupacional</p>
  </div>

  <p class="footer">
    Documento generado electrónicamente - ${new Date().toLocaleString('es-PE')}
  </p>
</body>
</html>
  `

    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return html
})

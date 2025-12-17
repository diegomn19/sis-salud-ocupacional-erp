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
    const fecha = factura.admisiones?.fecha ? new Date(factura.admisiones.fecha).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    const subtotal = (Number(factura.total || 0) / 1.18).toFixed(2)
    const igv = (Number(factura.total || 0) - Number(factura.total || 0) / 1.18).toFixed(2)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <UBLVersionID>2.1</UBLVersionID>
  <ID>${factura.serie}-${factura.correlativo}</ID>
  <IssueDate>${fecha}</IssueDate>
  <InvoiceTypeCode>01</InvoiceTypeCode>
  <DocumentCurrencyCode>PEN</DocumentCurrencyCode>
  
  <AccountingSupplierParty>
    <Party>
      <PartyIdentification>
        <ID schemeID="6">20123456789</ID>
      </PartyIdentification>
      <PartyLegalEntity>
        <RegistrationName>Sistema de Salud Laboral S.A.C.</RegistrationName>
      </PartyLegalEntity>
    </Party>
  </AccountingSupplierParty>

  <AccountingCustomerParty>
    <Party>
      <PartyIdentification>
        <ID schemeID="${empresa?.ruc ? '6' : '1'}">${empresa?.ruc || paciente?.usuarios?.dni || '00000000'}</ID>
      </PartyIdentification>
      <PartyLegalEntity>
        <RegistrationName>${empresa?.razon_social || paciente?.usuarios?.nombre || 'Cliente General'}</RegistrationName>
      </PartyLegalEntity>
    </Party>
  </AccountingCustomerParty>

  <TaxTotal>
    <TaxAmount currencyID="PEN">${igv}</TaxAmount>
    <TaxSubtotal>
      <TaxableAmount currencyID="PEN">${subtotal}</TaxableAmount>
      <TaxAmount currencyID="PEN">${igv}</TaxAmount>
      <TaxCategory>
        <TaxScheme>
          <ID>1000</ID>
          <Name>IGV</Name>
        </TaxScheme>
      </TaxCategory>
    </TaxSubtotal>
  </TaxTotal>

  <LegalMonetaryTotal>
    <LineExtensionAmount currencyID="PEN">${subtotal}</LineExtensionAmount>
    <TaxInclusiveAmount currencyID="PEN">${Number(factura.total || 0).toFixed(2)}</TaxInclusiveAmount>
    <PayableAmount currencyID="PEN">${Number(factura.total || 0).toFixed(2)}</PayableAmount>
  </LegalMonetaryTotal>

  <InvoiceLine>
    <ID>1</ID>
    <InvoicedQuantity unitCode="NIU">1</InvoicedQuantity>
    <LineExtensionAmount currencyID="PEN">${subtotal}</LineExtensionAmount>
    <Item>
      <Description>Examen Ocupacional - ${factura.admisiones?.tipo_examen || 'General'}</Description>
    </Item>
    <Price>
      <PriceAmount currencyID="PEN">${subtotal}</PriceAmount>
    </Price>
  </InvoiceLine>
</Invoice>`

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="${factura.serie}-${factura.correlativo}.xml"`)
    return xml
})

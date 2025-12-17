
import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { dni } = body

    if (!dni || dni.length !== 8) {
        return { ok: false, message: 'DNI inválido' }
    }

    const config = useRuntimeConfig()
    const apiUrl = config.reniecApiUrl
    const token = config.reniecApiToken

    if (!apiUrl || !token) {
        return { ok: false, message: 'Configuración de RENIEC no encontrada en el servidor' }
    }

    try {
        const response: any = await $fetch(apiUrl, {
            method: 'POST',
            body: {
                token: token,
                type_document: 'dni',
                document_number: dni
            }
        })

        console.log('RENIEC RAW RESPONSE:', JSON.stringify(response, null, 2))

        if (response.success && response.data) {
            return {
                ok: true,
                data: {
                    nombres: response.data.name,
                    apellidos: response.data.surname,
                    nombreCompleto: response.data.full_name,
                    fechaNacimiento: normalizeDate(response.data.date_of_birth || response.data.fecha_nacimiento),
                    direccion: response.data.address || '',
                    ubigeo: response.data.ubigeo || ''
                }
            }
        } else {
            return { ok: false, message: 'No encontrado en RENIEC' }
        }
    } catch (error: any) {
        console.error('Error consultando RENIEC:', error)
        return { ok: false, message: 'Error de conexión con RENIEC' }
    }
})

function normalizeDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    // If YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // If DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split('/');
        return `${y}-${m}-${d}`;
    }
    return dateStr;
}

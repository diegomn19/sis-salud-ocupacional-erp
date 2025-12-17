
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event)
    if (!files || files.length === 0) {
        throw createError({ statusCode: 400, message: 'No files uploaded' })
    }

    const uploadedFiles = []
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    for (const file of files) {
        if (file.filename) {
            const ext = path.extname(file.filename)
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${ext}`
            const filePath = path.join(uploadDir, uniqueName)

            fs.writeFileSync(filePath, file.data)

            uploadedFiles.push({
                nombre: file.filename,
                url: `/uploads/${uniqueName}`,
                mimetype: file.type,
                size: file.data.length
            })
        }
    }

    return { ok: true, files: uploadedFiles }
})

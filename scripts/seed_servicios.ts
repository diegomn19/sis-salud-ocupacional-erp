
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const servicios = [
        { codigo: 'EX001', nombre: 'Examen Pre-Ocupacional', descripcion: 'Evaluación médica completa para ingreso laboral.', precio: 150.00, duracion_min: 45, medico_responsable: 'Dr. Juan Perez' },
        { codigo: 'EX002', nombre: 'Examen Periódico Anual', descripcion: 'Evaluación de seguimiento anual.', precio: 120.00, duracion_min: 30, medico_responsable: 'Dra. Maria Lopez' },
        { codigo: 'EX018', nombre: 'Examen Médico de Tratamiento', descripcion: 'Evaluación especializada de tratamiento.', precio: 259.60, duracion_min: 115, medico_responsable: 'Ana Martínez' }
    ]

    for (const s of servicios) {
        const exists = await prisma.servicios_medicos.findUnique({ where: { codigo: s.codigo } })
        if (!exists) {
            await prisma.servicios_medicos.create({ data: s })
            console.log(`Created service ${s.codigo}`)
        } else {
            console.log(`Service ${s.codigo} already exists`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

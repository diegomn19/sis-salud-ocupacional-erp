import prisma from '../server/utils/prisma'
import * as bcrypt from 'bcrypt'

async function main() {
    const hashed = await bcrypt.hash('admin123', 10)

    await prisma.usuarios.upsert({
        where: { dni: '00000000' },
        update: {},
        create: {
            dni: '00000000',
            nombre: 'Administrador',
            correo: 'admin@demo.com',
            password_hash: hashed,
            rol: 'ADMIN'
        }
    })

    console.log('Usuario ADMIN creado ✔')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

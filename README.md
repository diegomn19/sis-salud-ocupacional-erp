# SisSalud - Sistema de Gestión de Salud Ocupacional

![Nuxt 3](https://img.shields.io/badge/Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Sistema integral de Gestión de Salud Ocupacional y Clínica (SaaS) diseñado para centralizar la administración médica, facturación e inventario en clínicas y centros de salud.

## 📋 Descripción

Este proyecto es una plataforma completa que permite gestionar el flujo de atención de pacientes desde la admisión hasta la facturación, pasando por la atención médica y exámenes de laboratorio. Está construido con **Nuxt 3** para el frontend/backend (SSR) y **Prisma** como ORM para la base de datos PostgreSQL.

### Características Principales

- **🧑‍⚕️ Gestión de Admisiones y Pacientes**: Registro completo, triaje y seguimiento de admisiones.
- **📅 Citas Médicas**: Agendamiento y control de disponibilidad de médicos.
- **🔬 Laboratorio Clínico**: Generación de órdenes de examen, ingreso de resultados y validación médica.
- **💼 Salud Ocupacional**: Emisión de certificados de aptitud y gestión de empresas.
- **💰 Facturación Electrónica (SUNAT)**: Emisión de boletas y facturas, control de estados tributarios.
- **📦 Inventario y Farmacia**: Control de stock, movimientos y alertas de stock mínimo.
- **📂 Historias Clínicas**: Gestión digital de archivos y antecedentes médicos.
- **🔐 Seguridad y Roles**: Sistema de usuarios con roles definidos (Admin, Médico, Recepción).

## 🛠️ Tecnologías

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Gráficos**: [Chart.js](https://www.chartjs.org/)
- **PDFs**: Generación de reportes y resultados en PDF.
- **Validación API**: Zod / H3.

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18+ recomendado)
- PostgreSQL

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd sis-salud
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` basado en el ejemplo y configura tu conexión a la base de datos:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/mi_base_de_datos?schema=public"
   JWT_SECRET="tu_secreto_super_seguro"
   ```

4. **Migrar la base de datos**
   ```bash
   npx prisma migrate dev --name init
   # O si ya tienes la base de datos creada:
   npx prisma db pull
   npx prisma generate
   ```

5. **Sembrar datos iniciales (Seed)**
   ```bash
   npm run seed
   ```

6. **Ejecutar servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia la aplicación en producción.
- `npx prisma studio`: Abre la interfaz visual para gestionar la base de datos.

## 📄 Licencia

[MIT](LICENSE)

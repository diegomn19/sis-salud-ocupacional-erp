-- ==========================================
--   EXTENSIONES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
--   1. TABLA: USUARIOS (RBAC)
-- ==========================================
CREATE TABLE usuarios(
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dni           VARCHAR(15) UNIQUE NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    correo        VARCHAR(120) UNIQUE,
    password_hash TEXT NOT NULL,
    rol           VARCHAR(30) CHECK (rol IN ('ADMIN','ADMISIONES','MEDICO','LAB','PACIENTE')),
    activo        BOOLEAN DEFAULT TRUE,
    creado_en     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_usu_dni ON usuarios(dni);

-- ==========================================
--   2. TABLA: EMPRESAS
-- ==========================================
CREATE TABLE empresas(
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruc           VARCHAR(15) UNIQUE NOT NULL,
    razon_social  VARCHAR(150) NOT NULL,
    contacto      JSONB
);

-- ==========================================
--   3. TABLA: PACIENTES
-- ==========================================
CREATE TABLE pacientes(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id        UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_nac         DATE NOT NULL,
    sexo              CHAR(1) CHECK (sexo IN ('M','F')),
    direccion         VARCHAR(255),
    telefono          VARCHAR(60),
    huella_b64        TEXT,
    empresa_id        UUID REFERENCES empresas(id)
);

-- ==========================================
--   4. TABLA: ADMISIONES
-- ==========================================
CREATE TABLE admisiones(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id     UUID REFERENCES pacientes(id),
    fecha           DATE NOT NULL,
    tipo_examen     VARCHAR(50),
    estado          VARCHAR(30) DEFAULT 'PENDIENTE',
    observaciones   TEXT,
    creado_por      UUID REFERENCES usuarios(id),
    factura_id      UUID UNIQUE
);

-- ==========================================
--   5. TABLA: CITAS
-- ==========================================
CREATE TABLE citas(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id     UUID REFERENCES admisiones(id),
    fecha_hora      TIMESTAMPTZ NOT NULL,
    duracion_min    INT DEFAULT 30,
    medico_id       UUID REFERENCES usuarios(id),
    estado          VARCHAR(20) DEFAULT 'AGENDADO'
);
CREATE INDEX idx_citas_fecha ON citas(fecha_hora);

-- ==========================================
--   6. TABLA: EXAMENES (Catálogo)
-- ==========================================
CREATE TABLE examenes(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre      VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- ==========================================
--   7. TABLA: ORDENES_EXAMENES (Detalle)
-- ==========================================
CREATE TABLE ordenes_examenes(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id     UUID REFERENCES admisiones(id),
    examen_id       UUID REFERENCES examenes(id),
    estado          VARCHAR(30) DEFAULT 'PENDIENTE'
);

-- ==========================================
--   8. TABLA: RESULTADOS LAB
-- ==========================================
CREATE TABLE resultados_lab(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orden_id        UUID REFERENCES ordenes_examenes(id),
    valor           NUMERIC,
    unidad          VARCHAR(20),
    referencia      VARCHAR(60),
    archivo_pdf     TEXT,
    validado_por    UUID REFERENCES usuarios(id),
    fecha_validado  TIMESTAMPTZ
);

-- ==========================================
--   9. TABLA: CONCEPTO APTITUD
-- ==========================================
CREATE TABLE concepto_aptitud(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id     UUID UNIQUE REFERENCES admisiones(id),
    resultado       VARCHAR(20) CHECK (resultado IN ('APTO','APTO CON RESTRICCIONES','NO APTO')),
    pdf_path        TEXT,
    firmado_por     UUID REFERENCES usuarios(id),
    firmado_en      TIMESTAMPTZ
);

-- ==========================================
--   10. TABLA: FACTURAS
-- ==========================================
CREATE TABLE facturas(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id     UUID UNIQUE REFERENCES admisiones(id),
    serie           VARCHAR(10),
    correlativo     INT,
    xml_sunat       TEXT,
    pdf_path        TEXT,
    total           NUMERIC(10,2),
    estado_sunat    VARCHAR(20) DEFAULT 'PENDIENTE'
);

-- ==========================================
--   11. INVENTARIO
-- ==========================================
CREATE TABLE productos(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(150),
    stock_min       INT DEFAULT 10,
    stock_actual    INT NOT NULL
);

CREATE TABLE movimientos_inventario(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id     UUID REFERENCES productos(id),
    cantidad        INT NOT NULL,
    motivo          VARCHAR(100),
    fecha           TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
--   12. AUDITORÍA
-- ==========================================
CREATE TABLE auditoria(
    id          BIGSERIAL PRIMARY KEY,
    tabla       VARCHAR(60),
    operacion   CHAR(1),
    usuario_id  UUID,
    old_row     JSONB,
    new_row     JSONB,
    fecha       TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
--   13. TABLA: ARCHIVOS HISTORIA
-- ==========================================
CREATE TABLE archivos_historia(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id     UUID REFERENCES admisiones(id) ON DELETE CASCADE,
    nombre          VARCHAR(255) NOT NULL,
    url             TEXT NOT NULL,
    size            INT,
    creado_en       TIMESTAMPTZ DEFAULT now()
);

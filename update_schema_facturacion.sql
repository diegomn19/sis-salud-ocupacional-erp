-- Add columns to facturas
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS tipo_comprobante VARCHAR(20) DEFAULT 'Boleta';
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(30) DEFAULT 'Tarjeta';
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS igv DECIMAL(10,2) DEFAULT 0.00;

-- Create servicios_medicos table
CREATE TABLE IF NOT EXISTS servicios_medicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE,
    nombre VARCHAR(150),
    descripcion TEXT,
    precio DECIMAL(10,2),
    duracion_min INT,
    medico_responsable VARCHAR(100)
);

-- Seed some data
INSERT INTO servicios_medicos (codigo, nombre, descripcion, precio, duracion_min, medico_responsable)
VALUES 
('EX001', 'Examen Pre-Ocupacional', 'Evaluación médica completa para ingreso laboral.', 150.00, 45, 'Dr. Juan Perez'),
('EX002', 'Examen Periódico Anual', 'Evaluación de seguimiento anual.', 120.00, 30, 'Dra. Maria Lopez'),
('EX018', 'Examen Médico de Tratamiento', 'Evaluación especializada de tratamiento.', 259.60, 115, 'Ana Martínez')
ON CONFLICT (codigo) DO NOTHING;

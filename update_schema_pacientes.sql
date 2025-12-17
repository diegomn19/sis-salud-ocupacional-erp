-- Add new columns to pacientes table
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS tipo_sangre VARCHAR(10);
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS alergias TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pacientes';

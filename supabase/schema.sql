-- Tabla de Barberos/Sillones
-- Esta tabla representa los 2 sillones disponibles en la barbería
CREATE TABLE IF NOT EXISTS barbers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insertar los 2 barberos por defecto
INSERT INTO barbers (name) VALUES 
  ('Barbero 1'),
  ('Barbero 2')
ON CONFLICT DO NOTHING;

-- Tabla de Citas/Reservas
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(200) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_type VARCHAR(20) NOT NULL DEFAULT 'corte' CHECK (service_type IN ('corte', 'tinte')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_type);

-- Función para verificar disponibilidad de un horario
-- Retorna el número de citas existentes para un horario específico
CREATE OR REPLACE FUNCTION get_appointments_count_for_slot(slot_date TIMESTAMP WITH TIME ZONE)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM appointments
    WHERE DATE_TRUNC('hour', appointment_date) = DATE_TRUNC('hour', slot_date)
      AND EXTRACT(MINUTE FROM appointment_date) = EXTRACT(MINUTE FROM slot_date)
      AND service_type = 'corte'
  );
END;
$$ LANGUAGE plpgsql;

-- Política RLS (Row Level Security) - Permitir lectura pública
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer barberos
CREATE POLICY "Barbers are viewable by everyone"
  ON barbers FOR SELECT
  USING (true);

-- Política: Cualquiera puede leer citas
CREATE POLICY "Appointments are viewable by everyone"
  ON appointments FOR SELECT
  USING (true);

-- Política: Cualquiera puede insertar citas (reservas públicas)
CREATE POLICY "Anyone can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Política: Permitir eliminar citas (para el panel de admin)
-- NOTA: En producción, esto debería estar protegido con autenticación
CREATE POLICY "Anyone can delete appointments"
  ON appointments FOR DELETE
  USING (true);

-- NOTA: Para producción, considera agregar políticas más restrictivas
-- y deshabilitar UPDATE/DELETE para usuarios anónimos si es necesario


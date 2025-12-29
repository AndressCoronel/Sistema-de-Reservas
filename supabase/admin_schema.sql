-- Tabla para fechas bloqueadas
CREATE TABLE IF NOT EXISTS blocked_dates (
  id SERIAL PRIMARY KEY,
  blocked_date DATE NOT NULL UNIQUE,
  reason VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla para horarios especiales (feriados, horarios reducidos, etc.)
CREATE TABLE IF NOT EXISTS schedule_overrides (
  id SERIAL PRIMARY KEY,
  override_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  reason VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(override_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blocked_dates ON blocked_dates(blocked_date);
CREATE INDEX IF NOT EXISTS idx_schedule_overrides ON schedule_overrides(override_date);

-- Políticas RLS para admin (lectura y escritura)
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_overrides ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer fechas bloqueadas (para verificar en el frontend)
CREATE POLICY "Blocked dates are viewable by everyone"
  ON blocked_dates FOR SELECT
  USING (true);

-- Política: Cualquiera puede leer horarios especiales
CREATE POLICY "Schedule overrides are viewable by everyone"
  ON schedule_overrides FOR SELECT
  USING (true);

-- Política: Cualquiera puede insertar/actualizar/eliminar (en producción, esto debería estar protegido)
-- Por ahora lo dejamos abierto para el MVP, pero en producción deberías usar autenticación
CREATE POLICY "Anyone can manage blocked dates"
  ON blocked_dates FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can manage schedule overrides"
  ON schedule_overrides FOR ALL
  USING (true)
  WITH CHECK (true);

-- NOTA IMPORTANTE: En producción, estas políticas deberían estar protegidas con autenticación real.
-- Por ahora, para el MVP, usaremos un password simple en el frontend.


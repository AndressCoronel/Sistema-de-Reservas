-- Script para verificar y corregir la política de DELETE en appointments
-- Ejecuta este script en Supabase SQL Editor si los turnos no se pueden eliminar

-- Primero, eliminar la política existente si existe
DROP POLICY IF EXISTS "Anyone can delete appointments" ON appointments;

-- Crear la política de DELETE nuevamente
CREATE POLICY "Anyone can delete appointments"
  ON appointments FOR DELETE
  USING (true);

-- Verificar que la política se creó correctamente
-- Puedes verificar ejecutando:
-- SELECT * FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Anyone can delete appointments';


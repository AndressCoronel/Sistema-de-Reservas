-- Eliminar todos los barberos existentes para empezar de cero
DELETE FROM barbers;

-- Resetear la secuencia de IDs si es necesario (opcional, depende de la DB)
-- ALTER SEQUENCE barbers_id_seq RESTART WITH 1;

-- Insertar los nuevos barberos
INSERT INTO barbers (name, is_active) VALUES 
('Pilu', true),
('Isaias', true);

-- Verificar
SELECT * FROM barbers;

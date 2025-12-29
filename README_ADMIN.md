# Panel de Administración - Instrucciones

## Configuración Inicial

### 1. Ejecutar el SQL de Administración

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido completo del archivo `supabase/admin_schema.sql`
4. Ejecuta el script (botón "Run")

Esto creará:
- Tabla `blocked_dates` para bloquear fechas específicas
- Tabla `schedule_overrides` para horarios especiales (feriados, horarios reducidos)
- Políticas de seguridad necesarias

### 2. Cambiar la Contraseña de Admin

1. Abre el archivo `app/admin/page.tsx`
2. Busca la línea: `const ADMIN_PASSWORD = 'admin123'`
3. Cambia `'admin123'` por una contraseña segura

## Acceso al Panel

1. Navega a `/admin` en tu aplicación
2. Ingresa la contraseña configurada
3. Accede al panel de administración

## Funcionalidades del Panel

### 1. Turnos Reservados
- Ver todos los turnos reservados
- Filtrar por fecha
- Filtrar por barbero
- Cancelar turnos

### 2. Fechas Bloqueadas
- Bloquear fechas específicas (ej: feriados, mantenimiento)
- Agregar motivo opcional
- Desbloquear fechas

### 3. Horarios Especiales
- Configurar horarios reducidos para días específicos
- Marcar días como "Cerrado"
- Agregar motivo opcional

## Notas de Seguridad

⚠️ **IMPORTANTE**: Este sistema usa autenticación básica con contraseña en el frontend. 

Para producción, considera:
- Implementar autenticación real (Supabase Auth)
- Proteger las políticas RLS en Supabase
- Usar variables de entorno para la contraseña
- Implementar rate limiting

## Uso

### Bloquear una Fecha
1. Ve a la pestaña "Fechas Bloqueadas"
2. Haz clic en "+ Bloquear Fecha"
3. Selecciona la fecha y opcionalmente agrega un motivo
4. Guarda

### Configurar Horario Especial
1. Ve a la pestaña "Horarios Especiales"
2. Haz clic en "+ Agregar Horario Especial"
3. Selecciona la fecha
4. Marca "Cerrado" si no quieres aceptar reservas
5. O configura horario de inicio y fin
6. Opcionalmente agrega un motivo
7. Guarda

### Cancelar un Turno
1. Ve a la pestaña "Turnos Reservados"
2. Encuentra el turno que deseas cancelar
3. Haz clic en "Cancelar Turno"
4. Confirma la acción


# Setup del Proyecto - Sistema de Reservas de Barbería

## Pasos de Configuración

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com) si no tienes una
2. Crea un nuevo proyecto
3. Ve a **Settings > API** y copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`
2. Pega los valores de Supabase en el archivo `.env.local`

### 3. Crear las Tablas en Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido completo del archivo `supabase/schema.sql`
4. Ejecuta el script (botón "Run")

Esto creará:
- Tabla `barbers` con 2 barberos por defecto
- Tabla `appointments` para las reservas
- Índices para optimizar consultas
- Función helper para contar citas por horario
- Políticas RLS (Row Level Security) para acceso público

### 4. Verificar la Instalación

```bash
npm install
npm run dev
```

El proyecto debería estar corriendo en `http://localhost:3000`

## Estructura de la Base de Datos

### Tabla `barbers`
- `id`: ID único del barbero
- `name`: Nombre del barbero
- `created_at`: Timestamp de creación

### Tabla `appointments`
- `id`: ID único de la reserva
- `client_name`: Nombre del cliente
- `client_phone`: Teléfono del cliente
- `appointment_date`: Fecha y hora de la cita
- `barber_id`: ID del barbero asignado (FK a `barbers`)
- `service_type`: Tipo de servicio ('corte' o 'tinte')
- `created_at`: Timestamp de creación

## Lógica de Disponibilidad

- Cada horario tiene capacidad para **2 personas simultáneas** (2 barberos)
- La función `get_appointments_count_for_slot()` cuenta las citas para un horario específico
- Si el conteo es >= 2, el horario está lleno (Gris/Disabled)
- Si el conteo < 2, el horario está disponible (Verde/Clickable)


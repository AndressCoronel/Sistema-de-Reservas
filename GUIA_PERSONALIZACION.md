# 🎨 Guía de Personalización Rápida

## Para Vender a Múltiples Barberías

Esta es una **plantilla/maqueta** lista para personalizar. Solo necesitas modificar **UN SOLO ARCHIVO** para cada cliente.

---

## 📝 Archivo a Modificar: `lib/config.ts`

Este es el **ÚNICO archivo** que necesitas editar para cada barbería cliente.

### 1. Información Básica (Líneas 7-9)

```typescript
barberiaName: 'BARBERÍA',  // Nombre de la barbería
barberiaSlogan: 'El arte de cada corte...',  // Frase principal
barberiaSubtitle: 'Reserva tu turno...',  // Subtítulo
```

### 2. Contacto (Línea 15)

```typescript
whatsappNumber: '1234567890',  // Número de WhatsApp
```

**Formato:** Código país + número sin + ni espacios
- Argentina: `5491123456789`
- Colombia: `573001234567`
- México: `5215512345678`

### 3. Precios (Líneas 20-23)

```typescript
prices: {
  corte: 10000,   // Precio del corte
  tinte: 30000,   // Precio del teñido
},
```

### 4. Colores (Líneas 28-33)

```typescript
colors: {
  primary: '#facc15',      // Color principal (botones)
  primaryHover: '#eab308', // Hover
  secondary: '#1e293b',    // Fondos oscuros
  success: '#10b981',      // Confirmaciones
  danger: '#ef4444',       // Cancelaciones
},
```

### 5. Imágenes (Líneas 38-41)

```typescript
images: {
  background: '/barberia-background.jpg',  // Imagen de fondo
  logo: null,  // Si hay logo: '/logo.png'
},
```

**Pasos:**
1. Coloca la imagen de fondo en `public/barberia-background.jpg`
2. Si hay logo, colócalo en `public/` y actualiza la ruta

### 6. Horarios (Líneas 46-50)

```typescript
schedule: {
  startTime: '09:00',  // Hora de inicio
  endTime: '18:00',    // Hora de fin
  slotDuration: 30,    // Duración de cada turno (minutos)
},
```

### 7. Contraseña Admin (Línea 55)

```typescript
admin: {
  password: 'admin123',  // Cambiar por contraseña segura
},
```

### 8. Mensajes (Líneas 60-67)

```typescript
messages: {
  welcomeTitle: 'BIENVENIDO A',
  reservationButton: 'RESERVAR',
  serviceCorte: 'Corte',
  serviceCorteDescription: 'Turnos de 30 minutos',
  serviceTinte: 'Teñido/Color',
  serviceTinteDescription: 'Duración aproximada: 3 horas',
  cancelationNotice: 'Mensaje de cancelación...',
},
```

---

## 🚀 Proceso de Personalización (5-10 minutos por cliente)

### Paso 1: Copiar el Proyecto
```bash
# Crear una copia del proyecto para cada cliente
cp -r barberia-reservas barberia-cliente-1
cd barberia-cliente-1
```

### Paso 2: Editar Configuración
1. Abre `lib/config.ts`
2. Cambia todos los valores según el cliente
3. Agrega imágenes en `public/`

### Paso 3: Configurar Supabase
1. Crea un nuevo proyecto en Supabase para cada cliente
2. Ejecuta `supabase/schema.sql`
3. Ejecuta `supabase/admin_schema.sql`
4. Actualiza `.env.local` con las nuevas credenciales

### Paso 4: Probar
```bash
npm install
npm run dev
```

### Paso 5: Deploy
- Sube a Vercel/Netlify con las variables de entorno

---

## 📦 Estructura de Archivos para Múltiples Clientes

```
proyectos/
├── barberia-template/          # Plantilla base
├── barberia-cliente-1/         # Cliente 1
│   ├── lib/config.ts           # ⭐ Solo editar esto
│   └── public/
│       └── barberia-background.jpg
├── barberia-cliente-2/         # Cliente 2
│   ├── lib/config.ts           # ⭐ Solo editar esto
│   └── public/
│       └── barberia-background.jpg
└── ...
```

---

## ✅ Checklist por Cliente

- [ ] Copiar proyecto base
- [ ] Editar `lib/config.ts`:
  - [ ] Nombre de barbería
  - [ ] Número de WhatsApp
  - [ ] Precios
  - [ ] Colores (opcional)
  - [ ] Mensajes (opcional)
- [ ] Agregar imagen de fondo en `public/`
- [ ] Agregar logo (si tiene) en `public/`
- [ ] Crear proyecto Supabase nuevo
- [ ] Ejecutar scripts SQL
- [ ] Configurar `.env.local`
- [ ] Probar localmente
- [ ] Deploy a producción

---

## 💡 Tips

1. **Mantén la plantilla base intacta** - Úsala como referencia
2. **Cada cliente = nuevo proyecto Supabase** - No compartas bases de datos
3. **Usa Git** - Un repositorio por cliente o branches separados
4. **Documenta cambios** - Anota qué personalizaste para cada cliente
5. **Colores opcionales** - Si no cambias colores, usa los default

---

## 🎯 Ventajas de Esta Estructura

✅ **Rápido**: 5-10 minutos por cliente  
✅ **Simple**: Solo editar 1 archivo  
✅ **Escalable**: Fácil agregar más clientes  
✅ **Mantenible**: Cambios centralizados  
✅ **Profesional**: Cada cliente tiene su propia instancia  

---

¡Listo para vender! 🚀


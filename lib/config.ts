// ============================================
// CONFIGURACIÓN DE LA BARBERÍA
// ============================================
// Personaliza todos estos valores según la barbería cliente
// Este es el ÚNICO archivo que necesitas modificar para cada cliente

export const config = {
  // ============================================
  // INFORMACIÓN BÁSICA
  // ============================================
  barberiaName: 'BARBERÍA',
  barberiaSlogan: 'El arte de cada corte, la pasión en cada detalle.',
  barberiaSubtitle: 'Reserva tu turno y vive una experiencia única.',

  // ============================================
  // CONTACTO
  // ============================================
  whatsappNumber: '1234567890', // Formato: código país + número sin + ni espacios
  // Ejemplos:
  // Argentina: '5491123456789'
  // Colombia: '573001234567'
  // México: '5215512345678'

  // ============================================
  // PRECIOS DE SERVICIOS
  // ============================================
  prices: {
    corte: 10000,
    tinte: 30000,
  },

  // ============================================
  // DISEÑO Y BRANDING
  // ============================================
  colors: {
    primary: '#facc15',      // Color principal (botón reservar, acentos)
    primaryHover: '#eab308', // Hover del color principal
    secondary: '#1e293b',    // Color secundario (fondos oscuros)
    success: '#10b981',      // Color de éxito (confirmaciones)
    danger: '#ef4444',       // Color de peligro (cancelaciones)
  },

  // ============================================
  // IMÁGENES
  // ============================================
  images: {
    background: '/barberia-background.jpg', // Imagen de fondo de la página principal
    logo: null, // Si tienes logo, colócalo en public/ y pon la ruta aquí (ej: '/logo.png')
  },

  // ============================================
  // HORARIOS DE ATENCIÓN
  // ============================================
  schedule: {
    startTime: '09:00', // Hora de inicio
    endTime: '18:00',   // Hora de fin
    slotDuration: 30,   // Duración de cada turno en minutos
  },

  // ============================================
  // CONFIGURACIÓN DEL SISTEMA
  // ============================================
  admin: {
    password: 'admin123', // ⚠️ CAMBIAR en producción
  },

  // ============================================
  // MENSAJES PERSONALIZABLES
  // ============================================
  messages: {
    welcomeTitle: 'BIENVENIDO A',
    reservationButton: 'RESERVAR',
    serviceCorte: 'Corte',
    serviceCorteDescription: 'Turnos de 30 minutos',
    serviceTinte: 'Teñido/Color',
    serviceTinteDescription: 'Duración aproximada: 3 horas',
    cancelationNotice: 'En caso de necesitar cancelar o modificar tu reserva, por favor comunícate con nosotros a través de WhatsApp.',
  },
}

// ============================================
// NOTAS PARA PERSONALIZACIÓN
// ============================================
// 1. Cambia todos los valores arriba según la barbería
// 2. Agrega la imagen de fondo en public/barberia-background.jpg
// 3. Si hay logo, agrégalo en public/ y actualiza images.logo
// 4. Los colores se pueden cambiar para match con la marca
// 5. Los precios se pueden ajustar fácilmente
// 6. Los horarios se pueden modificar (startTime, endTime, slotDuration)

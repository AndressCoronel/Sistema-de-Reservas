// ============================================
// CONFIGURACIÓN DE LA BARBERÍA
// ============================================

export const config = {
  // ============================================
  // INFORMACIÓN BÁSICA
  // ============================================
  barberiaName: 'IMPERIUM',
  barberiaSlogan: 'Estilo y elegancia en cada corte.',
  barberiaSubtitle: 'Reserva tu turno con los mejores profesionales.',

  // ============================================
  // CONTACTO
  // ============================================
  whatsappNumber: '5491123456789', // ⚠️ ACTUALIZAR CON EL NÚMERO REAL

  // ============================================
  // PRECIOS DE SERVICIOS
  // ============================================
  prices: {
    corte: 10000,
    tinte: 30000,
    barba: 8000,
  },

  // ============================================
  // DISEÑO Y BRANDING
  // ============================================
  colors: {
    primary: '#18181b',      // Zinc 950 (Negro)
    primaryHover: '#27272a', // Zinc 800
    secondary: '#ffffff',    // Blanco
    success: '#10b981',      // Emerald 500
    danger: '#ef4444',       // Red 500
  },

  // ============================================
  // IMÁGENES
  // ============================================
  images: {
    background: '/barberia-background.jpg',
    logo: null,
  },

  // ============================================
  // HORARIOS DE ATENCIÓN
  // ============================================
  schedule: {
    // Turnos partidos: Mañana 9-13, Tarde 17:30-22:30
    ranges: [
      { start: '09:00', end: '13:00' },
      { start: '17:30', end: '22:30' }
    ],
    slotDuration: 30,
    // Fallback values for types that might expect them (optional but safer)
    startTime: '09:00',
    endTime: '22:30'
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
    reservationButton: 'RESERVAR TURNO',
    serviceCorte: 'Corte de Pelo',
    serviceCorteDescription: 'Estilo clásico o moderno',
    serviceTinte: 'Teñido/Color',
    serviceTinteDescription: 'Cambio de look completo',
    cancelationNotice: 'Si necesitas cancelar, por favor avísanos con anticipación.',
  },
}

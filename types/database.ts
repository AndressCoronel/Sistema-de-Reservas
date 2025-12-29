export type ServiceType = 'corte' | 'tinte'

export interface Barber {
  id: number
  name: string
  created_at?: string
}

export interface Appointment {
  id: number
  client_name: string
  client_phone: string
  appointment_date: string
  barber_id: number
  service_type: ServiceType
  created_at?: string
}


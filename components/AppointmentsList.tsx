'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment, Barber } from '@/types/database'

interface AppointmentWithBarber extends Appointment {
  barber?: Barber
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<AppointmentWithBarber[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState<string>('')
  const [filterBarber, setFilterBarber] = useState<number | ''>('')
  const [barbers, setBarbers] = useState<Barber[]>([])

  useEffect(() => {
    fetchBarbers()
    fetchAppointments()
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [filterDate, filterBarber])

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('*')
        .order('id')

      if (error) throw error
      setBarbers(data || [])
    } catch (error) {
      console.error('Error fetching barbers:', error)
    }
  }

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })

      if (filterDate) {
        const startOfDay = new Date(filterDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(filterDate)
        endOfDay.setHours(23, 59, 59, 999)

        query = query
          .gte('appointment_date', startOfDay.toISOString())
          .lte('appointment_date', endOfDay.toISOString())
      }

      if (filterBarber) {
        query = query.eq('barber_id', filterBarber)
      }

      const { data, error } = await query

      if (error) throw error

      // Obtener información de barberos
      const appointmentsWithBarber = await Promise.all(
        (data || []).map(async (appointment) => {
          if (appointment.barber_id) {
            const { data: barberData } = await supabase
              .from('barbers')
              .select('*')
              .eq('id', appointment.barber_id)
              .single()

            return { ...appointment, barber: barberData || undefined }
          }
          return appointment
        })
      )

      setAppointments(appointmentsWithBarber)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      alert('Error al cargar los turnos')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      return
    }

    // Guardar el ID para referencia
    const appointmentId = id

    // Actualizar la lista inmediatamente (optimistic update)
    setAppointments(prev => prev.filter(app => app.id !== appointmentId))
    setLoading(true)

    try {
      // Intentar eliminar
      const { error, data } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (error) {
        console.error('Error details:', error)
        // Si hay error, restaurar el turno en la lista
        await fetchAppointments()
        throw error
      }

      // Esperar un momento para que Supabase procese la eliminación
      await new Promise(resolve => setTimeout(resolve, 300))

      // Refrescar desde la base de datos para confirmar
      await fetchAppointments()
      
      alert('Turno cancelado exitosamente')
    } catch (error: any) {
      console.error('Error canceling appointment:', error)
      
      // Restaurar la lista completa desde la BD
      await fetchAppointments()
      
      // Mostrar error más específico
      if (error.code === '42501') {
        alert('Error: No tienes permisos para eliminar turnos. Ejecuta el script fix_delete_policy.sql en Supabase.')
      } else if (error.message) {
        alert(`Error al cancelar el turno: ${error.message}`)
      } else {
        alert('Error al cancelar el turno. Por favor, verifica la consola para más detalles.')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600">Cargando turnos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Turnos Reservados</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Filtrar por Fecha
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Filtrar por Barbero
            </label>
            <select
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
            >
              <option value="">Todos los barberos</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            No hay turnos reservados
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border-2 border-slate-200 rounded-lg p-4 md:p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-lg text-slate-900">
                          {appointment.client_name}
                        </p>
                        <p className="text-sm text-slate-600">{appointment.client_phone}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        ID: #{appointment.id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-600">Fecha:</span>{' '}
                        <span className="font-semibold text-slate-900">
                          {formatDate(appointment.appointment_date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Hora:</span>{' '}
                        <span className="font-semibold text-slate-900">
                          {formatTime(appointment.appointment_date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Servicio:</span>{' '}
                        <span className="font-semibold text-slate-900 capitalize">
                          {appointment.service_type}
                        </span>
                      </div>
                      {appointment.barber && (
                        <div>
                          <span className="text-slate-600">Barbero:</span>{' '}
                          <span className="font-semibold text-slate-900">
                            {appointment.barber.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    Cancelar Turno
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


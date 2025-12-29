'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TimeSlotGrid from '@/components/TimeSlotGrid'
import AppointmentForm from '@/components/AppointmentForm'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import type { Barber } from '@/types/database'

interface SelectedSlot {
  date: Date
  time: string
}

export default function ReservarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBarbers()
  }, [])

  const fetchBarbers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('barbers').select('*').order('id')
      if (error) throw error
      setBarbers(data || [])
    } catch (error) {
      console.error('Error fetching barbers:', error)
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoading(false)
    }
  }

  const handleSlotSelect = (date: Date, time: string) => {
    startTransition(() => {
      setSelectedSlot({ date, time })
    })
  }
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    // Ajustar por la zona horaria para evitar que la fecha cambie
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    startTransition(() => {
      setSelectedDate(adjustedDate)
      setSelectedSlot(null) // Reset slot when date changes
    })
  }

  const handleFormSubmit = async (formData: { name: string; phone: string; barberId?: number }) => {
    if (!selectedSlot) return
    // ... (la lógica de submit es compleja y se mantiene igual, solo se actualiza la UI)
    // Esta lógica se podría mover a un Server Action en el futuro.
    try {
      const dateString = selectedSlot.date.toISOString().split('T')[0]
      const { data: blockedDate } = await supabase.from('blocked_dates').select('*').eq('blocked_date', dateString).single()
      if (blockedDate) throw new Error('Esta fecha está bloqueada. Por favor, selecciona otra.')

      const { data: scheduleOverride } = await supabase.from('schedule_overrides').select('*').eq('override_date', dateString).single()
      if (scheduleOverride && scheduleOverride.is_closed) throw new Error('La barbería está cerrada en esta fecha.')

      const [hours, minutes] = selectedSlot.time.split(':').map(Number)
      const appointmentDate = new Date(selectedSlot.date)
      appointmentDate.setHours(hours, minutes, 0, 0)
      
      let barberId = formData.barberId
      if (!barberId) {
        // Find available barber logic...
        for (const barber of barbers) {
          const { count } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('barber_id', barber.id).eq('service_type', 'corte').gte('appointment_date', appointmentDate.toISOString()).lte('appointment_date', new Date(appointmentDate.getTime() + 30 * 60 * 1000 - 1).toISOString())
          if (count === 0) {
            barberId = barber.id
            break
          }
        }
        if (!barberId) barberId = barbers[0]?.id
      } else {
        // Verify selected barber availability
        const { count } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('barber_id', barberId).eq('service_type', 'corte').gte('appointment_date', appointmentDate.toISOString()).lte('appointment_date', new Date(appointmentDate.getTime() + 30 * 60 * 1000 - 1).toISOString())
        if (count && count > 0) throw new Error('Este barbero ya tiene un turno reservado. Por favor, selecciona otro.')
      }

      if (!barberId) throw new Error('No hay barberos disponibles')
      
      const { data, error } = await supabase.from('appointments').insert({ client_name: formData.name, client_phone: formData.phone, appointment_date: appointmentDate.toISOString(), barber_id: barberId, service_type: 'corte' }).select().single()
      if (error) throw error

      router.push(`/exito?id=${data.id}`)
    } catch (error: any) {
      console.error('Error creating appointment:', error)
      alert(`Error al crear la reserva: ${error.message || 'Intenta nuevamente.'}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/servicios" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            &larr; Volver a Servicios
          </Link>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Paso 2 de 2
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tighter mb-2">
              Completa tu Reserva
            </h1>
            <div className="text-base text-zinc-600 dark:text-zinc-400 inline-block p-2 px-3 rounded-md bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30">
              <span className="font-semibold text-yellow-800 dark:text-yellow-300">Servicio:</span> Corte de Pelo
              <span className="mx-2 text-yellow-400">|</span>
              <span className="font-semibold text-yellow-800 dark:text-yellow-300">Precio:</span> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(config.prices.corte)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Date and Time */}
            <div className={`space-y-6 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
              {/* Step 1: Date Picker */}
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <label htmlFor="date-picker" className="block text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-3">
                  1. Elige una fecha
                </label>
                <input
                  id="date-picker"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 text-base border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Step 2: Time Slot Grid */}
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
                  2. Elige un horario
                </h2>
                <TimeSlotGrid
                  selectedDate={selectedDate}
                  selectedTime={selectedSlot?.time || null}
                  onSlotSelect={handleSlotSelect}
                />
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative">
              <div className="sticky top-24">
                {selectedSlot ? (
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-fade-in">
                    <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
                      3. Ingresa tus datos
                    </h2>
                    <AppointmentForm
                      selectedSlot={selectedSlot}
                      barbers={barbers}
                      onSubmit={handleFormSubmit}
                      onCancel={() => setSelectedSlot(null)}
                      isLoading={loading}
                    />
                  </div>
                ) : (
                  <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                    <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Selecciona una fecha y hora</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Tus datos se pedirán aquí.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


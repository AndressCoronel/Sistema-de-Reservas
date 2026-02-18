'use client'

import { useState, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

function ReservarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Default to 'corte' if not specified, but usually it should be passed
  const serviceParam = searchParams.get('service') as 'corte' | 'tinte' | 'barba' | null
  const selectedServiceType = serviceParam || 'corte'

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  // Determine service details based on type
  const getServiceDetails = (type: string) => {
    switch (type) {
      case 'barba':
        return { name: 'Barba & Afeitado', price: config.prices.barba || 8000 }
      case 'tinte': // Should ideally not reach here if redirected correctly, but safe fallback
        return { name: config.messages.serviceTinte, price: config.prices.tinte }
      case 'corte':
      default:
        return { name: 'Corte de Pelo', price: config.prices.corte }
    }
  }

  const serviceDetails = getServiceDetails(selectedServiceType)

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
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    startTransition(() => {
      setSelectedDate(adjustedDate)
      setSelectedSlot(null)
    })
  }

  const handleFormSubmit = async (formData: { name: string; phone: string; barberId?: number }) => {
    if (!selectedSlot) return

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
        for (const barber of barbers) {
          // Check availability for specific service type if needed, or general slot
          const { count } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
            .eq('barber_id', barber.id)
            .gte('appointment_date', appointmentDate.toISOString())
            .lte('appointment_date', new Date(appointmentDate.getTime() + 30 * 60 * 1000 - 1).toISOString())

          if (count === 0) {
            barberId = barber.id
            break
          }
        }
        if (!barberId) barberId = barbers[0]?.id
      } else {
        const { count } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
          .eq('barber_id', barberId)
          .gte('appointment_date', appointmentDate.toISOString())
          .lte('appointment_date', new Date(appointmentDate.getTime() + 30 * 60 * 1000 - 1).toISOString())

        if (count && count > 0) throw new Error('Este barbero ya tiene un turno reservado. Por favor, selecciona otro.')
      }

      if (!barberId) throw new Error('No hay barberos disponibles')

      const { data, error } = await supabase.from('appointments').insert({
        client_name: formData.name,
        client_phone: formData.phone,
        appointment_date: appointmentDate.toISOString(),
        barber_id: barberId,
        service_type: selectedServiceType // Use the selected service type
      }).select().single()

      if (error) throw error

      router.push(`/exito?id=${data.id}`)
    } catch (error: any) {
      console.error('Error creating appointment:', error)
      alert(`Error al crear la reserva: ${error.message || 'Intenta nuevamente.'}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-gold-500 selection:text-black">
      <header className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/servicios" className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver
          </Link>
          <div className="text-xl font-bold tracking-tighter uppercase relative">
            <span className="text-white">IMPERIUM</span><span className="text-gold-500">.</span>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-28 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Reserva tu <span className="text-gold-500">Turno</span>
            </h1>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-sm md:text-base">
              <span className="text-zinc-400">Servicio:</span>
              <span className="font-semibold text-white">{serviceDetails.name}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <span className="text-gold-500 font-bold">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(serviceDetails.price)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Date and Time */}
            <div className={`lg:col-span-7 space-y-8 transition-all duration-500 ${isPending ? 'opacity-50 grayscale' : 'opacity-100'}`}>

              {/* Step 1: Date Picker */}
              <div className="p-6 md:p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-gold-500/20 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gold-500 font-bold border border-white/5">1</div>
                  <h2 className="text-xl font-bold text-white">Selecciona una fecha</h2>
                </div>

                <div className="relative">
                  <input
                    id="date-picker"
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 text-base border-zinc-800 bg-zinc-950 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>

              {/* Step 2: Time Slot Grid */}
              <div className="p-6 md:p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-gold-500/20 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gold-500 font-bold border border-white/5">2</div>
                  <h2 className="text-xl font-bold text-white">Elige un horario disponible</h2>
                </div>
                <TimeSlotGrid
                  selectedDate={selectedDate}
                  selectedTime={selectedSlot?.time || null}
                  onSlotSelect={handleSlotSelect}
                />
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                {selectedSlot ? (
                  <div className="p-6 md:p-8 bg-zinc-900 rounded-2xl border border-gold-500/20 shadow-[0_0_50px_-20px_rgba(212,175,55,0.15)] animate-fade-in">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gold-500 text-black flex items-center justify-center font-bold">3</div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Tus Datos</h2>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest">Confirma tu reserva</p>
                      </div>
                    </div>

                    <AppointmentForm
                      selectedSlot={selectedSlot}
                      barbers={barbers}
                      onSubmit={handleFormSubmit}
                      onCancel={() => setSelectedSlot(null)}
                      isLoading={loading}
                    />
                  </div>
                ) : (
                  <div className="p-8 h-64 flex flex-col items-center justify-center text-center bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-700">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="font-medium text-zinc-400 mb-1">Esperando selección...</p>
                    <p className="text-sm text-zinc-600">Selecciona fecha y hora para continuar.</p>
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

export default function ReservarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Cargando...</div>}>
      <ReservarContent />
    </Suspense>
  )
}


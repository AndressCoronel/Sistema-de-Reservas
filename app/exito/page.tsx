'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter, redirect } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import type { Appointment, Barber } from '@/types/database'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center py-3 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
    <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
    <span className="font-semibold text-right text-zinc-900 dark:text-zinc-100">{value}</span>
  </div>
)

function ExitoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const appointmentId = searchParams.get('id')
  const [appointment, setAppointment] = useState<Appointment & { barbers: Barber | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appointmentId || isNaN(Number(appointmentId))) {
      redirect('/')
    }

    const fetchAppointment = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*, barbers(*)')
          .eq('id', appointmentId)
          .single()

        if (error) throw error
        setAppointment(data)
      } catch (error) {
        console.error('Error fetching appointment:', error)
        redirect('/')
      } finally {
        setLoading(false)
      }
    }
    fetchAppointment()
  }, [appointmentId])

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Cargando tu reserva...</p>
      </div>
    )
  }

  if (!appointment) return null; // Should be redirected by useEffect

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg className="w-9 h-9 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tighter mb-2">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Gracias por confiar en nosotros, {appointment.client_name}.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
            <h2 className="text-lg font-bold text-center text-zinc-800 dark:text-zinc-200 mb-4">Resumen de tu Turno</h2>
            <div className="space-y-1">
              <InfoRow label="Fecha" value={formatDate(appointment.appointment_date)} />
              <InfoRow label="Hora" value={<span className="text-xl">{formatTime(appointment.appointment_date)}</span>} />
              <InfoRow label="Servicio" value={config.messages.serviceCorte} />
              <InfoRow label="Precio" value={formatPrice(config.prices.corte)} />
              {appointment.barbers && <InfoRow label="Barbero" value={appointment.barbers.name} />}
              <InfoRow label="ID Reserva" value={`#${appointment.id}`} />
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-8">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2">Importante</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {config.messages.cancelationNotice} Puedes contactarnos via WhatsApp para cualquier cambio.
              Recomendamos hacer una captura de pantalla de este resumen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1 text-center px-6 py-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors">
              Ir al Inicio
            </Link>
            <button
              onClick={() => router.push('/servicios')}
              className="flex-1 px-6 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              Hacer Otra Reserva
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ExitoPage() {
  return (
    <Suspense>
      <ExitoContent />
    </Suspense>
  )
}

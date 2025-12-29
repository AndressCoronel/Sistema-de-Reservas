'use client'

import { useState, useTransition } from 'react'
import type { Barber } from '@/types/database'

interface SelectedSlot {
  date: Date
  time: string
}

interface AppointmentFormProps {
  selectedSlot: SelectedSlot
  barbers: Barber[]
  onSubmit: (data: { name: string; phone: string; barberId?: number }) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function AppointmentForm({ selectedSlot, barbers, onSubmit, onCancel, isLoading }: AppointmentFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedBarberId, setSelectedBarberId] = useState<number | undefined>(undefined)
  const [isSubmitting, startSubmitting] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, completa tu nombre y teléfono.')
      return
    }
    startSubmitting(async () => {
      await onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        barberId: selectedBarberId,
      })
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(date)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Selected Slot Info */}
      <div className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-r-lg">
        <p className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">
          Tu turno: {formatDate(selectedSlot.date)}
        </p>
        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
          {selectedSlot.time}
        </p>
      </div>

      {/* Barber Selection */}
      {barbers.length > 1 && (
        <div>
          <label htmlFor="barber-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Barbero de preferencia
          </label>
          <select
            id="barber-select"
            value={selectedBarberId || ''}
            onChange={(e) => setSelectedBarberId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">Cualquiera disponible</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Nombre y Apellido *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Tu nombre completo"
        />
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Teléfono *
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-3 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Tu número de teléfono"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto flex-1 px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-yellow-400 text-zinc-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </form>
  )
}


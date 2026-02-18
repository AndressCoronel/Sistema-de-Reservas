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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Slot Info */}
      <div className="border border-gold-500/20 bg-gold-500/5 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">
            Tu turno
          </p>
          <p className="text-xl font-bold text-white">
            {selectedSlot.time}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-400">
            {formatDate(selectedSlot.date)}
          </p>
        </div>
      </div>

      {/* Barber Selection */}
      {barbers.length > 1 && (
        <div>
          <label htmlFor="barber-select" className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
            Barbero de preferencia
          </label>
          <select
            className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all appearance-none"
            style={{ backgroundImage: 'none' }} // Remove default arrow if customized later, or keep standard
          >
            <option value="" className="bg-zinc-800 text-zinc-400">Cualquiera disponible</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id} className="bg-zinc-800 text-white">
                {barber.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
          Nombre y Apellido *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-zinc-600"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
          Teléfono *
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-zinc-600"
          placeholder="Ej: 11 1234 5678"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto flex-1 px-6 py-3 border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto flex-1 px-6 py-3 bg-gold-500 text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-px"
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </form>
  )
}


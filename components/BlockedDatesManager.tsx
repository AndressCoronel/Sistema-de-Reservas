'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface BlockedDate {
  id: number
  blocked_date: string
  reason: string | null
}

export default function BlockedDatesManager() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchBlockedDates()
  }, [])

  const fetchBlockedDates = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true })

      if (error) throw error
      setBlockedDates(data || [])
    } catch (error) {
      console.error('Error fetching blocked dates:', error)
      alert('Error al cargar las fechas bloqueadas')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newDate) {
      alert('Por favor, selecciona una fecha')
      return
    }

    try {
      const { error } = await supabase
        .from('blocked_dates')
        .insert({
          blocked_date: newDate,
          reason: newReason || null,
        })

      if (error) throw error

      alert('Fecha bloqueada exitosamente')
      setNewDate('')
      setNewReason('')
      setShowForm(false)
      fetchBlockedDates()
    } catch (error: any) {
      console.error('Error blocking date:', error)
      if (error.code === '23505') {
        alert('Esta fecha ya está bloqueada')
      } else {
        alert('Error al bloquear la fecha')
      }
    }
  }

  const handleRemoveBlockedDate = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas desbloquear esta fecha?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Fecha desbloqueada exitosamente')
      fetchBlockedDates()
    } catch (error) {
      console.error('Error removing blocked date:', error)
      alert('Error al desbloquear la fecha')
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600">Cargando fechas bloqueadas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Fechas Bloqueadas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          {showForm ? 'Cancelar' : '+ Bloquear Fecha'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAddBlockedDate} className="bg-slate-50 p-4 md:p-6 rounded-lg border-2 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fecha a Bloquear *
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Motivo (Opcional)
              </label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Ej: Feriado, Mantenimiento..."
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Bloquear Fecha
          </button>
        </form>
      )}

      {/* Blocked Dates List */}
      {blockedDates.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          No hay fechas bloqueadas
        </div>
      ) : (
        <div className="space-y-3">
          {blockedDates.map((blocked) => (
            <div
              key={blocked.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-2 border-red-200 bg-red-50 rounded-lg p-4 md:p-6"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="font-bold text-lg text-slate-900 mb-1">
                  {formatDate(blocked.blocked_date)}
                </p>
                {blocked.reason && (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Motivo:</span> {blocked.reason}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemoveBlockedDate(blocked.id)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Desbloquear
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


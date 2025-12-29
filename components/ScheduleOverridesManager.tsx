'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ScheduleOverride {
  id: number
  override_date: string
  start_time: string
  end_time: string
  is_closed: boolean
  reason: string | null
}

export default function ScheduleOverridesManager() {
  const [overrides, setOverrides] = useState<ScheduleOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    override_date: '',
    start_time: '09:00',
    end_time: '18:00',
    is_closed: false,
    reason: '',
  })

  useEffect(() => {
    fetchOverrides()
  }, [])

  const fetchOverrides = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('schedule_overrides')
        .select('*')
        .order('override_date', { ascending: true })

      if (error) throw error
      setOverrides(data || [])
    } catch (error) {
      console.error('Error fetching schedule overrides:', error)
      alert('Error al cargar los horarios especiales')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.override_date) {
      alert('Por favor, selecciona una fecha')
      return
    }

    if (!formData.is_closed && formData.start_time >= formData.end_time) {
      alert('La hora de inicio debe ser anterior a la hora de fin')
      return
    }

    try {
      const { error } = await supabase
        .from('schedule_overrides')
        .upsert({
          override_date: formData.override_date,
          start_time: formData.is_closed ? null : formData.start_time,
          end_time: formData.is_closed ? null : formData.end_time,
          is_closed: formData.is_closed,
          reason: formData.reason || null,
        })

      if (error) throw error

      alert('Horario especial guardado exitosamente')
      setFormData({
        override_date: '',
        start_time: '09:00',
        end_time: '18:00',
        is_closed: false,
        reason: '',
      })
      setShowForm(false)
      fetchOverrides()
    } catch (error: any) {
      console.error('Error saving schedule override:', error)
      alert('Error al guardar el horario especial')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este horario especial?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('schedule_overrides')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Horario especial eliminado exitosamente')
      fetchOverrides()
    } catch (error) {
      console.error('Error deleting schedule override:', error)
      alert('Error al eliminar el horario especial')
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
        <div className="text-slate-600">Cargando horarios especiales...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Horarios Especiales</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          {showForm ? 'Cancelar' : '+ Agregar Horario Especial'}
        </button>
      </div>

      <p className="text-slate-600 text-sm">
        Configura horarios especiales para feriados o días con horarios reducidos. 
        Si marcas "Cerrado", la fecha estará completamente bloqueada.
      </p>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 md:p-6 rounded-lg border-2 border-slate-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.override_date}
                onChange={(e) => setFormData({ ...formData, override_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_closed"
                checked={formData.is_closed}
                onChange={(e) => setFormData({ ...formData, is_closed: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="is_closed" className="text-sm font-semibold text-slate-700">
                Cerrado (no se aceptan reservas este día)
              </label>
            </div>

            {!formData.is_closed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required={!formData.is_closed}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora de Fin *
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required={!formData.is_closed}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Motivo (Opcional)
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Ej: Feriado Nacional, Horario Reducido..."
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Guardar Horario Especial
            </button>
          </div>
        </form>
      )}

      {/* Overrides List */}
      {overrides.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          No hay horarios especiales configurados
        </div>
      ) : (
        <div className="space-y-3">
          {overrides.map((override) => (
            <div
              key={override.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-2 border-blue-200 bg-blue-50 rounded-lg p-4 md:p-6"
            >
              <div className="flex-1 mb-3 md:mb-0">
                <p className="font-bold text-lg text-slate-900 mb-1">
                  {formatDate(override.override_date)}
                </p>
                {override.is_closed ? (
                  <p className="text-sm text-red-600 font-semibold">CERRADO</p>
                ) : (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Horario:</span>{' '}
                    {override.start_time} - {override.end_time}
                  </p>
                )}
                {override.reason && (
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-semibold">Motivo:</span> {override.reason}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(override.id)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


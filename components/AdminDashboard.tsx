'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment, Barber } from '@/types/database'
import AppointmentsList from '@/components/AppointmentsList'
import BlockedDatesManager from '@/components/BlockedDatesManager'
import ScheduleOverridesManager from '@/components/ScheduleOverridesManager'

interface AdminDashboardProps {
  onLogout: () => void
}

interface BlockedDate {
  id: number
  blocked_date: string
  reason: string | null
}

interface ScheduleOverride {
  id: number
  override_date: string
  start_time: string
  end_time: string
  is_closed: boolean
  reason: string | null
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'blocked' | 'schedule'>('appointments')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Panel de Administración
            </h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap border-b border-slate-200">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 px-4 py-3 font-semibold text-sm md:text-base transition-colors ${
                activeTab === 'appointments'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Turnos Reservados
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex-1 px-4 py-3 font-semibold text-sm md:text-base transition-colors ${
                activeTab === 'blocked'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Fechas Bloqueadas
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-4 py-3 font-semibold text-sm md:text-base transition-colors ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Horarios Especiales
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {activeTab === 'appointments' && <AppointmentsList />}
          {activeTab === 'blocked' && <BlockedDatesManager />}
          {activeTab === 'schedule' && <ScheduleOverridesManager />}
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import type { Appointment, Barber } from '@/types/database'
import AdminDashboard from '@/components/AdminDashboard'
import AdminLogin from '@/components/AdminLogin'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar si ya está autenticado
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === config.admin.password) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        error={error}
        onSubmit={handleLogin}
      />
    )
  }

  return <AdminDashboard onLogout={handleLogout} />
}


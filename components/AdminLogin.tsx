'use client'

import Link from 'next/link'

interface AdminLoginProps {
  password: string
  setPassword: (value: string) => void
  error: string
  onSubmit: (e: React.FormEvent) => void
}

export default function AdminLogin({ password, setPassword, error, onSubmit }: AdminLoginProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
          &larr; Volver al Inicio
        </Link>
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tighter">
            Acceso Admin
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ingresa la contraseña para gestionar el sistema.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="••••••••"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-yellow-400 text-zinc-900 font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

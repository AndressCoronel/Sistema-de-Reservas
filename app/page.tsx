'use client'

import { useRouter } from 'next/navigation'
import { config } from '@/lib/config'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-zinc-950">
      <div className="text-center">
        
        {/* Logo or Placeholder Icon */}
        <div className="mb-8 flex justify-center">
          {config.images.logo ? (
            <img 
              src={config.images.logo} 
              alt={config.barberiaName}
              className="h-24 w-auto"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-zinc-400 dark:text-zinc-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" x2="8.12" y1="4" y2="15.88" />
                <line x1="14.47" x2="20" y1="14.47" y2="20" />
                <line x1="8.12" x2="12" y1="8.12" y2="12" />
              </svg>
            </div>
          )}
        </div>

        {/* Welcome Text & Barber Shop Name */}
        <div className="mb-6">
          <p className="text-sm font-medium text-yellow-500 dark:text-yellow-400 tracking-widest uppercase mb-2">
            {config.messages.welcomeTitle}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tighter">
            {config.barberiaName}
          </h1>
        </div>

        {/* Slogan & Subtitle */}
        <p className="max-w-md mx-auto text-base text-zinc-600 dark:text-zinc-400 mb-10">
          {config.barberiaSlogan} {config.barberiaSubtitle}
        </p>

        {/* Reservation Button */}
        <button
          onClick={() => router.push('/servicios')}
          className="w-full sm:w-auto bg-yellow-400 text-zinc-900 font-bold px-10 py-3 rounded-lg shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          {config.messages.reservationButton}
        </button>

        {/* Admin Link */}
        <div className="mt-12">
          <a
            href="/admin"
            className="text-sm text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400 underline"
          >
            Panel de Administración
          </a>
        </div>
      </div>
    </main>
  )
}
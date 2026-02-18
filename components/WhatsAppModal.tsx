'use client'

import { config } from '@/lib/config'

interface WhatsAppModalProps {
  onClose: () => void
}

export default function WhatsAppModal({ onClose }: WhatsAppModalProps) {
  const message = encodeURIComponent('Hola, me gustaría coordinar un servicio de teñido/color.')
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${message}`

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Evita que el click se propague al fondo
      >
        <div className="p-8 text-center">

          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-500 dark:text-amber-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Coordinación por WhatsApp
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm leading-relaxed">
            Este servicio requiere atención personalizada. Por favor, contáctanos para encontrar el mejor horario para ti.
          </p>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-amber-400 text-zinc-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition-all mb-3"
            onClick={onClose}
          >
            Abrir WhatsApp
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-sm font-medium py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

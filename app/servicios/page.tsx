'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceSelection from '@/components/ServiceSelection'
import WhatsAppModal from '@/components/WhatsAppModal'

export default function ServiciosPage() {
  const [selectedService, setSelectedService] = useState<'corte' | 'tinte' | null>(null)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const router = useRouter()

  const handleServiceSelect = (service: 'corte' | 'tinte') => {
    setSelectedService(service)
    
    if (service === 'tinte') {
      setShowWhatsAppModal(true)
    } else {
      router.push('/reservar')
    }
  }
  
  const handleCloseModal = () => {
    setShowWhatsAppModal(false)
    // Deseleccionar el servicio para permitir una nueva selección
    setSelectedService(null) 
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            &larr; Volver al Inicio
          </Link>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Paso 1 de 2
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tighter mb-3">
              Elige tu Servicio
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400">
              Selecciona el servicio que deseas reservar.
            </p>
          </div>

          {/* Service Selection */}
          <ServiceSelection 
            onSelect={handleServiceSelect}
            selectedService={selectedService} 
          />

          {/* WhatsApp Modal */}
          {showWhatsAppModal && (
            <WhatsAppModal 
              onClose={handleCloseModal} 
            />
          )}
        </div>
      </main>
    </div>
  )
}

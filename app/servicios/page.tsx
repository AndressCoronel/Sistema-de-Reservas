'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ServiceSelection from '@/components/ServiceSelection'
import WhatsAppModal from '@/components/WhatsAppModal'

export default function ServiciosPage() {
  const [selectedService, setSelectedService] = useState<'corte' | 'tinte' | 'barba' | null>(null)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const router = useRouter()

  const handleServiceSelect = (service: 'corte' | 'tinte' | 'barba') => {
    setSelectedService(service)

    if (service === 'tinte') {
      setShowWhatsAppModal(true)
    } else {
      // Pass the service type to the reservation page if needed, or stick to default context
      // For now, assuming reservation page handles layout based on params or generic
      router.push(`/reservar?service=${service}`)
    }
  }

  const handleCloseModal = () => {
    setShowWhatsAppModal(false)
    setSelectedService(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-gold-500 selection:text-black">
      <header className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Inicio
          </Link>
          <div className="text-xl font-bold tracking-tighter uppercase relative">
            <span className="text-white">IMPERIUM</span><span className="text-gold-500">.</span>
          </div>
          <div className="text-sm font-bold text-gold-500 uppercase tracking-widest">
            Paso 1 <span className="text-zinc-600">/ 2</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-28 md:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Elige tu <span className="text-gold-500">Servicio</span>
            </h1>
            <p className="text-base text-zinc-400 max-w-md mx-auto">
              Selecciona el tratamiento que deseas. Para servicios de coloración, coordinaremos personalmente.
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

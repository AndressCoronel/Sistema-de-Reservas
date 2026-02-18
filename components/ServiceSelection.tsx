'use client'

import { config } from '@/lib/config'

interface ServiceSelectionProps {
  onSelect: (service: 'corte' | 'tinte' | 'barba') => void
  selectedService: 'corte' | 'tinte' | 'barba' | null
}

const ServiceCard = ({
  onClick,
  serviceName,
  description,
  price,
  ctaText,
  icon: Icon,
  isSelected,
}: {
  onClick: () => void;
  serviceName: string;
  description: string;
  price: number;
  ctaText: string;
  icon: React.ElementType;
  isSelected?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`group relative w-full text-left p-8 rounded-2xl border transition-all duration-300 overflow-hidden
                ${isSelected
        ? 'border-gold-500 bg-zinc-900 shadow-[0_0_30px_-10px_rgba(212,175,55,0.3)]'
        : 'border-white/5 bg-zinc-900/40 hover:border-gold-500/50 hover:bg-zinc-900/80 hover:shadow-xl'
      }`}
  >
    {/* Background Glow Effect */}
    <div className={`absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`} />

    <div className="relative z-10 flex items-start gap-6">
      <div className={`p-4 rounded-xl transition-all duration-300 ${isSelected ? 'bg-gold-500 text-black' : 'bg-zinc-800 text-gold-500 group-hover:bg-gold-500 group-hover:text-black'}`}>
        <Icon className="w-8 h-8" />
      </div>

      <div className="flex-1">
        <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
          {serviceName}
        </h3>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed group-hover:text-zinc-300 transition-colors">
          {description}
        </p>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <span className={`text-2xl font-bold ${isSelected ? 'text-gold-500' : 'text-zinc-100'}`}>
            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price)}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isSelected ? 'text-gold-500' : 'text-zinc-500 group-hover:text-gold-500'}`}>
            {ctaText}
            <svg className={`w-4 h-4 transition-transform duration-300 ${isSelected || 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </div>
      </div>
    </div>
  </button>
)

const ScissorsIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)

const BeardIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)

const PaintIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
)

export default function ServiceSelection({ onSelect, selectedService }: ServiceSelectionProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <ServiceCard
        onClick={() => onSelect('corte')}
        serviceName={config.messages.serviceCorte}
        description={config.messages.serviceCorteDescription}
        price={config.prices.corte}
        ctaText="Seleccionar"
        icon={ScissorsIcon}
        isSelected={selectedService === 'corte'}
      />

      <ServiceCard
        onClick={() => onSelect('barba')}
        serviceName="Barba & Afeitado"
        description="Perfilado perfecto y cuidado de la piel con toalla caliente."
        price={config.prices.barba || 8000}
        ctaText="Seleccionar"
        icon={BeardIcon}
        isSelected={selectedService === 'barba'}
      />

      <ServiceCard
        onClick={() => onSelect('tinte')}
        serviceName={config.messages.serviceTinte}
        description={config.messages.serviceTinteDescription}
        price={config.prices.tinte}
        ctaText="Consultar por WhatsApp"
        icon={PaintIcon}
        isSelected={selectedService === 'tinte'}
      />
    </div>
  )
}

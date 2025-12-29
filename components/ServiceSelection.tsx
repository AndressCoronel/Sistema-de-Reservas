'use client'

import { config } from '@/lib/config'

interface ServiceSelectionProps {
  onSelect: (service: 'corte' | 'tinte') => void
  selectedService: 'corte' | 'tinte' | null
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
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
  isSelected: boolean;
}) => (
  <button
    onClick={onClick}
    className={`group w-full text-left p-6 rounded-2xl border transition-all
                ${isSelected 
                  ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-zinc-800/50 ring-2 ring-yellow-400 dark:ring-yellow-500' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-zinc-800/50'
                }`}
  >
    <div className="flex items-start gap-5">
      <div className="mt-1">
        <Icon />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
          {serviceName}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
          {description}
        </p>
        <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          {formatPrice(price)}
        </span>
      </div>
      <div className="mt-1 text-zinc-400 dark:text-zinc-600 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  </button>
)

const ScissorsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-500 dark:text-zinc-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
    <line x1="14.47" y1="14.47" x2="20" y2="20"></line>
    <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
  </svg>
)

const PaintBrushIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-500 dark:text-zinc-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
    <path d="M18 10a4 4 0 0 1 .8-2.5c.4-.9.4-2 .2-3 .1.5-.2 1.4-.7 2.2"></path>
    <path d="M7 10a4 4 0 0 0-.8-2.5C5.8 6.6 5.8 5.5 6 4.5c-.1.5.2 1.4.7 2.2"></path>
    <path d="M18 15h-1a2 2 0 0 1-2-2v-2h-4v2a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2v2h14v-2a2 2 0 0 0-2-2z"></path>
  </svg>
)

export default function ServiceSelection({ onSelect, selectedService }: ServiceSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ServiceCard
        onClick={() => onSelect('corte')}
        serviceName={config.messages.serviceCorte}
        description={config.messages.serviceCorteDescription}
        price={config.prices.corte}
        ctaText="Reservar ahora"
        icon={ScissorsIcon}
        isSelected={selectedService === 'corte'}
      />
      <ServiceCard
        onClick={() => onSelect('tinte')}
        serviceName={config.messages.serviceTinte}
        description={config.messages.serviceTinteDescription}
        price={config.prices.tinte}
        ctaText="Coordinar por WhatsApp"
        icon={PaintBrushIcon}
        isSelected={selectedService === 'tinte'}
      />
    </div>
  )
}

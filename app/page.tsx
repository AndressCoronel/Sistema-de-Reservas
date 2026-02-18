'use client'

import { useRouter } from 'next/navigation'
import { config } from '@/lib/config'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-gold-500 selection:text-black">

      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-md py-4 border-b border-white/5 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold tracking-tighter uppercase relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-white group-hover:text-gold-500 transition-colors duration-300">IMPERIUM</span>
              <span className="text-gold-500">.</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="text-zinc-400 hover:text-white text-sm uppercase tracking-widest transition-colors font-medium">Servicios</button>
            <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="text-zinc-400 hover:text-white text-sm uppercase tracking-widest transition-colors font-medium">Contacto</button>
            <button
              onClick={() => router.push('/servicios')}
              className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gold-500 transition-all duration-300 transform hover:scale-105 text-xs uppercase tracking-wider"
            >
              Reservar Ahora
            </button>
          </div>

          {/* Mobile Menu Button (Placeholder functionality) */}
          <button className="md:hidden text-white hover:text-gold-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Simplified Background Image handling without Next/Image config requirements */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
            alt="Barbershop Background"
            className="w-full h-full object-cover opacity-40 transition-transform duration-[20s] hover:scale-105" // Subtle zoom effect could be cool but might be jarring, let's keep it static or minimal
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in flex flex-col items-center">
          <div className="mb-6 inline-block">
            <span className="py-2 px-4 border border-gold-500/30 rounded-full bg-black/30 backdrop-blur-sm text-gold-400 text-xs md:text-sm font-medium tracking-[0.3em] uppercase">
              Estilo & Excelencia
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 leading-tight drop-shadow-2xl">
            {config.barberiaName || 'IMPERIUM'}
          </h1>

          <p className="text-zinc-300 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow-lg">
            {config.barberiaSlogan || 'La experiencia definitiva en cuidado masculino. Donde la tradición se encuentra con la perfección.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto">
            <button
              onClick={() => router.push('/servicios')}
              className="group relative px-8 py-4 bg-gold-500 text-black font-bold uppercase tracking-widest overflow-hidden rounded-lg transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.6)]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full"></div>
              <span className="relative z-10">Reservar Cita</span>
            </button>
            <button
              onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-white/20 hover:border-gold-500 text-white hover:text-gold-500 uppercase tracking-widest transition-all duration-300 rounded-lg hover:bg-zinc-900/50 backdrop-blur-sm"
            >
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}>
          <svg className="w-6 h-6 text-gold-500/50 hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Preview Section */}
      <section id="servicios" className="py-32 bg-zinc-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-gold-500/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Nuestros <span className="text-gold-500">Servicios</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
            <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">Seleccionamos los mejores productos y técnicas para garantizar resultados excepcionales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Service 1: Corte */}
            <div className="group relative p-10 border border-white/5 bg-zinc-900/40 backdrop-blur-sm rounded-2xl hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-lg group-hover:shadow-gold-500/20 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">Corte Clásico</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed group-hover:text-zinc-300 transition-colors">Un corte diseñado a tu medida, utilizando técnicas de tijera y máquina para un acabado perfecto y natural.</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-gold-500 font-bold text-lg group-hover:scale-110 transition-transform origin-left">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(config.prices.corte)}
                  </span>
                  <button onClick={() => router.push('/reservar?service=corte')} className="text-sm font-medium text-white hover:text-gold-500 uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                    Reservar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Service 2: Barba */}
            <div className="group relative p-10 border border-white/5 bg-zinc-900/40 backdrop-blur-sm rounded-2xl hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-lg group-hover:shadow-gold-500/20 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">Barba & Afeitado</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed group-hover:text-zinc-300 transition-colors">Perfilado perfecto y cuidado de la piel con toalla caliente y aceites esenciales para la mejor experiencia.</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-gold-500 font-bold text-lg group-hover:scale-110 transition-transform origin-left">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(config.prices.barba || 8000)}
                  </span>
                  <button onClick={() => router.push('/reservar?service=barba')} className="text-sm font-medium text-white hover:text-gold-500 uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                    Reservar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Service 3: Color/Tinte */}
            <div className="group relative p-10 border border-white/5 bg-zinc-900/40 backdrop-blur-sm rounded-2xl hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shadow-lg group-hover:shadow-gold-500/20 group-hover:scale-110 group-hover:rotate-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">Color & Estilo</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed group-hover:text-zinc-300 transition-colors">Renueva tu imagen con nuestros servicios de coloración profesional y tratamientos capilares.</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-gold-500 font-bold text-lg group-hover:scale-110 transition-transform origin-left">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(config.prices.tinte)}
                  </span>
                  <button onClick={() => router.push('/reservar?service=tinte')} className="text-sm font-medium text-white hover:text-gold-500 uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                    Reservar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-zinc-950 pt-24 pb-12 border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-3xl font-black mb-6 text-white tracking-widest uppercase">IMPERIUM<span className="text-gold-500">.</span></h4>
              <p className="text-zinc-400 max-w-sm leading-relaxed mb-6">Redefiniendo el cuidado masculino. Un espacio donde la tradición se encuentra con el estilo contemporáneo para el caballero moderno.</p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all cursor-pointer"><span className="sr-only">Instagram</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div>
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all cursor-pointer"><span className="sr-only">Facebook</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></div>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-sm border-b border-white/10 pb-2 inline-block">Horarios</h5>
              <ul className="text-zinc-400 space-y-3 text-sm font-light">
                <li className="flex justify-between"><span>Lunes - Viernes</span> <span className="text-white">09:00 - 20:00</span></li>
                <li className="flex justify-between"><span>Sábado</span> <span className="text-white">10:00 - 18:00</span></li>
                <li className="flex justify-between"><span>Domingo</span> <span className="text-zinc-600">Cerrado</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-sm border-b border-white/10 pb-2 inline-block">Contacto</h5>
              <ul className="text-zinc-400 space-y-3 text-sm font-light">
                <li className="flex items-center gap-3"><svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> info@imperium.com</li>
                <li className="flex items-center gap-3"><svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> +1 234 567 890</li>
                <li className="mt-4"><a href="/admin" className="text-zinc-600 hover:text-gold-500 transition-colors text-xs uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded hover:border-gold-500">Admin Login</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Imperium Barberia.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
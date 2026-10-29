"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useIdioma } from '@/context/LanguageContext';

interface NavbarProps {
  ocultarBuscador?: boolean;
  ocultarBotonVolver?: boolean;
  rutaVolver?: string;
  fondoTranslucido?: boolean;
}

const NOMBRES_IDIOMAS: Record<string, string> = { es: 'Español', en: 'English' };

const TRADUCCIONES: Record<string, { back: string; search: string }> = {
  es: { back: 'Volver', search: 'Buscar obras, autores...' },
  en: { back: 'Back', search: 'Search artworks, artists...' }
};

export default function Navbar({
  ocultarBuscador = false,
  ocultarBotonVolver = false,
  rutaVolver = '/',
  fondoTranslucido = false
}: NavbarProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const { idioma, setIdioma } = useIdioma();

  // Aseguramos que TypeScript sepa que el parámetro es 'es' o 'en'
  const cambiarIdioma = (nuevoIdioma: 'es' | 'en') => {
    setIdioma(nuevoIdioma);
    setDropdownAbierto(false);
  };

  const nombreIdiomaActual = NOMBRES_IDIOMAS[idioma] || 'Español';
  const t = TRADUCCIONES[idioma] || TRADUCCIONES.es;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3 transition-all duration-500 ease-in-out ${
        fondoTranslucido ? 'bg-black/20 shadow-none' : 'bg-black/85 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
      }`}
      role="navigation"
      aria-label="Navegación Principal"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:grid md:grid-cols-3 md:gap-0">
        
        {/* Botón Volver */}
        <div className="flex-shrink-0 flex items-center md:justify-start">
          {!ocultarBotonVolver && (
            <Link 
              href={rutaVolver} 
              className="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-black/40 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-[10px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label={t.back}
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="hidden md:inline antialiased">{t.back}</span>
            </Link>
          )}
        </div>

        {/* Buscador */}
        <div className="flex-1 md:w-full flex justify-center">
          {!ocultarBuscador && (
            <div className="relative group w-full max-w-md md:max-w-2xl">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search} 
                className="w-full bg-white/5 border border-white/20 rounded-full py-2.5 md:py-3 px-5 text-white text-xs md:text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 placeholder:text-neutral-500 font-light tracking-wide antialiased shadow-inner group-focus-within:border-[#D4AF37]"
              />
              <span 
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#D4AF37] transition-all text-sm md:text-base select-none"
                aria-hidden="true"
              >
                🔍
              </span>
            </div>
          )}
        </div>

        {/* Dropdown de Idiomas */}
        <div className="flex-shrink-0 flex justify-end">
          <div className="relative">
            <button 
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black/50 border border-white/10 rounded-full text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors uppercase tracking-widest text-[10px] font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              aria-expanded={dropdownAbierto}
              aria-haspopup="true"
            >
              <span className="antialiased">{nombreIdiomaActual}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-300 ${dropdownAbierto ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Menú desplegable */}
            <div 
              className={`absolute right-0 mt-2 w-32 bg-black/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50 origin-top-right transition-all duration-200 ease-out ${
                dropdownAbierto ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
            >
              <button 
                onClick={() => cambiarIdioma('es')} 
                className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors antialiased focus:outline-none ${
                  idioma === 'es' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Español
              </button>
              
              <button 
                onClick={() => cambiarIdioma('en')} 
                className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors antialiased focus:outline-none border-t border-white/5 ${
                  idioma === 'en' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
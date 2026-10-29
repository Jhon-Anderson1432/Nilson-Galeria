"use client";
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useIdioma } from '@/context/LanguageContext';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// ==========================================
// MOCK DATA: Simulando una obra específica de Supabase
// ==========================================
const OBRAS_MOCK = [
  { 
    id: '1', 
    titulo: 'El Origen', 
    titulo_en: 'The Origin',
    autor: 'Nilson', 
    precio: 1200, 
    medidas: '120x80 cm',
    medidas_en: '120x80 cm',
    tecnica: 'Óleo sobre lienzo', 
    tecnica_en: 'Oil on canvas',
    imagenes: ['/placeholder1.jpg', '/placeholder2.jpg'] 
  }
];

const TRADUCCIONES = {
  es: { 
    acquireBtn: 'Solicitar Adquisición', 
    techniqueLabel: 'Técnica', 
    dimensionsLabel: 'Dimensión', 
    valueLabel: 'Valor', 
    contactLabel: 'Contacto', 
    infoLabel: 'Info detallada',
    loading: 'Cargando Obra...',
    noImage: 'Sin Imagen Disponible'
  },
  en: { 
    acquireBtn: 'Request Acquisition', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    valueLabel: 'Value', 
    contactLabel: 'Contact', 
    infoLabel: 'Detailed info',
    loading: 'Loading Artwork...',
    noImage: 'No Image Available'
  }
};

export default function DetalleObra() {
  const params = useParams();
  const idObra = params.id as string;
  
  const { idioma } = useIdioma();
  const t = TRADUCCIONES[idioma];
  const isEnglish = idioma === 'en';

  const [obra, setObra] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  // Simulación de carga de Supabase (Fetch)
  useEffect(() => {
    // Aquí irá tu: supabase.from('obras').select('*').eq('id', idObra).single()
    const obraEncontrada = OBRAS_MOCK.find(o => o.id === idObra) || OBRAS_MOCK[0]; // Fallback al 0 para pruebas
    
    setTimeout(() => {
      setObra(obraEncontrada);
      setCargando(false);
    }, 600); // Simulamos un pequeño retraso de red
  }, [idObra]);

  // Textos dinámicos según idioma
  const tituloPrincipal = useMemo(() => {
    if (!obra) return '';
    return isEnglish && obra.titulo_en ? obra.titulo_en : obra.titulo;
  }, [obra, isEnglish]);

  const tecnicaPrincipal = useMemo(() => {
    if (!obra) return '';
    return isEnglish && obra.tecnica_en ? obra.tecnica_en : obra.tecnica;
  }, [obra, isEnglish]);

  const imagenesObra = obra?.imagenes?.length > 0 ? obra.imagenes : ['sin-imagen'];

  // Función de WhatsApp
  const preguntarPorWhatsApp = () => {
    if (!obra) return;
    const dominio = typeof window !== 'undefined' ? window.location.origin : '';
    const urlDetalle = `${dominio}/detalle-obra/${obra.id}`;
    const precioFormat = isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO') + ' USD';
    
    const texto = isEnglish 
      ? `Hello, I'm interested in acquiring this artwork:\n\n*Title:* ${tituloPrincipal}\n*Author:* ${obra.autor}\n*Price:* ${precioFormat}\n\n*Link:* ${urlDetalle}`
      : `Hola, estoy interesado en adquirir esta obra:\n\n*Título:* ${tituloPrincipal}\n*Autor:* ${obra.autor}\n*Precio:* ${precioFormat}\n\n*Enlace:* ${urlDetalle}`;
    
    const urlWa = `https://wa.me/573116390177?text=${encodeURIComponent(texto)}`;
    window.open(urlWa, '_blank');
  };

  // Pantalla de Carga
  if (cargando) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 text-white flex flex-col justify-center items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div>
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] animate-pulse font-medium">
          {t.loading}
        </p>
      </main>
    );
  }

  // Render principal de la obra
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 text-white flex flex-col overflow-y-auto font-sans pb-20 relative pt-24 selection:bg-[#D4AF37] selection:text-black">
      
      {/* Puedes configurar rutaVolver dinámicamente si lo deseas */}
      <Navbar ocultarBuscador={true} rutaVolver="/exposiciones/contemporaneo" fondoTranslucido={true} />
      
      {/* Decoración Dorada de fondo */}
      <div className="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none opacity-60">
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#D4AF37]/20 to-transparent"></div>
        <div className="absolute bottom-[-20px] right-[-40px] w-[150%] h-20 bg-gray-900 rotate-[-45deg] border-t border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.25)]"></div>
      </div>
      
      <article className="flex-1 flex flex-col max-w-xl mx-auto w-full relative z-10 animate-fade-in-down">
        
        <header className="w-full relative z-[100] border-b-[2px] border-b-[#D4AF37]/50 pt-6 flex justify-center">
          <img
            src="/logo2.png"
            alt="Logo Galería"
            className="w-48 md:w-56 h-auto block drop-shadow-[0_0_15px_rgba(212,175,55,0.2)] mb-4"
          />
        </header>
        
        <div className="flex-1 flex-col px-4 pt-6">
          
          {/* Contenedor de la Imagen / Swiper */}
          <figure className="w-full relative bg-gray-900 my-4 group overflow-hidden rounded-sm shadow-[0_15px_50px_rgba(0,0,0,0.6)] border border-white/10">
            <div className="absolute -inset-1 bg-[#D4AF37]/10 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70"></div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] z-10 bg-neutral-950 overflow-hidden">
              <Swiper
                modules={[Autoplay, EffectFade]}
                slidesPerView={1}
                loop={imagenesObra.length > 1}
                autoplay={imagenesObra.length > 1 ? { delay: 4000, disableOnInteraction: false } : false}
                effect="fade"
                className="w-full h-full"
              >
                {imagenesObra.map((img: string, idx: number) => (
                  <SwiperSlide key={idx} className="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                    {img !== 'sin-imagen' ? (
                      <img
                        src={img}
                        alt={`${tituloPrincipal} por ${obra.autor}`}
                        className="w-full h-full object-contain object-center block drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x800/1f2937/d4af37?text=Sin+Imagen" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 uppercase tracking-widest text-xs">
                        {t.noImage}
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </figure>
          
          {/* Títulos */}
          <div className="text-center space-y-3 mb-8 mt-8">
            <h1 className="text-3xl md:text-5xl font-light text-white leading-tight capitalize drop-shadow-2xl">
              {tituloPrincipal}
            </h1>
            <p className="text-xl md:text-2xl text-[#D4AF37] pt-2 capitalize tracking-wider drop-shadow-md">
              {obra.autor}
            </p>
          </div>
          
          {/* Tarjeta de Información */}
          <div className="max-w-sm mx-auto space-y-4 mb-10 border-t border-white/10 pt-8 text-center bg-white/[0.03] p-8 rounded-sm backdrop-blur-md shadow-inner">
            <p className="text-sm flex justify-between border-b border-white/5 pb-3 transition-colors hover:text-[#D4AF37]">
              <span className="text-neutral-400 font-light tracking-widest uppercase text-xs">{t.techniqueLabel}</span>
              <span className="text-white capitalize font-medium">{tecnicaPrincipal}</span>
            </p>
            <p className="text-sm flex justify-between border-b border-white/5 pb-3 transition-colors hover:text-[#D4AF37]">
              <span className="text-neutral-400 font-light tracking-widest uppercase text-xs">{t.dimensionsLabel}</span>
              <span className="text-white lowercase font-medium">{obra.medidas}</span>
            </p>
            <p className="text-sm flex justify-between pb-3">
              <span className="text-neutral-400 font-light tracking-widest uppercase text-xs">{t.valueLabel}</span>
              <span className="text-[#D4AF37] font-bold text-xl drop-shadow-md">
                {isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString('es-CO')} USD
              </span>
            </p>
            
            <div className="mt-6 pt-6 border-t border-[#D4AF37]/20 flex flex-col gap-3">
              <p className="text-xs sm:text-sm flex justify-center items-center gap-3">
                <span className="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{t.contactLabel}:</span>
                <span className="text-white font-mono tracking-wider font-medium">311 639 0177</span>
              </p>
              <p className="text-xs sm:text-sm flex justify-center items-center gap-3">
                <span className="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{t.infoLabel}:</span>
                <span className="text-white font-mono tracking-wider font-medium">310 447 0369</span>
              </p>
            </div>
          </div>
          
          {/* Botón WhatsApp */}
          <div className="mt-auto pb-8">
            <button
              onClick={preguntarPorWhatsApp}
              className="group flex items-center justify-center w-full py-4 bg-black border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30 transition-all duration-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] active:scale-95"
            >
              <span className="uppercase tracking-[0.2em] text-xs transition-transform duration-300 group-hover:scale-105">
                {t.acquireBtn}
              </span>
            </button>
          </div>

        </div>
      </article>
    </main>
  );
}
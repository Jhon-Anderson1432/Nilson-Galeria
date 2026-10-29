"use client";
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useIdioma } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase'; // <-- Conexión a tu Base de Datos

// Importaciones de Swiper para React
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const TRADUCCIONES = {
  es: { 
    titleContemporaneo: 'Arte Contemporáneo', 
    titlePrivada: 'Colección Privada',
    subtitle: 'Exposiciones y Obras Exclusivas', 
    filterAll: 'Todas las series', 
    filterPaintings: 'Pinturas', 
    filterSculptures: 'Esculturas',
    paintingLabel: 'Pintura', 
    sculptureLabel: 'Escultura', 
    by: 'Por', 
    techniqueLabel: 'Técnica', 
    dimensionsLabel: 'Medidas', 
    detailsBtn: 'Ver detalles', 
    noResults: 'No encontramos obras en esta serie o categoría.' 
  },
  en: { 
    titleContemporaneo: 'Contemporary Art', 
    titlePrivada: 'Private Collection',
    subtitle: 'Exhibitions and Exclusive Artworks', 
    filterAll: 'All series', 
    filterPaintings: 'Paintings', 
    filterSculptures: 'Sculptures',
    paintingLabel: 'Painting', 
    sculptureLabel: 'Sculpture', 
    by: 'By', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    detailsBtn: 'View details', 
    noResults: 'No artworks found in this series or category.' 
  }
};

export default function ExposicionesDinamicas() {
  const params = useParams();
  const tipoGaleria = params.tipo as string; // 'contemporaneo' o 'privada'
  
  const { idioma } = useIdioma();
  const t = TRADUCCIONES[idioma];
  const isEnglish = idioma === 'en';

  // Estados de los filtros y datos
  const [serieSeleccionada, setSerieSeleccionada] = useState<string>('Todas');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todo');
  const [obrasDb, setObrasDb] = useState<any[]>([]); // Inicia vacío esperando a Supabase

  // ==========================================
  // CONEXIÓN SUPABASE: Cargar Obras Dinámicas
  // ==========================================
  useEffect(() => {
    const fetchObras = async () => {
      // Traemos solo las obras que correspondan a la URL actual (contemporaneo o privada)
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('galeria', tipoGaleria)
        .order('created_at', { ascending: false });

      if (data) {
        // Mapeamos los datos de la BD para que coincidan con la estructura de tu UI
        const obrasMapeadas = data.map(obra => ({
          id: obra.id,
          galeria: obra.galeria,
          serie: obra.serie || 'Colección General', // Si no tiene serie, le damos un valor por defecto
          categoria: obra.tipo, // En la BD se llama "tipo", en tu UI "categoria"
          titulo: obra.titulo,
          autor: obra.autor,
          precio: obra.precio,
          medidas: obra.medidas,
          tecnica: obra.tecnica,
          // Si hay URL de imagen la metemos en un array para que Swiper funcione, si no, un placeholder
          imagenes: obra.imagen_url ? [obra.imagen_url] : ['https://via.placeholder.com/600x600/1f2937/d4af37?text=Sin+Imagen']
        }));
        
        setObrasDb(obrasMapeadas);
      }
    };

    if (tipoGaleria) {
      fetchObras();
    }
  }, [tipoGaleria]);

  // 1. Obras base para esta vista (ya vienen filtradas desde Supabase, pero mantenemos la lógica por seguridad)
  const obrasDeEstaGaleria = useMemo(() => {
    return obrasDb.filter(obra => obra.galeria === tipoGaleria);
  }, [obrasDb, tipoGaleria]);

  // 2. Extraemos las "Series" disponibles dinámicamente para los Tabs
  const seriesDisponibles = useMemo(() => {
    const series = obrasDeEstaGaleria.map(o => o.serie);
    return ['Todas', ...Array.from(new Set(series))];
  }, [obrasDeEstaGaleria]);

  // 3. Aplicamos el filtro final (Serie + Categoría) para pintar la cuadrícula
  const obrasFiltradas = useMemo(() => {
    return obrasDeEstaGaleria.filter(obra => {
      const cumpleSerie = serieSeleccionada === 'Todas' || obra.serie === serieSeleccionada;
      const cumpleCategoria = categoriaSeleccionada === 'Todo' || obra.categoria === categoriaSeleccionada;
      return cumpleSerie && cumpleCategoria;
    });
  }, [obrasDeEstaGaleria, serieSeleccionada, categoriaSeleccionada]);

  // Título dinámico
  const tituloPagina = tipoGaleria === 'contemporaneo' ? t.titleContemporaneo : t.titlePrivada;

  return (
    <main className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 text-white pt-24 px-6 pb-20 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      <Navbar />

      {/* Header */}
      <header className="text-center max-w-4xl mx-auto mt-6 mb-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-lg mb-4 animate-fade-in-down font-light">
          {tituloPagina}
        </h1>
        <p className="text-neutral-400 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-2xl animate-fade-in">
          {t.subtitle}
        </p>
      </header>

      {/* TABS DE SERIES (Filtro Principal Dinámico) */}
      <nav className="max-w-7xl mx-auto mb-8 flex flex-wrap justify-center gap-3">
        {seriesDisponibles.map(serie => (
          <button
            key={serie}
            onClick={() => setSerieSeleccionada(serie)}
            className={`px-6 py-2 rounded-sm transition-all duration-300 text-xs font-bold uppercase tracking-widest border ${
              serieSeleccionada === serie 
                ? 'bg-white/10 text-white border-white/50 shadow-inner' 
                : 'bg-transparent text-neutral-400 border-transparent hover:border-white/20 hover:text-white'
            }`}
          >
            {serie === 'Todas' ? t.filterAll : serie}
          </button>
        ))}
      </nav>

      {/* PÍLDORAS DE CATEGORÍA (Pintura / Escultura) */}
      <nav aria-label="Filtros de exposición" className="max-w-7xl mx-auto mb-12 flex flex-wrap justify-center gap-4">
        {['Todo', 'Pintura', 'Escultura'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)} 
            className={`px-8 py-3 rounded-sm transition-all duration-300 flex items-center group active:scale-95 focus:outline-none border ${
              categoriaSeleccionada === cat 
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'bg-black/30 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest">
              {cat === 'Todo' ? 'Todas' : cat === 'Pintura' ? t.filterPaintings : t.filterSculptures}
            </span>
          </button>
        ))}
      </nav>

      {/* GRID DE OBRAS */}
      {obrasFiltradas.length > 0 ? (
        <section className="max-w-7xl mx-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
            
            {obrasFiltradas.map((obra) => (
              <article 
                key={obra.id} 
                className="group bg-neutral-900/40 border border-white/5 rounded-sm overflow-hidden hover:border-[#D4AF37]/40 hover:bg-neutral-900/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col relative"
              >
                
                {/* Etiqueta de Categoría */}
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-sm border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
                  {obra.categoria === 'Escultura' ? t.sculptureLabel : t.paintingLabel}
                </div>

                {/* Imagen / Swiper */}
                <figure className="relative aspect-square overflow-hidden bg-black/50">
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    slidesPerView={1}
                    loop={obra.imagenes.length > 1}
                    autoplay={obra.imagenes.length > 1 ? { delay: 3500, disableOnInteraction: false } : false}
                    effect="fade"
                    className="w-full h-full"
                  >
                    {obra.imagenes.map((img: string, idx: number) => (
                      <SwiperSlide key={idx} className="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                        <img 
                          src={img} 
                          alt={obra.titulo} 
                          className="w-full h-full object-cover object-center block transition-transform duration-1000 group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x600/1f2937/d4af37?text=Sin+Imagen" }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90 pointer-events-none z-10"></div>
                </figure>

                {/* Información de la Obra */}
                <div className="p-6 md:p-8 flex-1 flex flex-col relative z-20 -mt-16">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-[#D4AF37] transition-colors capitalize drop-shadow-md line-clamp-2">
                      {obra.titulo}
                    </h3>
                    <p className="text-neutral-300 text-sm italic capitalize">
                      {t.by} {obra.autor}
                    </p>
                  </div>

                  <div className="py-5 border-y border-white/10 mb-6 flex-1 flex flex-col justify-center bg-black/30 rounded-sm px-5">
                    <div className="grid grid-cols-2 gap-4 items-start">
                      <div className="text-left pr-2">
                        <span className="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{t.techniqueLabel}</span>
                        <p className="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed capitalize">
                          {obra.tecnica}
                        </p>
                      </div>
                      <div className="text-left border-l border-white/10 pl-4">
                        <span className="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{t.dimensionsLabel}</span>
                        <p className="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{obra.medidas}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl md:text-2xl text-white tracking-wider flex items-baseline font-light">
                      {isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO')}
                      <span className="text-[10px] text-neutral-500 ml-1 font-sans font-bold uppercase tracking-widest">USD</span>
                    </span>

                    <Link 
                      href={`/detalle-obra/${obra.id}`} 
                      className="flex items-center justify-center px-6 py-3 border border-white/20 bg-white/5 text-white rounded-sm hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none transition-all duration-300 shadow-lg active:scale-95"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{t.detailsBtn}</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        /* Empty State */
        <div className="max-w-7xl mx-auto text-center py-32 space-y-4">
          <div className="text-5xl mb-6 opacity-40">🖼️</div>
          <p className="text-neutral-400 font-light text-2xl italic">{t.noResults}</p>
          <button 
            onClick={() => { setSerieSeleccionada('Todas'); setCategoriaSeleccionada('Todo'); }} 
            className="text-[#D4AF37] hover:text-white uppercase tracking-widest text-xs font-bold mt-6 transition-colors focus:outline-none"
          >
            {isEnglish ? 'Clear filters' : 'Quitar filtros'}
          </button>
        </div>
      )}
    </main>
  );
}
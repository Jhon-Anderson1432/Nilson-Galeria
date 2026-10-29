"use client";
import Link from 'next/link';
import { ArrowLeft, MapPin, Award, BookOpen, Brush, Image as ImageIcon, Quote } from 'lucide-react';

export default function TrayectoriaPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden relative">
      
      {/* Luces de fondo (Glows) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[30%] -right-[20%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Navegación Superior */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5 p-4 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#D4AF37] transition-colors text-xs uppercase tracking-[0.2em] font-bold">
          <ArrowLeft size={16} />
          Volver al Inicio
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* ================= HERO SECTION ================= */}
        <header className="text-center mb-24 md:mb-32 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tighter mb-4">
            NILSON MIGUEL <span className="text-[#D4AF37] italic">BERRÍO ARIAS</span>
          </h1>
          <p className="text-sm md:text-base text-neutral-400 uppercase tracking-[0.4em] font-bold mb-12">
            Artista Plástico Contemporáneo
          </p>
          
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <Quote className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#D4AF37]/20 w-16 h-16" />
            <p className="relative z-10 text-xl md:text-3xl font-serif text-[#D4AF37] leading-relaxed italic drop-shadow-sm">
              "Yo no sigo corriente. Yo creo mi propio espacio."
            </p>
          </div>
        </header>

        {/* ================= ORIGEN Y ESTUDIOS (Zig-Zag 1) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-24 md:mb-32">
          {/* Espacio para Foto de Nilson */}
          <div className="relative aspect-[4/5] bg-[#111] border border-white/10 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600 group-hover:text-[#D4AF37] transition-colors">
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Foto del Artista / Estudio</span>
            </div>
            {/* Reemplaza el src con la foto real de Nilson */}
            <img src="/ruta-a-tu-foto-nilson.jpg" alt="Retrato de Nilson Berrío" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[#D4AF37] mb-6">
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
              <span className="text-xs uppercase tracking-widest font-bold">El Origen</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
              Donde el tiempo <br/><span className="text-[#D4AF37] italic">se volvió primavera</span>
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Nacido en Medellín, Antioquia. Egresado de Bellas Artes Medellín en 1995. Sus bases técnicas se forjaron mediante estudios de acuarela con el maestro Antonio Chavarría, pintura con el maestro Germán Arrubla y clases con el maestro Hernán Orozco.
            </p>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-semibold">
              Sin embargo, afirma que su verdadera escuela ha sido el lienzo y su inagotable imaginación.
            </p>
          </div>
        </section>

        {/* ================= ESTILO Y TRAYECTORIA (Zig-Zag 2) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-24 md:mb-32">
          <div className="order-2 md:order-1 space-y-6">
            <div className="flex items-center gap-4 text-[#D4AF37] mb-6">
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
              <span className="text-xs uppercase tracking-widest font-bold">Trayectoria y Estilo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
              El suspenso sagrado <br/><span className="italic text-neutral-500 text-2xl">entre hundirse y flotar</span>
            </h2>
            <div className="space-y-4 text-neutral-400 text-sm md:text-base leading-relaxed">
              <p>
                Su pintura habita en la frontera entre el <strong className="text-white">surrealismo contemporáneo</strong> y la <strong className="text-white">libertad de las formas</strong>. Crea atmósferas mágicas donde el símbolo se vuelve lenguaje y el color, memoria.
              </p>
              <p>
                Le interesa pintar el umbral: no la puerta, sino el segundo antes de cruzarla. Para Nilson, la pintura es una invitación a experimentar un viaje de emociones y cartografía interior.
              </p>
              <p className="border-l-2 border-[#D4AF37] pl-4 italic text-neutral-300">
                "Manejo todas las técnicas, en especial óleo y acrílico sobre lienzo. La experimentación hace parte esencial de mi ser."
              </p>
            </div>
          </div>

          {/* Espacio para Foto de Obra representativa */}
          <div className="order-1 md:order-2 relative aspect-square md:aspect-[4/5] bg-[#111] border border-white/10 rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600 group-hover:text-[#D4AF37] transition-colors">
              <Brush size={48} className="mb-4 opacity-50" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-center px-4">Foto de una obra que represente "El Umbral"</span>
            </div>
            <img src="/ruta-a-obra-umbral.jpg" alt="Obra de Nilson Berrío" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </section>

        {/* ================= MANIFIESTO (Bloque ancho con cita profunda) ================= */}
        <section className="relative bg-[#111] border border-[#D4AF37]/20 rounded-3xl p-8 md:p-16 text-center mb-24 md:mb-32 shadow-[0_0_50px_rgba(212,175,55,0.05)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
          
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <p className="text-lg md:text-2xl font-serif text-white leading-relaxed">
              "Pinto el instante exacto en que te atreves a cruzar. <br/>
              <span className="text-[#D4AF37]">No pinto lo que hay al otro lado. Pinto el umbral.</span>"
            </p>
            
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Mi obra transita entre el surrealismo contemporáneo y la libertad. Son atmósferas mágicas donde el símbolo habla y el color recuerda. Es una cartografía interior para que el espectador experimente el caos del mundo, y a través de mis tonos y temáticas, se concientice de la realidad.
            </p>

            <div className="pt-8 space-y-2">
              <p className="text-white/80 italic text-sm md:text-base">Pinto para volver al origen.</p>
              <p className="text-white/80 italic text-sm md:text-base">Pinto para que no nos perdamos en el paso del tiempo.</p>
              <p className="text-white/80 italic text-sm md:text-base">Pinto para aprender a vivir el aquí y el ahora.</p>
            </div>

            <p className="text-xl md:text-3xl font-serif text-[#D4AF37] pt-8 border-t border-white/5 mt-8">
              "Que mis obras dejen huellas en las líneas del Tiempo"
            </p>
          </div>
        </section>

        {/* ================= RECONOCIMIENTOS Y GALERÍA (Grid) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tarjeta Reconocimientos */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 hover:border-[#D4AF37]/30 transition-colors">
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-6">
              <Award className="text-[#D4AF37]" size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-6">Exposiciones & Reconocimientos</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>Se han realizado múltiples exposiciones colectivas y muestras individuales a lo largo de su carrera.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>Ha sido jurado invitado en diversos e importantes certámenes de arte.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>Sus obras han sido publicadas en catálogos, revistas, libros y entrevistas en varios medios de comunicación e informativos.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>Galardonado con diversos premios y reconocimientos por su incesante labor en las artes plásticas.</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta Galería (Visita) */}
          <div className="bg-gradient-to-br from-[#111] to-black border border-[#D4AF37]/20 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
            {/* Foto de fondo opcional para la galería */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
               <img src="/ruta-foto-galeria.jpg" alt="Galería Palacio Nacional" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <MapPin className="text-[#D4AF37]" size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Visita la Galería</h3>
              <p className="text-neutral-400 text-sm mb-8">Actualmente exhibe su obra de manera permanente en su galería propia, el umbral físico de su universo.</p>
              
              <div className="mt-auto space-y-4 bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1">Ubicación</p>
                  <p className="text-white text-sm">Centro Comercial Palacio Nacional</p>
                  <p className="text-neutral-400 text-sm">Local 479 - Medellín, Colombia</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mb-1">Horario de Atención</p>
                  <p className="text-white text-sm">Lunes a Sábado</p>
                  <p className="text-neutral-400 text-sm">9:00 a.m. a 7:00 p.m.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Estilos para animación inicial */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
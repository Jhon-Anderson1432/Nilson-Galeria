"use client";
import Navbar from '@/components/Navbar';
import { useIdioma } from '@/context/LanguageContext';
import Link from 'next/link';

export default function Home() {
  const { idioma } = useIdioma();
  const isEnglish = idioma === 'en';

  const btnClasses = "min-w-[200px] px-6 py-4 border border-[#D4AF37]/80 bg-black/30 text-[#D4AF37] backdrop-blur-xl flex items-center justify-center uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-500 rounded-sm hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-[#D4AF37] group";

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 selection:bg-[#D4AF37] selection:text-black">
      
      <Navbar ocultarBuscador={true} ocultarBotonVolver={true} fondoTranslucido={true} />

      {/* Contenido principal centrado */}
      <section className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20">
        
        <img 
          src="/logo.png" 
          alt="Logo Galería" 
          className="w-48 md:w-64 mb-8 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fade-in-down"
        />
        
        <h2 className="text-lg md:text-xl font-light tracking-[0.25em] mb-14 text-[#D4AF37] drop-shadow-lg text-center uppercase animate-fade-in">
          {isEnglish 
            ? 'Art is not bought. It is recognized, and when you recognize it, it recognizes you.' 
            : 'El arte no se compra. Se reconoce y cuando lo reconoces, te reconoce a ti.' 
          }
        </h2>

        <div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-6 w-full max-w-5xl justify-center animate-slide-up">
          
          {/* Ruta dinámica 1: Contemporáneo */}
          <Link href="/exposiciones/contemporaneo" className={btnClasses}>
            <span className="text-sm transition-transform duration-300 group-hover:scale-105">
              {isEnglish ? 'Gallery collection' : 'Arte contemporáneo'}
            </span>
          </Link>
          
          {/* Ruta dinámica 2: Privada */}
          <Link href="/exposiciones/privada" className={btnClasses}>
            <span className="text-sm transition-transform duration-300 group-hover:scale-105">
              {isEnglish ? 'Private collection / Diverse artists' : 'Colección privada / Artistas diversos'}
            </span>
          </Link>
          
          {/* Ruta estática: Trayectoria */}
          <Link href="/trayectoria" className={btnClasses}>
            <span className="text-sm transition-transform duration-300 group-hover:scale-105">
              {isEnglish ? 'Trajectory' : 'Trayectoria'}
            </span>
          </Link>

        </div>
      </section>
    </main>
  );
}
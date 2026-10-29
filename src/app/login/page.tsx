"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // <-- Importamos nuestra conexión real

export default function AdminLogin() {
  const router = useRouter();
  
  // Cambiamos 'email' por 'username'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Efecto para simular la limpieza de caché y verificar si ya está logueado
  useEffect(() => {
    document.title = "Acceso Restringido | Galería Nilson";
    
    // Si ya hay una sesión activa, lo mandamos directo al admin
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      }
    };
    verificarSesion();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErrorMensaje('');

    // 1. Limpiamos lo que escribió el usuario (pasamos a minúsculas para evitar errores)
    const usuarioIngresado = username.trim().toLowerCase();
    
    // 2. Por defecto intentamos usar lo que escribió
    let correoParaSupabase = username.trim(); 

    // 3. EL PUENTE: Si escribe su nombre de artista, lo transformamos en su correo real
    if (usuarioIngresado === 'nilson contemporaneo') {
      correoParaSupabase = 'nilsonartecontemporaneo@gmail.com';
    }

    try {
      // =========================================================
      // LÓGICA REAL DE SUPABASE (Autenticación)
      // =========================================================
      const { error } = await supabase.auth.signInWithPassword({
        email: correoParaSupabase,
        password: password,
      });

      if (error) {
        setErrorMensaje("Usuario o código de acceso incorrecto.");
        setCargando(false);
        return;
      }
      
      // Si el login es exitoso, redirigimos al panel
      router.push('/admin');

    } catch (err) {
      setErrorMensaje("Ocurrió un error inesperado al conectar.");
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
      
      {/* Brillo de fondo */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl fade-in-up">
        
        <header className="text-center mb-10">
          <div className="w-16 h-16 border border-[#D4AF37]/50 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" ariaHidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-sm">
            Galería Nilson
          </h1>
          <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-[0.3em] font-bold">
            Portal Exclusivo del Artista
          </p>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[9px] text-[#D4AF37]/70 italic tracking-widest">
              "El arte no reproduce lo visible, hace visible lo invisible."
            </p>
          </div>
        </header>

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off" noValidate>
          
          <div className="space-y-2 group">
            <label htmlFor="username" className="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold group-focus-within:text-[#D4AF37] transition-colors">
              Usuario
            </label>
            <input 
              id="username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              type="text" 
              required 
              spellCheck="false"
              autoComplete="username"
              placeholder="Ej: Nilson Contemporaneo" 
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-[#D4AF37]/80 focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all duration-300 text-sm placeholder:text-neutral-700" 
            />
          </div>

          <div className="space-y-2 group">
            <label htmlFor="password" className="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold group-focus-within:text-[#D4AF37] transition-colors">
              Código de Acceso
            </label>
            <input 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              required 
              autoComplete="current-password"
              placeholder="••••••••" 
              className="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-[#D4AF37]/80 focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all duration-300 text-sm placeholder:text-neutral-700" 
            />
          </div>

          {errorMensaje && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-xl uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)] animate-in fade-in zoom-in duration-300">
              {errorMensaje}
            </div>
          )}

          <button 
            type="submit" 
            disabled={cargando} 
            className="w-full py-4 mt-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]"
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                Verificando...
              </span>
            ) : (
              <span>Ingresar al Estudio</span>
            )}
          </button>

        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </main>
  );
}
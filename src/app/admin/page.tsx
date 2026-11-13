"use client";
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

import { Menu, X, Plus, Search, Image as ImageIcon, BarChart3, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminPanel() {
  const router = useRouter();

  // Estados de navegación
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState<'inventario' | 'metricas'>('inventario');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados de datos
  const [series, setSeries] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);

  // Estados de los Modales (Formularios)
  const [showModalSerie, setShowModalSerie] = useState(false);
  const [showModalObra, setShowModalObra] = useState(false);

  // Estados de IMÁGENES (NUEVO)
  const [imagenesPreview, setImagenesPreview] = useState<Record<number, string>>({});
  const [imagenesFiles, setImagenesFiles] = useState<Record<number, File | null>>({});

  // Estados del Formulario de OBRA
  const [tipoAutor, setTipoAutor] = useState<'artista' | 'otro'>('artista');
  const [formObra, setFormObra] = useState({
    id: null as number | null,
    titulo: '',
    autorNombre: '',
    serieSeleccionada: '',
    tipoObra: 'Pintura',
    precio: '',
    medidas: '',
    tecnica: '',
    descripcion: ''
  });

  const [nuevaSerie, setNuevaSerie] = useState('');

  // ==========================================
  // CONEXIÓN SUPABASE: Proteger ruta y Cargar Datos
  // ==========================================
  useEffect(() => {
    const verificarYcargarDatos = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: dataObras } = await supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });
      if (dataObras) setObras(dataObras);

      const { data: dataSeries } = await supabase
        .from('series')
        .select('*');
      if (dataSeries) setSeries(dataSeries);
    };

    verificarYcargarDatos();
  }, [router]);

  // ==========================================
  // FUNCIONES DE INTERFAZ E IMÁGENES
  // ==========================================

  // Función para manejar la selección de fotos de la PC (NUEVO)
  const handleImageSelect = (num: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Guardamos el archivo real para subirlo a Supabase más adelante
      setImagenesFiles(prev => ({ ...prev, [num]: file }));
      // Creamos una URL temporal para mostrar la foto en el recuadro
      setImagenesPreview(prev => ({ ...prev, [num]: URL.createObjectURL(file) }));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleGuardarSerie = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from('series').insert([{ nombre: nuevaSerie }]).select();
    if (data) {
      setSeries([...series, data[0]]);
      setShowModalSerie(false);
      setNuevaSerie('');
    }
  };

  const handleGuardarObra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isArtista = tipoAutor === 'artista';
    const obraParaGuardar = {
      titulo: formObra.titulo,
      autor: isArtista ? 'Nilson' : formObra.autorNombre,
      galeria: isArtista ? 'contemporaneo' : 'privada',
      serie: isArtista ? formObra.serieSeleccionada : null,
      tipo: formObra.tipoObra,
      precio: parseFloat(formObra.precio) || 0,
      medidas: formObra.medidas,
      tecnica: formObra.tecnica,
      descripcion: formObra.descripcion
    };

    // (Aquí luego agregaremos el código para subir las imagenesFiles a Supabase Storage)

    if (formObra.id) {
      const { data } = await supabase.from('obras').update(obraParaGuardar).eq('id', formObra.id).select();
      if (data) setObras(obras.map(o => o.id === formObra.id ? data[0] : o));
    } else {
      const { data } = await supabase.from('obras').insert([obraParaGuardar]).select();
      if (data) setObras([data[0], ...obras]);
    }
    
    setShowModalObra(false);
  };

  const handleEditarObra = (obra: any) => {
    const isArtista = obra.autor === 'Nilson';
    setTipoAutor(isArtista ? 'artista' : 'otro');
    setFormObra({
      id: obra.id,
      titulo: obra.titulo || '',
      autorNombre: isArtista ? '' : obra.autor,
      serieSeleccionada: isArtista ? (obra.serie || '') : '',
      tipoObra: obra.tipo || 'Pintura',
      precio: obra.precio ? obra.precio.toString() : '',
      medidas: obra.medidas || '',
      tecnica: obra.tecnica || '',
      descripcion: obra.descripcion || ''
    });
    // Limpiamos las fotos al abrir el modal para editar (después cargaremos las de la BD)
    setImagenesPreview({});
    setImagenesFiles({});
    setShowModalObra(true);
  };

  const handleEliminarObra = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
      const { error } = await supabase.from('obras').delete().eq('id', id);
      if (!error) {
        setObras(obras.filter(o => o.id !== id));
      } else {
        alert('Error al eliminar la obra');
      }
    }
  };

  const obrasFiltradas = useMemo(() => {
    if (!searchQuery) return obras;
    return obras.filter(o => 
      o.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.autor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [obras, searchQuery]);

  const metricas = useMemo(() => {
    return {
      total: obras.length,
      pinturas: obras.filter(o => o.tipo === 'Pintura').length,
      esculturas: obras.filter(o => o.tipo === 'Escultura').length,
      contemporaneo: obras.filter(o => o.galeria === 'contemporaneo').length,
      privada: obras.filter(o => o.galeria === 'privada').length,
    };
  }, [obras]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex antialiased">
      
      {menuAbierto && (
        <div onClick={() => setMenuAbierto(false)} className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`w-64 bg-black border-r border-white/10 p-6 md:p-8 flex flex-col fixed top-0 left-0 bottom-0 md:relative z-50 transition-transform duration-300 ease-in-out ${menuAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="flex flex-col mb-10 text-[#D4AF37]">
          <div className="flex items-center justify-between gap-3">
            <span className="font-serif text-xl tracking-tighter uppercase">Galería Nilson</span>
            <button onClick={() => setMenuAbierto(false)} className="md:hidden text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">Gestión de Galería</span>
        </div>
        
        <nav className="space-y-4 flex-1">
          <button 
            onClick={() => { setPestañaActiva('inventario'); setMenuAbierto(false); }} 
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${pestañaActiva === 'inventario' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner border border-[#D4AF37]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} />
            <span className="font-bold text-xs uppercase tracking-widest">Inventario Arte</span>
          </button>

          <button 
            onClick={() => { setPestañaActiva('metricas'); setMenuAbierto(false); }} 
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${pestañaActiva === 'metricas' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner border border-[#D4AF37]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
          >
            <BarChart3 size={18} />
            <span className="font-bold text-xs uppercase tracking-widest">Métricas Arte</span>
          </button>
        </nav>
        
        <Link href="/exposiciones/contemporaneo" className="text-neutral-500 hover:text-white transition-colors duration-300 flex items-center gap-2 text-[10px] uppercase font-bold pt-4 border-t border-white/10 tracking-widest mb-4">
          ← GALERÍA PÚBLICA
        </Link>

        <button onClick={handleLogout} className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl flex items-center gap-3 transition-all duration-300 text-[10px] font-bold uppercase tracking-widest">
          <LogOut size={16} />
          CERRAR SESIÓN
        </button>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* NAV SUPERIOR */}
        <nav className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 md:p-6 flex items-center justify-between gap-3 shadow-sm">
          <button onClick={() => setMenuAbierto(true)} className="md:hidden text-[#D4AF37] p-2 bg-white/5 rounded-xl">
            <Menu size={24} />
          </button>

          {pestañaActiva === 'inventario' ? (
            <div className="flex-1 max-w-md relative group">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Buscar obra o autor..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs md:text-sm outline-none focus:border-[#D4AF37]/50 text-white transition-all"
              />
              <Search size={16} className="absolute left-4 top-3 text-neutral-500 group-focus-within:text-[#D4AF37] transition-colors" />
            </div>
          ) : (
            <div className="flex-1"><h2 className="text-xl font-serif text-white">Métricas de la Galería</h2></div>
          )}
          
          {pestañaActiva === 'inventario' && (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowModalSerie(true)} className="hidden md:flex bg-white/10 text-white px-4 py-2.5 rounded-full font-bold hover:bg-white/20 transition-all text-xs uppercase tracking-widest items-center gap-2">
                <Plus size={16} /> SERIE
              </button>
              <button onClick={() => {
                  setTipoAutor('artista');
                  setFormObra({ id: null, titulo: '', autorNombre: '', serieSeleccionada: '', tipoObra: 'Pintura', precio: '', medidas: '', tecnica: '', descripcion: '' });
                  // Limpiamos visualmente las fotos al crear nueva
                  setImagenesPreview({});
                  setImagenesFiles({});
                  setShowModalObra(true);
                }} 
                className="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 rounded-full font-bold hover:bg-yellow-600 transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Plus size={16} /> OBRA
              </button>
            </div>
          )}
        </nav>

        {/* ÁREA DE CONTENIDO */}
        <div className="p-4 md:p-8 lg:p-12 overflow-y-auto flex-1">
          
          {/* VISTA INVENTARIO */}
          {pestañaActiva === 'inventario' && (
            <>
              <header className="mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif text-white">Catálogo de Arte</h1>
                  <p className="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">Gestión de Contemporáneo y Privada</p>
                </div>
                <button onClick={() => setShowModalSerie(true)} className="md:hidden text-[#D4AF37] text-xs font-bold uppercase underline">
                  + Nueva Serie
                </button>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {obrasFiltradas.map((obra) => (
                  <div key={obra.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col group relative">
                    
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-sm text-[8px] font-bold uppercase tracking-widest shadow-sm ${obra.galeria === 'contemporaneo' ? 'bg-[#D4AF37] text-black' : 'bg-white text-black'}`}>
                        {obra.galeria === 'contemporaneo' ? 'Contemporáneo' : 'Privada'}
                      </span>
                      <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10 text-[8px] text-white font-bold uppercase tracking-widest w-max">
                        {obra.tipo}
                      </span>
                    </div>

                    <div className="relative mb-4 overflow-hidden rounded-xl aspect-square bg-black flex items-center justify-center">
                      <ImageIcon className="text-neutral-700 w-12 h-12" />
                    </div>

                    <div>
                      <h3 className="text-white font-serif text-xl group-hover:text-[#D4AF37] transition-colors">{obra.titulo}</h3>
                      <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{obra.autor}</p>
                      {obra.galeria === 'contemporaneo' && (
                         <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1 italic">Serie: {obra.serie}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                      <button onClick={() => handleEditarObra(obra)} className="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Editar</button>
                      <button onClick={() => handleEliminarObra(obra.id)} className="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg text-[10px] font-bold uppercase transition-all">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VISTA MÉTRICAS */}
          {pestañaActiva === 'metricas' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 
                 <div className="bg-neutral-900 p-6 rounded-3xl border border-[#D4AF37]/30 flex flex-col justify-between h-40 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                   <span className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold">Total Obras</span>
                   <span className="text-6xl font-serif text-white">{metricas.total}</span>
                 </div>

                 <div className="bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Pinturas</span>
                   <span className="text-5xl font-serif text-white">{metricas.pinturas}</span>
                 </div>

                 <div className="bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Esculturas</span>
                   <span className="text-5xl font-serif text-white">{metricas.esculturas}</span>
                 </div>

                 <div className="bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Arte Contemporáneo</span>
                   <span className="text-4xl font-serif text-white">{metricas.contemporaneo} obras</span>
                 </div>

                 <div className="bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Colección Privada</span>
                   <span className="text-4xl font-serif text-white">{metricas.privada} obras</span>
                 </div>

                 <div className="bg-neutral-900 p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                   <span className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Series Creadas</span>
                   <span className="text-4xl font-serif text-white">{series.length} series</span>
                 </div>

               </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: NUEVA SERIE ================= */}
      {showModalSerie && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[1001] backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">Crear Nueva Serie</h2>
            <form onSubmit={handleGuardarSerie} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Nombre de la Serie</label>
                <input 
                  type="text" 
                  value={nuevaSerie}
                  onChange={(e) => setNuevaSerie(e.target.value)}
                  placeholder="Ej: Serie Génesis" 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] uppercase text-sm transition-all" 
                  required
                />
              </div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest leading-relaxed border-l-2 border-[#D4AF37] pl-3">
                Al crear esta serie, aparecerá como opción para clasificar tus propias obras (Arte Contemporáneo).
              </p>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-yellow-600 text-xs uppercase tracking-widest transition-all">Guardar Serie</button>
                <button type="button" onClick={() => setShowModalSerie(false)} className="w-1/3 bg-white/5 py-3 rounded-xl text-xs uppercase text-white font-bold tracking-widest hover:bg-white/10 transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NUEVA OBRA ================= */}
      {showModalObra && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-2 md:p-4 z-[1001] backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-2xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh]">
            <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">{formObra.id ? 'Editar Obra' : 'Publicar Nueva Obra'}</h2>
            
            <form onSubmit={handleGuardarObra} className="space-y-6">
              
              {/* ZONA DE IMÁGENES (CORREGIDA) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <label key={num} className="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all flex flex-col items-center justify-center min-h-[120px] cursor-pointer group relative overflow-hidden">
                    
                    {/* El input oculto que abre la ventana de archivos */}
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => handleImageSelect(num, e)}
                    />

                    {imagenesPreview[num] ? (
                      /* Si ya seleccionaste foto, se muestra aquí de fondo */
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={imagenesPreview[num]} alt={`Foto ${num}`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      /* Si no, mostramos el ícono gris normal */
                      <>
                        <ImageIcon className="text-neutral-500 mb-2 group-hover:text-[#D4AF37] transition-colors" />
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors relative z-10">
                          {num === 1 ? 'Foto Principal (Obligatoria)' : `Foto Detalle ${num} (Opcional)`}
                        </p>
                      </>
                    )}
                  </label>
                ))}
              </div>

              {/* ¿DE QUIÉN ES LA OBRA? */}
              <div className="bg-black/50 border border-white/10 p-5 rounded-xl space-y-4">
                <span className="block text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">1. Procedencia de la obra</span>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${tipoAutor === 'artista' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <input type="radio" name="tipoAutor" checked={tipoAutor === 'artista'} onChange={() => setTipoAutor('artista')} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tipoAutor === 'artista' ? 'border-[#D4AF37]' : 'border-neutral-500'}`}>
                      {tipoAutor === 'artista' && <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-white">Obra Propia (Nilson)</p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">Va a: Arte Contemporáneo</p>
                    </div>
                  </label>

                  <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${tipoAutor === 'otro' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <input type="radio" name="tipoAutor" checked={tipoAutor === 'otro'} onChange={() => setTipoAutor('otro')} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tipoAutor === 'otro' ? 'border-white' : 'border-neutral-500'}`}>
                      {tipoAutor === 'otro' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-white">De Otro Artista</p>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider mt-1">Va a: Colección Privada</p>
                    </div>
                  </label>
                </div>

                {/* Campos Dinámicos según procedencia */}
                <div className="pt-2">
                  {tipoAutor === 'artista' ? (
                     <select 
                       value={formObra.serieSeleccionada} 
                       onChange={(e) => setFormObra({...formObra, serieSeleccionada: e.target.value})}
                       className="w-full bg-black border border-[#D4AF37]/50 p-3 rounded-xl outline-none text-xs md:text-sm text-white appearance-none cursor-pointer" required
                     >
                       <option value="" disabled>Selecciona a qué Serie pertenece...</option>
                       {series.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                     </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="Nombre del Autor Original" 
                      value={formObra.autorNombre}
                      onChange={(e) => setFormObra({...formObra, autorNombre: e.target.value})}
                      className="w-full bg-black border border-white/30 p-3 rounded-xl outline-none text-xs md:text-sm text-white uppercase" required
                    />
                  )}
                </div>
              </div>

              {/* DATOS GENERALES */}
              <div className="space-y-4">
                <span className="block text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">2. Detalles de la Obra</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select 
                    value={formObra.tipoObra} 
                    onChange={(e) => setFormObra({...formObra, tipoObra: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs text-white uppercase appearance-none" required
                  >
                    <option value="Pintura">PINTURA</option>
                    <option value="Escultura">ESCULTURA</option>
                  </select>
                  <input type="text" placeholder="PRECIO (USD)" value={formObra.precio} onChange={(e) => setFormObra({...formObra, precio: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs text-white uppercase" required />
                  <input type="text" placeholder="DIMENSIONES (Ej: 120x80 cm)" value={formObra.medidas} onChange={(e) => setFormObra({...formObra, medidas: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs text-white uppercase" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-2"><span className="text-base">🇪🇸</span> ESPAÑOL</h4>
                    <input type="text" placeholder="TÍTULO DE LA OBRA" value={formObra.titulo} onChange={(e) => setFormObra({...formObra, titulo: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-xs text-white uppercase outline-none" required />
                    <input type="text" placeholder="TÉCNICA (Ej: Óleo sobre lienzo)" value={formObra.tecnica} onChange={(e) => setFormObra({...formObra, tecnica: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-xs text-white uppercase outline-none" required />
                  </div>
                  
                  <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-2"><span className="text-base">🇺🇸</span> ENGLISH</h4>
                    <input type="text" placeholder="ARTWORK TITLE" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-xs text-[#D4AF37] italic uppercase outline-none" required />
                    <input type="text" placeholder="TECHNIQUE (Ej: Oil on canvas)" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-xs text-[#D4AF37] italic uppercase outline-none" required />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button type="submit" className="flex-1 bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 text-xs uppercase tracking-widest transition-all">
                  {formObra.id ? 'GUARDAR CAMBIOS' : 'PUBLICAR OBRA'}
                </button>
                <button type="button" onClick={() => setShowModalObra(false)} className="w-1/3 bg-red-500/10 py-4 rounded-xl text-xs uppercase text-red-500 font-bold tracking-widest hover:bg-red-500/20 transition-all">CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
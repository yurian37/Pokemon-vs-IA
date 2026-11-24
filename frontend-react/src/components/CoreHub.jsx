import React, { useState } from 'react';
import { TypeIcon } from './TypeIcons';
import { TYPE_COLORS, POKEMON_TYPES } from '../services/pokemonService';

export default function CoreHub({ onNavigate, onOpenLegal }) {
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [selectedBgType, setSelectedBgType] = useState('Fire');

  const activities = [
    {
      id: 'stat-battle',
      num: 1,
      title: '¿Quién la tiene más grande?',
      subtitle: 'Duelo de Stats a Muerte Súbita',
      desc: 'Dos bichos frente a frente. Una estadística al azar. Adivina cuál pega más duro o aguanta más leña antes de irte a la mierda.',
      badge: 'Puro Músculo',
      typeTheme: 'Fighting',
      icon: '⚔️'
    },
    {
      id: 'type-duel',
      num: 2,
      title: '¿De qué carajos es este bicho?',
      subtitle: 'Alcánzame si tienes huevos',
      desc: 'Solo ves la sombra misteriosa. La IA parte con 5 puntos de ventaja porque es una tramposa. ¿La vas a alcanzar o te vas a acobardar?',
      badge: 'Persecución Callejera',
      typeTheme: 'Electric',
      icon: '🎯'
    },
    {
      id: 'type-betting',
      num: 3,
      title: 'El tipo sí importa, no jodas',
      subtitle: 'Apuesta tus Fichas o Vete Pelado',
      desc: '1 tipo en la mira, 3 candidatos. Suelta 5 fichas por ronda. La IA tira billetes infinitos. Triplica tus fichas en su cara o quiebra miserablemente.',
      badge: 'Ruleta Clandestina',
      typeTheme: 'Dark',
      icon: '🪙'
    },
    {
      id: 'type-analysis',
      num: 4,
      title: 'Escáner de Aura: ¿Qué engendro eres?',
      subtitle: 'Visión de IA sin Filtros',
      desc: 'Sube tu foto, a tu mascota o cualquier mamarracho. La red neuronal le saca los colores y te escupe el Top 5 de tipos elementales sin anestesia.',
      badge: 'Rayos X Neuronal',
      typeTheme: 'Psychic',
      icon: '🔮'
    },
    {
      id: 'create-pokemon',
      num: 5,
      title: 'Crea a tu Monstruosidad',
      subtitle: 'Laboratorio de Engendros KNN',
      desc: 'Sube una imagen, métele tipos y si te da pereza inventar números, que el algoritmo KNN dopado con esteroides te calcule las stats faltantes.',
      badge: 'Bio-Hack con Esteroides',
      typeTheme: 'Dragon',
      icon: '🧬'
    }
  ];

  const currentTheme = TYPE_COLORS[selectedBgType] || TYPE_COLORS.Fire;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 py-4 px-4 animate-fadeIn relative">
      
      {/* FONDO DINÁMICO CON DEGRADACIÓN DEL TIPO SELECCIONADO */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-30 transition-all duration-1000"
        style={{ background: currentTheme.bgGradientCss }}
      />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* BARRA SELECTORA DE LOS 18 FONDOS DEGRADADOS & SVGs DE CADA TIPO */}
      <div className="w-full bg-[#0d1322]/95 border border-slate-800/80 rounded-3xl p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>⚡</span> Personaliza el Aura Elemental del Club (18 Tipos Oficiales):
          </span>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Aura: {selectedBgType}
          </span>
        </div>

        {/* 18 BOTONES CON SU SVG ARTESANAL Y DEGRADADO PROPIO */}
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-1.5">
          {POKEMON_TYPES.map(t => {
            const tColor = TYPE_COLORS[t];
            const isSelected = selectedBgType === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedBgType(t)}
                className={`p-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer border ${
                  isSelected 
                    ? 'border-white scale-110 shadow-lg z-10' 
                    : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{ 
                  background: isSelected ? tColor.bgGradientCss : '#141a2e',
                  boxShadow: isSelected ? `0 0 16px ${tColor.glow}` : 'none'
                }}
                title={`Cambiar aura a Tipo ${t}`}
              >
                <div className="w-5 h-5 flex items-center justify-center filter drop-shadow">
                  <TypeIcon type={t} size={18} />
                </div>
                <span className="text-[8px] font-black tracking-tight text-white truncate max-w-full">
                  {t}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BANNER AVISO LEGAL DESENFADADO PERO SERIO */}
      <div className="w-full bg-[#11172a]/90 border border-amber-500/30 rounded-2xl p-3 md:px-5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚖️</span>
          <p className="text-slate-300 text-[11px] sm:text-xs">
            <strong className="text-amber-300">Proyecto 100% de a gratis y sin negocio:</strong> Aquí nadie le roba nada a Nintendo ni Game Freak. Todo el universo Pokémon le pertenece a <span className="text-white font-semibold">© Nintendo / Creatures / Game Freak</span>. No se te cobra ni medio cinco por jugar acá.
          </p>
        </div>
        <button
          onClick={onOpenLegal}
          className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap"
        >
          Deslinde Legal →
        </button>
      </div>

      {/* SECCIÓN DEL NÚCLEO CENTRAL CON ACTIVIDADES ALREDEDOR */}
      <section className="w-full relative flex flex-col items-center justify-center py-4">
        
        {/* Glow dinámico del tipo seleccionado */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-40 transition-colors duration-1000"
          style={{ backgroundColor: currentTheme.border }}
        />

        {/* TÍTULO Y PRESENTACIÓN DESCARADA */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-black uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Zona de Combate contra Algoritmos
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
            POKEMIND <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-indigo-400 drop-shadow-[0_4px_20px_rgba(239,68,68,0.5)]">GAMES CR</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed font-medium">
            ¡Deja los rodeos y mídete contra los modelos de Machine Learning! Nada de amiguitos ni equipos: eres tú solo intentando no quedar como un novato frente a redes neuronales, visión artificial y un KNN más tramposo que la vieja guardia.
          </p>
        </div>

        {/* ORBITAL HUB DISPLAY (Desktop & Tablet) */}
        <div className="relative w-full max-w-4xl h-[560px] hidden md:flex items-center justify-center">
          
          {/* Anillos orbitales con rotación */}
          <div className="absolute w-[470px] h-[470px] rounded-full border border-indigo-500/30 border-dashed animate-[spin_50s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-red-500/20 pointer-events-none" />

          {/* EL NÚCLEO CENTRAL - POKÉBOLA CIBERNÉTICA UNDERGROUND */}
          <div 
            className="relative z-20 flex flex-col items-center justify-center w-60 h-60 rounded-full border-4 shadow-2xl p-4 text-center group cursor-pointer transition-transform duration-500 hover:scale-105"
            style={{ 
              background: currentTheme.bgGradientCss,
              borderColor: currentTheme.border,
              boxShadow: `0 0 50px ${currentTheme.glow}`
            }}
          >
            <div className="absolute inset-2 rounded-full border border-white/20 animate-pulse pointer-events-none" />
            
            {/* Pokébola interactiva */}
            <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-slate-950 shadow-2xl mb-2">
              <div className="w-full h-1/2 bg-gradient-to-b from-red-600 to-rose-700 border-b-2 border-black" />
              <div className="w-full h-1/2 bg-slate-100" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
            </div>

            <span className="text-sm font-black uppercase tracking-wider text-white drop-shadow">
              EL NÚCLEO
            </span>
            <span className="text-[10px] text-white/90 font-bold mt-0.5">
              1,215 Bichos en Memoria
            </span>
            <span className="text-[9px] text-white font-black bg-black/50 px-2.5 py-0.5 rounded-full border border-white/20 mt-1.5 flex items-center gap-1">
              <TypeIcon type={selectedBgType} size={12} /> PokéAPI HD Conectada
            </span>
          </div>

          {/* LAS 5 ACTIVIDADES ORBITANDO ALREDEDOR */}
          {activities.map((act, index) => {
            const angle = (index * (360 / 5) - 90) * (Math.PI / 180);
            const radius = 235;
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            const isHovered = hoveredActivity === act.id;
            const actTheme = TYPE_COLORS[act.typeTheme] || TYPE_COLORS.Fire;

            return (
              <div
                key={act.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                onMouseEnter={() => setHoveredActivity(act.id)}
                onMouseLeave={() => setHoveredActivity(null)}
                onClick={() => onNavigate(act.id)}
                className={`absolute z-30 w-56 p-3.5 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-2xl ${
                  isHovered
                    ? 'scale-110 -translate-y-1 z-40 bg-[#162035]'
                    : 'bg-[#0f1628]/95 border-slate-800 hover:border-slate-600'
                }`}
                style={{
                  borderColor: isHovered ? actTheme.border : undefined,
                  boxShadow: isHovered ? `0 0 25px ${actTheme.glow}` : undefined
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-6 h-6 rounded-lg text-white text-xs font-black flex items-center justify-center shadow-md"
                      style={{ background: actTheme.bgGradientCss }}
                    >
                      {act.num}
                    </span>
                    <TypeIcon type={act.typeTheme} size={16} />
                  </div>
                  <span className="text-[9px] font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {act.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{act.icon}</span>
                  <h4 className="text-xs font-black text-white truncate">{act.title}</h4>
                </div>

                <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight mb-2.5">
                  {act.desc}
                </p>

                <button 
                  className="w-full py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  style={{ background: actTheme.bgGradientCss }}
                >
                  Entrar a Pelear →
                </button>
              </div>
            );
          })}

        </div>

        {/* LISTADO DE TARJETAS RESPONSIVE */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:mt-8">
          {activities.map(act => {
            const actTheme = TYPE_COLORS[act.typeTheme] || TYPE_COLORS.Fire;
            return (
              <div
                key={act.id}
                onClick={() => onNavigate(act.id)}
                className="p-6 rounded-3xl bg-[#0f172a]/95 border border-slate-800 hover:border-slate-600 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-xl relative overflow-hidden"
                style={{
                  boxShadow: `0 10px 30px -10px ${actTheme.glow}`
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-15 rounded-full blur-2xl pointer-events-none"
                  style={{ backgroundColor: actTheme.border }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-9 h-9 rounded-xl text-white font-black flex items-center justify-center shadow-lg text-sm"
                        style={{ background: actTheme.bgGradientCss }}
                      >
                        {act.num}
                      </span>
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <TypeIcon type={act.typeTheme} size={18} />
                      </div>
                    </div>
                    <span className="text-xs font-black text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                      {act.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{act.icon}</span>
                    <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                      {act.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-slate-400 block mb-2">
                    {act.subtitle}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                    Desafiar al modelo
                  </span>
                  <span className="text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform">
                    Darle caña →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* METADATOS TÉCNICOS EN TONO DESENFADADO */}
      <section className="w-full bg-[#0d1322]/90 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h4 className="text-sm font-black text-white">
              Cerebro del Club: Redes Neuronales & KNN con Rabia
            </h4>
            <p className="text-xs text-slate-400">
              Corriendo Keras (43 In / 6 Out), KNN logístico pesado y clasificador espectral de aura. No te confíes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            Especies: <strong className="text-amber-400">1,215</strong>
          </span>
          <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            API: <strong className="text-emerald-400">PokéAPI Oficial</strong>
          </span>
        </div>
      </section>

    </div>
  );
}

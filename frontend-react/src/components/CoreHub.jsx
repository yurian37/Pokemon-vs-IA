import React, { useState } from 'react';

export default function CoreHub({ onNavigate }) {
  const [hoveredActivity, setHoveredActivity] = useState(null);

  const activities = [
    {
      id: 'stat-battle',
      num: 1,
      title: '¿Quién tiene más?',
      subtitle: 'Higher or Lower Stat Duel',
      desc: 'Dos Pokémon frente a frente. Una estadística aleatoria. Adivina cuál tiene el mayor valor. Racha infinita hasta el Game Over.',
      badge: 'Stats Engine',
      color: 'from-amber-500 to-red-500',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
      icon: '⚔️'
    },
    {
      id: 'type-duel',
      num: 2,
      title: '¿De qué tipo es?',
      subtitle: 'Tablero Alcánzame vs IA',
      desc: 'Solo la silueta/imagen sin nombre. 4 opciones sin tipos nulos. La IA parte con +5 de ventaja. ¿Lograrás alcanzarla antes de que escape?',
      badge: 'Visión IA & Turnos',
      color: 'from-indigo-500 to-purple-500',
      border: 'border-indigo-500/40',
      glow: 'shadow-indigo-500/20',
      icon: '🎯'
    },
    {
      id: 'type-betting',
      num: 3,
      title: 'El tipo sí importa',
      subtitle: 'Apuesta de Fichas vs IA',
      desc: '1 tipo objetivo, 3 Pokémon. 15 fichas iniciales, apuestas de 5 por ronda. La IA arriesga fichas ilimitadas. Multiplica hasta x3 o pierde.',
      badge: 'Probabilidad & Estrategia',
      color: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      icon: '🪙'
    },
    {
      id: 'type-analysis',
      num: 4,
      title: 'Análisis de Tipos',
      subtitle: 'Escáner de Aura Elemental',
      desc: 'Carga cualquier imagen y el modelo convolucional/cromático determinará el Top 5 de tipos con porcentajes en Barras Horizontales o Circular.',
      badge: 'Red Convolucional',
      color: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/40',
      glow: 'shadow-cyan-500/20',
      icon: '🔮'
    },
    {
      id: 'create-pokemon',
      num: 5,
      title: 'Crea a tu Pokémon',
      subtitle: 'Laboratorio de Síntesis KNN',
      desc: 'Pipeline paso a paso: Imagen -> Tipos 1 y 2 -> 6 Estadísticas. Predice stats faltantes con un KNN logístico (k=5) con factor de doble fuerza.',
      badge: 'KNN Logístico (k=5)',
      color: 'from-rose-500 to-pink-500',
      border: 'border-rose-500/40',
      glow: 'shadow-rose-500/20',
      icon: '🧬'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12 py-6 px-4 animate-fadeIn">
      
      {/* SECCIÓN DEL NÚCLEO CENTRAL CON ACTIVIDADES ALREDEDOR */}
      <section className="w-full relative flex flex-col items-center justify-center py-8">
        
        {/* Glow de fondo */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* TÍTULO Y PRESENTACIÓN */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Arquitectura de 5 Módulos Activos
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            EL NÚCLEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-indigo-400">POKÉMON VS IA</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed">
            Aquí no hay equipos ni competencia entre personas: es únicamente el jugador enfrentándose a modelos de Machine Learning (Keras, KNN Logístico y Visión Computacional) impulsados por la PokéAPI oficial.
          </p>
        </div>

        {/* ORBITAL HUB DISPLAY (Desktop & Tablet) */}
        <div className="relative w-full max-w-4xl h-[560px] hidden md:flex items-center justify-center">
          
          {/* Anillos orbitales decorativos */}
          <div className="absolute w-[460px] h-[460px] rounded-full border border-indigo-500/20 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-cyan-500/20 pointer-events-none" />

          {/* EL NÚCLEO CENTRAL */}
          <div className="relative z-20 flex flex-col items-center justify-center w-56 h-56 rounded-full bg-[#111728] border-2 border-indigo-400/50 shadow-[0_0_50px_rgba(99,102,241,0.35)] p-4 text-center group cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-pulse pointer-events-none" />
            
            {/* Pokébola central animada */}
            <div className="w-16 h-16 rounded-full relative overflow-hidden border-2 border-slate-900 shadow-inner mb-2">
              <div className="w-full h-1/2 bg-gradient-to-b from-red-500 to-red-600 border-b border-slate-950" />
              <div className="w-full h-1/2 bg-slate-100" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">
              CORE KERNEL
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              1,215 Pokémon Indexados
            </span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1.5">
              PokéAPI Online
            </span>
          </div>

          {/* LAS 5 ACTIVIDADES ORBITANDO ALREDEDOR */}
          {activities.map((act, index) => {
            // Posiciones en círculo para los 5 puntos (ángulos 0°, 72°, 144°, 216°, 288° rotados para centrar arriba)
            const angle = (index * (360 / 5) - 90) * (Math.PI / 180);
            const radius = 230; // Distancia al centro en px
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            const isHovered = hoveredActivity === act.id;

            return (
              <div
                key={act.id}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                onMouseEnter={() => setHoveredActivity(act.id)}
                onMouseLeave={() => setHoveredActivity(null)}
                onClick={() => onNavigate(act.id)}
                className={`absolute z-30 w-52 p-3.5 rounded-2xl bg-[#141b2d]/95 backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-xl ${
                  isHovered
                    ? `${act.border} ${act.glow} scale-110 -translate-y-1 z-40 bg-[#1c243d]`
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${act.color} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                    {act.num}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {act.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{act.icon}</span>
                  <h4 className="text-xs font-black text-white truncate">{act.title}</h4>
                </div>

                <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight mb-2.5">
                  {act.desc}
                </p>

                <button className={`w-full py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${act.color} opacity-90 hover:opacity-100 transition-opacity flex items-center justify-center gap-1 shadow-sm`}>
                  Iniciar Módulo →
                </button>
              </div>
            );
          })}

        </div>

        {/* LISTADO DE TARJETAS RESPONSIVE (Móvil y accesibilidad) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:mt-8">
          {activities.map(act => (
            <div
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className={`p-6 rounded-3xl bg-[#141b2d] border border-slate-800 hover:${act.border} hover:${act.glow} transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${act.color} text-white font-black flex items-center justify-center shadow-lg text-sm`}>
                    {act.num}
                  </span>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {act.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{act.icon}</span>
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                    {act.title}
                  </h3>
                </div>

                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  {act.subtitle}
                </span>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                  Jugar contra el modelo
                </span>
                <span className={`text-xs font-black text-transparent bg-clip-text bg-gradient-to-r ${act.color} group-hover:translate-x-1 transition-transform`}>
                  Comenzar →
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* METADATOS TÉCNICOS DE MACHINE LEARNING */}
      <section className="w-full bg-[#111728]/80 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl">
            🤖
          </div>
          <div>
            <h4 className="text-sm md:text-base font-black text-white">
              Arquitectura de Inteligencia Artificial Conectada
            </h4>
            <p className="text-xs text-slate-400">
              Modelos cargados: Keras Multicapa (43 In / 6 Out), KNN Ponderado (k=5) y Resonancia Espectral de Aura.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 font-mono">
            Datasets: <span className="text-amber-400 font-bold">1,215</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 font-mono">
            API: <span className="text-emerald-400 font-bold">PokéAPI Official</span>
          </div>
        </div>
      </section>

    </div>
  );
}

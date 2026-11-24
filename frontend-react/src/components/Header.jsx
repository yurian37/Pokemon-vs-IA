import React from 'react';

export default function Header({ currentScreen, onNavigate, onOpenLegal }) {
  const activities = [
    { id: 'stat-battle', num: '1', title: '¿Quién tiene más?', short: 'Stats' },
    { id: 'type-duel', num: '2', title: '¿De qué tipo es?', short: 'Alcánzame' },
    { id: 'type-betting', num: '3', title: 'El tipo sí importa', short: 'Fichas' },
    { id: 'type-analysis', num: '4', title: 'Análisis de Tipos', short: 'Aura IA' },
    { id: 'create-pokemon', num: '5', title: 'Crea a tu Pokémon', short: 'Laboratorio' },
  ];

  return (
    <header className="bg-[#0f1423]/95 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-50 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* LOGO & NUCLEO LINK */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-indigo-500 to-amber-400 blur-sm opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative w-9 h-9 rounded-full bg-[#131b2e] border-2 border-indigo-400/60 flex items-center justify-center overflow-hidden">
              <div className="w-full h-1/2 bg-red-600 border-b border-black/80" />
              <div className="w-full h-1/2 bg-slate-200" />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-indigo-300">
                POKÉMON
              </span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded bg-indigo-600/80 text-indigo-100 border border-indigo-400/40">
                VS IA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
              Machine Learning & Trivia Battle Platform
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN DE ACTIVIDADES ALREDEDOR */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            El Núcleo
          </button>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {activities.map(act => (
            <button
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentScreen === act.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title={act.title}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentScreen === act.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {act.num}
              </span>
              <span className="hidden lg:inline">{act.title}</span>
              <span className="lg:hidden">{act.short}</span>
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* BOTÓN AVISO LEGAL */}
          <button
            onClick={onOpenLegal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-300/80 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            title="Aviso Legal: Sin fines de lucro y derechos de Pokémon"
          >
            <span>⚖️</span>
            <span className="hidden sm:inline">Aviso Legal</span>
          </button>
        </nav>

      </div>
    </header>
  );
}

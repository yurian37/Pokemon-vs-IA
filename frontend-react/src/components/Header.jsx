import React, { useState } from 'react';
import logoEmblem from '../assets/logo-emblem.png';
import { TypeIcon } from './TypeIcons';
import { POKEMON_TYPES, TYPE_COLORS, TYPE_ES } from '../services/pokemonService';
import { sfx } from '../services/soundService';

export default function Header({ currentScreen, onNavigate, onOpenLegal, selectedBgType, onSelectBgType }) {
  const [muted, setMuted] = useState(sfx.isMuted());
  const [auraOpen, setAuraOpen] = useState(false);

  const activities = [
    { id: 'stat-battle', num: '01', short: 'Stats', full: '¿Quién tiene más?' },
    { id: 'type-duel', num: '02', short: 'Alcánzame', full: '¿De qué tipo es?' },
    { id: 'type-betting', num: '03', short: 'Fichas', full: 'El tipo sí importa' },
    { id: 'type-analysis', num: '04', short: 'Aura IA', full: 'Escáner de Aura' },
    { id: 'create-pokemon', num: '05', short: 'Forja KNN', full: 'Crea tu Bicho' },
  ];

  const activeTheme = TYPE_COLORS[selectedBgType] || TYPE_COLORS.Fire;

  const handleToggleSound = () => {
    const nextMuted = sfx.toggleMute();
    setMuted(nextMuted);
  };

  const handleNav = (id) => {
    sfx.click();
    setAuraOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#111827] shadow-[0_4px_0_rgba(17,24,39,0.12)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* MARCA REAL CON LOGO EMBLEMA (SIN RAYO DE REACT) */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          aria-label="Ir al Núcleo de PokeMind Games CR"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FFFDF7] border-[2.5px] border-[#111827] shadow-ink-sm p-1 flex items-center justify-center group-hover:-rotate-6 transition-transform">
            <img
              src={logoEmblem}
              alt="PokeMind Games CR"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="leading-none">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#1E3A5F]">
                POKEMIND
              </span>
              <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#D9383A] text-white border-[1.5px] border-[#111827]">
                GAMES CR
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider block mt-0.5">
              Arcade vs IA • Sin Piedad
            </span>
          </div>
        </button>

        {/* CARTUCHOS DE NAVEGACIÓN (FLEX-WRAP PARA 0 OVERFLOW) */}
        <nav className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleNav('home')}
            className={`arcade-btn px-3 py-1.5 rounded-xl font-display font-extrabold text-xs uppercase tracking-wide cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-[#111827] text-[#FFD43B]'
                : 'bg-white text-[#111827] hover:bg-[#FFF3BF]'
            }`}
          >
            El Núcleo
          </button>

          {activities.map((act) => {
            const isActive = currentScreen === act.id;
            return (
              <button
                key={act.id}
                onClick={() => handleNav(act.id)}
                title={act.full}
                className={`arcade-btn px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#D9383A] text-white'
                    : 'bg-white text-[#111827] hover:bg-[#F3EFE2]'
                }`}
              >
                <span
                  className={`font-mono text-[10px] font-extrabold px-1 py-0.5 rounded ${
                    isActive ? 'bg-[#111827] text-[#FFD43B]' : 'bg-[#111827]/10 text-[#111827]'
                  }`}
                >
                  {act.num}
                </span>
                <span className="hidden xl:inline">{act.full}</span>
                <span className="xl:hidden">{act.short}</span>
              </button>
            );
          })}
        </nav>

        {/* CONTROLES DE CONSOLA: AURA 18 TIPOS, SFX Y LEGAL */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              sfx.click();
              setAuraOpen((v) => !v);
            }}
            className="arcade-btn px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer text-white"
            style={{ background: activeTheme.bgGradientCss }}
            title="Cambiar fondo elemental (18 tipos)"
          >
            <TypeIcon type={selectedBgType} size={16} />
            <span className="hidden sm:inline font-extrabold drop-shadow-sm">
              {TYPE_ES[selectedBgType] || selectedBgType}
            </span>
            <span className="text-[10px] opacity-90">{auraOpen ? '▲' : '▼'}</span>
          </button>

          <button
            onClick={handleToggleSound}
            className={`arcade-btn px-2.5 py-1.5 rounded-xl font-mono font-extrabold text-xs cursor-pointer ${
              muted ? 'bg-slate-200 text-slate-600' : 'bg-[#FFD43B] text-[#111827]'
            }`}
            title={muted ? 'Activar sonidos arcade' : 'Silenciar sonidos arcade'}
            aria-label={muted ? 'Activar sonidos arcade' : 'Silenciar sonidos arcade'}
          >
            {muted ? 'SFX OFF' : 'SFX ON'}
          </button>

          <button
            onClick={() => {
              sfx.click();
              onOpenLegal();
            }}
            className="arcade-btn bg-[#1E3A5F] hover:bg-[#2C4D75] text-white px-2.5 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer"
            title="Aviso Legal: Sin fines de lucro y derechos de Pokémon"
          >
            Legal
          </button>
        </div>
      </div>

      {/* PANEL DESPLEGABLE DE LOS 18 FONDOS ELEMENTALES + 18 SVGs DESDE CUALQUIER PANTALLA */}
      {auraOpen && (
        <div className="border-t-[2.5px] border-[#111827] bg-[#FFFDF7] px-3 sm:px-6 py-3 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#111827]">
                Selector de Mundo Elemental — 18 Degradados + 18 SVGs Propios
              </span>
              <button
                onClick={() => setAuraOpen(false)}
                className="font-mono text-[11px] font-bold text-[#D9383A] hover:underline cursor-pointer"
              >
                Cerrar [X]
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-1.5">
              {POKEMON_TYPES.map((t) => {
                const tColor = TYPE_COLORS[t];
                const isSelected = selectedBgType === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      sfx.typeSwitch();
                      onSelectBgType(t);
                    }}
                    className={`arcade-btn px-2 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer text-left ${
                      isSelected ? 'ring-2 ring-[#FFD43B] ring-offset-1' : ''
                    }`}
                    style={{
                      background: tColor.bgGradientCss,
                      color: '#FFFFFF',
                    }}
                  >
                    <TypeIcon type={t} size={17} className="shrink-0" />
                    <span className="font-bold text-[11px] truncate drop-shadow-sm">
                      {TYPE_ES[t] || t}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState, useMemo } from 'react';
import { TypeIcon } from './TypeIcons';
import { TYPE_COLORS, POKEMON_TYPES, TYPE_ES, getRandomPokemon } from '../services/pokemonService';
import { sfx } from '../services/soundService';
import logoTrimmed from '../assets/logo-trimmed.png';

export default function CoreHub({ onNavigate, onOpenLegal, selectedBgType, onSelectBgType }) {
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [sparringMon, setSparringMon] = useState(() => getRandomPokemon());

  const activities = useMemo(() => [
    {
      id: 'stat-battle',
      num: '01',
      title: '¿Quién tiene más?',
      subtitle: 'Duelo de Estadísticas',
      desc: 'Dos Pokémon cara a cara y una estadística al azar. Adivina cuál tiene el número más alto. Si fallas, termina la partida.',
      badge: 'SUPERVIVENCIA',
      modelTag: 'Racha Continua',
      typeTheme: 'Fighting',
      cta: 'Iniciar Duelo',
    },
    {
      id: 'type-duel',
      num: '02',
      title: '¿De qué tipo es?',
      subtitle: 'Modo Carrera vs Máquina',
      desc: 'Solo ves la imagen del Pokémon sin su nombre. La máquina arranca con 5 puntos de ventaja y tiene 2 intentos. ¡Acierta y alcánzala para ganar!',
      badge: 'ALCÁNZAME',
      modelTag: 'Rival con 2 Tiros',
      typeTheme: 'Electric',
      cta: 'Jugar Alcánzame',
    },
    {
      id: 'type-betting',
      num: '03',
      title: 'El tipo sí importa',
      subtitle: 'Mesa de Apuestas de 15 Fichas',
      desc: 'Un tipo elemental y 3 opciones. Reparte tus 5 fichas por ronda contra las elecciones del rival. Si aciertas, multiplica tus fichas según la jugada rival.',
      badge: 'APUESTAS x3',
      modelTag: 'Apuesta 3/2 Rival',
      typeTheme: 'Dark',
      cta: 'Apostar Fichas',
    },
    {
      id: 'type-analysis',
      num: '04',
      title: 'Análisis de Tipos Pokémon',
      subtitle: 'Escáner de Tipo Elemental',
      desc: 'Sube una imagen y el sistema calculará los 5 tipos más afines según sus colores y forma, en gráfico de barras o circular.',
      badge: 'TOP 5 AFINIDAD',
      modelTag: 'Reconocimiento Visual',
      typeTheme: 'Psychic',
      cta: 'Escanear Imagen',
    },
    {
      id: 'create-pokemon',
      num: '05',
      title: 'Crea a tu Pokémon',
      subtitle: 'Taller Creativo con Predicción',
      desc: 'Sube tu diseño, elige sus tipos y define sus estadísticas. Si dejas valores vacíos, el sistema inteligente estimará los datos faltantes.',
      badge: 'CREADOR OFICIAL',
      modelTag: 'Cálculo Inteligente',
      typeTheme: 'Dragon',
      cta: 'Crear Pokémon',
    },
  ], []);

  const currentTheme = TYPE_COLORS[selectedBgType] || TYPE_COLORS.Fire;
  const activePreview = activities.find((a) => a.id === hoveredActivity);
  const monTheme = TYPE_COLORS[sparringMon?.type1] || TYPE_COLORS.Fire;

  const handleLaunch = (id) => {
    sfx.click();
    onNavigate(id);
  };

  const handleNextSparring = () => {
    sfx.chip();
    setSparringMon(getRandomPokemon(sparringMon?.id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* BANNER SUPERIOR DE AVISO LEGAL Y STATUS ARCADE */}
      <div className="arcade-panel rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0">
            100% GRATIS
          </span>
          <p className="text-xs sm:text-[13px] font-semibold text-[#111827] leading-snug">
            Sin negocio ni cobros: Pokémon es propiedad de <strong className="text-[#D9383A]">Nintendo / Creatures / Game Freak</strong>. Aquí venimos solo a patearle el trasero a los modelos de Machine Learning.
          </p>
        </div>
        <button
          onClick={() => {
            sfx.click();
            onOpenLegal();
          }}
          className="arcade-btn bg-[#111827] text-[#FFD43B] px-3 py-1.5 rounded-xl font-mono text-[11px] font-extrabold uppercase cursor-pointer shrink-0"
        >
          Ver Deslinde →
        </button>
      </div>

      {/* SELECTOR DE LOS 18 FONDOS DEGRADADOS + 18 SVGs PROPIOS */}
      <section className="arcade-panel rounded-3xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A] block">
              SELECTOR ELEMENTAL • 18 SVGs + 18 MUNDOS CON DEGRADADO
            </span>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
              Pinta toda la consola con tu tipo favorito
            </h2>
          </div>

          <div
            className="arcade-stamp px-3 py-1.5 rounded-xl flex items-center gap-2 text-white"
            style={{ background: currentTheme.bgGradientCss }}
          >
            <TypeIcon type={selectedBgType} size={18} />
            <span className="font-mono text-xs font-extrabold uppercase drop-shadow-sm">
              Mundo {TYPE_ES[selectedBgType] || selectedBgType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
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
                className={`arcade-btn rounded-xl px-2 py-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isSelected ? 'ring-[3px] ring-[#FFD43B] -translate-y-0.5' : 'opacity-90 hover:opacity-100'
                }`}
                style={{
                  background: tColor.bgGradientCss,
                  color: '#FFFFFF',
                }}
                title={`Cambiar mundo a tipo ${TYPE_ES[t]}`}
              >
                <div className="w-7 h-7 rounded-lg bg-white/90 border border-[#111827]/30 flex items-center justify-center shadow-sm">
                  <TypeIcon type={t} size={20} />
                </div>
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-tight drop-shadow-sm truncate max-w-full">
                  {TYPE_ES[t]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* HERO ASIMÉTRICO + CONSOLA RADIAL "EL NÚCLEO" */}
      <section className="arcade-panel rounded-[2rem] p-5 sm:p-7 relative overflow-hidden">
        {/* Esquinas decorativas de consola */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 arcade-stamp bg-[#D9383A] text-white px-3 py-1 rounded-lg font-mono text-[11px] font-extrabold uppercase tracking-wider mb-3 -rotate-1">
              <span className="w-2 h-2 rounded-full bg-[#FFD43B] animate-ping" />
              1 Jugador vs Algoritmos • Cero Equipos
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#111827] leading-[1.02] tracking-tight">
              TÚ SOLO CONTRA LA IA.{' '}
              <span className="inline-block px-2 py-0.5 bg-[#FFD43B] border-[2.5px] border-[#111827] rounded-xl -rotate-1">
                SIN LLORAR.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 font-medium mt-3 leading-relaxed">
              Bienvenido a <strong>PokeMind Games CR</strong>. Aquí no hay amiguitos ni partidas aburridas: elige cualquiera de los <strong>5 cartuchos alrededor del Núcleo</strong> y enfréntate directo a nuestra red neuronal, escáner visual y KNN con esteroides.
            </p>
          </div>

          {/* WIDGET VIVO: SPARRING POKÉMON DE POKÉAPI (DEMUESTRA FORMAS Y DATOS REALES) */}
          {sparringMon && (
            <div
              className="arcade-stamp rounded-2xl p-3.5 w-full sm:w-64 text-white relative overflow-hidden shrink-0"
              style={{ background: monTheme.bgGradientCss }}
            >
              <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
                <TypeIcon type={sparringMon.type1} size={110} />
              </div>

              <div className="flex items-center justify-between gap-2 relative z-10 mb-1">
                <span className="font-mono text-[10px] font-extrabold uppercase bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded">
                  POKÉDEX #{String(sparringMon.id).padStart(4, '0')}
                </span>
                <button
                  onClick={handleNextSparring}
                  className="bg-white/95 hover:bg-[#FFD43B] text-[#111827] border-[1.5px] border-[#111827] px-2 py-0.5 rounded-lg font-mono text-[10px] font-extrabold cursor-pointer transition-colors"
                  title="Ver otro espécimen aleatorio"
                >
                  ↻ Otro Pokémon
                </button>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-16 h-16 rounded-xl bg-white/90 border-2 border-[#111827] p-1 flex items-center justify-center shrink-0">
                  <img
                    src={sparringMon.image}
                    alt={sparringMon.name}
                    onError={(e) => { e.target.src = sparringMon.thumbnail; }}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-extrabold text-base leading-tight truncate drop-shadow-sm">
                    {sparringMon.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="inline-flex items-center gap-1 bg-[#111827]/85 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <TypeIcon type={sparringMon.type1} size={11} />
                      {TYPE_ES[sparringMon.type1] || sparringMon.type1}
                    </span>
                    {sparringMon.type2 && (
                      <span className="inline-flex items-center gap-1 bg-[#111827]/85 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <TypeIcon type={sparringMon.type2} size={11} />
                        {TYPE_ES[sparringMon.type2] || sparringMon.type2}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-white/95 font-bold mt-1">
                    HP {sparringMon.hp} • ATK {sparringMon.attack} • SPD {sparringMon.speed}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ORBITAL CORE RADAR (DESKTOP xl+) — EL NÚCLEO REAL CON EL LOGO EN EL CENTRO Y LAS 5 ACTIVIDADES ALREDEDOR */}
        <div
          className="hidden xl:flex relative w-full h-[620px] rounded-3xl border-[3px] border-[#111827] items-center justify-center overflow-hidden mb-6"
          style={{ background: currentTheme.bgGradientCss }}
        >
          {/* Patrón halftone blanco y anillos de radar */}
          <div className="absolute inset-0 bg-halftone-light opacity-70 pointer-events-none" />

          {/* Líneas de circuito SVG conectando el Núcleo con los 5 Cartuchos */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 620"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="500" cy="310" r="225" fill="none" stroke="rgba(17,24,39,0.35)" strokeWidth="2.5" strokeDasharray="10 8" />
            <circle cx="500" cy="310" r="145" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
            {activities.map((act, index) => {
              const angle = (index * (360 / 5) - 90) * (Math.PI / 180);
              const rx = 330;
              const ry = 215;
              const x2 = 500 + rx * Math.cos(angle);
              const y2 = 310 + ry * Math.sin(angle);
              const isHot = hoveredActivity === act.id;
              return (
                <line
                  key={act.id}
                  x1="500"
                  y1="310"
                  x2={x2}
                  y2={y2}
                  stroke={isHot ? '#FFD43B' : '#111827'}
                  strokeWidth={isHot ? 5 : 2.5}
                  strokeDasharray={isHot ? 'none' : '6 6'}
                />
              );
            })}
          </svg>

          {/* EL NÚCLEO CENTRAL CON EL LOGO REAL DE POKEMIND GAMES CR */}
          <div className="relative z-20 w-52 h-52 rounded-full bg-[#FFFDF7] border-[4px] border-[#111827] shadow-ink-lg flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 hover:scale-105">
            <div className="w-24 h-20 flex items-center justify-center mb-1">
              <img
                src={logoTrimmed}
                alt="Logo Oficial PokeMind Games CR"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {activePreview ? (
              <div className="animate-fadeIn">
                <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#D9383A] text-white">
                  CARTUCHO {activePreview.num}
                </span>
                <p className="font-display font-extrabold text-xs text-[#111827] mt-1 leading-tight px-1">
                  {activePreview.subtitle}
                </p>
              </div>
            ) : (
              <div>
                <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#111827] text-[#FFD43B]">
                  CENTRO DE JUEGOS • 1,215 POKÉMON
                </span>
                <p className="text-[11px] font-bold text-slate-600 mt-1">
                  Elige tu duelo alrededor
                </p>
              </div>
            )}
          </div>

          {/* LOS 5 CARTUCHOS ORBITANDO ALREDEDOR DEL NÚCLEO */}
          {activities.map((act, index) => {
            const angle = (index * (360 / 5) - 90) * (Math.PI / 180);
            const rx = 330;
            const ry = 215;
            const x = Math.round(rx * Math.cos(angle));
            const y = Math.round(ry * Math.sin(angle));
            const actTheme = TYPE_COLORS[act.typeTheme] || TYPE_COLORS.Fire;
            const isHovered = hoveredActivity === act.id;

            return (
              <button
                key={act.id}
                onClick={() => handleLaunch(act.id)}
                onMouseEnter={() => setHoveredActivity(act.id)}
                onMouseLeave={() => setHoveredActivity(null)}
                style={{
                  transform: `translate(${x}px, ${y}px) ${isHovered ? 'scale(1.06)' : 'scale(1)'}`,
                }}
                className={`absolute z-30 w-64 text-left bg-[#FFFDF7] border-[3px] border-[#111827] rounded-2xl p-3.5 transition-all duration-200 cursor-pointer ${
                  isHovered ? 'shadow-[7px_7px_0px_#111827] z-40' : 'shadow-ink'
                }`}
              >
                {/* Franja superior del cartucho con el degradado de su tipo */}
                <div
                  className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-xl border-2 border-[#111827] mb-2 text-white"
                  style={{ background: actTheme.bgGradientCss }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-extrabold bg-[#111827] text-[#FFD43B] px-1.5 py-0.5 rounded">
                      {act.num}
                    </span>
                    <div className="w-5 h-5 rounded bg-white/95 flex items-center justify-center">
                      <TypeIcon type={act.typeTheme} size={14} />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider drop-shadow-sm">
                    {act.badge}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-sm text-[#111827] leading-tight">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-2 leading-snug">
                  {act.desc}
                </p>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-500">
                    {act.modelTag}
                  </span>
                  <span className="font-display font-extrabold text-xs text-[#D9383A]">
                    {act.cta} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* GRID DE CARTUCHOS (VISIBLE SIEMPRE EN MÓVIL/TABLET Y COMO ACCESO RÁPIDO EN DESKTOP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((act, idx) => {
            const actTheme = TYPE_COLORS[act.typeTheme] || TYPE_COLORS.Fire;
            return (
              <button
                key={act.id}
                onClick={() => handleLaunch(act.id)}
                className={`arcade-btn bg-[#FFFDF7] rounded-2xl p-4 text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                  idx === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                {/* Franja de color de cartucho */}
                <div
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border-2 border-[#111827] mb-3 text-white"
                  style={{ background: actTheme.bgGradientCss }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded-md">
                      MODO {act.num}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-white/95 border border-[#111827]/30 flex items-center justify-center">
                      <TypeIcon type={act.typeTheme} size={16} />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider bg-[#111827]/80 px-2 py-0.5 rounded">
                    {act.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111827] group-hover:text-[#D9383A] transition-colors">
                    {act.title}
                  </h3>
                  <p className="font-mono text-[11px] font-bold uppercase text-[#1E3A5F] mt-0.5">
                    {act.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-2 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#111827]/20 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-600">
                    {act.modelTag}
                  </span>
                  <span className="arcade-stamp bg-[#FFD43B] group-hover:bg-[#D9383A] group-hover:text-white text-[#111827] px-3 py-1 rounded-lg font-display font-extrabold text-xs uppercase transition-colors">
                    {act.cta} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* PANEL DE MOTORES ML (TRANSPARENCIA SIN TECNICISMOS ABURRIDOS) */}
      <section className="arcade-panel-dark text-white rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD43B] border-2 border-[#111827] flex items-center justify-center shrink-0">
            <TypeIcon type={selectedBgType} size={28} />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-extrabold text-base sm:text-lg text-[#FFD43B]">
              Bajo el capó: Redes Neuronales + KNN con Rabia
            </h4>
            <p className="text-xs text-slate-300 font-medium">
              Keras pre-entrenado, clasificador visual cromático y KNN (k=5) con doble peso por coincidencia dual. Imágenes HD jaladas directo de PokéAPI (incluyendo Alola, Galar, Hisui y Megas).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
            ESPECIES: <strong className="text-[#FFD43B]">1,215</strong>
          </span>
          <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
            TIPOS SVG: <strong className="text-[#4ADE80]">18 / 18</strong>
          </span>
        </div>
      </section>

    </div>
  );
}

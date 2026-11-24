import React, { useState } from 'react';
import { POKEMON_TYPES, TYPE_COLORS, TYPE_ES, STAT_NAMES } from '../services/pokemonService';
import { predictStatsKNN } from '../services/mlModelsService';
import { TypeIcon } from './TypeIcons';
import HoloCard from './HoloCard';
import { sfx } from '../services/soundService';
import confetti from 'canvas-confetti';

export default function CreatePokemon({ onBackToHub }) {
  // Pipeline estricto: 1 = 5.1 Imagen, 2 = 5.2 Tipos, 3 = 5.3 Stats (KNN k=5), 4 = 5.4 Tarjeta Final
  const [pipelineStep, setPipelineStep] = useState(1);

  // 5.1 Imagen + Nombre
  const [pokeImage, setPokeImage] = useState(null);
  const [pokeName, setPokeName] = useState('Mi Monstruosidad');

  // 5.2 Tipo 1 (18 tipos) y Tipo 2 (18 tipos + 'None')
  const [type1, setType1] = useState('Fire');
  const [type2, setType2] = useState('None');

  // 5.3 6 Estadísticas iniciadas todas sin nada (1-200 enteros positivos o vacío)
  const [stats, setStats] = useState({
    hp: '',
    attack: '',
    defense: '',
    spAtk: '',
    spDef: '',
    speed: '',
  });
  const [predictedKeys, setPredictedKeys] = useState(new Set());
  const [predictionLog, setPredictionLog] = useState(null);

  const templateSprites = [
    { label: 'Charmander', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { label: 'Dragonair', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png' },
    { label: 'Umbreon', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png' },
    { label: 'Mew', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      sfx.chip();
      setPokeImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStatChange = (key, rawValue) => {
    setPredictedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    if (rawValue === '') {
      setStats((prev) => ({ ...prev, [key]: '' }));
      return;
    }

    const num = parseInt(rawValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 200) {
      setStats((prev) => ({ ...prev, [key]: num }));
    }
  };

  const statKeys = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];
  const hasEmptyStat = statKeys.some((k) => stats[k] === '' || stats[k] === null || stats[k] === undefined);
  const allStatsFilled = !hasEmptyStat;

  // Regla exacta 5.3: Predecir habilitado solo si falta alguna estadística
  const handlePredictKNN = () => {
    if (!hasEmptyStat) return;
    sfx.scan();

    const emptyBefore = new Set(statKeys.filter((k) => stats[k] === '' || stats[k] === null));
    const predicted = predictStatsKNN({
      type1,
      type2: type2 === 'None' ? null : type2,
      stats,
    });

    setStats(predicted);
    setPredictedKeys(emptyBefore);
    setPredictionLog(
      `El KNN (k=5) con doble fuerza para coincidencias exactas rellenó ${emptyBefore.size} stat(s) faltantes.`
    );
    sfx.win();
  };

  const handleClearStats = () => {
    sfx.click();
    setStats({ hp: '', attack: '', defense: '', spAtk: '', spDef: '', speed: '' });
    setPredictedKeys(new Set());
    setPredictionLog(null);
  };

  // Regla exacta 5.4: Generar habilitado solo cuando las 6 estadísticas tienen dato
  const handleGenerate = () => {
    if (!allStatsFilled) return;
    sfx.fanfare();
    setPipelineStep(4);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    sfx.click();
    setPipelineStep(1);
    setPokeImage(null);
    setPokeName('Mi Monstruosidad');
    setType1('Fire');
    setType2('None');
    setStats({ hp: '', attack: '', defense: '', spAtk: '', spDef: '', speed: '' });
    setPredictedKeys(new Set());
    setPredictionLog(null);
  };

  const type1Theme = TYPE_COLORS[type1] || TYPE_COLORS.Fire;
  const type2Theme = type2 !== 'None' ? TYPE_COLORS[type2] : null;
  const totalBaseStats = statKeys.reduce((acc, k) => acc + (Number(stats[k]) || 0), 0);
  const powerTier =
    totalBaseStats >= 680
      ? 'ROTO / DIOS'
      : totalBaseStats >= 550
      ? 'PSEUDO-LEGENDARIO'
      : totalBaseStats >= 420
      ? 'PELEADOR ÉLITE'
      : 'CALLEJERO';

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 animate-fadeIn">
      
      {/* HUD SUPERIOR + PIPELINE */}
      <div className="arcade-panel rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            sfx.click();
            onBackToHub();
          }}
          className="arcade-btn bg-white hover:bg-[#F3EFE2] text-[#111827] px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase cursor-pointer"
        >
          ← Al Núcleo
        </button>

        <span className="arcade-stamp bg-[#4F3DF5] text-white px-3 py-1 rounded-xl font-mono text-xs font-extrabold uppercase">
          MODO 05 • BIO-FORJA KNN (k=5)
        </span>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-extrabold">
          {[
            { s: 1, label: '5.1 JETA' },
            { s: 2, label: '5.2 TIPOS' },
            { s: 3, label: '5.3 STATS' },
            { s: 4, label: '5.4 CARTA' },
          ].map((p) => (
            <span
              key={p.s}
              className={`px-2.5 py-1 rounded-lg border-2 border-[#111827] ${
                pipelineStep === p.s
                  ? 'bg-[#FFD43B] text-[#111827]'
                  : pipelineStep > p.s
                  ? 'bg-[#4ADE80] text-[#111827]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* PASOS 5.1 A 5.3 CON VISTA PREVIA EN VIVO A LA DERECHA */}
      {pipelineStep < 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* COLUMNA PRINCIPAL DEL PASO ACTIVO */}
          <div className="lg:col-span-8 arcade-panel rounded-3xl p-5 sm:p-7 animate-fadeIn">
            
            {/* PASO 5.1: IMAGEN */}
            {pipelineStep === 1 && (
              <div className="space-y-5">
                <div>
                  <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                    PASO 5.1 • IMAGEN DEL ENGENDRO
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827] mt-2">
                    Ponle Jeta y Nombre a tu Criatura
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    Ningún bicho entra al ring sin cara. Sube una imagen o róbate una plantilla abajo para empezar.
                  </p>
                </div>

                <div>
                  <label className="font-mono text-xs font-extrabold uppercase text-[#111827] block mb-1.5">
                    Nombre de tu Criatura:
                  </label>
                  <input
                    type="text"
                    value={pokeName}
                    onChange={(e) => setPokeName(e.target.value)}
                    placeholder="Ej: Destructor Tico"
                    className="w-full bg-[#F4EFE2] border-[2.5px] border-[#111827] rounded-xl px-4 py-3 font-display font-extrabold text-base text-[#111827] focus:outline-none focus:bg-white"
                  />
                </div>

                <label className="w-full border-[3px] border-dashed border-[#111827] hover:border-[#D9383A] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#F4EFE2] hover:bg-[#FFF9DB] transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {pokeImage ? (
                    <img src={pokeImage} alt="Preview" className="w-40 h-40 object-contain drop-shadow" />
                  ) : (
                    <div className="text-center">
                      <span className="arcade-stamp inline-block bg-[#D9383A] text-white font-mono text-xs font-extrabold px-3 py-1 rounded-lg mb-2">
                        SUBIR IMAGEN
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        Haz clic para subir PNG, JPG o WebP
                      </p>
                    </div>
                  )}
                </label>

                <div>
                  <span className="font-mono text-[10px] font-extrabold uppercase text-slate-600 block mb-2">
                    Plantillas rápidas de prueba:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {templateSprites.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => {
                          sfx.chip();
                          setPokeImage(t.url);
                        }}
                        className="arcade-btn bg-white hover:bg-[#FFF9DB] p-2 rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <img src={t.url} alt={t.label} className="w-11 h-11 object-contain" />
                        <span className="font-mono text-[10px] font-extrabold text-[#111827]">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!pokeImage}
                  onClick={() => {
                    sfx.click();
                    setPipelineStep(2);
                  }}
                  className="arcade-btn w-full py-3.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] font-display font-extrabold text-sm uppercase cursor-pointer"
                >
                  {pokeImage ? 'Aceptar Imagen y Pasar a Tipos (5.2) →' : 'Sube o elige una imagen primero'}
                </button>
              </div>
            )}

            {/* PASO 5.2: TIPO 1 Y TIPO 2 (GRID VISUAL + COMBO ACCESIBLE) */}
            {pipelineStep === 2 && (
              <div className="space-y-5">
                <div>
                  <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                    PASO 5.2 • GENÉTICA ELEMENTAL
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827] mt-2">
                    Inyéctale Tipo 1 y Tipo 2
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    Esto entrena el dataset del KNN (k=5). Los Pokémon que coincidan en ambos tipos tendrán <strong>doble fuerza</strong>.
                  </p>
                </div>

                {/* Tipo 1 (18 tipos) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold uppercase text-[#111827]">
                      Tipo 1 (Obligatorio — 18 Tipos):
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#D9383A]">
                      {TYPE_ES[type1] || type1}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {POKEMON_TYPES.map((t) => {
                      const col = TYPE_COLORS[t];
                      const active = type1 === t;
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            sfx.typeSwitch();
                            setType1(t);
                          }}
                          style={{ background: col.bgGradientCss }}
                          className={`arcade-btn px-2 py-1.5 rounded-xl text-white flex items-center gap-1.5 cursor-pointer ${
                            active ? 'ring-[3px] ring-[#FFD43B]' : 'opacity-85 hover:opacity-100'
                          }`}
                        >
                          <div className="w-5 h-5 rounded bg-white/95 flex items-center justify-center shrink-0">
                            <TypeIcon type={t} size={14} />
                          </div>
                          <span className="font-mono text-[10px] font-extrabold truncate drop-shadow-sm">
                            {TYPE_ES[t]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tipo 2 (18 tipos + Nulo/Vacío) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold uppercase text-[#111827]">
                      Tipo 2 (18 Tipos + Opción Nulo/Monotipo):
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#1E3A5F]">
                      {type2 === 'None' ? 'Ninguno (Monotipo)' : TYPE_ES[type2] || type2}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sfx.click();
                      setType2('None');
                    }}
                    className={`arcade-btn w-full mb-2 py-2 px-3 rounded-xl font-mono text-xs font-extrabold uppercase cursor-pointer ${
                      type2 === 'None'
                        ? 'bg-[#111827] text-[#FFD43B] ring-2 ring-[#FFD43B]'
                        : 'bg-[#F4EFE2] text-[#111827]'
                    }`}
                  >
                    ★ NINGUNO / NULO (MONOTIPO SIN SEGUNDO TIPO)
                  </button>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {POKEMON_TYPES.map((t) => {
                      const col = TYPE_COLORS[t];
                      const active = type2 === t;
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            sfx.typeSwitch();
                            setType2(t);
                          }}
                          style={{ background: col.bgGradientCss }}
                          className={`arcade-btn px-2 py-1.5 rounded-xl text-white flex items-center gap-1.5 cursor-pointer ${
                            active ? 'ring-[3px] ring-[#FFD43B]' : 'opacity-85 hover:opacity-100'
                          }`}
                        >
                          <div className="w-5 h-5 rounded bg-white/95 flex items-center justify-center shrink-0">
                            <TypeIcon type={t} size={14} />
                          </div>
                          <span className="font-mono text-[10px] font-extrabold truncate drop-shadow-sm">
                            {TYPE_ES[t]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      sfx.click();
                      setPipelineStep(1);
                    }}
                    className="arcade-btn bg-white text-[#111827] px-4 py-3 rounded-xl font-display font-extrabold text-xs uppercase cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => {
                      sfx.click();
                      setPipelineStep(3);
                    }}
                    className="arcade-btn flex-1 bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] py-3 px-5 rounded-xl font-display font-extrabold text-sm uppercase cursor-pointer"
                  >
                    Aceptar Tipos y Pasar a Stats (5.3) →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 5.3: 6 STATS + BOTONES PREDECIR (KNN k=5) Y GENERAR */}
            {pipelineStep === 3 && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      PASO 5.3 • STATS (1 A 200) + KNN k=5
                    </span>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827] mt-2">
                      Pon Números o Deja que el KNN Chambée
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                      Solo enteros del <strong>1 al 200</strong> o vacíos. <strong>Predecir</strong> se activa solo si falta algún dato; <strong>Generar</strong> se desbloquea cuando los 6 estén completos.
                    </p>
                  </div>

                  <button
                    onClick={handleClearStats}
                    className="arcade-btn bg-white hover:bg-[#FFE3E3] text-[#D9383A] px-3 py-1.5 rounded-xl font-mono text-[11px] font-extrabold uppercase cursor-pointer"
                  >
                    Limpiar 6 Stats
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {statKeys.map((k) => {
                    const meta = STAT_NAMES[k];
                    const val = stats[k];
                    const isFilled = val !== '' && val !== null && val !== undefined;
                    const isPredicted = predictedKeys.has(k);

                    return (
                      <div
                        key={k}
                        className={`p-3.5 rounded-2xl border-[2.5px] border-[#111827] shadow-ink-sm transition-colors ${
                          isPredicted ? 'bg-[#EDE9FE]' : isFilled ? 'bg-[#EBFBEE]' : 'bg-[#F4EFE2]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs font-extrabold text-[#111827] flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-[#111827]"
                              style={{ backgroundColor: meta.color }}
                            />
                            {meta.short}
                          </span>
                          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white border border-[#111827]/30">
                            {isPredicted ? 'KNN IA' : isFilled ? 'MANUAL' : 'VACÍO'}
                          </span>
                        </div>

                        <input
                          type="number"
                          min="1"
                          max="200"
                          step="1"
                          placeholder="1 - 200..."
                          value={val}
                          onChange={(e) => handleStatChange(k, e.target.value)}
                          className="w-full bg-white border-2 border-[#111827] rounded-xl px-3 py-2 font-mono font-extrabold text-base text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FFD43B]"
                        />
                        <span className="text-[10px] font-bold text-slate-600 block mt-1 truncate">
                          {meta.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {predictionLog && (
                  <div className="bg-[#EDE9FE] border-2 border-[#111827] rounded-xl p-3 font-mono text-xs font-extrabold text-[#3B0764] animate-popIn">
                    {predictionLog}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-dashed border-[#111827]/20">
                  <button
                    onClick={() => {
                      sfx.click();
                      setPipelineStep(2);
                    }}
                    className="arcade-btn bg-white text-[#111827] px-4 py-3 rounded-xl font-display font-extrabold text-xs uppercase cursor-pointer"
                  >
                    ← Volver a Tipos
                  </button>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      disabled={!hasEmptyStat}
                      onClick={handlePredictKNN}
                      className={`arcade-btn px-5 py-3 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase cursor-pointer ${
                        hasEmptyStat ? 'bg-[#4F3DF5] text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      Predecir (KNN k=5)
                    </button>

                    <button
                      disabled={!allStatsFilled}
                      onClick={handleGenerate}
                      className={`arcade-btn px-6 py-3 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase cursor-pointer ${
                        allStatsFilled ? 'bg-[#16A34A] text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      Generar Monstruo →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: CARTA COLECCIONABLE EN VIVO */}
          <div className="lg:col-span-4">
            <div
              className="rounded-3xl border-[3px] border-[#111827] shadow-ink-lg p-5 text-white relative overflow-hidden"
              style={{ background: type1Theme.bgGradientCss }}
            >
              <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
                <TypeIcon type={type1} size={150} />
              </div>

              <div className="relative z-10 flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-extrabold bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded uppercase">
                  VISTA PREVIA EN VIVO
                </span>
                <span className="font-mono text-xs font-extrabold">BST {totalBaseStats}</span>
              </div>

              <div className="relative z-10 bg-[#FFFDF7] border-[2.5px] border-[#111827] rounded-2xl p-4 flex flex-col items-center shadow-ink-sm">
                <div className="w-36 h-36 flex items-center justify-center">
                  {pokeImage ? (
                    <img src={pokeImage} alt={pokeName} className="max-w-full max-h-full object-contain drop-shadow" />
                  ) : (
                    <span className="font-mono text-xs font-extrabold text-slate-400 text-center">
                      Sin imagen aún
                    </span>
                  )}
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#111827] mt-2 text-center break-words max-w-full">
                  {pokeName || 'Sin Nombre'}
                </h3>

                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  <span className="arcade-stamp bg-white text-[#111827] text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                    <TypeIcon type={type1} size={13} />
                    {TYPE_ES[type1] || type1}
                  </span>
                  {type2 !== 'None' && (
                    <span className="arcade-stamp bg-white text-[#111827] text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <TypeIcon type={type2} size={13} />
                      {TYPE_ES[type2] || type2}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-3 bg-[#111827]/90 rounded-2xl p-3 space-y-1.5 font-mono text-[11px]">
                {statKeys.map((k) => {
                  const v = Number(stats[k]) || 0;
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-12 text-slate-300 font-bold">{STAT_NAMES[k].short}</span>
                      <div className="flex-1 h-2 bg-white/15 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (v / 200) * 100)}%`, backgroundColor: STAT_NAMES[k].color }}
                        />
                      </div>
                      <span className="w-7 text-right font-extrabold text-[#FFD43B]">
                        {stats[k] === '' ? '—' : v}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PASO 5.4: TARJETA HOLOGRÁFICA 3D FINAL */}
      {pipelineStep === 4 && (
        <div className="w-full max-w-xl mx-auto animate-popIn">
          <HoloCard
            maxTilt={9}
            className="rounded-[2rem] border-[4px] border-[#111827] shadow-ink-lg p-6 sm:p-8 text-white relative overflow-hidden"
            style={{ background: type1Theme.bgGradientCss }}
          >
            <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
              <TypeIcon type={type1} size={220} />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-xs font-extrabold px-3 py-1 rounded-xl uppercase">
                RANGO: {powerTier}
              </span>
              <span className="arcade-stamp bg-[#111827] text-white font-mono text-xs font-extrabold px-3 py-1 rounded-xl">
                TOTAL STATS: <span className="text-[#FFD43B]">{totalBaseStats}</span>
              </span>
            </div>

            <div className="relative z-10 bg-[#FFFDF7] border-[3px] border-[#111827] rounded-3xl p-5 flex flex-col items-center shadow-ink mb-5">
              <div className="w-52 h-52 flex items-center justify-center">
                <img
                  src={pokeImage}
                  alt={pokeName}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_14px_18px_rgba(17,24,39,0.4)] animate-floatSlow"
                />
              </div>

              <h2 className="font-display font-extrabold text-3xl text-[#111827] text-center mt-2">
                {pokeName}
              </h2>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span
                  className="arcade-stamp text-white font-display font-extrabold text-xs px-3.5 py-1 rounded-xl flex items-center gap-1.5"
                  style={{ background: type1Theme.bgGradientCss }}
                >
                  <TypeIcon type={type1} size={16} />
                  {TYPE_ES[type1] || type1}
                </span>
                {type2 !== 'None' && type2Theme && (
                  <span
                    className="arcade-stamp text-white font-display font-extrabold text-xs px-3.5 py-1 rounded-xl flex items-center gap-1.5"
                    style={{ background: type2Theme.bgGradientCss }}
                  >
                    <TypeIcon type={type2} size={16} />
                    {TYPE_ES[type2] || type2}
                  </span>
                )}
              </div>
            </div>

            {/* Barras finales */}
            <div className="relative z-10 bg-[#FFFDF7] text-[#111827] border-[3px] border-[#111827] rounded-2xl p-4 space-y-2.5 shadow-ink-sm mb-5">
              {statKeys.map((k) => {
                const meta = STAT_NAMES[k];
                const val = Number(stats[k]) || 0;
                const pct = Math.min(100, (val / 200) * 100);
                return (
                  <div key={k}>
                    <div className="flex justify-between font-mono text-xs font-extrabold mb-0.5">
                      <span>{meta.name}</span>
                      <span>{val} / 200</span>
                    </div>
                    <div className="w-full h-3.5 bg-[#F4EFE2] border-2 border-[#111827] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="arcade-btn flex-1 bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] py-3.5 px-5 rounded-2xl font-display font-extrabold text-sm uppercase cursor-pointer"
              >
                Forjar Otro Engendro
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  onBackToHub();
                }}
                className="arcade-btn bg-[#111827] text-white py-3.5 px-5 rounded-2xl font-display font-extrabold text-xs uppercase cursor-pointer"
              >
                Al Núcleo
              </button>
            </div>
          </HoloCard>
        </div>
      )}
    </div>
  );
}

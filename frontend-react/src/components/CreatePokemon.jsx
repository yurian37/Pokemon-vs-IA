import React, { useState } from 'react';
import { POKEMON_TYPES, TYPE_COLORS, STAT_NAMES } from '../services/pokemonService';
import { predictStatsKNN } from '../services/mlModelsService';
import TypeIcon from './TypeIcons';
import confetti from 'canvas-confetti';

export default function CreatePokemon({ onBackToHub }) {
  // Pipeline Step: 1 = Imagen, 2 = Tipos, 3 = Estadísticas, 4 = Generar / Tarjeta Final
  const [pipelineStep, setPipelineStep] = useState(1);

  // 5.1 Imagen
  const [pokeImage, setPokeImage] = useState(null);
  const [pokeName, setPokeName] = useState('Mi Monstruo Creado');

  // 5.2 Tipos
  const [type1, setType1] = useState('Fire');
  const [type2, setType2] = useState('None'); // 'None' representa null/vacío

  // 5.3 Estadísticas: iniciadas todas sin nada
  const [stats, setStats] = useState({
    hp: '',
    attack: '',
    defense: '',
    spAtk: '',
    spDef: '',
    speed: ''
  });

  const [predictionLog, setPredictionLog] = useState(null);

  // Bocetos rápidos por si el usuario no tiene una imagen a mano
  const templateSprites = [
    { label: 'Lagarto Ígneo', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { label: 'Sierpe Mítica', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
    { label: 'Rata Voltaica', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' },
    { label: 'Feto Astral', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPokeImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validación y control de inputs de estadísticas (1-200 o sin dato)
  const handleStatChange = (key, rawValue) => {
    if (rawValue === '') {
      setStats(prev => ({ ...prev, [key]: '' }));
      return;
    }

    const num = parseInt(rawValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 200) {
      setStats(prev => ({ ...prev, [key]: num }));
    }
  };

  // Comprobar estado de los datos de stats
  const statKeys = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];
  const hasEmptyStat = statKeys.some(k => stats[k] === '' || stats[k] === null || stats[k] === undefined);
  const allStatsFilled = !hasEmptyStat;

  // 5.3 Predecir con KNN Logístico (k=5)
  // "el de predecir estara habilitado cuando alguna de las estadisticas esta sin dato, si todas las estadisticas tiene dato el boton predecir se deshabilitara."
  const handlePredictKNN = () => {
    if (!hasEmptyStat) return;

    const predicted = predictStatsKNN({
      type1,
      type2: type2 === 'None' ? null : type2,
      stats
    });

    setStats(predicted);
    setPredictionLog('Las estadísticas faltantes han sido calculadas con el KNN ponderado (k=5) con doble fuerza para tipos combinados.');
  };

  // 5.4 Generar
  // "Mientras Generar estara deshabilitado si alguno de los datos no posee dato y se activara una vez todas las estadisticas tengan un dato."
  const handleGenerate = () => {
    if (!allStatsFilled) return;
    setPipelineStep(4);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setPipelineStep(1);
    setPokeImage(null);
    setPokeName('Mi Monstruo Creado');
    setType1('Fire');
    setType2('None');
    setStats({ hp: '', attack: '', defense: '', spAtk: '', spDef: '', speed: '' });
    setPredictionLog(null);
  };

  const type1Style = TYPE_COLORS[type1] || { bg: '#EE8130', text: '#fff' };
  const type2Style = type2 !== 'None' ? TYPE_COLORS[type2] : null;
  const finalGradient = type1Style.bgGradientCss || 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)';

  const totalBaseStats = Object.values(stats).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR CON CONTROL */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#101426] border border-rose-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <button
          onClick={onBackToHub}
          className="text-xs font-black text-rose-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/30 hover:border-rose-400 transition-colors cursor-pointer"
        >
          ← Regresar al Antro
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
          Laboratorio Clandestino • Forja tu Engendro
        </span>

        {/* PIPELINE DE USUARIO */}
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { s: 1, label: '5.1 Jeta' },
            { s: 2, label: '5.2 Tipos' },
            { s: 3, label: '5.3 Stats (KNN)' },
            { s: 4, label: '5.4 Engendro' }
          ].map(p => (
            <div
              key={p.s}
              className={`px-3 py-1 rounded-lg font-black text-[11px] transition-all ${
                pipelineStep === p.s
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                  : pipelineStep > p.s
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* PIPELINE SECCIÓN 5.1: IMAGEN DE POKÉMON */}
      {pipelineStep === 1 && (
        <div className="w-full max-w-2xl bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.1 • La Jeta del Bicho
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
              Sube la Fachada de tu Criatura
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Ningún monstruo entra al ring sin rostro. Sube una imagen propia o afanate una de las muestras de abajo.
            </p>
          </div>

          {/* NOMBRE DEL MONSTRUO */}
          <div className="w-full max-w-md mb-5">
            <label className="text-xs font-black text-slate-300 block mb-1.5 uppercase tracking-wide">
              Bautiza a tu Criatura:
            </label>
            <input 
              type="text"
              value={pokeName}
              onChange={(e) => setPokeName(e.target.value)}
              placeholder="Ej: Destructor infernal"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-black focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* DROPZONE DE IMAGEN */}
          <label className="w-full max-w-md border-2 border-dashed border-slate-700 hover:border-rose-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all mb-4 group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden" 
            />

            {pokeImage ? (
              <div className="relative w-44 h-44 flex items-center justify-center">
                <img 
                  src={pokeImage} 
                  alt="Pokemon cargado" 
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl mb-2">
                  🧬
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider mb-1">
                  Carga la Imagen Aquí
                </span>
                <span className="text-[10px] text-slate-400">
                  Haz clic para explorar archivos (PNG, JPG, WebP)
                </span>
              </div>
            )}
          </label>

          {/* PLANTILLAS RÁPIDAS */}
          <div className="w-full max-w-md pt-2 border-t border-slate-800 mb-6">
            <span className="text-[10px] text-slate-400 font-bold block mb-2 text-center">
              ¿No tienes fotos? Usa una de estas carcasas de prueba:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {templateSprites.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setPokeImage(t.url)}
                  className="p-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-400/50 flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <img src={t.url} alt={t.label} className="w-10 h-10 object-contain" />
                  <span className="text-[8px] text-slate-300 font-bold truncate max-w-full">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BOTÓN DE CONFIRMACIÓN DE SECCIÓN 5.1 */}
          <button
            disabled={!pokeImage}
            onClick={() => setPipelineStep(2)}
            className={`w-full max-w-md py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 transition-all cursor-pointer ${
              pokeImage
                ? 'bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-300 hover:to-amber-200 shadow-lg shadow-rose-500/30 active:scale-95 border border-amber-200'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {pokeImage ? '✅ Fijar Jeta y Pasar a Tipos (5.2) →' : 'Sube una imagen primero, no inventes'}
          </button>
        </div>
      )}

      {/* PIPELINE SECCIÓN 5.2: TIPO 1 Y TIPO 2 */}
      {pipelineStep === 2 && (
        <div className="w-full max-w-2xl bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.2 • Genética Elemental
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
              Inyéctale Elementos a la Bestia
            </h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Elige el Tipo 1 obligatorio y el Tipo 2 (o déjalo en Nulo si quieres un bicho de un solo tipo).
            </p>
          </div>

          <div className="w-full max-w-md space-y-5 mb-8">
            
            {/* COMBO BOX TIPO 1 */}
            <div>
              <label className="text-xs font-black text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Tipo 1 (18 Tipos Oficiales):</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <TypeIcon type={type1} className="w-4 h-4" />
                  {type1}
                </span>
              </label>
              <select
                value={type1}
                onChange={(e) => setType1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-black focus:outline-none focus:border-rose-400 cursor-pointer"
              >
                {POKEMON_TYPES.map(t => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    Tipo {t}
                  </option>
                ))}
              </select>
            </div>

            {/* COMBO BOX TIPO 2 */}
            <div>
              <label className="text-xs font-black text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Tipo 2 (18 Tipos + Opción Nulo/Vacío):</span>
                {type2Style ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
                    <TypeIcon type={type2} className="w-4 h-4" />
                    {type2}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Sin 2º Tipo (Monotipo)</span>
                )}
              </label>
              <select
                value={type2}
                onChange={(e) => setType2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-black focus:outline-none focus:border-rose-400 cursor-pointer"
              >
                <option value="None" className="bg-slate-900 text-amber-400 font-bold">
                  ★ Ninguno / Nulo (Monotipo)
                </option>
                {POKEMON_TYPES.map(t => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    Tipo {t}
                  </option>
                ))}
              </select>
            </div>

            {/* PREVIEW DE LOS BADGES SELECCIONADOS */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">
                Fusión Elemental Resultante:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span 
                  className="px-4 py-1.5 rounded-xl text-white font-black text-xs shadow-md flex items-center gap-1.5 border border-white/20"
                  style={{ backgroundColor: type1Style.bg }}
                >
                  <TypeIcon type={type1} className="w-4 h-4 fill-current" />
                  {type1}
                </span>
                {type2 !== 'None' ? (
                  <span 
                    className="px-4 py-1.5 rounded-xl text-white font-black text-xs shadow-md flex items-center gap-1.5 border border-white/20"
                    style={{ backgroundColor: type2Style?.bg || '#666' }}
                  >
                    <TypeIcon type={type2} className="w-4 h-4 fill-current" />
                    {type2}
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700">
                    Puro Monotipo
                  </span>
                )}
              </div>
            </div>

          </div>

          <div className="w-full max-w-md flex gap-3">
            <button
              onClick={() => setPipelineStep(1)}
              className="py-3 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ← Volver
            </button>
            <button
              onClick={() => setPipelineStep(3)}
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-rose-400 to-amber-300 hover:from-rose-300 hover:to-amber-200 shadow-lg shadow-rose-500/30 cursor-pointer border border-amber-200"
            >
              Confirmar Tipos y Pasar a Stats (5.3) →
            </button>
          </div>
        </div>
      )}

      {/* PIPELINE SECCIÓN 5.3: LAS 6 ESTADÍSTICAS (PREDECIR CON KNN / GENERAR) */}
      {pipelineStep === 3 && (
        <div className="w-full max-w-3xl bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.3 • Calibración de Stats
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
              Stats Manuales o KNN Ponderado
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium">
              Mete valores de <strong>1 a 200</strong> a lo que quieras. Si dejas huecos vacíos, dale a <strong>Predecir</strong> y el <strong>KNN (k=5)</strong> entrenado con todos los bichos de tus tipos rellenará los huecos con factor de doble fuerza.
            </p>
          </div>

          {/* GRID DE LAS 6 ESTADÍSTICAS */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {statKeys.map(k => {
              const meta = STAT_NAMES[k];
              const val = stats[k];
              const isFilled = val !== '' && val !== null && val !== undefined;

              return (
                <div 
                  key={k} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isFilled ? 'bg-slate-950 border-amber-400/50 shadow-md' : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.short}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">1 - 200</span>
                  </div>

                  <input 
                    type="number"
                    min="1"
                    max="200"
                    placeholder="Sin dato..."
                    value={val}
                    onChange={(e) => handleStatChange(k, e.target.value)}
                    className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3 py-2 text-base font-black text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[9px] text-slate-400 block mt-1 truncate">{meta.name}</span>
                </div>
              );
            })}
          </div>

          {/* FEEDBACK DE PREDICCIÓN */}
          {predictionLog && (
            <div className="w-full mb-6 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-300 text-center animate-fadeIn font-semibold">
              ✅ {predictionLog}
            </div>
          )}

          {/* BOTONES PREDECIR Y GENERAR CON REGLAS ESTRICTAS */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setPipelineStep(2)}
              className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ← Volver a Tipos
            </button>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* BOTÓN PREDECIR */}
              <button
                disabled={!hasEmptyStat}
                onClick={handlePredictKNN}
                className={`py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  hasEmptyStat
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/30 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={hasEmptyStat ? 'Predecir stats faltantes con KNN' : 'Todas las estadísticas ya tienen dato'}
              >
                🧠 Predecir Faltantes (KNN k=5)
              </button>

              {/* BOTÓN GENERAR */}
              <button
                disabled={!allStatsFilled}
                onClick={handleGenerate}
                className={`py-3.5 px-8 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  allStatsFilled
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 shadow-lg shadow-emerald-500/30 active:scale-95 border border-emerald-200'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={allStatsFilled ? 'Generar criatura oficial' : 'Faltan estadísticas por completar o predecir'}
              >
                ✨ Forjar Criatura Definitiva
              </button>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              {hasEmptyStat
                ? 'ℹ️ El botón Predecir está activo porque faltan datos. Una vez todas tengan dato se activará Forjar.'
                : '✅ Todas las 6 estadísticas tienen números. Ya puedes forjar la tarjeta.'}
            </span>
          </div>

        </div>
      )}

      {/* PIPELINE SECCIÓN 5.4: TARJETA OFICIAL DEL POKÉMON GENERADO */}
      {pipelineStep === 4 && (
        <div 
          className="w-full max-w-xl border-2 border-rose-500/60 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn relative overflow-hidden"
          style={{ background: finalGradient }}
        >
          
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/40 px-3 py-1 rounded-full border border-white/20">
              Paso 5.4 • ¡Engendro Oficial Parido!
            </span>
            <span className="text-xs font-mono font-bold text-slate-200">
              Total Stats: <strong className="text-amber-300 text-base">{totalBaseStats}</strong>
            </span>
          </div>

          {/* IMAGEN DEL POKÉMON */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2 bg-black/25 rounded-3xl backdrop-blur-xs p-3">
            <img 
              src={pokeImage} 
              alt={pokeName} 
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] relative z-10 transition-transform hover:scale-105"
            />
          </div>

          {/* NOMBRE Y TIPOS */}
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-2 tracking-tight drop-shadow">
            {pokeName}
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span 
              className="px-4 py-1.5 rounded-xl text-white font-black text-xs shadow-lg flex items-center gap-1.5 border border-white/20"
              style={{ backgroundColor: type1Style.bg }}
            >
              <TypeIcon type={type1} className="w-4 h-4 fill-current" />
              {type1}
            </span>
            {type2 !== 'None' && (
              <span 
                className="px-4 py-1.5 rounded-xl text-white font-black text-xs shadow-lg flex items-center gap-1.5 border border-white/20"
                style={{ backgroundColor: type2Style?.bg || '#666' }}
              >
                <TypeIcon type={type2} className="w-4 h-4 fill-current" />
                {type2}
              </span>
            )}
          </div>

          {/* ESTADÍSTICAS COMPLETAS CON BARRAS */}
          <div className="w-full bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2.5 mb-6 shadow-xl">
            {statKeys.map(k => {
              const meta = STAT_NAMES[k];
              const val = Number(stats[k]) || 0;
              const percent = Math.min(100, (val / 200) * 100);

              return (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-black text-slate-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.name}
                    </span>
                    <span className="font-mono font-black text-amber-300">{val} / 200</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%`, backgroundColor: meta.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACCIONES FINALES */}
          <div className="w-full flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-xl font-black text-xs uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              🔄 Forjar Otro Engendro
            </button>
            <button
              onClick={onBackToHub}
              className="py-3 px-5 rounded-xl font-bold text-xs text-white hover:text-amber-300 bg-slate-950/80 hover:bg-slate-900 border border-white/20 transition-colors cursor-pointer"
            >
              Volver al Antro
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
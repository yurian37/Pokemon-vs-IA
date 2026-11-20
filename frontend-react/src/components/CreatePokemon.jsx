import React, { useState } from 'react';
import { POKEMON_TYPES, TYPE_COLORS, STAT_NAMES } from '../services/pokemonService';
import { predictStatsKNN } from '../services/mlModelsService';
import confetti from 'canvas-confetti';

export default function CreatePokemon({ onBackToHub }) {
  // Pipeline Step: 1 = Imagen, 2 = Tipos, 3 = Estadísticas, 4 = Generar / Tarjeta Final
  const [pipelineStep, setPipelineStep] = useState(1);

  // 5.1 Imagen
  const [pokeImage, setPokeImage] = useState(null);
  const [pokeName, setPokeName] = useState('Mi Pokémon Creado');

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
    { label: 'Boceto Fuego', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { label: 'Boceto Dragón', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
    { label: 'Boceto Eléctrico', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' },
    { label: 'Boceto Psíquico', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' }
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
    setPredictionLog('Las estadísticas faltantes han sido estimadas con el KNN Logístico (k=5) con ponderación de doble fuerza.');
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
    setPokeName('Mi Pokémon Creado');
    setType1('Fire');
    setType2('None');
    setStats({ hp: '', attack: '', defense: '', spAtk: '', spDef: '', speed: '' });
    setPredictionLog(null);
  };

  const type1Style = TYPE_COLORS[type1] || { bg: '#EE8130', text: '#fff' };
  const type2Style = type2 !== 'None' ? TYPE_COLORS[type2] : null;

  const totalBaseStats = Object.values(stats).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR CON CONTROL */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#14192d] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          ← Volver al Núcleo
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
          Actividad 5 • Laboratorio de Síntesis
        </span>

        {/* PIPELINE DE USUARIO */}
        <div className="flex items-center gap-1 text-xs">
          {[
            { s: 1, label: '5.1 Imagen' },
            { s: 2, label: '5.2 Tipos' },
            { s: 3, label: '5.3 Stats (KNN)' },
            { s: 4, label: '5.4 Tarjeta' }
          ].map(p => (
            <div
              key={p.s}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                pipelineStep === p.s
                  ? 'bg-rose-500 text-white shadow-md'
                  : pipelineStep > p.s
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
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
        <div className="w-full max-w-2xl bg-[#141b2e] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.1
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mt-2">
              Imagen del Pokémon
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Sube la ilustración de tu nueva especie o selecciona una plantilla para iniciar.
            </p>
          </div>

          {/* INPUT DE NOMBRE OPCIONAL */}
          <div className="w-full max-w-md mb-4">
            <label className="text-xs font-bold text-slate-400 block mb-1">Nombre del Pokémon:</label>
            <input 
              type="text"
              value={pokeName}
              onChange={(e) => setPokeName(e.target.value)}
              placeholder="Ej: Pyrodrake, Electrowyrm..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>

          {/* ÁREA DE CARGA DE IMAGEN */}
          <label className="w-full max-w-md border-2 border-dashed border-slate-700 hover:border-rose-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all group mb-4">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {pokeImage ? (
              <div className="relative w-44 h-44 flex items-center justify-center">
                <img 
                  src={pokeImage} 
                  alt="Pokemon cargado" 
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl mb-2">
                  🎨
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider mb-1">
                  Subir Imagen
                </span>
                <span className="text-[10px] text-slate-400">
                  Haz clic para examinar archivos (PNG, JPG)
                </span>
              </div>
            )}
          </label>

          {/* PLANTILLAS RÁPIDAS */}
          <div className="w-full max-w-md pt-2 border-t border-slate-800/80 mb-6">
            <span className="text-[10px] text-slate-400 font-bold block mb-2 text-center">
              O elige una plantilla de prueba:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {templateSprites.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setPokeImage(t.url)}
                  className="p-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <img src={t.url} alt={t.label} className="w-9 h-9 object-contain" />
                  <span className="text-[8px] text-slate-300 font-bold truncate max-w-full">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BOTÓN DE CONFIRMACIÓN DE SECCIÓN 5.1 */}
          <button
            disabled={!pokeImage}
            onClick={() => setPipelineStep(2)}
            className={`w-full max-w-md py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all cursor-pointer ${
              pokeImage
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {pokeImage ? 'Aceptar Imagen y Continuar al Paso 5.2 →' : 'Sube o selecciona una imagen primero'}
          </button>
        </div>
      )}

      {/* PIPELINE SECCIÓN 5.2: TIPO 1 Y TIPO 2 */}
      {pipelineStep === 2 && (
        <div className="w-full max-w-2xl bg-[#141b2e] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.2
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mt-2">
              Configuración de Tipos Elementales
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Selecciona el Tipo 1 principal y el Tipo 2 (incluye la opción Nulo para Pokémon de tipo único).
            </p>
          </div>

          <div className="w-full max-w-md space-y-5 mb-8">
            
            {/* COMBO BOX TIPO 1 */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Tipo 1 (18 Tipos Disponibles):</span>
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type1Style.bg }}
                />
              </label>
              <select
                value={type1}
                onChange={(e) => setType1(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
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
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Tipo 2 (18 Tipos + Opción Nulo/Vacío):</span>
                {type2Style ? (
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type2Style.bg }}
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Sin 2º Tipo</span>
                )}
              </label>
              <select
                value={type2}
                onChange={(e) => setType2(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="None" className="bg-slate-900 text-amber-400 font-bold">
                  ★ Ninguno / Nulo (Pokémon Monotipo)
                </option>
                {POKEMON_TYPES.map(t => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    Tipo {t}
                  </option>
                ))}
              </select>
            </div>

            {/* PREVIEW DE LOS BADGES SELECCIONADOS */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Combinación Elemental Asignada:
              </span>
              <div className="flex items-center justify-center gap-2">
                <span 
                  className="px-3.5 py-1 rounded-xl text-white font-black text-xs shadow-md"
                  style={{ backgroundColor: type1Style.bg }}
                >
                  {type1}
                </span>
                {type2 !== 'None' ? (
                  <span 
                    className="px-3.5 py-1 rounded-xl text-white font-black text-xs shadow-md"
                    style={{ backgroundColor: type2Style?.bg || '#666' }}
                  >
                    {type2}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700">
                    Monotipo (Sin Tipo 2)
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
              className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/25 cursor-pointer"
            >
              Aceptar Tipos y Continuar al Paso 5.3 →
            </button>
          </div>
        </div>
      )}

      {/* PIPELINE SECCIÓN 5.3: LAS 6 ESTADÍSTICAS (PREDECIR CON KNN / GENERAR) */}
      {pipelineStep === 3 && (
        <div className="w-full max-w-3xl bg-[#141b2e] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.3
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white mt-2">
              Estadísticas Base & Predicción KNN
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Ingresa valores enteros entre <strong>1 y 200</strong> para las estadísticas que tengas claras, o déjalas vacías. El botón <strong>Predecir</strong> utilizará un <strong>KNN Logístico (k=5)</strong> entrenado con los Pokémon de tus tipos para calcular los datos faltantes con factor de doble fuerza.
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
                    isFilled ? 'bg-slate-900/90 border-indigo-500/40' : 'bg-slate-900/40 border-slate-800'
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
                    className="w-full bg-[#111728] border border-slate-700 rounded-xl px-3 py-2 text-base font-black text-white focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[9px] text-slate-400 block mt-1 truncate">{meta.name}</span>
                </div>
              );
            })}
          </div>

          {/* FEEDBACK DE PREDICCIÓN */}
          {predictionLog && (
            <div className="w-full mb-6 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-300 text-center animate-fadeIn">
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
              {/* BOTÓN PREDECIR:
                  "el de predecir estara habilitado cuando alguna de las estadisticas esta sin dato, 
                  si todas las estadisticas tiene dato el boton predecir se deshabilitara." */}
              <button
                disabled={!hasEmptyStat}
                onClick={handlePredictKNN}
                className={`py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  hasEmptyStat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={hasEmptyStat ? 'Predecir stats faltantes con KNN' : 'Todas las estadísticas ya tienen dato'}
              >
                🧠 Predecir (KNN k=5)
              </button>

              {/* BOTÓN GENERAR:
                  "Mientras Generar estara deshabilitado si alguno de los datos no posee dato 
                  y se activara una vez todas las estadisticas tengan un dato." */}
              <button
                disabled={!allStatsFilled}
                onClick={handleGenerate}
                className={`py-3 px-8 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  allStatsFilled
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
                title={allStatsFilled ? 'Generar Pokémon oficial' : 'Faltan estadísticas por completar o predecir'}
              >
                ✨ Generar Pokémon
              </button>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-slate-400">
              {hasEmptyStat
                ? 'ℹ️ Predecir está habilitado porque faltan datos. Al completarse todos, se activará Generar.'
                : '✅ Todas las 6 estadísticas tienen datos listos. Botón Generar disponible.'}
            </span>
          </div>

        </div>
      )}

      {/* PIPELINE SECCIÓN 5.4: TARJETA OFICIAL DEL POKÉMON GENERADO */}
      {pipelineStep === 4 && (
        <div className="w-full max-w-xl bg-gradient-to-b from-[#182138] to-[#0f1423] border-2 border-rose-500/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-fadeIn relative overflow-hidden">
          
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Paso 5.4 • Especie Oficial Generada
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              Total Stats: <strong className="text-amber-400 text-sm">{totalBaseStats}</strong>
            </span>
          </div>

          {/* IMAGEN DEL POKÉMON */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2 group">
            <div className="absolute inset-4 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-rose-500/15 transition-colors" />
            <img 
              src={pokeImage} 
              alt={pokeName} 
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] relative z-10 transition-transform group-hover:scale-105"
            />
          </div>

          {/* NOMBRE Y TIPOS */}
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-2">
            {pokeName}
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span 
              className="px-4 py-1 rounded-xl text-white font-black text-xs shadow-md"
              style={{ backgroundColor: type1Style.bg }}
            >
              {type1}
            </span>
            {type2 !== 'None' && (
              <span 
                className="px-4 py-1 rounded-xl text-white font-black text-xs shadow-md"
                style={{ backgroundColor: type2Style?.bg || '#666' }}
              >
                {type2}
              </span>
            )}
          </div>

          {/* ESTADÍSTICAS COMPLETAS CON BARRAS */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 mb-6">
            {statKeys.map(k => {
              const meta = STAT_NAMES[k];
              const val = Number(stats[k]) || 0;
              const percent = Math.min(100, (val / 200) * 100);

              return (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.name}
                    </span>
                    <span className="font-mono font-black text-white">{val}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
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
              className="flex-1 py-3.5 rounded-xl font-black text-xs uppercase text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/25 cursor-pointer"
            >
              Crear Nuevo Pokémon
            </button>
            <button
              onClick={onBackToHub}
              className="py-3 px-5 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Volver al Núcleo
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

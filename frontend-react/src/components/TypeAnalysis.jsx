import React, { useState } from 'react';
import { analyzeImageAura } from '../services/mlModelsService';
import { TYPE_COLORS } from '../services/pokemonService';

export default function TypeAnalysis({ onBackToHub }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [viewType, setViewType] = useState('horizontal'); // 'horizontal' | 'circular'
  const [errorMsg, setErrorMsg] = useState(null);

  // Muestras rápidas de ejemplo
  const sampleImages = [
    { name: 'Pikachu', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { name: 'Charizard', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
    { name: 'Blastoise', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
    { name: 'Gengar', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      processImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (src) => {
    setErrorMsg(null);
    setImageSrc(src);
    setIsAnalyzing(true);
    setResults(null);

    try {
      const data = await analyzeImageAura(src);
      setResults(data);
    } catch (err) {
      setErrorMsg('Error al procesar la imagen con el modelo: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#14192d] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          ← Volver al Núcleo
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
          Actividad 4 • Análisis de Tipos Pokémon
        </span>

        {/* SELECTOR DE VISTA: BARRAS HORIZONTALES O CIRCULAR */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewType('horizontal')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'horizontal'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Barras Horizontal
          </button>
          <button
            onClick={() => setViewType('circular')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewType === 'circular'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍩 Circular (Top 5 + Otros)
          </button>
        </div>
      </div>

      {/* ENUNCIADO */}
      <div className="text-center my-1 max-w-2xl">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Escáner Convolucional & Visión Cromática
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-300 mt-1">
          Análisis de Afinidad Elemental
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Sube la imagen de cualquier Pokémon o criatura. El modelo de IA evaluará la distribución de sus rasgos visuales y calculará el <strong>Top 5 de pertenencia a un tipo</strong>.
        </p>
      </div>

      {/* ZONA DE CARGA DE IMAGEN */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: UPLOAD Y PREVIEW */}
        <div className="md:col-span-5 bg-[#141b2e] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl">
          
          <label className="w-full border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all group relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />

            {imageSrc ? (
              <div className="relative w-48 h-48 flex items-center justify-center">
                <img 
                  src={imageSrc} 
                  alt="Imagen a analizar" 
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
                  📁
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider mb-1">
                  Carga tu Imagen
                </span>
                <span className="text-[10px] text-slate-400 max-w-xs">
                  Arrastra o haz clic para subir archivo (PNG, JPG, WebP)
                </span>
              </div>
            )}
          </label>

          {/* EJEMPLOS RÁPIDOS */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
              O prueba con estas muestras:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map(sample => (
                <button
                  key={sample.name}
                  onClick={() => processImage(sample.url)}
                  className="p-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <img src={sample.url} alt={sample.name} className="w-9 h-9 object-contain" />
                  <span className="text-[9px] text-slate-300 font-bold truncate max-w-full">{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-[11px] text-rose-300 text-center w-full">
              {errorMsg}
            </div>
          )}

        </div>

        {/* PANEL DERECHO: VISUALIZACIÓN DE RESULTADOS TOP 5 */}
        <div className="md:col-span-7 bg-[#141b2e] border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[380px] flex flex-col justify-center">
          
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full" />
              <span className="text-xs font-bold text-cyan-300 animate-pulse">
                Procesando canales y extrayendo resonancia con el modelo...
              </span>
            </div>
          )}

          {!isAnalyzing && !results && (
            <div className="text-center py-16 text-slate-500">
              <span className="text-4xl block mb-2">🔮</span>
              <p className="text-xs">Carga o selecciona una imagen para ver la predicción del modelo de IA.</p>
            </div>
          )}

          {!isAnalyzing && results && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* CABECERA DE RESULTADOS */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    Predicción Principal
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    Alma de Tipo <span 
                      className="px-2.5 py-0.5 rounded-lg text-white text-sm"
                      style={{ backgroundColor: TYPE_COLORS[results.dominantType]?.bg || '#06B6D4' }}
                    >
                      {results.dominantType}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Resonancia</span>
                  <span className="text-xl font-black text-cyan-400">{results.top5[0].percentage}%</span>
                </div>
              </div>

              {/* VISTA 1: GRÁFICO DE BARRAS HORIZONTAL (SOLO EL TOP 5) */}
              {viewType === 'horizontal' && (
                <div className="space-y-3.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                    <span>TOP 5 TIPOS PREDICHOS</span>
                    <span>AFINIDAD %</span>
                  </div>

                  {results.top5.map((item, idx) => {
                    const typeStyle = TYPE_COLORS[item.type] || { bg: '#38BDF8', text: '#fff' };
                    return (
                      <div key={item.type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-bold text-white">
                            <span className="w-4 text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                            <span 
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: typeStyle.bg }}
                            />
                            <span>{item.type}</span>
                          </span>
                          <span className="font-mono font-black text-slate-200">
                            {item.percentage}%
                          </span>
                        </div>

                        {/* Barra animada */}
                        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                          <div 
                            className="h-full rounded-full transition-all duration-700 shadow-sm"
                            style={{ 
                              width: `${Math.max(4, item.percentage)}%`,
                              backgroundColor: typeStyle.bg 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VISTA 2: GRÁFICO CIRCULAR (TOP 5 + OTROS) */}
              {viewType === 'circular' && (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  
                  {/* SVG DONUT CHART */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Circunferencia: 2 * PI * 40 ≈ 251.2 */}
                      {(() => {
                        const radius = 38;
                        const circumference = 2 * Math.PI * radius;
                        let accumulatedPercent = 0;

                        // Los 5 sectores del top 5 + Otros
                        const sectors = [
                          ...results.top5.map(t => ({ name: t.type, percent: t.percentage, color: TYPE_COLORS[t.type]?.bg || '#38BDF8' })),
                          { name: 'Otros', percent: results.othersPercentage, color: '#475569' }
                        ];

                        return sectors.map((sec, i) => {
                          const strokeDasharray = `${(sec.percent / 100) * circumference} ${circumference}`;
                          const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                          accumulatedPercent += sec.percent;

                          return (
                            <circle
                              key={sec.name + i}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke={sec.color}
                              strokeWidth="14"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-500 hover:opacity-80"
                            />
                          );
                        });
                      })()}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
                      <span className="text-sm font-black text-white">100%</span>
                    </div>
                  </div>

                  {/* LEYENDA DEL GRÁFICO CIRCULAR */}
                  <div className="space-y-1.5 text-xs w-full sm:w-auto">
                    {results.top5.map(t => (
                      <div key={t.type} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: TYPE_COLORS[t.type]?.bg || '#38BDF8' }}
                          />
                          <span className="text-slate-300 font-bold">{t.type}</span>
                        </span>
                        <span className="font-mono font-bold text-white">{t.percentage}%</span>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-1 mt-1">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-600" />
                        <span className="text-slate-400 font-bold">Otros (13 tipos)</span>
                      </span>
                      <span className="font-mono font-bold text-slate-400">{results.othersPercentage}%</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

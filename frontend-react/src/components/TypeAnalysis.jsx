import React, { useState } from 'react';
import { analyzeImageAura } from '../services/mlModelsService';
import { TYPE_COLORS } from '../services/pokemonService';
import TypeIcon from './TypeIcons';

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
      setErrorMsg('Por favor mete un archivo de imagen decente (PNG, JPG, WebP).');
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
      setErrorMsg('Petó el modelo al escanear la imagen: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const dominantGradient = results?.dominantType ? TYPE_COLORS[results.dominantType]?.bgGradientCss : 'linear-gradient(135deg, #0e7490 0%, #082f49 100%)';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#101426] border border-cyan-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <button
          onClick={onBackToHub}
          className="text-xs font-black text-cyan-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer"
        >
          ← Regresar al Antro
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
          Laboratorio Óptico • Escáner de Aura
        </span>

        {/* SELECTOR DE VISTA: BARRAS HORIZONTALES O CIRCULAR */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewType('horizontal')}
            className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
              viewType === 'horizontal'
                ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Barras al Grano (Top 5)
          </button>
          <button
            onClick={() => setViewType('circular')}
            className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
              viewType === 'circular'
                ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍩 Dona Completa (+Otros)
          </button>
        </div>
      </div>

      {/* ENUNCIADO */}
      <div className="text-center my-1 max-w-2xl">
        <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400/80 bg-cyan-950/60 px-3 py-0.5 rounded-full border border-cyan-500/30">
          Escáner de Esencia & Redes Neuronales
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-300 mt-2 tracking-tight">
          ¿A qué puto tipo huele este engendro?
        </h2>
        <p className="text-xs text-slate-300 mt-1 font-semibold">
          Sube la jeta de cualquier Pokémon o criatura extraña. El modelo de IA desarmará sus frecuencias visuales y te escupirá sin rodeos el <strong>Top 5 de afinidad elemental</strong>.
        </p>
      </div>

      {/* ZONA DE CARGA DE IMAGEN */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: UPLOAD Y PREVIEW */}
        <div className="md:col-span-5 bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl">
          
          <label className="w-full border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group relative overflow-hidden">
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
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-3xl mb-3 group-hover:scale-110 transition-transform">
                  👁️
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider mb-1">
                  Arroja la Imagen Aquí
                </span>
                <span className="text-[10px] text-slate-400 max-w-xs font-medium">
                  PNG, JPG o WebP de cualquier engendro
                </span>
              </div>
            )}
          </label>

          {/* EJEMPLOS RÁPIDOS */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
              ¿No tienes fotos? Prueba con estos especímenes:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {sampleImages.map(sample => (
                <button
                  key={sample.name}
                  onClick={() => processImage(sample.url)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <img src={sample.url} alt={sample.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] text-slate-300 font-bold truncate max-w-full">{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="w-full mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center font-bold">
              ❌ {errorMsg}
            </div>
          )}
        </div>

        {/* PANEL DERECHO: RESULTADOS Y VISUALIZACIÓN */}
        <div className="md:col-span-7 bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 shadow-xl min-h-[420px] flex flex-col justify-center">
          
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
              <span className="text-sm font-black text-cyan-300 uppercase tracking-wider animate-pulse">
                La red neuronal está destripando los píxeles...
              </span>
            </div>
          )}

          {!isAnalyzing && !results && (
            <div className="text-center py-16 text-slate-400">
              <span className="text-5xl block mb-2">🔮</span>
              <p className="text-xs font-semibold">Tira una imagen arriba para que la máquina te diga qué cojones es.</p>
            </div>
          )}

          {!isAnalyzing && results && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* CABECERA DE RESULTADOS */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3" style={{ background: dominantGradient, padding: '16px', borderRadius: '16px' }}>
                <div>
                  <span className="text-[10px] uppercase font-black text-white/80 tracking-wider">
                    Diagnóstico Elemental Definitivo
                  </span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                    Es Tipo 
                    <span 
                      className="px-3 py-1 rounded-xl text-white text-base font-black flex items-center gap-1.5 border border-white/30 shadow-lg"
                      style={{ backgroundColor: TYPE_COLORS[results.dominantType]?.bg || '#06B6D4' }}
                    >
                      <TypeIcon type={results.dominantType} className="w-5 h-5 fill-current" />
                      {results.dominantType}
                    </span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/80 uppercase font-black block">Resonancia</span>
                  <span className="text-2xl font-black text-white drop-shadow">{results.top5[0].percentage}%</span>
                </div>
              </div>

              {/* VISTA 1: GRÁFICO DE BARRAS HORIZONTAL (SOLO EL TOP 5) */}
              {viewType === 'horizontal' && (
                <div className="space-y-3.5">
                  <div className="flex justify-between text-[11px] font-black text-slate-400 mb-1">
                    <span>TOP 5 TIPOS DETECTADOS</span>
                    <span>PROBABILIDAD %</span>
                  </div>

                  {results.top5.map((item, idx) => {
                    const typeStyle = TYPE_COLORS[item.type] || { bg: '#38BDF8', text: '#fff' };
                    return (
                      <div key={item.type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-black text-white">
                            <span className="w-5 text-[11px] text-amber-400 font-mono">#{idx + 1}</span>
                            <span className="w-4 h-4 flex items-center justify-center">
                              <TypeIcon type={item.type} className="w-4 h-4" />
                            </span>
                            <span>{item.type}</span>
                          </span>
                          <span className="font-mono font-black text-amber-300">
                            {item.percentage}%
                          </span>
                        </div>

                        {/* Barra animada */}
                        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
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
                      {/* Circunferencia: 2 * PI * 38 ≈ 238.76 */}
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
                  <div className="space-y-2 text-xs w-full sm:w-auto">
                    {results.top5.map(t => (
                      <div key={t.type} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 flex items-center justify-center">
                            <TypeIcon type={t.type} className="w-4 h-4" />
                          </span>
                          <span className="text-slate-200 font-bold">{t.type}</span>
                        </span>
                        <span className="font-mono font-bold text-amber-300">{t.percentage}%</span>
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
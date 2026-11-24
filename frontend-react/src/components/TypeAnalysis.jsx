import React, { useState } from 'react';
import { analyzeImageAura } from '../services/mlModelsService';
import { TYPE_COLORS, TYPE_ES } from '../services/pokemonService';
import { TypeIcon } from './TypeIcons';
import { sfx } from '../services/soundService';

export default function TypeAnalysis({ onBackToHub }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [viewType, setViewType] = useState('horizontal'); // 'horizontal' | 'circular'
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Especímenes de prueba (incluye forma regional Alola y Mega para mostrar PokéAPI HD!)
  const sampleImages = [
    { name: 'Ninetales Alola', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10104.png' },
    { name: 'Mega Charizard X', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png' },
    { name: 'Pikachu', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { name: 'Gengar', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Sube una imagen de verdad (PNG, JPG o WebP), no cualquier archivo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      processImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (src) => {
    sfx.scan();
    setErrorMsg(null);
    setImageSrc(src);
    setIsAnalyzing(true);
    setResults(null);
    setHoveredSlice(null);

    try {
      const data = await analyzeImageAura(src);
      setResults(data);
      sfx.win();
    } catch (err) {
      sfx.lose();
      setErrorMsg('El escáner petó al leer esa imagen: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const dominantTheme = results?.dominantType ? TYPE_COLORS[results.dominantType] : TYPE_COLORS.Psychic;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 animate-fadeIn">
      
      {/* HUD SUPERIOR */}
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

        <span className="arcade-stamp bg-[#F03E78] text-white px-3 py-1 rounded-xl font-mono text-xs font-extrabold uppercase">
          MODO 04 • ESCÁNER DE AURA IA
        </span>

        {/* SELECTOR DE VISTA: BARRAS HORIZONTALES VS CIRCULAR */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              sfx.click();
              setViewType('horizontal');
            }}
            className={`arcade-btn px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold uppercase cursor-pointer ${
              viewType === 'horizontal' ? 'bg-[#111827] text-[#FFD43B]' : 'bg-white text-[#111827]'
            }`}
          >
            Barras (Top 5)
          </button>
          <button
            onClick={() => {
              sfx.click();
              setViewType('circular');
            }}
            className={`arcade-btn px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold uppercase cursor-pointer ${
              viewType === 'circular' ? 'bg-[#111827] text-[#FFD43B]' : 'bg-white text-[#111827]'
            }`}
          >
            Circular (+Otros)
          </button>
        </div>
      </div>

      {/* TÍTULO */}
      <div className="arcade-panel rounded-3xl p-4 sm:p-5 text-center">
        <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A]">
          ANÁLISIS DE IMAGEN • TOP 5 DE AFINIDAD
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#111827] mt-1">
          ¿De qué tipo parece esta criatura?
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 max-w-2xl mx-auto">
          Sube la foto de un Pokémon, tu mascota o cualquier diseño. El modelo analiza los colores y rasgos visuales para mostrarte el Top 5 de afinidad elemental.
        </p>
      </div>

      {/* ÁREA DE ESCANEO Y GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* ESCÁNER ÓPTICO IZQUIERDO */}
        <div className="md:col-span-5 arcade-panel rounded-3xl p-5 flex flex-col justify-between gap-4">
          <label className="w-full min-h-[240px] border-[3px] border-dashed border-[#111827] hover:border-[#D9383A] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-[#F4EFE2] hover:bg-[#FFF9DB] transition-colors relative overflow-hidden">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Láser óptico animado mientras escanea */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#D9383A] shadow-[0_0_18px_#D9383A] animate-scanLaser z-20" />
            )}

            {imageSrc ? (
              <div className="relative w-48 h-48 flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Imagen cargada para escaneo"
                  className="max-w-full max-h-full object-contain drop-shadow-[0_10px_14px_rgba(17,24,39,0.3)]"
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFD43B] border-2 border-[#111827] shadow-ink-sm flex items-center justify-center font-mono font-extrabold text-xl mb-3">
                  +IMG
                </div>
                <span className="font-display font-extrabold text-base text-[#111827] block">
                  Suelta tu imagen aquí
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-600 block mt-1">
                  PNG, JPG o WebP
                </span>
              </div>
            )}
          </label>

          {/* Especímenes rápidos */}
          <div>
            <span className="font-mono text-[10px] font-extrabold uppercase text-slate-600 block mb-2">
              O prueba al toque con estos especímenes HD:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2">
              {sampleImages.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => processImage(sample.url)}
                  className="arcade-btn bg-white hover:bg-[#FFF9DB] p-2 rounded-xl flex items-center gap-2 cursor-pointer text-left"
                >
                  <img src={sample.url} alt={sample.name} className="w-9 h-9 object-contain shrink-0" />
                  <span className="font-display font-extrabold text-[11px] text-[#111827] leading-tight truncate">
                    {sample.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="bg-[#FFE3E3] border-2 border-[#D9383A] rounded-xl p-3 font-mono text-xs font-bold text-[#991B1B]">
              {errorMsg}
            </div>
          )}
        </div>

        {/* PANEL DE RESULTADOS (BARRAS HORIZONTALES / DONA CIRCULAR) */}
        <div className="md:col-span-7 arcade-panel rounded-3xl p-5 sm:p-6 flex flex-col justify-center min-h-[400px]">
          {isAnalyzing && (
            <div className="text-center py-14 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111827] text-[#FFD43B] border-2 border-[#111827] flex items-center justify-center font-mono font-extrabold text-sm animate-spin">
                IA
              </div>
              <p className="font-display font-extrabold text-lg text-[#111827]">
                Analizando la imagen y calculando afinidad...
              </p>
            </div>
          )}

          {!isAnalyzing && !results && (
            <div className="text-center py-14">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F4EFE2] border-2 border-[#111827] shadow-ink-sm flex items-center justify-center mb-3">
                <TypeIcon type="Psychic" size={34} />
              </div>
              <p className="font-display font-extrabold text-lg text-[#111827]">
                Escáner en espera
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Carga una imagen o toca un espécimen de prueba para ver el veredicto de la IA.
              </p>
            </div>
          )}

          {!isAnalyzing && results && (
            <div className="space-y-5 animate-popIn">
              {/* Veredicto principal con degradado del tipo dominante */}
              <div
                className="rounded-2xl border-[2.5px] border-[#111827] shadow-ink-sm p-4 text-white flex flex-wrap items-center justify-between gap-3"
                style={{ background: dominantTheme.bgGradientCss }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#111827] flex items-center justify-center shrink-0">
                    <TypeIcon type={results.dominantType} size={30} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-extrabold uppercase bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded">
                      TIPO DOMINANTE
                    </span>
                    <h3 className="font-display font-extrabold text-2xl uppercase drop-shadow-sm mt-0.5">
                      {TYPE_ES[results.dominantType] || results.dominantType}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] font-bold uppercase text-white/90 block">
                    AFINIDAD
                  </span>
                  <span className="font-mono text-3xl font-extrabold drop-shadow-sm">
                    {results.top5[0].percentage}%
                  </span>
                </div>
              </div>

              {/* VISTA 1: GRÁFICO DE BARRAS HORIZONTAL (SOLO TOP 5) */}
              {viewType === 'horizontal' && (
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-[11px] font-extrabold text-slate-600 uppercase">
                    <span>Top 5 Tipos Detectados</span>
                    <span>Pertenencia %</span>
                  </div>

                  {results.top5.map((item, idx) => {
                    const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS.Normal;
                    return (
                      <div key={item.type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="flex items-center gap-2 text-[#111827]">
                            <span className="font-mono text-[11px] bg-[#111827] text-[#FFD43B] px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <TypeIcon type={item.type} size={18} />
                            <span className="font-display text-sm">
                              {TYPE_ES[item.type] || item.type}
                            </span>
                          </span>
                          <span className="font-mono text-sm text-[#111827]">
                            {item.percentage}%
                          </span>
                        </div>

                        <div className="w-full h-5 bg-[#F4EFE2] border-2 border-[#111827] rounded-xl overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-lg transition-all duration-700"
                            style={{
                              width: `${Math.max(5, item.percentage)}%`,
                              background: typeStyle.bgGradientCss,
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
                  <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {(() => {
                        const radius = 36;
                        const circumference = 2 * Math.PI * radius;
                        let accumulated = 0;

                        const sectors = [
                          ...results.top5.map((t) => ({
                            key: t.type,
                            name: TYPE_ES[t.type] || t.type,
                            percent: t.percentage,
                            color: TYPE_COLORS[t.type]?.bg || '#38BDF8',
                          })),
                          {
                            key: 'Otros',
                            name: 'Otros (13 tipos)',
                            percent: results.othersPercentage,
                            color: '#94A3B8',
                          },
                        ];

                        return sectors.map((sec) => {
                          const strokeDasharray = `${(sec.percent / 100) * circumference} ${circumference}`;
                          const strokeDashoffset = -((accumulated / 100) * circumference);
                          accumulated += sec.percent;
                          const isLit = hoveredSlice === sec.key;

                          return (
                            <circle
                              key={sec.key}
                              cx="50"
                              cy="50"
                              r={radius}
                              fill="transparent"
                              stroke={sec.color}
                              strokeWidth={isLit ? 19 : 15}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredSlice(sec.key)}
                              onMouseLeave={() => setHoveredSlice(null)}
                            />
                          );
                        });
                      })()}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="font-mono text-[10px] font-extrabold uppercase text-slate-500">
                        {hoveredSlice ? (TYPE_ES[hoveredSlice] || hoveredSlice) : 'Total'}
                      </span>
                      <span className="font-display font-extrabold text-xl text-[#111827]">
                        {hoveredSlice
                          ? `${
                              hoveredSlice === 'Otros'
                                ? results.othersPercentage
                                : results.top5.find((t) => t.type === hoveredSlice)?.percentage || 0
                            }%`
                          : '100%'}
                      </span>
                    </div>
                  </div>

                  {/* Leyenda interactiva */}
                  <div className="space-y-2 w-full sm:w-56 font-mono text-xs">
                    {results.top5.map((t) => (
                      <div
                        key={t.type}
                        onMouseEnter={() => setHoveredSlice(t.type)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-xl border-2 transition-colors cursor-pointer ${
                          hoveredSlice === t.type
                            ? 'bg-[#FFF9DB] border-[#111827]'
                            : 'bg-[#F4EFE2] border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-bold text-[#111827]">
                          <TypeIcon type={t.type} size={16} />
                          <span>{TYPE_ES[t.type] || t.type}</span>
                        </span>
                        <span className="font-extrabold text-[#111827]">{t.percentage}%</span>
                      </div>
                    ))}

                    <div
                      onMouseEnter={() => setHoveredSlice('Otros')}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className={`flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-xl border-2 transition-colors cursor-pointer ${
                        hoveredSlice === 'Otros'
                          ? 'bg-[#FFF9DB] border-[#111827]'
                          : 'bg-slate-100 border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2 font-bold text-slate-600">
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-[#111827]" />
                        <span>Otros (13)</span>
                      </span>
                      <span className="font-extrabold text-slate-700">{results.othersPercentage}%</span>
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

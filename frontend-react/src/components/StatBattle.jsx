import React, { useState, useEffect } from 'react';
import { getTwoRandomPokemons, getRandomPokemon, getRandomStatKey, STAT_NAMES, TYPE_COLORS } from '../services/pokemonService';
import TypeIcon from './TypeIcons';
import confetti from 'canvas-confetti';

export default function StatBattle({ onBackToHub }) {
  const [pokemonLeft, setPokemonLeft] = useState(null);
  const [pokemonRight, setPokemonRight] = useState(null);
  const [statKey, setStatKey] = useState('hp');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('stat_battle_highscore') || '0', 10);
  });
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'revealed' | 'gameover'
  const [lastComparison, setLastComparison] = useState(null);
  const [shiftAnimation, setShiftAnimation] = useState(false);

  // Iniciar primera ronda
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const [p1, p2] = getTwoRandomPokemons();
    const stat = getRandomStatKey();
    setPokemonLeft(p1);
    setPokemonRight(p2);
    setStatKey(stat);
    setScore(0);
    setGameState('playing');
    setLastComparison(null);
  };

  const handleGuess = (chosenSide) => {
    if (gameState !== 'playing' || !pokemonLeft || !pokemonRight) return;

    const valLeft = pokemonLeft[statKey];
    const valRight = pokemonRight[statKey];

    // En caso de empate, cualquier opción es válida
    const isCorrect = (valLeft === valRight) || 
      (chosenSide === 'left' && valLeft >= valRight) || 
      (chosenSide === 'right' && valRight >= valLeft);

    setLastComparison({
      valLeft,
      valRight,
      chosenSide,
      isCorrect,
      statName: STAT_NAMES[statKey].name
    });

    setGameState('revealed');

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('stat_battle_highscore', newScore.toString());
      }

      if (newScore % 5 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }

      // Transición al siguiente Pokémon:
      // "si acierta se pone el pokemon de la derecha a lado izquierda y alado derecho saldra un nuevo pokemon."
      setTimeout(() => {
        setShiftAnimation(true);
        setTimeout(() => {
          setPokemonLeft(pokemonRight);
          // Nuevo pokemon para la derecha que no sea igual
          const nextRight = getRandomPokemon(pokemonRight.id);
          setPokemonRight(nextRight);
          setStatKey(getRandomStatKey());
          setGameState('playing');
          setLastComparison(null);
          setShiftAnimation(false);
        }, 400);
      }, 1200);

    } else {
      // Falló -> Game Over
      setTimeout(() => {
        setGameState('gameover');
      }, 1500);
    }
  };

  if (!pokemonLeft || !pokemonRight) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentStat = STAT_NAMES[statKey];
  const leftGradient = TYPE_COLORS[pokemonLeft.type1]?.bgGradientCss || 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)';
  const rightGradient = TYPE_COLORS[pokemonRight.type1]?.bgGradientCss || 'linear-gradient(135deg, #450a0a 0%, #0f172a 100%)';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR CON PUNTUACIÓN Y CONTROL */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#101426] border border-amber-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <button
          onClick={onBackToHub}
          className="text-xs font-black text-amber-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 transition-colors cursor-pointer"
        >
          ← Regresar al Antro
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            Duelo Callejero • ¿Quién la tiene más grande?
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            Mejor Racha: <span className="text-amber-400 font-black">{highScore}</span>
          </div>
          <div className="bg-amber-600/30 border border-amber-500/40 px-3 py-1.5 rounded-xl text-white">
            Racha Actual: <span className="text-emerald-400 font-black text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* ANUNCIO DE LA ESTADÍSTICA ALEATORIA */}
      <div className="text-center my-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-amber-400/80 bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-500/30">
          Estadística en Disputa
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 mt-2 tracking-tight">
          {currentStat.name} ({currentStat.short})
        </h2>
        <p className="text-xs text-slate-300 mt-1 font-semibold">
          No le des vueltas: ¿cuál de estos dos cabrones tiene más {currentStat.short}? Si fallas te vas a la calle.
        </p>
      </div>

      {/* ARENA DE COMPARACIÓN (IZQUIERDA VS DERECHA) */}
      <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative transition-all duration-300 ${shiftAnimation ? 'opacity-50 scale-95' : 'opacity-100'}`}>
        
        {/* POKEMON IZQUIERDA (A) */}
        <div 
          className="border-2 border-slate-700/80 hover:border-amber-400/80 rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden transition-all group"
          style={{ background: leftGradient }}
        >
          <div className="absolute top-4 left-4 text-[10px] font-black text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
            #{pokemonLeft.id.toString().padStart(3, '0')}
          </div>

          <div className="w-full flex justify-end gap-1.5 mb-2">
            <span 
              className="text-[11px] font-black px-2.5 py-1 rounded-xl text-white shadow-md flex items-center gap-1.5 border border-white/20"
              style={{ backgroundColor: TYPE_COLORS[pokemonLeft.type1]?.bg || '#777' }}
            >
              <TypeIcon type={pokemonLeft.type1} className="w-3.5 h-3.5 fill-current" />
              {pokemonLeft.type1}
            </span>
            {pokemonLeft.type2 && (
              <span 
                className="text-[11px] font-black px-2.5 py-1 rounded-xl text-white shadow-md flex items-center gap-1.5 border border-white/20"
                style={{ backgroundColor: TYPE_COLORS[pokemonLeft.type2]?.bg || '#777' }}
              >
                <TypeIcon type={pokemonLeft.type2} className="w-3.5 h-3.5 fill-current" />
                {pokemonLeft.type2}
              </span>
            )}
          </div>

          {/* Imagen de PokéAPI */}
          <div className="relative w-48 h-48 flex items-center justify-center my-3 bg-black/20 rounded-2xl backdrop-blur-xs p-2">
            <img 
              src={pokemonLeft.image} 
              alt={pokemonLeft.name}
              onError={(e) => { e.target.src = pokemonLeft.thumbnail; }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
            />
          </div>

          <h3 className="text-2xl font-black text-white mb-3 tracking-wide drop-shadow">{pokemonLeft.name}</h3>

          {/* REVELACIÓN DE STAT */}
          {gameState !== 'playing' ? (
            <div className="w-full py-3 px-4 rounded-2xl bg-slate-950/90 border border-amber-400 text-center animate-bounce shadow-xl">
              <span className="text-xs text-slate-300 font-bold uppercase">{currentStat.short}:</span>
              <span className="text-3xl font-black text-amber-400 ml-2">{pokemonLeft[statKey]}</span>
            </div>
          ) : (
            <button
              onClick={() => handleGuess('left')}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer border border-yellow-200"
            >
              🔥 ¡{pokemonLeft.name} la tiene más grande!
            </button>
          )}
        </div>

        {/* VS BADGE CENTRAL */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-400 items-center justify-center font-black text-sm text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          VS
        </div>

        {/* POKEMON DERECHA (B) */}
        <div 
          className="border-2 border-slate-700/80 hover:border-amber-400/80 rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden transition-all group"
          style={{ background: rightGradient }}
        >
          <div className="absolute top-4 left-4 text-[10px] font-black text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
            #{pokemonRight.id.toString().padStart(3, '0')}
          </div>

          <div className="w-full flex justify-end gap-1.5 mb-2">
            <span 
              className="text-[11px] font-black px-2.5 py-1 rounded-xl text-white shadow-md flex items-center gap-1.5 border border-white/20"
              style={{ backgroundColor: TYPE_COLORS[pokemonRight.type1]?.bg || '#777' }}
            >
              <TypeIcon type={pokemonRight.type1} className="w-3.5 h-3.5 fill-current" />
              {pokemonRight.type1}
            </span>
            {pokemonRight.type2 && (
              <span 
                className="text-[11px] font-black px-2.5 py-1 rounded-xl text-white shadow-md flex items-center gap-1.5 border border-white/20"
                style={{ backgroundColor: TYPE_COLORS[pokemonRight.type2]?.bg || '#777' }}
              >
                <TypeIcon type={pokemonRight.type2} className="w-3.5 h-3.5 fill-current" />
                {pokemonRight.type2}
              </span>
            )}
          </div>

          {/* Imagen de PokéAPI */}
          <div className="relative w-48 h-48 flex items-center justify-center my-3 bg-black/20 rounded-2xl backdrop-blur-xs p-2">
            <img 
              src={pokemonRight.image} 
              alt={pokemonRight.name}
              onError={(e) => { e.target.src = pokemonRight.thumbnail; }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
            />
          </div>

          <h3 className="text-2xl font-black text-white mb-3 tracking-wide drop-shadow">{pokemonRight.name}</h3>

          {/* REVELACIÓN DE STAT */}
          {gameState !== 'playing' ? (
            <div className="w-full py-3 px-4 rounded-2xl bg-slate-950/90 border border-amber-400 text-center animate-bounce shadow-xl">
              <span className="text-xs text-slate-300 font-bold uppercase">{currentStat.short}:</span>
              <span className="text-3xl font-black text-amber-400 ml-2">{pokemonRight[statKey]}</span>
            </div>
          ) : (
            <button
              onClick={() => handleGuess('right')}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-orange-400 to-amber-300 hover:from-orange-300 hover:to-amber-200 shadow-lg shadow-orange-500/30 active:scale-95 transition-all cursor-pointer border border-amber-200"
            >
              ⚡ ¡{pokemonRight.name} la tiene más grande!
            </button>
          )}
        </div>

      </div>

      {/* FEEDBACK DE RESPUESTA EN VIVO */}
      {lastComparison && gameState === 'revealed' && (
        <div className={`p-4 rounded-2xl border-2 text-center max-w-md w-full animate-fadeIn shadow-xl ${
          lastComparison.isCorrect ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300' : 'bg-rose-950/90 border-rose-500 text-rose-300'
        }`}>
          <span className="font-black text-base block mb-0.5">
            {lastComparison.isCorrect ? '🎯 ¡Toma ya! Le diste al clavo (+1 Racha)' : '💀 ¡Cagaste! Esa no era ni de coña'}
          </span>
          <span className="text-xs font-bold">
            {pokemonLeft.name} [{lastComparison.valLeft}] vs {pokemonRight.name} [{lastComparison.valRight}]
          </span>
        </div>
      )}

      {/* MODAL GAME OVER */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121629] border-2 border-rose-500 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(244,63,94,0.3)]">
            <span className="text-6xl block mb-2">💥</span>
            <h3 className="text-3xl font-black text-rose-400 uppercase tracking-tight">¡Te fuiste a la mierda!</h3>
            <p className="text-xs text-slate-300 mt-1 font-semibold">
              Te confiaste y el algoritmo se está riendo en tu cara. ¿Vas a llorar o vas a pedir revancha?
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntos Logrados</span>
                <span className="text-3xl font-black text-white">{score}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Récord Guardado</span>
                <span className="text-3xl font-black text-amber-400">{highScore}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startNewGame}
                className="w-full py-4 rounded-xl font-black text-sm uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                🔄 Otra ronda, no me voy perdiendo
              </button>
              <button
                onClick={onBackToHub}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver con la cabeza gacha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

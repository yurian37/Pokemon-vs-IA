import React, { useState, useEffect } from 'react';
import { getTwoRandomPokemons, getRandomPokemon, getRandomStatKey, STAT_NAMES, TYPE_COLORS } from '../services/pokemonService';
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
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentStat = STAT_NAMES[statKey];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR CON PUNTUACIÓN Y CONTROL */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#14192d] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          ← Volver al Núcleo
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
            Actividad 1 • ¿Quién tiene más?
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            Récord: <span className="text-amber-400 font-black">{highScore}</span>
          </div>
          <div className="bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-white">
            Puntos: <span className="text-emerald-400 font-black text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* ANUNCIO DE LA ESTADÍSTICA ALEATORIA */}
      <div className="text-center my-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Estadística en juego
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 mt-1">
          {currentStat.name}
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          ¿Cuál de los dos Pokémon tiene un valor mayor en {currentStat.short}?
        </p>
      </div>

      {/* ARENA DE COMPARACIÓN (IZQUIERDA VS DERECHA) */}
      <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative transition-all duration-300 ${shiftAnimation ? 'opacity-50 scale-95' : 'opacity-100'}`}>
        
        {/* POKEMON IZQUIERDA (A) */}
        <div className="bg-[#141b2e] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden transition-all group">
          <div className="absolute top-4 left-4 text-[10px] font-black text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            #{pokemonLeft.id.toString().padStart(3, '0')}
          </div>

          <div className="w-full flex justify-end gap-1.5 mb-2">
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: TYPE_COLORS[pokemonLeft.type1]?.bg || '#777' }}
            >
              {pokemonLeft.type1}
            </span>
            {pokemonLeft.type2 && (
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                style={{ backgroundColor: TYPE_COLORS[pokemonLeft.type2]?.bg || '#777' }}
              >
                {pokemonLeft.type2}
              </span>
            )}
          </div>

          {/* Imagen de PokéAPI */}
          <div className="relative w-48 h-48 flex items-center justify-center my-3">
            <img 
              src={pokemonLeft.image} 
              alt={pokemonLeft.name}
              onError={(e) => { e.target.src = pokemonLeft.thumbnail; }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
            />
          </div>

          <h3 className="text-xl font-black text-white mb-2">{pokemonLeft.name}</h3>

          {/* REVELACIÓN DE STAT */}
          {gameState !== 'playing' ? (
            <div className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-center animate-bounce">
              <span className="text-xs text-slate-400 font-bold uppercase">{currentStat.short}:</span>
              <span className="text-3xl font-black text-amber-400 ml-2">{pokemonLeft[statKey]}</span>
            </div>
          ) : (
            <button
              onClick={() => handleGuess('left')}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {pokemonLeft.name} tiene más
            </button>
          )}
        </div>

        {/* VS BADGE CENTRAL */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1222] border-2 border-indigo-400/80 items-center justify-center font-black text-sm text-indigo-300 shadow-2xl">
          VS
        </div>

        {/* POKEMON DERECHA (B) */}
        <div className="bg-[#141b2e] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden transition-all group">
          <div className="absolute top-4 left-4 text-[10px] font-black text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            #{pokemonRight.id.toString().padStart(3, '0')}
          </div>

          <div className="w-full flex justify-end gap-1.5 mb-2">
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: TYPE_COLORS[pokemonRight.type1]?.bg || '#777' }}
            >
              {pokemonRight.type1}
            </span>
            {pokemonRight.type2 && (
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                style={{ backgroundColor: TYPE_COLORS[pokemonRight.type2]?.bg || '#777' }}
              >
                {pokemonRight.type2}
              </span>
            )}
          </div>

          {/* Imagen de PokéAPI */}
          <div className="relative w-48 h-48 flex items-center justify-center my-3">
            <img 
              src={pokemonRight.image} 
              alt={pokemonRight.name}
              onError={(e) => { e.target.src = pokemonRight.thumbnail; }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
            />
          </div>

          <h3 className="text-xl font-black text-white mb-2">{pokemonRight.name}</h3>

          {/* REVELACIÓN DE STAT */}
          {gameState !== 'playing' ? (
            <div className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 text-center animate-bounce">
              <span className="text-xs text-slate-400 font-bold uppercase">{currentStat.short}:</span>
              <span className="text-3xl font-black text-amber-400 ml-2">{pokemonRight[statKey]}</span>
            </div>
          ) : (
            <button
              onClick={() => handleGuess('right')}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {pokemonRight.name} tiene más
            </button>
          )}
        </div>

      </div>

      {/* FEEDBACK DE RESPUESTA EN VIVO */}
      {lastComparison && gameState === 'revealed' && (
        <div className={`p-4 rounded-2xl border text-center max-w-md w-full animate-fadeIn ${
          lastComparison.isCorrect ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
        }`}>
          <span className="font-black text-base block mb-0.5">
            {lastComparison.isCorrect ? '✅ ¡ACIERTO! +1 Punto' : '❌ ¡INCORRECTO!'}
          </span>
          <span className="text-xs">
            {pokemonLeft.name} ({lastComparison.valLeft}) vs {pokemonRight.name} ({lastComparison.valRight})
          </span>
        </div>
      )}

      {/* MODAL GAME OVER */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141b2e] border-2 border-rose-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <span className="text-5xl block mb-2">💥</span>
            <h3 className="text-2xl font-black text-rose-400 uppercase tracking-tight">Game Over</h3>
            <p className="text-xs text-slate-300 mt-1">
              Has fallado la comparación de estadísticas.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntos Conseguidos</span>
                <span className="text-3xl font-black text-white">{score}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Récord Actual</span>
                <span className="text-3xl font-black text-amber-400">{highScore}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-xl font-black text-sm uppercase text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                Jugar de Nuevo
              </button>
              <button
                onClick={onBackToHub}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver al Núcleo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

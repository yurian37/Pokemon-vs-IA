import React, { useState, useEffect, useCallback } from 'react';
import { getTwoRandomPokemons, getRandomPokemon, getRandomStatKey, STAT_NAMES, TYPE_COLORS, TYPE_ES } from '../services/pokemonService';
import { TypeIcon } from './TypeIcons';
import HoloCard from './HoloCard';
import { sfx } from '../services/soundService';
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

  const startNewGame = useCallback(() => {
    sfx.click();
    const [p1, p2] = getTwoRandomPokemons();
    const stat = getRandomStatKey();
    setPokemonLeft(p1);
    setPokemonRight(p2);
    setStatKey(stat);
    setScore(0);
    setGameState('playing');
    setLastComparison(null);
    setShiftAnimation(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = useCallback((chosenSide) => {
    if (gameState !== 'playing' || !pokemonLeft || !pokemonRight) return;

    const valLeft = pokemonLeft[statKey];
    const valRight = pokemonRight[statKey];

    const isCorrect =
      valLeft === valRight ||
      (chosenSide === 'left' && valLeft >= valRight) ||
      (chosenSide === 'right' && valRight >= valLeft);

    setLastComparison({
      valLeft,
      valRight,
      chosenSide,
      isCorrect,
      statName: STAT_NAMES[statKey].name,
    });

    setGameState('revealed');

    if (isCorrect) {
      sfx.win();
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('stat_battle_highscore', newScore.toString());
      }

      if (newScore % 5 === 0) {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
      }

      // Regla exacta: el Pokémon de la derecha pasa a la izquierda y sale uno nuevo a la derecha
      setTimeout(() => {
        setShiftAnimation(true);
        setTimeout(() => {
          setPokemonLeft(pokemonRight);
          const nextRight = getRandomPokemon(pokemonRight.id);
          setPokemonRight(nextRight);
          setStatKey(getRandomStatKey());
          setGameState('playing');
          setLastComparison(null);
          setShiftAnimation(false);
        }, 360);
      }, 1150);
    } else {
      sfx.lose();
      setTimeout(() => {
        setGameState('gameover');
      }, 1450);
    }
  }, [gameState, pokemonLeft, pokemonRight, statKey, score, highScore]);

  // Atajos de teclado arcade (← / A = izquierda, → / D = derecha)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleGuess('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleGuess('right');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, handleGuess]);

  if (!pokemonLeft || !pokemonRight) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="arcade-panel rounded-2xl px-6 py-4 font-mono font-extrabold text-sm">
          Cargando luchadores...
        </div>
      </div>
    );
  }

  const currentStat = STAT_NAMES[statKey];
  const leftTheme = TYPE_COLORS[pokemonLeft.type1] || TYPE_COLORS.Fire;
  const rightTheme = TYPE_COLORS[pokemonRight.type1] || TYPE_COLORS.Water;
  const maxStatInDuel = Math.max(pokemonLeft[statKey], pokemonRight[statKey], 1);

  const streakBadge =
    score >= 10 ? 'MODO BESTIA' : score >= 5 ? 'ENCENDIDO' : score >= 3 ? 'EN RACHA' : null;

  const renderFighterCard = (pokemon, side, theme, hotkey) => {
    const statValue = pokemon[statKey];
    const barPct = Math.max(12, Math.round((statValue / maxStatInDuel) * 100));
    const isWinner =
      gameState !== 'playing' &&
      ((side === 'left' && pokemonLeft[statKey] >= pokemonRight[statKey]) ||
        (side === 'right' && pokemonRight[statKey] >= pokemonLeft[statKey]));

    return (
      <HoloCard
        disabled={gameState !== 'playing'}
        className={`rounded-3xl border-[3px] border-[#111827] shadow-ink-lg overflow-hidden flex flex-col justify-between p-5 relative transition-all ${
          gameState !== 'playing' && isWinner ? 'ring-4 ring-[#FFD43B]' : ''
        }`}
        style={{ background: theme.bgGradientCss }}
      >
        {/* Textura halftone y marca de agua SVG gigante */}
        <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
          <TypeIcon type={pokemon.type1} size={180} />
        </div>

        {/* Cabecera de la carta */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="font-mono text-[11px] font-extrabold bg-[#111827] text-[#FFD43B] px-2.5 py-1 rounded-lg border border-white/20">
            #{String(pokemon.id).padStart(4, '0')}
          </span>

          <div className="flex flex-wrap gap-1.5">
            <span className="arcade-stamp bg-[#FFFDF7] text-[#111827] text-[11px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <TypeIcon type={pokemon.type1} size={14} />
              {TYPE_ES[pokemon.type1] || pokemon.type1}
            </span>
            {pokemon.type2 && (
              <span className="arcade-stamp bg-[#FFFDF7] text-[#111827] text-[11px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <TypeIcon type={pokemon.type2} size={14} />
                {TYPE_ES[pokemon.type2] || pokemon.type2}
              </span>
            )}
          </div>
        </div>

        {/* Marco del Sprite */}
        <div className="relative z-10 bg-[#FFFDF7]/95 border-[3px] border-[#111827] rounded-2xl p-4 my-2 flex flex-col items-center justify-center shadow-ink-sm">
          <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              onError={(e) => { e.target.src = pokemon.thumbnail; }}
              className="max-w-full max-h-full object-contain drop-shadow-[0_10px_14px_rgba(17,24,39,0.35)] animate-floatSlow"
            />
          </div>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#111827] mt-2 text-center">
            {pokemon.name}
          </h3>
        </div>

        {/* Botón de elección o barra revelada */}
        <div className="relative z-10 mt-3">
          {gameState !== 'playing' ? (
            <div className="bg-[#111827] text-white border-2 border-[#FFD43B] rounded-2xl p-3.5 animate-popIn">
              <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                <span className="uppercase text-slate-300 font-bold">{currentStat.short}</span>
                <span className="text-2xl font-extrabold text-[#FFD43B]">{statValue}</span>
              </div>
              <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    backgroundColor: isWinner ? '#4ADE80' : '#F87171',
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleGuess(side)}
              className="arcade-btn w-full py-3.5 px-4 rounded-2xl bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] font-display font-extrabold text-sm sm:text-base uppercase tracking-wide flex items-center justify-between gap-2 cursor-pointer"
            >
              <span className="truncate">¡{pokemon.name} tiene más!</span>
              <span className="font-mono text-[11px] bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded-md shrink-0">
                [{hotkey}]
              </span>
            </button>
          )}
        </div>
      </HoloCard>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 animate-fadeIn">
      
      {/* HUD SUPERIOR DEL RING */}
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="arcade-stamp bg-[#D9383A] text-white px-3 py-1 rounded-xl font-mono text-xs font-extrabold uppercase">
            MODO 01 • ¿QUIÉN TIENE MÁS?
          </span>
          {streakBadge && (
            <span className="arcade-stamp bg-[#FFD43B] text-[#111827] px-2.5 py-1 rounded-xl font-mono text-[11px] font-extrabold animate-bounce">
              {streakBadge} x{score}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-extrabold">
          <div className="bg-[#FFF9DB] border-2 border-[#111827] px-3 py-1.5 rounded-xl">
            RÉCORD: <span className="text-[#D9383A]">{highScore}</span>
          </div>
          <div className="bg-[#111827] text-[#FFD43B] border-2 border-[#111827] px-3.5 py-1.5 rounded-xl">
            RACHA: <span className="text-white text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* MARCADOR DE LA ESTADÍSTICA EN DISPUTA */}
      <div className="arcade-panel rounded-3xl p-4 sm:p-5 text-center relative overflow-hidden">
        <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
          Estadística en juego esta ronda
        </span>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <span
            className="arcade-stamp text-white font-display font-extrabold text-2xl sm:text-3xl px-5 py-1.5 rounded-2xl uppercase"
            style={{ backgroundColor: currentStat.color }}
          >
            {currentStat.name}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
          Sin rodeos: ¿cuál de estos dos cabrones tiene más <strong>{currentStat.short}</strong>? Usa clic o las flechas <kbd className="font-mono bg-slate-200 border border-[#111827] px-1.5 py-0.5 rounded text-[11px]">←</kbd> <kbd className="font-mono bg-slate-200 border border-[#111827] px-1.5 py-0.5 rounded text-[11px]">→</kbd>.
        </p>
      </div>

      {/* ARENA VERSUS */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 relative transition-all duration-300 ${
          shiftAnimation ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {renderFighterCard(pokemonLeft, 'left', leftTheme, '←')}

        {/* SELLO VS CENTRAL */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-2xl rotate-6 bg-[#FFD43B] border-[3.5px] border-[#111827] shadow-ink items-center justify-center font-display font-extrabold text-xl text-[#111827]">
          VS
        </div>

        {renderFighterCard(pokemonRight, 'right', rightTheme, '→')}
      </div>

      {/* BANNER DE FEEDBACK EN VIVO */}
      {lastComparison && gameState === 'revealed' && (
        <div
          className={`arcade-panel rounded-2xl p-4 text-center animate-popIn ${
            lastComparison.isCorrect ? 'bg-[#D3F9D8]' : 'bg-[#FFE3E3] animate-shake'
          }`}
        >
          <p className="font-display font-extrabold text-lg text-[#111827]">
            {lastComparison.isCorrect
              ? '¡Correcto! (+1 Punto). El Pokémon de la derecha pasa a la izquierda.'
              : '¡Fallaste! Ese valor era menor...'}
          </p>
          <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">
            {pokemonLeft.name} ({lastComparison.valLeft}) vs {pokemonRight.name} ({lastComparison.valRight})
          </p>
        </div>
      )}

      {/* MODAL GAME OVER */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="arcade-panel rounded-3xl p-6 sm:p-8 max-w-md w-full text-center animate-popIn">
            <span className="arcade-stamp inline-block bg-[#D9383A] text-white font-mono text-xs font-extrabold uppercase px-3 py-1 rounded-lg -rotate-2 mb-3">
              FIN DE LA PARTIDA
            </span>
            <h3 className="font-display font-extrabold text-3xl text-[#111827] uppercase">
              ¡Fin de la Racha!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1.5">
              Te confiaste y te volaron la racha en pedazos. ¿Vas a llorar o pides revancha de una vez?
            </p>

            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="bg-[#F4EFE2] border-2 border-[#111827] rounded-2xl p-3 shadow-ink-sm">
                <span className="font-mono text-[10px] font-extrabold uppercase text-slate-600 block">
                  Racha Lograda
                </span>
                <span className="font-display font-extrabold text-3xl text-[#111827]">
                  {score}
                </span>
              </div>
              <div className="bg-[#FFF9DB] border-2 border-[#111827] rounded-2xl p-3 shadow-ink-sm">
                <span className="font-mono text-[10px] font-extrabold uppercase text-slate-600 block">
                  Tu Récord
                </span>
                <span className="font-display font-extrabold text-3xl text-[#D9383A]">
                  {highScore}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={startNewGame}
                className="arcade-btn w-full py-3.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] font-display font-extrabold text-sm uppercase cursor-pointer"
              >
                Otra Ronda, No Me Voy Perdiendo
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  onBackToHub();
                }}
                className="arcade-btn w-full py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#111827] font-bold text-xs uppercase cursor-pointer"
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

import React, { useState, useEffect, useCallback } from 'react';
import { generateTypeDuelRound, TYPE_COLORS, TYPE_ES } from '../services/pokemonService';
import { aiPredictTypeForDuel } from '../services/mlModelsService';
import { TypeIcon } from './TypeIcons';
import { sfx } from '../services/soundService';
import confetti from 'canvas-confetti';

export default function TypeDuel({ onBackToHub }) {
  // Regla exacta: La IA arranca con 5 puntos de ventaja
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(5);
  const [roundNumber, setRoundNumber] = useState(1);

  const [currentRound, setCurrentRound] = useState(null);
  const [roundStatus, setRoundStatus] = useState('waiting_user');
  const [userChoice, setUserChoice] = useState(null);
  const [aiAttempts, setAiAttempts] = useState({
    first: null,
    second: null,
    points: 0,
    firstSuccess: false,
    secondSuccess: false,
  });
  const [roundFeedback, setRoundFeedback] = useState(null);

  const loadNewRound = useCallback(() => {
    const round = generateTypeDuelRound();
    setCurrentRound(round);
    setUserChoice(null);
    setAiAttempts({ first: null, second: null, points: 0, firstSuccess: false, secondSuccess: false });
    setRoundFeedback(null);
    setRoundStatus('waiting_user');
  }, []);

  const startNewGame = useCallback(() => {
    sfx.click();
    setPlayerScore(0);
    setAiScore(5);
    setRoundNumber(1);
    setRoundStatus('waiting_user');
    loadNewRound();
  }, [loadNewRound]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleUserSelect = useCallback(async (selectedType) => {
    if (roundStatus !== 'waiting_user' || !currentRound) return;

    sfx.click();
    setUserChoice(selectedType);
    setRoundStatus('user_answered');

    const userIsCorrect = selectedType === currentRound.correctType;
    const userEarned = userIsCorrect ? 2 : 0;
    const newPlayerScore = playerScore + userEarned;
    setPlayerScore(newPlayerScore);

    if (userIsCorrect) sfx.win();
    else sfx.lose();

    setRoundStatus('ai_turn');

    const aiPrediction = await aiPredictTypeForDuel(currentRound.options, currentRound.pokemon.image);

    const aiChoice1 = aiPrediction.firstChoice;
    const ai1Correct = aiChoice1 === currentRound.correctType;

    let aiChoice2 = null;
    let ai2Correct = false;
    let aiEarned = 0;

    if (ai1Correct) {
      aiEarned = 2; // Acierta a la 1ª: +2 pts
    } else {
      const remainingOptions = currentRound.options.filter((opt) => opt !== aiChoice1);
      aiChoice2 = aiPrediction.secondChoice !== aiChoice1 ? aiPrediction.secondChoice : remainingOptions[0];
      ai2Correct = aiChoice2 === currentRound.correctType;
      aiEarned = ai2Correct ? 1 : 0; // Acierta a la 2ª: +1 pt
    }

    const newAiScore = aiScore + aiEarned;
    setAiScore(newAiScore);

    setAiAttempts({
      first: aiChoice1,
      second: aiChoice2,
      points: aiEarned,
      firstSuccess: ai1Correct,
      secondSuccess: ai2Correct,
    });

    setRoundFeedback({
      userIsCorrect,
      userEarned,
      aiEarned,
      correctType: currentRound.correctType,
      pokemonName: currentRound.pokemon.name,
    });

    if (newPlayerScore >= newAiScore) {
      setRoundStatus('game_won');
      sfx.fanfare();
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 } });
    } else {
      setRoundStatus('round_finished');
    }
  }, [roundStatus, currentRound, playerScore, aiScore]);

  const handleNextRound = useCallback(() => {
    sfx.click();
    setRoundNumber((prev) => prev + 1);
    loadNewRound();
  }, [loadNewRound]);

  // Atajos de teclado [1][2][3][4] y Enter para siguiente ronda
  useEffect(() => {
    const onKeyDown = (e) => {
      if (roundStatus === 'waiting_user' && currentRound) {
        const idx = ['1', '2', '3', '4'].indexOf(e.key);
        if (idx !== -1 && currentRound.options[idx]) {
          handleUserSelect(currentRound.options[idx]);
        }
      } else if (roundStatus === 'round_finished' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextRound();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [roundStatus, currentRound, handleUserSelect, handleNextRound]);

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="arcade-panel rounded-2xl px-6 py-4 font-mono font-extrabold text-sm">
          Preparando pista Alcánzame...
        </div>
      </div>
    );
  }

  const distanceToCatch = Math.max(0, aiScore - playerScore);
  const maxTrackScore = Math.max(16, Math.max(playerScore, aiScore) + 4);
  const aiPct = Math.min(96, Math.max(6, (aiScore / maxTrackScore) * 100));
  const playerPct = Math.min(96, Math.max(4, (playerScore / maxTrackScore) * 100));
  const revealedTheme = TYPE_COLORS[currentRound.correctType] || TYPE_COLORS.Electric;

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

        <span className="arcade-stamp bg-[#FFD43B] text-[#111827] px-3 py-1 rounded-xl font-mono text-xs font-extrabold uppercase">
          MODO 02 • TABLERO ALCÁNZAME
        </span>

        <div className="font-mono text-xs font-extrabold bg-[#111827] text-white px-3.5 py-1.5 rounded-xl border-2 border-[#111827]">
          RONDA <span className="text-[#FFD43B]">#{roundNumber}</span>
        </div>
      </div>

      {/* PISTA ALCÁNZAME ESTILO DRAG-STRIP ARCADE */}
      <div className="arcade-panel rounded-3xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#D9383A] block">
              PERSECUCIÓN EN VIVO
            </span>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
              La IA arrancó +5 arriba por tramposa. ¡Cázala!
            </h2>
          </div>

          <div className="arcade-stamp bg-[#111827] text-white px-3.5 py-1.5 rounded-xl font-mono text-xs font-extrabold">
            BRECHA:{' '}
            <span className={distanceToCatch === 0 ? 'text-[#4ADE80]' : 'text-[#FFD43B]'}>
              {distanceToCatch} PTS
            </span>
          </div>
        </div>

        {/* Carriles físicos */}
        <div className="space-y-3.5">
          {/* Carril IA */}
          <div>
            <div className="flex justify-between font-mono text-xs font-extrabold mb-1">
              <span className="text-[#D9383A]">BOT TRAMPOSO (IA)</span>
              <span className="text-[#111827]">{aiScore} PTS</span>
            </div>
            <div className="w-full h-7 bg-[#F4EFE2] border-[2.5px] border-[#111827] rounded-xl overflow-hidden relative p-0.5">
              <div
                className="h-full bg-[#D9383A] rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                style={{ width: `${aiPct}%` }}
              >
                <span className="font-mono text-[10px] font-extrabold text-white">IA</span>
              </div>
            </div>
          </div>

          {/* Carril Jugador */}
          <div>
            <div className="flex justify-between font-mono text-xs font-extrabold mb-1">
              <span className="text-[#15803D]">TÚ (CAZADOR)</span>
              <span className="text-[#111827]">{playerScore} PTS</span>
            </div>
            <div className="w-full h-7 bg-[#F4EFE2] border-[2.5px] border-[#111827] rounded-xl overflow-hidden relative p-0.5">
              <div
                className="h-full bg-[#16A34A] rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                style={{ width: `${playerPct}%` }}
              >
                <span className="font-mono text-[10px] font-extrabold text-white">TÚ</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-700 mt-3 bg-[#FFF9DB] border-2 border-[#111827] rounded-xl px-3 py-2">
          Reglas claras: Si aciertas sumas <strong className="text-[#15803D]">+2 pts</strong>. La IA tiene 2 tiros (<strong className="text-[#D9383A]">+2 pts</strong> a la 1ª o <strong className="text-[#D9383A]">+1 pt</strong> a la 2ª). Ganas en el instante en que la alcanzas.
        </p>
      </div>

      {/* ZONA DE DUELO: ESPECIE MISTERIOSA (SIN NOMBRE) + 4 PADS ARCADE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* IMAGEN SIN NOMBRE */}
        <div
          className="md:col-span-5 rounded-3xl border-[3px] border-[#111827] shadow-ink-lg p-5 flex flex-col items-center justify-between relative overflow-hidden"
          style={{
            background:
              roundStatus === 'round_finished' || roundStatus === 'game_won'
                ? revealedTheme.bgGradientCss
                : 'linear-gradient(135deg, #1E3A5F 0%, #111827 100%)',
          }}
        >
          <div className="absolute inset-0 bg-halftone-light opacity-45 pointer-events-none" />

          <span className="relative z-10 arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-[11px] font-extrabold uppercase px-3 py-1 rounded-xl">
            {roundStatus === 'waiting_user' ? '¿DE QUÉ CARAJOS ES ESTE BICHO?' : 'IDENTIDAD REVELADA'}
          </span>

          <div className="relative z-10 w-52 h-52 my-4 rounded-2xl bg-[#FFFDF7] border-[3px] border-[#111827] shadow-ink flex items-center justify-center p-3">
            <img
              src={currentRound.pokemon.image}
              alt="Pokémon misterioso sin nombre"
              onError={(e) => { e.target.src = currentRound.pokemon.thumbnail; }}
              className="max-w-full max-h-full object-contain drop-shadow-[0_10px_14px_rgba(17,24,39,0.35)] animate-floatSlow"
            />
          </div>

          <div className="relative z-10 w-full text-center">
            {roundStatus === 'round_finished' || roundStatus === 'game_won' ? (
              <div className="bg-[#FFFDF7] border-2 border-[#111827] rounded-2xl p-3 shadow-ink-sm animate-popIn">
                <h4 className="font-display font-extrabold text-xl text-[#111827]">
                  {currentRound.pokemon.name}
                </h4>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1.5">
                  <span className="arcade-stamp bg-white text-[#111827] text-xs font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                    <TypeIcon type={currentRound.pokemon.type1} size={14} />
                    {TYPE_ES[currentRound.pokemon.type1] || currentRound.pokemon.type1}
                  </span>
                  {currentRound.pokemon.type2 && (
                    <span className="arcade-stamp bg-white text-[#111827] text-xs font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <TypeIcon type={currentRound.pokemon.type2} size={14} />
                      {TYPE_ES[currentRound.pokemon.type2] || currentRound.pokemon.type2}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="font-mono text-xs font-extrabold text-white/95 bg-[#111827]/70 px-3 py-1.5 rounded-xl border border-white/20 inline-block">
                Sin nombre • Usa teclas [1] [2] [3] [4]
              </span>
            )}
          </div>
        </div>

        {/* 4 PADS DE TIPOS + TERMINAL DE LA IA */}
        <div className="md:col-span-7 flex flex-col justify-between gap-4">
          <div className="arcade-panel rounded-3xl p-4 sm:p-5 flex flex-col gap-3">
            <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              Elige el tipo correcto (los 3 distractores jamás coinciden con ninguno de sus tipos)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentRound.options.map((typeOption, idx) => {
                const typeStyle = TYPE_COLORS[typeOption] || TYPE_COLORS.Normal;
                const isSelected = userChoice === typeOption;
                const isCorrect = typeOption === currentRound.correctType;
                const isRevealed = roundStatus !== 'waiting_user';

                let padClasses = 'bg-[#FFFDF7] text-[#111827] hover:bg-[#FFF9DB]';
                let customBg = undefined;

                if (isRevealed) {
                  if (isCorrect) {
                    padClasses = 'text-white ring-4 ring-[#4ADE80]';
                    customBg = typeStyle.bgGradientCss;
                  } else if (isSelected && !isCorrect) {
                    padClasses = 'bg-[#FFE3E3] text-[#991B1B] opacity-90';
                  } else {
                    padClasses = 'bg-slate-100 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={typeOption}
                    disabled={roundStatus !== 'waiting_user'}
                    onClick={() => handleUserSelect(typeOption)}
                    style={{ background: customBg }}
                    className={`arcade-btn rounded-2xl p-3.5 flex items-center justify-between gap-2 cursor-pointer text-left ${padClasses}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-extrabold w-7 h-7 rounded-lg bg-[#111827] text-[#FFD43B] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#111827] flex items-center justify-center shrink-0 shadow-sm">
                        <TypeIcon type={typeOption} size={22} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-display font-extrabold text-base block leading-none truncate">
                          {TYPE_ES[typeOption] || typeOption}
                        </span>
                        <span className="font-mono text-[10px] font-bold uppercase opacity-75">
                          {typeOption}
                        </span>
                      </div>
                    </div>

                    <span
                      className="w-4 h-4 rounded-full border-2 border-[#111827] shrink-0"
                      style={{ backgroundColor: typeStyle.bg }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* TERMINAL DE TURNO DE LA IA */}
          {roundStatus === 'ai_turn' && (
            <div className="arcade-panel-dark text-[#FFD43B] rounded-2xl p-4 font-mono text-xs font-extrabold animate-pulse">
              La IA está analizando los píxeles del bicho con sus 2 intentos...
            </div>
          )}

          {roundFeedback && (
            <div className="arcade-panel rounded-2xl p-4 space-y-2.5 animate-popIn">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-[#111827]/20 pb-2">
                <span className="font-display font-extrabold text-base text-[#111827]">
                  {roundFeedback.userIsCorrect
                    ? '¡Toma ya! Le atinaste (+2 pts)'
                    : '¡Fallaste! Cero puntos para tu cuenta'}
                </span>
                <span className="arcade-stamp bg-[#FFD43B] text-[#111827] font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                  <TypeIcon type={roundFeedback.correctType} size={14} />
                  {TYPE_ES[roundFeedback.correctType] || roundFeedback.correctType}
                </span>
              </div>

              <div className="font-mono text-xs font-bold space-y-1 text-slate-800">
                <div className="flex justify-between gap-2">
                  <span>1er Tiro IA: <strong>{TYPE_ES[aiAttempts.first] || aiAttempts.first}</strong></span>
                  <span className={aiAttempts.firstSuccess ? 'text-[#D9383A]' : 'text-[#15803D]'}>
                    {aiAttempts.firstSuccess ? 'Acertó a la 1ª (+2 pts)' : 'Falló el 1er tiro'}
                  </span>
                </div>
                {!aiAttempts.firstSuccess && (
                  <div className="flex justify-between gap-2">
                    <span>2do Tiro IA: <strong>{TYPE_ES[aiAttempts.second] || aiAttempts.second}</strong></span>
                    <span className={aiAttempts.secondSuccess ? 'text-[#D9383A]' : 'text-[#15803D]'}>
                      {aiAttempts.secondSuccess ? 'Rescató a la 2ª (+1 pt)' : 'Volvió a fallar (+0 pts)'}
                    </span>
                  </div>
                )}
              </div>

              {roundStatus === 'round_finished' && (
                <button
                  onClick={handleNextRound}
                  className="arcade-btn w-full py-3 rounded-xl bg-[#111827] hover:bg-[#1E3A5F] text-[#FFD43B] font-display font-extrabold text-sm uppercase cursor-pointer mt-1"
                >
                  Siguiente Bicho [Enter] →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL VICTORIA */}
      {roundStatus === 'game_won' && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="arcade-panel rounded-3xl p-6 sm:p-8 max-w-md w-full text-center animate-popIn">
            <span className="arcade-stamp inline-block bg-[#16A34A] text-white font-mono text-xs font-extrabold uppercase px-3 py-1 rounded-lg -rotate-2 mb-3">
              CAZASTE A LA MÁQUINA
            </span>
            <h3 className="font-display font-extrabold text-3xl text-[#111827] uppercase">
              ¡Le callaste el hocico a la IA!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1.5">
              Le remontaste los 5 puntos de ventaja tramposa y la dejaste comiendo polvo en {roundNumber} rondas.
            </p>

            <div className="grid grid-cols-3 gap-2 my-5">
              <div className="bg-[#EBFBEE] border-2 border-[#111827] rounded-xl p-2.5">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">Tú</span>
                <span className="font-display font-extrabold text-2xl text-[#15803D]">{playerScore}</span>
              </div>
              <div className="bg-[#FFE3E3] border-2 border-[#111827] rounded-xl p-2.5">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">IA</span>
                <span className="font-display font-extrabold text-2xl text-[#D9383A]">{aiScore}</span>
              </div>
              <div className="bg-[#FFF9DB] border-2 border-[#111827] rounded-xl p-2.5">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">Rondas</span>
                <span className="font-display font-extrabold text-2xl text-[#111827]">{roundNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={startNewGame}
                className="arcade-btn w-full py-3.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] font-display font-extrabold text-sm uppercase cursor-pointer"
              >
                Darle Otra Paliza a la IA
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

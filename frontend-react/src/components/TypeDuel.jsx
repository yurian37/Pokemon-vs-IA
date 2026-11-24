import React, { useState, useEffect } from 'react';
import { generateTypeDuelRound, TYPE_COLORS } from '../services/pokemonService';
import { aiPredictTypeForDuel } from '../services/mlModelsService';
import TypeIcon from './TypeIcons';
import confetti from 'canvas-confetti';

export default function TypeDuel({ onBackToHub }) {
  // Puntos del tablero Alcánzame: La IA parte con 5 puntos de ventaja
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(5);
  const [roundNumber, setRoundNumber] = useState(1);

  // Datos de la ronda
  const [currentRound, setCurrentRound] = useState(null);
  const [roundStatus, setRoundStatus] = useState('waiting_user'); // 'waiting_user' | 'user_answered' | 'ai_turn' | 'round_finished' | 'game_won'
  
  // Respuestas del turno actual
  const [userChoice, setUserChoice] = useState(null);
  const [aiAttempts, setAiAttempts] = useState({ first: null, second: null, points: 0, firstSuccess: false, secondSuccess: false });
  const [roundFeedback, setRoundFeedback] = useState(null);

  // Iniciar primera ronda
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setPlayerScore(0);
    setAiScore(5);
    setRoundNumber(1);
    setRoundStatus('waiting_user');
    loadNewRound();
  };

  const loadNewRound = () => {
    const round = generateTypeDuelRound();
    setCurrentRound(round);
    setUserChoice(null);
    setAiAttempts({ first: null, second: null, points: 0, firstSuccess: false, secondSuccess: false });
    setRoundFeedback(null);
    setRoundStatus('waiting_user');
  };

  const handleUserSelect = async (selectedType) => {
    if (roundStatus !== 'waiting_user' || !currentRound) return;

    setUserChoice(selectedType);
    setRoundStatus('user_answered');

    // Comprobar acierto del usuario
    const userIsCorrect = selectedType === currentRound.correctType;
    const userEarned = userIsCorrect ? 2 : 0;
    const newPlayerScore = playerScore + userEarned;
    setPlayerScore(newPlayerScore);

    // Turno de la IA con análisis de la imagen del Pokémon
    setRoundStatus('ai_turn');

    const aiPrediction = await aiPredictTypeForDuel(currentRound.options, currentRound.pokemon.image);

    // Intento 1 de la IA
    const aiChoice1 = aiPrediction.firstChoice;
    const ai1Correct = aiChoice1 === currentRound.correctType;

    let aiChoice2 = null;
    let ai2Correct = false;
    let aiEarned = 0;

    if (ai1Correct) {
      aiEarned = 2; // Acierta a la primera: +2 puntos
    } else {
      // Intento 2: "sabiendo que ya la primera no es, a la segunda"
      const remainingOptions = currentRound.options.filter(opt => opt !== aiChoice1);
      // Elige de las restantes
      aiChoice2 = aiPrediction.secondChoice !== aiChoice1 ? aiPrediction.secondChoice : remainingOptions[0];
      ai2Correct = aiChoice2 === currentRound.correctType;
      if (ai2Correct) {
        aiEarned = 1; // Acierta a la segunda: +1 punto
      } else {
        aiEarned = 0; // No acertó
      }
    }

    const newAiScore = aiScore + aiEarned;
    setAiScore(newAiScore);

    setAiAttempts({
      first: aiChoice1,
      second: aiChoice2,
      points: aiEarned,
      firstSuccess: ai1Correct,
      secondSuccess: ai2Correct
    });

    setRoundFeedback({
      userIsCorrect,
      userEarned,
      aiEarned,
      correctType: currentRound.correctType,
      pokemonName: currentRound.pokemon.name
    });

    // Condición de Victoria: "El juego se acaba cuando el usuario alcanza a la IA"
    if (newPlayerScore >= newAiScore) {
      setRoundStatus('game_won');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } else {
      setRoundStatus('round_finished');
    }
  };

  const handleNextRound = () => {
    setRoundNumber(prev => prev + 1);
    loadNewRound();
  };

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Pista Alcánzame
  const distanceToCatch = Math.max(0, aiScore - playerScore);
  const maxTrackScore = Math.max(20, Math.max(playerScore, aiScore) + 5);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#101426] border border-purple-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <button
          onClick={onBackToHub}
          className="text-xs font-black text-purple-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
        >
          ← Regresar al Antro
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20">
          Cacería Elemental • Tablero Alcánzame
        </span>

        <div className="text-xs font-bold text-slate-300">
          Round <span className="text-amber-400 font-black">#{roundNumber}</span>
        </div>
      </div>

      {/* TABLERO ALCÁNZAME (PISTA DE PERSECUCIÓN) */}
      <div className="w-full bg-[#121629] border-2 border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏃💨</span>
            <span className="text-xs uppercase font-black text-purple-300 tracking-wider">
              Pista de Persecución sin Tregua
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-400">
              Tú: <span className="text-white text-base font-black">{playerScore} pts</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400">
              IA (+5 inicio tramposo): <span className="text-white text-base font-black">{aiScore} pts</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">
              Brecha: <span className="text-white text-base font-black">{distanceToCatch} pts</span>
            </span>
          </div>
        </div>

        {/* Carril Visual de Progreso */}
        <div className="space-y-3 relative py-2">
          {/* Fila IA */}
          <div className="relative">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span>🤖 Modelo tramposo de IA</span>
              <span className="text-rose-400 font-mono font-bold">{aiScore} pts</span>
            </div>
            <div className="w-full h-5 bg-slate-950 rounded-full overflow-hidden border border-rose-500/30 relative">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                style={{ width: `${Math.min(100, (aiScore / maxTrackScore) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fila Jugador */}
          <div className="relative">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span>👤 Tu Pellejo (Cazador)</span>
              <span className="text-emerald-400 font-mono font-bold">{playerScore} pts</span>
            </div>
            <div className="w-full h-5 bg-slate-950 rounded-full overflow-hidden border border-emerald-500/30 relative">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                style={{ width: `${Math.min(100, (playerScore / maxTrackScore) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 mt-2 text-center font-medium">
          La IA arrancó 5 puntos arriba porque juega sucio. Tú sumas <strong className="text-emerald-400">+2 pts</strong> si le atinas. Ella tiene 2 tiros (<strong className="text-indigo-400">+2 pts</strong> a la 1ª o <strong className="text-indigo-400">+1 pt</strong> a la 2ª). ¡Cázala o muérete de asco!
        </p>
      </div>

      {/* ÁREA DE PREGUNTA: IMAGEN SIN EL NOMBRE Y 4 OPCIONES */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* IMAGEN DEL POKÉMON (SIN EL NOMBRE) */}
        <div className="md:col-span-5 bg-[#121629] border-2 border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl relative min-h-[300px]">
          <span className="text-[10px] uppercase font-black text-amber-400/90 tracking-wider mb-2 bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-500/30">
            ¿De qué puto tipo es este bicho?
          </span>

          <div className="w-48 h-48 flex items-center justify-center my-2 relative bg-black/30 rounded-2xl p-2">
            <img 
              src={currentRound.pokemon.image} 
              alt="Pokemon Misterioso"
              onError={(e) => { e.target.src = currentRound.pokemon.thumbnail; }}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] animate-pulse"
            />
          </div>

          <div className="mt-2 text-center">
            {roundStatus === 'round_finished' || roundStatus === 'game_won' ? (
              <div className="animate-fadeIn">
                <h4 className="text-xl font-black text-white">{currentRound.pokemon.name}</h4>
                <div className="flex justify-center gap-1.5 mt-1.5">
                  <span 
                    className="text-[10px] font-black px-2.5 py-1 rounded-xl text-white flex items-center gap-1 shadow"
                    style={{ backgroundColor: TYPE_COLORS[currentRound.pokemon.type1]?.bg || '#666' }}
                  >
                    <TypeIcon type={currentRound.pokemon.type1} className="w-3 h-3 fill-current" />
                    {currentRound.pokemon.type1}
                  </span>
                  {currentRound.pokemon.type2 && (
                    <span 
                      className="text-[10px] font-black px-2.5 py-1 rounded-xl text-white flex items-center gap-1 shadow"
                      style={{ backgroundColor: TYPE_COLORS[currentRound.pokemon.type2]?.bg || '#666' }}
                    >
                      <TypeIcon type={currentRound.pokemon.type2} className="w-3 h-3 fill-current" />
                      {currentRound.pokemon.type2}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-xs font-black text-slate-300">
                ¡Mírale la jeta y elige abajo!
              </span>
            )}
          </div>
        </div>

        {/* 4 OPCIONES DE TIPO */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRound.options.map((typeOption, idx) => {
              const typeStyle = TYPE_COLORS[typeOption] || { bg: '#334155', text: '#fff' };
              const isSelected = userChoice === typeOption;
              const isCorrect = typeOption === currentRound.correctType;
              const isRevealed = roundStatus !== 'waiting_user';

              let buttonStyle = 'bg-[#151c33] border-slate-700 hover:border-purple-400 text-slate-200';
              if (isRevealed) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/40 scale-[1.02]';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-rose-600/80 border-rose-400 text-white opacity-80';
                } else {
                  buttonStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={typeOption}
                  disabled={roundStatus !== 'waiting_user'}
                  onClick={() => handleUserSelect(typeOption)}
                  className={`p-4 rounded-2xl border-2 font-black text-sm uppercase tracking-wider flex items-center justify-between transition-all duration-200 cursor-pointer ${buttonStyle}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-950/60 text-[11px] flex items-center justify-center font-mono font-bold text-amber-400 border border-slate-700">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center">
                        <TypeIcon type={typeOption} className="w-5 h-5" />
                      </span>
                      <span>{typeOption}</span>
                    </span>
                  </span>

                  <span 
                    className="w-4 h-4 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: typeStyle.bg }}
                  />
                </button>
              );
            })}
          </div>

          {/* ESTADO DEL TURNO DE LA IA Y FEEDBACK */}
          {roundStatus === 'ai_turn' && (
            <div className="p-4 rounded-2xl bg-[#141b2e] border border-purple-500/40 flex items-center gap-3 animate-pulse">
              <div className="animate-spin w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full" />
              <span className="text-xs text-purple-300 font-bold">
                La IA está procesando los píxeles con su red neuronal...
              </span>
            </div>
          )}

          {roundFeedback && (
            <div className="p-4 rounded-2xl bg-[#121629] border-2 border-slate-800 space-y-2 animate-fadeIn text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-200 font-black">
                  Tu Tiro: {roundFeedback.userIsCorrect ? '🎯 ¡Le diste! (+2 pts)' : '💩 ¡La cagaste! (+0 pts)'}
                </span>
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  Tipo real: 
                  <span className="text-white font-black px-2 py-0.5 rounded bg-slate-800 border border-slate-700 flex items-center gap-1">
                    <TypeIcon type={roundFeedback.correctType} className="w-3.5 h-3.5" />
                    {roundFeedback.correctType}
                  </span>
                </span>
              </div>

              <div className="text-slate-300 space-y-1 pt-1 font-medium">
                <div className="flex items-center justify-between">
                  <span>Intento 1 IA: <strong className="text-white">{aiAttempts.first}</strong></span>
                  <span>{aiAttempts.firstSuccess ? '✅ ¡Acertó a la 1ª! (+2 pts)' : '❌ Falló como un perro'}</span>
                </div>
                {!aiAttempts.firstSuccess && (
                  <div className="flex items-center justify-between">
                    <span>Intento 2 IA: <strong className="text-white">{aiAttempts.second}</strong></span>
                    <span>{aiAttempts.secondSuccess ? '✅ ¡Rescató a la 2ª! (+1 pt)' : '❌ ¡Volvió a fallar! (+0 pts)'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BOTÓN SIGUIENTE RONDA */}
          {roundStatus === 'round_finished' && (
            <button
              onClick={handleNextRound}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
            >
              ¡Siguiente Bicho, Dale! →
            </button>
          )}

        </div>

      </div>

      {/* MODAL VICTORIA CUANDO EL USUARIO ALCANZA A LA IA */}
      {roundStatus === 'game_won' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#121629] border-2 border-emerald-400 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <span className="text-6xl block mb-2">🏆</span>
            <h3 className="text-3xl font-black text-emerald-400 uppercase tracking-tight">
              ¡Le callaste el hocico a la IA!
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-semibold">
              ¡Te merendaste los 5 puntos de ventaja que se había clavado la máquina tramposa! Has ganado el duelo limpio.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tus Puntos</span>
                <span className="text-3xl font-black text-emerald-400">{playerScore}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntos IA</span>
                <span className="text-3xl font-black text-rose-400">{aiScore}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rounds</span>
                <span className="text-3xl font-black text-amber-400">{roundNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startNewGame}
                className="w-full py-4 rounded-xl font-black text-sm uppercase text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                🎮 Otra paliza a la IA
              </button>
              <button
                onClick={onBackToHub}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver al Antro con tu corona
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

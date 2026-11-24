import React, { useState, useEffect, useCallback } from 'react';
import { generateTypeBettingRound, TYPE_COLORS, TYPE_ES } from '../services/pokemonService';
import { aiPredictTypeBetting } from '../services/mlModelsService';
import { TypeIcon } from './TypeIcons';
import { sfx } from '../services/soundService';
import confetti from 'canvas-confetti';

export default function TypeBetting({ onBackToHub }) {
  // Regla exacta: 15 fichas iniciales, 10 rondas máx, 5 fichas por ronda
  const [chips, setChips] = useState(15);
  const [round, setRound] = useState(1);
  const maxRounds = 10;

  const [report, setReport] = useState({
    totalWon: 0,
    totalLost: 0,
    roundsHistory: [],
  });

  const [currentRoundData, setCurrentRoundData] = useState(null);
  const [userBets, setUserBets] = useState([0, 0, 0]);
  const [aiBets, setAiBets] = useState([0, 0, 0]);
  const [roundStatus, setRoundStatus] = useState('betting'); // 'betting' | 'revealed' | 'gameover'
  const [roundResult, setRoundResult] = useState(null);

  const loadRound = useCallback(() => {
    const roundData = generateTypeBettingRound();
    setCurrentRoundData(roundData);
    setUserBets([0, 0, 0]);
    setAiBets([0, 0, 0]);
    setRoundResult(null);
    setRoundStatus('betting');
  }, []);

  const startNewGame = useCallback(() => {
    sfx.click();
    setChips(15);
    setRound(1);
    setReport({ totalWon: 0, totalLost: 0, roundsHistory: [] });
    loadRound();
  }, [loadRound]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const totalBet = userBets.reduce((a, b) => a + b, 0);
  const remainingToPlace = 5 - totalBet;

  const handleAddBet = (index, amount) => {
    if (roundStatus !== 'betting') return;
    const newBet = userBets[index] + amount;
    if (newBet < 0) return;
    if (amount > 0 && remainingToPlace < amount) return;
    sfx.chip();
    const nextBets = [...userBets];
    nextBets[index] = newBet;
    setUserBets(nextBets);
  };

  const handlePlaceAllOn = (index) => {
    if (roundStatus !== 'betting') return;
    sfx.chip();
    const nextBets = [0, 0, 0];
    nextBets[index] = 5;
    setUserBets(nextBets);
  };

  const handleConfirmBets = async () => {
    if (totalBet !== 5 || !currentRoundData) return;

    const aiPrediction = await aiPredictTypeBetting(currentRoundData.options, currentRoundData.targetType);
    const nextAiBets = [0, 0, 0];
    nextAiBets[aiPrediction.firstChoiceIndex] = 3;
    nextAiBets[aiPrediction.secondChoiceIndex] = 2;
    setAiBets(nextAiBets);

    const correctIdx = currentRoundData.correctIndex;
    const userPlacedCorrect = userBets[correctIdx];
    const aiPlacedCorrect = nextAiBets[correctIdx];

    let userWonThisRound = 0;
    if (userPlacedCorrect > 0) {
      if (aiPlacedCorrect === 0) userWonThisRound = userPlacedCorrect * 3;
      else if (aiPlacedCorrect === 2) userWonThisRound = userPlacedCorrect * 2;
      else if (aiPlacedCorrect === 3) userWonThisRound = Math.ceil(userPlacedCorrect * 1.5);
    }

    if (userWonThisRound > 0) sfx.win();
    else sfx.lose();

    const chipsLostThisRound = 5 - userPlacedCorrect;
    const newChips = chips - 5 + userWonThisRound;
    setChips(newChips);

    const roundSummary = {
      roundNumber: round,
      targetType: currentRoundData.targetType,
      correctPokemon: currentRoundData.options[correctIdx].name,
      userPlacedCorrect,
      aiPlacedCorrect,
      userWonThisRound,
      chipsLostThisRound,
      endingChips: newChips,
    };

    setReport((prev) => ({
      totalWon: prev.totalWon + userWonThisRound,
      totalLost: prev.totalLost + chipsLostThisRound,
      roundsHistory: [...prev.roundsHistory, roundSummary],
    }));

    setRoundResult({
      userWonThisRound,
      chipsLostThisRound,
      correctIdx,
      aiPlacedCorrect,
      userPlacedCorrect,
      multiplierText:
        aiPlacedCorrect === 0
          ? 'x3 (¡Triplicado en su cara!)'
          : aiPlacedCorrect === 2
          ? 'x2 (Duplicado limpio)'
          : 'x1.5 (Redondeo arriba)',
    });

    if (round >= maxRounds || newChips < 5) {
      setRoundStatus('gameover');
      if (newChips >= 15) {
        sfx.fanfare();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setRoundStatus('revealed');
    }
  };

  const handleNextRound = () => {
    sfx.click();
    setRound((prev) => prev + 1);
    loadRound();
  };

  if (!currentRoundData) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="arcade-panel rounded-2xl px-6 py-4 font-mono font-extrabold text-sm">
          Repartiendo fichas del casino...
        </div>
      </div>
    );
  }

  const targetStyle = TYPE_COLORS[currentRoundData.targetType] || TYPE_COLORS.Dark;

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

        <span className="arcade-stamp bg-[#111827] text-[#FFD43B] px-3 py-1 rounded-xl font-mono text-xs font-extrabold uppercase">
          MODO 03 • EL TIPO SÍ IMPORTA, NO JODAS
        </span>

        <div className="flex items-center gap-2 font-mono text-xs font-extrabold">
          <div className="bg-white border-2 border-[#111827] px-3 py-1.5 rounded-xl">
            RONDA {round}/{maxRounds}
          </div>
          <div className="bg-[#FFD43B] border-2 border-[#111827] px-3.5 py-1.5 rounded-xl text-[#111827]">
            FICHAS: <span className="text-sm">{chips}</span>
          </div>
        </div>
      </div>

      {/* CARTEL DE SE BUSCA (TIPO OBJETIVO + TABLA DE MULTIPLICADORES) */}
      <div
        className="rounded-3xl border-[3px] border-[#111827] shadow-ink-lg p-5 text-white relative overflow-hidden"
        style={{ background: targetStyle.bgGradientCss }}
      >
        <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
          <TypeIcon type={currentRoundData.targetType} size={170} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFFDF7] border-[3px] border-[#111827] shadow-ink flex items-center justify-center shrink-0">
              <TypeIcon type={currentRoundData.targetType} size={42} />
            </div>
            <div>
              <span className="font-mono text-[10px] font-extrabold uppercase bg-[#111827] text-[#FFD43B] px-2 py-0.5 rounded">
                TIPO BUSCADO ESTA RONDA
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl uppercase drop-shadow-sm mt-0.5">
                TIPO {TYPE_ES[currentRoundData.targetType] || currentRoundData.targetType}
              </h2>
              <p className="text-xs font-semibold text-white/95 max-w-md mt-0.5">
                Solo 1 de los 3 Pokémon tiene este tipo. Reparte tus 5 fichas. El rival siempre coloca 3 en su primera opción y 2 en la segunda.
              </p>
            </div>
          </div>

          {/* CHEAT SHEET DE MULTIPLICADORES */}
          <div className="bg-[#FFFDF7] text-[#111827] border-[2.5px] border-[#111827] rounded-2xl p-3 shadow-ink-sm font-mono text-[11px] font-extrabold space-y-1 shrink-0 w-full md:w-auto">
            <div className="text-[10px] text-[#D9383A] uppercase border-b border-slate-300 pb-1 mb-1">
              PAGOS SI ACIERTAS
            </div>
            <div className="flex justify-between gap-4">
              <span>IA puso 0 fichas:</span>
              <span className="text-[#15803D]">x3 (TRIPLE)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>IA puso 2 fichas:</span>
              <span className="text-[#2563EB]">x2 (DOBLE)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>IA puso 3 fichas:</span>
              <span className="text-[#D97706]">x1.5 (REDONDEO ↑)</span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE CONTROL DE APUESTA */}
      {roundStatus === 'betting' && (
        <div className="arcade-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((slot) => (
                <span
                  key={slot}
                  className={`w-6 h-6 rounded-full border-2 border-[#111827] inline-block transition-all ${
                    slot < remainingToPlace ? 'bg-[#FFD43B] shadow-ink-sm' : 'bg-slate-200 opacity-40'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-extrabold text-[#111827]">
              POR COLOCAR: <strong className="text-[#D9383A] text-sm">{remainingToPlace} / 5</strong>
            </span>
          </div>

          <button
            disabled={totalBet !== 5}
            onClick={handleConfirmBets}
            className={`arcade-btn px-5 py-2.5 rounded-xl font-display font-extrabold text-xs sm:text-sm uppercase cursor-pointer ${
              totalBet === 5 ? 'bg-[#16A34A] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {totalBet === 5 ? '¡Apostar 5 Fichas y Revelar!' : `Te faltan ${remainingToPlace} fichas`}
          </button>
        </div>
      )}

      {/* LAS 3 CARTAS CANDIDATAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentRoundData.options.map((pokemon, idx) => {
          const isCorrect = pokemon.isCorrect;
          const userBet = userBets[idx];
          const aiBet = aiBets[idx];
          const isRevealed = roundStatus !== 'betting';
          const pokeTheme = TYPE_COLORS[pokemon.type1] || TYPE_COLORS.Normal;

          return (
            <div
              key={pokemon.id}
              className={`rounded-3xl border-[3px] border-[#111827] shadow-ink-lg p-4 flex flex-col justify-between relative overflow-hidden transition-all ${
                isRevealed
                  ? isCorrect
                    ? 'ring-4 ring-[#4ADE80]'
                    : 'opacity-75'
                  : 'bg-[#FFFDF7]'
              }`}
              style={{
                background: isRevealed && isCorrect ? pokeTheme.bgGradientCss : '#FFFDF7',
              }}
            >
              {/* Insignia de estado */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] font-extrabold bg-[#111827] text-white px-2 py-0.5 rounded">
                  OPCIÓN #{idx + 1}
                </span>
                {isRevealed && (
                  <span
                    className={`arcade-stamp font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase ${
                      isCorrect ? 'bg-[#4ADE80] text-[#111827]' : 'bg-[#FFE3E3] text-[#991B1B]'
                    }`}
                  >
                    {isCorrect ? '¡TIPO CORRECTO!' : 'TIPO INCORRECTO'}
                  </span>
                )}
              </div>

              {/* Imagen y nombre */}
              <div className="bg-white border-2 border-[#111827] rounded-2xl p-3 flex flex-col items-center shadow-ink-sm">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    onError={(e) => { e.target.src = pokemon.thumbnail; }}
                    className="max-w-full max-h-full object-contain drop-shadow"
                  />
                </div>
                <h4 className="font-display font-extrabold text-lg text-[#111827] text-center mt-1.5">
                  {pokemon.name}
                </h4>

                {isRevealed && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                    <span className="arcade-stamp bg-[#FFFDF7] text-[#111827] text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <TypeIcon type={pokemon.type1} size={12} />
                      {TYPE_ES[pokemon.type1] || pokemon.type1}
                    </span>
                    {pokemon.type2 && (
                      <span className="arcade-stamp bg-[#FFFDF7] text-[#111827] text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <TypeIcon type={pokemon.type2} size={12} />
                        {TYPE_ES[pokemon.type2] || pokemon.type2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Pila de fichas y botones */}
              <div className="mt-3 space-y-2.5">
                {isRevealed && (
                  <div className="bg-[#111827] text-white rounded-xl px-3 py-2 flex items-center justify-between font-mono text-xs font-extrabold">
                    <span className="text-slate-300">APUESTA IA:</span>
                    <span className="text-[#FFD43B]">{aiBet} FICHAS</span>
                  </div>
                )}

                <div className="bg-[#FFF9DB] border-2 border-[#111827] rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#111827]">TUS FICHAS:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: userBet }).map((_, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full bg-[#FFD43B] border-[1.5px] border-[#111827] inline-block"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-base font-extrabold text-[#D9383A] ml-1">
                      {userBet}
                    </span>
                  </div>
                </div>

                {roundStatus === 'betting' && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleAddBet(idx, -1)}
                      disabled={userBet <= 0}
                      className="arcade-btn bg-white hover:bg-slate-100 text-[#111827] py-2 rounded-xl font-mono font-extrabold text-xs cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleAddBet(idx, 1)}
                      disabled={remainingToPlace <= 0}
                      className="arcade-btn bg-[#16A34A] hover:bg-[#15803D] text-white py-2 rounded-xl font-mono font-extrabold text-xs cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePlaceAllOn(idx)}
                      className="arcade-btn bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] py-2 rounded-xl font-mono font-extrabold text-[11px] uppercase cursor-pointer"
                    >
                      ALL 5
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RESULTADO DE LA RONDA */}
      {roundResult && roundStatus === 'revealed' && (
        <div className="arcade-panel rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 animate-popIn">
          <div>
            <h4 className="font-display font-extrabold text-lg text-[#111827]">
              {roundResult.userWonThisRound > 0
                ? `¡Ganaste +${roundResult.userWonThisRound} fichas en esta ronda!`
                : 'No colocaste fichas en el Pokémon correcto.'}
            </h4>
            <p className="font-mono text-xs font-bold text-slate-700 mt-0.5">
              Multiplicador: <span className="text-[#D9383A]">{roundResult.multiplierText}</span> • La IA puso {roundResult.aiPlacedCorrect} fichas en la correcta.
            </p>
          </div>

          <button
            onClick={handleNextRound}
            className="arcade-btn bg-[#111827] hover:bg-[#1E3A5F] text-[#FFD43B] px-5 py-3 rounded-xl font-display font-extrabold text-sm uppercase cursor-pointer"
          >
            Siguiente Ronda ({round + 1}/{maxRounds}) →
          </button>
        </div>
      )}

      {/* REPORTE FINAL (TICKET DEL CASINO CLANDESTINO) */}
      {roundStatus === 'gameover' && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="arcade-panel rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center max-h-[90vh] overflow-y-auto animate-popIn">
            <span className="arcade-stamp inline-block bg-[#FFD43B] text-[#111827] font-mono text-xs font-extrabold uppercase px-3 py-1 rounded-lg -rotate-1 mb-2">
              TICKET DEL CASINO CLANDESTINO
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111827] uppercase">
              {chips >= 15 ? '¡Saliste Forrado de Fichas!' : '¡Te Dejaron Pelado!'}
            </h3>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              {chips >= 5
                ? 'Sobreviviste las 10 rondas completas contra la banca infinita de la IA.'
                : 'Te quedaste con menos de 5 fichas para seguir apostando.'}
            </p>

            <div className="grid grid-cols-3 gap-2 my-5">
              <div className="bg-[#EBFBEE] border-2 border-[#111827] rounded-xl p-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">Ganadas</span>
                <span className="font-display font-extrabold text-2xl text-[#15803D]">+{report.totalWon}</span>
              </div>
              <div className="bg-[#FFE3E3] border-2 border-[#111827] rounded-xl p-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">Perdidas</span>
                <span className="font-display font-extrabold text-2xl text-[#D9383A]">-{report.totalLost}</span>
              </div>
              <div className="bg-[#FFF9DB] border-2 border-[#111827] rounded-xl p-3">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-600 block">Saldo Final</span>
                <span className="font-display font-extrabold text-2xl text-[#111827]">{chips}</span>
              </div>
            </div>

            <div className="text-left mb-5 max-h-44 overflow-y-auto space-y-1.5 pr-1">
              <span className="font-mono text-[10px] font-extrabold uppercase text-slate-600 block">
                Desglose ronda por ronda:
              </span>
              {report.roundsHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F4EFE2] border border-[#111827]/40 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-mono"
                >
                  <div className="truncate pr-2">
                    <strong>R{item.roundNumber}</strong> ({TYPE_ES[item.targetType] || item.targetType}) — {item.correctPokemon}
                  </div>
                  <span className={item.userWonThisRound > 0 ? 'text-[#15803D] font-extrabold' : 'text-slate-500 font-bold'}>
                    {item.userWonThisRound > 0 ? `+${item.userWonThisRound}` : '0'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={startNewGame}
                className="arcade-btn w-full py-3.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] font-display font-extrabold text-sm uppercase cursor-pointer"
              >
                Echar Otra Partida (15 Fichas)
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

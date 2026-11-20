import React, { useState, useEffect } from 'react';
import { generateTypeBettingRound, TYPE_COLORS } from '../services/pokemonService';
import { aiPredictTypeBetting } from '../services/mlModelsService';
import confetti from 'canvas-confetti';

export default function TypeBetting({ onBackToHub }) {
  // Saldo de fichas: inicia con 15
  const [chips, setChips] = useState(15);
  const [round, setRound] = useState(1);
  const maxRounds = 10;

  // Reporte acumulado de fichas ganadas y perdidas
  const [report, setReport] = useState({
    totalWon: 0,
    totalLost: 0,
    roundsHistory: []
  });

  // Estado de la ronda
  const [currentRoundData, setCurrentRoundData] = useState(null);
  const [userBets, setUserBets] = useState([0, 0, 0]); // 5 fichas a repartir entre las 3 opciones
  const [aiBets, setAiBets] = useState([0, 0, 0]);     // 3 en primera opción, 2 en segunda opción
  const [roundStatus, setRoundStatus] = useState('betting'); // 'betting' | 'revealed' | 'gameover'
  const [roundResult, setRoundResult] = useState(null);

  // Iniciar partida
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setChips(15);
    setRound(1);
    setReport({ totalWon: 0, totalLost: 0, roundsHistory: [] });
    loadRound();
  };

  const loadRound = () => {
    const roundData = generateTypeBettingRound();
    setCurrentRoundData(roundData);
    setUserBets([0, 0, 0]);
    setAiBets([0, 0, 0]);
    setRoundResult(null);
    setRoundStatus('betting');
  };

  // Ajustar apuesta en una de las 3 opciones (índice 0, 1, 2)
  const totalBet = userBets.reduce((a, b) => a + b, 0);
  const remainingToPlace = 5 - totalBet;

  const handleAddBet = (index, amount) => {
    if (roundStatus !== 'betting') return;
    const current = userBets[index];
    const newBet = current + amount;

    if (newBet < 0) return;
    if (amount > 0 && remainingToPlace < amount) return;

    const nextBets = [...userBets];
    nextBets[index] = newBet;
    setUserBets(nextBets);
  };

  const handlePlaceAllOn = (index) => {
    if (roundStatus !== 'betting') return;
    const nextBets = [0, 0, 0];
    nextBets[index] = 5;
    setUserBets(nextBets);
  };

  // Confirmar y resolver la ronda
  const handleConfirmBets = async () => {
    if (totalBet !== 5 || !currentRoundData) return;

    // Calcular apuestas de la IA
    const aiPrediction = await aiPredictTypeBetting(currentRoundData.options, currentRoundData.targetType);
    const nextAiBets = [0, 0, 0];
    nextAiBets[aiPrediction.firstChoiceIndex] = 3;  // 3 fichas en 1ra opción
    nextAiBets[aiPrediction.secondChoiceIndex] = 2; // 2 fichas en 2da opción
    setAiBets(nextAiBets);

    // Resolver pagos
    const correctIdx = currentRoundData.correctIndex;
    const userPlacedCorrect = userBets[correctIdx];
    const aiPlacedCorrect = nextAiBets[correctIdx];

    let userWonThisRound = 0;

    if (userPlacedCorrect > 0) {
      if (aiPlacedCorrect === 0) {
        // "Si el usuario acierta y la IA no coloca ninguna ficha, se le triplica lo colocado"
        userWonThisRound = userPlacedCorrect * 3;
      } else if (aiPlacedCorrect === 2) {
        // "si la IA coloca 2 fichas se le duplica lo colocado"
        userWonThisRound = userPlacedCorrect * 2;
      } else if (aiPlacedCorrect === 3) {
        // "y si la IA coloco 3 fichas se le da el rendondeo para arriba de la multiplicacion x1.5"
        userWonThisRound = Math.ceil(userPlacedCorrect * 1.5);
      }
    }

    // Fichas perdidas: las 5 apostadas menos las que devolvieron ganancia (o net lost)
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
      endingChips: newChips
    };

    setReport(prev => ({
      totalWon: prev.totalWon + userWonThisRound,
      totalLost: prev.totalLost + chipsLostThisRound,
      roundsHistory: [...prev.roundsHistory, roundSummary]
    }));

    setRoundResult({
      userWonThisRound,
      chipsLostThisRound,
      correctIdx,
      aiPlacedCorrect,
      userPlacedCorrect,
      multiplierText: aiPlacedCorrect === 0 ? 'x3 (Triplicado)' : aiPlacedCorrect === 2 ? 'x2 (Duplicado)' : 'x1.5 (Redondeo ↑)'
    });

    // Verificar condición de fin:
    // "El juego acaba al finalizar 10 rondas, o que el usuario acabe sin fichas."
    if (round >= maxRounds || newChips < 5) {
      setRoundStatus('gameover');
      if (newChips >= 15) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setRoundStatus('revealed');
    }
  };

  const handleNextRound = () => {
    setRound(prev => prev + 1);
    loadRound();
  };

  if (!currentRoundData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const targetStyle = TYPE_COLORS[currentRoundData.targetType] || { bg: '#4F46E5', text: '#fff' };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 py-4 px-4 animate-fadeIn">
      
      {/* BARRA SUPERIOR CON FICHAS Y RONDAS */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#14192d] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          ← Volver al Núcleo
        </button>

        <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
          Actividad 3 • El tipo sí importa
        </span>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            Ronda: <span className="text-white font-black">{round}</span> / {maxRounds}
          </div>
          <div className="bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-amber-300 flex items-center gap-1.5">
            <span>🪙</span> Tus Fichas: <span className="text-white font-black text-sm">{chips}</span>
          </div>
        </div>
      </div>

      {/* ENUNCIADO DE LA MISIÓN CON EL TIPO OBJETIVO */}
      <div className="text-center my-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Tipo Objetivo de la Ronda
        </span>
        <div className="inline-flex items-center gap-2 mt-1">
          <span 
            className="text-2xl md:text-3xl font-black px-6 py-1.5 rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: targetStyle.bg }}
          >
            Tipo {currentRoundData.targetType}
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-2 max-w-xl mx-auto">
          Uno de los 3 Pokémon posee este tipo en su combinación elemental. Distribuye tus <strong>5 fichas</strong> por ronda para competir contra la IA.
        </p>
      </div>

      {/* PANEL DE APUESTA DE FICHAS RESTANTES */}
      {roundStatus === 'betting' && (
        <div className="w-full bg-[#121829] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🪙</span>
            <span className="text-slate-300 font-bold">
              Fichas por colocar en esta ronda: <strong className={`text-sm font-black ${remainingToPlace === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>{remainingToPlace} / 5</strong>
            </span>
          </div>

          <button
            disabled={totalBet !== 5}
            onClick={handleConfirmBets}
            className={`py-2 px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              totalBet === 5
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {totalBet === 5 ? 'Confirmar Apuesta de 5 Fichas →' : `Coloca ${remainingToPlace} fichas más`}
          </button>
        </div>
      )}

      {/* LAS 3 OPCIONES DE POKÉMON */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentRoundData.options.map((pokemon, idx) => {
          const isCorrect = pokemon.isCorrect;
          const userBet = userBets[idx];
          const aiBet = aiBets[idx];
          const isRevealed = roundStatus !== 'betting';

          let borderStyle = 'border-slate-800';
          if (isRevealed) {
            borderStyle = isCorrect ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-900/50 opacity-70';
          }

          return (
            <div
              key={pokemon.id}
              className={`bg-[#141b2e] border-2 ${borderStyle} rounded-3xl p-5 flex flex-col justify-between shadow-xl relative transition-all`}
            >
              {/* Insignia de acierto en revelación */}
              {isRevealed && (
                <div className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md ${
                  isCorrect ? 'bg-emerald-600' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCorrect ? `✅ Es Tipo ${currentRoundData.targetType}` : '❌ No tiene ese tipo'}
                </div>
              )}

              {/* Imagen y Nombre */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-1">
                  Opción {idx + 1} • #{pokemon.id.toString().padStart(3, '0')}
                </span>
                <div className="w-36 h-36 flex items-center justify-center my-2">
                  <img 
                    src={pokemon.image} 
                    alt={pokemon.name}
                    onError={(e) => { e.target.src = pokemon.thumbnail; }}
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <h4 className="text-base font-black text-white text-center mt-1">{pokemon.name}</h4>

                {/* Tipos del Pokémon (revelados al final de ronda) */}
                {isRevealed && (
                  <div className="flex gap-1 mt-1.5">
                    <span 
                      className="text-[9px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: TYPE_COLORS[pokemon.type1]?.bg || '#666' }}
                    >
                      {pokemon.type1}
                    </span>
                    {pokemon.type2 && (
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: TYPE_COLORS[pokemon.type2]?.bg || '#666' }}
                      >
                        {pokemon.type2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* CONTROLES DE FICHAS DE USUARIO Y FICHAS DE IA */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                {/* Fichas IA */}
                {isRevealed && (
                  <div className="bg-indigo-950/40 border border-indigo-500/20 p-2 rounded-xl flex items-center justify-between text-xs text-indigo-300">
                    <span>🤖 Fichas IA:</span>
                    <span className="font-black text-white bg-indigo-900/80 px-2 py-0.5 rounded">
                      {aiBet} fichas
                    </span>
                  </div>
                )}

                {/* Fichas Usuario */}
                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">Tus Fichas:</span>
                  <span className="text-base font-black text-amber-400">
                    🪙 {userBet}
                  </span>
                </div>

                {/* Botones de apuesta mientras se juega */}
                {roundStatus === 'betting' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddBet(idx, -1)}
                      disabled={userBet <= 0}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleAddBet(idx, 1)}
                      disabled={remainingToPlace <= 0}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePlaceAllOn(idx)}
                      className="py-1.5 px-2 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white font-black text-[10px] uppercase cursor-pointer"
                    >
                      All 5
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* FEEDBACK Y RESULTADO DE LA RONDA */}
      {roundResult && roundStatus === 'revealed' && (
        <div className="w-full bg-[#121829] border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div>
            <h4 className="text-sm font-black text-white">
              {roundResult.userWonThisRound > 0
                ? `🎉 ¡Ganaste +${roundResult.userWonThisRound} fichas!`
                : '❌ No acertaste fichas en la opción correcta'}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Multiplicador aplicado: <strong className="text-amber-400">{roundResult.multiplierText}</strong> (La IA puso {roundResult.aiPlacedCorrect} fichas en la correcta).
            </p>
          </div>

          <button
            onClick={handleNextRound}
            className="py-3 px-6 rounded-xl font-black text-xs uppercase text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            Siguiente Ronda ({round + 1}/{maxRounds}) →
          </button>
        </div>
      )}

      {/* REPORTE FINAL: 10 RONDAS O SIN FICHAS */}
      {roundStatus === 'gameover' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#141b2e] border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl overflow-y-auto max-h-[90vh]">
            <span className="text-5xl block mb-2">📊</span>
            <h3 className="text-2xl font-black text-amber-400 uppercase tracking-tight">
              Reporte Final de Fichas
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {chips >= 5 ? '¡Has completado las 10 rondas de juego!' : 'Te has quedado sin fichas suficientes para apostar.'}
            </p>

            {/* BALANCE TOTAL */}
            <div className="grid grid-cols-3 gap-2 my-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fichas Ganadas</span>
                <span className="text-xl font-black text-emerald-400">+{report.totalWon}</span>
              </div>
              <div className="border-x border-slate-800 px-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fichas Perdidas</span>
                <span className="text-xl font-black text-rose-400">-{report.totalLost}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Saldo Final</span>
                <span className={`text-xl font-black ${chips >= 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {chips}
                </span>
              </div>
            </div>

            {/* TABLA HISTÓRICA RESUMEN */}
            <div className="text-left mb-6 max-h-48 overflow-y-auto pr-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block">
                Historial Ronda por Ronda:
              </span>
              <div className="space-y-1.5">
                {report.roundsHistory.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">Ronda #{item.roundNumber} ({item.targetType}):</span>
                      <span className="text-slate-400 ml-1.5 text-[11px]">{item.correctPokemon}</span>
                    </div>
                    <div className="text-right">
                      <span className={item.userWonThisRound > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold'}>
                        {item.userWonThisRound > 0 ? `+${item.userWonThisRound}` : '0'} 🪙
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-xl font-black text-sm uppercase text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                Jugar Otra Partida
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

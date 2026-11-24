import React, { useState } from 'react';
import Header from './components/Header';
import CoreHub from './components/CoreHub';
import StatBattle from './components/StatBattle';
import TypeDuel from './components/TypeDuel';
import TypeBetting from './components/TypeBetting';
import TypeAnalysis from './components/TypeAnalysis';
import CreatePokemon from './components/CreatePokemon';
import LegalDisclaimerModal from './components/LegalDisclaimerModal';
import { TypeIcon } from './components/TypeIcons';
import { TYPE_COLORS, TYPE_ES } from './services/pokemonService';
import logoEmblem from './assets/logo-emblem.png';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [selectedBgType, setSelectedBgType] = useState(() => {
    return localStorage.getItem('pokemind_aura_type') || 'Fire';
  });

  const handleSelectBgType = (type) => {
    setSelectedBgType(type);
    localStorage.setItem('pokemind_aura_type', type);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeWorld = TYPE_COLORS[selectedBgType] || TYPE_COLORS.Fire;

  return (
    <div
      className="min-h-screen text-[#111827] flex flex-col justify-between relative transition-all duration-700 selection:bg-[#FFD43B] selection:text-[#111827]"
      style={{ background: activeWorld.worldGradient }}
    >
      {/* TEXTURA HALFTONE + FILIGRANA ELEMENTAL EN EL FONDO */}
      <div className="fixed inset-0 bg-halftone pointer-events-none z-0 opacity-75" />
      <div className="fixed inset-0 bg-arcade-stripes pointer-events-none z-0 opacity-60" />

      {/* MARCA DE AGUA GIGANTE DEL TIPO ACTIVO */}
      <div className="fixed -bottom-14 -right-14 pointer-events-none z-0 opacity-[0.14] select-none hidden sm:block transition-all duration-700">
        <TypeIcon type={selectedBgType} size={340} />
      </div>

      {/* HEADER CONSOLA ARCADE */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        selectedBgType={selectedBgType}
        onSelectBgType={handleSelectBgType}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-3 sm:px-5 md:px-8 py-5 md:py-7 w-full">
        {currentScreen === 'home' && (
          <CoreHub
            onNavigate={handleNavigate}
            onOpenLegal={() => setIsLegalModalOpen(true)}
            selectedBgType={selectedBgType}
            onSelectBgType={handleSelectBgType}
          />
        )}

        {currentScreen === 'stat-battle' && (
          <StatBattle onBackToHub={() => handleNavigate('home')} />
        )}

        {currentScreen === 'type-duel' && (
          <TypeDuel onBackToHub={() => handleNavigate('home')} />
        )}

        {currentScreen === 'type-betting' && (
          <TypeBetting onBackToHub={() => handleNavigate('home')} />
        )}

        {currentScreen === 'type-analysis' && (
          <TypeAnalysis onBackToHub={() => handleNavigate('home')} />
        )}

        {currentScreen === 'create-pokemon' && (
          <CreatePokemon onBackToHub={() => handleNavigate('home')} />
        )}
      </main>

      {/* FOOTER CON AVISO LEGAL Y MARCA */}
      <footer className="relative z-10 bg-[#141B29] text-[#F9FAFB] border-t-[3px] border-[#111827] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFDF7] border-2 border-[#111827] p-1 flex items-center justify-center shadow-ink-sm shrink-0">
                <img src={logoEmblem} alt="Logo PokeMind Games CR" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-extrabold text-base tracking-tight text-white">
                    POKEMIND GAMES CR
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#D9383A] text-white border border-black/40">
                    AURA: {TYPE_ES[selectedBgType] || selectedBgType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Consola Arcade Indie contra Modelos de Machine Learning • 100% Gratuita
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLegalModalOpen(true)}
              className="arcade-btn bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center gap-2 cursor-pointer"
            >
              <span>Aviso Legal y Derechos de Marca</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-[#FFD43B]">Deslinde de Responsabilidad:</strong> Pokémon y todos los nombres, diseños y personajes asociados son marcas registradas y propiedad intelectual exclusiva de{' '}
            <strong className="text-white">Nintendo Co., Ltd.</strong>,{' '}
            <strong className="text-white">Creatures Inc.</strong> y{' '}
            <strong className="text-white">GAME FREAK inc.</strong>{' '}
            PokeMind Games CR es un proyecto independiente, estrictamente académico, gratuito y sin fines de lucro. El autor no es dueño de la marca Pokémon ni cobra un solo colón o dólar por su uso.
          </p>
        </div>
      </footer>

      {/* MODAL LEGAL */}
      <LegalDisclaimerModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}

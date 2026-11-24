import React, { useState } from 'react';
import Header from './components/Header';
import CoreHub from './components/CoreHub';
import StatBattle from './components/StatBattle';
import TypeDuel from './components/TypeDuel';
import TypeBetting from './components/TypeBetting';
import TypeAnalysis from './components/TypeAnalysis';
import CreatePokemon from './components/CreatePokemon';
import LegalDisclaimerModal from './components/LegalDisclaimerModal';

export default function App() {
  // Estado de la pantalla activa:
  // 'home' | 'stat-battle' | 'type-duel' | 'type-betting' | 'type-analysis' | 'create-pokemon'
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER NAVEGACIÓN */}
      <Header 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        onOpenLegal={() => setIsLegalModalOpen(true)}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 w-full">
        {currentScreen === 'home' && (
          <CoreHub 
            onNavigate={handleNavigate} 
            onOpenLegal={() => setIsLegalModalOpen(true)}
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

      {/* FOOTER CON AVISO LEGAL Y DESLINDE DE RESPONSABILIDAD */}
      <footer className="bg-[#0b101e] border-t border-slate-900 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-900/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-200">PokeMind Games CR</span>
              <span>•</span>
              <span>Plataforma de Trivia & Machine Learning</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>⚖️</span> Aviso Legal & Deslinde de Marca
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
            <p>
              <strong>Deslinde de Responsabilidad de Marca:</strong> Pokémon y los nombres de los personajes son marcas registradas y propiedad intelectual de <strong>Nintendo</strong>, <strong>Creatures Inc.</strong> y <strong>GAME FREAK inc.</strong> Este proyecto web (PokeMind Games CR) es una iniciativa <strong>estrictamente académica, de código abierto, gratuita y sin fines de lucro</strong>. El autor no es dueño ni posee derechos sobre la marca Pokémon ni sus elementos multimedia; todo el contenido visual, estadístico y de nombres pertenece a sus respectivos dueños. No se cobra por el uso de este software en ninguna de sus formas.
            </p>
          </div>

        </div>
      </footer>

      {/* MODAL DE AVISO LEGAL */}
      <LegalDisclaimerModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
      />

    </div>
  );
}

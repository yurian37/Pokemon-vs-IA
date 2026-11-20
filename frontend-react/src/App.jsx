import React, { useState } from 'react';
import Header from './components/Header';
import CoreHub from './components/CoreHub';
import StatBattle from './components/StatBattle';
import TypeDuel from './components/TypeDuel';
import TypeBetting from './components/TypeBetting';
import TypeAnalysis from './components/TypeAnalysis';
import CreatePokemon from './components/CreatePokemon';

export default function App() {
  // Estado de la pantalla activa:
  // 'home' | 'stat-battle' | 'type-duel' | 'type-betting' | 'type-analysis' | 'create-pokemon'
  const [currentScreen, setCurrentScreen] = useState('home');

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
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 w-full">
        {currentScreen === 'home' && (
          <CoreHub onNavigate={handleNavigate} />
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

      {/* FOOTER */}
      <footer className="bg-[#0b101e] border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Pokémon vs IA</span>
            <span>•</span>
            <span>Plataforma de Trivia y Machine Learning</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Modelos: Keras & KNN Logístico (k=5)</span>
            <span>•</span>
            <span>Imágenes: PokéAPI Oficial</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React from 'react';
import logoEmblem from '../assets/logo-emblem.png';

export default function LegalDisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="arcade-panel rounded-3xl p-6 md:p-8 max-w-2xl w-full relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* CABECERA */}
        <div className="flex items-start justify-between gap-4 border-b-[2.5px] border-[#111827] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFDF7] border-2 border-[#111827] shadow-ink-sm p-1.5 shrink-0">
              <img src={logoEmblem} alt="PokeMind Games CR" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 id="legal-modal-title" className="font-display font-extrabold text-xl md:text-2xl text-[#111827]">
                Aviso Legal y Deslinde de Marca
              </h3>
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#D9383A]">
                PokeMind Games CR • Proyecto Educativo 100% Gratuito
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="arcade-btn w-9 h-9 rounded-xl bg-[#D9383A] text-white font-mono font-extrabold text-sm flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Cerrar aviso legal"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="space-y-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed overflow-y-auto pr-1">
          <div className="bg-[#FFF9DB] border-2 border-[#111827] p-4 rounded-2xl shadow-ink-sm">
            <h4 className="font-display font-extrabold text-sm text-[#111827] mb-1 uppercase">
              1. Titularidad de la Marca Pokémon
            </h4>
            <p>
              El autor de <strong>PokeMind Games CR</strong> declara expresamente que <strong>NO es dueño ni titular de la marca Pokémon</strong>, ni posee derechos sobre sus personajes, nombres, ilustraciones, sprites o universo.
            </p>
            <p className="mt-1.5 text-slate-700">
              <strong>Pokémon</strong> y todos los elementos relacionados son marcas registradas propiedad exclusiva de <strong>Nintendo Co., Ltd.</strong>, <strong>Creatures Inc.</strong> y <strong>GAME FREAK inc.</strong> Todos los derechos pertenecen a sus legítimos titulares.
            </p>
          </div>

          <div className="bg-[#EBFBEE] border-2 border-[#111827] p-4 rounded-2xl shadow-ink-sm">
            <h4 className="font-display font-extrabold text-sm text-[#111827] mb-1 uppercase">
              2. Uso 100% Gratuito y Sin Fines de Lucro
            </h4>
            <p>
              Esta aplicación web es <strong>totalmente gratuita y sin fines comerciales</strong>. No se cobra dinero bajo ninguna modalidad, no existen suscripciones, compras integradas ni monetización. Fue creada únicamente con propósito académico y de experimentación con modelos de Machine Learning.
            </p>
          </div>

          <div className="bg-[#E7F5FF] border-2 border-[#111827] p-4 rounded-2xl shadow-ink-sm">
            <h4 className="font-display font-extrabold text-sm text-[#111827] mb-1 uppercase">
              3. Fuente de Datos (PokéAPI) y Uso Justo
            </h4>
            <p>
              Las imágenes oficiales (incluyendo formas regionales Alola, Galar, Hisui, Paldea y Megaevoluciones) se consultan dinámicamente desde la API pública y gratuita <strong>PokéAPI</strong> bajo principios de uso educativo y no comercial.
            </p>
          </div>
        </div>

        {/* PIE */}
        <div className="pt-4 border-t-[2.5px] border-[#111827] mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="arcade-btn bg-[#FFD43B] hover:bg-[#FFE066] text-[#111827] py-2.5 px-6 rounded-xl font-display font-extrabold text-sm uppercase cursor-pointer"
          >
            Entendido, a Jugar
          </button>
        </div>
      </div>
    </div>
  );
}

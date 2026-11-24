import React from 'react';

export default function LegalDisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#121829] border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Glow decorativo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* CABECERA */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            <div>
              <h3 className="text-lg md:text-xl font-black text-white">
                Aviso Legal & Deslinde de Responsabilidad
              </h3>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                Uso Educativo, Libre y Sin Fines de Lucro
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO DEL AVISO */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto pr-2">
          
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <h4 className="text-sm font-black text-amber-300 mb-1 flex items-center gap-2">
              <span>🛡️</span> Titularidad y Derechos de la Marca Pokémon
            </h4>
            <p>
              El autor y desarrollador de este proyecto <strong>NO es dueño ni titular de la marca Pokémon</strong>, ni posee derechos de autor o marcas registradas sobre los personajes, nombres, diseños, ilustraciones, logotipos ni universo de Pokémon. 
            </p>
            <p className="mt-1.5 text-slate-400">
              <strong>Pokémon</strong>, los nombres de los Pokémon, ilustraciones, estadísticas y elementos asociados son marcas comerciales y derechos de autor propiedad exclusiva de <strong>Nintendo Co., Ltd.</strong>, <strong>Creatures Inc.</strong> y <strong>Game Freak Inc.</strong> Todos los derechos reservados a sus respectivos creadores.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <h4 className="text-sm font-black text-emerald-300 mb-1 flex items-center gap-2">
              <span>🎁</span> 100% Gratuita, Sin Cobro y Sin Fines de Lucro
            </h4>
            <p>
              Esta aplicación web es <strong>completamente gratuita y de acceso público</strong>. En ninguna circunstancia se cobra dinero por su utilización, no existen muros de pago (paywalls), no hay microtransacciones, compras integradas, planes de pago ni monetización de ningún tipo. Su propósito es única y exclusivamente pedagógico y de demostración técnica en Machine Learning.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <h4 className="text-sm font-black text-cyan-300 mb-1 flex items-center gap-2">
              <span>🌐</span> Fuente de Datos y Uso Justo (Fair Use)
            </h4>
            <p>
              Las imágenes oficiales y metadatos estadísticos son obtenidos a través de la API pública y gratuita de <strong>PokéAPI</strong> (recursos comunitarios sin fines de lucro). El uso de estos materiales se realiza bajo los principios de <em>Uso Legítimo</em> (Fair Use) con fines de experimentación en algoritmos de visión por computadora (convolución espectral) y regresión (KNN Logístico).
            </p>
          </div>

          <div className="text-[11px] text-slate-400 italic text-center">
            Este software es un proyecto independiente desarrollado por estudiantes e investigadores de IA y no cuenta con afiliación, respaldo o patrocinio oficial de The Pokémon Company, Nintendo ni Game Freak.
          </div>

        </div>

        {/* PIE DEL MODAL */}
        <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl font-bold text-xs uppercase text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
}

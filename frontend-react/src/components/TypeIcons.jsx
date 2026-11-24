import React from 'react';

/**
 * 18 SVGs Icónicos Vectoriales Oficiales / Artesanales para cada Tipo Pokémon
 */
export function TypeIcon({ type, size = 20, className = '' }) {
  const normType = (type || 'Normal').trim();

  const icons = {
    Fire: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Fuego: Llama ardiente con núcleo vivo */}
        <path d="M12 2C11.5 5 9.5 7.5 8 9.5C6.2 11.9 5 14.5 5 17C5 20.87 8.13 24 12 24C15.87 24 19 20.87 19 17C19 13.5 16.5 10 14.5 7.5C14 10 12.5 11 11.5 12C12.5 9 13.5 6 12 2Z" fill="url(#fire-grad)" />
        <path d="M12 14C11 15.5 10 17 10 18.5C10 19.88 10.9 21 12 21C13.1 21 14 19.88 14 18.5C14 17 13 15.5 12 14Z" fill="#FFF7ED" />
        <defs>
          <linearGradient id="fire-grad" x1="12" y1="2" x2="12" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.4" stopColor="#F97316" />
            <stop offset="1" stopColor="#DC2626" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Water: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Agua: Gota ondulante con reflejo de ola */}
        <path d="M12 2.5C12 2.5 5 12 5 16.5C5 20.64 8.13 24 12 24C15.87 24 19 20.64 19 16.5C19 12 12 2.5 12 2.5Z" fill="url(#water-grad)" />
        <path d="M9.5 14C8.5 15.5 8.5 17.5 9.5 19C10.5 20.5 12 21 13.5 21C11.5 21 10.5 19.5 10.5 18C10.5 16.5 11.5 15 12 14C11 14 10 13.5 9.5 14Z" fill="#E0F2FE" opacity="0.8" />
        <defs>
          <linearGradient id="water-grad" x1="12" y1="2" x2="12" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.6" stopColor="#2563EB" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Grass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Planta: Hoja botánica viva con nervadura */}
        <path d="M21 3C15 3 6 5 4 15C3.5 17.5 4.5 20 6.5 21.5C8 22.5 10 23 12 23C20 23 22 13 21 3Z" fill="url(#grass-grad)" />
        <path d="M4 22C7 18 11 13 19 6" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="grass-grad" x1="4" y1="3" x2="21" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ADE80" />
            <stop offset="0.6" stopColor="#16A34A" />
            <stop offset="1" stopColor="#14532D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Electric: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Eléctrico: Relámpago quebrado de alto voltaje */}
        <path d="M13 1.5L4 13.5H11.5L9.5 23.5L20 10.5H12.5L14.5 1.5H13Z" fill="url(#elec-grad)" stroke="#CA8A04" strokeWidth="1" />
        <path d="M12.5 4L6.5 12.5H11.5L10.5 19L17.5 11.5H12L13.5 4H12.5Z" fill="#FEF08A" opacity="0.6" />
        <defs>
          <linearGradient id="elec-grad" x1="4" y1="1.5" x2="20" y2="23.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.5" stopColor="#EAB308" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ice: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Hielo: Cristal copo de nieve tallado */}
        <path d="M12 2V22M2 12H22M5 5L19 19M19 5L5 19" stroke="url(#ice-grad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.5" fill="#E0F2FE" />
        <path d="M12 6L14 8M12 6L10 8M12 18L14 16M12 18L10 16M6 12L8 10M6 12L8 14M18 12L16 10M18 12L16 14" stroke="#7DD3FC" strokeWidth="1.8" strokeLinecap="round" />
        <defs>
          <linearGradient id="ice-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BAE6FD" />
            <stop offset="0.5" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Fighting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Lucha: Puño enguantado de combate */}
        <path d="M18 4H10C7.79 4 6 5.79 6 8V12C6 15.31 8.69 18 12 18H14V22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4Z" fill="url(#fight-grad)" />
        <path d="M10 7H14M10 10H15M10 13H14" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="15" cy="9" r="1.5" fill="#FCA5A5" />
        <defs>
          <linearGradient id="fight-grad" x1="6" y1="4" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="0.6" stopColor="#B91C1C" />
            <stop offset="1" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Poison: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Veneno: Calavera de matarratas tóxico */}
        <path d="M12 2C7.58 2 4 5.58 4 10C4 13.5 6.2 16.48 9.3 17.5V20C9.3 20.55 9.75 21 10.3 21H13.7C14.25 21 14.7 20.55 14.7 20V17.5C17.8 16.48 20 13.5 20 10C20 5.58 16.42 2 12 2Z" fill="url(#poison-grad)" />
        <circle cx="8.5" cy="9.5" r="2" fill="#1E1B4B" />
        <circle cx="15.5" cy="9.5" r="2" fill="#1E1B4B" />
        <path d="M11 14.5L12 13.5L13 14.5" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 18H14M11 20H13" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="poison-grad" x1="4" y1="2" x2="20" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C084FC" />
            <stop offset="0.5" stopColor="#9333EA" />
            <stop offset="1" stopColor="#581C87" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ground: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Tierra: Estratos geológicos quebrados */}
        <path d="M2 17L12 12L22 17L12 22L2 17Z" fill="#92400E" />
        <path d="M2 11L12 6L22 11L12 16L2 11Z" fill="#D97706" />
        <path d="M2 5L12 1L22 5L12 10L2 5Z" fill="#FBBF24" />
        <path d="M12 1L22 5L12 10L2 5L12 1Z" fill="url(#ground-grad)" opacity="0.85" />
        <defs>
          <linearGradient id="ground-grad" x1="2" y1="1" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#78350F" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Flying: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Volador: Alas extendidas aerodinámicas */}
        <path d="M12 4C9 4 3 6.5 2 11C4.5 11 7 10 9 8.5C7.5 11.5 8 14 9.5 15C10.5 13 12 12 14 12C12.5 14.5 13 17 14.5 18C16 16 18 15 20.5 15.5C21 14 21.5 12 21.8 10C22.5 5 16 4 12 4Z" fill="url(#fly-grad)" />
        <path d="M3 13C6 13 9 11 11 9" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="fly-grad" x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A5B4FC" />
            <stop offset="0.6" stopColor="#6366F1" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Psychic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Psíquico: Ojo místico del tercer ojo con ondas telepáticas */}
        <path d="M12 4C5 4 1 12 1 12C1 12 5 20 12 20C19 20 23 12 23 12C23 12 19 4 12 4Z" fill="url(#psychic-grad)" />
        <circle cx="12" cy="12" r="5" fill="#500724" />
        <circle cx="12" cy="12" r="2.5" fill="#F472B6" />
        <circle cx="10.8" cy="10.8" r="1" fill="#FFFFFF" />
        <defs>
          <linearGradient id="psychic-grad" x1="1" y1="4" x2="23" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F472B6" />
            <stop offset="0.5" stopColor="#E11D48" />
            <stop offset="1" stopColor="#881337" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Bug: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Bicho: Escarabajo acorazado con antenas */}
        <circle cx="12" cy="7" r="3.5" fill="#4D7C0F" />
        <path d="M10 4L7 1M14 4L17 1" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 11C7 9.5 8 8 12 8C16 8 17 9.5 17 11V16C17 19.5 15 22 12 22C9 22 7 19.5 7 16V11Z" fill="url(#bug-grad)" />
        <path d="M12 8V22M7 14H17M7 18H17" stroke="#14532D" strokeWidth="1.2" />
        <path d="M6 10L3 9M6 15L2 16M6 19L3 21M18 10L21 9M18 15L22 16M18 19L21 21" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="bug-grad" x1="7" y1="8" x2="17" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A3E635" />
            <stop offset="0.6" stopColor="#65A30D" />
            <stop offset="1" stopColor="#365314" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Rock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Roca: Monolito de granito angulado */}
        <path d="M6 3L17 2L22 9L19 21L7 22L2 14L6 3Z" fill="url(#rock-grad)" />
        <path d="M6 3L11 11L19 21M11 11L22 9M11 11L2 14" stroke="#451A03" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="6,3 11,11 2,14" fill="#FDE68A" opacity="0.3" />
        <polygon points="17,2 22,9 11,11" fill="#78350F" opacity="0.4" />
        <defs>
          <linearGradient id="rock-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D97706" />
            <stop offset="0.5" stopColor="#92400E" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ghost: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Fantasma: Espectro etéreo con ojos fluorescentes */}
        <path d="M12 2C7 2 4 6 4 11C4 16 3 20 3 22C5 20.5 7 21 8.5 22C10.5 21 11.5 22 12 22C12.5 22 13.5 21 15.5 22C17 21 19 20.5 21 22C21 20 20 16 20 11C20 6 17 2 12 2Z" fill="url(#ghost-grad)" />
        <ellipse cx="9" cy="10" rx="2" ry="3" fill="#FDE047" />
        <ellipse cx="15" cy="10" rx="2" ry="3" fill="#FDE047" />
        <circle cx="9" cy="10" r="1" fill="#450A0A" />
        <circle cx="15" cy="10" r="1" fill="#450A0A" />
        <path d="M9 16C10.5 17.5 13.5 17.5 15 16" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="ghost-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7" />
            <stop offset="0.5" stopColor="#6B21A8" />
            <stop offset="1" stopColor="#3B0764" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Dragon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Dragón: Fauce y garras de dragón mítico */}
        <path d="M3 13C3 13 4 7 11 4C14 2.7 18 2 21 2C21.5 5 21.5 9 19.5 12C17.5 15 15 17 11 18C8 18.8 5 20 3 22C4 19 3 16 3 13Z" fill="url(#dragon-grad)" />
        <circle cx="16" cy="6.5" r="1.8" fill="#FDE047" />
        <circle cx="16.2" cy="6.5" r="0.8" fill="#1E1B4B" />
        <path d="M12 9L9 11L13 13L10 15L14 16" stroke="#C7D2FE" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="dragon-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" />
            <stop offset="0.5" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Steel: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Acero: Tuerca blindada hexagonal con filo cromado */}
        <path d="M12 2L20 6.6V17.4L12 22L4 17.4V6.6L12 2Z" fill="url(#steel-grad)" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.5" fill="#1E293B" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M12 4L18 7.5M12 20L6 16.5" stroke="#F1F5F9" strokeWidth="1" opacity="0.6" />
        <defs>
          <linearGradient id="steel-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E2E8F0" />
            <stop offset="0.5" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Dark: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Siniestro: Luna menguante sombría y filo oscuro */}
        <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" fill="url(#dark-grad)" />
        <path d="M14 9L15 11L17 12L15 13L14 15L13 13L11 12L13 11L14 9Z" fill="#F87171" opacity="0.8" />
        <defs>
          <linearGradient id="dark-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64748B" />
            <stop offset="0.5" stopColor="#334155" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Fairy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Hada: Estrella destellante alada mágica */}
        <path d="M12 1L14.5 8.5L22 9.5L16.5 15L18 22.5L12 18.5L6 22.5L7.5 15L2 9.5L9.5 8.5L12 1Z" fill="url(#fairy-grad)" />
        <circle cx="12" cy="12" r="3" fill="#FFF" opacity="0.8" />
        <circle cx="7" cy="7" r="1" fill="#FDF2F8" />
        <circle cx="17" cy="17" r="1.2" fill="#FDF2F8" />
        <defs>
          <linearGradient id="fairy-grad" x1="2" y1="1" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBCFE8" />
            <stop offset="0.5" stopColor="#F472B6" />
            <stop offset="1" stopColor="#BE185D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Normal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Normal: Escudo circular concéntrico universal */}
        <circle cx="12" cy="12" r="10" fill="url(#normal-grad)" stroke="#78716C" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5.5" fill="#44403C" stroke="#D6D3D1" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#FAFAF9" />
        <defs>
          <linearGradient id="normal-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7E5E4" />
            <stop offset="0.5" stopColor="#A8A29E" />
            <stop offset="1" stopColor="#57534E" />
          </linearGradient>
        </defs>
      </svg>
    )
  };

  return icons[normType] || icons.Normal;
}

export default TypeIcon;

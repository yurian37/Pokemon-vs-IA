import React, { useId } from 'react';

/**
 * 18 SVGs Icónicos Vectoriales Artesanales para cada Tipo Pokémon
 * Usa useId() para evitar colisiones de gradientes SVG cuando hay múltiples iconos en pantalla.
 */
export function TypeIcon({ type, size = 20, className = '' }) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const normType = (type || 'Normal').trim();

  const icons = {
    Fire: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 1.8C11.5 5 9.5 7.5 8 9.5C6.2 11.9 5 14.5 5 17C5 20.87 8.13 23.5 12 23.5C15.87 23.5 19 20.87 19 17C19 13.5 16.5 10 14.5 7.5C14 10 12.5 11 11.5 12C12.5 9 13.5 5.8 12 1.8Z" fill={`url(#fire-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 13.8C11 15.3 10 16.8 10 18.3C10 19.68 10.9 20.8 12 20.8C13.1 20.8 14 19.68 14 18.3C14 16.8 13 15.3 12 13.8Z" fill="#FFF7ED" />
        <defs>
          <linearGradient id={`fire-${uid}`} x1="12" y1="2" x2="12" y2="23.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.45" stopColor="#F97316" />
            <stop offset="1" stopColor="#DC2626" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Water: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 2.2C12 2.2 5 11.8 5 16.3C5 20.44 8.13 23.4 12 23.4C15.87 23.4 19 20.44 19 16.3C19 11.8 12 2.2 12 2.2Z" fill={`url(#water-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M9.5 14C8.5 15.5 8.5 17.5 9.5 19C10.5 20.5 12 20.8 13.5 20.8C11.5 20.8 10.5 19.3 10.5 17.8C10.5 16.3 11.5 15 12 14C11 14 10 13.5 9.5 14Z" fill="#E0F2FE" opacity="0.9" />
        <defs>
          <linearGradient id={`water-${uid}`} x1="12" y1="2" x2="12" y2="23.4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.6" stopColor="#2563EB" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Grass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M20.8 3.2C14.8 3.2 6 5.2 4.2 14.8C3.7 17.3 4.7 19.8 6.7 21.3C8.2 22.3 10.2 22.8 12.2 22.8C20 22.8 21.8 13 20.8 3.2Z" fill={`url(#grass-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M4.5 21.5C7.5 17.5 11.2 12.8 18.8 6.2" stroke="#DCFCE7" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id={`grass-${uid}`} x1="4" y1="3" x2="21" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ADE80" />
            <stop offset="0.6" stopColor="#16A34A" />
            <stop offset="1" stopColor="#14532D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Electric: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M13.5 1.8L4.5 13.5H11.5L9.5 22.8L19.5 10.5H12.5L14.5 1.8H13.5Z" fill={`url(#elec-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12.5 4.5L7 12.5H11.5L10.6 18.2L17 11.5H12L13.3 4.5H12.5Z" fill="#FEF9C3" opacity="0.7" />
        <defs>
          <linearGradient id={`elec-${uid}`} x1="4.5" y1="1.8" x2="19.5" y2="22.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.5" stopColor="#FACC15" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ice: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 2V22M2 12H22M5 5L19 19M19 5L5 19" stroke={`url(#ice-${uid})`} strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.6" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.2" />
        <path d="M12 5.5L14 7.5M12 5.5L10 7.5M12 18.5L14 16.5M12 18.5L10 16.5M5.5 12L7.5 10M5.5 12L7.5 14M18.5 12L16.5 10M18.5 12L16.5 14" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
        <defs>
          <linearGradient id={`ice-${uid}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BAE6FD" />
            <stop offset="0.5" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Fighting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M18 3.5H10C7.79 3.5 6 5.29 6 7.5V12C6 15.31 8.69 18 12 18H14V21.5H18C19.1 21.5 20 20.6 20 19.5V5.5C20 4.4 19.1 3.5 18 3.5Z" fill={`url(#fight-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M10 7H14M10 10H15M10 13H14" stroke="#FEE2E2" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="15.5" cy="9" r="1.4" fill="#FCA5A5" />
        <defs>
          <linearGradient id={`fight-${uid}`} x1="6" y1="3.5" x2="20" y2="21.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F87171" />
            <stop offset="0.55" stopColor="#DC2626" />
            <stop offset="1" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Poison: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 2.2C7.58 2.2 4 5.78 4 10.2C4 13.7 6.2 16.68 9.3 17.7V20.2C9.3 20.75 9.75 21.2 10.3 21.2H13.7C14.25 21.2 14.7 20.75 14.7 20.2V17.7C17.8 16.68 20 13.7 20 10.2C20 5.78 16.42 2.2 12 2.2Z" fill={`url(#poison-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="8.6" cy="9.8" r="2" fill="#1E1B4B" />
        <circle cx="15.4" cy="9.8" r="2" fill="#1E1B4B" />
        <path d="M11 14.7L12 13.7L13 14.7" stroke="#1E1B4B" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10.2 18.3H13.8" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={`poison-${uid}`} x1="4" y1="2.2" x2="20" y2="21.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E879F9" />
            <stop offset="0.5" stopColor="#9333EA" />
            <stop offset="1" stopColor="#581C87" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ground: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M2.2 17L12 12L21.8 17L12 22L2.2 17Z" fill="#78350F" stroke="#111827" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M2.2 11.2L12 6.2L21.8 11.2L12 16.2L2.2 11.2Z" fill="#D97706" stroke="#111827" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M2.2 5.4L12 1.4L21.8 5.4L12 10.2L2.2 5.4Z" fill={`url(#ground-${uid})`} stroke="#111827" strokeWidth="1.1" strokeLinejoin="round" />
        <defs>
          <linearGradient id={`ground-${uid}`} x1="2" y1="1.4" x2="22" y2="10.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.55" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Flying: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 4C9 4 3 6.5 2 11C4.5 11 7 10 9 8.5C7.5 11.5 8 14 9.5 15C10.5 13 12 12 14 12C12.5 14.5 13 17 14.5 18C16 16 18 15 20.5 15.5C21 14 21.5 12 21.8 10C22.5 5 16 4 12 4Z" fill={`url(#fly-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M3.5 13C6.5 12.8 9 11 11 9" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={`fly-${uid}`} x1="2" y1="4" x2="22" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C7D2FE" />
            <stop offset="0.6" stopColor="#6366F1" />
            <stop offset="1" stopColor="#3730A3" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Psychic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 4.2C5.2 4.2 1.5 12 1.5 12C1.5 12 5.2 19.8 12 19.8C18.8 19.8 22.5 12 22.5 12C22.5 12 18.8 4.2 12 4.2Z" fill={`url(#psychic-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="4.8" fill="#500724" />
        <circle cx="12" cy="12" r="2.4" fill="#F472B6" />
        <circle cx="10.8" cy="10.8" r="1" fill="#FFFFFF" />
        <defs>
          <linearGradient id={`psychic-${uid}`} x1="1.5" y1="4.2" x2="22.5" y2="19.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9A8D4" />
            <stop offset="0.5" stopColor="#EC4899" />
            <stop offset="1" stopColor="#9D174D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Bug: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <circle cx="12" cy="7" r="3.4" fill="#4D7C0F" stroke="#111827" strokeWidth="1.1" />
        <path d="M10 4L7 1.5M14 4L17 1.5" stroke="#365314" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 11C7 9.5 8 8.2 12 8.2C16 8.2 17 9.5 17 11V16C17 19.5 15 22 12 22C9 22 7 19.5 7 16V11Z" fill={`url(#bug-${uid})`} stroke="#111827" strokeWidth="1.2" />
        <path d="M12 8.2V22M7 14H17M7 18H17" stroke="#14532D" strokeWidth="1.3" />
        <path d="M6.5 10.5L3 9.2M6.5 15L2.5 16M6.5 19L3.2 21M17.5 10.5L21 9.2M17.5 15L21.5 16M17.5 19L20.8 21" stroke="#365314" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={`bug-${uid}`} x1="7" y1="8.2" x2="17" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BEF264" />
            <stop offset="0.6" stopColor="#84CC16" />
            <stop offset="1" stopColor="#3F6212" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Rock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M6 3L17 2L22 9L19 21L7 22L2 14L6 3Z" fill={`url(#rock-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6 3L11 11L19 21M11 11L22 9M11 11L2 14" stroke="#451A03" strokeWidth="1.4" strokeLinejoin="round" />
        <polygon points="6,3 11,11 2,14" fill="#FEF3C7" opacity="0.35" />
        <defs>
          <linearGradient id={`rock-${uid}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7C873" />
            <stop offset="0.5" stopColor="#B45309" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Ghost: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 2C7 2 4 6 4 11C4 16 3 20 3 22C5 20.5 7 21 8.5 22C10.5 21 11.5 22 12 22C12.5 22 13.5 21 15.5 22C17 21 19 20.5 21 22C21 20 20 16 20 11C20 6 17 2 12 2Z" fill={`url(#ghost-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="9" cy="10" rx="2" ry="2.8" fill="#FDE047" />
        <ellipse cx="15" cy="10" rx="2" ry="2.8" fill="#FDE047" />
        <circle cx="9" cy="10" r="1" fill="#1E1B4B" />
        <circle cx="15" cy="10" r="1" fill="#1E1B4B" />
        <path d="M9 16C10.5 17.5 13.5 17.5 15 16" stroke="#F5D0FE" strokeWidth="1.8" strokeLinecap="round" />
        <defs>
          <linearGradient id={`ghost-${uid}`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C084FC" />
            <stop offset="0.5" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#3B0764" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Dragon: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M3 13C3 13 4 7 11 4C14 2.7 18 2 21 2C21.5 5 21.5 9 19.5 12C17.5 15 15 17 11 18C8 18.8 5 20 3 22C4 19 3 16 3 13Z" fill={`url(#dragon-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="16" cy="6.5" r="1.8" fill="#FDE047" />
        <circle cx="16.2" cy="6.5" r="0.8" fill="#1E1B4B" />
        <path d="M12 9L9 11L13 13L10 15L14 16" stroke="#C7D2FE" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={`dragon-${uid}`} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" />
            <stop offset="0.5" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Steel: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 2L20 6.6V17.4L12 22L4 17.4V6.6L12 2Z" fill={`url(#steel-${uid})`} stroke="#111827" strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="4.4" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1.4" />
        <path d="M12 4.5L17.5 7.5M12 19.5L6.5 16.5" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.7" />
        <defs>
          <linearGradient id={`steel-${uid}`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F1F5F9" />
            <stop offset="0.5" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Dark: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" fill={`url(#dark-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M14.5 8.5L15.4 10.6L17.5 11.5L15.4 12.4L14.5 14.5L13.6 12.4L11.5 11.5L13.6 10.6L14.5 8.5Z" fill="#F87171" />
        <defs>
          <linearGradient id={`dark-${uid}`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#71717A" />
            <stop offset="0.5" stopColor="#27272A" />
            <stop offset="1" stopColor="#09090B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Fairy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 1.5L14.5 8.5L21.8 9.5L16.3 14.8L17.8 22.2L12 18.4L6.2 22.2L7.7 14.8L2.2 9.5L9.5 8.5L12 1.5Z" fill={`url(#fairy-${uid})`} stroke="#111827" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.8" fill="#FFFFFF" opacity="0.9" />
        <defs>
          <linearGradient id={`fairy-${uid}`} x1="2.2" y1="1.5" x2="21.8" y2="22.2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBCFE8" />
            <stop offset="0.5" stopColor="#F472B6" />
            <stop offset="1" stopColor="#BE185D" />
          </linearGradient>
        </defs>
      </svg>
    ),
    Normal: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="9.8" fill={`url(#normal-${uid})`} stroke="#111827" strokeWidth="1.3" />
        <circle cx="12" cy="12" r="5.3" fill="#44403C" stroke="#F5F5F4" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="2" fill="#FAFAF9" />
        <defs>
          <linearGradient id={`normal-${uid}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5F5F4" />
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

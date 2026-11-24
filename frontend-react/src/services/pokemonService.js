import pokemonData from '../data/pokemonData.json';

// Los 18 Tipos Oficiales de Pokémon
export const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'
];

/**
 * 18 Fondos con degradación de colores espectacular, brillo neón y texturas para cada Tipo
 */
export const TYPE_COLORS = {
  Normal: { 
    bg: '#A8A77A', 
    text: '#FFFFFF', 
    gradient: 'from-[#A8A77A] via-[#8A885D] to-[#44403C]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #C6C59E 0%, #8A885D 50%, #292524 100%)',
    border: '#A8A77A',
    glow: 'rgba(168, 167, 122, 0.45)',
    tagBg: '#57534E'
  },
  Fire: { 
    bg: '#EE8130', 
    text: '#FFFFFF', 
    gradient: 'from-[#FF7A00] via-[#EF4444] to-[#7F1D1D]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #F97316 0%, #DC2626 50%, #450A0A 100%)',
    border: '#F97316',
    glow: 'rgba(239, 68, 68, 0.55)',
    tagBg: '#991B1B'
  },
  Water: { 
    bg: '#6390F0', 
    text: '#FFFFFF', 
    gradient: 'from-[#38BDF8] via-[#2563EB] to-[#0F172A]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #38BDF8 0%, #1D4ED8 55%, #0B1329 100%)',
    border: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.5)',
    tagBg: '#1E40AF'
  },
  Grass: { 
    bg: '#7AC74C', 
    text: '#FFFFFF', 
    gradient: 'from-[#4ADE80] via-[#16A34A] to-[#052E16]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #4ADE80 0%, #15803D 55%, #022C22 100%)',
    border: '#4ADE80',
    glow: 'rgba(74, 222, 128, 0.5)',
    tagBg: '#166534'
  },
  Electric: { 
    bg: '#F7D02C', 
    text: '#1E293B', 
    gradient: 'from-[#FDE047] via-[#EAB308] to-[#713F12]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #FEF08A 0%, #CA8A04 55%, #422006 100%)',
    border: '#FACC15',
    glow: 'rgba(250, 204, 21, 0.6)',
    tagBg: '#854D0E'
  },
  Ice: { 
    bg: '#96D9D6', 
    text: '#1E293B', 
    gradient: 'from-[#BAE6FD] via-[#38BDF8] to-[#0C4A6E]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #E0F2FE 0%, #0284C7 55%, #082F49 100%)',
    border: '#7DD3FC',
    glow: 'rgba(125, 211, 252, 0.55)',
    tagBg: '#0369A1'
  },
  Fighting: { 
    bg: '#C22E28', 
    text: '#FFFFFF', 
    gradient: 'from-[#F87171] via-[#DC2626] to-[#450A0A]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #EF4444 0%, #991B1B 55%, #300606 100%)',
    border: '#EF4444',
    glow: 'rgba(220, 38, 38, 0.55)',
    tagBg: '#7F1D1D'
  },
  Poison: { 
    bg: '#A33EA1', 
    text: '#FFFFFF', 
    gradient: 'from-[#D8B4FE] via-[#9333EA] to-[#3B0764]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #C084FC 0%, #7E22CE 55%, #240444 100%)',
    border: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.55)',
    tagBg: '#6B21A8'
  },
  Ground: { 
    bg: '#E2BF65', 
    text: '#1E293B', 
    gradient: 'from-[#FDE68A] via-[#D97706] to-[#451A03]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #FBBF24 0%, #B45309 55%, #291204 100%)',
    border: '#FBBF24',
    glow: 'rgba(245, 158, 11, 0.5)',
    tagBg: '#78350F'
  },
  Flying: { 
    bg: '#A98FF3', 
    text: '#FFFFFF', 
    gradient: 'from-[#C7D2FE] via-[#6366F1] to-[#1E1B4B]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #A5B4FC 0%, #4F46E5 55%, #0F0E2A 100%)',
    border: '#818CF8',
    glow: 'rgba(129, 140, 248, 0.55)',
    tagBg: '#3730A3'
  },
  Psychic: { 
    bg: '#F95587', 
    text: '#FFFFFF', 
    gradient: 'from-[#F472B6] via-[#E11D48] to-[#4C0519]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #FB7185 0%, #BE123C 55%, #30020D 100%)',
    border: '#FB7185',
    glow: 'rgba(251, 113, 133, 0.6)',
    tagBg: '#9F1239'
  },
  Bug: { 
    bg: '#A6B91A', 
    text: '#FFFFFF', 
    gradient: 'from-[#BEF264] via-[#65A30D] to-[#1A2E05]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #A3E635 0%, #4D7C0F 55%, #142304 100%)',
    border: '#A3E635',
    glow: 'rgba(163, 230, 53, 0.5)',
    tagBg: '#365314'
  },
  Rock: { 
    bg: '#B6A136', 
    text: '#FFFFFF', 
    gradient: 'from-[#FCD34D] via-[#92400E] to-[#291804]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #D97706 0%, #78350F 55%, #180D02 100%)',
    border: '#D97706',
    glow: 'rgba(217, 119, 6, 0.5)',
    tagBg: '#592908'
  },
  Ghost: { 
    bg: '#735797', 
    text: '#FFFFFF', 
    gradient: 'from-[#C084FC] via-[#6B21A8] to-[#170326]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #9333EA 0%, #581C87 55%, #0F0118 100%)',
    border: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.6)',
    tagBg: '#4A154B'
  },
  Dragon: { 
    bg: '#6F35FC', 
    text: '#FFFFFF', 
    gradient: 'from-[#A5B4FC] via-[#4F46E5] to-[#110D38]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #6366F1 0%, #3730A3 55%, #08051E 100%)',
    border: '#818CF8',
    glow: 'rgba(99, 102, 241, 0.6)',
    tagBg: '#2E2880'
  },
  Steel: { 
    bg: '#B7B7CE', 
    text: '#1E293B', 
    gradient: 'from-[#F1F5F9] via-[#64748B] to-[#0F172A]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #CBD5E1 0%, #475569 55%, #0B111E 100%)',
    border: '#94A3B8',
    glow: 'rgba(148, 163, 184, 0.45)',
    tagBg: '#334155'
  },
  Dark: { 
    bg: '#705746', 
    text: '#FFFFFF', 
    gradient: 'from-[#64748B] via-[#1E293B] to-[#020617]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #334155 0%, #0F172A 55%, #000000 100%)',
    border: '#475569',
    glow: 'rgba(71, 85, 105, 0.5)',
    tagBg: '#1E293B'
  },
  Fairy: { 
    bg: '#D685AD', 
    text: '#FFFFFF', 
    gradient: 'from-[#FCE7F3] via-[#EC4899] to-[#500724]', 
    bgGradientCss: 'radial-gradient(circle at 50% 20%, #F472B6 0%, #BE185D 55%, #2E0314 100%)',
    border: '#F472B6',
    glow: 'rgba(244, 114, 182, 0.6)',
    tagBg: '#9D174D'
  }
};

export const STAT_NAMES = {
  hp: { name: 'Puntos de Salud (HP)', key: 'hp', short: 'HP', color: '#10B981' },
  attack: { name: 'Ataque (Attack)', key: 'attack', short: 'ATK', color: '#EF4444' },
  defense: { name: 'Defensa (Defense)', key: 'defense', short: 'DEF', color: '#3B82F6' },
  spAtk: { name: 'Ataque Especial (Sp. Atk)', key: 'spAtk', short: 'SP. ATK', color: '#F59E0B' },
  spDef: { name: 'Defensa Especial (Sp. Def)', key: 'spDef', short: 'SP. DEF', color: '#8B5CF6' },
  speed: { name: 'Velocidad (Speed)', key: 'speed', short: 'SPD', color: '#EC4899' }
};

export const STAT_KEYS = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];

export function getAllPokemons() {
  return pokemonData;
}

export function getRandomPokemon(excludeId = null) {
  const filtered = excludeId ? pokemonData.filter(p => p.id !== excludeId) : pokemonData;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

export function getTwoRandomPokemons() {
  const p1 = getRandomPokemon();
  let p2 = getRandomPokemon(p1.id);
  return [p1, p2];
}

export function getRandomStatKey() {
  const index = Math.floor(Math.random() * STAT_KEYS.length);
  return STAT_KEYS[index];
}

export function generateTypeDuelRound() {
  const pokemon = getRandomPokemon();
  const pokeTypes = [pokemon.type1];
  if (pokemon.type2 && pokemon.type2.toLowerCase() !== 'none') {
    pokeTypes.push(pokemon.type2);
  }

  const correctType = pokeTypes[Math.floor(Math.random() * pokeTypes.length)];
  const forbiddenTypes = new Set(pokeTypes);
  const validDistractors = POKEMON_TYPES.filter(t => !forbiddenTypes.has(t));
  const shuffledDistractors = [...validDistractors].sort(() => Math.random() - 0.5);
  const selectedDistractors = shuffledDistractors.slice(0, 3);
  const options = [correctType, ...selectedDistractors].sort(() => Math.random() - 0.5);

  return {
    pokemon,
    correctType,
    options,
    allTypes: pokeTypes
  };
}

export function generateTypeBettingRound() {
  const targetType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
  const matches = pokemonData.filter(p => p.type1 === targetType || p.type2 === targetType);
  const correctPokemon = matches[Math.floor(Math.random() * matches.length)];

  const nonMatches = pokemonData.filter(p => p.type1 !== targetType && p.type2 !== targetType);
  const shuffledNonMatches = [...nonMatches].sort(() => Math.random() - 0.5);
  const incorrect1 = shuffledNonMatches[0];
  let incorrect2 = shuffledNonMatches[1];
  if (incorrect2.id === incorrect1.id && shuffledNonMatches.length > 2) {
    incorrect2 = shuffledNonMatches[2];
  }

  const options = [
    { ...correctPokemon, isCorrect: true },
    { ...incorrect1, isCorrect: false },
    { ...incorrect2, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const correctIndex = options.findIndex(opt => opt.isCorrect);

  return {
    targetType,
    options,
    correctIndex
  };
}

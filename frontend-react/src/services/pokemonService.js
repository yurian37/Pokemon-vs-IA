import pokemonData from '../data/pokemonData.json';

// Los 18 Tipos Oficiales de Pokémon
export const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'
];

// Nombres en español coloquial para etiquetas rápidas
export const TYPE_ES = {
  Normal: 'Normal',
  Fire: 'Fuego',
  Water: 'Agua',
  Grass: 'Planta',
  Electric: 'Eléctrico',
  Ice: 'Hielo',
  Fighting: 'Lucha',
  Poison: 'Veneno',
  Ground: 'Tierra',
  Flying: 'Volador',
  Psychic: 'Psíquico',
  Bug: 'Bicho',
  Rock: 'Roca',
  Ghost: 'Fantasma',
  Dragon: 'Dragón',
  Steel: 'Acero',
  Dark: 'Siniestro',
  Fairy: 'Hada',
};

/**
 * 18 Mundos Elementales con Degradaciones Cromáticas Vibrantes (Arcade + Poster)
 * Cada tipo define:
 * - bgGradientCss: Degradado vibrante principal para tarjetas y arenas
 * - worldGradient: Degradado ambiental inmersivo para el fondo completo de la app
 * - bg / border / glow / tagBg / accentText: Tokens de alto contraste
 */
export const TYPE_COLORS = {
  Normal: {
    bg: '#8C8964',
    text: '#FFFFFF',
    accentText: '#44403C',
    gradient: 'from-[#C8C4A0] via-[#8C8964] to-[#4A4737]',
    bgGradientCss: 'linear-gradient(135deg, #D5D2B2 0%, #9E9B76 48%, #57534E 100%)',
    worldGradient: 'radial-gradient(circle at 15% 15%, #F5F2E1 0%, #D8D3B8 46%, #A8A29E 100%)',
    border: '#78716C',
    glow: 'rgba(140, 137, 100, 0.45)',
    tagBg: '#44403C'
  },
  Fire: {
    bg: '#E84A27',
    text: '#FFFFFF',
    accentText: '#9A3412',
    gradient: 'from-[#FF9A3C] via-[#EE4B2B] to-[#8C1D18]',
    bgGradientCss: 'linear-gradient(135deg, #FF9E2C 0%, #F04826 52%, #8F1515 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #FFE0B2 0%, #FF8A4C 45%, #B91C1C 100%)',
    border: '#EA580C',
    glow: 'rgba(234, 88, 12, 0.5)',
    tagBg: '#9A1B1B'
  },
  Water: {
    bg: '#247BA0',
    text: '#FFFFFF',
    accentText: '#1D4ED8',
    gradient: 'from-[#38BDF8] via-[#2563EB] to-[#1E3A8A]',
    bgGradientCss: 'linear-gradient(135deg, #38D6FF 0%, #2563EB 54%, #152C70 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #D4F3FF 0%, #4EA8FF 48%, #1D4ED8 100%)',
    border: '#0284C7',
    glow: 'rgba(37, 99, 235, 0.45)',
    tagBg: '#1E40AF'
  },
  Grass: {
    bg: '#2E9E4F',
    text: '#FFFFFF',
    accentText: '#15803D',
    gradient: 'from-[#6EE755] via-[#16A34A] to-[#064E3B]',
    bgGradientCss: 'linear-gradient(135deg, #6CE65A 0%, #16A34A 52%, #0B4F30 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #DCFCE7 0%, #4ADE80 48%, #15803D 100%)',
    border: '#16A34A',
    glow: 'rgba(22, 163, 74, 0.48)',
    tagBg: '#14532D'
  },
  Electric: {
    bg: '#F4B400',
    text: '#111827',
    accentText: '#A16207',
    gradient: 'from-[#FFF066] via-[#FACC15] to-[#B45309]',
    bgGradientCss: 'linear-gradient(135deg, #FFF066 0%, #F5B700 55%, #A16207 100%)',
    worldGradient: 'radial-gradient(circle at 20% 10%, #FFF9C4 0%, #FFD43B 48%, #CA8A04 100%)',
    border: '#CA8A04',
    glow: 'rgba(250, 204, 21, 0.55)',
    tagBg: '#854D0E'
  },
  Ice: {
    bg: '#2DB5C4',
    text: '#111827',
    accentText: '#0369A1',
    gradient: 'from-[#CFFAFE] via-[#38BDF8] to-[#0E7490]',
    bgGradientCss: 'linear-gradient(135deg, #BDF4FF 0%, #38BDF8 52%, #0C5A7A 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #ECFEFF 0%, #7DD3FC 48%, #0284C7 100%)',
    border: '#0891B2',
    glow: 'rgba(56, 189, 248, 0.5)',
    tagBg: '#0E7490'
  },
  Fighting: {
    bg: '#C92A2A',
    text: '#FFFFFF',
    accentText: '#991B1B',
    gradient: 'from-[#FF6B6B] via-[#C92A2A] to-[#5C0B0B]',
    bgGradientCss: 'linear-gradient(135deg, #F05252 0%, #B91C1C 52%, #5A0C0C 100%)',
    worldGradient: 'radial-gradient(circle at 15% 15%, #FFE3E3 0%, #E05252 48%, #7F1D1D 100%)',
    border: '#B91C1C',
    glow: 'rgba(201, 42, 42, 0.5)',
    tagBg: '#7F1D1D'
  },
  Poison: {
    bg: '#9B2FAE',
    text: '#FFFFFF',
    accentText: '#7E22CE',
    gradient: 'from-[#E879F9] via-[#9333EA] to-[#4A044E]',
    bgGradientCss: 'linear-gradient(135deg, #D96BF2 0%, #8E24AA 52%, #3E0B54 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #FAE8FF 0%, #C084FC 48%, #6B21A8 100%)',
    border: '#9333EA',
    glow: 'rgba(147, 51, 234, 0.5)',
    tagBg: '#581C87'
  },
  Ground: {
    bg: '#C98A2E',
    text: '#FFFFFF',
    accentText: '#92400E',
    gradient: 'from-[#FCD34D] via-[#D97706] to-[#6B3410]',
    bgGradientCss: 'linear-gradient(135deg, #F6C361 0%, #C97A22 54%, #66340C 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #FEF3C7 0%, #EAB354 48%, #92400E 100%)',
    border: '#B45309',
    glow: 'rgba(217, 119, 6, 0.5)',
    tagBg: '#78350F'
  },
  Flying: {
    bg: '#6C7AF2',
    text: '#FFFFFF',
    accentText: '#4338CA',
    gradient: 'from-[#BFDBFE] via-[#6366F1] to-[#312E81]',
    bgGradientCss: 'linear-gradient(135deg, #93C5FD 0%, #6366F1 52%, #2B2678 100%)',
    worldGradient: 'radial-gradient(circle at 20% 10%, #E0E7FF 0%, #818CF8 48%, #3730A3 100%)',
    border: '#4F46E5',
    glow: 'rgba(99, 102, 241, 0.5)',
    tagBg: '#3730A3'
  },
  Psychic: {
    bg: '#F03E78',
    text: '#FFFFFF',
    accentText: '#BE123C',
    gradient: 'from-[#FF85B3] via-[#EC4899] to-[#831843]',
    bgGradientCss: 'linear-gradient(135deg, #FF73A8 0%, #E11D64 52%, #6D0E36 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #FFE4EF 0%, #F472B6 48%, #BE185D 100%)',
    border: '#DB2777',
    glow: 'rgba(236, 72, 153, 0.55)',
    tagBg: '#9D174D'
  },
  Bug: {
    bg: '#84A819',
    text: '#FFFFFF',
    accentText: '#4D7C0F',
    gradient: 'from-[#D9F99D] via-[#84CC16] to-[#365314]',
    bgGradientCss: 'linear-gradient(135deg, #C7F252 0%, #7CB518 52%, #314F0C 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #ECFCCB 0%, #A3E635 48%, #4D7C0F 100%)',
    border: '#65A30D',
    glow: 'rgba(132, 204, 22, 0.5)',
    tagBg: '#3F6212'
  },
  Rock: {
    bg: '#9E7F34',
    text: '#FFFFFF',
    accentText: '#78350F',
    gradient: 'from-[#E7C873] via-[#A1782C] to-[#4A3210]',
    bgGradientCss: 'linear-gradient(135deg, #DDBB62 0%, #9A7228 54%, #452F0E 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #F5ECD2 0%, #C9A45A 48%, #714E1A 100%)',
    border: '#854D0E',
    glow: 'rgba(161, 120, 44, 0.48)',
    tagBg: '#5C3A12'
  },
  Ghost: {
    bg: '#66439B',
    text: '#FFFFFF',
    accentText: '#581C87',
    gradient: 'from-[#B794F4] via-[#6D28D9] to-[#240B47]',
    bgGradientCss: 'linear-gradient(135deg, #A47CF2 0%, #5B21B6 52%, #1E0A3C 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #EDE9FE 0%, #8B5CF6 48%, #3B0764 100%)',
    border: '#6D28D9',
    glow: 'rgba(109, 40, 217, 0.55)',
    tagBg: '#4C1D95'
  },
  Dragon: {
    bg: '#4F3DF5',
    text: '#FFFFFF',
    accentText: '#3730A3',
    gradient: 'from-[#818CF8] via-[#4F46E5] to-[#1E1B4B]',
    bgGradientCss: 'linear-gradient(135deg, #7C6DF8 0%, #4338CA 52%, #181054 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #E0E7FF 0%, #6366F1 48%, #1E1B4B 100%)',
    border: '#4338CA',
    glow: 'rgba(79, 70, 229, 0.55)',
    tagBg: '#312E81'
  },
  Steel: {
    bg: '#64748B',
    text: '#FFFFFF',
    accentText: '#334155',
    gradient: 'from-[#E2E8F0] via-[#64748B] to-[#1E293B]',
    bgGradientCss: 'linear-gradient(135deg, #D5DFE9 0%, #64748B 52%, #1E293B 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #F1F5F9 0%, #94A3B8 48%, #334155 100%)',
    border: '#475569',
    glow: 'rgba(100, 116, 139, 0.48)',
    tagBg: '#334155'
  },
  Dark: {
    bg: '#3B3430',
    text: '#FFFFFF',
    accentText: '#1F2937',
    gradient: 'from-[#57534E] via-[#27272A] to-[#09090B]',
    bgGradientCss: 'linear-gradient(135deg, #52525B 0%, #27272A 50%, #09090B 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #D4D4D8 0%, #52525B 45%, #18181B 100%)',
    border: '#27272A',
    glow: 'rgba(39, 39, 42, 0.55)',
    tagBg: '#18181B'
  },
  Fairy: {
    bg: '#E86CA9',
    text: '#FFFFFF',
    accentText: '#9D174D',
    gradient: 'from-[#FBCFE8] via-[#EC4899] to-[#831843]',
    bgGradientCss: 'linear-gradient(135deg, #FFB5DA 0%, #E85D9E 52%, #86194F 100%)',
    worldGradient: 'radial-gradient(circle at 18% 12%, #FDF2F8 0%, #F9A8D4 48%, #BE185D 100%)',
    border: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.5)',
    tagBg: '#9D174D'
  }
};

export const STAT_NAMES = {
  hp: { name: 'Puntos de Salud (HP)', key: 'hp', short: 'HP', color: '#16A34A' },
  attack: { name: 'Ataque Físico (ATK)', key: 'attack', short: 'ATK', color: '#DC2626' },
  defense: { name: 'Defensa (DEF)', key: 'defense', short: 'DEF', color: '#2563EB' },
  spAtk: { name: 'Ataque Especial (SPA)', key: 'spAtk', short: 'SP.ATK', color: '#D97706' },
  spDef: { name: 'Defensa Especial (SPD)', key: 'spDef', short: 'SP.DEF', color: '#7C3AED' },
  speed: { name: 'Velocidad (SPE)', key: 'speed', short: 'SPEED', color: '#DB2777' }
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

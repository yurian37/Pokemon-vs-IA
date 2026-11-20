import pokemonData from '../data/pokemonData.json';

// Los 18 Tipos Oficiales de Pokémon con sus colores y gradientes
export const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'
];

export const TYPE_COLORS = {
  Normal: { bg: '#A8A77A', text: '#FFFFFF', gradient: 'from-[#A8A77A] to-[#8A885D]', border: '#8A885D' },
  Fire: { bg: '#EE8130', text: '#FFFFFF', gradient: 'from-[#FF7A00] to-[#EE3800]', border: '#C03000' },
  Water: { bg: '#6390F0', text: '#FFFFFF', gradient: 'from-[#3B82F6] to-[#1D4ED8]', border: '#1D4ED8' },
  Grass: { bg: '#7AC74C', text: '#FFFFFF', gradient: 'from-[#22C55E] to-[#15803D]', border: '#15803D' },
  Electric: { bg: '#F7D02C', text: '#1E293B', gradient: 'from-[#FACC15] to-[#EAB308]', border: '#CA8A04' },
  Ice: { bg: '#96D9D6', text: '#1E293B', gradient: 'from-[#38BDF8] to-[#06B6D4]', border: '#0284C7' },
  Fighting: { bg: '#C22E28', text: '#FFFFFF', gradient: 'from-[#DC2626] to-[#991B1B]', border: '#7F1D1D' },
  Poison: { bg: '#A33EA1', text: '#FFFFFF', gradient: 'from-[#A855F7] to-[#7E22CE]', border: '#6B21A8' },
  Ground: { bg: '#E2BF65', text: '#1E293B', gradient: 'from-[#D97706] to-[#B45309]', border: '#92400E' },
  Flying: { bg: '#A98FF3', text: '#FFFFFF', gradient: 'from-[#818CF8] to-[#6366F1]', border: '#4F46E5' },
  Psychic: { bg: '#F95587', text: '#FFFFFF', gradient: 'from-[#EC4899] to-[#BE185D]', border: '#9D174D' },
  Bug: { bg: '#A6B91A', text: '#FFFFFF', gradient: 'from-[#84CC16] to-[#65A30D]', border: '#4D7C0F' },
  Rock: { bg: '#B6A136', text: '#FFFFFF', gradient: 'from-[#CA8A04] to-[#854D0E]', border: '#713F12' },
  Ghost: { bg: '#735797', text: '#FFFFFF', gradient: 'from-[#7C3AED] to-[#4C1D95]', border: '#5B21B6' },
  Dragon: { bg: '#6F35FC', text: '#FFFFFF', gradient: 'from-[#6366F1] to-[#4338CA]', border: '#3730A3' },
  Steel: { bg: '#B7B7CE', text: '#1E293B', gradient: 'from-[#94A3B8] to-[#64748B]', border: '#475569' },
  Dark: { bg: '#705746', text: '#FFFFFF', gradient: 'from-[#334155] to-[#0F172A]', border: '#1E293B' },
  Fairy: { bg: '#D685AD', text: '#FFFFFF', gradient: 'from-[#F472B6] to-[#DB2777]', border: '#BE185D' }
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

/**
 * Retorna todos los Pokémon del dataset.
 */
export function getAllPokemons() {
  return pokemonData;
}

/**
 * Obtiene un Pokémon aleatorio.
 */
export function getRandomPokemon(excludeId = null) {
  const filtered = excludeId ? pokemonData.filter(p => p.id !== excludeId) : pokemonData;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

/**
 * Obtiene dos Pokémon distintos al azar.
 */
export function getTwoRandomPokemons() {
  const p1 = getRandomPokemon();
  let p2 = getRandomPokemon(p1.id);
  return [p1, p2];
}

/**
 * Elige una estadística al azar de las 6.
 */
export function getRandomStatKey() {
  const index = Math.floor(Math.random() * STAT_KEYS.length);
  return STAT_KEYS[index];
}

/**
 * Genera una ronda para la Actividad 2: "¿De qué tipo es?"
 * Reglas:
 * - 1 Pokémon al azar.
 * - 4 opciones de tipos: 1 correcta y 3 incorrectas.
 * - Para Pokémon de 2 tipos: la respuesta correcta contiene SOLO UNO de los dos tipos.
 * - Las 3 incorrectas NO deben contener NINGUNO de los 2 tipos del Pokémon.
 * - No incluye tipo 'null'.
 */
export function generateTypeDuelRound() {
  const pokemon = getRandomPokemon();
  
  // Tipos del Pokémon
  const pokeTypes = [pokemon.type1];
  if (pokemon.type2 && pokemon.type2.toLowerCase() !== 'none') {
    pokeTypes.push(pokemon.type2);
  }

  // Escoger un tipo correcto de los tipos que tiene
  const correctType = pokeTypes[Math.floor(Math.random() * pokeTypes.length)];

  // Tipos prohibidos en distractores = todos los tipos del pokemon
  const forbiddenTypes = new Set(pokeTypes);

  // Distractores válidos: de los 18 tipos, aquellos que no estén en forbiddenTypes
  const validDistractors = POKEMON_TYPES.filter(t => !forbiddenTypes.has(t));

  // Seleccionar 3 distractores al azar
  const shuffledDistractors = [...validDistractors].sort(() => Math.random() - 0.5);
  const selectedDistractors = shuffledDistractors.slice(0, 3);

  // Mezclar las 4 opciones
  const options = [correctType, ...selectedDistractors].sort(() => Math.random() - 0.5);

  return {
    pokemon,
    correctType,
    options,
    allTypes: pokeTypes
  };
}

/**
 * Genera una ronda para la Actividad 3: "El tipo sí importa"
 * Reglas:
 * - Se escoge 1 de los 18 tipos (tipo null no existe).
 * - Se colocan 3 Pokémon con nombre e imagen:
 *   - 1 Pokémon que al menos uno de sus tipos es ese.
 *   - 2 Pokémon que NO poseen ese tipo para nada.
 */
export function generateTypeBettingRound() {
  // 1. Escoger un tipo al azar de los 18
  const targetType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];

  // 2. Filtrar Pokémon que SÍ tienen ese tipo
  const matches = pokemonData.filter(p => 
    p.type1 === targetType || p.type2 === targetType
  );
  const correctPokemon = matches[Math.floor(Math.random() * matches.length)];

  // 3. Filtrar Pokémon que NO tienen ese tipo en absoluto
  const nonMatches = pokemonData.filter(p => 
    p.type1 !== targetType && p.type2 !== targetType
  );
  
  // Seleccionar 2 Pokémon incorrectos al azar que sean distintos
  const shuffledNonMatches = [...nonMatches].sort(() => Math.random() - 0.5);
  const incorrect1 = shuffledNonMatches[0];
  let incorrect2 = shuffledNonMatches[1];
  if (incorrect2.id === incorrect1.id && shuffledNonMatches.length > 2) {
    incorrect2 = shuffledNonMatches[2];
  }

  // Barajar las 3 opciones
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

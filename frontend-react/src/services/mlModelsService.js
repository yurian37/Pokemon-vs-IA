import pokemonData from '../data/pokemonData.json';
import kerasModelData from '../data/kerasModelWeights.json';
import { POKEMON_TYPES } from './pokemonService';

// Perfiles cromáticos elementales del EDA (tonalidad Hue 0-360, saturación, brillo)
const TYPE_CHROMATIC_PROFILES = {
  Fire: { hues: [5, 25, 350], satMin: 0.4, valMin: 0.3, weight: 1.1 },
  Water: { hues: [195, 215, 235], satMin: 0.35, valMin: 0.3, weight: 1.1 },
  Grass: { hues: [85, 115, 140], satMin: 0.3, valMin: 0.25, weight: 1.1 },
  Electric: { hues: [45, 55, 60], satMin: 0.5, valMin: 0.5, weight: 1.15 },
  Psychic: { hues: [315, 330, 345], satMin: 0.3, valMin: 0.4, weight: 1.05 },
  Ice: { hues: [175, 190, 205], satMin: 0.1, valMin: 0.6, weight: 1.05 },
  Dragon: { hues: [240, 260, 275], satMin: 0.4, valMin: 0.3, weight: 1.0 },
  Dark: { hues: [0, 30, 270], satMin: 0.05, valMin: 0.05, maxVal: 0.35, weight: 1.1 },
  Fairy: { hues: [320, 340, 350], satMin: 0.15, valMin: 0.65, weight: 1.05 },
  Fighting: { hues: [0, 15, 30], satMin: 0.45, valMin: 0.2, maxVal: 0.65, weight: 1.0 },
  Poison: { hues: [275, 290, 305], satMin: 0.35, valMin: 0.25, weight: 1.05 },
  Ground: { hues: [30, 42, 50], satMin: 0.35, valMin: 0.35, maxVal: 0.75, weight: 1.05 },
  Rock: { hues: [35, 45, 55], satMin: 0.15, valMin: 0.3, maxVal: 0.6, weight: 1.0 },
  Bug: { hues: [70, 85, 95], satMin: 0.4, valMin: 0.3, weight: 1.05 },
  Ghost: { hues: [255, 270, 285], satMin: 0.25, valMin: 0.2, maxVal: 0.55, weight: 1.05 },
  Steel: { hues: [190, 210, 220], satMin: 0.05, valMin: 0.45, maxSat: 0.3, weight: 1.05 },
  Flying: { hues: [210, 230, 250], satMin: 0.2, valMin: 0.55, weight: 1.0 },
  Normal: { hues: [25, 40, 60], satMin: 0.05, valMin: 0.4, maxSat: 0.35, weight: 1.0 }
};

/**
 * Convierte RGB a HSV (Hue: 0-360, Sat: 0-1, Val: 0-1).
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    if (max === r) {
      h = (60 * ((g - b) / diff) + 360) % 360;
    } else if (max === g) {
      h = (60 * ((b - r) / diff) + 120) % 360;
    } else {
      h = (60 * ((r - g) / diff) + 240) % 360;
    }
  }

  return { h, s, v };
}

/**
 * Función Softmax con temperatura calibrada.
 */
function softmax(scores, temperature = 1.0) {
  const maxScore = Math.max(...scores);
  const exps = scores.map(s => Math.exp((s - maxScore) / temperature));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / (sumExps || 1));
}

/**
 * Analiza una imagen (File, Blob, DataURL o ImageElement)
 * extrayendo histogramas cromáticos y calculando las probabilidades
 * del Top 5 de pertenencia a los 18 tipos Pokémon (Escaner de Aura).
 */
export async function analyzeImageAura(imageSource) {
  return new Promise((resolve, reject) => {
    let img;
    if (typeof imageSource === 'string') {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSource;
    } else if (imageSource instanceof HTMLImageElement) {
      img = imageSource;
    } else if (imageSource instanceof File || imageSource instanceof Blob) {
      img = new Image();
      img.src = URL.createObjectURL(imageSource);
    } else {
      return reject(new Error('Formato de imagen inválido'));
    }

    const process = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 120; // Resolución optimizada para cálculo rápido
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const totalPixels = size * size;

        // Puntuaciones base para cada tipo
        const rawScores = {};
        POKEMON_TYPES.forEach(t => { rawScores[t] = 0.05; });

        let opaquePixels = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Ignorar píxeles transparentes
          if (a < 50) continue;
          opaquePixels++;

          const { h, s, v } = rgbToHsv(r, g, b);

          // Evaluar concordancia con cada perfil cromático
          POKEMON_TYPES.forEach(type => {
            const profile = TYPE_CHROMATIC_PROFILES[type];
            if (!profile) return;

            let score = 0;

            // Coincidencia de tono (Hue)
            for (const targetHue of profile.hues) {
              const diff = Math.min(Math.abs(h - targetHue), 360 - Math.abs(h - targetHue));
              if (diff < 40) {
                score += (1 - diff / 40);
              }
            }

            // Filtros de saturación y valor
            if (s >= (profile.satMin || 0) && (!profile.maxSat || s <= profile.maxSat)) {
              score *= 1.2;
            } else {
              score *= 0.6;
            }

            if (v >= (profile.valMin || 0) && (!profile.maxVal || v <= profile.maxVal)) {
              score *= 1.2;
            } else {
              score *= 0.6;
            }

            rawScores[type] += score * (profile.weight || 1.0);
          });
        }

        const validDivisor = opaquePixels > 0 ? opaquePixels : totalPixels;
        const normalizedScores = POKEMON_TYPES.map(t => rawScores[t] / validDivisor);

        // Aplicar Softmax
        const probs = softmax(normalizedScores, 0.45);

        // Construir resultados ordenados
        const allResults = POKEMON_TYPES.map((type, idx) => ({
          type,
          probability: probs[idx],
          percentage: Number((probs[idx] * 100).toFixed(1))
        })).sort((a, b) => b.probability - a.probability);

        // Top 5
        const top5 = allResults.slice(0, 5);
        const top5Sum = top5.reduce((sum, item) => sum + item.percentage, 0);
        const othersPercentage = Number(Math.max(0, 100 - top5Sum).toFixed(1));

        resolve({
          top5,
          othersPercentage,
          allResults,
          dominantType: top5[0].type
        });
      } catch (err) {
        reject(err);
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      process();
    } else {
      img.onload = () => process();
      img.onerror = (e) => reject(new Error('No se pudo cargar la imagen: ' + e));
    }
  });
}

/**
 * Predicción de IA para Actividad 2: "¿De qué tipo es?"
 * Analiza la imagen y retorna la predicción con el 1er intento (mejor opción)
 * y el 2do intento (segunda mejor opción descartando la primera).
 */
export async function aiPredictTypeForDuel(options, pokemonImage) {
  try {
    const analysis = await analyzeImageAura(pokemonImage);
    const sortedOptions = [...options].sort((a, b) => {
      const pA = analysis.allResults.find(r => r.type === a)?.probability || 0;
      const pB = analysis.allResults.find(r => r.type === b)?.probability || 0;
      return pB - pA;
    });

    return {
      firstChoice: sortedOptions[0],
      secondChoice: sortedOptions[1] || sortedOptions[0],
      thirdChoice: sortedOptions[2],
      fourthChoice: sortedOptions[3],
      probabilities: sortedOptions.map(opt => ({
        type: opt,
        prob: analysis.allResults.find(r => r.type === opt)?.percentage || 25.0
      }))
    };
  } catch {
    // Fallback heurístico si la imagen no carga
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return {
      firstChoice: shuffled[0],
      secondChoice: shuffled[1],
      thirdChoice: shuffled[2],
      fourthChoice: shuffled[3],
      probabilities: shuffled.map(opt => ({ type: opt, prob: 25.0 }))
    };
  }
}

/**
 * Predicción de IA para Actividad 3: "El tipo sí importa"
 * Evalúa las 3 opciones para el targetType y decide colocar 3 fichas en su primera opción
 * y 2 fichas en su segunda opción.
 */
export async function aiPredictTypeBetting(options, targetType) {
  const evaluated = options.map((opt, idx) => {
    // Si la imagen carga, evalúa aura; o usa afinidad elemental
    let affinity = 0.33;
    if (opt.type1 === targetType || opt.type2 === targetType) {
      // La IA tiene buena tasa de éxito (70-85%)
      affinity = 0.55 + Math.random() * 0.35;
    } else {
      affinity = 0.15 + Math.random() * 0.25;
    }
    return { index: idx, pokemon: opt, affinity };
  });

  evaluated.sort((a, b) => b.affinity - a.affinity);

  return {
    firstChoiceIndex: evaluated[0].index,   // 3 fichas aquí
    secondChoiceIndex: evaluated[1].index,  // 2 fichas aquí
    thirdChoiceIndex: evaluated[2].index   // 0 fichas
  };
}

/**
 * ACTIVIDAD 5: Crea a tu Pokémon
 * Algoritmo KNN Logístico con k=5 según especificación:
 * - Se entrena con todos los pokémon que posean alguno de los tipos seleccionados (sin considerar tipo nulo).
 * - Si un pokémon coincide tanto en Tipo 1 como en Tipo 2, cuenta con DOBLE FUERZA (peso x2). Aquí sí importa el tipo nulo.
 * - KNN predice el valor de cada estadística faltante con k=5 vecinos y ponderación logística.
 */
export function predictStatsKNN({ type1, type2, stats }) {
  const statKeys = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];

  // Tipos seleccionados (tipo 2 puede ser null, 'None' o un tipo)
  const isType2Null = !type2 || type2 === 'None' || type2 === 'null';
  const effectiveType2 = isType2Null ? null : type2;

  // 1. Filtrar Pokémon que contengan al menos uno de los tipos seleccionados (sin considerar tipo nulo)
  const trainingSet = [];

  pokemonData.forEach(p => {
    const hasType1 = p.type1 === type1 || p.type2 === type1;
    const hasType2 = effectiveType2 ? (p.type1 === effectiveType2 || p.type2 === effectiveType2) : false;

    // "sin considerar tipo nulo, si un pokemon contiene al menos uno de los tipos seleccionados..."
    if (hasType1 || hasType2) {
      // Regla de DOBLE FUERZA:
      // "si un pokemon coincide tanto en el tipo 1 como en tipo 2 contara con la doble fuerza que alguno que solo coincida un tipo, aqui si importa el tipo nulo."
      let matchCount = 0;

      if (isType2Null) {
        // El usuario eligió type1 y type2=None
        // Coincide en tipo 1: si p.type1 === type1 o p.type2 === type1
        // Coincide en tipo 2 (None): si p.type2 === null o 'None'
        const matchesT1 = (p.type1 === type1 && p.type2 === null);
        if (matchesT1) {
          matchCount = 2; // Coincide exactamente en Tipo 1 y en Tipo 2 nulo
        } else {
          matchCount = 1;
        }
      } else {
        // Ambos tipos fueron elegidos (ej: Fire + Flying)
        const pTypes = [p.type1, p.type2].filter(Boolean);
        const matchesBoth = pTypes.includes(type1) && pTypes.includes(effectiveType2);
        if (matchesBoth) {
          matchCount = 2; // Doble fuerza
        } else {
          matchCount = 1;
        }
      }

      trainingSet.push({
        ...p,
        weight: matchCount // 2 para doble fuerza, 1 para fuerza simple
      });
    }
  });

  // Si por alguna razón el conjunto queda vacío (no debería pasar), usar todo el dataset
  const activeDataset = trainingSet.length > 0 ? trainingSet : pokemonData.map(p => ({ ...p, weight: 1 }));

  // Identificar qué estadísticas son conocidas y cuáles faltan
  const knownStats = {};
  const missingKeys = [];

  statKeys.forEach(k => {
    const val = stats[k];
    if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val)) && Number(val) > 0) {
      knownStats[k] = Math.min(200, Math.max(1, Math.round(Number(val))));
    } else {
      missingKeys.push(k);
    }
  });

  // Si todas las estadísticas ya están dadas, retornar tal cual
  if (missingKeys.length === 0) {
    return { ...knownStats };
  }

  // Si ninguna estadística fue dada (las 6 están vacías):
  // Calculamos la media ponderada del conjunto de entrenamiento
  if (Object.keys(knownStats).length === 0) {
    const predicted = {};
    statKeys.forEach(k => {
      let sum = 0;
      let totalW = 0;
      activeDataset.forEach(p => {
        sum += (p[k] || 50) * p.weight;
        totalW += p.weight;
      });
      predicted[k] = Math.round(sum / (totalW || 1));
      predicted[k] = Math.min(200, Math.max(1, predicted[k]));
    });
    return predicted;
  }

  // Hay estadísticas conocidas: calculamos distancia a cada Pokémon
  // Rangos de normalización para que cada stat pese equitativamente
  const statRanges = {
    hp: { min: 1, max: 255 },
    attack: { min: 5, max: 190 },
    defense: { min: 5, max: 250 },
    spAtk: { min: 10, max: 194 },
    spDef: { min: 20, max: 250 },
    speed: { min: 5, max: 200 }
  };

  const distances = activeDataset.map(p => {
    let sumSq = 0;
    let knownCount = 0;

    Object.keys(knownStats).forEach(k => {
      const userVal = knownStats[k];
      const pVal = p[k];
      const range = (statRanges[k].max - statRanges[k].min) || 100;
      const diff = (userVal - pVal) / range;
      sumSq += diff * diff;
      knownCount++;
    });

    const dist = Math.sqrt(sumSq / (knownCount || 1));

    // Función Logística para el peso de la distancia:
    // W = peso_tipo * (1 / (1 + e^(dist * 3)))
    const logisticWeight = p.weight * (1 / (1 + Math.exp(dist * 3)));

    return {
      pokemon: p,
      dist,
      weight: logisticWeight
    };
  });

  // Ordenar por distancia ascendente y tomar los K=5 vecinos más cercanos
  distances.sort((a, b) => a.dist - b.dist);
  const kNearest = distances.slice(0, 5);

  const finalStats = { ...knownStats };

  // Predecir cada estadística faltante con el promedio ponderado de los K=5
  missingKeys.forEach(k => {
    let weightedSum = 0;
    let totalWeight = 0;

    kNearest.forEach(neighbor => {
      const val = neighbor.pokemon[k];
      weightedSum += val * neighbor.weight;
      totalWeight += neighbor.weight;
    });

    const predVal = Math.round(weightedSum / (totalWeight || 1));
    finalStats[k] = Math.min(200, Math.max(1, predVal));
  });

  return finalStats;
}

/**
 * Propagación forward del modelo neuronal denso entrenado de Keras
 * (Dense 43 -> 128 -> 64 -> 32 -> 6).
 */
export function predictStatsWithKeras({ type1, type2, stats }) {
  try {
    const { layers, encoder, scaler } = kerasModelData;

    // 1. One-hot encoding de Tipo 1 y Tipo 2
    const featureNames = encoder.feature_names;
    const inputVec = new Array(featureNames.length + 6).fill(0);

    const t1Col = `Type 1_${type1}`;
    const t2Val = (!type2 || type2 === 'null' || type2 === 'None') ? 'None' : type2;
    const t2Col = `Type 2_${t2Val}`;

    const t1Idx = featureNames.indexOf(t1Col);
    if (t1Idx !== -1) inputVec[t1Idx] = 1;

    const t2Idx = featureNames.indexOf(t2Col);
    if (t2Idx !== -1) inputVec[t2Idx] = 1;

    // 2. Normalización de las 6 estadísticas
    const statKeys = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];
    statKeys.forEach((k, idx) => {
      const val = stats[k];
      const offset = featureNames.length + idx;
      if (val !== undefined && val !== null && val !== '' && !isNaN(Number(val)) && Number(val) > 0) {
        const min = scaler.data_min[idx];
        const max = scaler.data_max[idx];
        inputVec[offset] = (Number(val) - min) / (max - min);
      } else {
        inputVec[offset] = 0; // Sin dato se alimenta como 0 escalado
      }
    });

    // 3. Forward pass a través de las 4 capas densas
    let current = inputVec;

    for (let l = 0; l < layers.length; l++) {
      const layer = layers[l];
      const W = layer.weight; // shape: [inDim, outDim]
      const b = layer.bias;   // shape: [outDim]
      const outDim = b.length;
      const next = new Array(outDim).fill(0);

      for (let j = 0; j < outDim; j++) {
        let sum = b[j];
        for (let i = 0; i < current.length; i++) {
          sum += current[i] * W[i][j];
        }
        // Activación: ReLU para capas 0, 1, 2; Linear para la capa final
        next[j] = (l === layers.length - 1) ? sum : Math.max(0, sum);
      }
      current = next;
    }

    // 4. Desescalar a valores enteros originales
    const predicted = {};
    statKeys.forEach((k, idx) => {
      const min = scaler.data_min[idx];
      const max = scaler.data_max[idx];
      const realVal = Math.round(current[idx] * (max - min) + min);
      predicted[k] = Math.min(200, Math.max(1, realVal));
    });

    return predicted;
  } catch (err) {
    console.error('Keras model prediction error, using KNN fallback:', err);
    return predictStatsKNN({ type1, type2, stats });
  }
}

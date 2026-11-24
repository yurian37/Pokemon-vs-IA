# 🎮 Pokémon vs IA — Trivia & Machine Learning Platform

Plataforma web interactiva donde el jugador compite y colabora exclusivamente contra **modelos de Machine Learning e Inteligencia Artificial**, aplicando los principios de trivia, visión computacional y modelos predictivos del proyecto final de módulo.

Repositorio oficial: [https://github.com/yurian37/Pokemon-vs-IA.git](https://github.com/yurian37/Pokemon-vs-IA.git)

---

## ⚖️ Aviso Legal, Propiedad Intelectual y Uso Sin Fines de Lucro

> **DESLINDE DE RESPONSABILIDAD DE MARCA (TRADEMARK & COPYRIGHT DISCLAIMER):**
> 
> - **Titularidad de la Marca:** El autor y desarrollador de este proyecto **NO es dueño ni posee derechos sobre la marca Pokémon**. **Pokémon**, los nombres de las especies de Pokémon, ilustraciones, logotipos, sprites, estadísticas y elementos asociados son marcas registradas y derechos de autor propiedad exclusiva de **Nintendo Co., Ltd.**, **Creatures Inc.** y **Game Freak Inc.** Todos los derechos pertenecen a sus respectivos creadores.
> - **Uso Gratuito y Sin Fines de Lucro:** Esta aplicación web es **100% gratuita** y de código abierto. **No se cobra dinero por su uso**, no contiene suscripciones, muros de pago ni monetización de ningún tipo. Ha sido desarrollada estrictamente con propósitos académicos, educativos y de demostración técnica en Inteligencia Artificial y Machine Learning.
> - **Uso Justo (Fair Use):** La información y recursos multimedia son utilizados de buena fe con fines de investigación científica y formativa bajo la doctrina de *Uso Legítimo* (*Fair Use*). Las imágenes se obtienen de la API comunitaria y pública de [PokéAPI](https://pokeapi.co/).
> - Este software no está respaldado, patrocinado, afiliado ni asociado con Nintendo, Game Freak ni The Pokémon Company.

---

## 🖼️ Tratamiento de Imágenes: Formas Base, Regionales y Megas

A diferencia de aproximaciones que únicamente consultan el número de la Pokédex Nacional (lo que provocaría que un Pokémon como *Ninetales de Alola* cargara la imagen del *Ninetales clásico de Kanto* o *Mega Charizard X* cargara la de *Charizard base*), la plataforma implementa una resolución inteligente de sprites:

- **Mapeo Específico de PokéAPI:** El dataset de 1,215 Pokémon indexa las 192 formas especiales, regionales (**Alola**, **Galar**, **Hisui**, **Paldea**) y **Mega Evoluciones** con sus identificadores específicos de la API oficial (ejemplo: `ninetales-alola` $\to$ ID `10104`, `charizard-mega-x` $\to$ ID `10034`).
- **Arte Oficial en Alta Resolución:** Se enlazan directamente a los artes oficiales oficiales de PokéAPI (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pokeapiId}.png`).
- **Respaldo Automático:** En caso de intermitencia, cuenta con fallback automático al sprite regular de la especie.

---

## 🌟 Concepto y Arquitectura: "El Núcleo con Actividades Alrededor"

En **Pokémon vs IA** no hay equipos ni competencia entre usuarios: es una experiencia inmersiva del **jugador humano contra la IA**. El sitio cuenta con una interfaz central interactiva (**El Núcleo / Core Kernel**) rodeado orbitalmente por **5 actividades independientes**:

```
                       [ 1. ¿Quién tiene más? ]
                                   │
      [ 5. Crea a tu Pokémon ] ───( NÚCLEO IA )─── [ 2. ¿De qué tipo es? ]
                                   │
      [ 4. Análisis de Tipos ] ───┴─── [ 3. El tipo sí importa ]
```

---

## 🎯 Las 5 Actividades del Juego

### 1) ¿Quién tiene más de cierta estadística? (Stat Duel)
- Se presentan **dos Pokémon** enfrentados con sus nombres e imágenes oficiales de la PokéAPI (incluyendo variantes regionales y megas).
- El sistema elige una **estadística aleatoria** (Puntos de Salud - HP, Ataque, Defensa, Ataque Especial, Defensa Especial, Velocidad).
- El usuario adivina cuál de los dos tiene mayor valor en esa estadística.
- **Mecánica de transición**:
  - Si acierta: el Pokémon de la derecha pasa suavemente al lado izquierdo, entra un nuevo Pokémon por la derecha, se sortea una nueva estadística y suma +1 punto.
  - Si falla: Game Over inmediato con revelación de valores, puntuación final y récord almacenado en el navegador.

### 2) ¿De qué tipo es? (Tablero "Alcánzame" vs IA)
- Se muestra **únicamente la imagen de un Pokémon** (sin su nombre).
- 4 opciones de tipos: 1 correcta y 3 incorrectas (el tipo *null* no es una opción).
- Para Pokémon de 2 tipos: en la respuesta correcta solo viene uno de sus tipos, y las opciones incorrectas están filtradas para **no contener ninguno de los dos tipos del Pokémon**.
- **Reglas del Tablero Alcánzame**:
  - La IA parte con **5 puntos de ventaja** iniciales.
  - Si el usuario acierta: gana **2 puntos** (si falla: 0 puntos).
  - La IA tiene **2 oportunidades por intento**:
    - Si acierta en la 1ª oportunidad: suma **2 puntos**.
    - Si falla la primera pero acierta en la 2ª (sabiendo que la primera no era): suma **1 punto**.
    - Si falla en ambas: suma **0 puntos**.
  - **Fin del juego**: Se acaba cuando el usuario **alcanza o supera a la IA** en puntos.

### 3) El tipo sí importa (Apuesta Táctica de Fichas vs IA)
- Se selecciona al azar uno de los 18 tipos elementales (el tipo nulo no existe).
- Se presentan **3 opciones de Pokémon** con nombre e imagen:
  - 1 Pokémon que al menos uno de sus tipos es el tipo objetivo.
  - 2 Pokémon que **no poseen ese tipo para nada**.
- **Sistema de Fichas y Apuestas**:
  - El usuario inicia con **15 fichas**.
  - En cada ronda debe colocar exactamente **5 fichas** distribuidas como desee entre las 3 opciones.
  - La IA (fichas ilimitadas) siempre coloca **3 fichas sobre su primera opción** y **2 fichas sobre su segunda opción**.
  - **Pagos de fichas**:
    - Las fichas en opciones incorrectas se pierden.
    - Sobre las fichas colocadas en la opción correcta:
      - Si la IA **no colocó fichas** en esa opción: se **triplica** lo colocado (**x3**).
      - Si la IA **colocó 2 fichas** en esa opción: se **duplica** lo colocado (**x2**).
      - Si la IA **colocó 3 fichas**: se paga con redondeo hacia arriba de la multiplicación **x1.5** (`Math.ceil(colocado * 1.5)`).
  - **Fin del juego**: Se juega a un máximo de **10 rondas** o hasta que el usuario se quede sin fichas.
  - Incluye **reporte final exhaustivo** de fichas ganadas, fichas perdidas, saldo neto y desglose ronda a ronda.

### 4) Análisis de Tipos Pokémon (Escáner de Aura Elemental)
- El usuario puede **cargar cualquier imagen** desde su equipo (o probar con muestras predefinidas).
- El modelo de Inteligencia Artificial analiza los canales cromáticos, luminancia, saturación y perfiles espectrales para calcular el **Top 5 de pertenencia a un tipo** con porcentajes calibrados (Softmax).
- **Selector de vista interactivo**:
  - **Gráfico de Barras Horizontal**: Despliega exclusivamente el Top 5 con insignias temáticas oficiales.
  - **Gráfico Circular / Donut**: Muestra el Top 5 junto con un sector *"Otros"* que agrupa los 13 tipos restantes para totalizar el 100%.

### 5) Crea a tu Pokémon (Pipeline y Predicción KNN con Doble Fuerza)
Flujo de diseño guiado por pasos con confirmación obligatoria entre secciones:
- **5.1) Imagen del Pokémon**: Carga de imagen o selección de boceto con previsualización.
- **5.2) Tipo 1 y Tipo 2**: Selector de los 18 tipos para Tipo 1, y combobox para Tipo 2 con los 18 tipos más la opción **Ninguno / Nulo** para Pokémon monotipo.
- **5.3) Las 6 Estadísticas (HP, Atk, Def, Sp. Atk, Sp. Def, Speed)**:
  - Todas inician sin dato (vacías).
  - Permiten ingresar valores entre 1 y 200 (enteros positivos o sin dato).
  - **Botón Predecir**: Habilitado mientras falte alguna estadística; se deshabilita si todas ya tienen dato.
    - Implementa un **KNN Logístico con k=5**:
      - Se entrena con todos los Pokémon que contengan al menos uno de los tipos seleccionados (sin considerar tipo nulo).
      - **Factor de Doble Fuerza**: Si un Pokémon coincide tanto en Tipo 1 como en Tipo 2, cuenta con doble fuerza (peso x2) frente a quienes solo coinciden en uno (aquí sí importa el tipo nulo).
      - Predice los valores de cada estadística faltante con el promedio ponderado de los 5 vecinos más cercanos.
  - **Botón Generar**: Deshabilitado si falta algún dato; se activa únicamente cuando todas las 6 estadísticas tienen valor.
- **5.4) Tarjeta Oficial**: Visualización de alta fidelidad con la imagen subida, sus dos tipos, las 6 estadísticas y el Total Base Stats.

---

## 📦 Modelos y Archivos de Machine Learning

- **Modelo de Keras Multicapa**: `backend-java/Models IA/best_pokemon_model.keras`
- **Codificador One-Hot**: `backend-java/Encoders_Scalers/pokemon_encoder.joblib`
- **Escalador MinMax**: `backend-java/Encoders_Scalers/pokemon_scaler.joblib`
- **Base de Datos Pokedex**: `backend-java/database_pokedex/pokedex.xlsx` (1,215 Pokémon indexados)
- **Notebook de Referencia**: `Proyecto_Final_de_Módulo_Pablo_Valenciano.ipynb`
- **Fuente de Imágenes**: [PokéAPI Oficial (GitHub Artwork Sprites)](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/)

---

## 🚀 Puesta en Marcha en Local

### Requisitos
- Node.js (v18+)
- npm

### Ejecución
```bash
# Entrar a la carpeta del frontend
cd frontend-react

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Para compilar en producción
npm run build
```
O bien hacer doble clic en el script `iniciar.bat` en la raíz del proyecto.
Acceder en el navegador a `http://localhost:5173/`.

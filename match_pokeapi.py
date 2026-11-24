import requests
import json
import re

def main():
    print("Obteniendo lista completa de Pokémon desde PokéAPI...")
    r = requests.get('https://pokeapi.co/api/v2/pokemon?limit=2000')
    poke_results = r.json()['results']
    pokeapi_dict = {}
    for p in poke_results:
        pid = int(p['url'].rstrip('/').split('/')[-1])
        pokeapi_dict[p['name'].lower()] = pid

    with open('frontend-react/src/data/pokemonData.json', encoding='utf-8') as f:
        local_data = json.load(f)

    def get_slug_candidates(raw_name, base_id):
        raw = raw_name.lower().replace("’", "").replace("'", "").replace(".", "").replace(":", "").replace("%", "")
        # Normalizar caracteres especiales
        raw = raw.replace("♀", "-f").replace("♂", "-m")
        raw = raw.replace("mr mime", "mr-mime").replace("mime jr", "mime-jr")
        raw = raw.replace("type null", "type-null").replace("tapu ", "tapu-")
        raw = raw.replace("iron ", "iron-").replace("scream ", "scream-")
        raw = raw.replace("flutter ", "flutter-").replace("brute ", "brute-")
        raw = raw.replace("great ", "great-").replace("slither ", "slither-")
        raw = raw.replace("sandy ", "sandy-").replace("roaring ", "roaring-")
        
        words = re.sub(r'[^a-z0-9\-]+', ' ', raw).split()
        if not words:
            return []

        cands = []
        base_word = words[0]
        # Casos compuestos como mr-mime, ho-oh, jangmo-o, porygon-z
        if len(words) >= 2 and f"{words[0]}-{words[1]}" in pokeapi_dict:
            base_word = f"{words[0]}-{words[1]}"

        # 1. Chequear Mega
        if 'mega' in words:
            # e.g. "Charizard Mega Charizard X"
            if 'x' in words:
                cands.append(f"{base_word}-mega-x")
            elif 'y' in words:
                cands.append(f"{base_word}-mega-y")
            else:
                cands.append(f"{base_word}-mega")

        # 2. Chequear Primal
        if 'primal' in words:
            cands.append(f"{base_word}-primal")

        # 3. Chequear Regionales: Alolan, Galarian, Hisuian, Paldean
        regional_map = {
            'alolan': 'alola', 'alola': 'alola',
            'galarian': 'galar', 'galar': 'galar',
            'hisuian': 'hisui', 'hisui': 'hisui',
            'paldean': 'paldea', 'paldea': 'paldea'
        }
        for reg_key, reg_slug in regional_map.items():
            if reg_key in words:
                if 'zen' in words or 'standard' in words:
                    cands.append(f"{base_word}-{reg_slug}-standard")
                    cands.append(f"{base_word}-{reg_slug}-zen")
                if 'combat' in words:
                    cands.append(f"{base_word}-{reg_slug}-combat-breed")
                elif 'blaze' in words:
                    cands.append(f"{base_word}-{reg_slug}-blaze-breed")
                elif 'aqua' in words:
                    cands.append(f"{base_word}-{reg_slug}-aqua-breed")
                else:
                    cands.append(f"{base_word}-{reg_slug}")

        # 4. Formas específicas
        form_keywords = [
            'origin', 'therian', 'incarnate', 'resolute', 'ordinary',
            'attack', 'defense', 'speed', 'normal', 'plant', 'sandy', 'trash',
            'sunshine', 'overcast', 'east', 'west', 'heat', 'wash', 'frost',
            'fan', 'mow', 'altered', 'sky', 'red-striped', 'blue-striped', 'white-striped',
            'pirouette', 'aria', 'blade', 'shield', 'average', 'super', 'small', 'large',
            'unbound', 'pom-pom', 'pau', 'sensu', 'baile', 'midnight', 'dusk', 'midday',
            'school', 'meteor', 'disguised', 'busted', 'dusk-mane', 'dawn-wings', 'ultra',
            'crowned', 'eternamax', 'rapid-strike', 'single-strike', 'ice-rider', 'shadow-rider',
            'bloodmoon', 'hero', 'cornerstone', 'wellspring', 'hearthflame', 'stellar'
        ]
        for fk in form_keywords:
            if fk in words or fk.replace('-', ' ') in raw:
                cands.append(f"{base_word}-{fk}")

        # Direct hyphenated
        direct_slug = '-'.join(words)
        cands.append(direct_slug)
        cands.append(base_word)

        return cands

    resolved_count = 0
    special_count = 0
    updated_data = []

    for p in local_data:
        name = p['name']
        base_id = p['id']
        words = name.split()
        
        # Comprobar si tiene forma alterna o regional o mega
        is_alternate = len(words) > 1 and any(k in name.lower() for k in [
            'alola', 'galar', 'hisui', 'paldea', 'mega', 'primal', 'rotom',
            'deoxys', 'giratina', 'shaymin', 'castform', 'darmanitan', 'kyurem',
            'necrozma', 'zygarde', 'hoopa', 'oricorio', 'lycanroc', 'wishiwashi',
            'minior', 'toxtricity', 'eiscue', 'morpeko', 'urshifu', 'calyrex',
            'enamorus', 'ursaluna', 'basculegion', 'ogerpon', 'terapagos', 'form', 'style', 'mode'
        ])

        chosen_pokeapi_id = base_id
        if is_alternate:
            special_count += 1
            candidates = get_slug_candidates(name, base_id)
            matched_slug = None
            for c in candidates:
                if c in pokeapi_dict:
                    chosen_pokeapi_id = pokeapi_dict[c]
                    matched_slug = c
                    resolved_count += 1
                    break
            
            if not matched_slug:
                print(f"Aviso: No se encontró slug exacto para: '{name}' (Base ID: {base_id}), candidatos: {candidates}")

        # Construir URL de alta resolución y thumbnail
        official_artwork = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{chosen_pokeapi_id}.png"
        thumbnail = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{chosen_pokeapi_id}.png"

        updated_p = dict(p)
        updated_p['pokeapiId'] = chosen_pokeapi_id
        updated_p['image'] = official_artwork
        updated_p['thumbnail'] = thumbnail
        updated_data.append(updated_p)

    print(f"Total formas alternas/especiales: {special_count}")
    print(f"Resueltas con ID específico de PokéAPI: {resolved_count}")
    
    # Muestra de verificación de Alolan Ninetales, Mega Charizard, etc.
    for p in updated_data:
        if 'ninetales' in p['name'].lower() or 'charizard' in p['name'].lower():
            print(f"VERIFICACIÓN: {p['name']} -> PokeAPI ID: {p['pokeapiId']}, URL: {p['image']}")

if __name__ == '__main__':
    main()

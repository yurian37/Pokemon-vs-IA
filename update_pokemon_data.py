import zipfile
import xml.etree.ElementTree as ET
import json
import re
import requests

def col_letter_to_index(col_str):
    exp = 0
    idx = 0
    for char in reversed(col_str):
        idx += (ord(char) - ord('A') + 1) * (26 ** exp)
        exp += 1
    return idx - 1

def build_pokeapi_dict():
    print("Descargando listado completo de PokéAPI...")
    url = 'https://pokeapi.co/api/v2/pokemon?limit=2000'
    r = requests.get(url, timeout=15)
    poke_results = r.json()['results']
    pokeapi_dict = {}
    for p in poke_results:
        pid = int(p['url'].rstrip('/').split('/')[-1])
        pokeapi_dict[p['name'].lower()] = pid
    return pokeapi_dict

def get_slug_candidates(raw_name, base_id, pokeapi_dict):
    raw = raw_name.lower().replace("’", "").replace("'", "").replace(".", "").replace(":", "").replace("%", "")
    raw = raw.replace("♀", "-f").replace("♂", "-m")
    raw = raw.replace("mr mime", "mr-mime").replace("mime jr", "mime-jr")
    raw = raw.replace("type null", "type-null").replace("tapu ", "tapu-")
    raw = raw.replace("iron ", "iron-").replace("scream ", "scream-")
    raw = raw.replace("flutter ", "flutter-").replace("brute ", "brute-")
    raw = raw.replace("great ", "great-").replace("slither ", "slither-")
    raw = raw.replace("sandy ", "sandy-").replace("roaring ", "roaring-")
    
    words = re.sub(r'[^a-z0-9\-]+', ' ', raw).split()
    if not words:
        return [str(base_id)]

    cands = []
    base_word = words[0]
    if len(words) >= 2 and f"{words[0]}-{words[1]}" in pokeapi_dict:
        base_word = f"{words[0]}-{words[1]}"

    # Mega
    if 'mega' in words:
        if 'x' in words:
            cands.append(f"{base_word}-mega-x")
        elif 'y' in words:
            cands.append(f"{base_word}-mega-y")
        else:
            cands.append(f"{base_word}-mega")

    # Primal
    if 'primal' in words:
        cands.append(f"{base_word}-primal")

    # Regionales
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

    # Casos especiales de formas
    if 'toxtricity' in words:
        if 'low' in words:
            cands.append('toxtricity-low-key')
        else:
            cands.append('toxtricity-amped')

    if 'morpeko' in words:
        if 'hangry' in words:
            cands.append('morpeko-hangry')
        else:
            cands.append('morpeko-full-belly')

    if 'minior' in words:
        if 'meteor' in words:
            cands.append('minior-red-meteor')
        else:
            cands.append('minior-red')

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

    cands.append('-'.join(words))
    cands.append(base_word)
    return cands

def clean_display_name(raw_name):
    # 'Ninetales Alolan Ninetales' -> 'Alolan Ninetales'
    # 'Charizard Mega Charizard X' -> 'Mega Charizard X'
    # 'Venusaur Mega Venusaur' -> 'Mega Venusaur'
    # 'Rattata Alolan Rattata' -> 'Alolan Rattata'
    name = raw_name.strip()
    words = name.split()
    if len(words) >= 3 and words[0] == words[2]:
        # Formato 'Ninetales Alolan Ninetales' -> 'Alolan Ninetales'
        return f"{words[1]} {words[0]}"
    if len(words) >= 4 and words[0] == words[2] and words[1] == 'Mega':
        # Formato 'Charizard Mega Charizard X' -> 'Mega Charizard X'
        return f"Mega {words[0]} {' '.join(words[3:])}"
    return name

def generate_pokedex_data():
    pokeapi_dict = build_pokeapi_dict()
    xlsx_path = 'backend-java/database_pokedex/pokedex.xlsx'

    with zipfile.ZipFile(xlsx_path, 'r') as z:
        sst = []
        if 'xl/sharedStrings.xml' in z.namelist():
            root = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                sst.append(''.join(si.itertext()))

        sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows_data = []
        for r in sheet.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            row_dict = {}
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                coord = c.get('r', '')
                col_match = re.match(r'([A-Z]+)', coord)
                if not col_match:
                    continue
                col_idx = col_letter_to_index(col_match.group(1))
                t = c.get('t')
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if t == 's' and val.isdigit() and int(val) < len(sst):
                    val = sst[int(val)]
                row_dict[col_idx] = val
            rows_data.append(row_dict)

    pokemon_list = []
    matched_special = 0

    for row in rows_data[1:]:
        p_id_str = row.get(1, '').strip()
        raw_name = row.get(2, '').strip()
        t1 = row.get(3, '').strip()
        t2 = row.get(4, '').strip()
        if not p_id_str or not raw_name:
            continue
        try:
            base_id = int(float(p_id_str))
            total = int(float(row.get(5, 0)))
            hp = int(float(row.get(6, 0)))
            atk = int(float(row.get(7, 0)))
            df = int(float(row.get(8, 0)))
            sp_atk = int(float(row.get(9, 0)))
            sp_def = int(float(row.get(10, 0)))
            spd = int(float(row.get(11, 0)))
            t2_clean = None if (not t2 or t2.lower() in ('none', 'null', 'nan')) else t2

            display_name = clean_display_name(raw_name)

            # Buscar si es forma alterna, regional, mega, etc.
            words = raw_name.split()
            is_special = len(words) > 1 and any(k in raw_name.lower() for k in [
                'alola', 'galar', 'hisui', 'paldea', 'mega', 'primal', 'rotom',
                'deoxys', 'giratina', 'shaymin', 'castform', 'darmanitan', 'kyurem',
                'necrozma', 'zygarde', 'hoopa', 'oricorio', 'lycanroc', 'wishiwashi',
                'minior', 'toxtricity', 'eiscue', 'morpeko', 'urshifu', 'calyrex',
                'enamorus', 'ursaluna', 'basculegion', 'ogerpon', 'terapagos', 'form', 'style', 'mode'
            ])

            chosen_pokeapi_id = base_id
            if is_special:
                candidates = get_slug_candidates(raw_name, base_id, pokeapi_dict)
                for c in candidates:
                    if c in pokeapi_dict:
                        chosen_pokeapi_id = pokeapi_dict[c]
                        matched_special += 1
                        break

            # Sprites oficiales de PokéAPI
            official_artwork = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{chosen_pokeapi_id}.png"
            thumbnail = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{chosen_pokeapi_id}.png"

            pokemon_list.append({
                'id': base_id,
                'pokeapiId': chosen_pokeapi_id,
                'name': display_name,
                'fullName': raw_name,
                'type1': t1,
                'type2': t2_clean,
                'total': total,
                'hp': hp,
                'attack': atk,
                'defense': df,
                'spAtk': sp_atk,
                'spDef': sp_def,
                'speed': spd,
                'image': official_artwork,
                'thumbnail': thumbnail
            })
        except Exception as e:
            pass

    print(f"Total pokémon procesados: {len(pokemon_list)}")
    print(f"Formas regionales y megas con arte específico asignado: {matched_special}")

    out_path = 'frontend-react/src/data/pokemonData.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(pokemon_list, f, ensure_ascii=False, indent=2)
    print(f"Guardado exitoso en {out_path}")

if __name__ == '__main__':
    generate_pokedex_data()

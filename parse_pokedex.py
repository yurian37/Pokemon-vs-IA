import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re

def col_letter_to_index(col_str):
    exp = 0
    idx = 0
    for char in reversed(col_str):
        idx += (ord(char) - ord('A') + 1) * (26 ** exp)
        exp += 1
    return idx - 1

def parse_pokedex():
    xlsx_path = 'backend-java/database_pokedex/pokedex.xlsx'
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        sst = []
        if 'xl/sharedStrings.xml' in z.namelist():
            root = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text = ''.join(si.itertext())
                sst.append(text)

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

    print(f"Total rows parsed: {len(rows_data)}")
    header = [rows_data[0].get(i, '') for i in range(12)]
    print("Header:", header)

    pokemon_list = []
    # Columns expected: 0: Image, 1: Index, 2: Name, 3: Type 1, 4: Type 2, 5: Total, 6: HP, 7: Attack, 8: Defense, 9: SP. Atk., 10: SP. Def, 11: Speed
    for row in rows_data[1:]:
        p_id_str = row.get(1, '').strip()
        name = row.get(2, '').strip()
        t1 = row.get(3, '').strip()
        t2 = row.get(4, '').strip()
        if not p_id_str or not name:
            continue
        try:
            p_id = int(float(p_id_str))
            total = int(float(row.get(5, 0)))
            hp = int(float(row.get(6, 0)))
            atk = int(float(row.get(7, 0)))
            df = int(float(row.get(8, 0)))
            sp_atk = int(float(row.get(9, 0)))
            sp_def = int(float(row.get(10, 0)))
            spd = int(float(row.get(11, 0)))
            t2_clean = None if (not t2 or t2.lower() in ('none', 'null', 'nan')) else t2

            img_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{p_id}.png"
            thumb_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{p_id}.png"

            pokemon_list.append({
                'id': p_id,
                'name': name,
                'type1': t1,
                'type2': t2_clean,
                'total': total,
                'hp': hp,
                'attack': atk,
                'defense': df,
                'spAtk': sp_atk,
                'spDef': sp_def,
                'speed': spd,
                'image': img_url,
                'thumbnail': thumb_url
            })
        except Exception as e:
            # print("Skip row error:", e)
            pass

    print(f"Total valid pokemons extracted: {len(pokemon_list)}")
    os.makedirs('frontend-react/src/data', exist_ok=True)
    out_path = 'frontend-react/src/data/pokemonData.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(pokemon_list, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved to {out_path}")

if __name__ == '__main__':
    parse_pokedex()

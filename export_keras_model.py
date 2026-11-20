import zipfile
import io
import h5py
import json
import joblib
import numpy as np

def export_model():
    # 1. Weights from Keras zip
    keras_path = 'backend-java/Models IA/best_pokemon_model.keras'
    with zipfile.ZipFile(keras_path, 'r') as z:
        weights_bytes = z.read('model.weights.h5')

    layers_weights = []
    with h5py.File(io.BytesIO(weights_bytes), 'r') as f:
        # We have layers/dense, layers/dense_1, layers/dense_2, layers/dense_3
        dense_names = ['dense', 'dense_1', 'dense_2', 'dense_3']
        for dname in dense_names:
            w = f[f'layers/{dname}/vars/0'][:]
            b = f[f'layers/{dname}/vars/1'][:]
            layers_weights.append({
                'name': dname,
                'weight': w.tolist(),
                'bias': b.tolist()
            })

    # 2. Encoder
    encoder = joblib.load('backend-java/Encoders_Scalers/pokemon_encoder.joblib')
    categories = [list(c) for c in encoder.categories_]
    feature_names = list(encoder.get_feature_names_out(['Type 1', 'Type 2']))

    # 3. Scaler
    scaler = joblib.load('backend-java/Encoders_Scalers/pokemon_scaler.joblib')
    scaler_info = {
        'data_min': scaler.data_min_.tolist(),
        'data_max': scaler.data_max_.tolist(),
        'scale': scaler.scale_.tolist(),
        'stats_cols': ['HP', 'Attack', 'Defense', 'SP. Atk.', 'SP. Def', 'Speed']
    }

    out_data = {
        'layers': layers_weights,
        'encoder': {
            'categories': categories,
            'feature_names': feature_names
        },
        'scaler': scaler_info
    }

    out_path = 'frontend-react/src/data/kerasModelWeights.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out_data, f)
    print(f"Exported Keras model and transformers to {out_path}")

if __name__ == '__main__':
    export_model()

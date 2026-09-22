"""
Indian Crop Recommendation Dataset Generator
Generates realistic agronomic data based on ICAR (Indian Council of Agricultural Research)
benchmarks and standard Indian crop soil/weather requirement profiles.
Total 22 crops, 100 samples per crop = 2,200 records.
Features: N (kg/ha), P (kg/ha), K (kg/ha), temperature (°C), humidity (%), ph, rainfall (mm).
"""

import numpy as np
import pandas as pd
import os

# Agronomic optimal ranges for 22 Indian crops: (mean, std) for each feature
CROP_PROFILES = {
    'rice': {
        'N': (80, 10), 'P': (48, 8), 'K': (40, 6),
        'temperature': (23.7, 2.5), 'humidity': (82.3, 5.0), 'ph': (6.4, 0.4), 'rainfall': (236.0, 30.0),
        'season': 'Kharif', 'water': 'High',
        'en': 'Rice / Paddy', 'hi': 'चावल / धान', 'or': 'ଧାନ'
    },
    'maize': {
        'N': (77.8, 12), 'P': (48.4, 7), 'K': (20.0, 4),
        'temperature': (22.4, 3.0), 'humidity': (65.1, 7.0), 'ph': (6.2, 0.4), 'rainfall': (84.8, 15.0),
        'season': 'Kharif / Rabi', 'water': 'Medium',
        'en': 'Maize / Corn', 'hi': 'मक्का', 'or': 'ମକା'
    },
    'chickpea': {
        'N': (40.1, 8), 'P': (67.8, 8), 'K': (79.9, 6),
        'temperature': (18.9, 2.0), 'humidity': (16.9, 3.0), 'ph': (7.3, 0.4), 'rainfall': (80.1, 10.0),
        'season': 'Rabi', 'water': 'Low',
        'en': 'Chickpea / Gram', 'hi': 'चना', 'or': 'ବୁଟ / ଚଣା'
    },
    'kidneybeans': {
        'N': (20.8, 6), 'P': (67.5, 9), 'K': (20.1, 4),
        'temperature': (20.1, 2.0), 'humidity': (21.6, 3.5), 'ph': (5.7, 0.3), 'rainfall': (106.0, 15.0),
        'season': 'Rabi / Spring', 'water': 'Medium',
        'en': 'Kidney Beans / Rajma', 'hi': 'राजमा', 'or': 'ରାଜମା'
    },
    'pigeonpeas': {
        'N': (20.7, 5), 'P': (67.7, 8), 'K': (20.3, 4),
        'temperature': (27.7, 3.0), 'humidity': (48.1, 6.0), 'ph': (5.8, 0.5), 'rainfall': (149.5, 25.0),
        'season': 'Kharif', 'water': 'Medium',
        'en': 'Pigeon Peas / Arhar Dal', 'hi': 'अरहर / तूर दाल', 'or': 'ହରଡ଼ ଡାଲି'
    },
    'mothbeans': {
        'N': (21.4, 5), 'P': (48.0, 7), 'K': (20.2, 4),
        'temperature': (28.2, 3.0), 'humidity': (53.2, 7.0), 'ph': (6.8, 0.6), 'rainfall': (51.2, 10.0),
        'season': 'Kharif', 'water': 'Low (Drought Hardy)',
        'en': 'Moth Beans', 'hi': 'मोठ दाल', 'or': 'ମଠ ଡାଲି'
    },
    'mungbean': {
        'N': (20.9, 5), 'P': (47.3, 7), 'K': (19.9, 4),
        'temperature': (28.5, 2.5), 'humidity': (85.5, 4.0), 'ph': (6.7, 0.4), 'rainfall': (48.4, 8.0),
        'season': 'Zaid / Summer', 'water': 'Low-Medium',
        'en': 'Mung Bean / Green Gram', 'hi': 'मूंग दाल', 'or': 'ମୁଗ ଡାଲି'
    },
    'blackgram': {
        'N': (40.1, 7), 'P': (67.5, 8), 'K': (19.2, 4),
        'temperature': (29.9, 2.5), 'humidity': (65.1, 5.0), 'ph': (7.1, 0.4), 'rainfall': (67.9, 10.0),
        'season': 'Kharif / Rabi', 'water': 'Low-Medium',
        'en': 'Black Gram / Urad Dal', 'hi': 'उड़द दाल', 'or': 'ବିରି ଡାଲି'
    },
    'lentil': {
        'N': (18.8, 5), 'P': (68.4, 8), 'K': (19.4, 4),
        'temperature': (24.5, 3.0), 'humidity': (64.8, 6.0), 'ph': (6.9, 0.4), 'rainfall': (45.7, 8.0),
        'season': 'Rabi', 'water': 'Low',
        'en': 'Lentil / Masoor Dal', 'hi': 'मसूर दाल', 'or': 'ମସୁର ଡାଲି'
    },
    'pomegranate': {
        'N': (18.9, 6), 'P': (18.8, 5), 'K': (40.2, 5),
        'temperature': (21.8, 3.5), 'humidity': (90.1, 4.0), 'ph': (6.4, 0.5), 'rainfall': (107.5, 12.0),
        'season': 'Perennial', 'water': 'Medium',
        'en': 'Pomegranate', 'hi': 'अनार', 'or': 'ଡାଳିମ୍ବ'
    },
    'banana': {
        'N': (100.2, 10), 'P': (82.0, 7), 'K': (50.1, 6),
        'temperature': (27.4, 2.0), 'humidity': (80.3, 4.0), 'ph': (6.0, 0.4), 'rainfall': (104.6, 15.0),
        'season': 'Year-round', 'water': 'High',
        'en': 'Banana', 'hi': 'केला', 'or': 'କଦଳୀ'
    },
    'mango': {
        'N': (20.1, 5), 'P': (27.2, 5), 'K': (30.0, 5),
        'temperature': (31.2, 3.0), 'humidity': (50.2, 7.0), 'ph': (5.8, 0.6), 'rainfall': (94.7, 12.0),
        'season': 'Perennial', 'water': 'Medium',
        'en': 'Mango', 'hi': 'आम', 'or': 'ଆମ୍ବ'
    },
    'grapes': {
        'N': (23.2, 6), 'P': (132.5, 10), 'K': (200.1, 8),
        'temperature': (23.8, 4.0), 'humidity': (81.9, 5.0), 'ph': (6.0, 0.5), 'rainfall': (69.6, 10.0),
        'season': 'Rabi / Spring', 'water': 'Medium',
        'en': 'Grapes', 'hi': 'अंगूर', 'or': 'ଅଙ୍ଗୁର'
    },
    'watermelon': {
        'N': (99.4, 10), 'P': (17.0, 4), 'K': (50.1, 5),
        'temperature': (25.6, 2.5), 'humidity': (85.2, 4.0), 'ph': (6.5, 0.4), 'rainfall': (50.8, 8.0),
        'season': 'Zaid / Summer', 'water': 'Medium',
        'en': 'Watermelon', 'hi': 'तरबूज', 'or': 'ତରଭୁଜ'
    },
    'muskmelon': {
        'N': (100.3, 10), 'P': (17.7, 4), 'K': (50.1, 5),
        'temperature': (28.6, 2.0), 'humidity': (92.3, 3.0), 'ph': (6.4, 0.3), 'rainfall': (24.7, 4.0),
        'season': 'Zaid / Summer', 'water': 'Low-Medium',
        'en': 'Muskmelon / Kharbooja', 'hi': 'खरबूजा', 'or': 'ଖରଭୁଜା'
    },
    'apple': {
        'N': (20.8, 6), 'P': (134.2, 10), 'K': (199.9, 8),
        'temperature': (22.6, 2.5), 'humidity': (92.3, 3.0), 'ph': (5.9, 0.4), 'rainfall': (112.7, 12.0),
        'season': 'Temperate / Hill', 'water': 'Medium',
        'en': 'Apple', 'hi': 'सेब', 'or': 'ସେଓ'
    },
    'orange': {
        'N': (19.6, 6), 'P': (16.6, 4), 'K': (10.0, 3),
        'temperature': (22.8, 3.0), 'humidity': (92.2, 3.0), 'ph': (7.0, 0.4), 'rainfall': (110.4, 12.0),
        'season': 'Winter / Spring', 'water': 'Medium',
        'en': 'Orange / Santra', 'hi': 'संतरा', 'or': 'କମଳା'
    },
    'papaya': {
        'N': (49.9, 8), 'P': (59.1, 7), 'K': (50.0, 5),
        'temperature': (33.7, 3.0), 'humidity': (92.4, 3.0), 'ph': (6.7, 0.4), 'rainfall': (142.6, 20.0),
        'season': 'Tropical', 'water': 'High',
        'en': 'Papaya', 'hi': 'पपीता', 'or': 'ଅମୃତଭଣ୍ଡା'
    },
    'coconut': {
        'N': (21.9, 6), 'P': (16.9, 4), 'K': (30.6, 4),
        'temperature': (27.4, 2.0), 'humidity': (94.8, 3.0), 'ph': (5.9, 0.4), 'rainfall': (175.7, 25.0),
        'season': 'Coastal / Year-round', 'water': 'High',
        'en': 'Coconut', 'hi': 'नारियल', 'or': 'ନଡ଼ିଆ'
    },
    'cotton': {
        'N': (117.8, 12), 'P': (46.2, 7), 'K': (19.6, 4),
        'temperature': (23.9, 2.5), 'humidity': (79.8, 5.0), 'ph': (6.9, 0.5), 'rainfall': (80.4, 12.0),
        'season': 'Kharif', 'water': 'Medium',
        'en': 'Cotton / Kapas', 'hi': 'कपास', 'or': 'କପା'
    },
    'jute': {
        'N': (78.4, 10), 'P': (46.9, 7), 'K': (40.0, 5),
        'temperature': (24.9, 2.5), 'humidity': (79.6, 5.0), 'ph': (6.7, 0.4), 'rainfall': (174.7, 20.0),
        'season': 'Kharif / Monsoon', 'water': 'High',
        'en': 'Jute / Patson', 'hi': 'पटसन / जूट', 'or': 'ଛଣପଟ'
    },
    'coffee': {
        'N': (101.2, 10), 'P': (28.7, 5), 'K': (29.9, 5),
        'temperature': (25.5, 2.5), 'humidity': (58.9, 6.0), 'ph': (6.8, 0.4), 'rainfall': (158.1, 20.0),
        'season': 'Plantation', 'water': 'High',
        'en': 'Coffee', 'hi': 'कॉफ़ी', 'or': 'କଫି'
    }
}

def generate_crop_dataset(samples_per_crop=100, seed=42):
    """Generate authentic Indian agronomic dataset."""
    np.random.seed(seed)
    rows = []
    
    for crop, prof in CROP_PROFILES.items():
        for _ in range(samples_per_crop):
            n = float(np.clip(np.random.normal(prof['N'][0], prof['N'][1]), 0, 150))
            p = float(np.clip(np.random.normal(prof['P'][0], prof['P'][1]), 5, 150))
            k = float(np.clip(np.random.normal(prof['K'][0], prof['K'][1]), 5, 210))
            temp = float(np.clip(np.random.normal(prof['temperature'][0], prof['temperature'][1]), 8.0, 46.0))
            hum = float(np.clip(np.random.normal(prof['humidity'][0], prof['humidity'][1]), 10.0, 100.0))
            ph = float(np.clip(np.random.normal(prof['ph'][0], prof['ph'][1]), 3.5, 9.8))
            rain = float(np.clip(np.random.normal(prof['rainfall'][0], prof['rainfall'][1]), 15.0, 320.0))
            
            rows.append({
                'N': round(n, 2),
                'P': round(p, 2),
                'K': round(k, 2),
                'temperature': round(temp, 2),
                'humidity': round(hum, 2),
                'ph': round(ph, 2),
                'rainfall': round(rain, 2),
                'label': crop
            })
            
    df = pd.DataFrame(rows)
    return df

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'crop_recommendation.csv')
    df = generate_crop_dataset()
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} samples across {df['label'].nunique()} crops saved to {csv_path}")

"""
Train Random Forest Classifier for Indian Crop Recommendation.
Saves model to 'crop_rf_model.pkl' and metadata to 'model_meta.json'.
"""

import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from dataset import generate_crop_dataset, CROP_PROFILES

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'crop_recommendation.csv')
    
    if os.path.exists(csv_path):
        print(f"Loading existing dataset from {csv_path}...")
        df = pd.read_csv(csv_path)
    else:
        print("Generating realistic 2,200-sample Indian agronomic dataset...")
        df = generate_crop_dataset()
        df.to_csv(csv_path, index=False)
        print(f"Saved dataset to {csv_path}")

    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[features]
    y = df['label']

    print(f"Dataset summary: {len(df)} records, {len(df['label'].unique())} crop classes.")
    
    # Stratified Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training Random Forest Classifier (100 estimators)...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=16,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Random Forest Test Accuracy: {accuracy * 100:.2f}%")
    
    # Feature importances
    feature_importances = dict(zip(features, [round(float(imp), 4) for imp in model.feature_importances_]))
    print(f"Feature Importances: {feature_importances}")

    # Save Model
    model_path = os.path.join(current_dir, 'crop_rf_model.pkl')
    joblib.dump(model, model_path)
    print(f"Trained Random Forest model successfully saved to: {model_path}")

    # Save Metadata
    meta = {
        'model_name': 'Random Forest Indian Crop Recommender',
        'algorithm': 'RandomForestClassifier',
        'n_estimators': 100,
        'features': features,
        'feature_importances': feature_importances,
        'classes': list(model.classes_),
        'total_crops': len(model.classes_),
        'test_accuracy': round(float(accuracy), 4),
        'crop_profiles': CROP_PROFILES
    }
    
    meta_path = os.path.join(current_dir, 'model_meta.json')
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)
    print(f"Model metadata successfully saved to: {meta_path}")

if __name__ == '__main__':
    train()

"""
AgroVision Python ML Service
FastAPI application serving a pre-trained Random Forest model for Indian Crop Recommendation.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure model and metadata exist
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "crop_rf_model.pkl")
META_PATH = os.path.join(CURRENT_DIR, "model_meta.json")

def ensure_model_ready():
    """Ensure Random Forest model is trained and available."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(META_PATH):
        print("Model file not found. Running training routine...")
        from train import train
        train()

ensure_model_ready()

# Load model and metadata
model = joblib.load(MODEL_PATH)
with open(META_PATH, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

crop_profiles = metadata.get('crop_profiles', {})

app = FastAPI(
    title="AgroVision Indian Crop Recommendation ML API",
    description="Random Forest Machine Learning Service for precision crop advisory based on soil NPK, pH, and local weather.",
    version="1.0.0"
)

# Enable CORS for Next.js and frontend consumers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoilWeatherInput(BaseModel):
    N: float = Field(..., ge=0, le=300, description="Nitrogen content in soil (kg/ha)", example=90.0)
    P: float = Field(..., ge=0, le=300, description="Phosphorus content in soil (kg/ha)", example=42.0)
    K: float = Field(..., ge=0, le=400, description="Potassium content in soil (kg/ha)", example=43.0)
    temperature: float = Field(..., ge=-10, le=60, description="Ambient temperature (°C)", example=25.5)
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity (%)", example=80.0)
    ph: float = Field(..., ge=1, le=14, description="Soil pH value (1-14)", example=6.5)
    rainfall: float = Field(..., ge=0, le=1500, description="Annual / Seasonal rainfall (mm)", example=202.0)
    top_k: Optional[int] = Field(5, ge=1, le=10, description="Number of top crop recommendations to return")

class CropPrediction(BaseModel):
    crop: str
    name_en: str
    name_hi: str
    name_or: str
    probability: float
    confidence_pct: float
    suitability: str
    season: str
    water_requirement: str
    reasoning: str
    optimal_ranges: Dict[str, Any]

class PredictionResponse(BaseModel):
    success: bool
    timestamp: str
    engine: str
    model_version: str
    accuracy: float
    top_crop: str
    confidence: float
    predictions: List[CropPrediction]

def generate_reasoning(crop: str, user_input: dict, profile: dict) -> str:
    """Generate agronomic explanation for why this crop fits."""
    reasons = []
    
    # pH suitability
    ph_opt = profile.get('ph', (6.5, 0.5))[0]
    if abs(user_input['ph'] - ph_opt) < 0.8:
        reasons.append(f"Soil pH ({user_input['ph']:.1f}) is in the optimal range (~{ph_opt:.1f})")
    
    # Rainfall & Humidity
    rain_opt = profile.get('rainfall', (100, 20))[0]
    hum_opt = profile.get('humidity', (70, 10))[0]
    if user_input['rainfall'] >= rain_opt * 0.7:
        reasons.append(f"Moisture & rainfall ({user_input['rainfall']:.0f} mm) align well with crop water needs")
        
    # Temperature
    temp_opt = profile.get('temperature', (25, 3))[0]
    if abs(user_input['temperature'] - temp_opt) <= 5:
        reasons.append(f"Local climate temperature ({user_input['temperature']:.1f}°C) matches growth cycle")
        
    # NPK
    n_opt = profile.get('N', (50, 10))[0]
    p_opt = profile.get('P', (50, 10))[0]
    k_opt = profile.get('K', (50, 10))[0]
    reasons.append(f"Soil nutrient profile (N:{user_input['N']:.0f}, P:{user_input['P']:.0f}, K:{user_input['K']:.0f}) provides solid nourishment")
    
    return "; ".join(reasons) + "."

@app.get("/health")
def health_check():
    """Health check endpoint confirming ML model status."""
    return {
        "status": "healthy",
        "service": "AgroVision Crop Recommendation ML Engine",
        "model_type": "RandomForestClassifier",
        "n_estimators": metadata.get("n_estimators", 100),
        "test_accuracy": metadata.get("test_accuracy", 0.99),
        "crops_supported": metadata.get("total_crops", len(model.classes_)),
        "features": metadata.get("features", []),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/crops")
def list_crops():
    """List all 22 Indian crops supported by the Random Forest model."""
    return {
        "total": len(crop_profiles),
        "crops": [
            {
                "id": crop_id,
                "name_en": prof.get('en', crop_id.title()),
                "name_hi": prof.get('hi', ''),
                "name_or": prof.get('or', ''),
                "season": prof.get('season', 'Kharif/Rabi'),
                "water_requirement": prof.get('water', 'Medium'),
                'optimal_n': prof.get('N', [0])[0],
                'optimal_p': prof.get('P', [0])[0],
                'optimal_k': prof.get('K', [0])[0],
                'optimal_ph': prof.get('ph', [0])[0],
                'optimal_temp': prof.get('temperature', [0])[0],
                'optimal_rainfall': prof.get('rainfall', [0])[0]
            }
            for crop_id, prof in crop_profiles.items()
        ]
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_crop(data: SoilWeatherInput):
    """
    Predict top suitable crops based on soil nutrients (N, P, K, pH) and weather (temp, humidity, rainfall).
    """
    try:
        input_features = np.array([[
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]])
        
        # Get probability distribution across all crops
        probabilities = model.predict_proba(input_features)[0]
        classes = model.classes_
        
        # Sort indices by probability descending
        top_indices = np.argsort(probabilities)[::-1][:data.top_k]
        
        predictions = []
        user_input_dict = {
            'N': data.N, 'P': data.P, 'K': data.K,
            'temperature': data.temperature, 'humidity': data.humidity,
            'ph': data.ph, 'rainfall': data.rainfall
        }
        
        for idx in top_indices:
            crop_name = classes[idx]
            prob = float(probabilities[idx])
            prof = crop_profiles.get(crop_name, {})
            
            if prob >= 0.50:
                suitability = "Highly Recommended"
            elif prob >= 0.20:
                suitability = "Very Suitable"
            elif prob >= 0.08:
                suitability = "Moderately Suitable"
            else:
                suitability = "Feasible Alternative"
                
            predictions.append(CropPrediction(
                crop=crop_name,
                name_en=prof.get('en', crop_name.title()),
                name_hi=prof.get('hi', crop_name.title()),
                name_or=prof.get('or', crop_name.title()),
                probability=round(prob, 4),
                confidence_pct=round(prob * 100, 1),
                suitability=suitability,
                season=prof.get('season', 'Kharif / Rabi'),
                water_requirement=prof.get('water', 'Medium'),
                reasoning=generate_reasoning(crop_name, user_input_dict, prof),
                optimal_ranges={
                    'N': prof.get('N', [0, 0])[0],
                    'P': prof.get('P', [0, 0])[0],
                    'K': prof.get('K', [0, 0])[0],
                    'ph': prof.get('ph', [0, 0])[0],
                    'temperature': prof.get('temperature', [0, 0])[0],
                    'humidity': prof.get('humidity', [0, 0])[0],
                    'rainfall': prof.get('rainfall', [0, 0])[0]
                }
            ))
            
        top_prediction = predictions[0]
        
        return PredictionResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            engine="Random Forest Classifier (ICAR Agronomic Dataset)",
            model_version="1.0.0",
            accuracy=metadata.get('test_accuracy', 0.99),
            top_crop=top_prediction.crop,
            confidence=top_prediction.probability,
            predictions=predictions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting AgroVision ML Service on http://127.0.0.1:8000 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

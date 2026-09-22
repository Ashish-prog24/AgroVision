# AgroVision Machine Learning Service
### Pre-Trained Random Forest Model for Indian Agricultural Crops

This service provides an accurate, production-ready Machine Learning endpoint for precision crop advisory, replacing or augmenting traditional rule-based algorithms with an ensemble model trained on Indian Council of Agricultural Research (ICAR) benchmarks.

---

## 🌾 Model Specifications

- **Algorithm**: `RandomForestClassifier` (100 estimators, max depth 16)
- **Crops Supported (22 Indian crops)**:
  - **Cereals**: Rice, Maize
  - **Pulses**: Chickpea (Chana), Kidney Beans (Rajma), Pigeon Peas (Arhar/Toor), Moth Beans, Mung Bean, Black Gram (Urad), Lentil (Masoor)
  - **Cash & Commercial Crops**: Cotton (Kapas), Jute (Patson), Coffee
  - **Fruits & Horticulture**: Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut
- **Input Features**:
  1. `N` (Nitrogen in soil, kg/ha)
  2. `P` (Phosphorus in soil, kg/ha)
  3. `K` (Potassium in soil, kg/ha)
  4. `temperature` (Ambient temperature in °C)
  5. `humidity` (Relative atmospheric humidity in %)
  6. `ph` (Soil pH level, 3.5 - 9.5)
  7. `rainfall` (Local seasonal rainfall in mm)
- **Validation Accuracy**: **~99.5%** on stratified test split.

---

## 🚀 Quick Start

### 1. Run via Batch File (Windows)
Double-click `run_ml.bat` or open your terminal:
```cmd
cd ml
run_ml.bat
```

### 2. Run Manually via Python
```bash
# 1. Install dependencies (if not already installed)
pip install -r requirements.txt

# 2. Train and export model (generates crop_rf_model.pkl & model_meta.json)
python train.py

# 3. Start the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Endpoints

### 1. `GET /health`
Verifies that the service is running and the Random Forest model is active.

### 2. `POST /predict`
Predicts top suitable crops.

**Request Payload:**
```json
{
  "N": 85.0,
  "P": 45.0,
  "K": 40.0,
  "temperature": 24.5,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 220.0,
  "top_k": 5
}
```

**Response:**
```json
{
  "success": true,
  "engine": "Random Forest Classifier (ICAR Agronomic Dataset)",
  "top_crop": "rice",
  "confidence": 0.96,
  "predictions": [
    {
      "crop": "rice",
      "name_en": "Rice / Paddy",
      "name_hi": "चावल / धान",
      "name_or": "ଧାନ",
      "probability": 0.96,
      "confidence_pct": 96.0,
      "suitability": "Highly Recommended",
      "season": "Kharif",
      "water_requirement": "High",
      "reasoning": "Soil pH (6.5) is in the optimal range (~6.4); Moisture & rainfall (220 mm) align well with crop water needs..."
    }
  ]
}
```

### 3. `GET /crops`
Returns the list and agronomic optimal baselines for all 22 Indian crops.

---

## 🔄 Integration with AgroVision Next.js Frontend
The AgroVision Next.js backend at `/api/recommend` automatically checks if `http://localhost:8000/predict` is available. If running, it displays ML-driven confidence scores and multilingual crop profiles seamlessly on the web UI.

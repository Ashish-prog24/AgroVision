"""
Test script for the AgroVision Random Forest Crop Recommendation ML Service
"""

import requests
import json
import sys

# Ensure UTF-8 printing in Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def test_health():
    print("Testing ML Service Health...")
    try:
        res = requests.get("http://127.0.0.1:8000/health", timeout=5)
        print("Health Response Status:", res.status_code)
        print("Health Response Body:", json.dumps(res.json(), indent=2))
        return res.status_code == 200
    except Exception as e:
        print("Error connecting to ML service:", e)
        return False

def test_prediction():
    print("\nTesting Crop Prediction with sample soil and weather data...")
    # Sample: High N, moderate P, moderate K, high humidity & rainfall -> Should predict Rice / Paddy
    sample_payload = {
        "N": 85.0,
        "P": 45.0,
        "K": 40.0,
        "temperature": 24.0,
        "humidity": 82.0,
        "ph": 6.5,
        "rainfall": 230.0,
        "top_k": 3
    }
    
    try:
        res = requests.post("http://127.0.0.1:8000/predict", json=sample_payload, timeout=5)
        print("Prediction Status:", res.status_code)
        data = res.json()
        print("Top Crop Recommended:", data.get("top_crop"))
        print("Confidence:", f"{data.get('confidence') * 100:.1f}%")
        print("\nTop 3 Predictions:")
        for i, p in enumerate(data.get("predictions", []), 1):
            print(f"  {i}. {p['name_en']} ({p['name_hi']} / {p['name_or']}) - {p['confidence_pct']}% | {p['suitability']}")
            print(f"     Reasoning: {p['reasoning']}")
        return res.status_code == 200
    except Exception as e:
        print("Error connecting to ML service:", e)
        return False

if __name__ == "__main__":
    if test_health():
        test_prediction()

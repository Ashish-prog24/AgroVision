@echo off
echo =======================================================
echo AgroVision Indian Crop Recommendation ML Service
echo Random Forest Classifier (22 Indian Agricultural Crops)
echo =======================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python installation...
py --version
if errorlevel 1 (
    python --version
    if errorlevel 1 (
        echo [ERROR] Python is not found on your PATH. Please install Python 3.9+ and try again.
        pause
        exit /b 1
    )
)

echo [2/3] Checking if pre-trained Random Forest model exists...
if not exist "crop_rf_model.pkl" (
    echo Model not found. Training model now...
    py train.py
)

echo [3/3] Launching FastAPI ML server on http://127.0.0.1:8000 ...
echo Press Ctrl+C anytime to stop the server.
echo.
py -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause

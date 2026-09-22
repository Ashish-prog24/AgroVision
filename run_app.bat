@echo off
title AgroVision Launcher
echo ================================================================
echo         AgroVision - AI & ML Agricultural Advisory
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Python ML Service on http://127.0.0.1:8000 ...
start "AgroVision - Python ML Service (Port 8000)" cmd /k "cd /d %~dp0ml && run_ml.bat"

echo [2/3] Waiting for ML engine to initialize...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Next.js Web Application on http://localhost:3000 ...
start "AgroVision - Web Application (Port 3000)" cmd /k "cd /d %~dp0 && npm run dev"

echo Opening AgroVision in your web browser...
timeout /t 4 /nobreak >nul
start http://localhost:3000

echo.
echo ================================================================
echo AgroVision is now running!
echo - Web App:   http://localhost:3000
echo - ML Docs:   http://127.0.0.1:8000/docs
echo ================================================================

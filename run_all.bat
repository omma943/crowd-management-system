@echo off
title Crowd Management System Launcher
echo Launching Crowd Management System Backend and Frontend...
start "Backend Server (FastAPI)" cmd /c "run_backend.bat"
start "Frontend Dashboard (Vite)" cmd /c "run_frontend.bat"
echo Both servers have been launched in separate windows!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
pause

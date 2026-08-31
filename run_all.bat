@echo off
title Crowd Management System Launcher
echo Launching Crowd Management System Backend and Frontend on new ports...
start "Backend Server (FastAPI :8001)" cmd /c "run_backend.bat"
start "Frontend Dashboard (Vite :3000)" cmd /c "run_frontend.bat"
echo Both servers have been launched in separate windows!
echo Backend:  http://127.0.0.1:8001
echo Frontend: http://127.0.0.1:3000
pause

@echo off
title Crowd Management Backend (FastAPI)
echo Starting FastAPI Backend Server on http://127.0.0.1:8001 ...
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8001 --reload
pause

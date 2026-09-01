@echo off
title ProsperHigh Backend API Server v2
echo Clearing any stale processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Starting ProsperHigh FastAPI Engine on http://127.0.0.1:8000...
set PATH=C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python;C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\Scripts;%PATH%
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause

@echo off
title ProsperHigh 1-Click Platform Launcher v2
echo ========================================================
echo   PROSPERHIGH PLATFORM V2 - LAUNCHING LOCAL SERVERS
echo ========================================================
echo.
start "ProsperHigh Backend" cmd /c "run_backend.cmd"
timeout /t 3 /nobreak > nul
start "ProsperHigh Frontend" cmd /c "run_frontend.cmd"
echo.
echo Both backend and frontend servers are launching!
echo  - Backend API:  http://127.0.0.1:8000
echo  - Web Frontend: http://localhost:3000
echo.
pause

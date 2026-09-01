@echo off
title ProsperHigh Next.js Frontend Server v2
echo Clearing any stale processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Starting ProsperHigh Web Dashboard on http://localhost:3000...
set PATH=C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
cd frontend
node "C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs" dev
pause

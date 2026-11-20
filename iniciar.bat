@echo off
title Pokemon vs IA - Servidor de Desarrollo
echo ==============================================
echo    Iniciando Pokemon vs IA (Frontend React)
echo ==============================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0frontend-react"
if not exist "node_modules\" (
    echo Instalando dependencias de Node...
    call npm install
)

echo Levantando servidor Vite en http://localhost:5173/ ...
echo.
call npm run dev
pause

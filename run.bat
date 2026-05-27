@echo off
setlocal EnableDelayedExpansion
cd /d %~dp0

set "RUNTIME_DIR=%cd%\.runtime"
set "NODE_DIR=%RUNTIME_DIR%\node-v20.18.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

where node >nul 2>nul
if %errorlevel%==0 (
  where npm >nul 2>nul
  if %errorlevel%==0 (
    set "USE_SYSTEM_NODE=1"
  )
)

if not defined USE_SYSTEM_NODE (
  echo [INFO] Node/npm no encontrados. Descargando Node portable...
  if not exist "%RUNTIME_DIR%" mkdir "%RUNTIME_DIR%"

  set "ZIP_FILE=%RUNTIME_DIR%\node.zip"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip' -OutFile '%ZIP_FILE%'"
  if errorlevel 1 (
    echo [ERROR] No se pudo descargar Node portable.
    pause
    exit /b 1
  )

  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%RUNTIME_DIR%' -Force"
  if errorlevel 1 (
    echo [ERROR] No se pudo descomprimir Node portable.
    pause
    exit /b 1
  )
)

if defined USE_SYSTEM_NODE (
  set "NODE_CMD=node"
  set "NPM_RUN=npm"
) else (
  set "NODE_CMD=%NODE_EXE%"
  set "NPM_RUN=%NPM_CMD%"
)

echo [INFO] Instalando dependencias backend...
cd /d "%~dp0backend"
call "%NPM_RUN%" install
if errorlevel 1 (
  echo [ERROR] Fallo npm install en backend.
  pause
  exit /b 1
)

echo [INFO] Instalando dependencias frontend...
cd /d "%~dp0frontend"
call "%NPM_RUN%" install
if errorlevel 1 (
  echo [ERROR] Fallo npm install en frontend.
  pause
  exit /b 1
)

echo [INFO] Iniciando backend en puerto 3000...
start "Backend" cmd /k "cd /d %~dp0backend && call \"%NPM_RUN%\" start"

echo [INFO] Iniciando frontend en puerto 4200...
start "Frontend" cmd /k "cd /d %~dp0frontend && call \"%NPM_RUN%\" start"

echo [OK] Backend:  http://localhost:3000

echo [OK] Frontend: http://localhost:4200

echo [INFO] Espera unos segundos a que ambos terminen de iniciar.
pause

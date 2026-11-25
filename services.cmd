@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion
title Dilite - Local Stack Control

rem ============================================================
rem  DILITE - one-file stack controller (MongoDB edition)
rem  MongoDB 9 (Windows service) : localhost:27017  -  DB dilite
rem  Express API                 : localhost:3003
rem  Vite site                   : localhost:5181
rem ============================================================

set "ROOT=%~dp0"
set "DB_NAME=dilite"
set "API_PORT=3003"
set "SITE_PORT=5181"
set "MONGO_PORT=27017"

if /i "%~1"=="start"  goto START_ALL
if /i "%~1"=="stop"   goto STOP_ALL
if /i "%~1"=="status" goto SHOW_STATUS_ONLY
if /i "%~1"=="db"     goto DB_DATA

:MENU
cls
echo.
echo   ================================================================
echo      DILITE  -  FOOD ORDERING + KITCHEN DASHBOARD
echo   ================================================================
call :PRINT_STATUS
echo.
echo      [1] Start all services
echo      [2] Stop all services
echo      [3] Refresh status
echo      [4] View database data
echo      [5] Open site in browser
echo      [6] Open MongoDB shell (type queries by hand)
echo      [7] Open kitchen dashboard
echo      [0] Exit
echo.
set "CHOICE="
set /p "CHOICE=     Select: "
if "%CHOICE%"=="1" goto START_ALL
if "%CHOICE%"=="2" goto STOP_ALL
if "%CHOICE%"=="3" goto MENU
if "%CHOICE%"=="4" goto DB_DATA
if "%CHOICE%"=="5" (
    start "" "http://localhost:%SITE_PORT%"
    goto MENU
)
if "%CHOICE%"=="6" goto DB_CONSOLE
if "%CHOICE%"=="7" (
    start "" "http://localhost:%SITE_PORT%"
    echo      Tip: scroll to the footer and click "Kitchen dashboard".
    ping -n 3 127.0.0.1 >nul
    goto MENU
)
if "%CHOICE%"=="0" exit /b 0
goto MENU

rem ============================================================
rem  STATUS
rem ============================================================
:PRINT_STATUS
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$dot=[char]0x25CF; function Show($ok){ if($ok){ Write-Host '  ' -NoNewline; Write-Host $dot -NoNewline -ForegroundColor Green; Write-Host '  RUNNING' -ForegroundColor Green } else { Write-Host '  ' -NoNewline; Write-Host $dot -NoNewline -ForegroundColor Red; Write-Host '  STOPPED' -ForegroundColor Red } }; $mongoOk = [bool](Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue); $apiOk = [bool](Get-NetTCPConnection -LocalPort 3003 -State Listen -ErrorAction SilentlyContinue); $webOk = [bool](Get-NetTCPConnection -LocalPort 5181 -State Listen -ErrorAction SilentlyContinue); Write-Host ''; Write-Host '     MongoDB 9 (Windows service)     localhost:27017  DB dilite' -NoNewline; Show $mongoOk; Write-Host '     Express API                     localhost:3003' -NoNewline; Show $apiOk; Write-Host '     Site (Vite)                     localhost:5181' -NoNewline; Show $webOk; Write-Host ''
exit /b 0

:SHOW_STATUS_ONLY
cls
echo.
echo   ---- STATUS ----
call :PRINT_STATUS
echo.
exit /b 0

rem ============================================================
rem  START
rem ============================================================
:START_ALL
cls
echo.
echo   Checking MongoDB service...
netstat -ano | findstr /R /C:":%MONGO_PORT% .*LISTENING" >nul
if not errorlevel 1 goto MONGO_READY

echo   MongoDB is not running - trying to start the service...
net start MongoDB >nul 2>&1
if errorlevel 1 (
    echo   [x] Could not start MongoDB. Open an Administrator terminal and run:
    echo         net start MongoDB
    echo       Or start "MongoDB Server" from services.msc.
) else (
    echo   MongoDB service started.
    ping -n 4 127.0.0.1 >nul
)
goto START_API

:MONGO_READY
echo   MongoDB is up on localhost:%MONGO_PORT%

:START_API
netstat -ano | findstr /R /C:":%API_PORT% .*LISTENING" >nul
if errorlevel 1 (
    echo   Starting Express API on %API_PORT%...
    start "Dilite API" cmd /k "cd /d "%ROOT%backend" && node server.js"
) else (
    echo   API already listening on %API_PORT%
)

netstat -ano | findstr /R /C:":%SITE_PORT% .*LISTENING" >nul
if errorlevel 1 (
    echo   Starting Vite site on %SITE_PORT%...
    start "Dilite Site" cmd /k "cd /d "%ROOT%" && npx vite --port %SITE_PORT% --strictPort"
) else (
    echo   Site already listening on %SITE_PORT%
)

echo.
echo   Waiting for the API to answer...
set /a TRIES=0
:WAIT_API
set /a TRIES+=1
powershell -NoProfile -Command "try{ $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:%API_PORT%/api/health' -TimeoutSec 2; exit 0 }catch{ exit 1 }" >nul 2>&1
if not errorlevel 1 goto API_READY
if %TRIES% GEQ 15 goto API_SLOW
ping -n 2 127.0.0.1 >nul
goto WAIT_API

:API_SLOW
echo   [x] API not responding yet - give it a few seconds, then press [3].
goto START_DONE

:API_READY
echo   API healthy - MongoDB connected.

:START_DONE
echo.
call :PRINT_STATUS
echo.
echo   Site:  http://localhost:%SITE_PORT%
echo   Kitchen dashboard: footer link on the site
ping -n 3 127.0.0.1 >nul
goto MENU

rem ============================================================
rem  STOP
rem ============================================================
:STOP_ALL
cls
echo.
echo   Stopping site and API windows...
taskkill /FI "WINDOWTITLE eq Dilite Site*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Dilite API*" /T /F >nul 2>&1

echo   Releasing ports %SITE_PORT% and %API_PORT%...
call :KILL_PORT %SITE_PORT%
call :KILL_PORT %API_PORT%

echo   Stopping the MongoDB service...
net stop MongoDB >nul 2>&1
if errorlevel 1 (
    echo   [x] MongoDB needs Administrator rights to stop - left running.
) else (
    echo   MongoDB stopped.
)

echo.
echo   All app services stopped.
echo.
call :PRINT_STATUS
echo.
ping -n 3 127.0.0.1 >nul
goto MENU

:KILL_PORT
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%~1 .*LISTENING"') do (
    taskkill /F /PID %%P >nul 2>&1
)
exit /b 0

rem ============================================================
rem  DATABASE DATA
rem ============================================================
:DB_DATA
cls
echo.
echo   ================================================================
echo     DATABASE: %DB_NAME%   (MongoDB on localhost:%MONGO_PORT%)
echo   ================================================================
netstat -ano | findstr /R /C:":%MONGO_PORT% .*LISTENING" >nul
if errorlevel 1 (
    echo.
    echo   [x] MongoDB is not running. Pick [1] Start all first.
    echo.
    pause
    goto MENU
)

echo.
mongosh --quiet %DB_NAME% --file "%~dp0scripts\db-report.js"
echo.
pause
goto MENU

rem ============================================================
rem  MONGODB SHELL
rem ============================================================
:DB_CONSOLE
cls
echo.
echo   Opening MongoDB shell for database '%DB_NAME%'.
echo   Try:  db.orders.find().sort({createdAt:-1}).limit(3).pretty()
echo   Leave with:  exit
echo.
mongosh %DB_NAME%
goto MENU

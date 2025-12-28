@echo off
title China-Japan Study Report Server
echo ========================================================
echo   Starting Local Server for Study Abroad Report
echo ========================================================
echo.
echo   [1] Opening default browser to http://localhost:8080...
start http://localhost:8080
echo.
echo   [2] Starting Python HTTP Server...
echo   (Press Ctrl+C to stop the server)
echo.
python -m http.server 8080
pause

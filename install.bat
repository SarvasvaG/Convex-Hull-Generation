@echo off
echo Installing dependencies for Convex Hull Visualization...
echo.
echo This may take a few minutes...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Installation completed successfully!
    echo ========================================
    echo.
    echo To start the development server, run:
    echo   npm run dev
    echo.
    echo Or simply run: start-dev.bat
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
    echo Please check your Node.js installation
    echo and internet connection.
    echo.
    pause
)

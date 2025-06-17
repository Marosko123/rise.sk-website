@echo off
REM Cross-platform setup script for RISE App (Windows version)
REM This script provides the same functionality as cross-platform-setup.sh for Windows users

setlocal enabledelayedexpansion

echo ========================================
echo     RISE App - Windows Setup Script
echo ========================================
echo.

REM Check Node.js
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 20 or higher.
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo [INFO] Node.js version: %NODE_VERSION%

REM Check npm
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
echo [INFO] npm version: %NPM_VERSION%

REM Check Git
echo [INFO] Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Git is not installed. Some features may not work.
) else (
    for /f "tokens=*" %%a in ('git --version') do set GIT_VERSION=%%a
    echo [INFO] Git version: %GIT_VERSION%
)

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
)
echo [SUCCESS] Dependencies installed

REM Create environment file
if not exist ".env.local" (
    if exist ".env.example" (
        echo [INFO] Creating .env.local from template...
        copy ".env.example" ".env.local" >nul
        echo [WARNING] Please edit .env.local with your actual configuration values
    )
)

REM Build the project
echo [INFO] Building project...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    exit /b 1
)

REM Run quality checks
echo [INFO] Running quality checks...

echo [INFO] Type checking...
npm run type-check
if %errorlevel% neq 0 (
    echo [ERROR] Type checking failed.
    exit /b 1
)

echo [INFO] Linting...
npm run lint
if %errorlevel% neq 0 (
    echo [ERROR] Linting failed.
    exit /b 1
)

echo [INFO] Format checking...
npm run format:check
if %errorlevel% neq 0 (
    echo [ERROR] Format checking failed.
    exit /b 1
)

echo [SUCCESS] All quality checks passed

echo.
echo ========================================
echo         Setup Complete! ✅
echo ========================================
echo.
echo Platform: Windows
echo Node.js: %NODE_VERSION%
echo npm: %NPM_VERSION%
echo.
echo Quick start commands:
echo   npm run dev            - Start development server
echo   npm run build          - Build for production
echo   npm run lint           - Run linter
echo   npm run format         - Format code
echo   dev-scripts.sh         - Interactive script runner (in Git Bash)
echo.
echo Your development environment is ready! 🚀

pause

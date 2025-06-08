# PowerShell setup script for RISE App
# This script provides cross-platform setup for Windows PowerShell users

param(
    [switch]$SkipChecks = $false
)

# Color functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Main setup function
function Main {
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host "    RISE App - PowerShell Setup" -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host ""

    # Check Node.js
    Write-Info "Checking Node.js installation..."
    try {
        $nodeVersion = node --version
        Write-Info "Node.js version: $nodeVersion"
        
        # Check if version is 20 or higher
        $majorVersion = [int]($nodeVersion.Substring(1).Split('.')[0])
        if ($majorVersion -lt 20) {
            Write-Error "Node.js version $nodeVersion is not supported. Please install Node.js 20 or higher."
            exit 1
        }
        Write-Success "Node.js version is compatible"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 20 or higher."
        exit 1
    }

    # Check npm
    Write-Info "Checking npm installation..."
    try {
        $npmVersion = npm --version
        Write-Info "npm version: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm."
        exit 1
    }

    # Check Git
    Write-Info "Checking Git installation..."
    try {
        $gitVersion = git --version
        Write-Info "Git version: $gitVersion"
    }
    catch {
        Write-Warning "Git is not installed. Some features may not work."
    }

    # Install dependencies
    Write-Info "Installing dependencies..."
    try {
        npm install
        Write-Success "Dependencies installed"
    }
    catch {
        Write-Error "Failed to install dependencies"
        exit 1
    }

    # Create environment file
    if (-not (Test-Path ".env.local") -and (Test-Path ".env.example")) {
        Write-Info "Creating .env.local from template..."
        Copy-Item ".env.example" ".env.local"
        Write-Warning "Please edit .env.local with your actual configuration values"
    }

    # Build the project
    Write-Info "Building project..."
    try {
        npm run build
        Write-Success "Build completed"
    }
    catch {
        Write-Error "Build failed"
        exit 1
    }

    if (-not $SkipChecks) {
        # Run quality checks
        Write-Info "Running quality checks..."
        
        Write-Info "Type checking..."
        npm run type-check
        
        Write-Info "Linting..."
        npm run lint
        
        Write-Info "Format checking..."
        npm run format:check
        
        Write-Success "All quality checks passed"
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "        Setup Complete! ✅" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Platform: Windows (PowerShell)"
    Write-Host "Node.js: $nodeVersion"
    Write-Host "npm: $npmVersion"
    Write-Host ""
    Write-Host "Quick start commands:"
    Write-Host "  npm run dev            - Start development server"
    Write-Host "  npm run build          - Build for production"
    Write-Host "  npm run lint           - Run linter"
    Write-Host "  npm run format         - Format code"
    Write-Host ""
    Write-Host "Your development environment is ready! 🚀"
}

# Execute main function
Main

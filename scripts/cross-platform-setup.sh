#!/bin/bash

# Cross-platform setup script for RISE App
# This script works on macOS, Linux, and Windows (with Git Bash/WSL)

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Utility functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect operating system
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="Windows"
    else
        OS="Unknown"
    fi
    print_info "Detected OS: $OS"
}

# Check Node.js version
check_node() {
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_info "Node.js version: $NODE_VERSION"

        # Extract major version number
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

        if [ "$MAJOR_VERSION" -ge 20 ]; then
            print_success "Node.js version is compatible"
        else
            print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js 20 or higher."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 20 or higher."
        exit 1
    fi
}

# Check npm version
check_npm() {
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_info "npm version: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Check Git
check_git() {
    if command -v git >/dev/null 2>&1; then
        GIT_VERSION=$(git --version)
        print_info "Git version: $GIT_VERSION"
    else
        print_warning "Git is not installed. Some features may not work."
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Setup Git hooks
setup_git_hooks() {
    if command -v git >/dev/null 2>&1 && [ -d ".git" ]; then
        print_info "Setting up Git hooks..."
        if [ -f "scripts/install-git-hooks.sh" ]; then
            chmod +x scripts/install-git-hooks.sh
            ./scripts/install-git-hooks.sh
        else
            print_warning "Git hooks installer not found"
        fi
    else
        print_warning "Not a Git repository or Git not installed. Skipping Git hooks setup."
    fi
}

# Setup Husky (if available)
setup_husky() {
    if npm list husky >/dev/null 2>&1; then
        print_info "Setting up Husky..."
        npm run prepare 2>/dev/null || print_warning "Husky setup failed"
    fi
}

# Create environment file
create_env_file() {
    if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
        print_info "Creating .env.local from template..."
        cp .env.example .env.local
        print_warning "Please edit .env.local with your actual configuration values"
    fi
}

# Platform-specific optimizations
platform_optimizations() {
    case $OS in
        "macOS")
            print_info "Applying macOS optimizations..."
            # macOS specific settings
            ;;
        "Linux")
            print_info "Applying Linux optimizations..."
            # Linux specific settings
            ;;
        "Windows")
            print_info "Applying Windows optimizations..."
            # Windows specific settings
            # Convert line endings for shell scripts
            if command -v dos2unix >/dev/null 2>&1; then
                find . -name "*.sh" -exec dos2unix {} \;
            fi
            ;;
    esac
}

# Run quality checks
run_quality_checks() {
    print_info "Running quality checks..."

    print_info "Type checking..."
    npm run type-check

    print_info "Linting..."
    npm run lint

    print_info "Format checking..."
    npm run format:check

    print_success "All quality checks passed"
}

# Main setup function
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "    RISE App - Cross-Platform Setup"
    echo "========================================"
    echo -e "${NC}"

    detect_os
    check_node
    check_npm
    check_git

    install_dependencies
    create_env_file
    setup_git_hooks
    setup_husky
    platform_optimizations

    # Build the project
    print_info "Building project..."
    npm run build

    # Run quality checks
    run_quality_checks

    echo -e "${GREEN}"
    echo "========================================"
    echo "        Setup Complete! ✅"
    echo "========================================"
    echo -e "${NC}"

    echo "Platform: $OS"
    echo "Node.js: $NODE_VERSION"
    echo "npm: $NPM_VERSION"
    echo ""
    echo "Quick start commands:"
    echo "  npm run dev            - Start development server"
    echo "  npm run build          - Build for production"
    echo "  npm run lint           - Run linter"
    echo "  npm run format         - Format code"
    echo "  ./dev-scripts.sh       - Interactive script runner"
    echo ""
    echo "Your development environment is ready! 🚀"
}

# Execute main function
main "$@"

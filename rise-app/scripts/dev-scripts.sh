#!/bin/bash

# RISE App - Comprehensive Development Script Runner
# This script provides easy access to all development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run npm script with error handling
run_npm_script() {
    local script_name="$1"
    local description="$2"
    
    print_status "Running: $description"
    if npm run "$script_name"; then
        print_success "$description completed successfully"
        return 0
    else
        print_error "$description failed"
        return 1
    fi
}

# Main menu function
show_menu() {
    echo ""
    echo "==================================="
    echo "    RISE App Development Scripts"
    echo "==================================="
    echo ""
    echo "Development:"
    echo "  1)  Start development server (Turbopack)"
    echo "  2)  Start development server (standard)"
    echo "  3)  Type check (watch mode)"
    echo ""
    echo "Build & Production:"
    echo "  4)  Build for production"
    echo "  5)  Build and analyze bundle"
    echo "  6)  Build and start production server"
    echo "  7)  Export static files"
    echo ""
    echo "Code Quality:"
    echo "  8)  Lint code"
    echo "  9)  Lint and fix issues"
    echo "  10) Type check"
    echo "  11) Format code with Prettier"
    echo "  12) Full code quality check"
    echo ""
    echo "Maintenance:"
    echo "  13) Clean build files"
    echo "  14) Clean everything and reinstall"
    echo "  15) Update dependencies"
    echo "  16) Health check"
    echo ""
    echo "Deployment:"
    echo "  17) Deploy to Vercel (production)"
    echo "  18) Deploy to Vercel (preview)"
    echo ""
    echo "Quick Actions:"
    echo "  19) Complete setup (install + build)"
    echo "  20) Run all checks (type + lint + build)"
    echo ""
    echo "  0)  Exit"
    echo ""
}

# Function to handle user choice
handle_choice() {
    case $1 in
        1)
            run_npm_script "dev" "Development server with Turbopack"
            ;;
        2)
            run_npm_script "dev:no-turbo" "Development server (standard)"
            ;;
        3)
            run_npm_script "type-check:watch" "TypeScript type checking in watch mode"
            ;;
        4)
            run_npm_script "build" "Production build"
            ;;
        5)
            run_npm_script "build:analyze" "Production build with bundle analysis"
            ;;
        6)
            run_npm_script "prod" "Build and start production server"
            ;;
        7)
            run_npm_script "export" "Export static files"
            ;;
        8)
            run_npm_script "lint" "ESLint code checking"
            ;;
        9)
            run_npm_script "lint:fix" "ESLint with automatic fixes"
            ;;
        10)
            run_npm_script "type-check" "TypeScript type checking"
            ;;
        11)
            run_npm_script "format" "Prettier code formatting"
            ;;
        12)
            run_npm_script "full-check" "Complete code quality check"
            ;;
        13)
            run_npm_script "clean" "Cleaning build files"
            ;;
        14)
            print_warning "This will delete node_modules and reinstall everything."
            read -p "Are you sure? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                run_npm_script "reinstall" "Complete reinstallation"
            else
                print_status "Operation cancelled"
            fi
            ;;
        15)
            run_npm_script "update-deps" "Updating dependencies"
            ;;
        16)
            run_npm_script "health" "Health check"
            ;;
        17)
            run_npm_script "deploy:vercel" "Vercel production deployment"
            ;;
        18)
            run_npm_script "deploy:vercel:preview" "Vercel preview deployment"
            ;;
        19)
            run_npm_script "setup" "Complete project setup"
            ;;
        20)
            run_npm_script "full-check" "Running all quality checks"
            ;;
        0)
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            ;;
    esac
}

# Main execution
main() {
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    # Interactive mode if no arguments provided
    if [[ $# -eq 0 ]]; then
        while true; do
            show_menu
            read -p "Enter your choice [0-20]: " choice
            handle_choice "$choice"
            echo ""
            read -p "Press Enter to continue or Ctrl+C to exit..."
        done
    else
        # Direct command execution
        handle_choice "$1"
    fi
}

# Execute main function with all arguments
main "$@"

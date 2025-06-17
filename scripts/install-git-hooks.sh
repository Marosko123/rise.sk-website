#!/bin/bash

# Git hooks installer script
# This script sets up Git hooks for consistent development

set -e

HOOKS_DIR=".git/hooks"
SCRIPTS_DIR="scripts/git-hooks"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up Git hooks...${NC}"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"
mkdir -p "$SCRIPTS_DIR"

# Pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Check if there are staged files
if git diff --cached --name-only --quiet; then
    echo "No staged changes found."
    exit 0
fi

# Run linting on staged files
echo "Running ESLint..."
npm run lint:strict || exit 1

# Run type checking
echo "Running TypeScript check..."
npm run type-check || exit 1

# Run formatting check
echo "Checking code formatting..."
npm run format:check || {
    echo "❌ Code formatting issues found. Run 'npm run format' to fix them."
    exit 1
}

echo "✅ Pre-commit checks passed!"
EOF

# Pre-push hook
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

echo "🚀 Running pre-push checks..."

# Run full build to ensure everything works
echo "Running production build..."
npm run build || {
    echo "❌ Build failed. Please fix the issues before pushing."
    exit 1
}

echo "✅ Pre-push checks passed!"
EOF

# Make hooks executable
chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-push"

echo -e "${GREEN}✅ Git hooks installed successfully!${NC}"
echo ""
echo "Installed hooks:"
echo "  - pre-commit: Runs linting, type checking, and format checking"
echo "  - pre-push: Runs production build"
echo ""
echo "To skip hooks temporarily, use: git commit --no-verify"

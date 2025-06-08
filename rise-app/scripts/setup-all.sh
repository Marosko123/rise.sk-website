#!/bin/bash

# RISE App - One-Click Development Setup
# This script sets up everything you need for development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "=========================================="
echo "    RISE App - Complete Setup Script"
echo "=========================================="
echo -e "${NC}"

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

# Step 2: Type check
echo -e "${YELLOW}Step 2: Running type check...${NC}"
npm run type-check

# Step 3: Lint check
echo -e "${YELLOW}Step 3: Running linter...${NC}"
npm run lint

# Step 4: Format code
echo -e "${YELLOW}Step 4: Formatting code...${NC}"
npm run format

# Step 5: Build project
echo -e "${YELLOW}Step 5: Building project...${NC}"
npm run build

# Step 6: Health check
echo -e "${YELLOW}Step 6: Running health check...${NC}"
npm run start &
SERVER_PID=$!
sleep 5
npm run health || echo "Health check will be available when server is running"
kill $SERVER_PID 2>/dev/null || true

echo -e "${GREEN}"
echo "=========================================="
echo "           Setup Complete! ✅"
echo "=========================================="
echo -e "${NC}"

echo "Available commands:"
echo "  ./dev-scripts.sh        - Interactive script runner"
echo "  npm run dev            - Start development server"
echo "  npm run build          - Build for production"
echo "  npm run start          - Start production server"
echo "  npm run lint           - Run linter"
echo "  npm run format         - Format code"
echo "  npm run type-check     - Check TypeScript types"
echo ""
echo "Project is ready for development! 🚀"

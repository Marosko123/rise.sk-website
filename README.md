# 🚀 Rise - Next.js Business Website

A modern, multilingual business website built with Next.js 15, featuring comprehensive
cross-platform development tools and zero-error development environment.

## ✨ Features

- **🌍 Multilingual Support** - English & Slovak with automatic locale detection
- **⚡ Next.js 15** - Latest features with Turbopack for fast development
- **🎨 Modern UI** - Tailwind CSS with responsive design
- **📧 Contact Forms** - SendGrid integration for reliable email delivery
- **🔍 SEO Optimized** - Meta tags and structured data
- **🛠️ Developer Experience** - Comprehensive tooling and automation
- **🧪 Quality Assurance** - Automated testing, linting, and formatting
- **🌐 Cross-Platform** - Works on macOS, Linux, and Windows

## 📁 Project Structure

```
rise-app/
├── 📚 docs/                    # All documentation files
│   ├── AI_ASSISTANT_GUIDELINES.md
│   ├── CROSS_PLATFORM_GUIDE.md
│   ├── I18N_SETUP.md
│   ├── SENDGRID_SETUP.md
│   └── SETUP_COMPLETION_REPORT.md
├── 🛠️ scripts/                # Development and setup scripts
│   ├── cross-platform-setup.sh
│   ├── dev-scripts.sh
│   ├── install-git-hooks.sh
│   ├── setup-all.sh
│   ├── setup-windows.bat
│   └── setup-windows.ps1
├── 🗂️ src/                    # Source code
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   └── i18n/                  # Internationalization
├── 🌐 messages/               # Translation files
├── 🎯 public/                 # Static assets
└── ⚙️ Configuration files
```

## 📋 Project Organization

This project follows a **clean, organized structure** designed for professional development:

- **📚 `docs/`** - All documentation files (except this README)
- **🛠️ `scripts/`** - All executable scripts and automation tools
- **🗂️ `src/`** - Source code only
- **⚙️ Root level** - Configuration files and package.json

> **Note for AI Assistants**: This project has specific organizational guidelines in
> `docs/AI_ASSISTANT_GUIDELINES.md`. Please follow these standards when making changes to maintain
> consistency.

---

## 🚀 Quick Start

### Option 1: One-Click Setup (Recommended)

```bash
# Complete automated setup
./scripts/setup-all.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Option 3: Interactive Development Menu

```bash
# Access all development commands via interactive menu
./scripts/dev-scripts.sh
```

## 🛠️ Development Commands

### Core Development

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run preview      # Build and preview production
```

### Quality Assurance

```bash
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript validation
npm run format       # Prettier formatting
npm run stylelint    # CSS linting
npm run full-check   # Complete project validation
```

### Development Tools

```bash
npm run size-limit   # Bundle size analysis
npm run commit       # Conventional commits with Commitizen
npm run git-hooks    # Install Git hooks
npm run health       # Check server health
```

### Deployment

```bash
npm run deploy:vercel        # Deploy to Vercel (production)
npm run deploy:vercel:preview # Deploy preview to Vercel
```

## 🌍 Internationalization

The app supports multiple languages with automatic detection:

- **English** (default): `/en/` or `/`
- **Slovak**: `/sk/`

Translation files are located in `/messages/`:

- `en.json` - English translations
- `sk.json` - Slovak translations

## 📧 Email Configuration

Contact forms use SendGrid for email delivery. See `docs/SENDGRID_SETUP.md` for configuration
details.

## 🔧 Development Environment

### Prerequisites

- **Node.js 18+** (specified in `.nvmrc`)
- **npm 9+**
- **Git** (for hooks and version control)

### IDE Setup (VS Code Recommended)

The project includes comprehensive VS Code configuration:

- **Settings** - Optimized editor settings in `.vscode/settings.json`
- **Extensions** - Recommended extensions in `.vscode/extensions.json`
- **Tasks** - Build tasks in `.vscode/tasks.json`
- **Debugging** - Debug configs in `.vscode/launch.json`

### Cross-Platform Support

Platform-specific setup scripts available:

- **Unix/macOS/Linux**: `./scripts/cross-platform-setup.sh`
- **Windows (CMD)**: `./scripts/setup-windows.bat`
- **Windows (PowerShell)**: `./scripts/setup-windows.ps1`

## 🧪 Quality Assurance

### Automated Quality Checks

- **Pre-commit hooks** - Lint, type-check, and format validation
- **Pre-push hooks** - Production build verification
- **CI/CD Pipeline** - GitHub Actions for automated testing

### Code Standards

- **TypeScript** - Strict mode enabled
- **ESLint** - Comprehensive rules with auto-fix
- **Prettier** - Consistent code formatting
- **Stylelint** - CSS/SCSS linting
- **Import ordering** - Automated import organization

### Bundle Analysis

- **Size-limit** - Bundle size monitoring (current: 224.24 kB)
- **Webpack Bundle Analyzer** - Visual bundle analysis

## 📚 Documentation

All documentation is organized in the `docs/` folder:

- **[AI Assistant Guidelines](docs/AI_ASSISTANT_GUIDELINES.md)** - Standards for AI assistants
- **[Cross-Platform Guide](docs/CROSS_PLATFORM_GUIDE.md)** - Complete setup and usage guide
- **[Internationalization Setup](docs/I18N_SETUP.md)** - i18n configuration details
- **[SendGrid Configuration](docs/SENDGRID_SETUP.md)** - Email service setup
- **[Setup Completion Report](docs/SETUP_COMPLETION_REPORT.md)** - Project status and achievements

## � Email Authentication & BIMI

BIMI (Brand Indicators for Message Identification) displays the Rise.sk logo in supported email clients when DMARC authentication passes.

### BIMI Asset Management

```bash
# Sanitize BIMI SVG for security compliance
npm run bimi:svgo

# Test BIMI asset availability
npm run bimi:test
```

### DNS Configuration

Add this TXT record to your DNS for BIMI logo display:

```dns
Record Type: TXT
Name: default._bimi.rise.sk
Value: v=BIMI1; l=https://rise.sk/.well-known/bimi/rise.svg
```

### DMARC Requirement

BIMI requires DMARC policy enforcement. Ensure your DMARC record includes:

```dns
Record Type: TXT
Name: _dmarc.rise.sk
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@rise.sk
```

### Verification

Test BIMI setup:

```bash
# Verify DNS record
dig TXT default._bimi.rise.sk

# Test asset availability
curl -I https://rise.sk/.well-known/bimi/rise.svg

# Validate SVG compliance
npm run bimi:svgo && echo "BIMI SVG is compliant"
```

### Asset Specifications

- **Location**: `public/.well-known/bimi/rise.svg`
- **Format**: SVG Tiny P/S (no scripts, fonts, or external references)
- **Size**: 512x512 pixels
- **Background**: White for email client compatibility
- **Content-Type**: `image/svg+xml` (configured via Vercel)

## �🔒 Security

- **npm audit** - Regular dependency vulnerability scanning
- **Environment variables** - Secure configuration management
- **Git hooks** - Prevent commits with security issues
- **Content Security Policy** - Web security headers

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run deploy:vercel
```

### Static Export

```bash
npm run export
npm run serve
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## 🛟 Troubleshooting

### Common Issues

1. **Node.js version** - Use Node.js 18+ (check with `node --version`)
2. **Dependencies** - Run `npm run reinstall` for clean install
3. **Git hooks** - Run `npm run git-hooks` to reinstall hooks
4. **Build errors** - Run `npm run full-check` for comprehensive validation

### Get Help

- Check `docs/` folder for detailed guides
- Run `./scripts/dev-scripts.sh` for interactive help
- Review error logs in development console

## 🤝 Contributing

1. **Code Style** - Follow existing patterns and run `npm run format`
2. **Git Commits** - Use `npm run commit` for conventional commits
3. **Quality Checks** - All commits are automatically validated
4. **Documentation** - Update docs for any new features

## 📄 License

This project is private and proprietary.

---

**🎯 Status: Production-Ready** _Complete cross-platform development environment with zero-error
setup across macOS, Linux, and Windows._

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details.

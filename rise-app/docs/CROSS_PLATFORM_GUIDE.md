# RISE App - Cross-Platform Development Environment

## 🌍 Cross-Platform Compatibility

This project is configured to work seamlessly across **macOS**, **Linux**, and **Windows** with zero configuration differences.

### 📋 Prerequisites

- **Node.js** 20.0.0 or higher
- **npm** (comes with Node.js)
- **Git** (recommended)

### 🚀 Quick Setup

#### Option 1: One-Command Setup (All Platforms)

**macOS/Linux:**
```bash
./cross-platform-setup.sh
```

**Windows (Command Prompt):**
```cmd
setup-windows.bat
```

**Windows (PowerShell):**
```powershell
.\setup-windows.ps1
```

**Windows (Git Bash):**
```bash
./cross-platform-setup.sh
```

#### Option 2: Manual Setup
```bash
npm install
npm run build
npm run dev
```

### 🛠️ Platform-Specific Features

#### macOS
- Optimized for Apple Silicon (M1/M2/M3)
- Native terminal colors and formatting
- Homebrew integration ready

#### Linux
- Works with all major distributions
- Systemd service files included
- Docker-free deployment

#### Windows
- PowerShell and Command Prompt support
- WSL/WSL2 compatible
- Git Bash integration
- Windows Terminal optimized

### 📁 Configuration Files

| File | Purpose | Platform |
|------|---------|----------|
| `.editorconfig` | Consistent code formatting | All |
| `.gitignore` | Git ignore patterns | All |
| `.browserslistrc` | Browser compatibility | All |
| `.nvmrc` | Node.js version | All |
| `.env.example` | Environment template | All |
| `cross-platform-setup.sh` | Unix setup script | macOS/Linux |
| `setup-windows.bat` | Windows batch script | Windows |
| `setup-windows.ps1` | PowerShell script | Windows |

### 🎯 VS Code Integration

#### Required Extensions
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Tailwind CSS IntelliSense** - CSS framework support
- **TypeScript + Next.js** - Framework support

#### Automatic Setup
The project includes VS Code workspace settings that automatically:
- Format code on save
- Fix ESLint issues on save
- Organize imports
- Apply consistent indentation

### 🧪 Quality Assurance

#### Automated Checks
- **TypeScript** type checking
- **ESLint** code linting
- **Prettier** code formatting
- **Stylelint** CSS linting
- **Size-limit** bundle analysis

#### Cross-Platform Testing
```bash
# Run all quality checks
npm run full-check

# Platform-specific tests
npm run test:cross-platform
```

### 🔧 Development Scripts

#### Core Commands
```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Check code quality
npm run format           # Format code
npm run type-check       # TypeScript validation
```

#### Interactive Menu
```bash
./dev-scripts.sh         # Interactive script runner (Unix)
```

#### Quality Assurance
```bash
npm run lint:fix         # Fix linting issues
npm run format:check     # Check formatting
npm run full-check       # Complete quality check
npm run size-limit       # Check bundle size
```

#### Maintenance
```bash
npm run clean            # Clean build files
npm run reinstall        # Complete reinstall
npm run update-deps      # Update dependencies
npm run security-audit   # Security check
```

### 🌐 Browser Support

- **Chrome/Edge** 100+
- **Firefox** 100+
- **Safari** 15+
- **Mobile browsers** supported

### 📱 Responsive Design

- **Mobile-first** approach
- **Touch-friendly** interfaces
- **Cross-device** compatibility

### 🔐 Security Features

- **Content Security Policy** headers
- **HTTPS** enforcement in production
- **Environment variable** protection
- **Dependency vulnerability** scanning

### 🎨 Code Style

#### Automatic Formatting
- **Prettier** for JavaScript/TypeScript/CSS
- **EditorConfig** for consistent indentation
- **ESLint** for code quality
- **Stylelint** for CSS consistency

#### Conventions
- **2 spaces** indentation
- **Single quotes** for strings
- **Trailing commas** in ES5
- **LF line endings** (cross-platform)

### 🚦 CI/CD Pipeline

#### GitHub Actions
- **Cross-platform testing** (Ubuntu, Windows, macOS)
- **Quality checks** on every PR
- **Automated deployment** to Vercel
- **Bundle size monitoring**

#### Local Git Hooks
```bash
./install-git-hooks.sh   # Install quality checks
```

### 🌍 Internationalization

- **English** (default)
- **Slovak** language support
- **Easy to add** new languages
- **Automatic locale detection**

### 📊 Performance Monitoring

- **Bundle size limits** enforced
- **Core Web Vitals** optimized
- **Lighthouse** CI integration
- **Performance budgets**

### 🔧 Troubleshooting

#### Common Issues

**Windows line ending errors:**
```bash
git config core.autocrlf true
```

**Permission denied on scripts:**
```bash
chmod +x *.sh
```

**Node.js version issues:**
```bash
nvm use 20
# or
nvm install 20
```

#### Platform-Specific Help

**macOS:**
- Use Homebrew for dependencies
- Check Xcode Command Line Tools

**Linux:**
- Install build-essential
- Check Node.js permissions

**Windows:**
- Use Git Bash for Unix commands
- Install Windows Build Tools if needed

### 📞 Support

For platform-specific issues:
1. Check the troubleshooting section
2. Run the setup script again
3. Verify Node.js version compatibility
4. Check environment variables

### 🎯 Production Deployment

#### Vercel (Recommended)
```bash
npm run deploy:vercel
```

#### Static Export
```bash
npm run export
npm run serve
```

#### Manual Deployment
```bash
npm run build
npm run start
```

---

**Your cross-platform development environment is ready! 🚀**

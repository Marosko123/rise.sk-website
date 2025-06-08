# 📋 Development Guidelines for AI Assistants

## 🏗️ Project Structure Standards

This project follows a clean, organized structure that **MUST** be maintained by all AI assistants
working on this codebase.

### 📁 Directory Organization

```
rise-app/
├── 📚 docs/           # ALL documentation files (except README.md)
├── 🛠️ scripts/        # ALL executable scripts
├── 🗂️ src/           # Source code only
├── 🌐 messages/       # i18n translation files
├── 🎯 public/         # Static assets
└── ⚙️ Root config files (package.json, tsconfig.json, etc.)
```

### 🚨 CRITICAL RULES FOR ALL AI ASSISTANTS

#### ✅ Documentation Files

- **README.md** - ONLY in project root
- **ALL other .md files** - MUST be in `docs/` folder
- **No exceptions** - This includes guides, setup docs, API docs, etc.

#### ✅ Scripts Organization

- **ALL executable scripts** - MUST be in `scripts/` folder
- **Setup scripts** - Keep in `scripts/` (not `scripts/setup/`)
- **Build scripts** - Reference correct paths in package.json
- **Git hooks** - Update references when moving scripts

#### ✅ File References

When moving files, **ALWAYS UPDATE**:

- `package.json` script references
- Internal script cross-references
- Documentation links
- Import paths in code

#### ✅ Project Structure Commands

```bash
# ✅ Correct script execution
./scripts/setup-all.sh
./scripts/dev-scripts.sh

# ✅ Correct documentation references
docs/SETUP_COMPLETION_REPORT.md
docs/CROSS_PLATFORM_GUIDE.md

# ❌ NEVER create files in root like:
./SOME_NEW_GUIDE.md          # Should be: ./docs/SOME_NEW_GUIDE.md
./new-script.sh              # Should be: ./scripts/new-script.sh
```

### 🔄 When Adding New Files

#### New Documentation:

```bash
# ✅ Correct location
touch docs/NEW_FEATURE_GUIDE.md

# ❌ Wrong location
touch NEW_FEATURE_GUIDE.md
```

#### New Scripts:

```bash
# ✅ Correct location
touch scripts/new-feature-script.sh
chmod +x scripts/new-feature-script.sh

# ❌ Wrong location
touch new-feature-script.sh
```

#### Update References:

```bash
# ✅ Update package.json if needed
"new-command": "./scripts/new-feature-script.sh"

# ✅ Update README.md links
[Feature Guide](docs/NEW_FEATURE_GUIDE.md)
```

## 🎯 Quality Standards

### Code Organization

- Keep `/src` for source code only
- Use clear, descriptive file names
- Follow existing naming conventions
- Maintain import order (automated by ESLint)

### Documentation Standards

- Update README.md for any structural changes
- Keep docs current with code changes
- Use consistent markdown formatting
- Reference correct file paths

### Script Standards

- Make all scripts executable (`chmod +x`)
- Update cross-references when moving files
- Test scripts after path changes
- Maintain platform compatibility

## 🔒 Enforcement

This structure is **MANDATORY** for:

- ✅ Clean project organization
- ✅ Easy navigation and maintenance
- ✅ Consistent development experience
- ✅ Professional codebase standards

### Before Making Changes:

1. Check current project structure
2. Follow the established patterns
3. Update all references when moving files
4. Test that scripts still work
5. Update documentation if needed

---

**⚠️ WARNING**: Deviating from this structure will break the development environment and create
inconsistencies. Always follow these guidelines when working on this project.

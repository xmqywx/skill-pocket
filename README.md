<p align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="SkillPocket Logo">
</p>

<h1 align="center">SkillPocket</h1>

<p align="center">
  <strong>Your AI Skills in Your Pocket</strong>
  <br>
  A beautiful desktop app to discover, manage, and create Claude Skills
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#installation">Installation</a> •
  <a href="#development">Development</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue" alt="Platform">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/tauri-2.0-orange" alt="Tauri">
</p>

---

## What is SkillPocket?

**SkillPocket** is a native desktop application that helps you manage your [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills). With over 63,000+ skills available on [SkillsMP.com](https://skillsmp.com/), finding and organizing the right skills for your workflow can be overwhelming. SkillPocket makes it easy.

### The Problem

- Skills are scattered across `~/.claude/skills/` and `~/.claude/plugins/`
- Hard to discover what skills you already have
- No visual way to organize and categorize skills
- Creating new skills requires manual file management

### The Solution

SkillPocket provides a beautiful, intuitive interface to:
- **View** all your installed skills in one place
- **Search** through skills by name, description, or content
- **Organize** with a flexible tag system
- **Favorite** your most-used skills
- **Create** new skills with helpful templates

## Features

### 📦 My Skills
- Automatic scanning of local skills directories
- Card-based UI with grid/list view toggle
- Full-text search across all skill content
- Multi-level tag system for organization
- Favorite skills for quick access
- Usage statistics tracking

### 🏷️ Smart Tagging
- Hierarchical tag structure
- Custom colors and emojis
- Drag-and-drop organization
- Quick filter by tags

### ✨ Create Skills
- Step-by-step CLI instructions
- Quick access to skills directory
- Links to official documentation

### ⚙️ Settings
- Light/Dark/System theme
- Multi-language support (English/中文)
- Data import/export
- API key configuration

## Screenshots

<p align="center">
  <img src="screenshots/app-myskills.png" width="80%" alt="My Skills Page">
  <br>
  <em>My Skills - View and manage all your Claude skills</em>
</p>

<p align="center">
  <img src="screenshots/app-settings.png" width="80%" alt="Settings Page">
  <br>
  <em>Settings - Customize your experience</em>
</p>

## Installation

### Download

Download the latest release for your platform:

| Platform | Download |
|----------|----------|
| macOS (Apple Silicon) | [SkillPocket_0.1.0_aarch64.dmg](https://github.com/xmqywx/skill-pocket/releases) |
| macOS (Intel) | [SkillPocket_0.1.0_x64.dmg](https://github.com/xmqywx/skill-pocket/releases) |
| Windows | [SkillPocket_0.1.0_x64.msi](https://github.com/xmqywx/skill-pocket/releases) |
| Linux | [SkillPocket_0.1.0_amd64.deb](https://github.com/xmqywx/skill-pocket/releases) |

### Build from Source

Prerequisites:
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)

```bash
# Clone the repository
git clone https://github.com/xmqywx/skill-pocket.git
cd skill-pocket

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev

# Build for production
pnpm tauri build
```

## Development

### Tech Stack

- **Framework**: [Tauri 2.0](https://tauri.app/) - Lightweight, secure desktop apps
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **i18n**: [react-i18next](https://react.i18next.com/)

### Project Structure

```
skill-pocket/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── stores/             # Zustand stores
│   ├── services/           # Business logic
│   ├── i18n/               # Translations
│   └── types/              # TypeScript types
├── src-tauri/              # Tauri backend (Rust)
│   ├── src/                # Rust source
│   ├── icons/              # App icons
│   └── capabilities/       # Tauri permissions
└── screenshots/            # App screenshots
```

### Commands

```bash
# Start development server
pnpm tauri dev

# Build production app
pnpm tauri build

# Run type check
pnpm exec tsc --noEmit

# Format code
pnpm format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills) - Official documentation
- [SkillsMP.com](https://skillsmp.com/) - 63,000+ Claude Skills marketplace
- [Anthropic Skills Repository](https://github.com/anthropics/skills) - Official skills examples

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for the Claude community
  <br>
  <a href="https://github.com/xmqywx/skill-pocket/issues">Report Bug</a> •
  <a href="https://github.com/xmqywx/skill-pocket/issues">Request Feature</a>
</p>

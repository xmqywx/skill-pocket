<p align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="SkillPocket Logo">
</p>

<h1 align="center">SkillPocket</h1>

<p align="center">
  <strong>Manage your Claude Skills & Generate Beautiful Icons</strong>
</p>

<p align="center">
  <a href="README_CN.md">中文文档</a>
</p>

---

## Features

### 📦 Manage Skills
- Auto-scan all local Claude Skills
- Search, favorite, and organize with tags
- Quick filter by categories

### 🎨 Generate Icons (Highlight!)
- Let Claude generate SVG icons for you
- Multiple design styles supported
- One-click copy to use

### ⚙️ Customization
- Light / Dark / System theme
- English / Chinese language
- Import / Export data

---

## Installation

### Step 1: Download the App

| Platform | Download |
|----------|----------|
| macOS (Apple Silicon) | [Download .dmg](https://github.com/xmqywx/skill-pocket/releases) |
| macOS (Intel) | [Download .dmg](https://github.com/xmqywx/skill-pocket/releases) |
| Windows | [Download .msi](https://github.com/xmqywx/skill-pocket/releases) |

### Step 2: Install Icon Generator Skill (Optional but Recommended)

This enables you to generate custom icons with Claude.

**Copy the skill folder to your Skills directory:**

```bash
cp -r skills/icon-selector ~/.claude/skills/
```

### Step 3: Copy Sample Data (Optional)

See some demo icons on first launch:

```bash
cp -r sample-data/icons ~/.claude/skill-pocket/
```

---

## Usage

### Managing Skills

1. Open the app - it auto-scans your Skills
2. Use search to find skills
3. Click ⭐ to favorite
4. Add tags to organize

### Generating Icons

> Requires icon-selector skill installed (Step 2)

1. Open Claude Code
2. Ask Claude to create icons:
   - "Create a set of 20 e-commerce app icons, blue gradient style"
   - "Design icons based on https://dribbble.com/shots/xxx"
3. Claude generates and saves icons to SkillPocket
4. View and copy icons in **Icons** tab

---

## FAQ

**Q: Skills not showing?**
> Make sure your Skills are in `~/.claude/skills/` or `~/.claude/plugins/`

**Q: Icon feature not working?**
> Check if icon-selector skill is installed in `~/.claude/skills/`

**Q: How to backup?**
> Settings → Export Config

---

## Build from Source

```bash
# Prerequisites: Node.js 18+, pnpm, Rust

git clone https://github.com/xmqywx/skill-pocket.git
cd skill-pocket
pnpm install
pnpm tauri dev      # Development
pnpm tauri build    # Production
```

---

## Links

- [Claude Code Skills Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [SkillsMP.com](https://skillsmp.com/) - 63,000+ Skills Marketplace

---

## License

MIT License - see [LICENSE](LICENSE)

<p align="center">
  Made with ❤️ for Claude users
</p>

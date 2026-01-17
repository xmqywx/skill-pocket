---
name: Icon Selector
description: This skill helps you choose icon libraries, generate custom SVG icons, and manage icon styles. Use when the user needs icons or wants to create custom icon sets. You can directly write icons to SkillPocket app.
version: 4.0.0
---

# Icon Selector & Generator

This skill helps you:
1. Choose the right icon library for your project
2. Generate custom premium-quality SVG icons
3. **Directly save icons to SkillPocket app** via file API

---

# PART 1: SkillPocket File API

## Overview

You can directly write icon styles and icons to SkillPocket by writing files to:
```
~/.claude/skill-pocket/icons/
```

The app will automatically detect and display them.

## File Structure

```
~/.claude/skill-pocket/icons/
├── styles.json          # All icon styles
├── sets.json            # All icon sets metadata
└── svgs/
    └── {set-name}/      # Folder for each icon set
        ├── home.svg
        ├── search.svg
        └── ...
```

## API: Create Icon Style

Write to `~/.claude/skill-pocket/icons/styles.json`:

```json
[
  {
    "id": "food-life-orange",
    "name": "Food Life Orange Gradient",
    "description": "Soft gradient backgrounds with white outlined icons for food app",
    "sourceUrl": "https://dribbble.com/shots/24105523-Gofundme-Icon-System",
    "category": "gradient",
    "colors": ["#FF8C42", "#FF5E1A"],
    "effects": ["Linear gradient 135°", "Drop shadow", "Rounded corners rx=16"],
    "characteristics": ["Warm", "Friendly", "Appetizing"],
    "prompt": "Create a 64x64 SVG icon. Background: rounded square (rx=16) with gradient from #FF8C42 to #FF5E1A. Icon: white strokes (stroke-width=2). Include shadow filter.",
    "createdAt": "2024-01-17T10:00:00Z"
  }
]
```

## API: Create Icon Set

Write to `~/.claude/skill-pocket/icons/sets.json`:

```json
[
  {
    "id": "food-life-icons",
    "name": "Food Life Icons",
    "styleId": "food-life-orange",
    "description": "20 icons for food recommendation app",
    "icons": [
      { "name": "home", "concept": "Home page" },
      { "name": "search", "concept": "Search food" },
      { "name": "heart", "concept": "Favorites" }
    ],
    "createdAt": "2024-01-17T10:00:00Z"
  }
]
```

## API: Save SVG Icons

Save each SVG to `~/.claude/skill-pocket/icons/svgs/{set-name}/{icon-name}.svg`

Example: `~/.claude/skill-pocket/icons/svgs/food-life-icons/home.svg`

```svg
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF8C42"/>
      <stop offset="100%" style="stop-color:#FF5E1A"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FF5E1A" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#bg)" filter="url(#shadow)"/>
  <g stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Icon paths here -->
  </g>
</svg>
```

---

# PART 2: Quick Workflow

When user asks for custom icons:

## Step 1: Ask Requirements
- What style? (show reference URL if any)
- What icons needed? (list concepts)
- What colors? (brand colors or suggest)
- What size? (24/48/64px)

## Step 2: Create Style File
Write `~/.claude/skill-pocket/icons/styles.json`

## Step 3: Create Set File
Write `~/.claude/skill-pocket/icons/sets.json`

## Step 4: Generate & Save SVGs
For each icon, write to `~/.claude/skill-pocket/icons/svgs/{set-name}/{name}.svg`

## Step 5: Tell User
"Icons saved! Open SkillPocket → Icons → My Icon Sets to view."

---

# PART 3: Icon Libraries (Quick Reference)

| Library | Install | Usage |
|---------|---------|-------|
| Lucide | `npm i lucide-react` | `<Home className="w-6 h-6" />` |
| Phosphor | `npm i @phosphor-icons/react` | `<House size={24} />` |
| Heroicons | `npm i @heroicons/react` | `<HomeIcon className="h-6 w-6" />` |
| Iconify | `npm i @iconify/react` | `<Icon icon="mdi:home" />` |

---

# PART 4: SVG Templates

## Gradient Style (Most Common)
```svg
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{COLOR1}"/>
      <stop offset="100%" style="stop-color:{COLOR2}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="{COLOR2}" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#bg)" filter="url(#shadow)"/>
  <g stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    {ICON_PATHS}
  </g>
</svg>
```

## Color Palettes
- Orange Warm: `#FF8C42` → `#FF5E1A`
- Purple-Pink: `#667EEA` → `#764BA2`
- Blue-Cyan: `#4facfe` → `#00f2fe`
- Green-Teal: `#11998e` → `#38ef7d`
- Sunset: `#fa709a` → `#fee140`

---

# PART 5: Example Full Workflow

User: "参考 GoFundMe 设计，帮我做一套食品 App 图标，橙色，20个"

Claude:
1. Create style → write `styles.json`
2. Create set → write `sets.json`
3. Generate 20 SVGs → write to `svgs/food-life-icons/`
4. Reply: "Done! 20 icons saved to ~/.claude/skill-pocket/icons/svgs/food-life-icons/. Open SkillPocket to preview."

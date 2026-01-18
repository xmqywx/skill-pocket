---
name: UI Design Extractor
description: Analyze UI designs from Dribbble, Behance, or screenshots and generate detailed design specification prompts. Use when the user wants to extract UI specs, design tokens, or create reusable design systems from reference designs.
version: 1.0.0
---

# UI Design Extractor

Use this skill when the user:
- Asks to analyze a UI design from Dribbble, Behance, or other design platforms
- Wants to extract design tokens from a screenshot or URL
- Needs a detailed UI specification prompt for a design reference
- Says "提取 UI 规范", "分析设计风格", "生成设计 Prompt", "UI design spec"
- Provides a design URL and asks to create a reusable design system

## Output Location

Save all generated files to: `~/.claude/skill-pocket/ui-designs/`

Directory structure:
```
~/.claude/skill-pocket/ui-designs/
├── styles.json          # All design style metadata
├── screenshots/         # Screenshot files
│   └── {style-id}.png
└── prompts/            # Full prompt markdown files
    └── {style-id}.md
```

## Workflow

### Step 1: Analyze the Design

When given a design URL or screenshot:
1. Identify the overall style and mood
2. Extract color palette (primary, secondary, accent, background, text colors)
3. Analyze typography (font families, sizes, weights, line heights)
4. Measure spacing patterns (margins, paddings, gaps)
5. Note border radius values
6. Identify shadow styles
7. Document component specifications (buttons, inputs, cards, etc.)

### Step 2: Generate Detailed Prompt

Create an extremely detailed UI specification prompt following this exact format:

```
📐 UI DESIGN SPECIFICATION
═══════════════════════════════════════════════════════════════

🎨 DESIGN OVERVIEW
──────────────────
Style Name: [Name based on the design]
Category: [Game / E-commerce / Business / Social / Creative]
Mood: [Playful, Professional, Minimal, Bold, etc.]
Target Platform: [iOS / Android / Web / Desktop]

═══════════════════════════════════════════════════════════════

🎨 COLOR SYSTEM
──────────────────

Primary Colors:
┌─────────────────────────────────────────────────────────────┐
│ Primary           │ #XXXXXX                                 │
│ Primary Light     │ #XXXXXX                                 │
│ Primary Dark      │ #XXXXXX                                 │
└─────────────────────────────────────────────────────────────┘

Secondary Colors:
┌─────────────────────────────────────────────────────────────┐
│ Secondary         │ #XXXXXX                                 │
│ Accent 1          │ #XXXXXX                                 │
│ Accent 2          │ #XXXXXX                                 │
└─────────────────────────────────────────────────────────────┘

Background Colors:
┌─────────────────────────────────────────────────────────────┐
│ Background        │ #XXXXXX                                 │
│ Surface           │ #XXXXXX                                 │
│ Card              │ #XXXXXX                                 │
└─────────────────────────────────────────────────────────────┘

Text Colors:
┌─────────────────────────────────────────────────────────────┐
│ Text Primary      │ #XXXXXX                                 │
│ Text Secondary    │ #XXXXXX                                 │
│ Text Muted        │ #XXXXXX                                 │
│ Text On Primary   │ #XXXXXX                                 │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

📝 TYPOGRAPHY
──────────────────

Font Families:
- Display: "[Font Name]", sans-serif
- Body: "[Font Name]", sans-serif
- Mono: "[Font Name]", monospace

Type Scale:
┌─────────────────────────────────────────────────────────────┐
│ Display XL   │ XXpx │ Bold (700)    │ line-height: X.X     │
│ Display      │ XXpx │ Bold (700)    │ line-height: X.X     │
│ Heading 1    │ XXpx │ Semibold(600) │ line-height: X.X     │
│ Heading 2    │ XXpx │ Semibold(600) │ line-height: X.X     │
│ Heading 3    │ XXpx │ Medium (500)  │ line-height: X.X     │
│ Body Large   │ XXpx │ Regular (400) │ line-height: X.X     │
│ Body         │ XXpx │ Regular (400) │ line-height: X.X     │
│ Body Small   │ XXpx │ Regular (400) │ line-height: X.X     │
│ Caption      │ XXpx │ Medium (500)  │ line-height: X.X     │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

📏 SPACING SYSTEM
──────────────────

Base Unit: Xpx

Spacing Scale:
┌─────────────────────────────────────────────────────────────┐
│ space-1   │ Xpx    │ Description                           │
│ space-2   │ Xpx    │ Description                           │
│ space-3   │ Xpx    │ Description                           │
│ space-4   │ Xpx    │ Description                           │
│ space-6   │ Xpx    │ Description                           │
│ space-8   │ Xpx    │ Description                           │
│ space-12  │ Xpx    │ Description                           │
│ space-16  │ Xpx    │ Description                           │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

🔘 BORDER RADIUS
──────────────────

┌─────────────────────────────────────────────────────────────┐
│ radius-sm     │ Xpx    │ Use case                          │
│ radius-md     │ Xpx    │ Use case                          │
│ radius-lg     │ Xpx    │ Use case                          │
│ radius-xl     │ Xpx    │ Use case                          │
│ radius-2xl    │ Xpx    │ Use case                          │
│ radius-full   │ 9999px │ Pills, avatars                    │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

🌑 SHADOWS & ELEVATION
──────────────────

┌─────────────────────────────────────────────────────────────┐
│ shadow-sm    │ [CSS shadow value]                          │
│              │ Use case                                    │
├─────────────────────────────────────────────────────────────┤
│ shadow-md    │ [CSS shadow value]                          │
│              │ Use case                                    │
├─────────────────────────────────────────────────────────────┤
│ shadow-lg    │ [CSS shadow value]                          │
│              │ Use case                                    │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

🔲 COMPONENT SPECIFICATIONS
──────────────────

【PRIMARY BUTTON】
┌─────────────────────────────────────────────────────────────┐
│ Height: Xpx                                                 │
│ Padding: X Xpx                                              │
│ Font: Xpx [Weight]                                          │
│ Border Radius: Xpx                                          │
│ Background: [color or gradient]                             │
│ Text Color: #XXXXXX                                         │
│ Border: [none or specification]                             │
│ Shadow: [shadow value]                                      │
│                                                             │
│ States:                                                     │
│ - Hover: [description]                                      │
│ - Pressed: [description]                                    │
│ - Disabled: [description]                                   │
└─────────────────────────────────────────────────────────────┘

【SECONDARY BUTTON】
┌─────────────────────────────────────────────────────────────┐
│ [Same format as primary]                                    │
└─────────────────────────────────────────────────────────────┘

【INPUT FIELD】
┌─────────────────────────────────────────────────────────────┐
│ Height: Xpx                                                 │
│ Padding: Xpx                                                │
│ Font: Xpx [Weight]                                          │
│ Border Radius: Xpx                                          │
│ Background: #XXXXXX                                         │
│ Border: [specification]                                     │
│ Placeholder Color: #XXXXXX                                  │
│                                                             │
│ States:                                                     │
│ - Focus: [description]                                      │
│ - Error: [description]                                      │
│ - Disabled: [description]                                   │
└─────────────────────────────────────────────────────────────┘

【CARD】
┌─────────────────────────────────────────────────────────────┐
│ Padding: Xpx                                                │
│ Border Radius: Xpx                                          │
│ Background: #XXXXXX                                         │
│ Shadow: [shadow value]                                      │
│ Border: [specification]                                     │
└─────────────────────────────────────────────────────────────┘

[Add more components as identified in the design]

═══════════════════════════════════════════════════════════════

📱 LAYOUT GUIDELINES
──────────────────

Screen Margins: Xpx
Card Gaps: Xpx
Section Spacing: Xpx

Grid System:
- Columns: X
- Gutter: Xpx

═══════════════════════════════════════════════════════════════

✨ ANIMATION & MOTION
──────────────────

Timing Functions:
- ease-out: cubic-bezier(X, X, X, X)
- ease-in-out: cubic-bezier(X, X, X, X)

Durations:
- fast: Xms
- normal: Xms
- slow: Xms

═══════════════════════════════════════════════════════════════

🔧 CSS VARIABLES TEMPLATE
──────────────────

:root {
  /* Colors */
  --color-primary: #XXXXXX;
  --color-primary-light: #XXXXXX;
  --color-secondary: #XXXXXX;
  --color-background: #XXXXXX;
  --color-surface: #XXXXXX;
  --color-text-primary: #XXXXXX;
  --color-text-secondary: #XXXXXX;

  /* Typography */
  --font-display: "[Font]", sans-serif;
  --font-body: "[Font]", sans-serif;

  /* Spacing */
  --space-1: Xpx;
  --space-2: Xpx;
  --space-4: Xpx;
  --space-6: Xpx;
  --space-8: Xpx;

  /* Border Radius */
  --radius-sm: Xpx;
  --radius-md: Xpx;
  --radius-lg: Xpx;
  --radius-xl: Xpx;

  /* Shadows */
  --shadow-sm: [value];
  --shadow-md: [value];
  --shadow-lg: [value];
}

═══════════════════════════════════════════════════════════════
```

### Step 3: Save Files

1. **Take/Save Screenshot**: Save a screenshot of the design to `~/.claude/skill-pocket/ui-designs/screenshots/{style-id}.png`

2. **Save Prompt File**: Save the full prompt to `~/.claude/skill-pocket/ui-designs/prompts/{style-id}.md`

3. **Update styles.json**: Add entry to the styles index file:

```json
{
  "id": "unique-id-based-on-name",
  "name": "Design Style Name",
  "category": "Game",
  "description": "Brief description of the style",
  "sourceUrl": "https://dribbble.com/shots/...",
  "screenshot": "screenshots/{style-id}.png",
  "promptFile": "prompts/{style-id}.md",
  "colors": {
    "primary": "#XXXXXX",
    "secondary": "#XXXXXX",
    "background": "#XXXXXX",
    "text": "#XXXXXX"
  },
  "tags": ["Game", "Playful", "Mobile", "Colorful"],
  "createdAt": "2026-01-17T00:00:00Z"
}
```

### Step 4: Confirm Success

After saving, output:
```
✅ UI Design Specification saved!

📁 Files created:
- Screenshot: ~/.claude/skill-pocket/ui-designs/screenshots/{id}.png
- Prompt: ~/.claude/skill-pocket/ui-designs/prompts/{id}.md
- Updated: ~/.claude/skill-pocket/ui-designs/styles.json

🎨 Style: {Name}
🏷️ Tags: {tags}

Open SkillPocket app to view and copy the design specification.
```

## Example Usage

User: "分析这个设计 https://dribbble.com/shots/24122314-Words-Game-Mobile-App 生成 UI 规范"

Claude:
1. Opens/analyzes the design URL
2. Extracts all design tokens
3. Generates comprehensive specification prompt
4. Saves screenshot, prompt file, and updates styles.json
5. Confirms success with file locations

## Important Notes

- Be extremely precise with color values (use exact hex codes)
- Estimate pixel values based on visual analysis
- Include ALL visible components in the specification
- The prompt should be detailed enough to recreate the exact style
- Always include CSS variables template for easy implementation
- Tags should help users find similar styles later

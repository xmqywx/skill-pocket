// Icon Style - A reusable design style extracted from reference URLs
export interface IconStyle {
  id: string;
  name: string;
  description: string;
  sourceUrl?: string;  // Reference URL (Dribbble, Behance, etc.)
  category: IconStyleCategory;

  // Style analysis
  analysis: {
    visualStyle: string;  // Brief description of the visual style
    colors: {
      primary: string[];   // Primary gradient colors
      secondary?: string[];
      accent?: string[];
      neutral?: string[];
    };
    effects: string[];  // e.g., "Linear gradient", "Drop shadow", "3D highlight"
    characteristics: string[];  // e.g., "Modern", "Friendly", "Corporate"
    iconStyle: string;  // e.g., "White strokes on gradient", "Filled shapes"
    cornerRadius?: number;
    strokeWidth?: number;
    padding?: string;
  };

  // Generation prompt template
  generationPrompt: string;

  // SVG template (optional)
  svgTemplate?: string;

  // Preview SVG (a sample icon using this style)
  previewSvg?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type IconStyleCategory =
  | 'gradient'
  | '3d'
  | 'glassmorphism'
  | 'flat'
  | 'outlined'
  | 'duotone'
  | 'isometric'
  | 'neon'
  | 'minimal'
  | 'custom';

// Icon Set - A collection of icons using a specific style
export interface IconSet {
  id: string;
  name: string;
  styleId: string;  // Reference to IconStyle
  description?: string;

  icons: IconItem[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Individual Icon
export interface IconItem {
  id: string;
  name: string;
  concept: string;  // What the icon represents
  svg: string;      // SVG code
  tags?: string[];
}

// Category display info
export const STYLE_CATEGORIES: Record<IconStyleCategory, { name: string; emoji: string; description: string }> = {
  gradient: { name: 'Gradient', emoji: '🌈', description: 'Gradient backgrounds with clean icons' },
  '3d': { name: '3D', emoji: '📦', description: 'Depth, shadows, and highlights' },
  glassmorphism: { name: 'Glass', emoji: '🪟', description: 'Frosted glass effects' },
  flat: { name: 'Flat', emoji: '⬜', description: 'Solid colors, no effects' },
  outlined: { name: 'Outlined', emoji: '✏️', description: 'Stroke-only icons' },
  duotone: { name: 'Duotone', emoji: '🎭', description: 'Two-tone fills' },
  isometric: { name: 'Isometric', emoji: '🔷', description: '3D isometric perspective' },
  neon: { name: 'Neon', emoji: '💡', description: 'Glow effects' },
  minimal: { name: 'Minimal', emoji: '◯', description: 'Ultra simple' },
  custom: { name: 'Custom', emoji: '🎨', description: 'Custom style' },
};

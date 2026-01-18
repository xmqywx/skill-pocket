import { readTextFile, writeTextFile, readFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { homeDir, join } from '@tauri-apps/api/path';

// Types
export interface UIDesignStyle {
  id: string;
  name: string;
  category: string;
  description: string;
  sourceUrl?: string;
  screenshot: string;        // relative path: screenshots/{id}.png
  promptFile: string;        // relative path: prompts/{id}.md
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface LoadedUIDesign extends UIDesignStyle {
  prompt: string;            // Full prompt content loaded from file
  screenshotPath: string;    // Full absolute path to screenshot
}

// Base path
const UI_DESIGNS_BASE_PATH = '.claude/skill-pocket/ui-designs';

async function getBasePath(): Promise<string> {
  const home = await homeDir();
  return await join(home, UI_DESIGNS_BASE_PATH);
}

async function ensureDir(path: string): Promise<void> {
  const dirExists = await exists(path);
  if (!dirExists) {
    await mkdir(path, { recursive: true });
  }
}

// Load all UI design styles
export async function loadUIDesignStyles(): Promise<UIDesignStyle[]> {
  try {
    const basePath = await getBasePath();
    const stylesPath = await join(basePath, 'styles.json');

    const fileExists = await exists(stylesPath);
    if (!fileExists) {
      return [];
    }

    const content = await readTextFile(stylesPath);
    return JSON.parse(content) as UIDesignStyle[];
  } catch (error) {
    console.error('Failed to load UI design styles:', error);
    return [];
  }
}

// Load a single design with its prompt content
export async function loadUIDesign(styleId: string): Promise<LoadedUIDesign | null> {
  try {
    const styles = await loadUIDesignStyles();
    const style = styles.find(s => s.id === styleId);

    if (!style) {
      return null;
    }

    const basePath = await getBasePath();
    const promptPath = await join(basePath, style.promptFile);
    const screenshotPath = await join(basePath, style.screenshot);

    let prompt = '';
    const promptExists = await exists(promptPath);
    if (promptExists) {
      prompt = await readTextFile(promptPath);
    }

    return {
      ...style,
      prompt,
      screenshotPath,
    };
  } catch (error) {
    console.error('Failed to load UI design:', error);
    return null;
  }
}

// Load all designs with their prompts
export async function loadAllUIDesigns(): Promise<LoadedUIDesign[]> {
  try {
    const styles = await loadUIDesignStyles();
    const basePath = await getBasePath();
    const loadedDesigns: LoadedUIDesign[] = [];

    for (const style of styles) {
      const promptPath = await join(basePath, style.promptFile);
      const screenshotPath = await join(basePath, style.screenshot);

      let prompt = '';
      try {
        const promptExists = await exists(promptPath);
        if (promptExists) {
          prompt = await readTextFile(promptPath);
        }
      } catch (e) {
        console.error(`Failed to load prompt for ${style.id}:`, e);
      }

      loadedDesigns.push({
        ...style,
        prompt,
        screenshotPath,
      });
    }

    return loadedDesigns;
  } catch (error) {
    console.error('Failed to load all UI designs:', error);
    return [];
  }
}

// Save styles metadata
export async function saveUIDesignStyles(styles: UIDesignStyle[]): Promise<void> {
  const basePath = await getBasePath();
  await ensureDir(basePath);
  const stylesPath = await join(basePath, 'styles.json');
  await writeTextFile(stylesPath, JSON.stringify(styles, null, 2));
}

// Save a design prompt
export async function saveUIDesignPrompt(styleId: string, prompt: string): Promise<string> {
  const basePath = await getBasePath();
  const promptsDir = await join(basePath, 'prompts');
  await ensureDir(promptsDir);

  const promptPath = await join(promptsDir, `${styleId}.md`);
  await writeTextFile(promptPath, prompt);

  return promptPath;
}

// Get paths for display
export async function getUIDesignsBasePath(): Promise<string> {
  return await getBasePath();
}

// Get screenshot URL for display (converts file path to asset URL)
export async function getScreenshotUrl(relativePath: string): Promise<string> {
  const basePath = await getBasePath();
  const fullPath = await join(basePath, relativePath);
  // For Tauri, we need to use the asset protocol
  return `asset://localhost/${encodeURIComponent(fullPath)}`;
}

// Read screenshot as base64 data URL for display
export async function readScreenshotAsDataUrl(relativePath: string): Promise<string> {
  try {
    const basePath = await getBasePath();
    const fullPath = await join(basePath, relativePath);

    const fileExists = await exists(fullPath);
    if (!fileExists) {
      console.error('Screenshot file not found:', fullPath);
      return '';
    }

    // Read file as binary
    const bytes = await readFile(fullPath);

    // Convert to base64
    const base64 = btoa(
      Array.from(bytes)
        .map(byte => String.fromCharCode(byte))
        .join('')
    );

    // Determine MIME type from extension
    const ext = relativePath.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' :
                     ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                     ext === 'webp' ? 'image/webp' : 'image/png';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Failed to read screenshot:', error);
    return '';
  }
}

// Refresh/reload all data
export async function refreshUIDesignData(): Promise<{
  styles: UIDesignStyle[];
  designs: LoadedUIDesign[];
}> {
  const styles = await loadUIDesignStyles();
  const designs = await loadAllUIDesigns();
  return { styles, designs };
}

// Category options
export const UI_DESIGN_CATEGORIES = [
  { id: 'game', name: 'Game', emoji: '🎮' },
  { id: 'ecommerce', name: 'E-commerce', emoji: '🛒' },
  { id: 'business', name: 'Business', emoji: '💼' },
  { id: 'social', name: 'Social', emoji: '📱' },
  { id: 'creative', name: 'Creative', emoji: '🎨' },
  { id: 'finance', name: 'Finance', emoji: '💰' },
  { id: 'health', name: 'Health', emoji: '🏥' },
  { id: 'education', name: 'Education', emoji: '📚' },
  { id: 'travel', name: 'Travel', emoji: '✈️' },
  { id: 'food', name: 'Food', emoji: '🍕' },
  { id: 'other', name: 'Other', emoji: '📦' },
];

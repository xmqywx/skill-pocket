import { readTextFile, writeTextFile, readDir, exists, mkdir } from '@tauri-apps/plugin-fs';
import { homeDir, join } from '@tauri-apps/api/path';

// Types
export interface FileIconStyle {
  id: string;
  name: string;
  description: string;
  sourceUrl?: string;
  category: string;
  colors: string[];
  effects: string[];
  characteristics: string[];
  prompt: string;
  createdAt: string;
}

export interface FileIconSet {
  id: string;
  name: string;
  styleId: string;
  description?: string;
  icons: Array<{ name: string; concept: string }>;
  createdAt: string;
}

export interface LoadedIcon {
  name: string;
  concept: string;
  svg: string;
  filePath: string;
}

export interface LoadedIconSet extends FileIconSet {
  loadedIcons: LoadedIcon[];
  folderPath: string;
}

// Base path
const ICONS_BASE_PATH = '.claude/skill-pocket/icons';

async function getBasePath(): Promise<string> {
  const home = await homeDir();
  return await join(home, ICONS_BASE_PATH);
}

async function ensureDir(path: string): Promise<void> {
  const dirExists = await exists(path);
  if (!dirExists) {
    await mkdir(path, { recursive: true });
  }
}

// Load all styles
export async function loadIconStyles(): Promise<FileIconStyle[]> {
  try {
    const basePath = await getBasePath();
    const stylesPath = await join(basePath, 'styles.json');

    const fileExists = await exists(stylesPath);
    if (!fileExists) {
      return [];
    }

    const content = await readTextFile(stylesPath);
    return JSON.parse(content) as FileIconStyle[];
  } catch (error) {
    console.error('Failed to load icon styles:', error);
    return [];
  }
}

// Load all icon sets with their SVGs
export async function loadIconSets(): Promise<LoadedIconSet[]> {
  try {
    const basePath = await getBasePath();
    const setsPath = await join(basePath, 'sets.json');

    const fileExists = await exists(setsPath);
    if (!fileExists) {
      return [];
    }

    const content = await readTextFile(setsPath);
    const sets = JSON.parse(content) as FileIconSet[];

    // Load SVGs for each set
    const loadedSets: LoadedIconSet[] = [];

    for (const set of sets) {
      const svgFolderPath = await join(basePath, 'svgs', set.id);
      const loadedIcons: LoadedIcon[] = [];

      try {
        const svgFolderExists = await exists(svgFolderPath);
        if (svgFolderExists) {
          const files = await readDir(svgFolderPath);

          for (const file of files) {
            if (file.name?.endsWith('.svg')) {
              const iconName = file.name.replace('.svg', '');
              const filePath = await join(svgFolderPath, file.name);
              const svg = await readTextFile(filePath);
              const iconMeta = set.icons.find(i => i.name === iconName);

              loadedIcons.push({
                name: iconName,
                concept: iconMeta?.concept || iconName,
                svg,
                filePath,
              });
            }
          }
        }
      } catch (e) {
        console.error(`Failed to load SVGs for set ${set.id}:`, e);
      }

      loadedSets.push({
        ...set,
        loadedIcons,
        folderPath: svgFolderPath,
      });
    }

    return loadedSets;
  } catch (error) {
    console.error('Failed to load icon sets:', error);
    return [];
  }
}

// Save styles
export async function saveIconStyles(styles: FileIconStyle[]): Promise<void> {
  const basePath = await getBasePath();
  await ensureDir(basePath);
  const stylesPath = await join(basePath, 'styles.json');
  await writeTextFile(stylesPath, JSON.stringify(styles, null, 2));
}

// Save sets metadata
export async function saveIconSets(sets: FileIconSet[]): Promise<void> {
  const basePath = await getBasePath();
  await ensureDir(basePath);
  const setsPath = await join(basePath, 'sets.json');
  await writeTextFile(setsPath, JSON.stringify(sets, null, 2));
}

// Save a single SVG
export async function saveIconSvg(setId: string, iconName: string, svg: string): Promise<string> {
  const basePath = await getBasePath();
  const svgFolderPath = await join(basePath, 'svgs', setId);
  await ensureDir(svgFolderPath);

  const filePath = await join(svgFolderPath, `${iconName}.svg`);
  await writeTextFile(filePath, svg);

  return filePath;
}

// Get paths for display
export async function getIconsBasePath(): Promise<string> {
  return await getBasePath();
}

// Refresh/reload all data
export async function refreshIconData(): Promise<{
  styles: FileIconStyle[];
  sets: LoadedIconSet[];
}> {
  const styles = await loadIconStyles();
  const sets = await loadIconSets();
  return { styles, sets };
}

import { Buffer } from 'buffer';

// Extend Window interface for Buffer polyfill
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Polyfill Buffer for gray-matter in browser environment
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

// Check if running in Tauri context
function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

import matter from 'gray-matter';
import type { Skill } from '@/types/skill';

interface SkillFrontmatter {
  name: string;
  description: string;
  version?: string;
  license?: string;
}

interface PluginInfo {
  name: string;
  path: string;
  marketplace?: string;
}

/**
 * Scan for all installed skills in the Claude directories
 */
export async function scanLocalSkills(): Promise<Skill[]> {
  console.log('[SkillScanner] Starting scan...');

  try {
    // First check if Tauri core is available
    const core = await import('@tauri-apps/api/core');
    console.log('[SkillScanner] Tauri core available:', !!core);

    // Try to import Tauri APIs - will fail in browser context
    const { exists } = await import('@tauri-apps/plugin-fs');
    const { homeDir, join } = await import('@tauri-apps/api/path');

    const skills: Skill[] = [];
    const home = await homeDir();
    const claudeDir = await join(home, '.claude');
    console.log('[SkillScanner] Scanning directory:', claudeDir);

    // Scan paths
    const scanPaths = [
      { path: await join(claudeDir, 'skills'), source: 'local' as const },
      { path: await join(claudeDir, 'plugins', 'marketplaces'), source: 'official' as const },
    ];

    for (const { path, source } of scanPaths) {
      try {
        const dirExists = await exists(path);
        console.log(`[SkillScanner] Path ${path} exists:`, dirExists);
        if (!dirExists) continue;

        if (source === 'local') {
          // Scan direct skills folder
          const foundSkills = await scanSkillsDirectory(path, source);
          console.log(`[SkillScanner] Found ${foundSkills.length} local skills`);
          skills.push(...foundSkills);
        } else {
          // Scan marketplace plugins
          const foundSkills = await scanMarketplaces(path);
          console.log(`[SkillScanner] Found ${foundSkills.length} marketplace skills`);
          skills.push(...foundSkills);
        }
      } catch (error) {
        console.error(`[SkillScanner] Error scanning ${path}:`, error);
      }
    }

    console.log(`[SkillScanner] Total skills found: ${skills.length}`);
    return skills;
  } catch (error) {
    // Not in Tauri context or API error
    console.warn('[SkillScanner] Failed to scan (not in Tauri context?):', error);
    return [];
  }
}

/**
 * Scan a skills directory for SKILL.md files
 */
async function scanSkillsDirectory(
  dirPath: string,
  source: 'local' | 'official' | 'marketplace',
  pluginName?: string
): Promise<Skill[]> {
  const { readDir, exists } = await import('@tauri-apps/plugin-fs');
  const { join } = await import('@tauri-apps/api/path');

  const skills: Skill[] = [];

  try {
    const entries = await readDir(dirPath);

    for (const entry of entries) {
      if (entry.isDirectory && entry.name) {
        const skillDir = await join(dirPath, entry.name);
        const skillFilePath = await join(skillDir, 'SKILL.md');

        try {
          const fileExists = await exists(skillFilePath);
          if (fileExists) {
            const skill = await parseSkillFile(skillFilePath, source, pluginName);
            if (skill) {
              skills.push(skill);
            }
          }
        } catch (error) {
          console.error(`Error checking skill at ${skillDir}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return skills;
}

/**
 * Scan all marketplaces for plugins with skills
 */
async function scanMarketplaces(marketplacesPath: string): Promise<Skill[]> {
  const { readDir, exists } = await import('@tauri-apps/plugin-fs');
  const { join } = await import('@tauri-apps/api/path');

  const skills: Skill[] = [];

  try {
    const marketplaces = await readDir(marketplacesPath);

    for (const marketplace of marketplaces) {
      if (marketplace.isDirectory && marketplace.name) {
        const marketplacePath = await join(marketplacesPath, marketplace.name);
        const pluginsPath = await join(marketplacePath, 'plugins');

        try {
          const pluginsDirExists = await exists(pluginsPath);
          if (!pluginsDirExists) continue;

          const plugins = await readDir(pluginsPath);

          for (const plugin of plugins) {
            if (plugin.isDirectory && plugin.name) {
              const pluginPath = await join(pluginsPath, plugin.name);
              const skillsPath = await join(pluginPath, 'skills');

              try {
                const skillsDirExists = await exists(skillsPath);
                if (skillsDirExists) {
                  const pluginSkills = await scanSkillsDirectory(
                    skillsPath,
                    'official',
                    plugin.name
                  );
                  skills.push(...pluginSkills);
                }
              } catch (error) {
                // Skills directory doesn't exist for this plugin
              }
            }
          }
        } catch (error) {
          console.error(`Error scanning marketplace ${marketplace.name}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading marketplaces:`, error);
  }

  return skills;
}

/**
 * Parse a SKILL.md file and return a Skill object
 */
async function parseSkillFile(
  filePath: string,
  source: 'local' | 'official' | 'marketplace',
  pluginName?: string
): Promise<Skill | null> {
  const { readTextFile } = await import('@tauri-apps/plugin-fs');

  try {
    const content = await readTextFile(filePath);
    const { data, content: markdownContent } = matter(content);
    const frontmatter = data as SkillFrontmatter;

    if (!frontmatter.name || !frontmatter.description) {
      console.warn(`Invalid skill file (missing name or description): ${filePath}`);
      return null;
    }

    const skill: Skill = {
      id: `${source}-${pluginName || 'local'}-${frontmatter.name}`.toLowerCase().replace(/\s+/g, '-'),
      name: frontmatter.name,
      description: frontmatter.description,
      version: frontmatter.version,
      path: filePath,
      pluginName: pluginName,
      source: source,
      content: markdownContent,
      tags: inferTags(frontmatter.name, frontmatter.description, pluginName),
      isFavorite: false,
      useCount: 0,
      installedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return skill;
  } catch (error) {
    console.error(`Error parsing skill file ${filePath}:`, error);
    return null;
  }
}

/**
 * Infer tags based on skill name, description, and plugin name
 */
function inferTags(name: string, description: string, pluginName?: string): string[] {
  const tags: string[] = [];
  const text = `${name} ${description} ${pluginName || ''}`.toLowerCase();

  // Tag mapping
  const tagKeywords: Record<string, string[]> = {
    'ai': ['ai', 'llm', 'claude', 'prompt', 'agent', 'model'],
    'ai-prompt': ['prompt', 'prompting'],
    'ai-agent': ['agent', 'autonomous'],
    'web': ['web', 'html', 'css', 'javascript', 'frontend', 'react', 'vue'],
    'web-3d': ['3d', 'three.js', 'webgl', 'canvas'],
    'web-anim': ['animation', 'gsap', 'motion', 'animate'],
    'web-ui': ['ui', 'component', 'design', 'style'],
    'tools': ['tool', 'utility', 'helper', 'dev', 'development'],
    'data': ['data', 'analytics', 'chart', 'visualization'],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  // If no tags found, add a default
  if (tags.length === 0) {
    tags.push('tools');
  }

  return tags;
}

/**
 * Get list of installed plugins
 */
export async function getInstalledPlugins(): Promise<PluginInfo[]> {
  if (!isTauri()) {
    console.warn('Not running in Tauri context');
    return [];
  }

  const { readDir, exists } = await import('@tauri-apps/plugin-fs');
  const { homeDir, join } = await import('@tauri-apps/api/path');

  const plugins: PluginInfo[] = [];
  const home = await homeDir();
  const marketplacesPath = await join(home, '.claude', 'plugins', 'marketplaces');

  try {
    const dirExists = await exists(marketplacesPath);
    if (!dirExists) return plugins;

    const marketplaces = await readDir(marketplacesPath);

    for (const marketplace of marketplaces) {
      if (marketplace.isDirectory && marketplace.name) {
        const pluginsPath = await join(marketplacesPath, marketplace.name, 'plugins');

        try {
          const pluginsDirExists = await exists(pluginsPath);
          if (!pluginsDirExists) continue;

          const pluginDirs = await readDir(pluginsPath);

          for (const plugin of pluginDirs) {
            if (plugin.isDirectory && plugin.name) {
              plugins.push({
                name: plugin.name,
                path: await join(pluginsPath, plugin.name),
                marketplace: marketplace.name,
              });
            }
          }
        } catch (error) {
          // Ignore errors for individual marketplaces
        }
      }
    }
  } catch (error) {
    console.error('Error getting installed plugins:', error);
  }

  return plugins;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  version?: string;
  path: string;
  pluginName?: string;
  source: 'local' | 'official' | 'marketplace';
  content: string;
  tags: string[];
  coverSvg?: string;
  isFavorite: boolean;
  useCount: number;
  lastUsedAt?: string;
  installedAt: string;
  updatedAt: string;
}

export interface SkillFrontmatter {
  name: string;
  description: string;
  version?: string;
}

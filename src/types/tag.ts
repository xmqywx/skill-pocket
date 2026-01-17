export interface Tag {
  id: string;
  name: string;
  icon?: string; // Lucide icon name
  color: string;
  parentId?: string;
  order: number;
  createdAt: string;
}

export const defaultTags: Tag[] = [
  { id: 'web', name: 'Web Dev', icon: 'Globe', color: '#3B82F6', order: 0, createdAt: new Date().toISOString() },
  { id: 'web-3d', name: '3D', icon: 'Box', color: '#8B5CF6', parentId: 'web', order: 0, createdAt: new Date().toISOString() },
  { id: 'web-anim', name: 'Animation', icon: 'Sparkles', color: '#EC4899', parentId: 'web', order: 1, createdAt: new Date().toISOString() },
  { id: 'web-ui', name: 'UI', icon: 'Palette', color: '#F59E0B', parentId: 'web', order: 2, createdAt: new Date().toISOString() },
  { id: 'ai', name: 'AI', icon: 'Bot', color: '#10B981', order: 1, createdAt: new Date().toISOString() },
  { id: 'ai-prompt', name: 'Prompting', icon: 'MessageSquare', color: '#06B6D4', parentId: 'ai', order: 0, createdAt: new Date().toISOString() },
  { id: 'ai-agent', name: 'Agent', icon: 'Cpu', color: '#8B5CF6', parentId: 'ai', order: 1, createdAt: new Date().toISOString() },
  { id: 'tools', name: 'Tools', icon: 'Wrench', color: '#F59E0B', order: 2, createdAt: new Date().toISOString() },
  { id: 'data', name: 'Data', icon: 'BarChart3', color: '#EF4444', order: 3, createdAt: new Date().toISOString() },
];

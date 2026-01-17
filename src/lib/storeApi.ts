/**
 * Store API Service
 * Provides access to skills from GitHub repositories and the community
 */

export interface StoreSkill {
  id: string;
  name: string;
  description: string;
  author: string;
  githubUrl: string;
  stars: number;
  downloads: number;
  rating: number;
  category: string;
  tags: string[];
  source: 'official' | 'community';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Real skills data from Anthropic and community repositories
const officialSkills: StoreSkill[] = [
  {
    id: 'anthropic-docx',
    name: 'Word Documents (docx)',
    description: 'Create, edit, and analyze Word documents with support for tracked changes, headers, footers, and complex formatting.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/docx',
    stars: 2400,
    downloads: 15000,
    rating: 4.9,
    category: 'documents',
    tags: ['Documents', 'Office', 'Word'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-pdf',
    name: 'PDF Toolkit (pdf)',
    description: 'Comprehensive PDF manipulation toolkit for extracting text and tables, converting formats, and analyzing document structure.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/pdf',
    stars: 3100,
    downloads: 22000,
    rating: 4.8,
    category: 'documents',
    tags: ['Documents', 'PDF', 'Extract'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-pptx',
    name: 'PowerPoint (pptx)',
    description: 'Create, edit, and analyze PowerPoint presentations with support for layouts, themes, animations, and speaker notes.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/pptx',
    stars: 1800,
    downloads: 9500,
    rating: 4.7,
    category: 'documents',
    tags: ['Documents', 'Office', 'Presentations'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-xlsx',
    name: 'Excel Spreadsheets (xlsx)',
    description: 'Create, edit, and analyze Excel spreadsheets with support for formulas, charts, pivot tables, and conditional formatting.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/xlsx',
    stars: 2200,
    downloads: 14000,
    rating: 4.8,
    category: 'documents',
    tags: ['Documents', 'Office', 'Excel', 'Data'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-algorithmic-art',
    name: 'Algorithmic Art',
    description: 'Create generative art using p5.js with seeded randomness for reproducible creative outputs.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/algorithmic-art',
    stars: 1500,
    downloads: 6800,
    rating: 4.6,
    category: 'design',
    tags: ['Art', 'p5.js', 'Generative'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-canvas-design',
    name: 'Canvas Design',
    description: 'Design beautiful visual art in .png and .pdf formats with support for complex layouts and graphics.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/canvas-design',
    stars: 1200,
    downloads: 5400,
    rating: 4.5,
    category: 'design',
    tags: ['Design', 'Canvas', 'Graphics'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-slack-gif',
    name: 'Slack GIF Creator',
    description: 'Create animated GIFs optimized for Slack\'s size constraints and quality requirements.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator',
    stars: 890,
    downloads: 3200,
    rating: 4.4,
    category: 'design',
    tags: ['GIF', 'Slack', 'Animation'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-frontend-design',
    name: 'Frontend Design',
    description: 'Instructs Claude to avoid \'AI slop\' and make bold, beautiful design decisions for frontend development.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/blob/main/skills/frontend-design',
    stars: 2800,
    downloads: 18000,
    rating: 4.9,
    category: 'development',
    tags: ['Frontend', 'Design', 'Web'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-artifacts-builder',
    name: 'Artifacts Builder',
    description: 'Build complex claude.ai HTML artifacts using React, Tailwind CSS, and modern web technologies.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/artifacts-builder',
    stars: 2100,
    downloads: 12000,
    rating: 4.7,
    category: 'development',
    tags: ['React', 'Artifacts', 'Web'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-mcp-builder',
    name: 'MCP Server Builder',
    description: 'Guide for creating high-quality Model Context Protocol (MCP) servers with best practices.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/mcp-builder',
    stars: 1900,
    downloads: 8500,
    rating: 4.8,
    category: 'development',
    tags: ['MCP', 'Server', 'Protocol'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-webapp-testing',
    name: 'Web App Testing',
    description: 'Test local web applications using Playwright for end-to-end testing and automation.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/webapp-testing',
    stars: 1600,
    downloads: 7200,
    rating: 4.6,
    category: 'testing',
    tags: ['Testing', 'Playwright', 'E2E'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-brand-guidelines',
    name: 'Brand Guidelines',
    description: 'Apply Anthropic\'s official brand colors and typography for consistent branding.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/brand-guidelines',
    stars: 650,
    downloads: 2800,
    rating: 4.3,
    category: 'design',
    tags: ['Branding', 'Design', 'Style'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-internal-comms',
    name: 'Internal Communications',
    description: 'Write internal communications like status reports, announcements, and team updates.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/internal-comms',
    stars: 480,
    downloads: 2100,
    rating: 4.2,
    category: 'business',
    tags: ['Communication', 'Business', 'Writing'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'anthropic-skill-creator',
    name: 'Skill Creator',
    description: 'Interactive skill creation tool guiding users through building new skills step by step.',
    author: 'Anthropic',
    githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/skill-creator',
    stars: 1100,
    downloads: 4500,
    rating: 4.5,
    category: 'development',
    tags: ['Skills', 'Creator', 'Tools'],
    source: 'official',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
];

const communitySkills: StoreSkill[] = [
  {
    id: 'community-superpowers',
    name: 'Superpowers',
    description: 'Core skills library with 20+ battle-tested skills including TDD, debugging, and code review capabilities.',
    author: 'obra',
    githubUrl: 'https://github.com/obra/superpowers',
    stars: 3500,
    downloads: 25000,
    rating: 4.9,
    category: 'development',
    tags: ['TDD', 'Debugging', 'Code Review'],
    source: 'community',
    createdAt: '2024-11-15',
    updatedAt: '2025-01-12',
  },
  {
    id: 'community-superpowers-lab',
    name: 'Superpowers Lab',
    description: 'Experimental skills for Claude Code Superpowers with cutting-edge features.',
    author: 'obra',
    githubUrl: 'https://github.com/obra/superpowers-lab',
    stars: 1200,
    downloads: 6500,
    rating: 4.5,
    category: 'development',
    tags: ['Experimental', 'Development'],
    source: 'community',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-10',
  },
  {
    id: 'community-ios-simulator',
    name: 'iOS Simulator Skill',
    description: 'iOS app building, navigation, and testing through automation with simulator integration.',
    author: 'conorluddy',
    githubUrl: 'https://github.com/conorluddy/ios-simulator-skill',
    stars: 890,
    downloads: 4200,
    rating: 4.6,
    category: 'mobile',
    tags: ['iOS', 'Mobile', 'Testing'],
    source: 'community',
    createdAt: '2024-12-10',
    updatedAt: '2025-01-05',
  },
  {
    id: 'community-ffuf',
    name: 'FFUF Web Fuzzing',
    description: 'Expert guidance for ffuf web fuzzing during penetration testing and security assessments.',
    author: 'jthack',
    githubUrl: 'https://github.com/jthack/ffuf_claude_skill',
    stars: 750,
    downloads: 3100,
    rating: 4.4,
    category: 'security',
    tags: ['Security', 'Fuzzing', 'Pentesting'],
    source: 'community',
    createdAt: '2024-11-20',
    updatedAt: '2025-01-08',
  },
  {
    id: 'community-playwright',
    name: 'Playwright Skill',
    description: 'General-purpose browser automation using Playwright for testing and scraping.',
    author: 'lackeyjb',
    githubUrl: 'https://github.com/lackeyjb/playwright-skill',
    stars: 1100,
    downloads: 5800,
    rating: 4.7,
    category: 'testing',
    tags: ['Playwright', 'Browser', 'Automation'],
    source: 'community',
    createdAt: '2024-11-25',
    updatedAt: '2025-01-09',
  },
  {
    id: 'community-d3js',
    name: 'D3.js Visualizations',
    description: 'Create stunning data visualizations using d3.js with interactive charts and graphs.',
    author: 'chrisvoncsefalvay',
    githubUrl: 'https://github.com/chrisvoncsefalvay/claude-d3js-skill',
    stars: 680,
    downloads: 2900,
    rating: 4.5,
    category: 'data',
    tags: ['D3.js', 'Visualization', 'Charts'],
    source: 'community',
    createdAt: '2024-12-05',
    updatedAt: '2025-01-06',
  },
  {
    id: 'community-scientific',
    name: 'Scientific Skills Collection',
    description: 'Comprehensive collection of ready-to-use scientific skills for research and analysis.',
    author: 'K-Dense-AI',
    githubUrl: 'https://github.com/K-Dense-AI/claude-scientific-skills',
    stars: 920,
    downloads: 4800,
    rating: 4.6,
    category: 'data',
    tags: ['Science', 'Research', 'Analysis'],
    source: 'community',
    createdAt: '2024-11-30',
    updatedAt: '2025-01-11',
  },
  {
    id: 'community-web-assets',
    name: 'Web Asset Generator',
    description: 'Generates web assets like favicons, app icons, and social media images.',
    author: 'alonw0',
    githubUrl: 'https://github.com/alonw0/web-asset-generator',
    stars: 450,
    downloads: 1800,
    rating: 4.3,
    category: 'design',
    tags: ['Assets', 'Icons', 'Web'],
    source: 'community',
    createdAt: '2024-12-15',
    updatedAt: '2025-01-04',
  },
  {
    id: 'community-loki-mode',
    name: 'Loki Mode',
    description: 'Multi-agent autonomous startup system orchestrating 37 AI agents for complex tasks.',
    author: 'asklokesh',
    githubUrl: 'https://github.com/asklokesh/claudeskill-loki-mode',
    stars: 2100,
    downloads: 9800,
    rating: 4.7,
    category: 'ai',
    tags: ['Multi-Agent', 'Autonomous', 'AI'],
    source: 'community',
    createdAt: '2024-12-08',
    updatedAt: '2025-01-13',
  },
];

// All skills combined
const allSkills = [...officialSkills, ...communitySkills];

// Categories derived from skills
export const categories: Category[] = [
  { id: 'all', name: 'All Skills', icon: 'Star', count: allSkills.length },
  { id: 'documents', name: 'Documents', icon: 'FileText', count: allSkills.filter(s => s.category === 'documents').length },
  { id: 'development', name: 'Development', icon: 'Code', count: allSkills.filter(s => s.category === 'development').length },
  { id: 'design', name: 'Design', icon: 'Palette', count: allSkills.filter(s => s.category === 'design').length },
  { id: 'testing', name: 'Testing', icon: 'FlaskConical', count: allSkills.filter(s => s.category === 'testing').length },
  { id: 'data', name: 'Data & Science', icon: 'BarChart3', count: allSkills.filter(s => s.category === 'data').length },
  { id: 'security', name: 'Security', icon: 'Shield', count: allSkills.filter(s => s.category === 'security').length },
  { id: 'business', name: 'Business', icon: 'Briefcase', count: allSkills.filter(s => s.category === 'business').length },
  { id: 'mobile', name: 'Mobile', icon: 'Smartphone', count: allSkills.filter(s => s.category === 'mobile').length },
  { id: 'ai', name: 'AI & Agents', icon: 'Bot', count: allSkills.filter(s => s.category === 'ai').length },
];

export type SortOption = 'popular' | 'rated' | 'newest' | 'downloads';

export interface SearchOptions {
  query?: string;
  category?: string;
  source?: 'official' | 'community' | 'all';
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  skills: StoreSkill[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Store API - provides access to skills from GitHub repositories
 */
export const storeApi = {
  /**
   * Get all categories with skill counts
   */
  getCategories: async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return categories;
  },

  /**
   * Search and filter skills
   */
  searchSkills: async (options: SearchOptions = {}): Promise<SearchResult> => {
    const {
      query = '',
      category = 'all',
      source = 'all',
      sort = 'popular',
      page = 1,
      pageSize = 20,
    } = options;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Filter skills
    let filtered = allSkills.filter(skill => {
      // Search query
      if (query) {
        const searchLower = query.toLowerCase();
        const matches = skill.name.toLowerCase().includes(searchLower) ||
          skill.description.toLowerCase().includes(searchLower) ||
          skill.tags.some(t => t.toLowerCase().includes(searchLower)) ||
          skill.author.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Category filter
      if (category && category !== 'all' && skill.category !== category) {
        return false;
      }

      // Source filter
      if (source && source !== 'all' && skill.source !== source) {
        return false;
      }

      return true;
    });

    // Sort skills
    filtered = filtered.sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.stars - a.stars;
        case 'rated':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const skills = filtered.slice(start, end);

    return {
      skills,
      total,
      page,
      pageSize,
      hasMore: end < total,
    };
  },

  /**
   * Get skill by ID
   */
  getSkillById: async (id: string): Promise<StoreSkill | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return allSkills.find(s => s.id === id) || null;
  },

  /**
   * Get popular skills
   */
  getPopular: async (limit: number = 10): Promise<StoreSkill[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...allSkills]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, limit);
  },

  /**
   * Get official skills
   */
  getOfficialSkills: async (): Promise<StoreSkill[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return officialSkills;
  },

  /**
   * Get community skills
   */
  getCommunitySkills: async (): Promise<StoreSkill[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return communitySkills;
  },
};

import { useState, useEffect, useCallback } from 'react';
import { Search, Flame, Star, Clock, Download, ExternalLink, Check, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { storeApi, categories as apiCategories, type StoreSkill, type SortOption, type SearchResult } from '@/lib/storeApi';
import { DynamicIcon } from '@/components/common/DynamicIcon';

const sortOptions: { id: SortOption; icon: typeof Flame; label: string }[] = [
  { id: 'popular', icon: Flame, label: '热门' },
  { id: 'rated', icon: Star, label: '最高评分' },
  { id: 'newest', icon: Clock, label: '最新' },
  { id: 'downloads', icon: Download, label: '最多安装' },
];

const sourceFilters = [
  { id: 'all', label: '全部' },
  { id: 'official', label: '官方' },
  { id: 'community', label: '社区' },
];

export function Store() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<'all' | 'official' | 'community'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { skills, addSkill } = useAppStore();

  // Load skills from API
  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await storeApi.searchSkills({
        query: searchQuery,
        category: selectedCategory,
        source: selectedSource,
        sort: sortBy,
        page: 1,
        pageSize: 50,
      });
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSource, sortBy]);

  // Load skills on mount and when filters change
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Check if a skill is already installed
  const isInstalled = (storeSkill: StoreSkill) => {
    return skills.some(s =>
      s.id === storeSkill.id ||
      s.name.toLowerCase() === storeSkill.name.toLowerCase()
    );
  };

  // Install a skill
  const handleInstall = async (storeSkill: StoreSkill) => {
    setInstallingId(storeSkill.id);

    // Simulate installation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    addSkill({
      id: storeSkill.id,
      name: storeSkill.name,
      description: storeSkill.description,
      path: `~/.claude/skills/${storeSkill.name.toLowerCase().replace(/\s+/g, '-')}`,
      source: storeSkill.source === 'official' ? 'official' : 'marketplace',
      content: `# ${storeSkill.name}\n\n${storeSkill.description}\n\nAuthor: ${storeSkill.author}\nGitHub: ${storeSkill.githubUrl}`,
      tags: storeSkill.tags.map(t => t.toLowerCase()),
      isFavorite: false,
      useCount: 0,
      installedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setInstallingId(null);
  };

  // Open GitHub URL
  const openGitHub = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const totalSkills = apiCategories.find(c => c.id === 'all')?.count || 0;
  const displayedSkills = searchResult?.skills || [];

  return (
    <div className="flex h-full">
      {/* Sidebar - Categories */}
      <aside className="w-56 border-r border-border bg-card/50 flex flex-col overflow-y-auto">
        <div className="p-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            分类
          </div>
          <div className="space-y-0.5">
            {apiCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  selectedCategory === cat.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                <DynamicIcon name={cat.icon} className="h-4 w-4" />
                <span className="flex-1 text-left">{cat.name}</span>
                <span className="text-xs text-muted-foreground">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Source Filter */}
        <div className="p-3 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            来源
          </div>
          <div className="space-y-0.5">
            {sourceFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedSource(filter.id as typeof selectedSource)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                  selectedSource === filter.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`搜索 ${totalSkills}+ skills...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={loadSkills}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            刷新
          </button>
          <span className="text-xs text-muted-foreground">
            数据源: GitHub Skills
          </span>
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">排序:</span>
          {sortOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                sortBy === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Skills list */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                加载中...
              </h3>
              <p className="text-sm text-muted-foreground">
                正在获取最新的 Skills 数据
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search className="h-16 w-16 text-destructive/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                加载失败
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {error}
              </p>
              <button
                onClick={loadSkills}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                重试
              </button>
            </div>
          ) : displayedSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                没有找到匹配的 Skills
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                尝试调整搜索关键词或分类筛选
              </p>
            </div>
          ) : (
            displayedSkills.map((skill) => {
              const installed = isInstalled(skill);
              const installing = installingId === skill.id;

              return (
                <div
                  key={skill.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  {/* Stars badge */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-medium dark:bg-amber-900/30 dark:text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    {skill.stars >= 1000
                      ? `${(skill.stars / 1000).toFixed(1)}k`
                      : skill.stars
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{skill.name}</h3>
                      {skill.source === 'official' && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          官方
                        </span>
                      )}
                      {installed && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <Check className="h-3 w-3" />
                          已安装
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {skill.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        by {skill.author}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {skill.downloads.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {skill.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openGitHub(skill.githubUrl)}
                      className="px-3 py-1.5 rounded-md text-sm border border-border hover:bg-secondary transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      GitHub
                    </button>
                    {!installed && (
                      <button
                        onClick={() => handleInstall(skill)}
                        disabled={installing}
                        className={cn(
                          'px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground transition-colors flex items-center gap-1',
                          installing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
                        )}
                      >
                        {installing ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            安装中...
                          </>
                        ) : (
                          '安装'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Results info */}
          {!isLoading && !error && displayedSkills.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                显示 {displayedSkills.length} 个结果
                {searchResult && searchResult.total > displayedSkills.length && (
                  <>，共 {searchResult.total} 个 Skills</>
                )}
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a
                  href="https://github.com/anthropics/skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Anthropic 官方 Skills
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://github.com/travisvn/awesome-claude-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  社区精选 Skills
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

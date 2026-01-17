import { useState, useEffect, useCallback } from 'react';
import { Search, Check, Loader2, Sparkles, ExternalLink, ChevronRight, RefreshCw, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadIconStyles, loadIconSets, getIconsBasePath,
  type FileIconStyle, type LoadedIconSet, type LoadedIcon
} from '@/services/iconStorage';

// Icon Collections for Browse
const ICON_COLLECTIONS = {
  popular: [
    { prefix: 'lucide', name: 'Lucide', color: '#F56565' },
    { prefix: 'ph', name: 'Phosphor', color: '#48BB78' },
    { prefix: 'heroicons', name: 'Heroicons', color: '#4299E1' },
    { prefix: 'tabler', name: 'Tabler', color: '#9F7AEA' },
  ],
  emoji: [
    { prefix: 'fluent-emoji', name: 'Fluent Emoji', color: '#FFB020' },
    { prefix: 'noto', name: 'Noto Emoji', color: '#34A853' },
    { prefix: 'twemoji', name: 'Twemoji', color: '#1DA1F2' },
  ],
  stylized: [
    { prefix: 'carbon', name: 'Carbon', color: '#161616' },
    { prefix: 'ant-design', name: 'Ant Design', color: '#1890FF' },
    { prefix: 'mingcute', name: 'MingCute', color: '#FF6B6B' },
    { prefix: 'solar', name: 'Solar', color: '#FF9500' },
  ],
};

interface IconInfo {
  prefix: string;
  name: string;
}

export function Icons() {
  const [activeTab, setActiveTab] = useState<'browse' | 'myIcons'>('myIcons');
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [selectedCollection, setSelectedCollection] = useState('lucide');
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<IconInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<IconInfo | null>(null);

  // File-based data
  const [fileStyles, setFileStyles] = useState<FileIconStyle[]>([]);
  const [fileSets, setFileSets] = useState<LoadedIconSet[]>([]);
  const [basePath, setBasePath] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  const allCollections = Object.values(ICON_COLLECTIONS).flat();
  const currentCollections = ICON_COLLECTIONS[selectedCategory as keyof typeof ICON_COLLECTIONS] || [];

  // Load data from files
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [styles, sets, path] = await Promise.all([
        loadIconStyles(),
        loadIconSets(),
        getIconsBasePath(),
      ]);
      setFileStyles(styles);
      setFileSets(sets);
      setBasePath(path);
    } catch (error) {
      console.error('Failed to load icon data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch icons from Iconify API
  const fetchIcons = useCallback(async (collection: string, query?: string) => {
    setLoading(true);
    try {
      const url = query
        ? `https://api.iconify.design/search?query=${encodeURIComponent(query)}&prefix=${collection}&limit=80`
        : `https://api.iconify.design/collection?prefix=${collection}`;
      const response = await fetch(url);
      const data = await response.json();
      if (query) {
        setIcons(data.icons?.map((icon: string) => {
          const [prefix, name] = icon.split(':');
          return { prefix, name };
        }) || []);
      } else {
        const iconNames = data.uncategorized || (data.categories ? Object.values(data.categories).flat() : []) || [];
        setIcons((iconNames as string[]).slice(0, 100).map(name => ({ prefix: collection, name })));
      }
    } catch {
      setIcons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'browse') {
      const timer = setTimeout(() => {
        fetchIcons(selectedCollection, searchQuery || undefined);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, selectedCollection, activeTab, fetchIcons]);

  const getIconSvgUrl = (prefix: string, name: string, size = 24) =>
    `https://api.iconify.design/${prefix}/${name}.svg?height=${size}`;

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Get icon sets for a style
  const getSetsForStyle = (styleId: string) => fileSets.filter(s => s.styleId === styleId);

  // Get all icons for a style
  const getIconsForStyle = (styleId: string): LoadedIcon[] => {
    return getSetsForStyle(styleId).flatMap(set => set.loadedIcons);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[
              { id: 'myIcons', label: 'My Icons' },
              { id: 'browse', label: 'Browse Libraries' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} /> Refresh
          </button>
        </div>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-44 border-r border-border p-4 overflow-y-auto">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Categories</div>
            {Object.entries(ICON_COLLECTIONS).map(([key, collections]) => (
              <button
                key={key}
                onClick={() => { setSelectedCategory(key); setSelectedCollection(collections[0].prefix); }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                  selectedCategory === key ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'
                )}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border space-y-3">
              <div className="flex flex-wrap gap-2">
                {currentCollections.map((collection) => (
                  <button
                    key={collection.prefix}
                    onClick={() => setSelectedCollection(collection.prefix)}
                    className={cn('px-3 py-1.5 rounded-full text-sm font-medium transition-all', selectedCollection === collection.prefix ? 'text-white' : 'bg-secondary text-muted-foreground')}
                    style={{ backgroundColor: selectedCollection === collection.prefix ? collection.color : undefined }}
                  >
                    {collection.name}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : icons.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">No icons found</div>
              ) : (
                <div className="grid grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={`${icon.prefix}:${icon.name}`}
                      onClick={() => setSelectedIcon(icon)}
                      className={cn('aspect-square flex items-center justify-center p-2 rounded-lg border transition-all hover:border-primary', selectedIcon?.name === icon.name ? 'border-primary bg-primary/10' : 'border-border')}
                      title={icon.name}
                    >
                      <img src={getIconSvgUrl(icon.prefix, icon.name)} alt={icon.name} className="w-6 h-6 dark:invert" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedIcon && (
              <div className="border-t border-border p-4 bg-card/50 flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center bg-background rounded-lg border">
                  <img src={getIconSvgUrl(selectedIcon.prefix, selectedIcon.name, 32)} alt={selectedIcon.name} className="w-8 h-8 dark:invert" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{selectedIcon.name}</div>
                  <div className="text-sm text-muted-foreground">{allCollections.find(c => c.prefix === selectedIcon.prefix)?.name}</div>
                </div>
                <button onClick={() => copyToClipboard(`<Icon icon="${selectedIcon.prefix}:${selectedIcon.name}" />`, 'react')}
                  className={cn('px-3 py-2 rounded-md text-sm font-medium', copiedText === 'react' ? 'bg-green-500 text-white' : 'bg-secondary')}>
                  {copiedText === 'react' ? <Check className="w-4 h-4" /> : 'Copy React'}
                </button>
                <button onClick={async () => {
                  const svg = await fetch(getIconSvgUrl(selectedIcon.prefix, selectedIcon.name)).then(r => r.text());
                  copyToClipboard(svg, 'svg');
                }} className={cn('px-3 py-2 rounded-md text-sm font-medium', copiedText === 'svg' ? 'bg-green-500 text-white' : 'bg-secondary')}>
                  {copiedText === 'svg' ? <Check className="w-4 h-4" /> : 'Copy SVG'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Icons Tab */}
      {activeTab === 'myIcons' && (
        <div className="flex-1 overflow-y-auto">
          {/* Detail View */}
          {selectedStyleId ? (
            (() => {
              const style = fileStyles.find(s => s.id === selectedStyleId);
              const styleIcons = getIconsForStyle(selectedStyleId);
              if (!style) return null;
              return (
                <div className="h-full flex flex-col">
                  {/* Detail Header */}
                  <div className="px-6 py-4 border-b border-border bg-card/50">
                    <button onClick={() => setSelectedStyleId(null)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
                      <ChevronRight className="w-4 h-4 rotate-180" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{
                        background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1] || style.colors[0]})`
                      }} />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold">{style.name}</h2>
                        <p className="text-sm text-muted-foreground">{styleIcons.length} icons • {style.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {style.colors.map((color, i) => (
                          <button key={i} onClick={() => copyToClipboard(color, `color-${i}`)}
                            className="w-8 h-8 rounded-lg border-2 border-border hover:border-primary transition-colors"
                            style={{ backgroundColor: color }} title={color} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Style Info */}
                  <div className="px-6 py-4 border-b border-border bg-secondary/20">
                    {style.sourceUrl && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="text-muted-foreground">Reference:</span>
                        <a href={style.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> {style.sourceUrl}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground uppercase font-medium">Generation Prompt</span>
                          <button onClick={() => copyToClipboard(style.prompt, 'prompt')}
                            className={cn('text-xs px-2 py-1 rounded', copiedText === 'prompt' ? 'bg-green-500 text-white' : 'bg-secondary hover:bg-secondary/80')}>
                            {copiedText === 'prompt' ? 'Copied!' : 'Copy Prompt'}
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{style.prompt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs">
                      <Folder className="w-3 h-3 text-muted-foreground" />
                      <code className="text-muted-foreground">{basePath}/svgs/</code>
                      <button onClick={() => copyToClipboard(`${basePath}/svgs/`, 'path')}
                        className={cn('px-2 py-0.5 rounded', copiedText === 'path' ? 'bg-green-500 text-white' : 'text-primary hover:bg-secondary')}>
                        {copiedText === 'path' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Icons Grid */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {styleIcons.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="mb-2">No icons generated yet.</p>
                        <p className="text-sm">Ask Claude to create icons with this style!</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-5">
                        {styleIcons.map((icon) => (
                          <div
                            key={icon.filePath}
                            onClick={() => copyToClipboard(icon.svg, `icon-${icon.name}`)}
                            className="flex flex-col items-center cursor-pointer group"
                            title={`${icon.name}\nClick to copy SVG`}
                          >
                            <div className="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors relative">
                              <div dangerouslySetInnerHTML={{ __html: icon.svg }} className="w-9 h-9 [&>svg]:w-full [&>svg]:h-full" />
                              {copiedText === `icon-${icon.name}` && (
                                <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-xl">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1.5 max-w-[70px] truncate text-center">{icon.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            /* Card List View */
            <div className="p-6">
              {/* API Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Claude writes icons to:</span>
                  <code className="text-xs bg-background px-2 py-1 rounded font-mono">{basePath}/</code>
                  <button onClick={() => copyToClipboard(basePath, 'base-path')}
                    className={cn('text-xs px-2 py-1 rounded', copiedText === 'base-path' ? 'bg-green-500 text-white' : 'text-primary hover:bg-secondary')}>
                    {copiedText === 'base-path' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {fileStyles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No icon styles yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ask Claude to create icons based on a reference design.
                  </p>
                  <div className="bg-secondary/50 rounded-xl p-4 max-w-lg mx-auto text-left">
                    <p className="text-sm text-muted-foreground mb-2">Try saying:</p>
                    <code className="text-sm bg-background p-3 rounded-lg block">
                      "参考 https://dribbble.com/shots/... 帮我设计一套图标"
                    </code>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fileStyles.map((style) => {
                    const styleIcons = getIconsForStyle(style.id);
                    return (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyleId(style.id)}
                        className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all"
                      >
                        {/* Preview Area */}
                        <div className="h-32 p-4 flex items-center justify-center gap-3" style={{
                          background: `linear-gradient(135deg, ${style.colors[0]}15, ${style.colors[1] || style.colors[0]}15)`
                        }}>
                          {styleIcons.slice(0, 5).map((icon, i) => (
                            <div key={i} className="w-10 h-10 flex items-center justify-center">
                              <div dangerouslySetInnerHTML={{ __html: icon.svg }} className="w-7 h-7 [&>svg]:w-full [&>svg]:h-full" />
                            </div>
                          ))}
                          {styleIcons.length === 0 && (
                            <span className="text-sm text-muted-foreground">No icons yet</span>
                          )}
                          {styleIcons.length > 5 && (
                            <span className="text-sm text-muted-foreground">+{styleIcons.length - 5}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium group-hover:text-primary transition-colors">{style.name}</h3>
                              <p className="text-sm text-muted-foreground">{styleIcons.length} icons • {style.category}</p>
                            </div>
                            <div className="flex -space-x-1">
                              {style.colors.map((color, i) => (
                                <div key={i} className="w-5 h-5 rounded-full border-2 border-background" style={{ backgroundColor: color }} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{style.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

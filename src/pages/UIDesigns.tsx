import { useState, useEffect, useCallback } from 'react';
import { Search, Check, Loader2, Sparkles, ExternalLink, ChevronRight, RefreshCw, Folder, Copy, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadUIDesignStyles, loadUIDesign, getUIDesignsBasePath, readScreenshotAsDataUrl,
  UI_DESIGN_CATEGORIES,
  type UIDesignStyle, type LoadedUIDesign
} from '@/services/uiDesignStorage';

export function UIDesigns() {
  const [styles, setStyles] = useState<UIDesignStyle[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<LoadedUIDesign | null>(null);
  const [basePath, setBasePath] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [screenshotCache, setScreenshotCache] = useState<Record<string, string>>({});

  // Load data from files
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [loadedStyles, path] = await Promise.all([
        loadUIDesignStyles(),
        getUIDesignsBasePath(),
      ]);
      setStyles(loadedStyles);
      setBasePath(path);
    } catch (error) {
      console.error('Failed to load UI design data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load full design when selected
  const handleSelectDesign = async (styleId: string) => {
    try {
      const design = await loadUIDesign(styleId);
      setSelectedDesign(design);
    } catch (error) {
      console.error('Failed to load design:', error);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter styles
  const filteredStyles = styles.filter(style => {
    const matchesSearch = !searchQuery ||
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      style.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Load screenshot as base64
  const loadScreenshot = useCallback(async (relativePath: string) => {
    if (screenshotCache[relativePath]) return;
    try {
      const dataUrl = await readScreenshotAsDataUrl(relativePath);
      if (dataUrl) {
        setScreenshotCache(prev => ({ ...prev, [relativePath]: dataUrl }));
      }
    } catch (error) {
      console.error('Failed to load screenshot:', error);
    }
  }, [screenshotCache]);

  // Load screenshots for visible styles
  useEffect(() => {
    styles.forEach(style => {
      if (style.screenshot && !screenshotCache[style.screenshot]) {
        loadScreenshot(style.screenshot);
      }
    });
  }, [styles, loadScreenshot, screenshotCache]);

  // Get screenshot URL from cache
  const getScreenshotSrc = (relativePath: string) => {
    return screenshotCache[relativePath] || '';
  };

  // Get category counts
  const categoryCounts = styles.reduce((acc, style) => {
    const cat = style.category.toLowerCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">UI Design Kit</h1>
            <span className="text-sm text-muted-foreground">({styles.length} styles)</span>
          </div>
          <button onClick={loadData} disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} /> Refresh
          </button>
        </div>
      </div>

      {/* Detail View */}
      {selectedDesign ? (
        <div className="flex-1 overflow-y-auto">
          {/* Detail Header */}
          <div className="px-6 py-4 border-b border-border bg-card/50">
            <button onClick={() => setSelectedDesign(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <div className="flex items-start gap-6">
              {/* Screenshot Preview */}
              <div className="w-48 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                {selectedDesign.screenshot && (
                  <img
                    src={getScreenshotSrc(selectedDesign.screenshot)}
                    alt={selectedDesign.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">{selectedDesign.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">{selectedDesign.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    {UI_DESIGN_CATEGORIES.find(c => c.id === selectedDesign.category.toLowerCase())?.emoji || '📦'}
                    <span className="text-muted-foreground">{selectedDesign.category}</span>
                  </span>
                  {selectedDesign.sourceUrl && (
                    <a href={selectedDesign.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  {Object.entries(selectedDesign.colors).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => copyToClipboard(color, `color-${key}`)}
                      className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => copyToClipboard(selectedDesign.prompt, 'full-prompt')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    copiedText === 'full-prompt'
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {copiedText === 'full-prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText === 'full-prompt' ? 'Copied!' : 'Copy Full Prompt'}
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="px-6 py-3 border-b border-border bg-secondary/20">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Tags:</span>
              {selectedDesign.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <Folder className="w-3 h-3 text-muted-foreground" />
              <code className="text-muted-foreground">{basePath}/prompts/</code>
              <button onClick={() => copyToClipboard(`${basePath}/prompts/`, 'path')}
                className={cn('px-2 py-0.5 rounded', copiedText === 'path' ? 'bg-green-500 text-white' : 'text-primary hover:bg-secondary')}>
                {copiedText === 'path' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Design Specification Prompt</h3>
              <button
                onClick={() => copyToClipboard(selectedDesign.prompt, 'prompt-section')}
                className={cn(
                  'text-xs px-3 py-1 rounded-md',
                  copiedText === 'prompt-section' ? 'bg-green-500 text-white' : 'bg-secondary hover:bg-secondary/80'
                )}
              >
                {copiedText === 'prompt-section' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {selectedDesign.prompt || 'No prompt content available.'}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-border p-4 overflow-y-auto">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Categories</div>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              All ({styles.length})
            </button>
            {UI_DESIGN_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.id] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    selectedCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {cat.emoji} {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search design styles..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Empty State */}
              {styles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No UI design styles yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ask Claude to analyze a design and generate a UI specification.
                  </p>
                  <div className="bg-secondary/50 rounded-xl p-4 max-w-lg mx-auto text-left">
                    <p className="text-sm text-muted-foreground mb-2">Try saying:</p>
                    <code className="text-sm bg-background p-3 rounded-lg block">
                      "分析 https://dribbble.com/shots/... 生成 UI 规范"
                    </code>
                  </div>
                </div>
              ) : filteredStyles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  No styles match your search
                </div>
              ) : (
                /* Info Banner */
                <>
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Claude saves UI specs to:</span>
                      <code className="text-xs bg-background px-2 py-1 rounded font-mono">{basePath}/</code>
                      <button onClick={() => copyToClipboard(basePath, 'base-path')}
                        className={cn('text-xs px-2 py-1 rounded', copiedText === 'base-path' ? 'bg-green-500 text-white' : 'text-primary hover:bg-secondary')}>
                        {copiedText === 'base-path' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStyles.map((style) => (
                      <div
                        key={style.id}
                        onClick={() => handleSelectDesign(style.id)}
                        className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all"
                      >
                        {/* Screenshot Preview */}
                        <div className="h-36 bg-secondary relative overflow-hidden">
                          {style.screenshot ? (
                            <img
                              src={getScreenshotSrc(style.screenshot)}
                              alt={style.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Palette className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                          {/* Color Pills */}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            {Object.values(style.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                                {style.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {UI_DESIGN_CATEGORIES.find(c => c.id === style.category.toLowerCase())?.emoji || '📦'} {style.category}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{style.description}</p>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {style.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 text-xs bg-secondary rounded">
                                {tag}
                              </span>
                            ))}
                            {style.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{style.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

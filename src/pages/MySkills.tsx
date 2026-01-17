import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { GreenlineIcon } from '@/components/common/GreenlineIcon';
import { TagEditorModal } from '@/components/tags/TagEditorModal';
import { SkillDetailModal } from '@/components/skills/SkillDetailModal';
import type { Tag } from '@/types/tag';
import type { Skill } from '@/types/skill';

export function MySkills() {
  const { t } = useTranslation();
  const { skills, tags, searchQuery, setSearchQuery, viewMode, setViewMode, selectedTagId, setSelectedTagId, updateSkill, loadSkills, isLoading, loadError } = useAppStore();
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set(['web', 'ai']));

  // Modal states
  const [isTagEditorOpen, setIsTagEditorOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Load skills on mount - with delay to ensure Tauri is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSkills();
    }, 500);
    return () => clearTimeout(timer);
  }, [loadSkills]);

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      !searchQuery ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTagId === '__favorites__') {
      return matchesSearch && skill.isFavorite;
    }

    if (selectedTagId === '__recent__') {
      return matchesSearch;
    }

    const matchesTag = !selectedTagId || skill.tags.includes(selectedTagId);

    return matchesSearch && matchesTag;
  });

  // Sort by recent if recent filter
  const sortedSkills = selectedTagId === '__recent__'
    ? [...filteredSkills].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : filteredSkills;

  // Build tag tree
  const rootTags = tags.filter((t) => !t.parentId);
  const getChildTags = (parentId: string) => tags.filter((t) => t.parentId === parentId);

  const toggleTagExpand = (tagId: string) => {
    setExpandedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const favoriteCount = skills.filter((s) => s.isFavorite).length;

  const toggleFavorite = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      updateSkill(skillId, { isFavorite: !skill.isFavorite });
    }
  };

  const getSkillCountForTag = (tagId: string) => {
    return skills.filter(s => s.tags.includes(tagId)).length;
  };

  const openTagEditor = (tag?: Tag) => {
    setEditingTag(tag || null);
    setIsTagEditorOpen(true);
  };

  const openSkillDetail = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-card/50 flex flex-col">
        <div className="p-3 space-y-1">
          {/* All skills */}
          <button
            onClick={() => setSelectedTagId(null)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              !selectedTagId || (selectedTagId !== '__favorites__' && selectedTagId !== '__recent__' && !tags.find(t => t.id === selectedTagId))
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-secondary'
            )}
          >
            <GreenlineIcon name="folder" size={16} />
            <span>{t('mySkills.all')}</span>
            <span className="ml-auto text-xs text-muted-foreground">({skills.length})</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => setSelectedTagId('__favorites__')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              selectedTagId === '__favorites__'
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-secondary'
            )}
          >
            <GreenlineIcon name="heart" size={16} />
            <span>{t('mySkills.favorites')}</span>
            <span className="ml-auto text-xs text-muted-foreground">({favoriteCount})</span>
          </button>

          {/* Recent */}
          <button
            onClick={() => setSelectedTagId('__recent__')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
              selectedTagId === '__recent__'
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-secondary'
            )}
          >
            <GreenlineIcon name="clock" size={16} />
            <span>{t('mySkills.recent')}</span>
          </button>
        </div>

        {/* Tags */}
        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            <GreenlineIcon name="tags" size={12} />
            {t('mySkills.tags')}
          </div>
          <div className="space-y-0.5">
            {rootTags.map((tag) => {
              const hasChildren = getChildTags(tag.id).length > 0;
              const isExpanded = expandedTags.has(tag.id);
              const tagSkillCount = getSkillCountForTag(tag.id);

              return (
                <div key={tag.id}>
                  <div className="group flex items-center">
                    <button
                      onClick={() => {
                        setSelectedTagId(tag.id);
                        if (hasChildren) {
                          toggleTagExpand(tag.id);
                        }
                      }}
                      className={cn(
                        'flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                        selectedTagId === tag.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-secondary'
                      )}
                    >
                      {hasChildren ? (
                        isExpanded ? (
                          <GreenlineIcon name="chevronDown" size={12} className="flex-shrink-0 opacity-60" />
                        ) : (
                          <GreenlineIcon name="chevronRight" size={12} className="flex-shrink-0 opacity-60" />
                        )
                      ) : (
                        <span className="w-3 flex-shrink-0" />
                      )}
                      <DynamicIcon name={tag.icon || 'Circle'} className="h-4 w-4 flex-shrink-0" style={{ color: tag.color }} />
                      <span className="flex-1 text-left truncate">{tag.name}</span>
                      {tagSkillCount > 0 && (
                        <span className="text-xs text-muted-foreground">({tagSkillCount})</span>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTagEditor(tag);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <GreenlineIcon name="edit" size={12} />
                    </button>
                  </div>
                  {isExpanded && hasChildren && (
                    <div className="ml-4 pl-2 border-l border-border space-y-0.5 mt-0.5">
                      {getChildTags(tag.id).map((child) => {
                        const childCount = getSkillCountForTag(child.id);
                        return (
                          <div key={child.id} className="group flex items-center">
                            <button
                              onClick={() => setSelectedTagId(child.id)}
                              className={cn(
                                'flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                                selectedTagId === child.id
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                              )}
                            >
                              <DynamicIcon name={child.icon || 'Circle'} className="h-3.5 w-3.5 flex-shrink-0" style={{ color: child.color }} />
                              <span className="flex-1 text-left truncate">{child.name}</span>
                              {childCount > 0 && (
                                <span className="text-xs text-muted-foreground">({childCount})</span>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openTagEditor(child);
                              }}
                              className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                            >
                              <GreenlineIcon name="edit" size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add tag button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => openTagEditor()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <GreenlineIcon name="plus" size={16} />
            {t('mySkills.newTag')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <GreenlineIcon name="search" size={16} />
            </span>
            <input
              type="text"
              placeholder={t('mySkills.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <GreenlineIcon name="grid" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <GreenlineIcon name="list" size={16} />
            </button>
          </div>
          <button
            onClick={() => loadSkills()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <GreenlineIcon name="refresh" size={16} className={cn(isLoading && "animate-spin")} />
            {t('mySkills.refresh')}
          </button>
        </div>

        {/* Skills grid/list */}
        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <GreenlineIcon name="loader" size={48} className="animate-spin mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t('mySkills.scanning')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('mySkills.scanningDescription')}
              </p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <GreenlineIcon name="alert" size={64} className="opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t('mySkills.loadFailed')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {loadError}
              </p>
              <button
                onClick={() => loadSkills()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <GreenlineIcon name="refresh" size={16} />
                {t('common.retry')}
              </button>
            </div>
          ) : sortedSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <GreenlineIcon name="folder" size={64} className="opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {skills.length === 0 ? t('mySkills.empty.title') : t('mySkills.noMatch.title')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {skills.length === 0
                  ? t('mySkills.empty.description')
                  : t('mySkills.noMatch.description')}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-2'
              )}
            >
              {sortedSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => openSkillDetail(skill)}
                  className={cn(
                    'group rounded-lg border border-border bg-card transition-all hover:shadow-md hover:border-primary/50 cursor-pointer relative',
                    viewMode === 'grid' ? 'p-4' : 'p-3 flex items-start gap-4'
                  )}
                >
                  {/* Favorite button */}
                  <button
                    onClick={(e) => toggleFavorite(skill.id, e)}
                    className={cn(
                      'absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-colors z-10',
                      skill.isFavorite
                        ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900'
                        : 'text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', skill.isFavorite && 'fill-current')} />
                  </button>

                  {/* Info */}
                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                    <h3 className="font-medium text-foreground truncate pr-8">{skill.name}</h3>
                    <p className={cn(
                      "text-sm text-muted-foreground mt-1",
                      viewMode === 'grid' ? 'line-clamp-4' : 'line-clamp-2'
                    )}>
                      {skill.description}
                    </p>
                    {viewMode === 'grid' && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {skill.tags.slice(0, 2).map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId);
                            return tag ? (
                              <span
                                key={tagId}
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {t('mySkills.times', { count: skill.useCount })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* List view meta */}
                  {viewMode === 'list' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {skill.tags.slice(0, 2).map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                      <span className="text-xs text-muted-foreground">
                        {t('mySkills.times', { count: skill.useCount })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TagEditorModal
        isOpen={isTagEditorOpen}
        onClose={() => {
          setIsTagEditorOpen(false);
          setEditingTag(null);
        }}
        editingTag={editingTag}
      />

      <SkillDetailModal
        skill={selectedSkill}
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
}

import { useState } from 'react';
import { X, Heart, FolderOpen, Tag as TagIcon, Clock, Hash, ExternalLink, Plus, Palette } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import type { Skill } from '@/types/skill';

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillDetailModal({ skill: skillProp, isOpen, onClose }: SkillDetailModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tags, skills, updateSkill } = useAppStore();
  const [showTagSelector, setShowTagSelector] = useState(false);

  // Get the latest skill from store to reflect updates
  const skill = skillProp ? skills.find(s => s.id === skillProp.id) || skillProp : null;

  if (!isOpen || !skill) return null;

  const skillTags = skill.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean);
  const availableTags = tags.filter(t => !skill.tags.includes(t.id));

  const toggleFavorite = () => {
    updateSkill(skill.id, { isFavorite: !skill.isFavorite });
  };

  const addTagToSkill = (tagId: string) => {
    updateSkill(skill.id, { tags: [...skill.tags, tagId] });
  };

  const removeTagFromSkill = (tagId: string) => {
    updateSkill(skill.id, { tags: skill.tags.filter(t => t !== tagId) });
  };

  const handleOpenPath = async () => {
    try {
      const { openPath, revealItemInDir } = await import('@tauri-apps/plugin-opener');
      // Open the parent directory of the skill file
      const dirPath = skill.path.replace(/\/SKILL\.md$/, '');
      console.log('Opening skill directory:', dirPath);
      // Use revealItemInDir to show in Finder, fallback to openPath
      try {
        await revealItemInDir(dirPath);
      } catch {
        await openPath(dirPath);
      }
    } catch (error) {
      console.error('Failed to open path:', error);
      // Fallback: copy path to clipboard
      navigator.clipboard.writeText(skill.path);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-semibold text-foreground">{skill.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {skill.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleFavorite}
              className={cn(
                'p-2 rounded-md transition-colors',
                skill.isFavorite
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Heart className={cn('h-5 w-5', skill.isFavorite && 'fill-current')} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <span>{skill.source === 'official' ? t('skillDetail.official') : skill.source === 'local' ? t('skillDetail.local') : t('skillDetail.marketplace')}</span>
          </div>
          {skill.version && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>v{skill.version}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDate(skill.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>{t('skillDetail.usedTimes', { count: skill.useCount })}</span>
          </div>
        </div>

        {/* Tags Section */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{t('mySkills.tags')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillTags.map((tag) => tag && (
              <span
                key={tag.id}
                className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <DynamicIcon name={tag.icon || 'Tag'} className="h-3.5 w-3.5" />
                {tag.name}
                <button
                  onClick={() => removeTagFromSkill(tag.id)}
                  className="ml-0.5 opacity-0 group-hover:opacity-100 hover:bg-black/10 rounded p-0.5 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Add tag button */}
            <div className="relative">
              <button
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('skillDetail.addTag')}
              </button>

              {showTagSelector && availableTags.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[160px] max-h-48 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        addTagToSkill(tag.id);
                        setShowTagSelector(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-secondary transition-colors"
                    >
                      <DynamicIcon name={tag.icon || 'Tag'} className="h-4 w-4" style={{ color: tag.color }} />
                      <span>{tag.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {showTagSelector && availableTags.length === 0 && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-2 px-3 z-10 min-w-[160px]">
                  <span className="text-sm text-muted-foreground">{t('skillDetail.noMoreTags')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="text-sm font-medium text-foreground mb-3">{t('skillDetail.content')}</div>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-secondary prose-pre:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
            <ReactMarkdown>
              {skill.content || t('skillDetail.noContent')}
            </ReactMarkdown>
          </div>
        </div>

        {/* Icon Browser Link - Only show for icon-selector skill */}
        {(skill.path.includes('icon-selector') || skill.name.toLowerCase().includes('icon')) && (
          <div className="border-t border-border px-4 py-3">
            <button
              onClick={() => {
                onClose();
                navigate('/icons');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Palette className="h-5 w-5" />
              Open Icon Browser
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Browse 150,000+ icons and generate custom SVG with AI
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <button
            onClick={handleOpenPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {t('skillDetail.openFileLocation')}
          </button>
          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
            {skill.path}
          </div>
        </div>
      </div>
    </div>
  );
}

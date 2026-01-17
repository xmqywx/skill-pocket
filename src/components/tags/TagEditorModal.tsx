import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, ChevronDown, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import type { Tag } from '@/types/tag';

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTag?: Tag | null;
}

// Common icon options - grouped by category
const iconOptions = [
  // Development
  'Code', 'Terminal', 'Braces', 'FileCode', 'GitBranch', 'GitMerge', 'Bug', 'Cpu', 'Database', 'Server', 'Cloud', 'CloudCog',
  // Web & UI
  'Globe', 'Layout', 'Layers', 'Component', 'Palette', 'Paintbrush', 'PenTool', 'Figma', 'Frame', 'Monitor', 'Smartphone', 'Tablet',
  // AI & Data
  'Bot', 'Brain', 'Sparkles', 'Wand2', 'MessageSquare', 'MessagesSquare', 'BarChart3', 'PieChart', 'TrendingUp', 'Activity', 'LineChart', 'AreaChart',
  // Files & Documents
  'FileText', 'File', 'Files', 'Folder', 'FolderOpen', 'BookOpen', 'Book', 'Notebook', 'ClipboardList', 'FileJson', 'FileCode2', 'FileCog',
  // Tools & Settings
  'Wrench', 'Settings', 'Cog', 'SlidersHorizontal', 'Hammer', 'Screwdriver', 'Package', 'Boxes', 'Archive', 'Download', 'Upload', 'RefreshCw',
  // Security
  'Shield', 'ShieldCheck', 'Lock', 'Unlock', 'Key', 'KeyRound', 'Fingerprint', 'Eye', 'EyeOff', 'AlertTriangle', 'AlertCircle', 'ShieldAlert',
  // Communication
  'Mail', 'Send', 'Inbox', 'AtSign', 'Share2', 'Link', 'ExternalLink', 'Rss', 'Radio', 'Podcast', 'Video', 'Camera',
  // Navigation & Actions
  'Search', 'Filter', 'SortAsc', 'Bookmark', 'Flag', 'Tag', 'Tags', 'Hash', 'Pin', 'MapPin', 'Navigation', 'Compass',
  // Media & Creative
  'Image', 'Images', 'Play', 'Music', 'Headphones', 'Mic', 'Film', 'Clapperboard', 'Brush', 'Eraser', 'Scissors', 'Crop',
  // Objects & Shapes
  'Box', 'Circle', 'Square', 'Triangle', 'Hexagon', 'Pentagon', 'Octagon', 'Diamond', 'Star', 'Heart', 'Gem', 'Crown',
  // Nature & Weather
  'Sun', 'Moon', 'CloudSun', 'Snowflake', 'Flame', 'Droplet', 'Wind', 'Leaf', 'Trees', 'Flower', 'Mountain', 'Waves',
  // Science & Math
  'Atom', 'Dna', 'FlaskConical', 'TestTube', 'Microscope', 'Telescope', 'Calculator', 'Binary', 'Sigma', 'Pi', 'Infinity', 'Variable',
  // Business & Finance
  'Briefcase', 'Building', 'Building2', 'Store', 'Wallet', 'CreditCard', 'DollarSign', 'PiggyBank', 'Receipt', 'BadgePercent', 'ShoppingCart', 'ShoppingBag',
  // People & Social
  'User', 'Users', 'UserPlus', 'UserCheck', 'Contact', 'PersonStanding', 'Handshake', 'HeartHandshake', 'ThumbsUp', 'Award', 'Trophy', 'Medal',
  // Misc
  'Lightbulb', 'Zap', 'Rocket', 'Target', 'Crosshair', 'Gamepad2', 'Joystick', 'Puzzle', 'Blocks', 'Workflow', 'Network', 'GitGraph',
];

// Color palettes organized by hue
const colorPalettes = {
  red: {
    key: 'red',
    colors: ['#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C'],
  },
  orange: {
    key: 'orange',
    colors: ['#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C'],
  },
  amber: {
    key: 'amber',
    colors: ['#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309'],
  },
  green: {
    key: 'green',
    colors: ['#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D'],
  },
  teal: {
    key: 'teal',
    colors: ['#CCFBF1', '#99F6E4', '#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#0F766E'],
  },
  blue: {
    key: 'blue',
    colors: ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'],
  },
  purple: {
    key: 'purple',
    colors: ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9'],
  },
  pink: {
    key: 'pink',
    colors: ['#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D'],
  },
  gray: {
    key: 'gray',
    colors: ['#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151'],
  },
};

export function TagEditorModal({ isOpen, onClose, editingTag }: TagEditorModalProps) {
  const { t } = useTranslation();
  const { tags, addTag, updateTag, removeTag } = useAppStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState('#3B82F6');
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showParentPicker, setShowParentPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return iconOptions;
    const search = iconSearch.toLowerCase();
    return iconOptions.filter(name => name.toLowerCase().includes(search));
  }, [iconSearch]);

  // Reset form when modal opens or editing tag changes
  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setIcon(editingTag.icon || 'Folder');
      setColor(editingTag.color);
      setParentId(editingTag.parentId);
    } else {
      setName('');
      setIcon('Folder');
      setColor('#3B82F6');
      setParentId(undefined);
    }
    setIconSearch('');
    setShowIconPicker(false);
    setShowParentPicker(false);
  }, [editingTag, isOpen]);

  const rootTags = tags.filter(t => !t.parentId);
  const availableParentTags = rootTags.filter(t => t.id !== editingTag?.id);
  const selectedParentTag = parentId ? tags.find(t => t.id === parentId) : null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingTag) {
      updateTag(editingTag.id, {
        name: name.trim(),
        icon,
        color,
        parentId,
      });
    } else {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: name.trim(),
        icon,
        color,
        parentId,
        order: tags.length,
        createdAt: new Date().toISOString(),
      };
      addTag(newTag);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingTag) {
      // Also delete child tags
      const childTags = tags.filter(t => t.parentId === editingTag.id);
      childTags.forEach(child => removeTag(child.id));
      removeTag(editingTag.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">
            {editingTag ? t('tags.editTitle') : t('tags.createTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('tags.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('tags.namePlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('tags.icon')}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowIconPicker(!showIconPicker);
                  setShowParentPicker(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm hover:bg-secondary transition-colors"
              >
                <DynamicIcon name={icon} className="h-4 w-4" style={{ color }} />
                <span className="flex-1 text-left">{icon}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showIconPicker && "rotate-180")} />
              </button>

              {showIconPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                  {/* Icon search */}
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder={t('tags.iconPlaceholder')}
                        className="w-full pl-8 pr-3 py-1.5 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  {/* Icon grid */}
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {filteredIcons.length > 0 ? (
                      <div className="grid grid-cols-8 gap-1">
                        {filteredIcons.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              setIcon(iconName);
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            title={iconName}
                            className={cn(
                              'p-2 rounded-md hover:bg-secondary transition-colors',
                              icon === iconName && 'bg-primary/10 text-primary ring-1 ring-primary'
                            )}
                          >
                            <DynamicIcon name={iconName} className="h-4 w-4 mx-auto" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        {t('tags.noIconMatch')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('tags.preview')}
            </label>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${color}20` }}
              >
                <DynamicIcon name={icon} className="h-5 w-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {name || t('tags.name')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedParentTag ? `${selectedParentTag.name} / ` : ''}{icon}
                </div>
              </div>
              <span
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {t('mySkills.tags')}
              </span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('tags.color')}
            </label>
            <div className="space-y-3">
              {/* Color palettes */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs text-muted-foreground px-0.5">{t(`tags.colorPalettes.${palette.key}`)}</div>
                    <div className="flex gap-0.5">
                      {palette.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={cn(
                            'flex-1 h-5 first:rounded-l-md last:rounded-r-md transition-all hover:scale-y-125 hover:z-10',
                            color === c && 'ring-2 ring-foreground ring-offset-1 ring-offset-background z-10 scale-y-125'
                          )}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom color input */}
              <div className="flex items-center gap-2 pt-1">
                <div className="text-xs text-muted-foreground whitespace-nowrap">{t('tags.colorCustom')}</div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      let val = e.target.value;
                      // Add # if not present
                      if (val && !val.startsWith('#')) {
                        val = '#' + val;
                      }
                      // Allow partial hex input for typing
                      if (!val || val.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                        setColor(val || '#');
                      }
                    }}
                    placeholder="#000000"
                    className="w-full pl-8 pr-3 py-1.5 rounded-md border border-input bg-background text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <label className="relative w-10 h-10 rounded-lg cursor-pointer border-2 border-input hover:border-primary transition-colors overflow-hidden">
                  <input
                    type="color"
                    value={color.length === 7 ? color : '#3B82F6'}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    title={t('tags.colorPicker')}
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Parent Tag - Custom Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('tags.parent')}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowParentPicker(!showParentPicker);
                  setShowIconPicker(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background text-sm hover:bg-secondary transition-colors"
              >
                {selectedParentTag ? (
                  <>
                    <DynamicIcon
                      name={selectedParentTag.icon || 'Folder'}
                      className="h-4 w-4"
                      style={{ color: selectedParentTag.color }}
                    />
                    <span className="flex-1 text-left">{selectedParentTag.name}</span>
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 rounded border border-dashed border-muted-foreground/50" />
                    <span className="flex-1 text-left text-muted-foreground">{t('tags.noParent')}</span>
                  </>
                )}
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showParentPicker && "rotate-180")} />
              </button>

              {showParentPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 py-1 max-h-48 overflow-y-auto">
                  {/* No parent option */}
                  <button
                    type="button"
                    onClick={() => {
                      setParentId(undefined);
                      setShowParentPicker(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors',
                      !parentId && 'bg-primary/5'
                    )}
                  >
                    <span className="w-4 h-4 rounded border border-dashed border-muted-foreground/50 flex items-center justify-center">
                      {!parentId && <Check className="h-3 w-3 text-primary" />}
                    </span>
                    <span className={cn("flex-1", !parentId ? "text-foreground" : "text-muted-foreground")}>
                      {t('tags.noParent')}
                    </span>
                  </button>

                  {availableParentTags.length > 0 && (
                    <div className="border-t border-border my-1" />
                  )}

                  {/* Parent tag options */}
                  {availableParentTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setParentId(tag.id);
                        setShowParentPicker(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-secondary transition-colors',
                        parentId === tag.id && 'bg-primary/5'
                      )}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center"
                        style={{ backgroundColor: `${tag.color}20` }}
                      >
                        {parentId === tag.id ? (
                          <Check className="h-3 w-3" style={{ color: tag.color }} />
                        ) : (
                          <DynamicIcon name={tag.icon || 'Folder'} className="h-3 w-3" style={{ color: tag.color }} />
                        )}
                      </div>
                      <span className="flex-1">{tag.name}</span>
                      {parentId === tag.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}

                  {availableParentTags.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                      {t('tags.noAvailableParent')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          </div>
        </form>

        {/* Actions - Fixed Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card flex-shrink-0">
          {editingTag ? (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              {t('tags.delete')}
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {t('tags.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingTag ? t('tags.save') : <><Plus className="h-4 w-4" />{t('tags.create')}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

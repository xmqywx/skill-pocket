import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Key, Folder, Palette, Globe, Download, Upload, Check, Eye, EyeOff, Moon, Sun, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

export function Settings() {
  const { t, i18n } = useTranslation();
  const {
    claudeApiKey, setClaudeApiKey,
    theme, setTheme,
    language, setLanguage,
    exportData, importData
  } = useAppStore();

  const [apiKeyInput, setApiKeyInput] = useState(claudeApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Sync language with i18n
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleSaveApiKey = () => {
    setClaudeApiKey(apiKeyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = async () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillpocket-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('success', t('settings.data.exportSuccess'));
    } catch (error) {
      console.error('Export failed:', error);
      showToast('error', 'Export failed');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = importData(text);
      if (success) {
        showToast('success', t('settings.data.importSuccess'));
        // Reload i18n language after import
        const newLang = useAppStore.getState().language;
        i18n.changeLanguage(newLang);
      } else {
        showToast('error', t('settings.data.importError'));
      }
    } catch (error) {
      console.error('Import failed:', error);
      showToast('error', t('settings.data.importError'));
    }

    // Reset input
    e.target.value = '';
  };

  const themeOptions = [
    { id: 'light' as const, icon: Sun, label: t('settings.theme.light') },
    { id: 'dark' as const, icon: Moon, label: t('settings.theme.dark') },
    { id: 'system' as const, icon: Monitor, label: t('settings.theme.system') },
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-2xl mx-auto p-8 pb-16 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        {/* Claude API Key */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium text-foreground">{t('settings.apiKey.title')}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('settings.apiKey.description')}
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={t('settings.apiKey.placeholder')}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              className={cn(
                'px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {t('settings.apiKey.saved')}
                </>
              ) : (
                t('settings.apiKey.save')
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('settings.apiKey.getKey')}: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">console.anthropic.com</a>
          </p>
        </section>

        {/* Skills Directory */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium text-foreground">{t('settings.skillsDir.title')}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <div>
                <p className="text-sm font-medium text-foreground font-mono">~/.claude/skills/</p>
                <p className="text-xs text-muted-foreground">{t('settings.skillsDir.personal')}</p>
              </div>
              <button className="text-sm text-primary hover:underline">{t('settings.skillsDir.modify')}</button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
              <div>
                <p className="text-sm font-medium text-foreground font-mono">~/.claude/plugins/</p>
                <p className="text-xs text-muted-foreground">{t('settings.skillsDir.plugins')}</p>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-secondary">{t('settings.skillsDir.autoDetect')}</span>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium text-foreground">{t('settings.theme.title')}</h2>
          </div>
          <div className="flex gap-2">
            {themeOptions.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm transition-colors',
                  theme === id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-secondary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium text-foreground">{t('settings.language.title')}</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('zh')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border text-sm transition-colors',
                language === 'zh'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-secondary'
              )}
            >
              {t('settings.language.zh')}
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border text-sm transition-colors',
                language === 'en'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-secondary'
              )}
            >
              {t('settings.language.en')}
            </button>
          </div>
        </section>

        {/* Import/Export */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">{t('settings.data.title')}</h2>
          <div className="flex gap-4">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
            >
              <Upload className="h-4 w-4" />
              {t('settings.data.import')}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" />
              {t('settings.data.export')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('settings.data.description')}
          </p>
        </section>

        {/* About */}
        <section className="pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">SkillPocket v1.0.0</p>
            <p>{t('settings.about.madeFor')}</p>
            <p className="text-xs">
              <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Anthropic Skills
              </a>
              {' | '}
              <a href="https://skillsmp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                SkillsMP.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={cn(
          'fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm animate-in slide-in-from-bottom-4 duration-300',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        )}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

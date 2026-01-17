import { useTranslation } from 'react-i18next';
import { Terminal, FolderOpen, ExternalLink } from 'lucide-react';
import { homeDir } from '@tauri-apps/api/path';
import { openPath, revealItemInDir } from '@tauri-apps/plugin-opener';

export function Create() {
  const { t } = useTranslation();

  const openSkillsDir = async () => {
    try {
      const home = await homeDir();
      const skillsPath = `${home}/.claude/skills`;
      console.log('Opening skills directory:', skillsPath);
      // Use revealItemInDir to open in Finder, fallback to openPath
      try {
        await revealItemInDir(skillsPath);
      } catch {
        await openPath(skillsPath);
      }
    } catch (e) {
      console.error('Failed to open skills directory:', e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('create.title')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('create.subtitle')}
        </p>

        {/* Instructions */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">{t('create.step1.title')}</h3>
              <div className="bg-zinc-950 rounded-lg p-3 font-mono text-sm text-zinc-300">
                mkdir -p ~/.claude/skills/my-skill
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">{t('create.step2.title')}</h3>
              <div className="bg-zinc-950 rounded-lg p-3 font-mono text-sm text-zinc-300 whitespace-pre">{`cat > ~/.claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: 当用户需要xxx时使用此skill
---

# My Skill

这里写 Skill 的具体内容...

## 使用场景
- 场景1
- 场景2

## 示例代码
\`\`\`javascript
// code here
\`\`\`
EOF`}</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">{t('create.step3.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('create.step3.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-medium text-foreground mb-4">{t('create.quickActions')}</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openSkillsDir}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              {t('create.openSkillsDir')}
            </button>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code/skills"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {t('create.officialDocs')}
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            {t('create.tips.title')}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('create.tips.tip1')}</li>
            <li>• {t('create.tips.tip2')}</li>
            <li>• {t('create.tips.tip3')}<code className="bg-secondary px-1 rounded">claude "帮我创建一个xxx的skill"</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

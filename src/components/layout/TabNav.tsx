import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { WindowControls, DragRegion } from './WindowControls';
import { GreenlineIcon } from '@/components/common/GreenlineIcon';

export function TabNav() {
  const { t } = useTranslation();

  const tabs = [
    { to: '/', icon: 'mySkills' as const, labelKey: 'nav.mySkills' },
    { to: '/create', icon: 'create' as const, labelKey: 'nav.create' },
    { to: '/icons', icon: 'icons' as const, label: 'Icons' },
  ];

  return (
    <nav className="flex items-center border-b border-border bg-card h-12">
      {/* Window Controls */}
      <WindowControls />

      {/* Drag Region - Left */}
      <DragRegion className="flex-1 h-full" />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 h-full">
        {tabs.map(({ to, icon, labelKey, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                'border-b-2 -mb-[1px]',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )
            }
          >
            <GreenlineIcon name={icon} size={20} />
            {labelKey ? t(labelKey) : label}
          </NavLink>
        ))}
      </div>

      {/* Drag Region - Right */}
      <DragRegion className="flex-1 h-full" />

      {/* Settings */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn(
            'p-2 mr-4 rounded-md transition-colors',
            isActive
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          )
        }
      >
        <GreenlineIcon name="settings" size={24} />
      </NavLink>
    </nav>
  );
}

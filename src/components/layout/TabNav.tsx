import { NavLink } from 'react-router-dom';
import { Package, Sparkles, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Package, label: '我的Skills' },
  // { to: '/store', icon: Store, label: '商店' }, // TODO: 以后完善
  { to: '/create', icon: Sparkles, label: '创建' },
];

export function TabNav() {
  return (
    <nav className="flex items-center gap-1 border-b border-border bg-card px-4">
      <div className="flex items-center gap-1">
        {tabs.map(({ to, icon: Icon, label }) => (
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
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
      <div className="flex-1" />
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn(
            'p-2 rounded-md transition-colors',
            isActive
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          )
        }
      >
        <Settings className="h-5 w-5" />
      </NavLink>
    </nav>
  );
}

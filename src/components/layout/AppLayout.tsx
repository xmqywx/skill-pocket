import { Outlet } from 'react-router-dom';
import { TabNav } from './TabNav';

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Title bar area for dragging */}
      <div
        className="h-8 bg-card border-b border-border flex items-center px-4"
        data-tauri-drag-region
      >
        <span className="text-sm font-semibold text-foreground">SkillPocket</span>
      </div>

      {/* Navigation */}
      <TabNav />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

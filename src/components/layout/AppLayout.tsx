import { Outlet } from 'react-router-dom';
import { TabNav } from './TabNav';

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navigation */}
      <TabNav />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

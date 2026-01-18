import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components/layout/AppLayout';
import { MySkills } from '@/pages/MySkills';
import { Store } from '@/pages/Store';
import { Create } from '@/pages/Create';
import { Icons } from '@/pages/Icons';
import { UIDesigns } from '@/pages/UIDesigns';
import { Settings } from '@/pages/Settings';
import { useAppStore } from '@/stores/appStore';

function AppInit() {
  const { i18n } = useTranslation();
  const { language, theme } = useAppStore();

  // Sync language on startup
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Apply theme on startup
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

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<MySkills />} />
          <Route path="store" element={<Store />} />
          <Route path="create" element={<Create />} />
          <Route path="icons" element={<Icons />} />
          <Route path="ui-designs" element={<UIDesigns />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

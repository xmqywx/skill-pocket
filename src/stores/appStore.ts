import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill } from '@/types/skill';
import type { Tag } from '@/types/tag';
import type { Draft } from '@/types/draft';
import { defaultTags } from '@/types/tag';
import { scanLocalSkills } from '@/services/skillScanner';

interface AppState {
  // Skills
  skills: Skill[];
  isLoading: boolean;
  loadError: string | null;
  setSkills: (skills: Skill[]) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  loadSkills: () => Promise<void>;

  // Tags
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;

  // UI State
  selectedTagId: string | null;
  setSelectedTagId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;

  // Drafts
  drafts: Draft[];
  addDraft: (draft: Draft) => void;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  removeDraft: (id: string) => void;

  // Settings
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  language: 'zh' | 'en';
  setLanguage: (lang: 'zh' | 'en') => void;
  claudeApiKey: string;
  setClaudeApiKey: (key: string) => void;

  // Export/Import
  exportData: () => string;
  importData: (data: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Skills - initialized empty, loaded from filesystem
      skills: [] as Skill[],
      isLoading: false,
      loadError: null,
      setSkills: (skills) => set({ skills }),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
      updateSkill: (id, updates) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      removeSkill: (id) =>
        set((state) => ({ skills: state.skills.filter((s) => s.id !== id) })),
      loadSkills: async () => {
        set({ isLoading: true, loadError: null });
        try {
          const skills = await scanLocalSkills();
          set({ skills, isLoading: false });
        } catch (error) {
          console.error('Failed to load skills:', error);
          set({
            loadError: error instanceof Error ? error.message : 'Failed to load skills',
            isLoading: false
          });
        }
      },

      // Tags
      tags: defaultTags,
      setTags: (tags) => set({ tags }),
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTag: (id) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),

      // UI State
      selectedTagId: null,
      setSelectedTagId: (id) => set({ selectedTagId: id }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Drafts
      drafts: [] as Draft[],
      addDraft: (draft) => set((state) => ({ drafts: [...state.drafts, draft] })),
      updateDraft: (id, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        })),
      removeDraft: (id) =>
        set((state) => ({ drafts: state.drafts.filter((d) => d.id !== id) })),

      // Settings
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      language: 'zh',
      setLanguage: (lang) => set({ language: lang }),
      claudeApiKey: '',
      setClaudeApiKey: (key) => set({ claudeApiKey: key }),

      // Export/Import
      exportData: () => {
        const state = get();
        const exportPayload = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          data: {
            tags: state.tags,
            skills: state.skills.map(s => ({
              id: s.id,
              tags: s.tags,
              isFavorite: s.isFavorite,
              useCount: s.useCount,
            })),
            theme: state.theme,
            language: state.language,
            viewMode: state.viewMode,
          }
        };
        return JSON.stringify(exportPayload, null, 2);
      },
      importData: (jsonStr: string) => {
        try {
          const payload = JSON.parse(jsonStr);
          if (!payload.version || !payload.data) {
            return false;
          }
          const { data } = payload;
          set((state) => ({
            tags: data.tags || state.tags,
            theme: data.theme || state.theme,
            language: data.language || state.language,
            viewMode: data.viewMode || state.viewMode,
            skills: state.skills.map(skill => {
              const imported = data.skills?.find((s: { id: string }) => s.id === skill.id);
              if (imported) {
                return {
                  ...skill,
                  tags: imported.tags || skill.tags,
                  isFavorite: imported.isFavorite ?? skill.isFavorite,
                  useCount: imported.useCount ?? skill.useCount,
                };
              }
              return skill;
            }),
          }));
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'skill-pocket-storage',
      partialize: (state) => ({
        tags: state.tags,
        theme: state.theme,
        language: state.language,
        claudeApiKey: state.claudeApiKey,
        viewMode: state.viewMode,
        skills: state.skills,
        drafts: state.drafts,
      }),
    }
  )
);

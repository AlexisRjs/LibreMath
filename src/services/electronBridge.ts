import { ModuleManifest, Topic, TopicSummary, SearchIndexEntry } from '../types/modules';
import { loadAllModules, parseFrontmatter } from './moduleLoader';
import { search as localSearch, initializeSearchIndex } from './searchEngine';

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      getModulesPath: () => Promise<string>;
      saveTopic: (moduleId: string, slug: string, rawContent: string) => Promise<{ success: boolean; error?: string }>;
      readAllFiles: () => Promise<Record<string, string>>;
      onModulesUpdated: (callback: (data: { filename?: string }) => void) => () => void;
    };
  }
}

export function isElectronEnvironment(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
}

let cachedTopicsIndex: TopicSummary[] | null = null;

export async function fetchManifests(): Promise<ModuleManifest[]> {
  const local = loadAllModules();
  return local.manifests;
}

export async function fetchTopicsIndex(): Promise<TopicSummary[]> {
  if (cachedTopicsIndex) return cachedTopicsIndex;
  const local = loadAllModules();
  cachedTopicsIndex = local.topics.map(t => ({
    slug: t.slug,
    moduleId: t.moduleId,
    moduleName: t.moduleName,
    title: t.title,
    unit: t.unit,
    order: t.order,
    tags: t.tags,
    description: t.description,
    formulaCount: t.formulas.length,
  }));
  return cachedTopicsIndex;
}

export async function fetchTopicContent(moduleId: string, slug: string): Promise<Topic | null> {
  const local = loadAllModules();
  const found = local.topics.find(t => t.moduleId === moduleId && t.slug === slug);
  return found || null;
}

export async function fetchAllTopics(): Promise<Topic[]> {
  const local = loadAllModules();
  return local.topics;
}

export async function saveTopicFile(
  moduleId: string,
  slug: string,
  rawContent: string
): Promise<{ success: boolean; error?: string }> {
  if (isElectronEnvironment() && window.electronAPI) {
    try {
      const res = await window.electronAPI.saveTopic(moduleId, slug, rawContent);
      // Update local in-memory cache
      const local = loadAllModules();
      const topicIndex = local.topics.findIndex(t => t.moduleId === moduleId && t.slug === slug);
      if (topicIndex !== -1) {
        const { metadata, content } = parseFrontmatter(rawContent, slug);
        local.topics[topicIndex] = {
          ...local.topics[topicIndex],
          title: metadata.title || local.topics[topicIndex].title,
          unit: metadata.unit || local.topics[topicIndex].unit,
          description: metadata.description || local.topics[topicIndex].description,
          tags: metadata.tags || local.topics[topicIndex].tags,
          content,
        };
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // In browser, save to localStorage fallback
  try {
    localStorage.setItem(`ingedata_override_${moduleId}_${slug}`, rawContent);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function executeSearch(
  query: string,
  filterType: 'all' | 'topic' | 'formula' = 'all',
  limit = 30
): Promise<SearchIndexEntry[]> {
  if (!query.trim()) return [];

  const local = loadAllModules();
  initializeSearchIndex(local.searchIndex);
  const raw = localSearch(query, limit);
  return raw.filter(r => filterType === 'all' || r.type === filterType);
}

export function subscribeToModuleChanges(callback: () => void): () => void {
  if (isElectronEnvironment() && window.electronAPI) {
    return window.electronAPI.onModulesUpdated(() => {
      console.log('[Electron Bridge] Hot-reload triggered by modules update on disk');
      callback();
    });
  }
  return () => {};
}

import { ModuleManifest, Topic, TopicSummary, SearchIndexEntry } from '../types/modules';
import { loadAllModules, parseFrontmatter } from './moduleLoader';
import { search as localSearch, initializeSearchIndex } from './searchEngine';
import { invoke } from '@tauri-apps/api/core';

export function isDesktopEnvironment(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || Boolean((window as any).electronAPI?.isElectron));
}

// Backwards-compatibility alias
export const isElectronEnvironment = isDesktopEnvironment;

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
  // 1. Tauri (Rust backend)
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    try {
      await invoke('save_topic', { moduleId, slug, rawContent });
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
      return { success: true };
    } catch (err: any) {
      console.error('[Tauri Rust] Error saving topic:', err);
      return { success: false, error: String(err) };
    }
  }

  // 2. In browser / fallback: save to localStorage
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

export function subscribeToModuleChanges(_callback: () => void): () => void {
  return () => {};
}

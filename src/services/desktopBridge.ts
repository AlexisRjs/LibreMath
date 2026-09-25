import { ModuleManifest, Topic, TopicSummary, SearchIndexEntry } from '../types/modules';
import { loadAllModules, registerDynamicTopic, removeDynamicTopic } from './moduleLoader';
import { search as localSearch, initializeSearchIndex } from './searchEngine';
import { invoke } from '@tauri-apps/api/core';

export function isDesktopEnvironment(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || Boolean((window as any).electronAPI?.isElectron));
}

// Backwards-compatibility alias
export const isElectronEnvironment = isDesktopEnvironment;

export async function fetchManifests(): Promise<ModuleManifest[]> {
  const local = loadAllModules();
  return local.manifests;
}

export async function fetchTopicsIndex(): Promise<TopicSummary[]> {
  const local = loadAllModules();
  return local.topics.map(t => ({
    slug: t.slug,
    moduleId: t.moduleId,
    moduleName: t.moduleName,
    title: t.title,
    unit: t.unit,
    order: t.order,
    tags: t.tags,
    description: t.description,
    formulaCount: t.formulas.length,
    isUserNote: t.isUserNote,
  }));
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
  // Always register in memory and localStorage so it is reactive
  registerDynamicTopic(moduleId, slug, rawContent, true);

  // If in Tauri desktop, also write to physical disk modules/<moduleId>/<slug>.md
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    try {
      await invoke('save_topic', { moduleId, slug, rawContent });
      return { success: true };
    } catch (err: any) {
      console.error('[Tauri Rust] Error saving topic to disk:', err);
      // Still return true because in-memory / localStorage saved
      return { success: true };
    }
  }

  return { success: true };
}

export async function deleteTopicFile(
  moduleId: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  removeDynamicTopic(moduleId, slug);

  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    try {
      await invoke('delete_topic', { moduleId, slug });
    } catch (err: any) {
      console.warn('[Tauri Rust] Error deleting topic from disk:', err);
    }
  }

  return { success: true };
}

export interface CreateNoteParams {
  moduleId: string;
  slug: string;
  title: string;
  unit?: string;
  description?: string;
  tags?: string[];
  initialContent?: string;
}

export async function createTopicFile(
  params: CreateNoteParams
): Promise<{ success: boolean; topic?: Topic; error?: string }> {
  const {
    moduleId,
    slug,
    title,
    unit = 'Apuntes y Anotaciones',
    description = 'Anotaciones personales',
    tags = ['apuntes'],
    initialContent,
  } = params;

  const defaultBody = initialContent ?? `# ${title}\n\nEscribe tus notas, fórmulas matemáticas en LaTeX ($...$ o $$...$$) y callouts aquí.\n\n> [!NOTE]\n> Apuntes personales para ${title}.\n`;

  const yamlTags = tags.map(t => `"${t.trim()}"`).filter(Boolean).join(', ');
  const rawMarkdown = `---\ntitle: "${title.replace(/"/g, '\\"')}"\nunit: "${unit.replace(/"/g, '\\"')}"\norder: 100\ndescription: "${description.replace(/"/g, '\\"')}"\ntags: [${yamlTags}]\nformulas: []\nvariables: []\n---\n\n${defaultBody}`;

  try {
    // 1. Register in memory and localStorage
    const topic = registerDynamicTopic(moduleId, slug, rawMarkdown, true);

    // 2. Persist to filesystem via Tauri if running in desktop
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      try {
        await invoke('save_topic', { moduleId, slug, rawContent: rawMarkdown });
      } catch (e) {
        console.warn('[Tauri Rust] Could not write topic file to disk:', e);
      }
    }

    return { success: true, topic };
  } catch (err: any) {
    console.error('Error creating topic file:', err);
    return { success: false, error: err.message || String(err) };
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

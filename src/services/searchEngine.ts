import Fuse from 'fuse.js';
import { SearchIndexEntry } from '../types/modules';

let fuseInstance: Fuse<SearchIndexEntry> | null = null;

export function initializeSearchIndex(entries: SearchIndexEntry[]): void {
  fuseInstance = new Fuse(entries, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'tags', weight: 0.25 },
      { name: 'latex', weight: 0.15 },
      { name: 'variables', weight: 0.1 },
      { name: 'moduleName', weight: 0.05 },
      { name: 'subtitle', weight: 0.05 },
    ],
    threshold: 0.38,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 1,
  });
}

export function search(query: string, limit = 20): SearchIndexEntry[] {
  if (!query || !query.trim()) {
    return [];
  }

  if (!fuseInstance) {
    return [];
  }

  const results = fuseInstance.search(query.trim(), { limit });
  return results.map(r => r.item);
}

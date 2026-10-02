import yaml from 'js-yaml';
import { ModuleManifest, Topic, TopicMetadata, SearchIndexEntry } from '../types/modules';

// Import all manifests and topics dynamically from modules directory
const rawModules = import.meta.glob('/modules/**/*.{md,json}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

interface ParsedModuleData {
  manifests: ModuleManifest[];
  topics: Topic[];
  searchIndex: SearchIndexEntry[];
}

let cachedData: ParsedModuleData | null = null;

function sanitizeYaml(yamlString: string): string {
  return yamlString
    .split(/\r?\n/)
    .map(line => {
      // Fix latex: without quotes
      if (/^\s*latex:\s*([^'"].*)$/.test(line)) {
        return line.replace(/^(\s*latex:\s*)([^'"].*)$/, (_m, p1, p2) => {
          const clean = p2.trim().replace(/'/g, "''");
          return `${p1}'${clean}'`;
        });
      }
      // Fix unit: with unquoted colons
      if (/^\s*unit:\s*([^'"].*)$/.test(line)) {
        return line.replace(/^(\s*unit:\s*)([^'"].*)$/, (_m, p1, p2) => {
          const clean = p2.trim().replace(/"/g, '\\"');
          return `${p1}"${clean}"`;
        });
      }
      // Fix title: with unquoted colons
      if (/^\s*title:\s*([^'"].*)$/.test(line)) {
        return line.replace(/^(\s*title:\s*)([^'"].*)$/, (_m, p1, p2) => {
          const clean = p2.trim().replace(/"/g, '\\"');
          return `${p1}"${clean}"`;
        });
      }
      // Fix symbol: without quotes
      if (/^\s*symbol:\s*([^'"].*)$/.test(line)) {
        return line.replace(/^(\s*symbol:\s*)([^'"].*)$/, (_m, p1, p2) => {
          const clean = p2.trim().replace(/'/g, "''");
          return `${p1}'${clean}'`;
        });
      }
      return line;
    })
    .join('\n');
}

function extractFallbackMetadata(yamlString: string, topicSlug: string): TopicMetadata {
  const titleMatch = yamlString.match(/^title:\s*["']?([^"'\r\n]+)["']?/m);
  const unitMatch = yamlString.match(/^unit:\s*["']?([^"'\r\n]+)["']?/m);
  const orderMatch = yamlString.match(/^order:\s*(\d+)/m);
  const descMatch = yamlString.match(/^description:\s*["']?([^"'\r\n]+)["']?/m);

  const fallbackTitle = topicSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const folderMatch = yamlString.match(/^folder:\s*["']?([^"'\r\n]+)["']?/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : fallbackTitle,
    unit: unitMatch ? unitMatch[1].trim() : 'General',
    order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
    description: descMatch ? descMatch[1].trim() : '',
    folder: folderMatch ? folderMatch[1].trim() : undefined,
    tags: [],
    variables: [],
    formulas: [],
  };
}

export function parseFrontmatter(
  rawContent: string,
  topicSlug = ''
): { metadata: TopicMetadata; content: string } {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    const fallbackTitle = topicSlug
      ? topicSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Sin título';
    return {
      metadata: { title: fallbackTitle, unit: 'General' },
      content: rawContent,
    };
  }

  const rawYaml = match[1];
  const markdownBody = match[2];

  // Attempt 1: Direct YAML load
  try {
    const directMeta = yaml.load(rawYaml) as TopicMetadata;
    if (directMeta && typeof directMeta === 'object' && directMeta.title) {
      return { metadata: directMeta, content: markdownBody };
    }
  } catch (_e1) {
    // Attempt 2: Auto-sanitize unquoted colons and backslashes
    try {
      const sanitized = sanitizeYaml(rawYaml);
      const sanitizedMeta = yaml.load(sanitized) as TopicMetadata;
      if (sanitizedMeta && typeof sanitizedMeta === 'object' && sanitizedMeta.title) {
        return { metadata: sanitizedMeta, content: markdownBody };
      }
    } catch (_e2) {
      console.warn('YAML parsing failed, falling back to regex extraction for slug:', topicSlug);
    }
  }

  // Attempt 3: Regex fallback extraction (guarantees real title, never "Error de parseo")
  const fallbackMeta = extractFallbackMetadata(rawYaml, topicSlug);
  return { metadata: fallbackMeta, content: markdownBody };
}

export function loadAllModules(): ParsedModuleData {
  if (cachedData) {
    return cachedData;
  }

  const manifestsMap = new Map<string, ModuleManifest>();
  const topics: Topic[] = [];
  const searchIndex: SearchIndexEntry[] = [];

  // 1. Process manifests first
  for (const [filepath, raw] of Object.entries(rawModules)) {
    if (filepath.endsWith('manifest.json')) {
      try {
        const manifest = JSON.parse(raw) as ModuleManifest;
        manifestsMap.set(manifest.id, manifest);
      } catch (e) {
        console.error(`Error parsing manifest at ${filepath}:`, e);
      }
    }
  }

  // 2. Process topic markdown files
  for (const [filepath, raw] of Object.entries(rawModules)) {
    if (filepath.endsWith('.md')) {
      // filepath pattern: /modules/<moduleId>/<topicSlug>.md
      const parts = filepath.split('/');
      const filename = parts.pop() || '';
      const moduleId = parts.pop() || '';
      const topicSlug = filename.replace(/\.md$/, '');

      const manifest = manifestsMap.get(moduleId);
      const moduleName = manifest ? manifest.name : moduleId.toUpperCase();

      const { metadata, content } = parseFrontmatter(raw, topicSlug);

      const topic: Topic = {
        slug: topicSlug,
        moduleId,
        moduleName,
        title: metadata.title || topicSlug.replace(/-/g, ' '),
        unit: metadata.unit || 'General',
        order: metadata.order || 999,
        tags: metadata.tags || [],
        description: metadata.description || '',
        variables: metadata.variables || [],
        formulas: (metadata.formulas || []).map((f, idx) => ({
          ...f,
          id: f.id || `${topicSlug}-f-${idx}`,
          topicSlug,
          moduleId,
          moduleName,
        })),
        content,
        folder: metadata.folder,
      };

      topics.push(topic);

      // Index topic in search engine
      searchIndex.push({
        type: 'topic',
        id: `topic-${moduleId}-${topicSlug}`,
        title: topic.title,
        subtitle: `${moduleName} • ${topic.unit}`,
        tags: topic.tags,
        moduleId,
        moduleName,
        topicSlug,
        unit: topic.unit,
        variables: topic.variables.map(v => `${v.name} (${v.symbol})`),
      });

      // Index each individual formula in search engine
      for (const formula of topic.formulas) {
        searchIndex.push({
          type: 'formula',
          id: `formula-${moduleId}-${topicSlug}-${formula.id}`,
          title: formula.name,
          subtitle: `${moduleName} • ${topic.title}`,
          latex: formula.latex,
          tags: [...(formula.tags || []), ...topic.tags],
          moduleId,
          moduleName,
          topicSlug,
          unit: topic.unit,
          variables: formula.variables,
        });
      }
    }
  }

  // 3. Process custom / user-created notes from localStorage
  const customNotes = getStoredCustomNotes();
  for (const item of customNotes) {
    const manifest = manifestsMap.get(item.moduleId);
    const moduleName = manifest ? manifest.name : item.moduleId.toUpperCase();
    const { metadata, content } = parseFrontmatter(item.rawContent, item.slug);

    const existingIndex = topics.findIndex(
      t => t.moduleId === item.moduleId && t.slug === item.slug
    );

    const topic: Topic = {
      slug: item.slug,
      moduleId: item.moduleId,
      moduleName,
      title: metadata.title || item.slug.replace(/-/g, ' '),
      unit: metadata.unit || 'Apuntes y Anotaciones',
      order: metadata.order ?? (existingIndex !== -1 ? topics[existingIndex].order : 100),
      tags: metadata.tags || ['apuntes'],
      description: metadata.description || 'Anotaciones personales',
      variables: metadata.variables || [],
      formulas: (metadata.formulas || []).map((f, idx) => ({
        ...f,
        id: f.id || `${item.slug}-f-${idx}`,
        topicSlug: item.slug,
        moduleId: item.moduleId,
        moduleName,
      })),
      content,
      isUserNote: true,
      folder: metadata.folder,
    };

    if (existingIndex !== -1) {
      topics[existingIndex] = topic;
    } else {
      topics.push(topic);
      if (manifest && !manifest.topicSlugs.includes(item.slug)) {
        manifest.topicSlugs.push(item.slug);
      }
    }

    // Index topic
    searchIndex.push({
      type: 'topic',
      id: `topic-${item.moduleId}-${item.slug}`,
      title: topic.title,
      subtitle: `${moduleName} • ${topic.unit}`,
      tags: topic.tags,
      moduleId: item.moduleId,
      moduleName,
      topicSlug: item.slug,
      unit: topic.unit,
      variables: topic.variables.map(v => `${v.name} (${v.symbol})`),
    });

    for (const formula of topic.formulas) {
      searchIndex.push({
        type: 'formula',
        id: `formula-${item.moduleId}-${item.slug}-${formula.id}`,
        title: formula.name,
        subtitle: `${moduleName} • ${topic.title}`,
        latex: formula.latex,
        tags: [...(formula.tags || []), ...topic.tags],
        moduleId: item.moduleId,
        moduleName,
        topicSlug: item.slug,
        unit: topic.unit,
        variables: formula.variables,
      });
    }
  }

  // Sort topics by module and order
  topics.sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
    return a.order - b.order;
  });

  const manifests = Array.from(manifestsMap.values());

  cachedData = {
    manifests,
    topics,
    searchIndex,
  };

  return cachedData;
}

export interface CustomNoteRecord {
  moduleId: string;
  slug: string;
  rawContent: string;
  isUserNote?: boolean;
}

export function getStoredCustomNotes(): CustomNoteRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw =
      localStorage.getItem('libremath_custom_notes') ||
      localStorage.getItem('ingedata_custom_notes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCustomNotes(records: CustomNoteRecord[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem('libremath_custom_notes', JSON.stringify(records));
  } catch (e) {
    console.error('Error saving custom notes to localStorage:', e);
  }
}

export function invalidateModuleCache(): void {
  cachedData = null;
}

export function registerDynamicTopic(
  moduleId: string,
  slug: string,
  rawContent: string,
  isUserNote = true
): Topic {
  const local = loadAllModules();
  const manifest = local.manifests.find(m => m.id === moduleId);
  const moduleName = manifest ? manifest.name : moduleId.toUpperCase();
  const { metadata, content } = parseFrontmatter(rawContent, slug);

  const topic: Topic = {
    slug,
    moduleId,
    moduleName,
    title: metadata.title || slug.replace(/-/g, ' '),
    unit: metadata.unit || 'Apuntes y Anotaciones',
    order: metadata.order ?? 100,
    tags: metadata.tags || ['apuntes'],
    description: metadata.description || 'Anotaciones personales',
    variables: metadata.variables || [],
    formulas: (metadata.formulas || []).map((f, idx) => ({
      ...f,
      id: f.id || `${slug}-f-${idx}`,
      topicSlug: slug,
      moduleId,
      moduleName,
    })),
    content,
    isUserNote,
    folder: metadata.folder,
  };

  // Update or insert topic in cached topics
  const existingIdx = local.topics.findIndex(t => t.moduleId === moduleId && t.slug === slug);
  if (existingIdx !== -1) {
    local.topics[existingIdx] = topic;
  } else {
    local.topics.push(topic);
    if (manifest && !manifest.topicSlugs.includes(slug)) {
      manifest.topicSlugs.push(slug);
    }
  }

  // Sort again
  local.topics.sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
    return a.order - b.order;
  });

  // Re-index search entry
  const searchId = `topic-${moduleId}-${slug}`;
  const existingSearchIdx = local.searchIndex.findIndex(s => s.id === searchId);
  const searchEntry: SearchIndexEntry = {
    type: 'topic',
    id: searchId,
    title: topic.title,
    subtitle: `${moduleName} • ${topic.unit}`,
    tags: topic.tags,
    moduleId,
    moduleName,
    topicSlug: slug,
    unit: topic.unit,
    variables: topic.variables.map(v => `${v.name} (${v.symbol})`),
  };

  if (existingSearchIdx !== -1) {
    local.searchIndex[existingSearchIdx] = searchEntry;
  } else {
    local.searchIndex.push(searchEntry);
  }

  // Save to persistent localStorage
  const stored = getStoredCustomNotes();
  const storedIdx = stored.findIndex(s => s.moduleId === moduleId && s.slug === slug);
  if (storedIdx !== -1) {
    stored[storedIdx] = { moduleId, slug, rawContent, isUserNote };
  } else {
    stored.push({ moduleId, slug, rawContent, isUserNote });
  }
  saveStoredCustomNotes(stored);

  return topic;
}

export function removeDynamicTopic(moduleId: string, slug: string): boolean {
  const local = loadAllModules();

  // 1. Remove from cached topics
  const topicIdx = local.topics.findIndex(t => t.moduleId === moduleId && t.slug === slug);
  if (topicIdx !== -1) {
    local.topics.splice(topicIdx, 1);
  }

  // 2. Remove from search index
  const searchId = `topic-${moduleId}-${slug}`;
  local.searchIndex = local.searchIndex.filter(
    s => s.id !== searchId && !s.id.startsWith(`formula-${moduleId}-${slug}-`)
  );

  // 3. Remove from manifest topicSlugs if present
  const manifest = local.manifests.find(m => m.id === moduleId);
  if (manifest) {
    manifest.topicSlugs = manifest.topicSlugs.filter(s => s !== slug);
  }

  // 4. Remove from persistent localStorage
  const stored = getStoredCustomNotes();
  const nextStored = stored.filter(s => !(s.moduleId === moduleId && s.slug === slug));
  saveStoredCustomNotes(nextStored);

  return true;
}

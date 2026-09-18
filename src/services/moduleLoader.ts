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

  return {
    title: titleMatch ? titleMatch[1].trim() : fallbackTitle,
    unit: unitMatch ? unitMatch[1].trim() : 'General',
    order: orderMatch ? parseInt(orderMatch[1], 10) : 999,
    description: descMatch ? descMatch[1].trim() : '',
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

export interface VariableDefinition {
  symbol: string;
  name: string;
  unit?: string;
  description?: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  description?: string;
  tags?: string[];
  variables?: string[];
  topicSlug?: string;
  moduleId?: string;
  moduleName?: string;
}

export interface TopicMetadata {
  title: string;
  unit: string;
  order?: number;
  tags?: string[];
  description?: string;
  folder?: string;
  variables?: VariableDefinition[];
  formulas?: FormulaItem[];
}

export interface Topic {
  slug: string;
  moduleId: string;
  moduleName: string;
  title: string;
  unit: string;
  order: number;
  tags: string[];
  description: string;
  folder?: string;
  variables: VariableDefinition[];
  formulas: FormulaItem[];
  content: string; // Markdown body without frontmatter
  isUserNote?: boolean;
}

export interface UserFolder {
  id: string;
  name: string;
  moduleId: string;
  createdAt: number;
}

export interface ModuleManifest {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: 'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose';
  units?: {
    id: string;
    title: string;
  }[];
  topicSlugs: string[];
}

export interface TopicSummary {
  slug: string;
  moduleId: string;
  moduleName: string;
  title: string;
  unit: string;
  order: number;
  tags: string[];
  description: string;
  folder?: string;
  formulaCount?: number;
  isUserNote?: boolean;
}

export interface SearchIndexEntry {
  type: 'topic' | 'formula';
  id: string;
  title: string;
  subtitle: string;
  latex?: string;
  tags: string[];
  moduleId: string;
  moduleName: string;
  topicSlug: string;
  unit: string;
  variables?: string[];
  score?: number;
}


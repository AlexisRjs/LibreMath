import { ModuleManifest } from '../types/modules';

const CUSTOM_MODULES_STORAGE_KEY = 'ingedata_custom_modules';

export function getStoredCustomModules(): ModuleManifest[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading custom modules from storage:', err);
    return [];
  }
}

export function saveStoredCustomModules(modules: ModuleManifest[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(modules));
  } catch (err) {
    console.error('Error saving custom modules to storage:', err);
  }
}

const PALETTE: ('violet' | 'cyan' | 'emerald' | 'amber' | 'blue' | 'rose')[] = [
  'violet',
  'cyan',
  'emerald',
  'amber',
  'rose',
  'blue',
];

export function createStoredCustomModule(
  name: string,
  color?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose'
): ModuleManifest {
  const cleanName = name.trim();
  const baseSlug = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const id = baseSlug || `materia-${Date.now()}`;
  const existing = getStoredCustomModules();

  const words = cleanName.split(/\s+/).filter(Boolean);
  const code = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : cleanName.substring(0, 3).toUpperCase();

  const chosenColor = color || PALETTE[existing.length % PALETTE.length];

  const newModule: ModuleManifest = {
    id,
    code,
    name: cleanName,
    description: `Materia personalizada cargada por el usuario`,
    icon: 'folder',
    color: chosenColor,
    topicSlugs: [],
    isCustom: true,
  };

  const updated = [...existing.filter(m => m.id !== id), newModule];
  saveStoredCustomModules(updated);
  return newModule;
}

export function deleteStoredCustomModule(moduleId: string): ModuleManifest[] {
  const existing = getStoredCustomModules();
  const updated = existing.filter(m => m.id !== moduleId);
  saveStoredCustomModules(updated);
  return updated;
}

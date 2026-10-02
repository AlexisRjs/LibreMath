import { UserFolder } from '../types/modules';

const FOLDERS_STORAGE_KEY = 'ingedata_user_folders';

export function getStoredFolders(): UserFolder[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading folders from storage:', err);
    return [];
  }
}

export function saveStoredFolders(folders: UserFolder[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (err) {
    console.error('Error saving folders to storage:', err);
  }
}

export function createStoredFolder(name: string, moduleId: string): UserFolder {
  const cleanName = name.trim();
  const newFolder: UserFolder = {
    id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    moduleId,
    createdAt: Date.now(),
  };
  const existing = getStoredFolders();
  const updated = [...existing, newFolder];
  saveStoredFolders(updated);
  return newFolder;
}

export function deleteStoredFolder(folderId: string): UserFolder[] {
  const existing = getStoredFolders();
  const updated = existing.filter(f => f.id !== folderId);
  saveStoredFolders(updated);
  return updated;
}

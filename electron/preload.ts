import { ipcRenderer, contextBridge } from 'electron';

export interface ElectronAPI {
  isElectron: boolean;
  getModulesPath: () => Promise<string>;
  saveTopic: (moduleId: string, slug: string, rawContent: string) => Promise<{ success: boolean; error?: string }>;
  readAllFiles: () => Promise<Record<string, string>>;
  onModulesUpdated: (callback: (data: { filename?: string }) => void) => () => void;
}

const api: ElectronAPI = {
  isElectron: true,
  getModulesPath: () => ipcRenderer.invoke('modules:get-path'),
  saveTopic: (moduleId: string, slug: string, rawContent: string) =>
    ipcRenderer.invoke('modules:save-topic', { moduleId, slug, rawContent }),
  readAllFiles: () => ipcRenderer.invoke('modules:read-all-files'),
  onModulesUpdated: (callback: (data: { filename?: string }) => void) => {
    const handler = (_event: unknown, data: { filename?: string }) => callback(data);
    ipcRenderer.on('modules-updated', handler);
    return () => {
      ipcRenderer.removeListener('modules-updated', handler);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

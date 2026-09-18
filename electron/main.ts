import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Prevent AMD GPU / DirectComposition warnings and graphical freezing
app.disableHardwareAcceleration();

// ESM-compatible __dirname resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    title: 'IngeData - Obsidian Knowledge Base',
    backgroundColor: '#0c0714',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  // Smooth window display once ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Allow F12 to toggle DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });
}

// Module directory path resolution
function getModulesPath(): string {
  const root = process.env.APP_ROOT || process.cwd();
  const directPath = path.join(root, 'modules');
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  return path.join(process.cwd(), 'modules');
}

// Set up IPC Handlers for Obsidian Vault / Modules
function setupIpcHandlers() {
  ipcMain.handle('modules:get-path', () => {
    return getModulesPath();
  });

  // Save topic markdown back to disk
  ipcMain.handle('modules:save-topic', async (_event, { moduleId, slug, rawContent }: { moduleId: string; slug: string; rawContent: string }) => {
    try {
      const modulesDir = getModulesPath();
      const targetFile = path.join(modulesDir, moduleId, `${slug}.md`);
      if (fs.existsSync(path.dirname(targetFile))) {
        await fs.promises.writeFile(targetFile, rawContent, 'utf-8');
        return { success: true };
      }
      return { success: false, error: 'Directory not found' };
    } catch (err: any) {
      console.error('Error saving topic:', err);
      return { success: false, error: err.message };
    }
  });

  // Read all raw files from modules directory
  ipcMain.handle('modules:read-all-files', async () => {
    const modulesDir = getModulesPath();
    const result: Record<string, string> = {};

    if (!fs.existsSync(modulesDir)) {
      return result;
    }

    async function walk(currentDir: string) {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.json'))) {
          const relativeKey = '/modules/' + path.relative(modulesDir, fullPath).replace(/\\/g, '/');
          const content = await fs.promises.readFile(fullPath, 'utf-8');
          result[relativeKey] = content;
        }
      }
    }

    try {
      await walk(modulesDir);
    } catch (e) {
      console.error('Error scanning modules dir:', e);
    }

    return result;
  });
}

// Watch /modules folder for live hot-reload
function setupFileWatcher() {
  const modulesDir = getModulesPath();
  if (!fs.existsSync(modulesDir)) return;

  try {
    fs.watch(modulesDir, { recursive: true }, (_eventType, filename) => {
      if (filename && (filename.endsWith('.md') || filename.endsWith('.json'))) {
        mainWindow?.webContents.send('modules-updated', { filename });
      }
    });
  } catch (e) {
    console.warn('File watcher failed to initialize on modules directory:', e);
  }
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  setupFileWatcher();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

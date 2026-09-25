import React, { useState } from 'react';
import { ModuleManifest, Topic, TopicSummary } from '../types/modules';
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Bookmark,
  Network,
  Grid,
  Calculator,
  FilePlus,
  FolderPlus,
  ArrowUpDown,
  ChevronsDownUp,
  Settings,
  HelpCircle,
  User,
  FileText,
  Plus,
  PenTool,
  Trash2,
} from 'lucide-react';

export type ActiveViewType =
  | 'topic'
  | 'my-notes'
  | 'matrix-calculator'
  | 'formula-evaluator'
  | 'favorites'
  | 'graph';

interface SidebarProps {
  manifests: ModuleManifest[];
  topics: (Topic | TopicSummary)[];
  selectedTopic: Topic | TopicSummary | null;
  onSelectTopic: (topic: Topic | TopicSummary) => void;
  activeView: ActiveViewType;
  setActiveView: (view: ActiveViewType) => void;
  onOpenSearch: () => void;
  onNewNote?: (moduleId?: string) => void;
  onDeleteNote?: (topic: Topic | TopicSummary) => void;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  manifests,
  topics,
  selectedTopic,
  onSelectTopic,
  activeView,
  setActiveView,
  onOpenSearch,
  onNewNote,
  onDeleteNote,
  favoritesCount,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    algebra: true,
    am1: true,
    'fisica-1': false,
    am2: false,
    'fisica-2': false,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    manifests.forEach(m => (next[m.id] = false));
    setExpandedModules(next);
  };

  const getModuleTopics = (moduleId: string) =>
    topics.filter(t => t.moduleId === moduleId);

  const userNotes = topics.filter(t => t.isUserNote);

  return (
    <div className="flex h-screen select-none shrink-0 text-[#dcddde] text-xs">
      {/* 1. Obsidian Left Ribbon (Slim Activity Bar, 44px) */}
      <nav className="w-11 h-full bg-[#141414] border-r border-[#262626] flex flex-col items-center justify-between py-2 shrink-0 z-20">
        {/* Top Tools */}
        <div className="flex flex-col items-center gap-1 w-full">
          {/* Files Explorer Toggle */}
          <button
            onClick={() => setActiveView('topic')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'topic'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Explorador de Archivos"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* Mis Notas Button */}
          <button
            onClick={() => setActiveView('my-notes')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'my-notes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Mis Notas (Lienzo para escribir)"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded flex items-center justify-center text-[#888888] hover:text-[#dcddde] hover:bg-[#202020] transition-colors"
            title="Búsqueda Rápida (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks / Favorites */}
          <button
            onClick={() => setActiveView('favorites')}
            className={`relative w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'favorites'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Marcadores / Favoritos"
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Graph View (D3) */}
          <button
            onClick={() => setActiveView('graph')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'graph'
                ? 'bg-[#2a2a2a] text-purple-400'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Vista de Grafo (Ctrl+G)"
          >
            <Network className="w-4 h-4" />
          </button>

          <div className="w-5 h-[1px] bg-[#2a2a2a] my-1" />

          {/* Calculators */}
          <button
            onClick={() => setActiveView('matrix-calculator')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'matrix-calculator'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Calculadora Matricial"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('formula-evaluator')}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              activeView === 'formula-evaluator'
                ? 'bg-[#2a2a2a] text-white'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#202020]'
            }`}
            title="Banco de Fórmulas"
          >
            <Calculator className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom User & Settings */}
        <div className="flex flex-col items-center gap-1 w-full">
          <button
            className="w-8 h-8 rounded flex items-center justify-center text-[#888888] hover:text-[#dcddde] hover:bg-[#202020] transition-colors"
            title="Ayuda de Obsidian"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded flex items-center justify-center text-[#888888] hover:text-[#dcddde] hover:bg-[#202020] transition-colors"
            title="Ajustes"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Obsidian File Explorer Panel (Tree View, 220px) */}
      <aside className="w-60 h-full bg-[#181818] border-r border-[#262626] flex flex-col shrink-0">
        {/* Top File Explorer Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#242424] text-[#888888]">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#999999]">
            Bóveda
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => (onNewNote ? onNewNote() : setActiveView('my-notes'))}
              className="p-1 rounded hover:bg-[#262626] hover:text-[#dcddde] transition-colors"
              title="Nueva nota Markdown"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1 rounded hover:bg-[#262626] hover:text-[#dcddde] transition-colors"
              title="Nueva carpeta"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1 rounded hover:bg-[#262626] hover:text-[#dcddde] transition-colors"
              title="Cambiar orden"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={collapseAll}
              className="p-1 rounded hover:bg-[#262626] hover:text-[#dcddde] transition-colors"
              title="Colapsar todo"
            >
              <ChevronsDownUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modules & Notes Tree View */}
        <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-0.5 font-sans">
          {/* Pinned "Mis Notas" Section */}
          <div className="select-none mb-1 pb-1 border-b border-[#242424]">
            <div className="flex items-center justify-between group rounded hover:bg-[#242424] pr-1">
              <button
                onClick={() => setActiveView('my-notes')}
                className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 text-left transition-colors text-[13px] min-w-0 font-medium ${
                  activeView === 'my-notes'
                    ? 'text-purple-300 font-semibold'
                    : 'text-[#e0e0e0] hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Mis Notas</span>
                {userNotes.length > 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
                    {userNotes.length}
                  </span>
                )}
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveView('my-notes');
                }}
                className="p-1 rounded text-[#777777] hover:text-purple-300 hover:bg-purple-950/50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                title="Escribir en Mis Notas"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {manifests.map(manifest => {
            const isExpanded = expandedModules[manifest.id] ?? false;
            const moduleTopics = getModuleTopics(manifest.id);

            return (
              <div key={manifest.id} className="select-none">
                {/* Folder Row */}
                <div className="flex items-center justify-between group rounded hover:bg-[#242424] pr-1">
                  <button
                    onClick={() => toggleModule(manifest.id)}
                    className="flex-1 flex items-center gap-1.5 px-2 py-1 text-left text-[#cccccc] group-hover:text-white transition-colors text-[13px] min-w-0"
                  >
                    <span className="text-[#777777] group-hover:text-[#aaaaaa] shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="truncate font-medium">{manifest.name}</span>
                  </button>

                  {/* Add Note directly to this subject */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setExpandedModules(prev => ({ ...prev, [manifest.id]: true }));
                      onNewNote?.(manifest.id);
                    }}
                    className="p-1 rounded text-[#777777] hover:text-purple-300 hover:bg-purple-950/50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    title={`Nueva nota en ${manifest.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Notes List inside Folder */}
                {isExpanded && (
                  <div className="pl-4 ml-1.5 border-l border-[#282828] space-y-0.5 py-0.5">
                    {moduleTopics.map(topic => {
                      const isSelected =
                        activeView === 'topic' &&
                        selectedTopic?.moduleId === topic.moduleId &&
                        selectedTopic?.slug === topic.slug;

                      return (
                        <div
                          key={topic.slug}
                          className="flex items-center group/item rounded transition-colors pr-1"
                        >
                          <button
                            onClick={() => {
                              if (topic.isUserNote) {
                                onSelectTopic(topic);
                                setActiveView('my-notes');
                              } else {
                                onSelectTopic(topic);
                                setActiveView('topic');
                              }
                            }}
                            className={`flex-1 text-left px-2 py-1 rounded text-[13px] transition-colors flex items-center gap-2 min-w-0 ${
                              isSelected
                                ? 'bg-[#2c2c2c] text-white font-medium'
                                : 'text-[#9a9a9a] hover:bg-[#222222] hover:text-[#e0e0e0]'
                            }`}
                          >
                            {topic.isUserNote ? (
                              <PenTool className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-[#666666] shrink-0" />
                            )}
                            <span className="truncate">{topic.title}</span>
                            {topic.isUserNote && (
                              <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 shrink-0">
                                nota
                              </span>
                            )}
                          </button>

                          {/* Trash can icon ONLY for user-created notes (subject syllabus .md are fixed) */}
                          {topic.isUserNote && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onDeleteNote?.(topic);
                              }}
                              className="p-1 rounded text-[#777777] hover:text-rose-400 hover:bg-rose-950/50 opacity-0 group-hover/item:opacity-100 transition-all shrink-0"
                              title="Eliminar esta nota definitivamente"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Inline button to add note */}
                    <button
                      onClick={() => onNewNote?.(manifest.id)}
                      className="w-full text-left px-2 py-1 rounded text-[11px] text-purple-400/70 hover:text-purple-300 hover:bg-purple-950/20 transition-colors flex items-center gap-1.5 font-sans"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Agregar nota md...</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vault Profile Footer with LibreMath branding */}
        <div className="p-2 border-t border-[#242424] flex items-center justify-between text-[#888888] bg-[#161616]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#2a2a2a] flex items-center justify-center text-purple-400">
              <User className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-medium text-[#aaaaaa]">Ale Obsidian</span>
          </div>
          <span className="text-[10px] font-mono text-purple-400/90 font-semibold">LibreMath</span>
        </div>
      </aside>
    </div>
  );
};

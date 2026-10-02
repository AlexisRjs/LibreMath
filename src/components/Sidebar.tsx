import React, { useState } from 'react';
import { ModuleManifest, Topic, TopicSummary } from '../types/modules';
import { TodoItem } from '../types/todo';
import { TodoSidebarPanel } from './TodoSidebarPanel';
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Bookmark,
  Network,
  Grid,
  FilePlus,
  ChevronsDownUp,
  Settings,
  HelpCircle,
  FileText,
  Plus,
  PenTool,
  Trash2,
  Sigma,
  CalendarCheck,
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
  todos?: TodoItem[];
  onToggleTodo?: (id: string) => void;
  onAddTodo?: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onDeleteTodo?: (id: string) => void;
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
  todos = [],
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [sidebarPanelTab, setSidebarPanelTab] = useState<'files' | 'todo'>('files');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    algebra: true,
    am1: true,
    'fisica-1': false,
    am2: false,
    'fisica-2': false,
  });

  const pendingTodosCount = todos.filter(t => !t.completed).length;

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
    <div className="flex h-screen select-none shrink-0 text-white text-xs">
      {/* 1. Modern Minimalist Left Activity Ribbon (Flat Evolution) */}
      <nav className="w-11 h-full bg-black border-r border-zinc-800 flex flex-col items-center justify-between py-2 shrink-0 z-20">
        {/* Top Tools */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* App Logo */}
          <div className="w-8 h-8 rounded-lg mb-1 flex items-center justify-center p-1 bg-zinc-900 border border-zinc-800 hover:border-[#7c3aed] transition-colors" title="IngeData">
            <img src="/app-icon.png" alt="IngeData" className="w-full h-full object-contain" />
          </div>

          {/* Files Explorer Toggle */}
          <button
            onClick={() => {
              setSidebarPanelTab('files');
              setActiveView('topic');
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              sidebarPanelTab === 'files' && activeView === 'topic'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Explorador de Archivos (Bóveda)"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* TO-DO & Agenda Button */}
          <button
            onClick={() => {
              setSidebarPanelTab('todo');
            }}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              sidebarPanelTab === 'todo'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Agenda de Exámenes y Tareas (TO-DO)"
          >
            <CalendarCheck className="w-4 h-4" />
            {pendingTodosCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black" />
            )}
          </button>

          {/* Mis Notas Button */}
          <button
            onClick={() => setActiveView('my-notes')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'my-notes'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Mis Notas (Lienzo para escribir)"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Búsqueda Rápida (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks / Favorites */}
          <button
            onClick={() => setActiveView('favorites')}
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'favorites'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
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
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'graph'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Vista de Grafo (Ctrl+G)"
          >
            <Network className="w-4 h-4" />
          </button>

          <div className="w-5 h-[1px] bg-zinc-800 my-1" />

          {/* Calculators */}
          <button
            onClick={() => setActiveView('matrix-calculator')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'matrix-calculator'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Calculadora Matricial"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('formula-evaluator')}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeView === 'formula-evaluator'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Banco de Fórmulas (LaTeX Plano)"
          >
            <Sigma className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom User & Settings */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Ayuda"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Ajustes"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Modern Minimalist Aside Panel (Switchable between Bóveda and Agenda TO-DO) */}
      <aside className="w-64 h-full bg-[#09090b] border-r border-zinc-800 flex flex-col shrink-0">
        {/* Top Switcher Tabs: Bóveda vs Agenda */}
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-800 bg-black">
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
            <button
              onClick={() => setSidebarPanelTab('files')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                sidebarPanelTab === 'files'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3 h-3" />
              <span>Bóveda</span>
            </button>
            <button
              onClick={() => setSidebarPanelTab('todo')}
              className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                sidebarPanelTab === 'todo'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-3 h-3 text-[#7c3aed]" />
              <span>Agenda</span>
              {pendingTodosCount > 0 && (
                <span className="text-[9px] font-mono px-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-bold">
                  {pendingTodosCount}
                </span>
              )}
            </button>
          </div>

          {sidebarPanelTab === 'files' && (
            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={() => (onNewNote ? onNewNote() : setActiveView('my-notes'))}
                className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                title="Nueva nota Markdown"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={collapseAll}
                className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                title="Colapsar todo"
              >
                <ChevronsDownUp className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Panel Content: Either TO-DO Agenda or Files Tree */}
        {sidebarPanelTab === 'todo' ? (
          <div className="flex-1 overflow-hidden">
            <TodoSidebarPanel
              todos={todos}
              manifests={manifests}
              onToggleTodo={onToggleTodo || (() => {})}
              onAddTodo={onAddTodo || (() => {})}
              onDeleteTodo={onDeleteTodo || (() => {})}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-0.5 font-sans">
            {/* Pinned "Mis Notas" Section */}
            <div className="select-none mb-1.5 pb-1.5 border-b border-zinc-800/80">
              <div className="flex items-center justify-between group rounded-md hover:bg-zinc-900/60 pr-1">
                <button
                  onClick={() => setActiveView('my-notes')}
                  className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 text-left transition-all text-xs min-w-0 rounded-md ${
                    activeView === 'my-notes'
                      ? 'bg-[#7c3aed]/15 text-white font-semibold border-l-2 border-[#7c3aed]'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                <PenTool className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                <span className="truncate">Mis Notas</span>
                {userNotes.length > 0 && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                    {userNotes.length}
                  </span>
                )}
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveView('my-notes');
                }}
                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all shrink-0"
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
              <div key={manifest.id} className="select-none mb-0.5">
                {/* Folder Row */}
                <div className="flex items-center justify-between group rounded-md hover:bg-zinc-900/60 pr-1">
                  <button
                    onClick={() => toggleModule(manifest.id)}
                    className="flex-1 flex items-center gap-1.5 px-2 py-1 text-left text-zinc-300 group-hover:text-white transition-colors text-xs min-w-0"
                  >
                    <span className="text-zinc-500 group-hover:text-zinc-300 shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="truncate font-semibold">{manifest.name}</span>
                  </button>

                  {/* Add Note directly to this subject */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setExpandedModules(prev => ({ ...prev, [manifest.id]: true }));
                      onNewNote?.(manifest.id);
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    title={`Nueva nota en ${manifest.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Notes List inside Folder */}
                {isExpanded && (
                  <div className="pl-3 ml-2 border-l border-zinc-800 space-y-0.5 py-0.5">
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
                            className={`flex-1 text-left px-2 py-1 rounded-md text-xs transition-all flex items-center gap-2 min-w-0 ${
                              isSelected
                                ? 'bg-[#7c3aed]/15 text-white font-medium border-l-2 border-[#7c3aed]'
                                : 'text-zinc-400 hover:bg-zinc-900/70 hover:text-white'
                            }`}
                          >
                            {topic.isUserNote ? (
                              <PenTool className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                            ) : (
                              <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#a78bfa]' : 'text-zinc-600'}`} />
                            )}
                            <span className="truncate">{topic.title}</span>
                            {topic.isUserNote && (
                              <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-zinc-900 text-purple-300 border border-purple-800/40 shrink-0">
                                nota
                              </span>
                            )}
                          </button>

                          {/* Trash can icon for user-created notes */}
                          {topic.isUserNote && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onDeleteNote?.(topic);
                              }}
                              className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/50 opacity-0 group-hover/item:opacity-100 transition-all shrink-0"
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
                      className="w-full text-left px-2 py-1 rounded text-[11px] text-zinc-500 hover:text-[#a78bfa] hover:bg-zinc-900/40 transition-colors flex items-center gap-1.5 font-sans"
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
        )}

        {/* Vault Profile Footer with UPL / UTN branding */}
        <div className="p-2.5 border-t border-zinc-800 flex items-center justify-between text-zinc-400 bg-black">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center p-0.5 overflow-hidden">
              <img src="/app-icon.png" alt="IngeData" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] font-medium text-white">IngeData</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
            UPL
          </span>
        </div>
      </aside>
    </div>
  );
};

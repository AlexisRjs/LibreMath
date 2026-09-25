import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchManifests,
  fetchTopicsIndex,
  fetchTopicContent,
  fetchAllTopics,
  subscribeToModuleChanges,
  createTopicFile,
  deleteTopicFile,
} from './services/desktopBridge';
import { ModuleManifest, Topic, TopicSummary, FormulaItem, SearchIndexEntry } from './types/modules';
import { Sidebar, ActiveViewType } from './components/Sidebar';
import { TopicViewer } from './components/TopicViewer';
import { CommandPalette } from './components/CommandPalette';
import { NewNoteModal } from './components/NewNoteModal';
import { MatrixCalculator } from './components/calculators/MatrixCalculator';
import { FormulaEvaluator } from './components/calculators/FormulaEvaluator';
import { FavoritesView } from './components/FavoritesView';
import { GraphView } from './components/GraphView';
import { MyNotesCanvas } from './components/MyNotesCanvas';
import {
  Menu,
  Plus,
  X,
  Loader2,
  Network,
  Grid,
  Calculator,
  Bookmark,
  FileText,
  PenTool,
  Check,
  PanelLeftClose,
  PanelLeft,
  Minus,
  Square,
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  view: ActiveViewType;
  moduleId?: string;
  slug?: string;
}

export function App() {
  const [manifests, setManifests] = useState<ModuleManifest[]>([]);
  const [topicSummaries, setTopicSummaries] = useState<TopicSummary[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('algebra');
  const [selectedSlug, setSelectedSlug] = useState<string>('espacios-vectoriales');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);

  const [activeView, setActiveView] = useState<ActiveViewType>('topic');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [newNoteTargetModuleId, setNewNoteTargetModuleId] = useState<string>('algebra');

  // Tabs state matching Obsidian
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-initial',
      title: 'Espacios vectoriales',
      view: 'topic',
      moduleId: 'algebra',
      slug: 'espacios-vectoriales',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-initial');

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem('libremath_favorites') ||
        localStorage.getItem('ingedata_favorites');
      return saved ? JSON.parse(saved) : ['def-limite', 'matriz-inversa-adjunta', 'segunda-ley-newton'];
    } catch {
      return ['def-limite', 'matriz-inversa-adjunta', 'segunda-ley-newton'];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('libremath_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Load manifest & topic index tree from module loader / electron once
  const loadIndexTree = useCallback(async () => {
    try {
      const [mList, tList, allT] = await Promise.all([
        fetchManifests(),
        fetchTopicsIndex(),
        fetchAllTopics(),
      ]);
      setManifests(mList);
      setTopicSummaries(tList);
      setAllTopics(allT);
    } catch (err) {
      console.error('Failed to load module index tree:', err);
    }
  }, []);

  // Initialize on mount and subscribe to Electron hot-reload watcher events
  useEffect(() => {
    loadIndexTree();

    const unsub = subscribeToModuleChanges(() => {
      console.log('[LibreMath] Notified: /modules updated on disk');
      loadIndexTree();
    });

    return () => {
      unsub();
    };
  }, [loadIndexTree]);

  // Derived selectedTopicSummary
  const selectedTopicSummary = useMemo(() => {
    if (topicSummaries.length === 0) return null;
    return (
      topicSummaries.find(t => t.moduleId === selectedModuleId && t.slug === selectedSlug) ||
      topicSummaries[0]
    );
  }, [topicSummaries, selectedModuleId, selectedSlug]);

  // Load active topic content on-demand when selection changes
  useEffect(() => {
    if (!selectedModuleId || !selectedSlug) return;

    let isMounted = true;
    setIsLoadingTopic(true);

    fetchTopicContent(selectedModuleId, selectedSlug).then(topic => {
      if (isMounted) {
        if (topic) {
          setSelectedTopic(topic);
          // Sync current active tab title
          setTabs(prev =>
            prev.map(tab =>
              tab.id === activeTabId
                ? { ...tab, title: topic.title, moduleId: selectedModuleId, slug: selectedSlug }
                : tab
            )
          );
        }
        setIsLoadingTopic(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedModuleId, selectedSlug, activeTabId]);

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+G, Ctrl+1, Ctrl+2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: Search Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Ctrl+G: Toggle Obsidian Graph View
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleSwitchView('graph');
      }
      // Ctrl+1: Matrix Calculator
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        handleSwitchView('matrix-calculator');
      }
      // Ctrl+2: Formula Evaluator
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        handleSwitchView('formula-evaluator');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId]);

  const [selectedFormulaIdForBank, setSelectedFormulaIdForBank] = useState<string | null>(null);

  const handleSelectTopic = (target: Topic | TopicSummary) => {
    setSelectedModuleId(target.moduleId);
    setSelectedSlug(target.slug);
    setActiveView('topic');

    // Update active tab
    setTabs(prev =>
      prev.map(tab =>
        tab.id === activeTabId
          ? {
              ...tab,
              title: target.title,
              view: 'topic',
              moduleId: target.moduleId,
              slug: target.slug,
            }
          : tab
      )
    );
  };

  const handleSwitchView = (view: ActiveViewType) => {
    setActiveView(view);
    const viewTitle = {
      topic: selectedTopic?.title || 'Nota',
      'my-notes': 'Mis Notas',
      graph: 'Vista de Grafo',
      'matrix-calculator': 'Calculadora Matricial',
      'formula-evaluator': 'Banco de Fórmulas',
      favorites: 'Marcadores',
    }[view];

    setTabs(prev =>
      prev.map(tab => (tab.id === activeTabId ? { ...tab, title: viewTitle, view } : tab))
    );
  };

  const handleSelectSearchResult = (entry: SearchIndexEntry) => {
    setSelectedModuleId(entry.moduleId);
    setSelectedSlug(entry.topicSlug);
    setActiveView('topic');
    setIsMobileSidebarOpen(false);
  };

  const handleOpenCalculator = (formula: FormulaItem) => {
    setSelectedFormulaIdForBank(formula.id);
    handleSwitchView('formula-evaluator');
  };

  const handleOpenNewNoteModal = (moduleId?: string) => {
    setNewNoteTargetModuleId(moduleId || selectedModuleId || 'algebra');
    setIsNewNoteModalOpen(true);
  };

  const handleCreateNote = async (data: {
    moduleId: string;
    title: string;
    slug: string;
    unit: string;
    tags: string[];
    description: string;
  }) => {
    const res = await createTopicFile({
      moduleId: data.moduleId,
      slug: data.slug,
      title: data.title,
      unit: data.unit,
      description: data.description,
      tags: data.tags,
    });

    if (res.success && res.topic) {
      await loadIndexTree();

      setSelectedModuleId(data.moduleId);
      setSelectedSlug(data.slug);
      setSelectedTopic(res.topic);
      setActiveView('topic');

      const tabId = `tab-note-${data.moduleId}-${data.slug}-${Date.now()}`;
      setTabs(prev => [
        ...prev,
        {
          id: tabId,
          title: res.topic!.title,
          view: 'topic',
          moduleId: data.moduleId,
          slug: data.slug,
        },
      ]);
      setActiveTabId(tabId);
    } else {
      throw new Error(res.error || 'No se pudo crear la nota');
    }
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: TabItem = {
      id: newId,
      title: 'Espacios vectoriales',
      view: 'topic',
      moduleId: 'algebra',
      slug: 'espacios-vectoriales',
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setSelectedModuleId('algebra');
    setSelectedSlug('espacios-vectoriales');
    setActiveView('topic');
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nextTabs = tabs.filter(t => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      const fallback = nextTabs[nextTabs.length - 1];
      setActiveTabId(fallback.id);
      setActiveView(fallback.view);
      if (fallback.moduleId && fallback.slug) {
        setSelectedModuleId(fallback.moduleId);
        setSelectedSlug(fallback.slug);
      }
    }
  };

  const handleSelectTab = (tab: TabItem) => {
    setActiveTabId(tab.id);
    setActiveView(tab.view);
    if (tab.moduleId && tab.slug) {
      setSelectedModuleId(tab.moduleId);
      setSelectedSlug(tab.slug);
    }
  };

  // Delete user-created note permanently and synchronize state
  const handleDeleteNote = async (topicToDelete: Topic | TopicSummary) => {
    try {
      await deleteTopicFile(topicToDelete.moduleId, topicToDelete.slug);
      await loadIndexTree();

      // Close tab if open
      setTabs(prev => {
        const filtered = prev.filter(t => t.slug !== topicToDelete.slug);
        return filtered.length > 0
          ? filtered
          : [
              {
                id: 'tab-default',
                title: 'Mis Notas',
                view: 'my-notes',
              },
            ];
      });

      // If active topic was deleted, switch to another topic or my-notes
      if (selectedSlug === topicToDelete.slug) {
        const remaining = topicSummaries.filter(t => t.slug !== topicToDelete.slug);
        if (remaining.length > 0) {
          handleSelectTopic(remaining[0]);
        } else {
          setSelectedTopic(null);
          setActiveView('my-notes');
        }
      }
    } catch (err) {
      console.error('Error deleting topic:', err);
    }
  };

  // Word & Character count calculation matching screenshot
  const wordsCount = useMemo(() => {
    if (!selectedTopic?.content) return 0;
    return selectedTopic.content.trim().split(/\s+/).filter(Boolean).length;
  }, [selectedTopic?.content]);

  const charsCount = useMemo(() => {
    if (!selectedTopic?.content) return 0;
    return selectedTopic.content.length;
  }, [selectedTopic?.content]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#dcddde] flex-col font-sans select-none">
      {/* 1. Authentic Obsidian Top Tab Strip */}
      <header className="h-9 bg-[#141414] border-b border-[#242424] flex items-center justify-between px-2 shrink-0 z-30">
        {/* Left Side: Sidebar Toggle & Tab Items */}
        <div className="flex items-center h-full gap-1 overflow-x-auto min-w-0">
          <button
            onClick={() => setIsSidebarVisible(prev => !prev)}
            className="p-1 rounded text-[#888888] hover:text-[#cccccc] hover:bg-[#222222] transition-colors shrink-0 mr-1"
            title={isSidebarVisible ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
          >
            {isSidebarVisible ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </button>

          {/* Render Obsidian Tabs */}
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab)}
                className={`group flex items-center gap-2 h-7 px-3 rounded-t text-xs cursor-pointer border-t border-x transition-colors max-w-[220px] ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-[#2a2a2a] font-medium'
                    : 'bg-[#161616] text-[#888888] border-transparent hover:bg-[#1b1b1b] hover:text-[#cccccc]'
                }`}
              >
                {tab.view === 'graph' ? (
                  <Network className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : tab.view === 'my-notes' ? (
                  <PenTool className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : tab.view === 'matrix-calculator' ? (
                  <Grid className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                ) : tab.view === 'formula-evaluator' ? (
                  <Calculator className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                ) : tab.view === 'favorites' ? (
                  <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                )}

                <span className="truncate">{tab.title}</span>

                {tabs.length > 1 && (
                  <button
                    onClick={e => handleCloseTab(e, tab.id)}
                    className="p-0.5 rounded hover:bg-[#333333] text-[#777777] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    title="Cerrar pestaña"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            onClick={handleNewTab}
            className="p-1 rounded text-[#777777] hover:text-[#cccccc] hover:bg-[#222222] transition-colors shrink-0"
            title="Nueva pestaña"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Windows Window Controls */}
        <div className="flex items-center gap-2 text-[#888888] shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#666666] mr-3">
            <span>LibreMath</span>
          </div>
          <button className="p-1.5 hover:bg-[#262626] rounded text-[#888888] hover:text-[#cccccc]">
            <Minus className="w-3 h-3" />
          </button>
          <button className="p-1.5 hover:bg-[#262626] rounded text-[#888888] hover:text-[#cccccc]">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="p-1.5 hover:bg-rose-950/60 rounded text-[#888888] hover:text-rose-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Obsidian Sidebar */}
        {isSidebarVisible && (
          <div className="hidden md:block">
            <Sidebar
              manifests={manifests}
              topics={topicSummaries}
              selectedTopic={selectedTopicSummary}
              onSelectTopic={handleSelectTopic}
              activeView={activeView}
              setActiveView={handleSwitchView}
              onOpenSearch={() => setIsSearchOpen(true)}
              onNewNote={handleOpenNewNoteModal}
              onDeleteNote={handleDeleteNote}
              favoritesCount={favorites.length}
            />
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-50">
              <Sidebar
                manifests={manifests}
                topics={topicSummaries}
                selectedTopic={selectedTopicSummary}
                onSelectTopic={t => {
                  handleSelectTopic(t);
                  setIsMobileSidebarOpen(false);
                }}
                activeView={activeView}
                setActiveView={v => {
                  handleSwitchView(v);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenSearch={() => {
                  setIsSearchOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onNewNote={moduleId => {
                  handleOpenNewNoteModal(moduleId);
                  setIsMobileSidebarOpen(false);
                }}
                onDeleteNote={t => {
                  handleDeleteNote(t);
                  setIsMobileSidebarOpen(false);
                }}
                favoritesCount={favorites.length}
              />
            </div>
          </div>
        )}

        {/* Main Workstation View Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#1e1e1e]">
          {/* Mobile Header Bar */}
          <div className="flex md:hidden items-center justify-between p-2.5 bg-[#181818] border-b border-[#262626]">
            <button
              onClick={() => setIsMobileSidebarOpen(prev => !prev)}
              className="p-1.5 rounded bg-[#242424] text-[#cccccc]"
            >
              {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <span className="font-semibold text-xs text-[#cccccc]">LibreMath</span>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-2 py-1 rounded bg-[#242424] text-xs text-[#aaaaaa]"
            >
              Ctrl+K
            </button>
          </div>

          {/* Dynamic Content Views */}
          <div className="flex-1 overflow-hidden relative">
            {activeView === 'topic' && (
              isLoadingTopic && !selectedTopic ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 text-[#888888]">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  <p className="text-xs font-mono">Cargando nota...</p>
                </div>
              ) : selectedTopic ? (
                <TopicViewer
                  topic={selectedTopic}
                  allTopics={topicSummaries}
                  onSelectTopic={handleSelectTopic}
                  onOpenCalculator={handleOpenCalculator}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onDeleteNote={handleDeleteNote}
                  onTopicSaved={() => {
                    loadIndexTree();
                    fetchTopicContent(selectedModuleId, selectedSlug).then(fresh => {
                      if (fresh) {
                        setSelectedTopic(fresh);
                      }
                    });
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[#666666] text-xs">
                  Selecciona un tema para comenzar
                </div>
              )
            )}

            {/* Direct Writing Canvas: Mis Notas */}
            {activeView === 'my-notes' && (
              <div className="h-full overflow-hidden bg-[#161122]">
                <MyNotesCanvas
                  manifests={manifests}
                  allTopics={allTopics}
                  initialTopic={selectedTopic?.isUserNote ? selectedTopic : null}
                  onTopicCreated={loadIndexTree}
                  onTopicSelect={handleSelectTopic}
                  onDeleteNote={handleDeleteNote}
                />
              </div>
            )}

            {/* Obsidian Graph View (D3.js) */}
            {activeView === 'graph' && (
              <GraphView
                manifests={manifests}
                topics={topicSummaries}
                onSelectTopic={handleSelectTopic}
              />
            )}

            {activeView === 'matrix-calculator' && (
              <div className="h-full overflow-y-auto bg-[#1e1e1e] p-4 sm:p-8">
                <MatrixCalculator />
              </div>
            )}

            {activeView === 'formula-evaluator' && (
              <div className="h-full overflow-hidden bg-[#1e1e1e]">
                <FormulaEvaluator
                  topics={allTopics.length > 0 ? allTopics : (selectedTopic ? [selectedTopic] : [])}
                  selectedFormulaId={selectedFormulaIdForBank}
                  onSelectTopic={t => {
                    handleSelectTopic(t);
                    handleSwitchView('topic');
                  }}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}

            {activeView === 'favorites' && (
              <div className="h-full overflow-y-auto bg-[#1e1e1e]">
                <FavoritesView
                  topics={allTopics.length > 0 ? allTopics : (selectedTopic ? [selectedTopic] : [])}
                  favoriteIds={favorites}
                  onToggleFavorite={toggleFavorite}
                  onOpenCalculator={handleOpenCalculator}
                  onSelectTopic={t => {
                    handleSelectTopic(t);
                    handleSwitchView('topic');
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Authentic Obsidian Bottom Status Bar (matching screenshot) */}
      <footer className="h-6 bg-[#181818] border-t border-[#242424] px-3 flex items-center justify-between text-[11px] text-[#777777] shrink-0">
        <div className="flex items-center gap-2">
          <span>LibreMath Vault</span>
        </div>

        {/* Right Obsidian status stats */}
        <div className="flex items-center gap-4">
          <span className="hover:text-[#aaaaaa] transition-colors cursor-pointer">
            0 entrantes
          </span>
          <div className="flex items-center gap-1.5 hover:text-[#aaaaaa] transition-colors cursor-pointer">
            <PenTool className="w-3 h-3 text-[#888888]" />
            <span>{wordsCount} palabras</span>
            <span>{charsCount.toLocaleString()} caracteres</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500/80">
            <Check className="w-3 h-3" />
          </div>
        </div>
      </footer>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* New Markdown Note Modal */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        manifests={manifests}
        defaultModuleId={newNoteTargetModuleId}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
}

export default App;

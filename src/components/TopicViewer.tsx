import React, { useState } from 'react';
import { Topic, TopicSummary, FormulaItem } from '../types/modules';
import { FormulaCard } from './FormulaCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MathRenderer } from './MathRenderer';
import { NoteEditor } from './NoteEditor';
import { MyNotesCanvas } from './MyNotesCanvas';
import { exportTopicToPdf } from '../services/pdfExporter';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  BookOpen,
  MoreHorizontal,
  FileDown,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';

interface TopicViewerProps {
  topic: Topic;
  allTopics: (Topic | TopicSummary)[];
  onSelectTopic: (topic: Topic | TopicSummary) => void;
  onOpenCalculator?: (formula: FormulaItem) => void;
  favorites: string[];
  onToggleFavorite: (formulaId: string) => void;
  onTopicSaved?: () => void;
  onDeleteNote?: (topic: Topic) => void;
}

export const TopicViewer: React.FC<TopicViewerProps> = ({
  topic,
  allTopics,
  onSelectTopic,
  onOpenCalculator,
  favorites,
  onToggleFavorite,
  onTopicSaved,
  onDeleteNote,
}) => {
  // If this is a personal / user note, show directly the writing canvas without reading/writing lock!
  if (topic.isUserNote) {
    return (
      <MyNotesCanvas
        manifests={[]}
        allTopics={allTopics as any}
        initialTopic={topic}
        onTopicCreated={onTopicSaved}
        onTopicSelect={onSelectTopic}
        onDeleteNote={onDeleteNote}
      />
    );
  }

  const [viewMode, setViewMode] = useState<'reading' | 'editor'>('reading');
  const [activeTab, setActiveTab] = useState<'all' | 'theory' | 'formulas' | 'variables'>('all');
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleExportPdf = () => {
    setIsOptionsMenuOpen(false);
    exportTopicToPdf({
      title: topic.title,
      unit: topic.unit,
      moduleName: topic.moduleName,
      markdownContent: topic.content,
      isUserNote: topic.isUserNote,
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(topic.content);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 1500);
    setIsOptionsMenuOpen(false);
  };

  const handleDelete = () => {
    setIsOptionsMenuOpen(false);
    if (window.confirm(`¿Estás seguro de que deseas eliminar la nota "${topic.title}" definitivamente?`)) {
      onDeleteNote?.(topic);
    }
  };

  // Prev / Next topic navigation
  const currentIndex = allTopics.findIndex(
    t => t.moduleId === topic.moduleId && t.slug === topic.slug
  );
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const handleNavigateSlug = (slug: string) => {
    const target = allTopics.find(t => t.slug === slug);
    if (target) {
      onSelectTopic(target);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#dcddde] overflow-hidden">
      {/* 1. Obsidian Top Breadcrumb Bar matching screenshot */}
      <div className="h-10 px-4 border-b border-[#282828] bg-[#1a1a1a] flex items-center justify-between shrink-0 select-none text-xs">
        {/* Navigation Arrows & Breadcrumb Path */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1 text-[#777777]">
            <button
              onClick={() => prevTopic && onSelectTopic(prevTopic)}
              disabled={!prevTopic}
              className="p-1 rounded hover:bg-[#282828] hover:text-[#cccccc] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Tema anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextTopic && onSelectTopic(nextTopic)}
              disabled={!nextTopic}
              className="p-1 rounded hover:bg-[#282828] hover:text-[#cccccc] disabled:opacity-30 disabled:hover:bg-transparent"
              title="Tema siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[#8e8e8e] truncate text-[13px]">
            <span className="hover:text-[#bbbbbb] transition-colors">{topic.moduleName}</span>
            <span className="text-[#555555]">/</span>
            <span className="text-[#cccccc] font-medium truncate">{topic.title}</span>
          </div>
        </div>

        {/* Right Tools: Reading/Edit Mode & Options */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode(prev => (prev === 'reading' ? 'editor' : 'reading'))}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              viewMode === 'editor'
                ? 'bg-[#2f2f2f] text-purple-400 font-medium'
                : 'text-[#888888] hover:text-[#dcddde] hover:bg-[#282828]'
            }`}
            title={viewMode === 'reading' ? 'Cambiar a modo edición' : 'Cambiar a modo lectura'}
          >
            {viewMode === 'reading' ? (
              <Edit3 className="w-3.5 h-3.5" />
            ) : (
              <BookOpen className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {viewMode === 'reading' ? 'Editar' : 'Lectura'}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsOptionsMenuOpen(prev => !prev)}
              className={`p-1.5 rounded transition-colors ${
                isOptionsMenuOpen
                  ? 'bg-[#333333] text-white'
                  : 'text-[#777777] hover:text-[#cccccc] hover:bg-[#282828]'
              }`}
              title="Más opciones"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOptionsMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-[#1e172e] border border-purple-800/60 rounded-xl shadow-2xl shadow-black/80 py-1 z-50 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={handleExportPdf}
                  className="w-full text-left px-3 py-2 hover:bg-purple-900/40 flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
                >
                  <FileDown className="w-4 h-4 text-purple-400" />
                  <span>Exportar como PDF</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="w-full text-left px-3 py-2 hover:bg-purple-900/40 flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
                >
                  {copiedMarkdown ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#888888]" />
                      <span>Copiar Markdown</span>
                    </>
                  )}
                </button>

                {topic.isUserNote && (
                  <>
                    <div className="h-[1px] bg-purple-900/40 my-1" />
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-2 hover:bg-rose-950/50 flex items-center gap-2 text-rose-300 hover:text-rose-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Eliminar nota</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 max-w-5xl mx-auto w-full">
        {viewMode === 'editor' ? (
          <div className="h-[700px] w-full">
            <NoteEditor
              topic={topic}
              onSaveSuccess={() => {
                onTopicSaved?.();
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Note Title */}
            <div className="space-y-2 pb-4 border-b border-[#282828]">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {topic.title}
              </h1>

              {topic.description && (
                <p className="text-sm text-[#999999] leading-relaxed pt-1">
                  {topic.description}
                </p>
              )}

              {/* Obsidian Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {topic.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#252525] text-[#9a9a9a] border border-[#303030]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* View Filter Tabs (Minimalist Obsidian Pills) */}
            <div className="flex items-center gap-1 p-0.5 rounded bg-[#181818] border border-[#282828] w-fit text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#2a2a2a] text-white font-medium shadow-sm'
                    : 'text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'theory'
                    ? 'bg-[#2a2a2a] text-white font-medium shadow-sm'
                    : 'text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                Teoría
              </button>
              {topic.formulas.length > 0 && (
                <button
                  onClick={() => setActiveTab('formulas')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'formulas'
                      ? 'bg-[#2a2a2a] text-white font-medium shadow-sm'
                      : 'text-[#888888] hover:text-[#cccccc]'
                  }`}
                >
                  Fórmulas ({topic.formulas.length})
                </button>
              )}
              {topic.variables.length > 0 && (
                <button
                  onClick={() => setActiveTab('variables')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'variables'
                      ? 'bg-[#2a2a2a] text-white font-medium shadow-sm'
                      : 'text-[#888888] hover:text-[#cccccc]'
                  }`}
                >
                  Variables ({topic.variables.length})
                </button>
              )}
            </div>

            {/* SECTION: Markdown Body */}
            {(activeTab === 'all' || activeTab === 'theory') && (
              <div className="prose-obsidian pt-2">
                <MarkdownRenderer
                  content={topic.content}
                  onNavigateTopic={handleNavigateSlug}
                />
              </div>
            )}

            {/* SECTION: Formulas Grid with Built-In Side-by-Side Calculators */}
            {(activeTab === 'all' || activeTab === 'formulas') && topic.formulas.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#cccccc] uppercase tracking-wider text-[11px]">
                    Fórmulas del Tema ({topic.formulas.length})
                  </h3>
                  <span className="text-[11px] font-mono text-purple-400">
                    Calculadora interactiva en cada fórmula
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {topic.formulas.map(formula => (
                    <FormulaCard
                      key={formula.id}
                      formula={formula}
                      onOpenCalculator={onOpenCalculator}
                      isFavorite={favorites.includes(formula.id)}
                      onToggleFavorite={onToggleFavorite}
                      defaultCalculatorOpen={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Variables Table */}
            {(activeTab === 'all' || activeTab === 'variables') && topic.variables.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-[#cccccc] uppercase tracking-wider text-[11px]">
                  Variables y Parámetros
                </h3>

                <div className="overflow-x-auto rounded border border-[#2c2c2c] bg-[#191919]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#282828] bg-[#1e1e1e] text-[11px] font-mono uppercase text-[#888888]">
                        <th className="p-2.5">Símbolo</th>
                        <th className="p-2.5">Concepto</th>
                        <th className="p-2.5">Unidad SI</th>
                        <th className="p-2.5">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626] font-mono text-xs">
                      {topic.variables.map((v, vIdx) => (
                        <tr key={vIdx} className="hover:bg-[#202020] transition-colors">
                          <td className="p-2.5 font-semibold text-purple-300">
                            <MathRenderer math={v.symbol} block={false} />
                          </td>
                          <td className="p-2.5 font-sans text-[#dddddd]">{v.name}</td>
                          <td className="p-2.5 text-emerald-400">{v.unit || '—'}</td>
                          <td className="p-2.5 font-sans text-[#999999]">
                            {v.description || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

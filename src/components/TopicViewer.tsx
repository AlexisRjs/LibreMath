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
    <div className="flex flex-col h-full bg-[#09090b] text-white overflow-hidden">
      {/* 1. Modern Minimalist Top Breadcrumb Bar */}
      <div className="h-10 px-4 border-b border-zinc-800 bg-black flex items-center justify-between shrink-0 select-none text-xs">
        {/* Navigation Arrows & Breadcrumb Path */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1 text-zinc-400">
            <button
              onClick={() => prevTopic && onSelectTopic(prevTopic)}
              disabled={!prevTopic}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
              title="Tema anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextTopic && onSelectTopic(nextTopic)}
              disabled={!nextTopic}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
              title="Tema siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400 truncate text-[13px]">
            <span className="hover:text-white transition-colors">{topic.moduleName}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-semibold truncate">{topic.title}</span>
          </div>
        </div>

        {/* Right Tools: Reading/Edit Mode & Options */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(prev => (prev === 'reading' ? 'editor' : 'reading'))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all ${
              viewMode === 'editor'
                ? 'bg-[#7c3aed] text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
              className={`p-1.5 rounded-md transition-colors ${
                isOptionsMenuOpen
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Más opciones"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOptionsMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-[#0e0e12] border border-zinc-800 rounded-xl shadow-2xl shadow-black py-1.5 z-50 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-100"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={handleExportPdf}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-800/80 flex items-center gap-2 text-zinc-200 hover:text-white transition-colors"
                >
                  <FileDown className="w-4 h-4 text-[#a78bfa]" />
                  <span>Exportar como PDF</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="w-full text-left px-3 py-2 hover:bg-zinc-800/80 flex items-center gap-2 text-zinc-200 hover:text-white transition-colors"
                >
                  {copiedMarkdown ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copiar Markdown</span>
                    </>
                  )}
                </button>

                {topic.isUserNote && (
                  <>
                    <div className="h-[1px] bg-zinc-800 my-1" />
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
            <div className="space-y-3 pb-5 border-b border-zinc-800">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {topic.title}
              </h1>

              {topic.description && (
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {topic.description}
                </p>
              )}

              {/* Minimalist Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topic.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-[#7c3aed]/50 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* View Filter Tabs (Modern Flat Evolution Segmented Control) */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-black border border-zinc-800 w-fit text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'all'
                    ? 'bg-white text-black shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'theory'
                    ? 'bg-white text-black shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Teoría
              </button>
              {topic.formulas.length > 0 && (
                <button
                  onClick={() => setActiveTab('formulas')}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === 'formulas'
                      ? 'bg-white text-black shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Fórmulas ({topic.formulas.length})
                </button>
              )}
              {topic.variables.length > 0 && (
                <button
                  onClick={() => setActiveTab('variables')}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === 'variables'
                      ? 'bg-white text-black shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-white'
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

            {/* SECTION: Formulas Grid */}
            {(activeTab === 'all' || activeTab === 'formulas') && topic.formulas.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Fórmulas del Tema ({topic.formulas.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#a78bfa]">
                    LaTeX KaTeX
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
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Variables Table */}
            {(activeTab === 'all' || activeTab === 'variables') && topic.variables.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Variables y Parámetros
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0e0e12]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-black text-[11px] font-mono uppercase text-zinc-400">
                        <th className="p-3">Símbolo</th>
                        <th className="p-3">Concepto</th>
                        <th className="p-3">Unidad SI</th>
                        <th className="p-3">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-mono text-xs">
                      {topic.variables.map((v, vIdx) => (
                        <tr key={vIdx} className="hover:bg-zinc-900/60 transition-colors">
                          <td className="p-3 font-semibold text-[#c084fc]">
                            <MathRenderer math={v.symbol} block={false} />
                          </td>
                          <td className="p-3 font-sans text-white font-medium">{v.name}</td>
                          <td className="p-3 text-emerald-400 font-semibold">{v.unit || '—'}</td>
                          <td className="p-3 font-sans text-zinc-400">
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

import React, { useState, useEffect, useRef } from 'react';
import { SearchIndexEntry } from '../types/modules';
import { executeSearch } from '../services/electronBridge';
import { MathRenderer } from './MathRenderer';
import { Search, Hash, ArrowRight, CornerDownLeft, Copy, Check, FileText } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (entry: SearchIndexEntry) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'topic' | 'formula'>('all');
  const [rawResults, setRawResults] = useState<SearchIndexEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Query Rust native in-memory search index
  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setRawResults([]);
      return;
    }

    executeSearch(query, 'all', 50).then(res => {
      if (active) {
        setRawResults(res);
      }
    });

    return () => {
      active = false;
    };
  }, [query]);

  const results = rawResults.filter(
    r => filterType === 'all' || r.type === filterType
  );


  // Reset index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, filterType]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown handler when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectResult(results[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Tab' && results[selectedIndex]?.latex) {
        e.preventDefault();
        navigator.clipboard.writeText(results[selectedIndex].latex!);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectResult, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  if (!isOpen) return null;

  const currentItem = results[selectedIndex] || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#0e0e12] border border-zinc-800 shadow-2xl shadow-purple-950/25 overflow-hidden flex flex-col max-h-[75vh] animate-modal-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-black">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar nota o fórmula por nombre, tema o LaTeX..."
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-sm outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800"
            >
              ESC
            </button>
          )}
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e0e12] border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all font-medium ${
                filterType === 'all'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Todos ({rawResults.length})
            </button>
            <button
              onClick={() => setFilterType('formula')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all font-medium ${
                filterType === 'formula'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Fórmulas ({rawResults.filter(r => r.type === 'formula').length})
            </button>
            <button
              onClick={() => setFilterType('topic')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all font-medium ${
                filterType === 'topic'
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Temas ({rawResults.filter(r => r.type === 'topic').length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Navega con <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">↑</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">↓</kbd>
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden min-h-[300px]">
          {/* Results List */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-2 space-y-1 border-r border-zinc-800"
          >
            {results.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No se encontraron resultados para &quot;{query}&quot;
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectResult(item);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-start justify-between gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all text-xs ${
                      isSelected
                        ? 'bg-[#7c3aed]/15 text-white border-l-2 border-[#7c3aed]'
                        : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="shrink-0 mt-0.5 text-zinc-400">
                        {item.type === 'formula' ? (
                          <Hash className="w-3.5 h-3.5 text-[#a78bfa]" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-opacity ${
                        isSelected ? 'text-[#a78bfa] opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Live Preview Panel (Right) */}
          <div className="w-1/2 p-4 bg-black/40 flex flex-col justify-between overflow-y-auto">
            {currentItem ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
                    {currentItem.type === 'formula' ? 'Fórmula' : 'Tema'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2.5">
                    {currentItem.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">{currentItem.subtitle}</p>
                </div>

                {currentItem.latex && (
                  <div className="p-4 rounded-xl bg-black border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 block mb-1 uppercase font-semibold">
                      KaTeX:
                    </span>
                    <div className="text-center overflow-x-auto py-2 text-white">
                      <MathRenderer math={currentItem.latex} block={false} />
                    </div>
                  </div>
                )}

                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 block">Etiquetas:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentItem.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-zinc-600 text-center my-auto">
                Selecciona un resultado para ver la vista previa.
              </div>
            )}

            {/* Bottom Keyboard Guide */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3 text-zinc-400" /> Enter: Abrir
              </span>
              {currentItem?.latex && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentItem.latex!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Tab: Copiar LaTeX
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

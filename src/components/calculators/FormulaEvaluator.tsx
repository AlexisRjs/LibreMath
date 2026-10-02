import React, { useState, useMemo } from 'react';
import { Topic, FormulaItem } from '../../types/modules';
import { MathRenderer } from '../MathRenderer';
import {
  Sigma,
  Search,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Code2,
  Layers,
} from 'lucide-react';

interface FormulaBankProps {
  topics: Topic[];
  selectedFormulaId?: string | null;
  onSelectTopic?: (topic: Topic) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

interface EnrichedFormula {
  formula: FormulaItem;
  topic: Topic;
  moduleName: string;
  moduleId: string;
}

export const FormulaEvaluator: React.FC<FormulaBankProps> = ({
  topics,
  selectedFormulaId,
  onSelectTopic,
  favorites = [],
  onToggleFavorite,
}) => {
  // 1. Flatten and index all formulas from all topics across all modules
  const allEnrichedFormulas = useMemo<EnrichedFormula[]>(() => {
    const list: EnrichedFormula[] = [];
    topics.forEach(t => {
      (t.formulas || []).forEach(f => {
        list.push({
          formula: f,
          topic: t,
          moduleName: t.moduleName,
          moduleId: t.moduleId,
        });
      });
    });
    return list;
  }, [topics]);

  // Search & module filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [activeFormulaId, setActiveFormulaId] = useState<string>(() => {
    return selectedFormulaId || (allEnrichedFormulas[0]?.formula.id ?? '');
  });
  const [copied, setCopied] = useState(false);

  // Sync when prop selectedFormulaId changes
  React.useEffect(() => {
    if (selectedFormulaId) {
      setActiveFormulaId(selectedFormulaId);
    }
  }, [selectedFormulaId]);

  // Filter formulas by search and module
  const filteredFormulas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return allEnrichedFormulas.filter(item => {
      const matchModule = selectedModule === 'all' || item.moduleId === selectedModule;
      if (!matchModule) return false;
      if (!term) return true;
      return (
        item.formula.name.toLowerCase().includes(term) ||
        item.formula.latex.toLowerCase().includes(term) ||
        (item.formula.description && item.formula.description.toLowerCase().includes(term)) ||
        (item.formula.tags && item.formula.tags.some(t => t.toLowerCase().includes(term))) ||
        item.topic.title.toLowerCase().includes(term)
      );
    });
  }, [allEnrichedFormulas, searchTerm, selectedModule]);

  // Selected item
  const currentItem = useMemo(() => {
    return (
      allEnrichedFormulas.find(f => f.formula.id === activeFormulaId) ||
      filteredFormulas[0] ||
      allEnrichedFormulas[0]
    );
  }, [allEnrichedFormulas, activeFormulaId, filteredFormulas]);

  const handleCopyLatex = (latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Modules tabs summary
  const moduleTabs = [
    { id: 'all', label: 'Todas', count: allEnrichedFormulas.length },
    { id: 'am1', label: 'Análisis Mat. I', count: allEnrichedFormulas.filter(f => f.moduleId === 'am1').length },
    { id: 'algebra', label: 'Álgebra y Geom.', count: allEnrichedFormulas.filter(f => f.moduleId === 'algebra').length },
    { id: 'fisica-1', label: 'Física I', count: allEnrichedFormulas.filter(f => f.moduleId === 'fisica-1').length },
    { id: 'am2', label: 'Análisis Mat. II', count: allEnrichedFormulas.filter(f => f.moduleId === 'am2').length },
    { id: 'fisica-2', label: 'Física II', count: allEnrichedFormulas.filter(f => f.moduleId === 'fisica-2').length },
  ];

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white select-none">
      {/* 1. Header Bar */}
      <div className="h-10 border-b border-zinc-800 px-4 flex items-center justify-between bg-black shrink-0 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Sigma className="w-4 h-4 text-[#a78bfa]" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-zinc-500">Herramientas</span>
            <span className="text-zinc-700">/</span>
            <span className="text-white font-medium">Banco de Fórmulas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
            {allEnrichedFormulas.length} fórmulas en LaTeX plano
          </span>
        </div>
      </div>

      {/* 2. Main Workbench Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full select-text">
        {/* Module Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black border border-zinc-800 text-xs">
          {moduleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedModule(tab.id)}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium ${
                selectedModule === tab.id
                  ? 'bg-white text-black font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedModule === tab.id ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Catalog List + Formula Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Search & Catalog (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar fórmula por nombre, tema o LaTeX..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0e0e12] border border-zinc-800 text-white placeholder:text-zinc-600 text-xs outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
              <span>{filteredFormulas.length} fórmulas disponibles</span>
              <span>Clic para inspeccionar</span>
            </div>

            {/* Scrollable list */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {filteredFormulas.length === 0 ? (
                <div className="p-8 text-center bg-[#0e0e12] rounded-xl border border-zinc-800 text-xs text-zinc-500">
                  No se encontraron fórmulas con los filtros seleccionados.
                </div>
              ) : (
                filteredFormulas.map(({ formula, topic, moduleName }) => {
                  const isSelected = currentItem?.formula.id === formula.id;
                  const isFav = favorites.includes(formula.id);

                  return (
                    <div
                      key={formula.id}
                      onClick={() => setActiveFormulaId(formula.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border text-left group ${
                        isSelected
                          ? 'bg-[#7c3aed]/15 border-[#7c3aed]/50 text-white font-medium shadow-xs'
                          : 'bg-[#0e0e12] border-zinc-800 hover:bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-zinc-500 block truncate">
                            {moduleName} • {topic.unit.split(':')[0]}
                          </span>
                          <h4 className={`text-xs font-bold truncate mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                            {formula.name}
                          </h4>
                        </div>
                        {isFav && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800/80 overflow-x-hidden text-xs text-zinc-300">
                        <MathRenderer math={formula.latex} block={false} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Formula Workspace (7 cols) */}
          {currentItem ? (
            <div className="lg:col-span-7 space-y-4 sticky top-4">
              {/* Formula Master Card */}
              <div className="p-6 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
                        {currentItem.moduleName}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px] truncate max-w-xs">
                        {currentItem.topic.unit}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      {currentItem.formula.name}
                    </h3>
                    {currentItem.formula.description && (
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {currentItem.formula.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(currentItem.formula.id)}
                        title={favorites.includes(currentItem.formula.id) ? 'Quitar de guardadas' : 'Guardar en favoritas'}
                        className={`p-1.5 rounded-md transition-colors ${
                          favorites.includes(currentItem.formula.id)
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyLatex(currentItem.formula.latex)}
                      title="Copiar código LaTeX plano"
                      className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar LaTeX</span>
                        </>
                      )}
                    </button>

                    {onSelectTopic && (
                      <button
                        onClick={() => onSelectTopic(currentItem.topic)}
                        title="Abrir nota completa en bóveda"
                        className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span className="hidden sm:inline">Ver Nota</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1. Large LaTeX Formula Rendered Display */}
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-semibold">
                    <Sigma className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Fórmula Tipográfica (KaTeX)</span>
                  </div>
                  <div className="p-5 rounded-xl bg-black border border-zinc-800 overflow-x-auto text-center flex items-center justify-center min-h-[80px] text-white">
                    <MathRenderer math={currentItem.formula.latex} block copyable />
                  </div>
                </div>

                {/* 2. Plain LaTeX Syntax Box */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                    <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                      <Code2 className="w-3.5 h-3.5 text-[#a78bfa]" />
                      Código LaTeX Plano
                    </span>
                    <button
                      onClick={() => handleCopyLatex(currentItem.formula.latex)}
                      className="text-[10px] text-[#a78bfa] hover:text-white transition-colors lowercase"
                    >
                      {copied ? 'copiado al portapapeles' : 'clic para copiar'}
                    </button>
                  </div>
                  <div className="relative group">
                    <pre className="font-mono text-xs text-zinc-200 bg-black p-3.5 rounded-xl border border-zinc-800 overflow-x-auto select-all whitespace-pre-wrap break-all leading-relaxed">
                      {currentItem.formula.latex}
                    </pre>
                  </div>
                </div>

                {/* Tags */}
                {currentItem.formula.tags && currentItem.formula.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-800">
                    {currentItem.formula.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Theoretical Context & Topic Variables */}
              <div className="p-5 rounded-xl bg-[#0e0e12] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-white">
                    <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span className="uppercase tracking-wider font-semibold">Contexto del Tema: {currentItem.topic.title}</span>
                  </div>
                  {onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(currentItem.topic)}
                      className="text-[11px] font-mono text-[#a78bfa] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Ir a la nota</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {currentItem.topic.description && (
                  <p className="text-xs text-[#888888] leading-relaxed">
                    {currentItem.topic.description}
                  </p>
                )}

                {/* Topic Variables Table if available */}
                {currentItem.topic.variables && currentItem.topic.variables.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider block">
                      Variables y Parámetros del Tema
                    </span>
                    <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-black">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-mono uppercase text-zinc-400">
                            <th className="p-2.5">Símbolo</th>
                            <th className="p-2.5">Concepto</th>
                            <th className="p-2.5">Unidad SI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                          {currentItem.topic.variables.map((v, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                              <td className="p-2.5 font-mono text-[#a78bfa] font-semibold whitespace-nowrap">
                                <MathRenderer math={v.symbol} block={false} />
                              </td>
                              <td className="p-2.5 text-white font-medium">{v.name}</td>
                              <td className="p-2.5 font-mono text-zinc-500">{v.unit || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 py-1">
                    Esta fórmula forma parte de la unidad didáctica <strong className="text-white">{currentItem.topic.unit}</strong>.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 p-12 text-center bg-[#0e0e12] rounded-xl border border-zinc-800 text-xs text-zinc-500 shadow-sm">
              Selecciona una fórmula del catálogo para inspeccionar su sintaxis LaTeX y contexto.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

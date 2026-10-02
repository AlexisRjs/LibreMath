import React, { useState } from 'react';
import { FormulaItem } from '../types/modules';
import { MathRenderer } from './MathRenderer';
import { Copy, Check, Bookmark, ExternalLink, Code } from 'lucide-react';

interface FormulaCardProps {
  formula: FormulaItem;
  onOpenCalculator?: (formula: FormulaItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (formulaId: string) => void;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  onOpenCalculator,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawLatex, setShowRawLatex] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group rounded-xl bg-[#0e0e12] border border-zinc-800 p-4 formula-card-interactive text-left shadow-xs">
      {/* Top Header: Name and Action buttons */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-sm tracking-tight truncate group-hover:text-purple-200 transition-colors">
              {formula.name}
            </h4>
            {formula.moduleId && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-[#c084fc] border border-[#7c3aed]/30 shrink-0">
                {formula.moduleId}
              </span>
            )}
          </div>
          {formula.description && (
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              {formula.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle raw LaTeX view */}
          <button
            onClick={() => setShowRawLatex(prev => !prev)}
            title={showRawLatex ? 'Ocultar código LaTeX plano' : 'Ver código LaTeX plano'}
            className={`p-1.5 rounded-md transition-all duration-150 active:scale-95 text-xs flex items-center gap-1 ${
              showRawLatex
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">LaTeX</span>
          </button>

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(formula.id)}
              title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className={`p-1.5 rounded-md transition-all duration-150 hover:scale-105 active:scale-90 ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 transition-transform duration-200 ${isFavorite ? 'fill-current scale-110' : ''}`} />
            </button>
          )}

          {onOpenCalculator && (
            <button
              onClick={() => onOpenCalculator(formula)}
              title="Abrir en Banco de Fórmulas"
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-105 active:scale-90 transition-all duration-150"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copiar código LaTeX"
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-105 active:scale-90 transition-all duration-150"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Formula Display Box - Pure White High Contrast on Jet Black */}
      <div className="my-3 p-4 sm:p-5 rounded-xl bg-black border border-zinc-800/90 overflow-x-auto text-center flex items-center justify-center min-h-[72px] text-white">
        <div className="text-sm sm:text-base md:text-lg text-white py-1 max-w-full font-medium">
          <MathRenderer math={formula.latex} block={true} copyable />
        </div>
      </div>

      {/* Plain Flat LaTeX Box (when toggled) */}
      {showRawLatex && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono select-all">
          <span className="text-[10px] uppercase font-mono text-[#a78bfa] shrink-0 font-semibold">LaTeX:</span>
          <code className="text-[11px] text-zinc-200 overflow-x-auto whitespace-pre-wrap break-all flex-1 font-mono">
            {formula.latex}
          </code>
          <button
            onClick={handleCopy}
            title="Copiar LaTeX"
            className="shrink-0 text-[10px] text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:bg-[#7c3aed] transition-colors"
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      )}

      {/* Tags */}
      {formula.tags && formula.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-zinc-800/80">
          {formula.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { FormulaItem } from '../types/modules';
import { MathRenderer } from './MathRenderer';
import { FormulaInlineCalculator } from './calculators/FormulaInlineCalculator';
import { Copy, Check, Calculator, Bookmark, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface FormulaCardProps {
  formula: FormulaItem;
  onOpenCalculator?: (formula: FormulaItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (formulaId: string) => void;
  defaultCalculatorOpen?: boolean;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  onOpenCalculator,
  isFavorite = false,
  onToggleFavorite,
  defaultCalculatorOpen = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(defaultCalculatorOpen);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group rounded-xl bg-[#161222] border border-purple-900/40 hover:border-purple-800/70 p-4 transition-all text-left shadow-lg">
      {/* Top Header: Name and Action buttons */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-100 text-sm group-hover:text-white transition-colors truncate">
              {formula.name}
            </h4>
            {formula.moduleId && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40 shrink-0">
                {formula.moduleId}
              </span>
            )}
          </div>
          {formula.description && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {formula.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle inline calculator */}
          <button
            onClick={() => setIsCalculatorOpen(prev => !prev)}
            title={isCalculatorOpen ? 'Ocultar calculadora' : 'Abrir calculadora interactiva'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              isCalculatorOpen
                ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/30'
                : 'bg-[#211a33] text-purple-300 hover:bg-purple-900/60 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Calculadora</span>
            {isCalculatorOpen ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(formula.id)}
              title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className={`p-1.5 rounded transition-colors ${
                isFavorite
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-[#888888] hover:text-[#cccccc] hover:bg-[#251e38]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {onOpenCalculator && (
            <button
              onClick={() => onOpenCalculator(formula)}
              title="Abrir en Banco de Fórmulas completo"
              className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#251e38] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copiar LaTeX"
            className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#251e38] transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Formula Display Box - Generously sized to show complete mathematical formula */}
      <div className="my-3 p-4 sm:p-5 rounded-xl bg-[#0c0915] border border-purple-900/50 overflow-x-auto text-center flex items-center justify-center min-h-[76px] shadow-inner">
        <div className="text-sm sm:text-base md:text-lg text-slate-100 py-1 max-w-full">
          <MathRenderer math={formula.latex} block={true} copyable />
        </div>
      </div>

      {/* Interactive Calculator directly accompanying the formula */}
      {isCalculatorOpen && (
        <div className="mt-3">
          <FormulaInlineCalculator formula={formula} />
        </div>
      )}

      {/* Tags */}
      {formula.tags && formula.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-purple-950/40">
          {formula.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-purple-300/70 bg-[#140e22] border border-purple-900/40 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

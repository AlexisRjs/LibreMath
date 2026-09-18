import React, { useState } from 'react';
import { FormulaItem } from '../types/modules';
import { MathRenderer } from './MathRenderer';
import { Copy, Check, Calculator, Bookmark } from 'lucide-react';

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

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative rounded-md bg-[#181818] border border-[#262626] hover:border-[#333333] hover:bg-[#1a1a1a] p-3.5 transition-colors text-left">
      {/* Top Header: Name and Action buttons */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div>
          <h4 className="font-semibold text-[#e0e0e0] text-xs group-hover:text-white transition-colors">
            {formula.name}
          </h4>
          {formula.description && (
            <p className="text-[11px] text-[#888888] mt-0.5 leading-normal">
              {formula.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(formula.id)}
              title={isFavorite ? 'Quitar de marcadores' : 'Añadir a marcadores'}
              className={`p-1.5 rounded transition-colors ${
                isFavorite
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-[#666666] hover:text-[#cccccc] hover:bg-[#222222]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {onOpenCalculator && (
            <button
              onClick={() => onOpenCalculator(formula)}
              title="Abrir en Banco de Fórmulas"
              className="p-1.5 rounded text-[#666666] hover:text-white hover:bg-[#222222] transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copiar LaTeX"
            className="p-1.5 rounded text-[#666666] hover:text-white hover:bg-[#222222] transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* LaTeX Rendered Expression */}
      <div className="my-2 p-2.5 rounded bg-[#131313] border border-[#202020] overflow-x-auto text-center flex items-center justify-center min-h-[50px]">
        <MathRenderer math={formula.latex} block={true} />
      </div>

      {/* Variables or Tags Badges */}
      {formula.tags && formula.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-1 border-t border-[#222222]">
          {formula.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-[#777777] bg-[#141414] border border-[#202020] px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { FormulaItem } from '../../types/modules';
import { MathRenderer } from '../MathRenderer';
import { getOrCreateFormulaCalculator } from '../../services/formulaEngine';
import { Calculator, Sparkles, RotateCcw } from 'lucide-react';

interface FormulaInlineCalculatorProps {
  formula: FormulaItem;
  className?: string;
}

export const FormulaInlineCalculator: React.FC<FormulaInlineCalculatorProps> = ({
  formula,
  className = '',
}) => {
  const engine = useMemo(() => getOrCreateFormulaCalculator(formula), [formula]);

  // Initial values mapped from engine inputs
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    engine.inputs.forEach(inp => {
      init[inp.key] = inp.default;
    });
    return init;
  });

  // Re-sync when formula changes
  useEffect(() => {
    const init: Record<string, number> = {};
    engine.inputs.forEach(inp => {
      init[inp.key] = inp.default;
    });
    setValues(init);
  }, [engine, formula.id]);

  const handleInputChange = (key: string, rawVal: string) => {
    const num = parseFloat(rawVal);
    setValues(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    const init: Record<string, number> = {};
    engine.inputs.forEach(inp => {
      init[inp.key] = inp.default;
    });
    setValues(init);
  };

  const evaluation = useMemo(() => {
    try {
      return engine.compute(values);
    } catch (_e) {
      return {
        result: 0,
        unit: '',
        stepsLatex: '\\text{Error en cálculo}',
      };
    }
  }, [engine, values]);

  return (
    <div
      className={`rounded-lg bg-[#14121a] border border-purple-900/40 p-3.5 flex flex-col space-y-3 text-xs select-text ${className}`}
      onClick={e => e.stopPropagation()}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
        <div className="flex items-center gap-1.5 text-purple-300 font-mono text-[11px] font-medium">
          <Calculator className="w-3.5 h-3.5 text-purple-400" />
          <span>Calculadora de Fórmula</span>
        </div>

        <button
          onClick={handleReset}
          className="p-1 rounded text-[#777777] hover:text-purple-300 hover:bg-purple-950/40 transition-colors text-[10px] flex items-center gap-1"
          title="Restablecer valores predeterminados"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Valores base</span>
        </button>
      </div>

      {/* Input parameters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {engine.inputs.map(input => (
          <div
            key={input.key}
            className="flex flex-col bg-[#1a1624] border border-purple-950/70 rounded p-1.5 focus-within:border-purple-600 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span className="font-mono text-purple-300 font-medium">
                <MathRenderer math={input.symbol} block={false} />
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]" title={input.label}>
                {input.unit || input.label}
              </span>
            </div>

            <input
              type="number"
              step="any"
              value={values[input.key] ?? input.default}
              onChange={e => handleInputChange(input.key, e.target.value)}
              className="w-full bg-[#110e19] border border-purple-900/40 focus:border-purple-500 rounded px-2 py-0.5 text-white font-mono text-xs outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Real-time Computed Result */}
      <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-950/60 to-emerald-950/40 border border-purple-800/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-purple-300/80 block">Resultado:</span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 flex items-baseline gap-1.5">
            <span>
              {isNaN(evaluation.result)
                ? 'Indefinido'
                : Number.isInteger(evaluation.result)
                ? evaluation.result
                : evaluation.result.toFixed(3)}
            </span>
            {evaluation.unit && (
              <span className="text-[11px] font-normal text-slate-400">{evaluation.unit}</span>
            )}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Step by step LaTeX substitution */}
      {evaluation.stepsLatex && (
        <div className="p-2 rounded bg-[#0f0d16] border border-purple-950/50 overflow-x-auto text-[11px] text-slate-300">
          <MathRenderer math={evaluation.stepsLatex} block={false} />
        </div>
      )}
    </div>
  );
};

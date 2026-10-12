import React, { useState, useMemo } from 'react';
import { MathRenderer } from '../MathRenderer';
import { solveDerivative } from '../../services/calculus/derivativeSolver';
import { solveIntegral } from '../../services/calculus/integralSolver';
import { toLatex } from '../../services/calculus/latexUtils';
import { CalculusOperation, CalculusResult } from '../../types/calculus';
import {
  Calculator,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Layers,
  HelpCircle,
  CheckCircle2,
  ListOrdered,
  Sigma,
  Zap,
} from 'lucide-react';

interface PresetExample {
  label: string;
  expr: string;
  type: CalculusOperation;
  tag: string;
}

const PRESETS: PresetExample[] = [
  // Derivatives
  { label: 'Polinomio', expr: '3*x^3 - 5*x^2 + 4*x - 9', type: 'derivative', tag: 'Potencia' },
  { label: 'Regla de la Cadena', expr: 'sin(3*x^2 + 1)', type: 'derivative', tag: 'Cadena' },
  { label: 'Regla del Producto', expr: 'x^2 * exp(x)', type: 'derivative', tag: 'Producto' },
  { label: 'Regla del Cociente', expr: '(x^2 - 1) / (x + 3)', type: 'derivative', tag: 'Cociente' },
  { label: 'Trigonométrica y Raíz', expr: 'sqrt(x) * cos(x)', type: 'derivative', tag: 'Mixto' },

  // Integrals
  { label: 'Polinomio Integral', expr: '4*x^3 - 6*x^2 + 2*x - 5', type: 'integral', tag: 'Linealidad' },
  { label: 'Por Partes (LIATE)', expr: 'x * exp(x)', type: 'integral', tag: 'Partes' },
  { label: 'Por Partes Trig', expr: 'x * cos(x)', type: 'integral', tag: 'Partes' },
  { label: 'u-Sustitución', expr: '2*x * (x^2 + 1)^3', type: 'integral', tag: 'Sustitución' },
  { label: 'Logarítmica e Inmediata', expr: '1/x + exp(2*x)', type: 'integral', tag: 'Inmediata' },
];

export const CalculusCalculator: React.FC = () => {
  const [operation, setOperation] = useState<CalculusOperation>('derivative');
  const [variable, setVariable] = useState<string>('x');
  const [inputExpression, setInputExpression] = useState<string>('sin(3*x^2 + 1)');
  const [copied, setCopied] = useState(false);

  // Live KaTeX preview of user expression
  const livePreviewLatex = useMemo(() => {
    if (!inputExpression.trim()) return '';
    try {
      const tex = toLatex(inputExpression);
      if (operation === 'derivative') {
        return `\\frac{d}{d${variable}}\\left[ ${tex} \\right]`;
      } else {
        return `\\int ${tex} \\, d${variable}`;
      }
    } catch {
      return '';
    }
  }, [inputExpression, operation, variable]);

  // Compute step-by-step result
  const result: CalculusResult = useMemo(() => {
    if (!inputExpression.trim()) {
      return {
        operation,
        variable,
        inputExpression: '',
        inputLatex: '',
        finalResultLatex: '',
        appliedRules: [],
        steps: [],
        success: false,
      };
    }

    if (operation === 'derivative') {
      return solveDerivative(inputExpression, variable);
    } else {
      return solveIntegral(inputExpression, variable);
    }
  }, [inputExpression, operation, variable]);

  const handleCopyResult = () => {
    if (!result.finalResultLatex) return;
    navigator.clipboard.writeText(result.finalResultLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertSymbol = (sym: string) => {
    setInputExpression(prev => prev + sym);
  };

  const filteredPresets = PRESETS.filter(p => p.type === operation);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Calculadora de Derivadas e Integrales
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#c4b5fd] border border-[#7c3aed]/30">
                  Paso a Paso
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Desglose analítico paso a paso con las reglas y métodos aplicados de Análisis Matemático.
              </p>
            </div>
          </div>
        </div>

        {/* Operation Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-black rounded-xl border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => {
              setOperation('derivative');
              setInputExpression('sin(3*x^2 + 1)');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              operation === 'derivative'
                ? 'bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Derivada (d/dx)</span>
          </button>

          <button
            onClick={() => {
              setOperation('integral');
              setInputExpression('x * exp(x)');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              operation === 'integral'
                ? 'bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>Integral (∫ dx)</span>
          </button>
        </div>
      </div>

      {/* Input & Virtual Keypad Card */}
      <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <span>Función a {operation === 'derivative' ? 'derivar' : 'integrar'}:</span>
            <span className="text-zinc-500 font-normal text-[11px]">(variable independiente: {variable})</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400">Variable:</span>
            <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-zinc-800">
              {['x', 't', 'u', 'y'].map(v => (
                <button
                  key={v}
                  onClick={() => setVariable(v)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                    variable === v
                      ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-700/50'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => setInputExpression('')}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 text-xs transition-colors"
              title="Limpiar entrada"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input box */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-zinc-500 font-mono text-sm select-none">
            {operation === 'derivative' ? `d/d${variable}` : `∫`}
          </div>
          <input
            type="text"
            value={inputExpression}
            onChange={e => setInputExpression(e.target.value)}
            placeholder={operation === 'derivative' ? 'Ej: sin(2*x) * x^2' : 'Ej: x * exp(x) + 3*x^2'}
            className="w-full pl-14 pr-10 py-3 rounded-xl bg-black border border-zinc-800 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] text-white text-base font-mono placeholder:text-zinc-600 transition-all outline-none"
          />
        </div>

        {/* Math Quick Buttons Keypad */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-zinc-500 mr-1 select-none font-medium">Símbolos:</span>
          {[
            { label: '^2', val: '^2' },
            { label: '^n', val: '^' },
            { label: '√x', val: 'sqrt(' },
            { label: 'e^x', val: 'exp(' },
            { label: 'ln(x)', val: 'log(' },
            { label: 'sin', val: 'sin(' },
            { label: 'cos', val: 'cos(' },
            { label: 'tan', val: 'tan(' },
            { label: '·', val: ' * ' },
            { label: '/', val: ' / ' },
            { label: '(', val: '(' },
            { label: ')', val: ')' },
          ].map(b => (
            <button
              key={b.label}
              onClick={() => insertSymbol(b.val)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Live Preview Card */}
        {livePreviewLatex && (
          <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-zinc-400 text-xs shrink-0 select-none">
              <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Vista previa KaTeX:</span>
            </div>
            <div className="overflow-x-auto text-right">
              <MathRenderer math={livePreviewLatex} block={false} className="text-sm font-medium" />
            </div>
          </div>
        )}

        {/* Presets / Ejemplos Rápidos */}
        <div className="pt-2 border-t border-zinc-900 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium select-none">Ejemplos típicos:</span>
          {filteredPresets.map(preset => (
            <button
              key={preset.label}
              onClick={() => setInputExpression(preset.expr)}
              className="px-2.5 py-1 rounded-lg bg-black hover:bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{preset.label}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950/60 text-[#c4b5fd] border border-purple-800/40">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result.success && (
        <div className="space-y-6 animate-fade-in">
          {/* Final Result Highlight Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#130d24] to-black border border-[#7c3aed]/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <h2 className="text-base font-semibold text-white">Resultado Final</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyResult}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
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
              </div>
            </div>

            {/* Rendered Final Result */}
            <div className="p-5 rounded-xl bg-black border border-zinc-800 text-center overflow-x-auto shadow-inner">
              <MathRenderer
                math={
                  operation === 'derivative'
                    ? `\\frac{d}{d${variable}}\\left[ ${result.inputLatex} \\right] = ${result.finalResultLatex}`
                    : `\\int ${result.inputLatex} \\, d${variable} = ${result.finalResultLatex}`
                }
                block={false}
                className="text-lg md:text-xl font-semibold text-white tracking-wide"
              />
            </div>

            {/* Applied Rules Badges */}
            {result.appliedRules.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
                  Reglas y propiedades aplicadas:
                </span>
                {result.appliedRules.map((rule, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-[#7c3aed]/40 text-[#c4b5fd] font-medium"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Step-by-Step Breakdown Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base">
              <ListOrdered className="w-5 h-5 text-[#a78bfa]" />
              <span>Desglose Analítico Paso a Paso</span>
              <span className="text-xs font-normal text-zinc-500">
                ({result.steps.length} pasos detallados)
              </span>
            </div>

            <div className="space-y-4">
              {result.steps.map(step => (
                <div
                  key={step.stepNumber}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 relative overflow-hidden group shadow-md"
                >
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/50 text-[#c4b5fd] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {step.stepNumber}
                      </div>
                      <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-[#a78bfa] border border-zinc-800 shrink-0 self-start sm:self-auto">
                      {step.ruleName}
                    </span>
                  </div>

                  {/* Step Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Theoretical Rule Formula Box */}
                  {step.ruleLatex && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 space-y-1">
                      <span className="text-[10px] font-medium text-purple-300 block uppercase tracking-wider">
                        Fórmula / Teorema aplicado:
                      </span>
                      <div className="overflow-x-auto text-left">
                        <MathRenderer math={step.ruleLatex} block={false} className="text-xs text-purple-200" />
                      </div>
                    </div>
                  )}

                  {/* Substitutions or intermediate variables box */}
                  {step.substitutions && step.substitutions.length > 0 && (
                    <div className="p-3 rounded-xl bg-black border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-medium text-zinc-400 block uppercase tracking-wider">
                        Asignación de variables intermedias:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {step.substitutions.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                            <span className="font-mono text-purple-400 font-bold">{sub.variable}:</span>
                            <MathRenderer math={sub.expression} block={false} className="text-xs text-zinc-200" />
                            {sub.differential && (
                              <span className="text-[11px] text-zinc-400 font-mono ml-auto">
                                ({sub.differential})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intermediate Mathematical Result */}
                  <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-black/60 p-3 rounded-xl border border-zinc-900">
                    <div className="text-[11px] text-zinc-500 shrink-0 font-medium">
                      Desarrollo del paso:
                    </div>
                    <div className="overflow-x-auto text-left md:text-right">
                      {step.resultLatex ? (
                        <MathRenderer
                          math={`${step.expressionLatex} \\implies ${step.resultLatex}`}
                          block={false}
                          className="text-xs md:text-sm font-medium text-white"
                        />
                      ) : (
                        <MathRenderer
                          math={step.expressionLatex}
                          block={false}
                          className="text-xs md:text-sm font-medium text-white"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {!result.success && inputExpression.trim() && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>No se pudo procesar la expresión</span>
          </div>
          <p className="text-xs text-rose-300/80 leading-relaxed">
            {result.error || 'Verifica que la sintaxis sea válida. Recuerda usar * para multiplicaciones explícitas o paréntesis para funciones (ej: sin(x), x^2, exp(x)).'}
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Topic, FormulaItem } from '../../types/modules';
import { MathRenderer } from '../MathRenderer';
import {
  Calculator,
  Search,
  Bookmark,
  Sparkles,
  Play,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
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

interface CustomCalculator {
  inputs: {
    key: string;
    label: string;
    symbol: string;
    default: number;
    unit: string;
  }[];
  compute: (v: Record<string, number>) => {
    result: number;
    unit: string;
    stepsLatex: string;
  };
}

// Dedicated high-precision computational engines for core engineering formulas
const COMPUTATIONAL_ENGINES: Record<string, CustomCalculator> = {
  torricelli: {
    inputs: [
      { key: 'v0', label: 'Velocidad inicial', symbol: 'v_0', default: 10, unit: 'm/s' },
      { key: 'a', label: 'Aceleración', symbol: 'a', default: 2.5, unit: 'm/s²' },
      { key: 'dx', label: 'Desplazamiento', symbol: '\\Delta x', default: 50, unit: 'm' },
    ],
    compute: v => {
      const radicand = v.v0 ** 2 + 2 * v.a * v.dx;
      const res = radicand >= 0 ? Math.sqrt(radicand) : NaN;
      return {
        result: res,
        unit: 'm/s',
        stepsLatex: `v_f = \\sqrt{(${v.v0})^2 + 2 \\cdot (${v.a}) \\cdot (${v.dx})} = \\sqrt{${radicand.toFixed(2)}} = ${isNaN(res) ? '\\text{No real}' : res.toFixed(3)} \\text{ m/s}`,
      };
    },
  },
  'mruv-pos': {
    inputs: [
      { key: 'x0', label: 'Posición inicial', symbol: 'x_0', default: 0, unit: 'm' },
      { key: 'v0', label: 'Velocidad inicial', symbol: 'v_0', default: 15, unit: 'm/s' },
      { key: 'a', label: 'Aceleración', symbol: 'a', default: -9.81, unit: 'm/s²' },
      { key: 't', label: 'Tiempo', symbol: 't', default: 2, unit: 's' },
    ],
    compute: v => {
      const res = v.x0 + v.v0 * v.t + 0.5 * v.a * v.t ** 2;
      return {
        result: res,
        unit: 'm',
        stepsLatex: `x(${v.t}) = ${v.x0} + (${v.v0})(${v.t}) + \\frac{1}{2}(${v.a})(${v.t})^2 = ${res.toFixed(3)} \\text{ m}`,
      };
    },
  },
  balistica: {
    inputs: [
      { key: 'v0', label: 'Rapidez de disparo', symbol: 'v_0', default: 25, unit: 'm/s' },
      { key: 'theta', label: 'Ángulo de elevación', symbol: '\\theta', default: 45, unit: 'grados' },
      { key: 'g', label: 'Gravedad', symbol: 'g', default: 9.81, unit: 'm/s²' },
    ],
    compute: v => {
      const rad = (v.theta * Math.PI) / 180;
      const R = (v.v0 ** 2 * Math.sin(2 * rad)) / v.g;
      const H = (v.v0 ** 2 * Math.sin(rad) ** 2) / (2 * v.g);
      return {
        result: R,
        unit: 'm',
        stepsLatex: `R = \\frac{${v.v0}^2 \\sin(${2 * v.theta}^\\circ)}{${v.g}} = ${R.toFixed(2)} \\text{ m} \\quad \\left(H_{\\max} = ${H.toFixed(2)} \\text{ m}\\right)`,
      };
    },
  },
  'energia-cinetica': {
    inputs: [
      { key: 'm', label: 'Masa', symbol: 'm', default: 1200, unit: 'kg' },
      { key: 'v', label: 'Velocidad', symbol: 'v', default: 20, unit: 'm/s' },
      { key: 'h', label: 'Altura', symbol: 'h', default: 15, unit: 'm' },
      { key: 'g', label: 'Gravedad', symbol: 'g', default: 9.81, unit: 'm/s²' },
    ],
    compute: v => {
      const ec = 0.5 * v.m * v.v ** 2;
      const ep = v.m * v.g * v.h;
      const em = ec + ep;
      return {
        result: em,
        unit: 'J',
        stepsLatex: `E_c = ${ec.toFixed(1)} \\text{ J}, \\; E_{pg} = ${ep.toFixed(1)} \\text{ J} \\implies E_{\\text{mec}} = ${em.toFixed(1)} \\text{ J}`,
      };
    },
  },
  'friccion-correas-euler': {
    inputs: [
      { key: 't1', label: 'Tensión menor', symbol: 'T_1', default: 100, unit: 'N' },
      { key: 'mu', label: 'Coef. rozamiento', symbol: '\\mu', default: 0.3, unit: 'adim' },
      { key: 'beta', label: 'Ángulo de contacto', symbol: '\\beta', default: 180, unit: 'grados' },
    ],
    compute: v => {
      const rad = (v.beta * Math.PI) / 180;
      const res = v.t1 * Math.exp(v.mu * rad);
      return {
        result: res,
        unit: 'N',
        stepsLatex: `T_2 = ${v.t1} \\cdot e^{${v.mu} \\cdot ${rad.toFixed(3)}} = ${res.toFixed(2)} \\text{ N}`,
      };
    },
  },
  'periodo-pendulo-fisico-compuesto': {
    inputs: [
      { key: 'io', label: 'Momento de inercia IO', symbol: 'I_O', default: 0.85, unit: 'kg·m²' },
      { key: 'm', label: 'Masa total', symbol: 'M', default: 2.5, unit: 'kg' },
      { key: 'd', label: 'Distancia pivote-CM', symbol: 'd', default: 0.35, unit: 'm' },
      { key: 'g', label: 'Gravedad', symbol: 'g', default: 9.81, unit: 'm/s²' },
    ],
    compute: v => {
      const denom = v.m * v.g * v.d;
      const res = 2 * Math.PI * Math.sqrt(v.io / denom);
      return {
        result: res,
        unit: 's',
        stepsLatex: `T = 2\\pi \\sqrt{\\frac{${v.io}}{${v.m} \\cdot ${v.g} \\cdot ${v.d}}} = 2\\pi \\sqrt{\\frac{${v.io}}{${denom.toFixed(3)}}} = ${res.toFixed(3)} \\text{ s}`,
      };
    },
  },
  'amplitud-resonancia-forzada': {
    inputs: [
      { key: 'f0', label: 'Amplitud fuerza', symbol: 'F_0', default: 50, unit: 'N' },
      { key: 'm', label: 'Masa oscilador', symbol: 'm', default: 2, unit: 'kg' },
      { key: 'w0', label: 'Frecuencia natural', symbol: '\\omega_0', default: 10, unit: 'rad/s' },
      { key: 'w', label: 'Frecuencia excitadora', symbol: '\\omega', default: 9.8, unit: 'rad/s' },
      { key: 'gamma', label: 'Amortiguamiento', symbol: '\\gamma', default: 0.2, unit: 's⁻¹' },
    ],
    compute: v => {
      const term1 = (v.w0 ** 2 - v.w ** 2) ** 2;
      const term2 = 4 * v.gamma ** 2 * v.w ** 2;
      const denom = Math.sqrt(term1 + term2);
      const res = (v.f0 / v.m) / denom;
      return {
        result: res,
        unit: 'm',
        stepsLatex: `A(${v.w}) = \\frac{${v.f0} / ${v.m}}{\\sqrt{(${v.w0}^2 - ${v.w}^2)^2 + 4(${v.gamma})^2(${v.w})^2}} = \\frac{${(v.f0/v.m).toFixed(2)}}{${denom.toFixed(3)}} = ${res.toFixed(4)} \\text{ m}`,
      };
    },
  },
  'rendimiento-ciclo-carnot': {
    inputs: [
      { key: 'tc', label: 'Temperatura fuente caliente', symbol: 'T_C', default: 600, unit: 'K' },
      { key: 'tf', label: 'Temperatura fuente fría', symbol: 'T_F', default: 300, unit: 'K' },
    ],
    compute: v => {
      const res = 1 - v.tf / v.tc;
      return {
        result: res * 100,
        unit: '%',
        stepsLatex: `\\eta = 1 - \\frac{${v.tf}}{${v.tc}} = 1 - ${(v.tf/v.tc).toFixed(3)} = ${(res*100).toFixed(1)} \\%`,
      };
    },
  },
  'ley-coulomb-vectorial': {
    inputs: [
      { key: 'q1', label: 'Carga 1', symbol: 'q_1', default: 10, unit: 'µC' },
      { key: 'q2', label: 'Carga 2', symbol: 'q_2', default: -5, unit: 'µC' },
      { key: 'r', label: 'Distancia de separación', symbol: 'r', default: 0.1, unit: 'm' },
    ],
    compute: v => {
      const k = 8.9875e9;
      const q1_c = v.q1 * 1e-6;
      const q2_c = v.q2 * 1e-6;
      const res = (k * Math.abs(q1_c * q2_c)) / (v.r ** 2);
      return {
        result: res,
        unit: 'N',
        stepsLatex: `F = (8.99 \\times 10^9) \\frac{|(${v.q1}\\cdot 10^{-6})(${v.q2}\\cdot 10^{-6})|}{(${v.r})^2} = ${res.toFixed(2)} \\text{ N}`,
      };
    },
  },
  'capacidad-capacitor-plano': {
    inputs: [
      { key: 'area', label: 'Área de placas A', symbol: 'A', default: 0.05, unit: 'm²' },
      { key: 'd', label: 'Separación placas d', symbol: 'd', default: 0.002, unit: 'm' },
      { key: 'kappa', label: 'Constante dieléctrica', symbol: '\\kappa', default: 3.5, unit: 'adim' },
    ],
    compute: v => {
      const eps0 = 8.854e-12;
      const C = (v.kappa * eps0 * v.area) / v.d;
      const pF = C * 1e12;
      return {
        result: pF,
        unit: 'pF',
        stepsLatex: `C = \\frac{${v.kappa} \\cdot (8.854 \\times 10^{-12}) \\cdot ${v.area}}{${v.d}} = ${pF.toFixed(2)} \\text{ pF}`,
      };
    },
  },
  'ecuacion-onda-unidimensional': {
    inputs: [
      { key: 'v', label: 'Velocidad de propagación', symbol: 'v', default: 340, unit: 'm/s' },
      { key: 'f', label: 'Frecuencia f', symbol: 'f', default: 440, unit: 'Hz' },
    ],
    compute: v => {
      const lambda = v.v / v.f;
      const k = (2 * Math.PI) / lambda;
      const omega = 2 * Math.PI * v.f;
      return {
        result: lambda,
        unit: 'm',
        stepsLatex: `\\lambda = \\frac{${v.v}}{${v.f}} = ${lambda.toFixed(3)} \\text{ m} \\quad \\left(k = ${k.toFixed(2)} \\text{ rad/m}, \\; \\omega = ${omega.toFixed(1)} \\text{ rad/s}\\right)`,
      };
    },
  },
  'criterio-rayleigh-abertura-circular': {
    inputs: [
      { key: 'lambda', label: 'Longitud de onda', symbol: '\\lambda', default: 550, unit: 'nm' },
      { key: 'd', label: 'Diámetro de apertura D', symbol: 'D', default: 150, unit: 'mm' },
    ],
    compute: v => {
      const lam_m = v.lambda * 1e-9;
      const d_m = v.d * 1e-3;
      const rad = 1.22 * (lam_m / d_m);
      const arcsec = rad * (180 / Math.PI) * 3600;
      return {
        result: arcsec,
        unit: 'arcsec',
        stepsLatex: `\\theta_{\\min} = 1.22 \\frac{${v.lambda} \\times 10^{-9}}{${v.d} \\times 10^{-3}} = ${rad.toExponential(3)} \\text{ rad} = ${arcsec.toFixed(2)}''`,
      };
    },
  },
};

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
        (item.formula.tags && item.formula.tags.some(t => t.toLowerCase().includes(term)))
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

  // Active computational engine
  const engine = currentItem ? COMPUTATIONAL_ENGINES[currentItem.formula.id] : undefined;

  // Dynamic input values for the active formula
  const [customValues, setCustomValues] = useState<Record<string, number>>({});

  // Reset/sync custom values when active formula changes
  React.useEffect(() => {
    if (!currentItem) return;
    const initial: Record<string, number> = {};
    if (engine) {
      engine.inputs.forEach(i => {
        initial[i.key] = i.default;
      });
    } else {
      initial['x'] = 2.0;
      initial['y'] = 1.0;
      initial['t'] = 0.5;
    }
    setCustomValues(initial);
  }, [currentItem?.formula.id, engine]);

  const handleInputChange = (key: string, val: string) => {
    const num = parseFloat(val);
    setCustomValues(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  };

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

  const evaluatedOutput = engine ? engine.compute(customValues) : null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#dcddde] select-none">
      {/* 1. Obsidian Breadcrumbs & Header Bar */}
      <div className="h-10 border-b border-[#242424] px-4 flex items-center justify-between bg-[#181818] shrink-0 text-xs">
        <div className="flex items-center gap-2 text-[#888888]">
          <Calculator className="w-3.5 h-3.5 text-[#999999]" />
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-[#666666]">Herramientas</span>
            <span className="text-[#444444]">/</span>
            <span className="text-[#cccccc] font-medium">Banco de Fórmulas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242424] text-[#aaaaaa] border border-[#2e2e2e]">
            {allEnrichedFormulas.length} fórmulas
          </span>
        </div>
      </div>

      {/* 2. Main Workbench Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full select-text">
        {/* Module Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-[#181818] border border-[#242424] text-xs">
          {moduleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedModule(tab.id)}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 text-xs ${
                selectedModule === tab.id
                  ? 'bg-[#2a2a2a] text-white font-medium border border-[#383838]'
                  : 'text-[#888888] hover:text-[#cccccc] hover:bg-[#202020]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#141414] text-[#777777]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Catalog List + Evaluator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Search & Catalog (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar fórmula por nombre o LaTeX..."
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#161616] border border-[#262626] text-[#e0e0e0] placeholder:text-[#666666] text-xs outline-none focus:border-[#404040] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#666666] px-1">
              <span>{filteredFormulas.length} expresiones disponibles</span>
              <span>Clic para inspeccionar</span>
            </div>

            {/* Scrollable list */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredFormulas.length === 0 ? (
                <div className="p-8 text-center bg-[#181818] rounded-md border border-[#242424] text-xs text-[#666666]">
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
                      className={`p-3 rounded-md cursor-pointer transition-colors border text-left group ${
                        isSelected
                          ? 'bg-[#222222] border-[#383838] border-l-[3px] border-l-[#7c3aed] text-white'
                          : 'bg-[#181818] border-[#242424] hover:bg-[#1f1f1f] hover:border-[#2e2e2e] text-[#cccccc]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-[#777777] block truncate">
                            {moduleName} • {topic.unit.split(':')[0]}
                          </span>
                          <h4 className={`text-xs font-semibold truncate mt-0.5 ${isSelected ? 'text-white' : 'text-[#dddddd] group-hover:text-white'}`}>
                            {formula.name}
                          </h4>
                        </div>
                        {isFav && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div className="mt-2 px-2 py-1.5 rounded bg-[#121212] border border-[#1e1e1e] overflow-x-hidden text-xs text-[#b0b0b0]">
                        <MathRenderer math={formula.latex} block={false} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Formula Workspace & Evaluator (7 cols) */}
          {currentItem ? (
            <div className="lg:col-span-7 space-y-4 sticky top-4">
              {/* Formula Master Card */}
              <div className="p-5 rounded-md bg-[#181818] border border-[#262626] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#222222] text-[#aaaaaa] border border-[#2e2e2e]">
                        {currentItem.moduleName}
                      </span>
                      <span className="text-[#666666] font-mono text-[11px] truncate max-w-xs">
                        {currentItem.topic.unit}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {currentItem.formula.name}
                    </h3>
                    {currentItem.formula.description && (
                      <p className="text-xs text-[#888888] mt-1 leading-relaxed">
                        {currentItem.formula.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(currentItem.formula.id)}
                        title={favorites.includes(currentItem.formula.id) ? 'Quitar de guardadas' : 'Guardar en favoritas'}
                        className={`p-1.5 rounded transition-colors ${
                          favorites.includes(currentItem.formula.id)
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'text-[#888888] hover:text-white hover:bg-[#222222]'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyLatex(currentItem.formula.latex)}
                      title="Copiar código LaTeX"
                      className="p-1.5 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2c2c2c] text-[#cccccc] hover:text-white transition-colors text-xs flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>LaTeX</span>
                        </>
                      )}
                    </button>

                    {onSelectTopic && (
                      <button
                        onClick={() => onSelectTopic(currentItem.topic)}
                        title="Abrir nota completa en bóveda"
                        className="p-1.5 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2c2c2c] text-[#cccccc] hover:text-white transition-colors text-xs flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span className="hidden sm:inline">Ver Nota</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Large LaTeX Formula Display */}
                <div className="p-4 rounded-md bg-[#131313] border border-[#222222] overflow-x-auto text-center">
                  <MathRenderer math={currentItem.formula.latex} block copyable />
                </div>

                {/* Tags */}
                {currentItem.formula.tags && currentItem.formula.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentItem.formula.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded bg-[#161616] text-[10px] font-mono text-[#777777] border border-[#222222]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Evaluation Section */}
              {engine ? (
                <div className="p-5 rounded-md bg-[#181818] border border-[#262626] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#242424] pb-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#cccccc] flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-[#a78bfa]" />
                      Evaluador Paramétrico
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded">
                      Motor Numérico Activo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {engine.inputs.map(inp => (
                      <div key={inp.key} className="space-y-1 p-2.5 rounded-md bg-[#141414] border border-[#242424]">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#cccccc] font-medium flex items-center gap-1">
                            <span className="font-mono text-[#a78bfa]">${inp.symbol}$</span>
                            <span className="truncate">{inp.label}</span>
                          </span>
                          <span className="text-[#777777] font-mono text-[10px]">{inp.unit}</span>
                        </div>
                        <input
                          type="number"
                          step="any"
                          value={customValues[inp.key] ?? inp.default}
                          onChange={e => handleInputChange(inp.key, e.target.value)}
                          className="w-full bg-[#181818] border border-[#2c2c2c] focus:border-[#4a4a4a] rounded px-2.5 py-1 text-white font-mono text-xs outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Calculation Output Box */}
                  {evaluatedOutput && (
                    <div className="space-y-2.5 pt-1">
                      <div className="p-3.5 rounded-md bg-[#141414] border border-[#262626] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-[#777777] mb-0.5">Resultado Calculado:</div>
                          <div className="text-xl font-bold font-mono text-emerald-400">
                            {isNaN(evaluatedOutput.result) ? 'Indefinido / No real' : evaluatedOutput.result.toFixed(4)}{' '}
                            <span className="text-xs font-normal text-[#888888]">{evaluatedOutput.unit}</span>
                          </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-emerald-400/60" />
                      </div>

                      <div className="p-3 rounded-md bg-[#121212] border border-[#202020] overflow-x-auto text-xs">
                        <span className="text-[10px] font-mono text-[#666666] block mb-1">
                          Sustitución Paso a Paso:
                        </span>
                        <MathRenderer math={evaluatedOutput.stepsLatex} block={false} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Analytical Contextual Card for Formulas without Custom Numerical Engine */
                <div className="p-4 rounded-md bg-[#181818] border border-[#262626] border-l-4 border-l-[#7c3aed] space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[#aaaaaa]">
                    <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Definición Analítica y Teorema</span>
                  </div>
                  <p className="text-[#888888] leading-relaxed">
                    Esta fórmula forma parte del marco teórico de <strong className="text-[#cccccc]">{currentItem.topic.title}</strong>. Para su demostración y aplicaciones completas, puedes consultar la nota en la bóveda.
                  </p>
                  {onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(currentItem.topic)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#cccccc] hover:text-white transition-colors text-xs font-mono"
                    >
                      <span>Ir a la nota</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-7 p-12 text-center bg-[#181818] rounded-md border border-[#242424] text-xs text-[#666666]">
              Selecciona una fórmula del catálogo para evaluar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

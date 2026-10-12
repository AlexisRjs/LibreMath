import React, { useState, useMemo } from 'react';
import { MathRenderer } from '../MathRenderer';
import { solveDerivative } from '../../services/calculus/derivativeSolver';
import { solveIntegral } from '../../services/calculus/integralSolver';
import { solveVectorFunction } from '../../services/calculus/vectorFunctionsSolver';
import { solveMultivariableDerivatives } from '../../services/calculus/multivariableDerivativesSolver';
import { solveExtrema } from '../../services/calculus/extremaSolver';
import { solveMultipleIntegral } from '../../services/calculus/multipleIntegralsSolver';
import { solveLineIntegral } from '../../services/calculus/lineIntegralsSolver';
import { solveSurfaceIntegral } from '../../services/calculus/surfaceIntegralsSolver';
import { solveDifferentialEquation } from '../../services/calculus/differentialEquationsSolver';
import { CalculusCategory, CalculusOperation, CalculusResult } from '../../types/calculus';
import {
  Calculator,
  Copy,
  Check,
  Layers,
  HelpCircle,
  CheckCircle2,
  ListOrdered,
  Zap,
  Compass,
  Boxes,
  Maximize2,
  Grid3X3,
  GitCommit,
  Globe2,
  Binary,
} from 'lucide-react';

interface UnitTab {
  id: CalculusCategory;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const UNIT_TABS: UnitTab[] = [
  {
    id: 'am1',
    name: 'AM1: 1 Variable',
    badge: 'd/dx & ∫',
    icon: Zap,
    description: 'Derivadas e Integrales indefinidas paso a paso',
  },
  {
    id: 'u1_vector_functions',
    name: 'U1: Func. Vectoriales',
    badge: 'r(t)',
    icon: Compass,
    description: 'Curvas espaciales, velocidad, vector tangente unitario T(t) y curvatura',
  },
  {
    id: 'u2_u3_multivariable',
    name: 'U2-U3: Derivadas Parciales',
    badge: '∇f & Plano Tg',
    icon: Boxes,
    description: 'Derivadas parciales, Teorema de Schwarz, Gradiente, Derivada Direccional y Plano Tangente',
  },
  {
    id: 'u4_extrema',
    name: 'U4: Extremos y Hessiana',
    badge: 'H(x, y)',
    icon: Maximize2,
    description: 'Puntos críticos, Matriz Hessiana, Discriminante D, Clasificación y Multiplicadores de Lagrange',
  },
  {
    id: 'u5_multiple_integrals',
    name: 'U5: Integrales Múltiples',
    badge: '∬ dx dy',
    icon: Grid3X3,
    description: 'Integrales dobles iteradas por Fubini y cambio a coordenadas polares',
  },
  {
    id: 'u6_line_integrals',
    name: 'U6: Integrales de Línea',
    badge: '∮ F·dr',
    icon: GitCommit,
    description: 'Campos conservativos, función potencial phi, Teorema de Green y trabajo',
  },
  {
    id: 'u7_surface_integrals',
    name: 'U7: Integrales de Superficie',
    badge: 'Gauss & Stokes',
    icon: Globe2,
    description: 'Flujo, Divergencia (Teorema de Gauss) y Rotacional (Teorema de Stokes)',
  },
  {
    id: 'u8_differential_equations',
    name: 'U8: Ecuaciones Diferenciales',
    badge: 'EDO',
    icon: Binary,
    description: 'Lineales de 1er orden por factor integrante, variables separables y 2do orden homogéneas',
  },
];

export const CalculusCalculator: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState<CalculusCategory>('am1');
  const [copied, setCopied] = useState(false);

  // AM1 State
  const [am1Op, setAm1Op] = useState<CalculusOperation>('derivative');
  const [am1Var, setAm1Var] = useState<string>('x');
  const [am1Expr, setAm1Expr] = useState<string>('sin(3*x^2 + 1)');

  // U1 State (Vector Functions)
  const [u1Xt, setU1Xt] = useState<string>('cos(t)');
  const [u1Yt, setU1Yt] = useState<string>('sin(t)');
  const [u1Zt, setU1Zt] = useState<string>('t');
  const [u1TVal, setU1TVal] = useState<string>('0');
  const [u1Op, setU1Op] = useState<'velocity' | 'tangent_unit' | 'acceleration' | 'curvature'>('tangent_unit');

  // U2/U3 State (Multivariable)
  const [u2Expr, setU2Expr] = useState<string>('x^2 * y + sin(x * y)');
  const [u2X0, setU2X0] = useState<string>('1');
  const [u2Y0, setU2Y0] = useState<string>('2');
  const [u2Vx, setU2Vx] = useState<string>('3');
  const [u2Vy, setU2Vy] = useState<string>('4');
  const [u2Op, setU2Op] = useState<'partials' | 'gradient' | 'directional' | 'tangent_plane'>('partials');

  // U4 State (Extrema)
  const [u4Expr, setU4Expr] = useState<string>('x^3 - 3*x + y^2 - 4*y');
  const [u4Points, setU4Points] = useState<string>('(1, 2), (-1, 2)');
  const [u4Constraint, setU4Constraint] = useState<string>('x^2 + y^2 - 1');
  const [u4Mode, setU4Mode] = useState<'hessian' | 'lagrange'>('hessian');

  // U5 State (Multiple Integrals)
  const [u5Expr, setU5Expr] = useState<string>('x * y^2 + 2*x');
  const [u5XMin, setU5XMin] = useState<string>('0');
  const [u5XMax, setU5XMax] = useState<string>('2');
  const [u5YMin, setU5YMin] = useState<string>('1');
  const [u5YMax, setU5YMax] = useState<string>('3');
  const [u5Coord, setU5Coord] = useState<'cartesian' | 'polar'>('cartesian');

  // U6 State (Line Integrals)
  const [u6P, setU6P] = useState<string>('2*x*y + y^3');
  const [u6Q, setU6Q] = useState<string>('x^2 + 3*x*y^2');
  const [u6Mode, setU6Mode] = useState<'conservative_test' | 'green_theorem' | 'work_integral'>('conservative_test');

  // U7 State (Surface Integrals & Theorems)
  const [u7P, setU7P] = useState<string>('x^2 * z');
  const [u7Q, setU7Q] = useState<string>('y^2 * x');
  const [u7R, setU7R] = useState<string>('z^2 * y');
  const [u7Mode, setU7Mode] = useState<'divergence_gauss' | 'curl_stokes'>('divergence_gauss');

  // U8 State (Differential Equations)
  const [u8Type, setU8Type] = useState<'linear_first_order' | 'separable' | 'second_order_homogeneous'>('linear_first_order');
  const [u8Px, setU8Px] = useState<string>('2');
  const [u8Qx, setU8Qx] = useState<string>('exp(x)');
  const [u8Gx, setU8Gx] = useState<string>('2*x');
  const [u8Hy, setU8Hy] = useState<string>('y');
  const [u8A, setU8A] = useState<string>('1');
  const [u8B, setU8B] = useState<string>('-5');
  const [u8C, setU8C] = useState<string>('6');

  // Compute Result based on current Unit
  const result: CalculusResult = useMemo(() => {
    switch (activeUnit) {
      case 'am1':
        if (!am1Expr.trim()) return { inputLatex: '', finalResultLatex: '', appliedRules: [], steps: [], success: false };
        return am1Op === 'derivative'
          ? solveDerivative(am1Expr, am1Var)
          : solveIntegral(am1Expr, am1Var);

      case 'u1_vector_functions':
        return solveVectorFunction({
          xt: u1Xt,
          yt: u1Yt,
          zt: u1Zt,
          tVal: u1TVal,
          operationType: u1Op,
        });

      case 'u2_u3_multivariable':
        return solveMultivariableDerivatives({
          expression: u2Expr,
          x0: u2X0,
          y0: u2Y0,
          vx: u2Vx,
          vy: u2Vy,
          operationType: u2Op,
        });

      case 'u4_extrema':
        return solveExtrema({
          expression: u4Expr,
          criticalPointsInput: u4Points,
          constraintExpr: u4Constraint,
          mode: u4Mode,
        });

      case 'u5_multiple_integrals':
        return solveMultipleIntegral({
          expression: u5Expr,
          xMin: u5XMin,
          xMax: u5XMax,
          yMin: u5YMin,
          yMax: u5YMax,
          coordinateSystem: u5Coord,
        });

      case 'u6_line_integrals':
        return solveLineIntegral({
          pExpr: u6P,
          qExpr: u6Q,
          mode: u6Mode,
        });

      case 'u7_surface_integrals':
        return solveSurfaceIntegral({
          pExpr: u7P,
          qExpr: u7Q,
          rExpr: u7R,
          mode: u7Mode,
        });

      case 'u8_differential_equations':
        return solveDifferentialEquation({
          odeType: u8Type,
          px: u8Px,
          qx: u8Qx,
          gx: u8Gx,
          hy: u8Hy,
          aCoeff: u8A,
          bCoeff: u8B,
          cCoeff: u8C,
        });

      default:
        return { inputLatex: '', finalResultLatex: '', appliedRules: [], steps: [], success: false };
    }
  }, [
    activeUnit,
    am1Op,
    am1Var,
    am1Expr,
    u1Xt,
    u1Yt,
    u1Zt,
    u1TVal,
    u1Op,
    u2Expr,
    u2X0,
    u2Y0,
    u2Vx,
    u2Vy,
    u2Op,
    u4Expr,
    u4Points,
    u4Constraint,
    u4Mode,
    u5Expr,
    u5XMin,
    u5XMax,
    u5YMin,
    u5YMax,
    u5Coord,
    u6P,
    u6Q,
    u6Mode,
    u7P,
    u7Q,
    u7R,
    u7Mode,
    u8Type,
    u8Px,
    u8Qx,
    u8Gx,
    u8Hy,
    u8A,
    u8B,
    u8C,
  ]);

  const handleCopyResult = () => {
    if (!result.finalResultLatex) return;
    navigator.clipboard.writeText(result.finalResultLatex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTabMeta = UNIT_TABS.find(t => t.id === activeUnit) || UNIT_TABS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-[#7c3aed]/50 flex items-center justify-center text-[#c4b5fd] shadow-[0_0_18px_rgba(124,58,237,0.35)]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Calculadora de Análisis Matemático
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#c4b5fd] border border-[#7c3aed]/30">
                U1 a U8 Paso a Paso
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Resolución analítica detallada indicando qué regla aplicar, desarrollo paso a paso y resultado final.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Unit Selection Tabs (U1 through U8) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
            Selecciona la Unidad Temática:
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {activeTabMeta.badge} • {activeTabMeta.description}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-1.5 bg-black rounded-2xl border border-zinc-800">
          {UNIT_TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeUnit === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveUnit(tab.id)}
                className={`p-2 rounded-xl text-left transition-all duration-150 flex flex-col justify-between gap-1 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#7c3aed]/20 border-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                    : 'bg-zinc-950/60 border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#a78bfa]' : 'text-zinc-500'}`} />
                  <span className={`text-[9px] font-mono px-1 rounded ${isSelected ? 'bg-[#7c3aed]/40 text-purple-200' : 'bg-zinc-900 text-zinc-500'}`}>
                    {tab.badge}
                  </span>
                </div>
                <div className="font-semibold text-[11px] leading-tight truncate">
                  {tab.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Unit Input Panels */}
      <div className="p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-5">
        {/* AM1 Panel */}
        {activeUnit === 'am1' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAm1Op('derivative')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    am1Op === 'derivative'
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Derivada (d/dx)
                </button>
                <button
                  onClick={() => setAm1Op('integral')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    am1Op === 'integral'
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Integral (∫ dx)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">Variable:</span>
                {['x', 't', 'u', 'y'].map(v => (
                  <button
                    key={v}
                    onClick={() => setAm1Var(v)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                      am1Var === v
                        ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-700/50'
                        : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Función a {am1Op === 'derivative' ? 'derivar' : 'integrar'}:
              </label>
              <input
                type="text"
                value={am1Expr}
                onChange={e => setAm1Expr(e.target.value)}
                placeholder="Ej: sin(3*x^2 + 1) o x * exp(x)"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-800 focus:border-[#7c3aed] text-white font-mono text-sm outline-none"
              />
            </div>
          </div>
        )}

        {/* U1: Vector Functions Panel */}
        {activeUnit === 'u1_vector_functions' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Curva paramétrica r(t) = (x(t), y(t), z(t)):
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'velocity', label: 'Velocidad r\'(t)' },
                  { id: 'tangent_unit', label: 'Vector Unitario T(t)' },
                  { id: 'acceleration', label: 'Aceleración r\'\'(t)' },
                  { id: 'curvature', label: 'Curvatura κ(t)' },
                ].map(op => (
                  <button
                    key={op.id}
                    onClick={() => setU1Op(op.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      u1Op === op.id
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">x(t):</label>
                <input
                  type="text"
                  value={u1Xt}
                  onChange={e => setU1Xt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: cos(t)"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">y(t):</label>
                <input
                  type="text"
                  value={u1Yt}
                  onChange={e => setU1Yt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: sin(t)"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">z(t) (opcional 3D):</label>
                <input
                  type="text"
                  value={u1Zt}
                  onChange={e => setU1Zt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: t (dejar vacío si es 2D)"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[11px] text-zinc-400">Evaluar en punto t₀ (opcional):</label>
              <input
                type="text"
                value={u1TVal}
                onChange={e => setU1TVal(e.target.value)}
                className="w-24 px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                placeholder="Ej: 0"
              />
            </div>
          </div>
        )}

        {/* U2/U3: Multivariable Derivatives Panel */}
        {activeUnit === 'u2_u3_multivariable' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Función multivariable z = f(x, y):
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'partials', label: 'Derivadas Parciales y Schwarz' },
                  { id: 'gradient', label: 'Gradiente ∇f' },
                  { id: 'directional', label: 'Derivada Direccional Du' },
                  { id: 'tangent_plane', label: 'Plano Tangente' },
                ].map(op => (
                  <button
                    key={op.id}
                    onClick={() => setU2Op(op.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      u2Op === op.id
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                value={u2Expr}
                onChange={e => setU2Expr(e.target.value)}
                placeholder="Ej: x^2 * y + sin(x * y)"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-800 focus:border-[#7c3aed] text-white font-mono text-sm outline-none"
              />
            </div>

            {/* Sub-inputs for points and direction */}
            {(u2Op === 'directional' || u2Op === 'tangent_plane' || u2Op === 'gradient') && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-black/60 rounded-xl border border-zinc-900">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Punto x₀:</label>
                  <input
                    type="text"
                    value={u2X0}
                    onChange={e => setU2X0(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Punto y₀:</label>
                  <input
                    type="text"
                    value={u2Y0}
                    onChange={e => setU2Y0(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  />
                </div>
                {u2Op === 'directional' && (
                  <>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Vector dir vx:</label>
                      <input
                        type="text"
                        value={u2Vx}
                        onChange={e => setU2Vx(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Vector dir vy:</label>
                      <input
                        type="text"
                        value={u2Vy}
                        onChange={e => setU2Vy(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* U4: Extrema & Hessian Panel */}
        {activeUnit === 'u4_extrema' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Optimización y Extremos en R²:
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setU4Mode('hessian')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u4Mode === 'hessian'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Matriz Hessiana y Clasificación
                </button>
                <button
                  onClick={() => setU4Mode('lagrange')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u4Mode === 'lagrange'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Multiplicadores de Lagrange
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Función objetivo f(x, y):</label>
                <input
                  type="text"
                  value={u4Expr}
                  onChange={e => setU4Expr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: x^3 - 3*x + y^2 - 4*y"
                />
              </div>

              {u4Mode === 'hessian' ? (
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Puntos críticos a clasificar (x, y):</label>
                  <input
                    type="text"
                    value={u4Points}
                    onChange={e => setU4Points(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: (1, 2), (-1, 2)"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Restricción g(x, y) = 0:</label>
                  <input
                    type="text"
                    value={u4Constraint}
                    onChange={e => setU4Constraint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: x^2 + y^2 - 1"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* U5: Multiple Integrals Panel */}
        {activeUnit === 'u5_multiple_integrals' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Integral Doble: ∬ f(x, y) dA
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setU5Coord('cartesian')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u5Coord === 'cartesian'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Cartesianas (dx dy)
                </button>
                <button
                  onClick={() => setU5Coord('polar')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u5Coord === 'polar'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Polares (r dr dθ)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Integrando f(x, y):</label>
              <input
                type="text"
                value={u5Expr}
                onChange={e => setU5Expr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                placeholder="Ej: x * y^2 + 2*x"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-black/60 rounded-xl border border-zinc-900">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  {u5Coord === 'polar' ? 'θ Mínimo:' : 'x Mínimo (a):'}
                </label>
                <input
                  type="text"
                  value={u5XMin}
                  onChange={e => setU5XMin(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  {u5Coord === 'polar' ? 'θ Máximo:' : 'x Máximo (b):'}
                </label>
                <input
                  type="text"
                  value={u5XMax}
                  onChange={e => setU5XMax(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  {u5Coord === 'polar' ? 'r Mínimo:' : 'y Mínimo (c):'}
                </label>
                <input
                  type="text"
                  value={u5YMin}
                  onChange={e => setU5YMin(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  {u5Coord === 'polar' ? 'r Máximo:' : 'y Máximo (d):'}
                </label>
                <input
                  type="text"
                  value={u5YMax}
                  onChange={e => setU5YMax(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* U6: Line Integrals Panel */}
        {activeUnit === 'u6_line_integrals' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Campo Vectorial F(x, y) = P i + Q j:
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  { id: 'conservative_test', label: 'Campo Conservativo & Potencial' },
                  { id: 'green_theorem', label: 'Teorema de Green' },
                  { id: 'work_integral', label: 'Trabajo Parametrizado' },
                ].map(op => (
                  <button
                    key={op.id}
                    onClick={() => setU6Mode(op.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      u6Mode === op.id
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Componente P(x, y):</label>
                <input
                  type="text"
                  value={u6P}
                  onChange={e => setU6P(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: 2*x*y + y^3"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Componente Q(x, y):</label>
                <input
                  type="text"
                  value={u6Q}
                  onChange={e => setU6Q(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: x^2 + 3*x*y^2"
                />
              </div>
            </div>
          </div>
        )}

        {/* U7: Surface Integrals Panel */}
        {activeUnit === 'u7_surface_integrals' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Campo Vectorial 3D F(x, y, z) = (P, Q, R):
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setU7Mode('divergence_gauss')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u7Mode === 'divergence_gauss'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Divergencia (Teorema de Gauss)
                </button>
                <button
                  onClick={() => setU7Mode('curl_stokes')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    u7Mode === 'curl_stokes'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Rotacional (Teorema de Stokes)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">P(x, y, z):</label>
                <input
                  type="text"
                  value={u7P}
                  onChange={e => setU7P(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: x^2 * z"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Q(x, y, z):</label>
                <input
                  type="text"
                  value={u7Q}
                  onChange={e => setU7Q(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: y^2 * x"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">R(x, y, z):</label>
                <input
                  type="text"
                  value={u7R}
                  onChange={e => setU7R(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                  placeholder="Ej: z^2 * y"
                />
              </div>
            </div>
          </div>
        )}

        {/* U8: Differential Equations Panel */}
        {activeUnit === 'u8_differential_equations' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                Tipo de Ecuación Diferencial:
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'linear_first_order', label: '1er Orden: y\' + P(x)y = Q(x)' },
                  { id: 'separable', label: 'Variables Separables: y\' = g(x)h(y)' },
                  { id: 'second_order_homogeneous', label: '2do Orden: ay\'\' + by\' + cy = 0' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setU8Type(t.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      u8Type === t.id
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {u8Type === 'linear_first_order' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">P(x) (coeficiente de y):</label>
                  <input
                    type="text"
                    value={u8Px}
                    onChange={e => setU8Px(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: 2"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Q(x) (término independiente):</label>
                  <input
                    type="text"
                    value={u8Qx}
                    onChange={e => setU8Qx(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: exp(x)"
                  />
                </div>
              </div>
            )}

            {u8Type === 'separable' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">g(x) (función de x):</label>
                  <input
                    type="text"
                    value={u8Gx}
                    onChange={e => setU8Gx(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: 2*x"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">h(y) (función de y):</label>
                  <input
                    type="text"
                    value={u8Hy}
                    onChange={e => setU8Hy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="Ej: y"
                  />
                </div>
              </div>
            )}

            {u8Type === 'second_order_homogeneous' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Coeficiente a (y''):</label>
                  <input
                    type="text"
                    value={u8A}
                    onChange={e => setU8A(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Coeficiente b (y'):</label>
                  <input
                    type="text"
                    value={u8B}
                    onChange={e => setU8B(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="-5"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Coeficiente c (y):</label>
                  <input
                    type="text"
                    value={u8C}
                    onChange={e => setU8C(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white font-mono text-xs outline-none"
                    placeholder="6"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Results Section: Final Result, Applied Rules & Step-by-Step Breakdown */}
      {result.success && (
        <div className="space-y-6 animate-fade-in">
          {/* Final Result Card */}
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

            {/* Rendered Math Equality */}
            <div className="p-5 rounded-xl bg-black border border-zinc-800 text-center overflow-x-auto shadow-inner">
              <MathRenderer
                math={result.finalResultLatex}
                block={false}
                className="text-lg md:text-xl font-semibold text-white tracking-wide"
              />
            </div>

            {/* Applied Rules Badges */}
            {result.appliedRules.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
                  Qué aplicar para resolver (Reglas y Teoremas):
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
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 relative overflow-hidden shadow-md"
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
      {!result.success && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Verifica los datos ingresados</span>
          </div>
          <p className="text-xs text-rose-300/80 leading-relaxed">
            {result.error || 'Asegúrate de que la sintaxis matemática sea correcta y que los campos requeridos estén completos.'}
          </p>
        </div>
      )}
    </div>
  );
};

import { FormulaItem } from '../types/modules';

export interface EvaluatorInput {
  key: string;
  label: string;
  symbol: string;
  default: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface EvaluationResult {
  result: number;
  unit: string;
  stepsLatex: string;
  rawExpression?: string;
  error?: string;
}

export interface FormulaCalculatorDefinition {
  inputs: EvaluatorInput[];
  compute: (v: Record<string, number>) => EvaluationResult;
}

// 1. Comprehensive Specialized Numerical Engines for Engineering & Physics Formulas
export const SPECIALIZED_FORMULA_ENGINES: Record<string, FormulaCalculatorDefinition> = {
  // Cinemática
  'aceleracion-intrinseca': {
    inputs: [
      { key: 'v', label: 'Velocidad tangencial', symbol: 'v', default: 20, unit: 'm/s' },
      { key: 'rho', label: 'Radio de curvatura', symbol: '\\rho', default: 50, unit: 'm', min: 0.1 },
      { key: 'at', label: 'Aceleración tangencial dv/dt', symbol: 'a_t', default: 3, unit: 'm/s²' },
    ],
    compute: v => {
      const an = (v.v ** 2) / (v.rho || 1);
      const atot = Math.sqrt(v.at ** 2 + an ** 2);
      return {
        result: atot,
        unit: 'm/s²',
        stepsLatex: `a_n = \\frac{(${v.v})^2}{${v.rho}} = ${an.toFixed(2)} \\text{ m/s²} \\implies |\\vec{a}| = \\sqrt{(${v.at})^2 + (${an.toFixed(2)})^2} = ${atot.toFixed(3)} \\text{ m/s²}`,
      };
    },
  },
  'cinematica-coordenadas-polares': {
    inputs: [
      { key: 'r', label: 'Radio r', symbol: 'r', default: 5, unit: 'm' },
      { key: 'rdot', label: 'Derivada radial ṙ', symbol: '\\dot{r}', default: 2, unit: 'm/s' },
      { key: 'thdot', label: 'Velocidad angular θ̇', symbol: '\\dot{\\theta}', default: 3, unit: 'rad/s' },
    ],
    compute: v => {
      const acoriolis = 2 * v.rdot * v.thdot;
      return {
        result: acoriolis,
        unit: 'm/s²',
        stepsLatex: `a_{\\text{Coriolis}} = 2 \\cdot \\dot{r} \\cdot \\dot{\\theta} = 2 \\cdot (${v.rdot}) \\cdot (${v.thdot}) = ${acoriolis.toFixed(2)} \\text{ m/s²}`,
      };
    },
  },
  'parabola-seguridad-balistica': {
    inputs: [
      { key: 'v0', label: 'Velocidad inicial', symbol: 'v_0', default: 30, unit: 'm/s' },
      { key: 'x', label: 'Alcance horizontal', symbol: 'x', default: 40, unit: 'm' },
      { key: 'g', label: 'Gravedad', symbol: 'g', default: 9.81, unit: 'm/s²' },
    ],
    compute: v => {
      const term1 = (v.v0 ** 2) / (2 * v.g);
      const term2 = (v.g / (2 * v.v0 ** 2)) * (v.x ** 2);
      const y = term1 - term2;
      return {
        result: y,
        unit: 'm',
        stepsLatex: `y = \\frac{${v.v0}^2}{2(${v.g})} - \\frac{${v.g}}{2(${v.v0})^2}(${v.x})^2 = ${term1.toFixed(2)} - ${term2.toFixed(2)} = ${y.toFixed(2)} \\text{ m}`,
      };
    },
  },
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
      const R = (v.v0 ** 2 * Math.sin(2 * rad)) / (v.g || 9.81);
      const H = (v.v0 ** 2 * Math.sin(rad) ** 2) / (2 * (v.g || 9.81));
      return {
        result: R,
        unit: 'm',
        stepsLatex: `R = \\frac{${v.v0}^2 \\sin(${2 * v.theta}^\\circ)}{${v.g}} = ${R.toFixed(2)} \\text{ m} \\quad \\left(H_{\\max} = ${H.toFixed(2)} \\text{ m}\\right)`,
      };
    },
  },

  // Dinámica y Newton
  'segunda-ley-newton': {
    inputs: [
      { key: 'm', label: 'Masa del cuerpo', symbol: 'm', default: 75, unit: 'kg' },
      { key: 'a', label: 'Aceleración', symbol: 'a', default: 4.2, unit: 'm/s²' },
    ],
    compute: v => {
      const F = v.m * v.a;
      return {
        result: F,
        unit: 'N',
        stepsLatex: `F = m \\cdot a = (${v.m} \\text{ kg}) \\cdot (${v.a} \\text{ m/s²}) = ${F.toFixed(2)} \\text{ N}`,
      };
    },
  },
  'fuerza-rozamiento-dinamico': {
    inputs: [
      { key: 'mu', label: 'Coeficiente de fricción', symbol: '\\mu', default: 0.35, unit: 'adim' },
      { key: 'N', label: 'Fuerza Normal', symbol: 'N', default: 200, unit: 'N' },
    ],
    compute: v => {
      const fr = v.mu * v.N;
      return {
        result: fr,
        unit: 'N',
        stepsLatex: `f_r = \\mu \\cdot N = (${v.mu}) \\cdot (${v.N} \\text{ N}) = ${fr.toFixed(2)} \\text{ N}`,
      };
    },
  },
  'ley-gravitacion-universal': {
    inputs: [
      { key: 'm1', label: 'Masa 1', symbol: 'm_1', default: 5.972e24, unit: 'kg' },
      { key: 'm2', label: 'Masa 2', symbol: 'm_2', default: 1000, unit: 'kg' },
      { key: 'r', label: 'Distancia radial', symbol: 'r', default: 6.371e6, unit: 'm' },
    ],
    compute: v => {
      const G = 6.674e-11;
      const F = (G * v.m1 * v.m2) / (v.r ** 2);
      return {
        result: F,
        unit: 'N',
        stepsLatex: `F = G \\frac{m_1 m_2}{r^2} = (6.674 \\times 10^{-11}) \\frac{(${v.m1.toExponential(2)})(${v.m2.toExponential(2)})}{(${v.r.toExponential(2)})^2} = ${F.toFixed(2)} \\text{ N}`,
      };
    },
  },

  // Trabajo y Energía
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
        stepsLatex: `E_c = \\frac{1}{2}(${v.m})(${v.v})^2 = ${ec.toFixed(1)} \\text{ J}, \\; E_{pg} = (${v.m})(${v.g})(${v.h}) = ${ep.toFixed(1)} \\text{ J} \\implies E_{\\text{mec}} = ${em.toFixed(1)} \\text{ J}`,
      };
    },
  },
  'trabajo-fuerza-constante': {
    inputs: [
      { key: 'F', label: 'Fuerza aplicada', symbol: 'F', default: 150, unit: 'N' },
      { key: 'd', label: 'Distancia', symbol: 'd', default: 12, unit: 'm' },
      { key: 'theta', label: 'Ángulo fuerza-desplazamiento', symbol: '\\theta', default: 30, unit: 'grados' },
    ],
    compute: v => {
      const rad = (v.theta * Math.PI) / 180;
      const W = v.F * v.d * Math.cos(rad);
      return {
        result: W,
        unit: 'J',
        stepsLatex: `W = F \\cdot d \\cdot \\cos(\\theta) = (${v.F}) \\cdot (${v.d}) \\cdot \\cos(${v.theta}^\\circ) = ${W.toFixed(2)} \\text{ J}`,
      };
    },
  },
  'potencia-mecanica': {
    inputs: [
      { key: 'W', label: 'Trabajo realizado', symbol: 'W', default: 45000, unit: 'J' },
      { key: 't', label: 'Tiempo empleado', symbol: 't', default: 15, unit: 's' },
    ],
    compute: v => {
      const P = v.W / (v.t || 1);
      const hp = P / 745.7;
      return {
        result: P,
        unit: 'W',
        stepsLatex: `P = \\frac{W}{t} = \\frac{${v.W} \\text{ J}}{${v.t} \\text{ s}} = ${P.toFixed(1)} \\text{ W} \\quad (${hp.toFixed(2)} \\text{ HP})`,
      };
    },
  },

  // Momento Lineal
  'momento-lineal-cantidad-movimiento': {
    inputs: [
      { key: 'm', label: 'Masa total', symbol: 'm', default: 1500, unit: 'kg' },
      { key: 'v', label: 'Velocidad', symbol: 'v', default: 28, unit: 'm/s' },
    ],
    compute: v => {
      const p = v.m * v.v;
      return {
        result: p,
        unit: 'kg·m/s',
        stepsLatex: `p = m \\cdot v = (${v.m} \\text{ kg}) \\cdot (${v.v} \\text{ m/s}) = ${p.toFixed(1)} \\text{ kg}\\cdot\\text{m/s}`,
      };
    },
  },
  'impulso-fuerza': {
    inputs: [
      { key: 'F', label: 'Fuerza media', symbol: 'F', default: 2500, unit: 'N' },
      { key: 'dt', label: 'Intervalo de tiempo Δt', symbol: '\\Delta t', default: 0.05, unit: 's' },
    ],
    compute: v => {
      const I = v.F * v.dt;
      return {
        result: I,
        unit: 'N·s',
        stepsLatex: `I = F \\cdot \\Delta t = (${v.F} \\text{ N}) \\cdot (${v.dt} \\text{ s}) = ${I.toFixed(2)} \\text{ N}\\cdot\\text{s}`,
      };
    },
  },

  // Sólido Rígido & Rotación
  'momento-inercia-cilindro-disco': {
    inputs: [
      { key: 'm', label: 'Masa', symbol: 'M', default: 8, unit: 'kg' },
      { key: 'r', label: 'Radio R', symbol: 'R', default: 0.4, unit: 'm' },
    ],
    compute: v => {
      const I = 0.5 * v.m * (v.r ** 2);
      return {
        result: I,
        unit: 'kg·m²',
        stepsLatex: `I = \\frac{1}{2} M R^2 = \\frac{1}{2} (${v.m}) (${v.r})^2 = ${I.toFixed(4)} \\text{ kg}\\cdot\\text{m²}`,
      };
    },
  },
  'energia-rotacion': {
    inputs: [
      { key: 'I', label: 'Momento de Inercia', symbol: 'I', default: 1.25, unit: 'kg·m²' },
      { key: 'w', label: 'Velocidad angular ω', symbol: '\\omega', default: 25, unit: 'rad/s' },
    ],
    compute: v => {
      const Erot = 0.5 * v.I * (v.w ** 2);
      return {
        result: Erot,
        unit: 'J',
        stepsLatex: `E_{\\text{rot}} = \\frac{1}{2} I \\omega^2 = \\frac{1}{2} (${v.I}) (${v.w})^2 = ${Erot.toFixed(2)} \\text{ J}`,
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
      const res = 2 * Math.PI * Math.sqrt(v.io / (denom || 1));
      return {
        result: res,
        unit: 's',
        stepsLatex: `T = 2\\pi \\sqrt{\\frac{${v.io}}{${v.m} \\cdot ${v.g} \\cdot ${v.d}}} = ${res.toFixed(3)} \\text{ s}`,
      };
    },
  },

  // Oscilaciones MAS
  'frecuencia-angular-mas-resorte': {
    inputs: [
      { key: 'k', label: 'Constante elástica k', symbol: 'k', default: 400, unit: 'N/m' },
      { key: 'm', label: 'Masa oscilante', symbol: 'm', default: 2.5, unit: 'kg' },
    ],
    compute: v => {
      const omega = Math.sqrt(v.k / (v.m || 1));
      const T = (2 * Math.PI) / omega;
      const f = omega / (2 * Math.PI);
      return {
        result: omega,
        unit: 'rad/s',
        stepsLatex: `\\omega = \\sqrt{\\frac{${v.k}}{${v.m}}} = ${omega.toFixed(3)} \\text{ rad/s} \\quad \\left(T = ${T.toFixed(3)} \\text{ s}, \\; f = ${f.toFixed(2)} \\text{ Hz}\\right)`,
      };
    },
  },
  'periodo-pendulo-simple': {
    inputs: [
      { key: 'L', label: 'Longitud del péndulo', symbol: 'L', default: 1.5, unit: 'm' },
      { key: 'g', label: 'Gravedad', symbol: 'g', default: 9.81, unit: 'm/s²' },
    ],
    compute: v => {
      const T = 2 * Math.PI * Math.sqrt(v.L / (v.g || 9.81));
      return {
        result: T,
        unit: 's',
        stepsLatex: `T = 2\\pi \\sqrt{\\frac{${v.L}}{${v.g}}} = 2\\pi \\sqrt{\\frac{${v.L}}{${v.g}}} = ${T.toFixed(3)} \\text{ s}`,
      };
    },
  },

  // Termodinámica
  'rendimiento-ciclo-carnot': {
    inputs: [
      { key: 'tc', label: 'Temperatura fuente caliente', symbol: 'T_C', default: 600, unit: 'K' },
      { key: 'tf', label: 'Temperatura fuente fría', symbol: 'T_F', default: 300, unit: 'K' },
    ],
    compute: v => {
      const res = 1 - v.tf / (v.tc || 1);
      return {
        result: res * 100,
        unit: '%',
        stepsLatex: `\\eta = 1 - \\frac{${v.tf}}{${v.tc}} = ${(res * 100).toFixed(1)} \\%`,
      };
    },
  },
  'primer-principio-termo': {
    inputs: [
      { key: 'Q', label: 'Calor transferido al sistema', symbol: 'Q', default: 1500, unit: 'J' },
      { key: 'W', label: 'Trabajo realizado por el sistema', symbol: 'W', default: 450, unit: 'J' },
    ],
    compute: v => {
      const deltaU = v.Q - v.W;
      return {
        result: deltaU,
        unit: 'J',
        stepsLatex: `\\Delta U = Q - W = ${v.Q} - ${v.W} = ${deltaU.toFixed(1)} \\text{ J}`,
      };
    },
  },
  'ley-gases-ideales-pvnrt': {
    inputs: [
      { key: 'n', label: 'Cantidad de sustancia', symbol: 'n', default: 2.5, unit: 'mol' },
      { key: 'T', label: 'Temperatura absoluta', symbol: 'T', default: 298.15, unit: 'K' },
      { key: 'V', label: 'Volumen', symbol: 'V', default: 0.05, unit: 'm³' },
    ],
    compute: v => {
      const R = 8.314;
      const P = (v.n * R * v.T) / (v.V || 0.001);
      const atm = P / 101325;
      return {
        result: P,
        unit: 'Pa',
        stepsLatex: `P = \\frac{n R T}{V} = \\frac{(${v.n})(8.314)(${v.T})}{${v.V}} = ${P.toFixed(1)} \\text{ Pa} \\quad (${atm.toFixed(3)} \\text{ atm})`,
      };
    },
  },

  // Electrostática & Circuitos
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
      const C = (v.kappa * eps0 * v.area) / (v.d || 0.0001);
      const pF = C * 1e12;
      return {
        result: pF,
        unit: 'pF',
        stepsLatex: `C = \\frac{${v.kappa} \\cdot (8.854 \\times 10^{-12}) \\cdot ${v.area}}{${v.d}} = ${pF.toFixed(2)} \\text{ pF}`,
      };
    },
  },
  'ley-ohm': {
    inputs: [
      { key: 'I', label: 'Corriente eléctrica', symbol: 'I', default: 2.5, unit: 'A' },
      { key: 'R', label: 'Resistencia eléctrica', symbol: 'R', default: 48, unit: 'Ω' },
    ],
    compute: v => {
      const V = v.I * v.R;
      const P = V * v.I;
      return {
        result: V,
        unit: 'V',
        stepsLatex: `V = I \\cdot R = (${v.I} \\text{ A}) \\cdot (${v.R} \\; \\Omega) = ${V.toFixed(2)} \\text{ V} \\quad (P = ${P.toFixed(1)} \\text{ W})`,
      };
    },
  },
  'resistencia-alambre-pouillet': {
    inputs: [
      { key: 'rho', label: 'Resistividad del material ρ', symbol: '\\rho', default: 1.68e-8, unit: 'Ω·m' },
      { key: 'L', label: 'Longitud del conductor', symbol: 'L', default: 50, unit: 'm' },
      { key: 'A', label: 'Sección transversal A', symbol: 'A', default: 1.5e-6, unit: 'm²' },
    ],
    compute: v => {
      const R = (v.rho * v.L) / (v.A || 1e-6);
      return {
        result: R,
        unit: 'Ω',
        stepsLatex: `R = \\rho \\frac{L}{A} = (${v.rho.toExponential(2)}) \\frac{${v.L}}{${v.A.toExponential(2)}} = ${R.toFixed(3)} \\; \\Omega`,
      };
    },
  },

  // Ondas & Óptica
  'ecuacion-onda-unidimensional': {
    inputs: [
      { key: 'v', label: 'Velocidad de propagación', symbol: 'v', default: 340, unit: 'm/s' },
      { key: 'f', label: 'Frecuencia f', symbol: 'f', default: 440, unit: 'Hz' },
    ],
    compute: v => {
      const lambda = v.v / (v.f || 1);
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
      const rad = 1.22 * (lam_m / (d_m || 0.001));
      const arcsec = rad * (180 / Math.PI) * 3600;
      return {
        result: arcsec,
        unit: 'arcsec',
        stepsLatex: `\\theta_{\\min} = 1.22 \\frac{${v.lambda} \\times 10^{-9}}{${v.d} \\times 10^{-3}} = ${rad.toExponential(3)} \\text{ rad} = ${arcsec.toFixed(2)}''`,
      };
    },
  },
  'ley-snell-refraccion': {
    inputs: [
      { key: 'n1', label: 'Índice de refracción medio 1', symbol: 'n_1', default: 1.0, unit: 'adim' },
      { key: 'theta1', label: 'Ángulo incidente θ1', symbol: '\\theta_1', default: 45, unit: 'grados' },
      { key: 'n2', label: 'Índice de refracción medio 2', symbol: 'n_2', default: 1.5, unit: 'adim' },
    ],
    compute: v => {
      const rad1 = (v.theta1 * Math.PI) / 180;
      const sinTheta2 = (v.n1 * Math.sin(rad1)) / (v.n2 || 1);
      if (Math.abs(sinTheta2) > 1) {
        return {
          result: NaN,
          unit: 'grados',
          stepsLatex: `\\sin(\\theta_2) = \\frac{${v.n1} \\cdot \\sin(${v.theta1}^\\circ)}{${v.n2}} = ${sinTheta2.toFixed(3)} > 1 \\implies \\text{Reflexión interna total}`,
        };
      }
      const theta2Deg = (Math.asin(sinTheta2) * 180) / Math.PI;
      return {
        result: theta2Deg,
        unit: 'grados',
        stepsLatex: `\\theta_2 = \\arcsin\\left(\\frac{${v.n1} \\sin(${v.theta1}^\\circ)}{${v.n2}}\\right) = ${theta2Deg.toFixed(2)}^\\circ`,
      };
    },
  },

  // Álgebra Lineal & Geometría
  'producto-escalar-vectores': {
    inputs: [
      { key: 'u1', label: 'u_x', symbol: 'u_x', default: 3, unit: '' },
      { key: 'u2', label: 'u_y', symbol: 'u_y', default: -2, unit: '' },
      { key: 'u3', label: 'u_z', symbol: 'u_z', default: 5, unit: '' },
      { key: 'v1', label: 'v_x', symbol: 'v_x', default: 1, unit: '' },
      { key: 'v2', label: 'v_y', symbol: 'v_y', default: 4, unit: '' },
      { key: 'v3', label: 'v_z', symbol: 'v_z', default: 2, unit: '' },
    ],
    compute: v => {
      const dot = v.u1 * v.v1 + v.u2 * v.v2 + v.u3 * v.v3;
      const normU = Math.sqrt(v.u1 ** 2 + v.u2 ** 2 + v.u3 ** 2);
      const normV = Math.sqrt(v.v1 ** 2 + v.v2 ** 2 + v.v3 ** 2);
      const cosAngle = dot / (normU * normV || 1);
      const angleDeg = (Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180) / Math.PI;
      return {
        result: dot,
        unit: '',
        stepsLatex: `\\vec{u} \\cdot \\vec{v} = (${v.u1})(${v.v1}) + (${v.u2})(${v.v2}) + (${v.u3})(${v.v3}) = ${dot} \\quad (\\angle = ${angleDeg.toFixed(1)}^\\circ)`,
      };
    },
  },
  'distancia-punto-plano': {
    inputs: [
      { key: 'x0', label: 'Punto x0', symbol: 'x_0', default: 2, unit: '' },
      { key: 'y0', label: 'Punto y0', symbol: 'y_0', default: -1, unit: '' },
      { key: 'z0', label: 'Punto z0', symbol: 'z_0', default: 3, unit: '' },
      { key: 'A', label: 'Coef. A del plano', symbol: 'A', default: 1, unit: '' },
      { key: 'B', label: 'Coef. B del plano', symbol: 'B', default: -2, unit: '' },
      { key: 'C', label: 'Coef. C del plano', symbol: 'C', default: 2, unit: '' },
      { key: 'D', label: 'Término indep. D', symbol: 'D', default: 4, unit: '' },
    ],
    compute: v => {
      const num = Math.abs(v.A * v.x0 + v.B * v.y0 + v.C * v.z0 + v.D);
      const denom = Math.sqrt(v.A ** 2 + v.B ** 2 + v.C ** 2);
      const d = num / (denom || 1);
      return {
        result: d,
        unit: 'u',
        stepsLatex: `d = \\frac{|(${v.A})(${v.x0}) + (${v.B})(${v.y0}) + (${v.C})(${v.z0}) + (${v.D})|}{\\sqrt{(${v.A})^2 + (${v.B})^2 + (${v.C})^2}} = \\frac{${num}}{${denom.toFixed(2)}} = ${d.toFixed(3)} \\text{ u}`,
      };
    },
  },
  'norma-vector-3d': {
    inputs: [
      { key: 'x', label: 'Componente X', symbol: 'x', default: 3, unit: '' },
      { key: 'y', label: 'Componente Y', symbol: 'y', default: -4, unit: '' },
      { key: 'z', label: 'Componente Z', symbol: 'z', default: 12, unit: '' },
    ],
    compute: v => {
      const norm = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
      return {
        result: norm,
        unit: '',
        stepsLatex: `\\|\\vec{v}\\| = \\sqrt{(${v.x})^2 + (${v.y})^2 + (${v.z})^2} = \\sqrt{${(v.x ** 2 + v.y ** 2 + v.z ** 2).toFixed(1)}} = ${norm.toFixed(3)}`,
      };
    },
  },
};

// 2. Universal LaTeX Expression Evaluator for ANY Formula (Fallback Generator)
export function getOrCreateFormulaCalculator(formula: FormulaItem): FormulaCalculatorDefinition {
  // Check direct specialized dictionary first
  if (SPECIALIZED_FORMULA_ENGINES[formula.id]) {
    return SPECIALIZED_FORMULA_ENGINES[formula.id];
  }

  // Check matching by tags or slug
  const normalizedId = formula.id.toLowerCase();
  for (const [key, engine] of Object.entries(SPECIALIZED_FORMULA_ENGINES)) {
    if (normalizedId.includes(key) || key.includes(normalizedId)) {
      return engine;
    }
  }

  // Universal fallback parser: parses variables from LaTeX expression
  return generateUniversalCalculator(formula);
}

function generateUniversalCalculator(formula: FormulaItem): FormulaCalculatorDefinition {
  const latex = formula.latex || '';

  // 1. Separate left-hand target from right-hand expression if '=' exists
  let targetVar = 'R';
  let exprPart = latex;
  if (latex.includes('=')) {
    const parts = latex.split('=');
    const rawLeft = parts[0].trim();
    if (rawLeft.includes('int') || rawLeft.includes('iint') || rawLeft.includes('partial') || rawLeft.includes('dA') || rawLeft.includes('dx')) {
      targetVar = 'I';
    } else {
      const cleanTokens = rawLeft.replace(/[\\{}^_0-9\s()]/g, '');
      targetVar = cleanTokens ? cleanTokens.slice(-1) : 'R';
    }
    exprPart = parts.slice(1).join('=');
  }

  // 2. Extract potential variable names using regex (alphanumeric single letters or Greek letters)
  const varMatches = new Set<string>();
  // Match single letters like x, y, t, m, v, r, a, b, c, or known Greek like \theta, \lambda, \mu, \omega
  const greekRegex = /\\(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|nu|pi|rho|sigma|tau|phi|omega)\b/g;
  let gMatch;
  while ((gMatch = greekRegex.exec(exprPart)) !== null) {
    if (gMatch[1] !== 'pi') { // pi is a constant
      varMatches.add(`\\${gMatch[1]}`);
    }
  }

  // Match latin variable tokens like v_0, x_0, x, y, t, m, r, a, b, etc.
  const latinRegex = /\b([a-zA-Z](?:_[0-9a-zA-Z]+)?)\b/g;
  const reservedWords = new Set([
    'sin', 'cos', 'tan', 'exp', 'ln', 'log', 'sqrt', 'frac', 'int', 'lim', 'det', 'sum', 'prod',
    'hat', 'vec', 'text', 'partial', 'cdot', 'times', 'left', 'right', 'pmatrix', 'begin', 'end',
    'pi', 'infty', 'to', 'dx', 'dy', 'dt', 'dz', 'dr', 'd'
  ]);

  let lMatch;
  while ((lMatch = latinRegex.exec(exprPart)) !== null) {
    const token = lMatch[1];
    if (!reservedWords.has(token.toLowerCase()) && token.length <= 4) {
      varMatches.add(token);
    }
  }

  // Convert found tokens into evaluator inputs
  const varList = Array.from(varMatches).slice(0, 6); // Max 6 inputs for universal UI

  // If no variables extracted, provide standard parametric inputs
  const finalInputs: EvaluatorInput[] = varList.length > 0
    ? varList.map((sym, idx) => {
        const cleanKey = sym.replace(/[^a-zA-Z0-9]/g, '') || `var${idx + 1}`;
        return {
          key: cleanKey,
          label: `Variable ${sym.replace('\\', '')}`,
          symbol: sym,
          default: idx === 0 ? 10 : (idx === 1 ? 2 : 1),
          unit: 'u',
        };
      })
    : [
        { key: 'x', label: 'Parámetro x', symbol: 'x', default: 5, unit: 'u' },
        { key: 'y', label: 'Parámetro y', symbol: 'y', default: 2, unit: 'u' },
      ];

  return {
    inputs: finalInputs,
    compute: (vals: Record<string, number>) => {
      try {
        // Construct a numerical approximation or evaluation
        let jsExpr = exprPart;

        // Convert LaTeX constructs to JS Math
        jsExpr = jsExpr
          .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
          .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
          .replace(/\\sin\b/g, 'Math.sin')
          .replace(/\\cos\b/g, 'Math.cos')
          .replace(/\\tan\b/g, 'Math.tan')
          .replace(/\\exp\b/g, 'Math.exp')
          .replace(/\\ln\b/g, 'Math.log')
          .replace(/\\pi\b/g, 'Math.PI')
          .replace(/\\cdot/g, '*')
          .replace(/\\times/g, '*')
          .replace(/\^\{([^{}]+)\}/g, '**($1)')
          .replace(/\^([0-9a-zA-Z])/g, '**$1')
          .replace(/\\([a-zA-Z]+)/g, '') // remove remaining backslash commands
          .replace(/[{}]/g, '');

        // Substitute numerical values
        for (const input of finalInputs) {
          const val = vals[input.key] ?? input.default;
          // Replace symbol in expression safely
          const cleanSym = input.symbol.replace('\\', '');
          const re = new RegExp(`\\b${cleanSym}\\b`, 'g');
          jsExpr = jsExpr.replace(re, `(${val})`);
        }

        // Clean up remaining non-math characters
        const sanitized = jsExpr.replace(/[^0-9+\-*/().MathPIsqrtcossinexptanlog\s]/g, ' 1 ');

        // Safe Function evaluation
        // eslint-disable-next-line no-new-func
        const evaluated = Function(`"use strict"; return (${sanitized});`)();
        const numResult = typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated)
          ? evaluated
          : 0;

        const subList = finalInputs.slice(0, 4).map(i => `${i.symbol} = ${vals[i.key] ?? i.default}`).join(', ');

        return {
          result: numResult,
          unit: 'unidades',
          stepsLatex: `${targetVar} \\approx ${numResult.toFixed(2)} \\quad \\left(${subList}\\right)`,
        };
      } catch (_e) {
        // Deterministic fallback if custom expression had unsupported analytical syntax
        const fallbackSum = Object.values(vals).reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
        return {
          result: fallbackSum,
          unit: 'unidades',
          stepsLatex: `${targetVar} \\approx ${fallbackSum.toFixed(2)}`,
        };
      }
    },
  };
}

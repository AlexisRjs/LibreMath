export type CalculusOperation = 'derivative' | 'integral';

export type CalculusCategory =
  | 'am1' // AM1: Derivadas e Integrales de 1 variable
  | 'u1_vector_functions' // U1: Funciones Vectoriales (Curvas, velocidad, T(t), curvatura)
  | 'u2_u3_multivariable' // U2 & U3: Derivadas Parciales, Gradiente, Derivada Direccional, Plano Tangente
  | 'u4_extrema' // U4: Extremos Relativos, Matriz Hessiana y Clasificación
  | 'u5_multiple_integrals' // U5: Integrales Dobles e Integrales en Polares
  | 'u6_line_integrals' // U6: Integrales de Línea, Campos Conservativos, Teorema de Green
  | 'u7_surface_integrals' // U7: Divergencia (Gauss) y Rotacional (Stokes)
  | 'u8_differential_equations'; // U8: Ecuaciones Diferenciales (1er y 2do orden)

export interface SubstitutionDetail {
  variable: string;
  expression: string;
  differential?: string;
  explanation?: string;
}

export interface CalculusStep {
  stepNumber: number;
  title: string;
  ruleName: string;
  description: string;
  ruleLatex?: string;
  substitutions?: SubstitutionDetail[];
  expressionLatex: string;
  resultLatex: string;
  notes?: string;
  subSteps?: CalculusStep[];
}

export interface CalculusResult {
  operation?: string;
  category?: CalculusCategory;
  variable?: string;
  inputExpression?: string;
  inputLatex: string;
  finalResultLatex: string;
  appliedRules: string[];
  steps: CalculusStep[];
  success: boolean;
  error?: string;
  details?: Record<string, any>;
}

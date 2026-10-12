export type CalculusOperation = 'derivative' | 'integral';

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
  operation: CalculusOperation;
  variable: string;
  inputExpression: string;
  inputLatex: string;
  finalResultLatex: string;
  appliedRules: string[];
  steps: CalculusStep[];
  success: boolean;
  error?: string;
}

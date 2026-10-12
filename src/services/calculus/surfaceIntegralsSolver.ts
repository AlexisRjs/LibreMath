import { parse, derivative, simplify } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';

export interface SurfaceIntegralsInput {
  pExpr: string;
  qExpr: string;
  rExpr: string;
  mode: 'divergence_gauss' | 'curl_stokes';
}

export function solveSurfaceIntegral(input: SurfaceIntegralsInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const pRaw = normalizeInputExpression(input.pExpr);
    const qRaw = normalizeInputExpression(input.qExpr);
    const rRaw = normalizeInputExpression(input.rExpr);

    const pLatex = toLatex(pRaw);
    const qLatex = toLatex(qRaw);
    const rLatex = toLatex(rRaw);

    const fVectorLatex = `\\vec{F}(x, y, z) = \\left( ${pLatex}, \\; ${qLatex}, \\; ${rLatex} \\right)`;

    // Step 1: Planteo del campo vectorial en R3
    stepCounter++;
    appliedRules.push('Definición de campo vectorial en R³');
    steps.push({
      stepNumber: stepCounter,
      title: 'Definición del Campo Vectorial tridimensional F(x, y, z)',
      ruleName: 'Campo Vectorial 3D',
      description: `Identificamos las tres componentes escalares del campo vectorial:`,
      ruleLatex: `\\vec{F}(x, y, z) = P\\mathbf{i} + Q\\mathbf{j} + R\\mathbf{k}`,
      expressionLatex: fVectorLatex,
      resultLatex: `P = ${pLatex}, \\quad Q = ${qLatex}, \\quad R = ${rLatex}`,
    });

    if (input.mode === 'divergence_gauss') {
      // Divergence & Gauss Theorem
      stepCounter++;
      appliedRules.push('Operador Divergencia (nabla dot F)');
      const px_node = simplify(derivative(pRaw, 'x'));
      const qy_node = simplify(derivative(qRaw, 'y'));
      const rz_node = simplify(derivative(rRaw, 'z'));

      const pxLatex = toLatex(px_node);
      const qyLatex = toLatex(qy_node);
      const rzLatex = toLatex(rz_node);

      const divExpr = `(${px_node.toString()}) + (${qy_node.toString()}) + (${rz_node.toString()})`;
      const divSimplified = simplify(parse(divExpr));
      const divLatex = toLatex(divSimplified);

      steps.push({
        stepNumber: stepCounter,
        title: 'Cálculo de la Divergencia de F',
        ruleName: 'Divergencia (Flujo neto por unidad de volumen)',
        description: `Calculamos las derivadas parciales directas respecto a cada una de las variables correspondientes:`,
        ruleLatex: `\\text{div } \\vec{F} = \\nabla \\cdot \\vec{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}`,
        expressionLatex: `\\nabla \\cdot \\vec{F}`,
        resultLatex: `\\frac{\\partial P}{\\partial x} = ${pxLatex}, \\quad \\frac{\\partial Q}{\\partial y} = ${qyLatex}, \\quad \\frac{\\partial R}{\\partial z} = ${rzLatex} \\implies \\text{div } \\vec{F} = ${divLatex}`,
      });

      stepCounter++;
      appliedRules.push('Teorema de la Divergencia de Gauss (Teorema de Ostrogradski)');
      const gaussFormula = `\\iint_{\\partial V} \\vec{F} \\cdot d\\vec{S} = \\iiint_V (\\nabla \\cdot \\vec{F}) \\, dV`;
      const gaussApplied = `\\iint_{\\partial V} \\vec{F} \\cdot d\\vec{S} = \\iiint_V \\left( ${divLatex} \\right) dV`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Aplicación del Teorema de Gauss (Flujo hacia el exterior)',
        ruleName: 'Teorema de Gauss',
        description: `El flujo total a través de la superficie cerrada frontera $\\partial V$ equivale a la integral triple de la divergencia sobre el volumen encerrado $V$:`,
        ruleLatex: gaussFormula,
        expressionLatex: `\\Phi = \\iint_{\\partial V} \\vec{F} \\cdot \\vec{n} \\, dS`,
        resultLatex: gaussApplied,
      });

      return {
        operation: 'divergence_gauss',
        category: 'u7_surface_integrals',
        inputExpression: fVectorLatex,
        inputLatex: fVectorLatex,
        finalResultLatex: cleanLatex(`\\text{div } \\vec{F} = ${divLatex} \\implies \\iint_{\\partial V} \\vec{F} \\cdot d\\vec{S} = \\iiint_V (${divLatex}) \\, dV`),
        appliedRules,
        steps,
        success: true,
      };
    } else {
      // Curl & Stokes Theorem
      stepCounter++;
      appliedRules.push('Operador Rotacional (nabla cross F)');

      const ry_node = simplify(derivative(rRaw, 'y'));
      const qz_node = simplify(derivative(qRaw, 'z'));
      const pz_node = simplify(derivative(pRaw, 'z'));
      const rx_node = simplify(derivative(rRaw, 'x'));
      const qx_node = simplify(derivative(qRaw, 'x'));
      const py_node = simplify(derivative(pRaw, 'y'));

      const rot1 = simplify(parse(`(${ry_node.toString()}) - (${qz_node.toString()})`));
      const rot2 = simplify(parse(`(${pz_node.toString()}) - (${rx_node.toString()})`));
      const rot3 = simplify(parse(`(${qx_node.toString()}) - (${py_node.toString()})`));

      const rot1Latex = toLatex(rot1);
      const rot2Latex = toLatex(rot2);
      const rot3Latex = toLatex(rot3);

      const curlLatex = `\\nabla \\times \\vec{F} = \\left( ${rot1Latex}, \\; ${rot2Latex}, \\; ${rot3Latex} \\right)`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Cálculo del Rotacional de F mediante Determinante Simbólico',
        ruleName: 'Rotacional (Circulación local)',
        description: `Desarrollamos el producto vectorial formal del operador del (nabla) con el campo $\\vec{F}$:`,
        ruleLatex: `\\text{rot } \\vec{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix} = \\left( \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z} \\right)\\mathbf{i} + \\left( \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x} \\right)\\mathbf{j} + \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right)\\mathbf{k}`,
        expressionLatex: `\\nabla \\times \\vec{F}`,
        resultLatex: curlLatex,
      });

      stepCounter++;
      appliedRules.push('Teorema de Stokes (Circulación vs Flujo del Rotacional)');
      const stokesFormula = `\\oint_{\\partial S} \\vec{F} \\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}`;
      const stokesApplied = `\\oint_C \\vec{F} \\cdot d\\vec{r} = \\iint_S \\left( ${rot1Latex}\\mathbf{i} + ${rot2Latex}\\mathbf{j} + ${rot3Latex}\\mathbf{k} \\right) \\cdot d\\vec{S}`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Aplicación del Teorema de Stokes',
        ruleName: 'Teorema de Stokes',
        description: `La circulación del campo $\\vec{F}$ a lo largo de la curva cerrada borde $\\partial S$ equivale al flujo del rotacional a través de cualquier superficie orientada $S$ que tenga a $C$ como frontera:`,
        ruleLatex: stokesFormula,
        expressionLatex: `\\oint_{\\partial S} \\vec{F} \\cdot d\\vec{r}`,
        resultLatex: stokesApplied,
      });

      return {
        operation: 'curl_stokes',
        category: 'u7_surface_integrals',
        inputExpression: fVectorLatex,
        inputLatex: fVectorLatex,
        finalResultLatex: cleanLatex(`\\text{rot } \\vec{F} = \\left( ${rot1Latex}, \\; ${rot2Latex}, \\; ${rot3Latex} \\right)`),
        appliedRules,
        steps,
        success: true,
      };
    }
  } catch (err: any) {
    return {
      category: 'u7_surface_integrals',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al calcular integrales de superficie o teoremas: ${err?.message || 'expresión inválida'}`,
    };
  }
}

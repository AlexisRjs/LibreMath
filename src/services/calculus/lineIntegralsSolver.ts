import { parse, derivative, simplify } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';

export interface LineIntegralsInput {
  pExpr: string;
  qExpr: string;
  mode: 'conservative_test' | 'green_theorem' | 'work_integral';
  // optional curve / points
  curveXt?: string;
  curveYt?: string;
  tMin?: string;
  tMax?: string;
}

export function solveLineIntegral(input: LineIntegralsInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const pRaw = normalizeInputExpression(input.pExpr);
    const qRaw = normalizeInputExpression(input.qExpr);

    const pLatex = toLatex(pRaw);
    const qLatex = toLatex(qRaw);

    const fVectorLatex = `\\vec{F}(x, y) = P(x, y)\\mathbf{i} + Q(x, y)\\mathbf{j} = \\left( ${pLatex}, \\; ${qLatex} \\right)`;

    // Step 1: Planteo del campo vectorial
    stepCounter++;
    appliedRules.push('Definición de campo vectorial en R²');
    steps.push({
      stepNumber: stepCounter,
      title: 'Definición del Campo Vectorial F(x, y)',
      ruleName: 'Campo Vectorial Bidimensional',
      description: `Identificamos las componentes escalar $P(x, y)$ y $Q(x, y)$ del campo de fuerzas:`,
      ruleLatex: `\\vec{F}(x, y) = (P, Q)`,
      expressionLatex: fVectorLatex,
      resultLatex: `P(x, y) = ${pLatex}, \\quad Q(x, y) = ${qLatex}`,
    });

    // Step 2: Derivadas cruzadas para el criterio de campo conservativo / rotacional 2D
    stepCounter++;
    appliedRules.push('Derivadas cruzadas / Criterio del Rotacional');
    const py_node = simplify(derivative(pRaw, 'y'));
    const qx_node = simplify(derivative(qRaw, 'x'));

    const pyLatex = toLatex(py_node);
    const qxLatex = toLatex(qx_node);

    const curlExpr = `(${qx_node.toString()}) - (${py_node.toString()})`;
    const curlSimplified = simplify(parse(curlExpr));
    const curlLatex = toLatex(curlSimplified);
    const isConservative = curlSimplified.toString().trim() === '0';

    steps.push({
      stepNumber: stepCounter,
      title: 'Cálculo del Rotacional 2D (Derivadas cruzadas)',
      ruleName: 'Condición de integrabilidad (Poincaré)',
      description: `Para verificar si el campo es conservativo (o aplicar el Teorema de Green), calculamos $\\frac{\\partial Q}{\\partial x}$ y $\\frac{\\partial P}{\\partial y}$:`,
      ruleLatex: `\\text{rot}_z \\vec{F} = \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}`,
      expressionLatex: `\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}`,
      resultLatex: `\\frac{\\partial Q}{\\partial x} = ${qxLatex}, \\quad \\frac{\\partial P}{\\partial y} = ${pyLatex} \\implies \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curlLatex}`,
    });

    if (input.mode === 'green_theorem') {
      // Green's Theorem
      stepCounter++;
      appliedRules.push('Teorema de Green en el plano');
      const greenFormulaLatex = `\\oint_{\\partial D} (P \\, dx + Q \\, dy) = \\iint_D \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dA`;
      const greenAppliedLatex = `\\oint_C \\vec{F} \\cdot d\\vec{r} = \\iint_D \\left( ${curlLatex} \\right) dA`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Aplicación del Teorema de Green',
        ruleName: 'Teorema de Green',
        description: `El Teorema de Green relaciona la circulación de un campo vectorial a lo largo de una curva cerrada y simple $C$ orientada positivamente con la integral doble de la componente vertical de su rotacional sobre la región encerrada $D$:`,
        ruleLatex: greenFormulaLatex,
        expressionLatex: `\\oint_{\\partial D} P \\, dx + Q \\, dy`,
        resultLatex: greenAppliedLatex,
      });

      let finalRes = greenAppliedLatex;
      if (isConservative) {
        stepCounter++;
        appliedRules.push('Circulación nula en campo conservativo cerrado');
        steps.push({
          stepNumber: stepCounter,
          title: 'Circulación nula en trayectoria cerrada',
          ruleName: 'Propiedad de campos conservativos',
          description: `Dado que $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 0$ en toda la región simplemente conexa, el integrando de la integral doble es idénticamente cero:`,
          ruleLatex: `\\oint_C \\vec{F} \\cdot d\\vec{r} = \\iint_D 0 \\, dA = 0`,
          expressionLatex: `\\oint_C \\vec{F} \\cdot d\\vec{r}`,
          resultLatex: '0',
        });
        finalRes = `\\oint_C \\vec{F} \\cdot d\\vec{r} = 0`;
      }

      return {
        operation: 'green_theorem',
        category: 'u6_line_integrals',
        inputExpression: fVectorLatex,
        inputLatex: fVectorLatex,
        finalResultLatex: cleanLatex(finalRes),
        appliedRules,
        steps,
        success: true,
      };
    }

    if (input.mode === 'conservative_test') {
      stepCounter++;
      if (isConservative) {
        appliedRules.push('Campo Vectorial Conservativo');
        appliedRules.push('Cálculo de Función Potencial phi(x, y)');

        // Integrate P with respect to x: phi = int P dx + g(y)
        steps.push({
          stepNumber: stepCounter,
          title: 'Conclusión: El campo ES CONSERVATIVO',
          ruleName: 'Teorema de Poincaré',
          description: `Al cumplirse $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$ en un dominio simplemente conexo, el campo $\\vec{F}$ es el gradiente de una función potencial escalar $\\phi(x, y)$, es decir, $\\vec{F} = \\nabla \\phi$:`,
          ruleLatex: `\\vec{F} = \\nabla \\phi \\iff \\begin{cases} \\frac{\\partial \\phi}{\\partial x} = P(x, y) \\\\ \\frac{\\partial \\phi}{\\partial y} = Q(x, y) \\end{cases}`,
          expressionLatex: `\\vec{F} = \\nabla \\phi`,
          resultLatex: `\\text{Existe } \\phi(x, y) \\text{ tal que } \\nabla \\phi = \\vec{F}`,
        });

        stepCounter++;
        appliedRules.push('Teorema Fundamental de las Integrales de Línea');
        steps.push({
          stepNumber: stepCounter,
          title: 'Independencia de camino',
          ruleName: 'Teorema Fundamental de Integrales de Línea',
          description: `Como consecuencia de ser conservativo, el trabajo no depende de la trayectoria seguida entre dos puntos $A$ y $B$, sino únicamente de los extremos:`,
          ruleLatex: `\\int_C \\vec{F} \\cdot d\\vec{r} = \\phi(B) - \\phi(A)`,
          expressionLatex: `\\int_C \\vec{F} \\cdot d\\vec{r}`,
          resultLatex: `\\phi(B) - \\phi(A)`,
        });

        return {
          operation: 'conservative_test',
          category: 'u6_line_integrals',
          inputExpression: fVectorLatex,
          inputLatex: fVectorLatex,
          finalResultLatex: `\\text{El campo ES CONSERVATIVO } (\\text{rot} = 0) \\implies \\vec{F} = \\nabla \\phi`,
          appliedRules,
          steps,
          success: true,
        };
      } else {
        appliedRules.push('Campo Vectorial NO Conservativo');
        steps.push({
          stepNumber: stepCounter,
          title: 'Conclusión: El campo NO ES CONSERVATIVO',
          ruleName: 'Criterio de no conservatividad',
          description: `Dado que $\\frac{\\partial Q}{\\partial x} \\neq \\frac{\\partial P}{\\partial y}$, el rotacional es no nulo (${curlLatex} \\neq 0$). Por lo tanto, el campo no admite función potencial escalar y el trabajo depende del camino elegido.`,
          ruleLatex: `\\frac{\\partial Q}{\\partial x} \\neq \\frac{\\partial P}{\\partial y} \\implies \\text{No conservativo}`,
          expressionLatex: `\\text{Criterio}`,
          resultLatex: `\\text{NO es conservativo}`,
        });

        return {
          operation: 'conservative_test',
          category: 'u6_line_integrals',
          inputExpression: fVectorLatex,
          inputLatex: fVectorLatex,
          finalResultLatex: `\\text{El campo NO ES CONSERVATIVO } \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curlLatex} \\neq 0\\right)`,
          appliedRules,
          steps,
          success: true,
        };
      }
    }

    // Work integral via parametrization
    const xt = input.curveXt || 't';
    const yt = input.curveYt || 't^2';
    const tA = input.tMin || '0';
    const tB = input.tMax || '1';

    stepCounter++;
    appliedRules.push('Parametrización de la curva C');
    steps.push({
      stepNumber: stepCounter,
      title: 'Parametrización de la trayectoria r(t)',
      ruleName: 'Vector posición y vector tangente',
      description: `Evaluamos el campo vectorial sobre los puntos de la curva y hallamos el diferencial vectorial $d\\vec{r} = \\vec{r}'(t) \\, dt$:`,
      ruleLatex: `\\int_C \\vec{F} \\cdot d\\vec{r} = \\int_a^b \\vec{F}(\\vec{r}(t)) \\cdot \\vec{r}'(t) \\, dt`,
      expressionLatex: `\\vec{r}(t) = (${toLatex(xt)}, \\; ${toLatex(yt)}), \\quad t \\in [${tA}, ${tB}]`,
      resultLatex: `d\\vec{r} = \\left( ${toLatex(simplify(derivative(xt, 't')))}, \\; ${toLatex(simplify(derivative(yt, 't')))} \\right) dt`,
    });

    const workFormulaLatex = `W = \\int_{${tA}}^{${tB}} \\vec{F}(\\vec{r}(t)) \\cdot \\vec{r}'(t) \\, dt`;

    return {
      operation: 'work_integral',
      category: 'u6_line_integrals',
      inputExpression: fVectorLatex,
      inputLatex: fVectorLatex,
      finalResultLatex: workFormulaLatex,
      appliedRules,
      steps,
      success: true,
    };
  } catch (err: any) {
    return {
      category: 'u6_line_integrals',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al calcular la integral de línea: ${err?.message || 'expresión inválida'}`,
    };
  }
}

import { parse, derivative, simplify } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';

export interface VectorFunctionInput {
  xt: string;
  yt: string;
  zt?: string;
  tVal?: string;
  operationType: 'velocity' | 'tangent_unit' | 'acceleration' | 'curvature';
}

export function solveVectorFunction(input: VectorFunctionInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const is3D = Boolean(input.zt && input.zt.trim());
    const xExpr = normalizeInputExpression(input.xt);
    const yExpr = normalizeInputExpression(input.yt);
    const zExpr = is3D ? normalizeInputExpression(input.zt!) : '';

    const xLatex = toLatex(xExpr);
    const yLatex = toLatex(yExpr);
    const zLatex = is3D ? toLatex(zExpr) : '';

    const rLatex = is3D
      ? `\\vec{r}(t) = \\left( ${xLatex}, \\; ${yLatex}, \\; ${zLatex} \\right)`
      : `\\vec{r}(t) = \\left( ${xLatex}, \\; ${yLatex} \\right)`;

    // Step 1: Planteo de la curva vectorial
    stepCounter++;
    steps.push({
      stepNumber: stepCounter,
      title: 'Definición de la función vectorial',
      ruleName: 'Parametrización de curva',
      description: `Se define la trayectoria o curva espacial parametrizada en función del escalar $t$:`,
      ruleLatex: is3D
        ? `\\vec{r}(t) = x(t)\\mathbf{i} + y(t)\\mathbf{j} + z(t)\\mathbf{k}`
        : `\\vec{r}(t) = x(t)\\mathbf{i} + y(t)\\mathbf{j}`,
      expressionLatex: rLatex,
      resultLatex: rLatex,
    });
    appliedRules.push('Definición de función vectorial paramétrica');

    // Step 2: Derivadas componentes (Vector Velocidad / Tangente)
    stepCounter++;
    appliedRules.push('Derivación componente a componente');
    const dx_node = simplify(derivative(xExpr, 't'));
    const dy_node = simplify(derivative(yExpr, 't'));
    const dz_node = is3D ? simplify(derivative(zExpr, 't')) : null;

    const dxLatex = toLatex(dx_node);
    const dyLatex = toLatex(dy_node);
    const dzLatex = dz_node ? toLatex(dz_node) : '';

    const vLatex = is3D
      ? `\\vec{r}'(t) = \\left( ${dxLatex}, \\; ${dyLatex}, \\; ${dzLatex} \\right)`
      : `\\vec{r}'(t) = \\left( ${dxLatex}, \\; ${dyLatex} \\right)`;

    steps.push({
      stepNumber: stepCounter,
      title: 'Derivada del vector posición (Vector Tangente / Velocidad)',
      ruleName: 'Regla de derivación vectorial',
      description: `Por el teorema de derivación de funciones vectoriales, la derivada se calcula derivando cada una de las funciones componentes respecto a $t$:`,
      ruleLatex: is3D
        ? `\\vec{r}'(t) = \\left( x'(t), \\; y'(t), \\; z'(t) \\right)`
        : `\\vec{r}'(t) = \\left( x'(t), \\; y'(t) \\right)`,
      expressionLatex: `\\frac{d}{dt}\\left[ \\vec{r}(t) \\right]`,
      resultLatex: vLatex,
    });

    // Acceleration needed for acceleration or curvature
    let aLatex = '';
    let d2x_node = null;
    let d2y_node = null;
    let d2z_node = null;

    if (input.operationType === 'acceleration' || input.operationType === 'curvature') {
      stepCounter++;
      appliedRules.push('Segunda derivada componente a componente');
      d2x_node = simplify(derivative(dx_node, 't'));
      d2y_node = simplify(derivative(dy_node, 't'));
      d2z_node = is3D && dz_node ? simplify(derivative(dz_node, 't')) : null;

      const d2xLatex = toLatex(d2x_node);
      const d2yLatex = toLatex(d2y_node);
      const d2zLatex = d2z_node ? toLatex(d2z_node) : '';

      aLatex = is3D
        ? `\\vec{r}''(t) = \\left( ${d2xLatex}, \\; ${d2yLatex}, \\; ${d2zLatex} \\right)`
        : `\\vec{r}''(t) = \\left( ${d2xLatex}, \\; ${d2yLatex} \\right)`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Segunda derivada del vector posición (Vector Aceleración)',
        ruleName: 'Vector Aceleración',
        description: `Derivamos nuevamente respecto al parámetro $t$ para hallar el vector aceleración $\\vec{a}(t) = \\vec{r}''(t)$:`,
        ruleLatex: `\\vec{r}''(t) = \\frac{d}{dt}[\\vec{r}'(t)]`,
        expressionLatex: `\\vec{r}''(t)`,
        resultLatex: aLatex,
      });
    }

    // Step: Norm / Speed
    stepCounter++;
    appliedRules.push('Módulo euclídeo / Rapidez');
    const normLatexInner = is3D
      ? `\\left(${dxLatex}\\right)^2 + \\left(${dyLatex}\\right)^2 + \\left(${dzLatex}\\right)^2`
      : `\\left(${dxLatex}\\right)^2 + \\left(${dyLatex}\\right)^2`;

    const normLatex = `\\|\\vec{r}'(t)\\| = \\sqrt{${normLatexInner}}`;

    steps.push({
      stepNumber: stepCounter,
      title: 'Módulo de la velocidad (Rapidez)',
      ruleName: 'Norma euclídea',
      description: `Calculamos la rapidez (módulo del vector tangente), fundamental para la longitud de arco y la normalización:`,
      ruleLatex: is3D
        ? `\\|\\vec{r}'(t)\\| = \\sqrt{[x'(t)]^2 + [y'(t)]^2 + [z'(t)]^2}`
        : `\\|\\vec{r}'(t)\\| = \\sqrt{[x'(t)]^2 + [y'(t)]^2}`,
      expressionLatex: `\\|\\vec{r}'(t)\\|`,
      resultLatex: normLatex,
    });

    let finalResultLatex = '';

    if (input.operationType === 'velocity') {
      finalResultLatex = vLatex;
    } else if (input.operationType === 'acceleration') {
      finalResultLatex = aLatex;
    } else if (input.operationType === 'tangent_unit') {
      stepCounter++;
      appliedRules.push('Vector tangente unitario T(t)');
      const unitLatex = `\\vec{T}(t) = \\frac{\\vec{r}'(t)}{\\|\\vec{r}'(t)\\|} = \\frac{1}{\\sqrt{${normLatexInner}}} ${vLatex.replace(`\\vec{r}'(t) = `, '')}`;
      steps.push({
        stepNumber: stepCounter,
        title: 'Normalización del vector tangente',
        ruleName: 'Vector Tangente Unitario',
        description: `Dividimos el vector tangente por su módulo para obtener un vector de longitud unitaria con la misma dirección y sentido de recorrido:`,
        ruleLatex: `\\vec{T}(t) = \\frac{\\vec{r}'(t)}{\\|\\vec{r}'(t)\\|}`,
        expressionLatex: `\\vec{T}(t)`,
        resultLatex: unitLatex,
      });
      finalResultLatex = unitLatex;
    } else if (input.operationType === 'curvature') {
      stepCounter++;
      appliedRules.push('Cálculo de curvatura kappa');
      if (!is3D && d2x_node && d2y_node) {
        // 2D Curvature formula: |x' y'' - y' x''| / (x'^2 + y'^2)^(3/2)
        const numExpr = `(${dx_node.toString()}) * (${d2y_node.toString()}) - (${dy_node.toString()}) * (${d2x_node.toString()})`;
        const numSimplified = simplify(parse(numExpr));
        const numLatex = toLatex(numSimplified);
        const curvLatex = `\\kappa(t) = \\frac{\\left| ${numLatex} \\right|}{\\left( ${normLatexInner} \\right)^{3/2}}`;

        steps.push({
          stepNumber: stepCounter,
          title: 'Fórmula de curvatura en el plano (2D)',
          ruleName: 'Curvatura analítica',
          description: `La curvatura $\\kappa(t)$ mide qué tan rápido cambia de dirección la curva por unidad de longitud de arco:`,
          ruleLatex: `\\kappa(t) = \\frac{|x'(t)y''(t) - y'(t)x''(t)|}{\\left([x'(t)]^2 + [y'(t)]^2\\right)^{3/2}}`,
          expressionLatex: `\\kappa(t)`,
          resultLatex: curvLatex,
        });
        finalResultLatex = curvLatex;
      } else {
        const curvLatex = `\\kappa(t) = \\frac{\\|\\vec{r}'(t) \\times \\vec{r}''(t)\\|}{\\|\\vec{r}'(t)\\|^3}`;
        steps.push({
          stepNumber: stepCounter,
          title: 'Fórmula de curvatura en el espacio (3D)',
          ruleName: 'Curvatura en R³',
          description: `En tres dimensiones, la curvatura se obtiene mediante el producto vectorial entre la velocidad y la aceleración:`,
          ruleLatex: `\\kappa(t) = \\frac{\\|\\vec{r}'(t) \\times \\vec{r}''(t)\\|}{\\|\\vec{r}'(t)\\|^3}`,
          expressionLatex: `\\kappa(t)`,
          resultLatex: curvLatex,
        });
        finalResultLatex = curvLatex;
      }
    }

    // Optional evaluation at t = t0
    if (input.tVal && input.tVal.trim()) {
      stepCounter++;
      appliedRules.push(`Evaluación en t = ${input.tVal.trim()}`);
      try {
        const tNum = Number(input.tVal);
        const xAtT = simplify(xExpr, { t: tNum }).toString();
        const yAtT = simplify(yExpr, { t: tNum }).toString();
        const zAtT = is3D ? simplify(zExpr, { t: tNum }).toString() : '';

        const rAtTLatex = is3D
          ? `\\vec{r}(${input.tVal}) = \\left( ${xAtT}, \\; ${yAtT}, \\; ${zAtT} \\right)`
          : `\\vec{r}(${input.tVal}) = \\left( ${xAtT}, \\; ${yAtT} \\right)`;

        const vxAtT = simplify(dx_node, { t: tNum }).toString();
        const vyAtT = simplify(dy_node, { t: tNum }).toString();
        const vzAtT = is3D && dz_node ? simplify(dz_node, { t: tNum }).toString() : '';

        const vAtTLatex = is3D
          ? `\\vec{r}'(${input.tVal}) = \\left( ${vxAtT}, \\; ${vyAtT}, \\; ${vzAtT} \\right)`
          : `\\vec{r}'(${input.tVal}) = \\left( ${vxAtT}, \\; ${vyAtT} \\right)`;

        steps.push({
          stepNumber: stepCounter,
          title: `Evaluación puntual en t = ${input.tVal}`,
          ruleName: 'Evaluación en punto',
          description: `Sustituimos el parámetro $t = ${input.tVal}$ para hallar el punto sobre la curva y el vector tangente instantáneo:`,
          expressionLatex: `t = ${input.tVal}`,
          resultLatex: `${rAtTLatex}, \\quad ${vAtTLatex}`,
        });
      } catch {
        // Skip eval if symbolic error
      }
    }

    return {
      operation: input.operationType,
      category: 'u1_vector_functions',
      inputExpression: rLatex,
      inputLatex: rLatex,
      finalResultLatex: cleanLatex(finalResultLatex),
      appliedRules,
      steps,
      success: true,
    };
  } catch (err: any) {
    return {
      category: 'u1_vector_functions',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al calcular la función vectorial: ${err?.message || 'expresión inválida'}`,
    };
  }
}

import { parse, derivative, simplify } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';

export interface ExtremaInput {
  expression: string;
  criticalPointsInput?: string; // e.g. "(0, 0), (1, 1)" or user can test a specific candidate point
  constraintExpr?: string; // for Lagrange: g(x, y) = k
  mode: 'hessian' | 'lagrange';
}

export function solveExtrema(input: ExtremaInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const rawExpr = normalizeInputExpression(input.expression);
    const fLatex = toLatex(rawExpr);

    // Step 1: Planteo del problema de optimización
    stepCounter++;
    steps.push({
      stepNumber: stepCounter,
      title: 'Función a optimizar f(x, y)',
      ruleName: 'Optimización multivariable',
      description: `Buscamos los puntos donde la función puede alcanzar valores extremos relativos (máximos, mínimos o puntos de ensilladura):`,
      ruleLatex: `z = f(x, y)`,
      expressionLatex: `f(x, y) = ${fLatex}`,
      resultLatex: `f(x, y) = ${fLatex}`,
    });

    if (input.mode === 'lagrange') {
      // Lagrange Multipliers
      const constraint = normalizeInputExpression(input.constraintExpr || 'x^2 + y^2 - 1');
      const gLatex = toLatex(constraint);

      stepCounter++;
      appliedRules.push('Método de los Multiplicadores de Lagrange');
      steps.push({
        stepNumber: stepCounter,
        title: 'Planteo del Teorema de Lagrange',
        ruleName: 'Multiplicadores de Lagrange',
        description: `Para optimizar $f(x, y)$ sujeta a la restricción $g(x, y) = 0$, los gradientes deben ser paralelos en los puntos extremos:`,
        ruleLatex: `\\nabla f(x, y) = \\lambda \\nabla g(x, y), \\quad g(x, y) = 0`,
        expressionLatex: `\\text{Restricción: } g(x, y) = ${gLatex} = 0`,
        resultLatex: `\\nabla f = \\lambda \\nabla g`,
      });

      stepCounter++;
      appliedRules.push('Cálculo de gradientes');
      const fx = simplify(derivative(rawExpr, 'x'));
      const fy = simplify(derivative(rawExpr, 'y'));
      const gx = simplify(derivative(constraint, 'x'));
      const gy = simplify(derivative(constraint, 'y'));

      const sysLatex = `\\begin{cases} ${toLatex(fx)} = \\lambda \\left(${toLatex(gx)}\\right) \\\\ ${toLatex(fy)} = \\lambda \\left(${toLatex(gy)}\\right) \\\\ ${gLatex} = 0 \\end{cases}`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Sistema de Ecuaciones de Lagrange',
        ruleName: 'Sistema no lineal de Lagrange',
        description: `Se igualan componente a componente las derivadas parciales con el multiplicador $\\lambda$:`,
        ruleLatex: `\\begin{cases} f_x = \\lambda g_x \\\\ f_y = \\lambda g_y \\\\ g(x, y) = 0 \\end{cases}`,
        expressionLatex: `\\text{Sistema de Lagrange}`,
        resultLatex: sysLatex,
      });

      return {
        operation: 'lagrange',
        category: 'u4_extrema',
        inputExpression: `f(x,y)=${fLatex}, \\; g(x,y)=${gLatex}`,
        inputLatex: `f(x,y)=${fLatex}, \\; g(x,y)=${gLatex}`,
        finalResultLatex: cleanLatex(sysLatex),
        appliedRules,
        steps,
        success: true,
      };
    }

    // Hessian Mode
    // Step 2: Derivadas de 1er orden y condición necesaria de extremo
    stepCounter++;
    appliedRules.push('Condición necesaria de extremo: Gradiente nulo (Puntos Críticos)');
    const fx_node = simplify(derivative(rawExpr, 'x'));
    const fy_node = simplify(derivative(rawExpr, 'y'));
    const fxLatex = toLatex(fx_node);
    const fyLatex = toLatex(fy_node);

    steps.push({
      stepNumber: stepCounter,
      title: 'Cálculo de derivadas de primer orden y puntos críticos',
      ruleName: 'Condición necesaria de Fermat en R²',
      description: `Los puntos críticos son aquellos donde el plano tangente es horizontal (ambas derivadas parciales se anulan simultáneamente):`,
      ruleLatex: `\\nabla f(x, y) = \\mathbf{0} \\iff \\begin{cases} f_x(x, y) = 0 \\\\ f_y(x, y) = 0 \\end{cases}`,
      expressionLatex: `\\nabla f(x, y) = \\mathbf{0}`,
      resultLatex: `\\begin{cases} ${fxLatex} = 0 \\\\ ${fyLatex} = 0 \\end{cases}`,
    });

    // Step 3: Derivadas de segundo orden
    stepCounter++;
    appliedRules.push('Derivadas parciales de segundo orden');
    const fxx_node = simplify(derivative(fx_node, 'x'));
    const fyy_node = simplify(derivative(fy_node, 'y'));
    const fxy_node = simplify(derivative(fx_node, 'y'));

    const fxxLatex = toLatex(fxx_node);
    const fyyLatex = toLatex(fyy_node);
    const fxyLatex = toLatex(fxy_node);

    steps.push({
      stepNumber: stepCounter,
      title: 'Derivadas parciales de segundo orden',
      ruleName: 'Cálculo de curvaturas secundarias',
      description: `Calculamos las derivadas directas y cruzadas para construir la matriz Hessiana:`,
      ruleLatex: `f_{xx} = \\frac{\\partial^2 f}{\\partial x^2}, \\quad f_{yy} = \\frac{\\partial^2 f}{\\partial y^2}, \\quad f_{xy} = \\frac{\\partial^2 f}{\\partial y \\partial x}`,
      expressionLatex: `f_{xx}, f_{yy}, f_{xy}`,
      resultLatex: `f_{xx} = ${fxxLatex}, \\quad f_{yy} = ${fyyLatex}, \\quad f_{xy} = ${fxyLatex}`,
    });

    // Step 4: Matriz Hessiana y Determinante Hessiano (Discriminante D)
    stepCounter++;
    appliedRules.push('Construcción de la Matriz Hessiana y Discriminante D');
    const hessianMatrixLatex = `H(x, y) = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{xy} & f_{yy} \\end{pmatrix} = \\begin{pmatrix} ${fxxLatex} & ${fxyLatex} \\\\ ${fxyLatex} & ${fyyLatex} \\end{pmatrix}`;
    const discExpr = `(${fxx_node.toString()}) * (${fyy_node.toString()}) - (${fxy_node.toString()})^2`;
    const discSimplified = simplify(parse(discExpr));
    const discLatex = toLatex(discSimplified);

    steps.push({
      stepNumber: stepCounter,
      title: 'Matriz Hessiana y Determinante Hessiano D(x, y)',
      ruleName: 'Matriz Hessiana',
      description: `El determinante hessiano $D(x, y) = \\det(H)$ determina la concavidad y curvatura de la superficie:`,
      ruleLatex: `D(x, y) = \\det(H) = f_{xx} f_{yy} - (f_{xy})^2`,
      expressionLatex: hessianMatrixLatex,
      resultLatex: `D(x, y) = ${discLatex}`,
    });

    // Step 5: Criterio de Clasificación Teórico
    stepCounter++;
    appliedRules.push('Criterio de la Segunda Derivada para funciones de dos variables');
    const criteriaLatex = `\\begin{cases} D > 0 \\text{ y } f_{xx} > 0 \\implies \\text{Mínimo local relativo} \\\\ D > 0 \\text{ y } f_{xx} < 0 \\implies \\text{Máximo local relativo} \\\\ D < 0 \\implies \\text{Punto de ensilladura (punto silla)} \\\\ D = 0 \\implies \\text{Criterio no concluyente (duda)} \\end{cases}`;

    steps.push({
      stepNumber: stepCounter,
      title: 'Criterio de Clasificación del Hessiano',
      ruleName: 'Teorema de Clasificación de Puntos Críticos',
      description: `Aplicamos el teorema de los signos de los autovalores de la forma cuadrática hessiana:`,
      ruleLatex: criteriaLatex,
      expressionLatex: `\\text{Regla de decisión}`,
      resultLatex: criteriaLatex,
    });

    // Point evaluation if provided by user, or default (0, 0)
    let candidatePoints: [number, number][] = [[0, 0]];
    if (input.criticalPointsInput && input.criticalPointsInput.trim()) {
      // Parse points like "(0, 0)" or "(1, 2)"
      const matches = input.criticalPointsInput.match(/\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?/g);
      if (matches && matches.length > 0) {
        candidatePoints = matches.map(m => {
          const nums = m.replace(/[()]/g, '').split(',').map(n => Number(n.trim()));
          return [nums[0], nums[1]];
        });
      }
    }

    // Evaluate for candidate point(s)
    let finalClassificationSummary = '';
    for (const [cx, cy] of candidatePoints) {
      stepCounter++;
      appliedRules.push(`Evaluación y clasificación en (${cx}, ${cy})`);
      try {
        const fVal = simplify(rawExpr, { x: cx, y: cy }).toString();
        const fxxVal = Number(simplify(fxx_node, { x: cx, y: cy }).toString());
        const fyyVal = Number(simplify(fyy_node, { x: cx, y: cy }).toString());
        const fxyVal = Number(simplify(fxy_node, { x: cx, y: cy }).toString());
        const dVal = fxxVal * fyyVal - fxyVal ** 2;

        let classification = '';
        if (dVal > 0 && fxxVal > 0) {
          classification = `MÍNIMO LOCAL RELATIVO con valor z = ${fVal}`;
        } else if (dVal > 0 && fxxVal < 0) {
          classification = `MÁXIMO LOCAL RELATIVO con valor z = ${fVal}`;
        } else if (dVal < 0) {
          classification = `PUNTO DE ENSILLADURA (Punto Silla)`;
        } else {
          classification = `CRITERIO NO CONCLUYENTE (D = 0)`;
        }

        const evalLatex = `P(${cx}, ${cy}) \\implies D = (${fxxVal})(${fyyVal}) - (${fxyVal})^2 = ${dVal}, \\quad f_{xx} = ${fxxVal}`;

        steps.push({
          stepNumber: stepCounter,
          title: `Evaluación en el punto crítico P(${cx}, ${cy})`,
          ruleName: 'Clasificación puntual',
          description: `Evaluamos las derivadas y el discriminante en el punto crítico candidato $P(${cx}, ${cy})$:
- $D = ${dVal}$
- $f_{xx} = ${fxxVal}$
- **Conclusión:** ${classification}`,
          expressionLatex: evalLatex,
          resultLatex: `\\text{Resultado: } \\mathbf{${classification}}`,
        });

        finalClassificationSummary = `P(${cx}, ${cy}): ${classification}`;
      } catch {
        // Skip eval error
      }
    }

    return {
      operation: 'hessian',
      category: 'u4_extrema',
      inputExpression: `f(x, y) = ${fLatex}`,
      inputLatex: `f(x, y) = ${fLatex}`,
      finalResultLatex: cleanLatex(
        finalClassificationSummary
          ? `\\text{${finalClassificationSummary}}`
          : `D(x, y) = ${discLatex}`
      ),
      appliedRules,
      steps,
      success: true,
    };
  } catch (err: any) {
    return {
      category: 'u4_extrema',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al clasificar extremos: ${err?.message || 'expresión inválida'}`,
    };
  }
}

import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';
import { solveIntegral } from './integralSolver';

export interface MultipleIntegralsInput {
  expression: string;
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
  coordinateSystem: 'cartesian' | 'polar';
}

export function solveMultipleIntegral(input: MultipleIntegralsInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const isPolar = input.coordinateSystem === 'polar';
    const rawExpr = normalizeInputExpression(input.expression);
    const fLatex = toLatex(rawExpr);

    const xA = input.xMin || '0';
    const xB = input.xMax || '1';
    const yC = input.yMin || '0';
    const yD = input.yMax || '1';

    // Step 1: Planteo de la integral doble sobre la región R
    stepCounter++;
    appliedRules.push('Definición de Integral Doble de Riemann');
    const statementLatex = isPolar
      ? `\\iint_R f(r, \\theta) \\, dA = \\int_{${xA}}^{${xB}} \\int_{${yC}}^{${yD}} \\left( ${fLatex} \\right) \\cdot r \\, dr \\, d\\theta`
      : `\\iint_R f(x, y) \\, dA = \\int_{${xA}}^{${xB}} \\int_{${yC}}^{${yD}} ${fLatex} \\, dy \\, dx`;

    steps.push({
      stepNumber: stepCounter,
      title: isPolar
        ? 'Planteo de la Integral Doble en Coordenadas Polares'
        : 'Planteo de la Integral Doble en la Región R',
      ruleName: isPolar ? 'Cambio a Coordenadas Polares' : 'Integral de Riemann en R²',
      description: isPolar
        ? `En coordenadas polares ($x = r\\cos\\theta, y = r\\sin\\theta$), el elemento de área incluye el factor de escala del Jacobiano $dA = r \\, dr \\, d\\theta$:`
        : `Planteamos la integral doble de la función escalar continua sobre el rectángulo o región delimitada $R = [${xA}, ${xB}] \\times [${yC}, ${yD}]$:`,
      ruleLatex: isPolar
        ? `\\iint_R f(x, y) \\, dx dy = \\iint_R f(r\\cos\\theta, r\\sin\\theta) \\cdot |J| \\, dr d\\theta, \\quad |J| = r`
        : `\\iint_R f(x, y) \\, dA = \\int_a^b \\left( \\int_c^d f(x, y) \\, dy \\right) dx`,
      expressionLatex: statementLatex,
      resultLatex: statementLatex,
    });

    // Step 2: Teorema de Fubini
    stepCounter++;
    appliedRules.push('Teorema de Fubini (Integrales iteradas)');
    steps.push({
      stepNumber: stepCounter,
      title: 'Aplicación del Teorema de Fubini',
      ruleName: 'Teorema de Fubini',
      description: `Por ser el integrando una función continua sobre la región acotada, la integral doble es idéntica a las integrales simples iteradas en cualquier orden:`,
      ruleLatex: `\\iint_R f(x, y) \\, dA = \\int_{a}^{b} \\left[ \\int_{c}^{d} f(x, y) \\, dy \\right] dx`,
      expressionLatex: `\\text{Separación iterada}`,
      resultLatex: `\\int_{${xA}}^{${xB}} \\left( \\int_{${yC}}^{${yD}} ${fLatex} \\, dy \\right) dx`,
    });

    // Step 3: Integración interior respecto a y (x actúa como constante)
    stepCounter++;
    appliedRules.push('Integración interior (x constante)');
    const innerVar = isPolar ? 'r' : 'y';
    const innerSolverResult = solveIntegral(
      isPolar ? `(${rawExpr}) * r` : rawExpr,
      innerVar
    );
    const innerAntiderivLatex = innerSolverResult.finalResultLatex.replace(' + C', '');

    steps.push({
      stepNumber: stepCounter,
      title: `Integración interior respecto a la variable ${innerVar}`,
      ruleName: `Antiderivada respecto a ${innerVar}`,
      description: `Integramos el integrando manteniendo la variable exterior fija como constante:`,
      ruleLatex: `F(${isPolar ? '\\theta, r' : 'x, y'}) = \\int f(${isPolar ? 'r, \\theta' : 'x, y'}) \\, d${innerVar}`,
      expressionLatex: `\\int ${isPolar ? `(${fLatex}) \\cdot r` : fLatex} \\, d${innerVar}`,
      resultLatex: innerAntiderivLatex,
    });

    // Step 4: Regla de Barrow para la integral interior
    stepCounter++;
    appliedRules.push('Regla de Barrow (Integral definida interior)');
    const barrowInnerLatex = `\\left[ ${innerAntiderivLatex} \\right]_{${innerVar} = ${yC}}^{${innerVar} = ${yD}}`;

    steps.push({
      stepNumber: stepCounter,
      title: `Evaluación de los límites interiores [${yC}, ${yD}]`,
      ruleName: 'Regla de Barrow',
      description: `Evaluamos la primitiva en el límite superior menos el límite inferior:`,
      ruleLatex: `\\int_c^d g(${innerVar}) \\, d${innerVar} = G(d) - G(c)`,
      expressionLatex: `\\int_{${yC}}^{${yD}} \\dots \\, d${innerVar}`,
      resultLatex: barrowInnerLatex,
    });

    // Step 5: Integral exterior
    stepCounter++;
    appliedRules.push('Integración exterior');
    const outerVar = isPolar ? '\\theta' : 'x';
    const outerStatementLatex = `\\int_{${xA}}^{${xB}} \\left( ${barrowInnerLatex} \\right) \\, d${outerVar}`;

    steps.push({
      stepNumber: stepCounter,
      title: `Integración exterior respecto a ${outerVar}`,
      ruleName: 'Integral definida final',
      description: `Integramos la función resultante de una sola variable respecto a $${outerVar}$ en el intervalo $[${xA}, ${xB}]$:`,
      ruleLatex: `I = \\int_{${xA}}^{${xB}} H(${outerVar}) \\, d${outerVar}`,
      expressionLatex: `I = ${outerStatementLatex}`,
      resultLatex: outerStatementLatex,
    });

    // Final result representation
    const finalResultLatex = `\\iint_R f \\, dA = ${outerStatementLatex}`;

    return {
      operation: 'multiple_integral',
      category: 'u5_multiple_integrals',
      inputExpression: statementLatex,
      inputLatex: statementLatex,
      finalResultLatex: cleanLatex(finalResultLatex),
      appliedRules,
      steps,
      success: true,
    };
  } catch (err: any) {
    return {
      category: 'u5_multiple_integrals',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al calcular la integral doble: ${err?.message || 'expresión inválida'}`,
    };
  }
}

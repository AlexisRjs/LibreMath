import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';
import { solveIntegral } from './integralSolver';

export interface DifferentialEquationsInput {
  odeType: 'linear_first_order' | 'separable' | 'second_order_homogeneous';
  // For linear first order: y' + P(x) y = Q(x)
  px?: string;
  qx?: string;
  // For separable: dy/dx = g(x) * h(y)
  gx?: string;
  hy?: string;
  // For 2nd order: a*y'' + b*y' + c*y = 0
  aCoeff?: string;
  bCoeff?: string;
  cCoeff?: string;
}

export function solveDifferentialEquation(input: DifferentialEquationsInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    if (input.odeType === 'linear_first_order') {
      const pRaw = normalizeInputExpression(input.px || '2');
      const qRaw = normalizeInputExpression(input.qx || 'exp(x)');

      const pLatex = toLatex(pRaw);
      const qLatex = toLatex(qRaw);

      const odeLatex = `y' + (${pLatex})y = ${qLatex}`;

      // Step 1: Forma canónica
      stepCounter++;
      appliedRules.push('Forma canónica de EDO lineal de 1er orden');
      steps.push({
        stepNumber: stepCounter,
        title: 'Identificación de la forma canónica',
        ruleName: 'EDO Lineal de 1er orden',
        description: `La ecuación diferencial se encuentra en la forma estándar $y' + P(x)y = Q(x)$, identificando los coeficientes continuos:`,
        ruleLatex: `\\frac{dy}{dx} + P(x)y = Q(x)`,
        expressionLatex: odeLatex,
        resultLatex: `P(x) = ${pLatex}, \\quad Q(x) = ${qLatex}`,
      });

      // Step 2: Factor Integrante mu(x)
      stepCounter++;
      appliedRules.push('Método del Factor Integrante de Euler mu(x)');
      const intPResult = solveIntegral(pRaw, 'x');
      const intPLatex = intPResult.finalResultLatex.replace(' + C', '');
      const muLatex = `\\mu(x) = e^{\\int P(x) \\, dx} = e^{${intPLatex}}`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Cálculo del Factor Integrante mu(x)',
        ruleName: 'Factor Integrante',
        description: `El factor integrante $\\mu(x)$ convierte el primer miembro en la derivada exacta del producto $\\frac{d}{dx}[\\mu(x) \\cdot y]$:`,
        ruleLatex: `\\mu(x) = \\exp\\left( \\int P(x) \\, dx \\right)`,
        expressionLatex: `\\mu(x) = e^{\\int ${pLatex} \\, dx}`,
        resultLatex: muLatex,
      });

      // Step 3: Multiplicar la EDO y regla del producto
      stepCounter++;
      appliedRules.push('Regla del producto inverso para derivadas');
      steps.push({
        stepNumber: stepCounter,
        title: 'Multiplicación por el factor integrante y condensación',
        ruleName: 'Diferencial exacto',
        description: `Multiplicamos toda la ecuación diferencial por $\\mu(x) = e^{${intPLatex}}$ y reconocemos la regla del producto:`,
        ruleLatex: `\\mu(x)y' + \\mu(x)P(x)y = \\frac{d}{dx}[\\mu(x)y] = \\mu(x)Q(x)`,
        expressionLatex: `e^{${intPLatex}} y' + e^{${intPLatex}}(${pLatex})y`,
        resultLatex: `\\frac{d}{dx}\\left[ e^{${intPLatex}} \\cdot y \\right] = e^{${intPLatex}} \\cdot \\left( ${qLatex} \\right)`,
      });

      // Step 4: Integración de ambos miembros
      stepCounter++;
      appliedRules.push('Integración indefinida con constante C');

      steps.push({
        stepNumber: stepCounter,
        title: 'Integración respecto a x de ambos miembros',
        ruleName: 'Teorema Fundamental del Cálculo',
        description: `Integramos ambos miembros con respecto a $x$ e introducimos la constante arbitraria de integración $C$:`,
        ruleLatex: `\\mu(x)y = \\int \\mu(x)Q(x) \\, dx + C`,
        expressionLatex: `e^{${intPLatex}} \\cdot y`,
        resultLatex: `\\int e^{${intPLatex}} \\left( ${qLatex} \\right) \\, dx + C`,
      });

      // Step 5: Despeje explícito de y(x)
      stepCounter++;
      appliedRules.push('Solución general explícita');
      const finalSolLatex = `y(x) = e^{-(${intPLatex})} \\left( \\int e^{${intPLatex}} (${qLatex}) \\, dx + C \\right)`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Despeje de la función incógnita y(x)',
        ruleName: 'Familia de soluciones uniparamétrica',
        description: `Dividimos por el factor integrante $\\mu(x)$ para obtener la solución general explícita:`,
        ruleLatex: `y(x) = \\frac{1}{\\mu(x)} \\left( \\int \\mu(x) Q(x) \\, dx + C \\right)`,
        expressionLatex: `y(x)`,
        resultLatex: finalSolLatex,
      });

      return {
        operation: 'linear_first_order',
        category: 'u8_differential_equations',
        inputExpression: odeLatex,
        inputLatex: odeLatex,
        finalResultLatex: cleanLatex(finalSolLatex),
        appliedRules,
        steps,
        success: true,
      };
    } else if (input.odeType === 'separable') {
      const gRaw = normalizeInputExpression(input.gx || '2*x');
      const hRaw = normalizeInputExpression(input.hy || 'y');

      const gLatex = toLatex(gRaw);
      const hLatex = toLatex(hRaw);

      const odeLatex = `\\frac{dy}{dx} = \\left( ${gLatex} \\right) \\cdot \\left( ${hLatex} \\right)`;

      // Step 1: Planteo separable
      stepCounter++;
      appliedRules.push('Separación de variables algebraicas');
      steps.push({
        stepNumber: stepCounter,
        title: 'Separación de variables en miembros opuestos',
        ruleName: 'EDO de variables separables',
        description: `Agrupamos todos los términos dependientes de $y$ con su diferencial $dy$ a la izquierda, y los de $x$ con $dx$ a la derecha:`,
        ruleLatex: `\\frac{1}{h(y)} \\, dy = g(x) \\, dx`,
        expressionLatex: `\\frac{dy}{dx} = g(x)h(y)`,
        resultLatex: `\\frac{1}{${hLatex}} \\, dy = (${gLatex}) \\, dx`,
      });

      // Step 2: Integración a ambos lados
      stepCounter++;
      appliedRules.push('Integración simultánea de ambos miembros');
      const intGResult = solveIntegral(gRaw, 'x');
      const intGLatex = intGResult.finalResultLatex.replace(' + C', '');

      steps.push({
        stepNumber: stepCounter,
        title: 'Integración indefinida de ambos lados',
        ruleName: 'Antiderivadas simultáneas',
        description: `Calculamos las primitivas a ambos miembros agregando la constante de integración $C$:`,
        ruleLatex: `\\int \\frac{1}{h(y)} \\, dy = \\int g(x) \\, dx + C`,
        expressionLatex: `\\int \\frac{1}{${hLatex}} \\, dy`,
        resultLatex: `${intGLatex} + C`,
      });

      const finalSolLatex = `\\int \\frac{1}{${hLatex}} \\, dy = ${intGLatex} + C`;

      return {
        operation: 'separable',
        category: 'u8_differential_equations',
        inputExpression: odeLatex,
        inputLatex: odeLatex,
        finalResultLatex: cleanLatex(finalSolLatex),
        appliedRules,
        steps,
        success: true,
      };
    } else {
      // Second Order Linear Homogeneous with constant coefficients: a*y'' + b*y' + c*y = 0
      const a = Number(input.aCoeff || '1');
      const b = Number(input.bCoeff || '-5');
      const c = Number(input.cCoeff || '6');

      const odeLatex = `${a !== 1 ? `${a} ` : ''}y'' ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}y' ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}y = 0`;

      // Step 1: Ecuación Característica
      stepCounter++;
      appliedRules.push('Ecuación Característica (Polinomio auxiliar)');
      const charEqLatex = `${a !== 1 ? `${a}` : ''}r^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}r ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Planteo de la Ecuación Característica',
        ruleName: 'Propuesta exponencial y(x) = e^{rx}',
        description: `Proponemos soluciones de tipo exponencial $y = e^{rx}$, de modo que $y' = r e^{rx}$ e $y'' = r^2 e^{rx}$. Al factorizar $e^{rx} \\neq 0$, obtenemos la ecuación algebraica característica:`,
        ruleLatex: `a r^2 + b r + c = 0`,
        expressionLatex: odeLatex,
        resultLatex: charEqLatex,
      });

      // Step 2: Cálculo del Discriminante Delta
      stepCounter++;
      appliedRules.push('Discriminante de la ecuación cuadrática Delta = b² - 4ac');
      const delta = b ** 2 - 4 * a * c;
      const deltaLatex = `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${delta}`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Cálculo del Discriminante y naturaleza de las raíces',
        ruleName: 'Discriminante cuadrático',
        description: `El signo del discriminante determina si las raíces son reales distintas, reales dobles, o complejas conjugadas:`,
        ruleLatex: `\\Delta = b^2 - 4ac`,
        expressionLatex: `\\Delta`,
        resultLatex: deltaLatex,
      });

      // Step 3: Resolución y Solución General
      stepCounter++;
      let finalSolLatex = '';

      if (delta > 0) {
        appliedRules.push('Caso 1: Dos raíces reales distintas');
        const r1 = (-b + Math.sqrt(delta)) / (2 * a);
        const r2 = (-b - Math.sqrt(delta)) / (2 * a);
        const r1Str = Number.isInteger(r1) ? String(r1) : r1.toFixed(3);
        const r2Str = Number.isInteger(r2) ? String(r2) : r2.toFixed(3);

        finalSolLatex = `y(x) = C_1 e^{${r1Str}x} + C_2 e^{${r2Str}x}`;

        steps.push({
          stepNumber: stepCounter,
          title: 'Caso Delta > 0: Raíces reales distintas',
          ruleName: 'Base fundamental de soluciones reales',
          description: `Las dos raíces son reales y distintas ($r_1 = ${r1Str}, r_2 = ${r2Str}$). Las funciones $e^{r_1 x}$ y $e^{r_2 x}$ son linealmente independientes (Wronskiano no nulo):`,
          ruleLatex: `y(x) = C_1 e^{r_1 x} + C_2 e^{r_2 x}`,
          expressionLatex: `r_1 = ${r1Str}, \\quad r_2 = ${r2Str}`,
          resultLatex: finalSolLatex,
        });
      } else if (delta === 0) {
        appliedRules.push('Caso 2: Raíz real doble (Reducción de orden)');
        const r = -b / (2 * a);
        const rStr = Number.isInteger(r) ? String(r) : r.toFixed(3);

        finalSolLatex = `y(x) = (C_1 + C_2 x) e^{${rStr}x}`;

        steps.push({
          stepNumber: stepCounter,
          title: 'Caso Delta = 0: Raíz real repetida (multiplicidad 2)',
          ruleName: 'Solución con factor polinomial x',
          description: `Existe una única raíz real $r = ${rStr}$. Por el método de reducción de orden de D'Alembert, la segunda solución linealmente independiente es $x e^{r x}$:`,
          ruleLatex: `y(x) = (C_1 + C_2 x) e^{r x}`,
          expressionLatex: `r = ${rStr}`,
          resultLatex: finalSolLatex,
        });
      } else {
        appliedRules.push('Caso 3: Raíces complejas conjugadas (Fórmula de Euler)');
        const alpha = -b / (2 * a);
        const beta = Math.sqrt(-delta) / (2 * a);
        const alphaStr = Number.isInteger(alpha) ? String(alpha) : alpha.toFixed(3);
        const betaStr = Number.isInteger(beta) ? String(beta) : beta.toFixed(3);

        const expPart = alpha === 0 ? '' : `e^{${alphaStr}x}`;
        finalSolLatex = `y(x) = ${expPart}\\left( C_1 \\cos(${betaStr}x) + C_2 \\sin(${betaStr}x) \\right)`;

        steps.push({
          stepNumber: stepCounter,
          title: 'Caso Delta < 0: Raíces complejas conjugadas',
          ruleName: 'Solución oscilatoria / armónica',
          description: `Las raíces son $r = \\alpha \\pm \\beta i = ${alphaStr} \\pm ${betaStr} i$. Mediante la identidad de Euler $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$, la combinación lineal real es:`,
          ruleLatex: `y(x) = e^{\\alpha x} \\left( C_1 \\cos(\\beta x) + C_2 \\sin(\\beta x) \\right)`,
          expressionLatex: `\\alpha = ${alphaStr}, \\quad \\beta = ${betaStr}`,
          resultLatex: finalSolLatex,
        });
      }

      return {
        operation: 'second_order_homogeneous',
        category: 'u8_differential_equations',
        inputExpression: odeLatex,
        inputLatex: odeLatex,
        finalResultLatex: cleanLatex(finalSolLatex),
        appliedRules,
        steps,
        success: true,
      };
    }
  } catch (err: any) {
    return {
      category: 'u8_differential_equations',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al resolver la ecuación diferencial: ${err?.message || 'coeficientes inválidos'}`,
    };
  }
}

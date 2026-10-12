import { parse, derivative, simplify } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, cleanLatex } from './latexUtils';

export interface MultivariableDerivativesInput {
  expression: string;
  x0?: string;
  y0?: string;
  vx?: string;
  vy?: string;
  operationType: 'partials' | 'gradient' | 'directional' | 'tangent_plane';
}

export function solveMultivariableDerivatives(input: MultivariableDerivativesInput): CalculusResult {
  const steps: CalculusStep[] = [];
  const appliedRules: string[] = [];
  let stepCounter = 0;

  try {
    const rawExpr = normalizeInputExpression(input.expression);
    const parsedExpr = parse(rawExpr);
    const fLatex = toLatex(parsedExpr);

    // Step 1: Planteo de la función escalar
    stepCounter++;
    appliedRules.push('Definición de campo escalar multivariable');
    steps.push({
      stepNumber: stepCounter,
      title: 'Función de dos variables f(x, y)',
      ruleName: 'Campo escalar en R²',
      description: `Analizamos la función real de dos variables independientes $x$ e $y$:`,
      ruleLatex: `z = f(x, y)`,
      expressionLatex: `f(x, y) = ${fLatex}`,
      resultLatex: `f(x, y) = ${fLatex}`,
    });

    // Step 2: Derivada parcial respecto a x
    stepCounter++;
    appliedRules.push('Derivada parcial respecto a x (y constante)');
    const fx_node = simplify(derivative(rawExpr, 'x'));
    const fxLatex = toLatex(fx_node);
    steps.push({
      stepNumber: stepCounter,
      title: 'Derivada parcial de primer orden respecto a x',
      ruleName: 'Derivación parcial respecto a x',
      description: `Para derivar respecto a $x$, tratamos a la variable $y$ como si fuera una constante fija:`,
      ruleLatex: `\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h, y) - f(x, y)}{h}`,
      expressionLatex: `\\frac{\\partial}{\\partial x}\\left[ ${fLatex} \\right]`,
      resultLatex: `f_x(x, y) = ${fxLatex}`,
    });

    // Step 3: Derivada parcial respecto a y
    stepCounter++;
    appliedRules.push('Derivada parcial respecto a y (x constante)');
    const fy_node = simplify(derivative(rawExpr, 'y'));
    const fyLatex = toLatex(fy_node);
    steps.push({
      stepNumber: stepCounter,
      title: 'Derivada parcial de primer orden respecto a y',
      ruleName: 'Derivación parcial respecto a y',
      description: `Para derivar respecto a $y$, tratamos a la variable $x$ como si fuera una constante fija:`,
      ruleLatex: `\\frac{\\partial f}{\\partial y} = \\lim_{k \\to 0} \\frac{f(x, y + k) - f(x, y)}{k}`,
      expressionLatex: `\\frac{\\partial}{\\partial y}\\left[ ${fLatex} \\right]`,
      resultLatex: `f_y(x, y) = ${fyLatex}`,
    });

    // Gradiente
    const gradLatex = `\\nabla f(x, y) = \\left( ${fxLatex}, \\; ${fyLatex} \\right)`;

    // Segundas derivadas para el modo partials o tangent
    let fxxLatex = '';
    let fyyLatex = '';
    let fxyLatex = '';

    if (input.operationType === 'partials') {
      stepCounter++;
      appliedRules.push('Derivadas parciales de segundo orden (Teorema de Schwarz)');
      const fxx_node = simplify(derivative(fx_node, 'x'));
      const fyy_node = simplify(derivative(fy_node, 'y'));
      const fxy_node = simplify(derivative(fx_node, 'y'));

      fxxLatex = toLatex(fxx_node);
      fyyLatex = toLatex(fyy_node);
      fxyLatex = toLatex(fxy_node);

      steps.push({
        stepNumber: stepCounter,
        title: 'Derivadas parciales de segundo orden',
        ruleName: 'Teorema de Schwarz / Clairaut',
        description: `Derivamos sucesivamente las derivadas de primer orden. Por el Teorema de Schwarz, las derivadas mixtas cruzadas son iguales si son continuas ($f_{xy} = f_{yx}$):`,
        ruleLatex: `f_{xx} = \\frac{\\partial^2 f}{\\partial x^2}, \\quad f_{yy} = \\frac{\\partial^2 f}{\\partial y^2}, \\quad f_{xy} = \\frac{\\partial^2 f}{\\partial y \\partial x}`,
        expressionLatex: `\\text{Segundas derivadas}`,
        resultLatex: `f_{xx} = ${fxxLatex}, \\quad f_{yy} = ${fyyLatex}, \\quad f_{xy} = f_{yx} = ${fxyLatex}`,
      });
    }

    let finalResultLatex = '';

    if (input.operationType === 'partials') {
      finalResultLatex = `\\frac{\\partial f}{\\partial x} = ${fxLatex}, \\quad \\frac{\\partial f}{\\partial y} = ${fyLatex}`;
    } else if (input.operationType === 'gradient') {
      stepCounter++;
      appliedRules.push('Vector Gradiente');
      steps.push({
        stepNumber: stepCounter,
        title: 'Construcción del Vector Gradiente',
        ruleName: 'Vector Gradiente',
        description: `El gradiente es el campo vectorial formado por las derivadas parciales de primer orden. Apunta en la dirección de máxima tasa de crecimiento de $f$:`,
        ruleLatex: `\\nabla f(x, y) = \\left( \\frac{\\partial f}{\\partial x}, \\; \\frac{\\partial f}{\\partial y} \\right)`,
        expressionLatex: `\\nabla f(x, y)`,
        resultLatex: gradLatex,
      });

      // Optional point evaluation
      if (input.x0 && input.y0) {
        stepCounter++;
        appliedRules.push(`Evaluación del gradiente en (${input.x0}, ${input.y0})`);
        try {
          const xVal = Number(input.x0);
          const yVal = Number(input.y0);
          const fxAtP = simplify(fx_node, { x: xVal, y: yVal }).toString();
          const fyAtP = simplify(fy_node, { x: xVal, y: yVal }).toString();
          const gradAtPLatex = `\\nabla f(${input.x0}, ${input.y0}) = \\left( ${fxAtP}, \\; ${fyAtP} \\right)`;

          steps.push({
            stepNumber: stepCounter,
            title: `Evaluación del gradiente en el punto P(${input.x0}, ${input.y0})`,
            ruleName: 'Gradiente evaluado',
            description: `Sustituimos $x = ${input.x0}$ e $y = ${input.y0}$ en las componentes del gradiente:`,
            expressionLatex: `\\nabla f(${input.x0}, ${input.y0})`,
            resultLatex: gradAtPLatex,
          });
          finalResultLatex = gradAtPLatex;
        } catch {
          finalResultLatex = gradLatex;
        }
      } else {
        finalResultLatex = gradLatex;
      }
    } else if (input.operationType === 'directional') {
      // Directional Derivative
      const vx = input.vx || '1';
      const vy = input.vy || '1';
      const x0 = input.x0 || '0';
      const y0 = input.y0 || '0';

      stepCounter++;
      appliedRules.push('Normalización de la dirección (vector unitario u)');
      const vNormVal = Math.sqrt(Number(vx) ** 2 + Number(vy) ** 2);
      const uLatex = `\\vec{u} = \\left( \\frac{${vx}}{\\sqrt{${Number(vx) ** 2 + Number(vy) ** 2}}}, \\; \\frac{${vy}}{\\sqrt{${Number(vx) ** 2 + Number(vy) ** 2}}} \\right)`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Normalización del vector dirección',
        ruleName: 'Vector Unitario',
        description: `La derivada direccional requiere obligatoriamente una dirección unitaria $\\|\\vec{u}\\| = 1$:`,
        ruleLatex: `\\vec{u} = \\frac{\\vec{v}}{\\|\\vec{v}\\|}`,
        expressionLatex: `\\vec{v} = (${vx}, \\; ${vy})`,
        resultLatex: uLatex,
      });

      stepCounter++;
      appliedRules.push('Teorema de la Derivada Direccional (Gradiente dot u)');
      const xVal = Number(x0);
      const yVal = Number(y0);
      const fxAtP = simplify(fx_node, { x: xVal, y: yVal }).toString();
      const fyAtP = simplify(fy_node, { x: xVal, y: yVal }).toString();

      const dotVal = (Number(fxAtP) * Number(vx) + Number(fyAtP) * Number(vy)) / vNormVal;
      const dirDerivLatex = `D_{\\vec{u}} f(${x0}, ${y0}) = \\nabla f(${x0}, ${y0}) \\cdot \\vec{u} = (${fxAtP}) \\cdot \\left(\\frac{${vx}}{\\sqrt{${Number(vx)**2+Number(vy)**2}}}\\right) + (${fyAtP}) \\cdot \\left(\\frac{${vy}}{\\sqrt{${Number(vx)**2+Number(vy)**2}}}\\right) = ${dotVal.toFixed(4)}`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Producto escalar Gradiente por Vector Unitario',
        ruleName: 'Teorema de la Derivada Direccional',
        description: `Dado que $f$ es diferenciable, la derivada direccional es el producto punto entre el gradiente evaluado y el vector unitario:`,
        ruleLatex: `D_{\\vec{u}} f(P) = \\nabla f(P) \\cdot \\vec{u} = f_x(P) u_1 + f_y(P) u_2`,
        expressionLatex: `D_{\\vec{u}} f(${x0}, ${y0})`,
        resultLatex: dirDerivLatex,
      });

      finalResultLatex = dirDerivLatex;
    } else if (input.operationType === 'tangent_plane') {
      const x0 = input.x0 || '1';
      const y0 = input.y0 || '1';
      const xVal = Number(x0);
      const yVal = Number(y0);

      stepCounter++;
      appliedRules.push(`Evaluación de f en el punto (${x0}, ${y0})`);
      const z0Val = simplify(rawExpr, { x: xVal, y: yVal }).toString();
      const fxAtP = simplify(fx_node, { x: xVal, y: yVal }).toString();
      const fyAtP = simplify(fy_node, { x: xVal, y: yVal }).toString();

      steps.push({
        stepNumber: stepCounter,
        title: `Punto de tangencia P(${x0}, ${y0}, z_0)`,
        ruleName: 'Punto en la superficie',
        description: `Evaluamos la superficie $z_0 = f(${x0}, ${y0})$ y sus pendientes parciales en el punto:`,
        expressionLatex: `(x_0, y_0) = (${x0}, ${y0})`,
        resultLatex: `z_0 = ${z0Val}, \\quad f_x(${x0}, ${y0}) = ${fxAtP}, \\quad f_y(${x0}, ${y0}) = ${fyAtP}`,
      });

      stepCounter++;
      appliedRules.push('Ecuación del Plano Tangente y Vector Normal');
      const planeLatex = `z - ${z0Val} = ${fxAtP}(x - ${x0}) + ${fyAtP}(y - ${y0})`;
      // Simplified: A*x + B*y - z + D = 0
      const normVecLatex = `\\vec{n} = \\left( ${fxAtP}, \\; ${fyAtP}, \\; -1 \\right)`;

      steps.push({
        stepNumber: stepCounter,
        title: 'Ecuación del Plano Tangente a la superficie z = f(x, y)',
        ruleName: 'Plano Tangente',
        description: `La ecuación del plano tangente está determinada por las pendientes de las trazas y el vector normal ortogonal a la superficie:`,
        ruleLatex: `z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)`,
        expressionLatex: `\\Pi_{\\text{tg}}`,
        resultLatex: `${planeLatex}, \\quad \\text{Vector normal: } ${normVecLatex}`,
      });

      finalResultLatex = planeLatex;
    }

    return {
      operation: input.operationType,
      category: 'u2_u3_multivariable',
      inputExpression: `f(x, y) = ${fLatex}`,
      inputLatex: `f(x, y) = ${fLatex}`,
      finalResultLatex: cleanLatex(finalResultLatex),
      appliedRules,
      steps,
      success: true,
    };
  } catch (err: any) {
    return {
      category: 'u2_u3_multivariable',
      inputLatex: '',
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: `Error al calcular derivadas parciales: ${err?.message || 'expresión inválida'}`,
    };
  }
}

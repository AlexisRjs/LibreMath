import { parse, simplify, derivative, MathNode, isOperatorNode, isSymbolNode, isFunctionNode, isParenthesisNode, FunctionNode } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, formatDerivativeStatement, cleanLatex } from './latexUtils';

interface StepCollector {
  steps: CalculusStep[];
  rulesUsed: Set<string>;
  counter: number;
}

function getFunctionName(node: FunctionNode): string {
  const anyNode = node as any;
  if (typeof anyNode.name === 'string') return anyNode.name.toLowerCase();
  if (anyNode.fn && typeof anyNode.fn.name === 'string') return anyNode.fn.name.toLowerCase();
  return String(anyNode.name || anyNode.fn || '').toLowerCase();
}

/**
 * Checks if a math node contains the given variable symbol
 */
function dependsOnVariable(node: MathNode, variable: string): boolean {
  let found = false;
  node.traverse((n) => {
    if (isSymbolNode(n) && n.name === variable) {
      found = true;
    }
  });
  return found;
}

/**
 * Recursively derives a math node and records pedagogical steps
 */
function deriveNode(
  node: MathNode,
  variable: string,
  collector: StepCollector,
  isTopLevel = false
): { derivedNode: MathNode; latexResult: string } {
  // 1. Unwrap parenthesis
  if (isParenthesisNode(node)) {
    return deriveNode(node.content, variable, collector, isTopLevel);
  }

  // 2. Constants (numbers or symbols not matching variable)
  if (!dependsOnVariable(node, variable)) {
    collector.rulesUsed.add('Regla de la constante');
    const nodeTex = toLatex(node);
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Derivada de una constante',
      ruleName: 'Regla de la constante',
      description: `La expresión $${nodeTex}$ no depende de $${variable}$, por lo que se comporta como una constante respecto a $${variable}$. Su derivada es $0$.`,
      ruleLatex: `\\frac{d}{d${variable}}[c] = 0`,
      expressionLatex: formatDerivativeStatement(nodeTex, variable),
      resultLatex: '0',
    });
    return { derivedNode: parse('0'), latexResult: '0' };
  }

  // 3. Single variable identity (x -> 1)
  if (isSymbolNode(node) && node.name === variable) {
    collector.rulesUsed.add('Derivada de la variable independiente');
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Derivada de la variable identidad',
      ruleName: 'Regla de la potencia básica',
      description: `La derivada de la variable lineal $${variable}$ respecto a sí misma es $1$.`,
      ruleLatex: `\\frac{d}{d${variable}}[${variable}] = 1`,
      expressionLatex: formatDerivativeStatement(variable, variable),
      resultLatex: '1',
    });
    return { derivedNode: parse('1'), latexResult: '1' };
  }

  // 4. Operator Nodes (+, -, *, /, ^)
  if (isOperatorNode(node)) {
    // A. Unary Minus (-f(x))
    if (node.isUnary() && node.op === '-') {
      const inner = deriveNode(node.args[0], variable, collector);
      const res = parse(`-(${inner.derivedNode.toString()})`);
      return { derivedNode: res, latexResult: toLatex(res) };
    }

    // B. Addition / Subtraction (f(x) + g(x) or f(x) - g(x))
    if (node.op === '+' || node.op === '-') {
      collector.rulesUsed.add('Regla de la suma y resta');
      collector.counter++;
      const currentStepNum = collector.counter;
      const originalTex = toLatex(node);

      const opName = node.op === '+' ? 'suma' : 'resta';
      const opSign = node.op;

      collector.steps.push({
        stepNumber: currentStepNum,
        title: `Regla de la ${opName}`,
        ruleName: 'Regla de la suma y resta',
        description: `La derivada de una ${opName} de funciones es igual a la ${opName} de sus derivadas individuales. Derivamos cada término por separado:`,
        ruleLatex: `\\frac{d}{d${variable}}[f(${variable}) ${opSign} g(${variable})] = \\frac{d}{d${variable}}[f(${variable})] ${opSign} \\frac{d}{d${variable}}[g(${variable})]`,
        expressionLatex: formatDerivativeStatement(originalTex, variable),
        resultLatex: `${formatDerivativeStatement(toLatex(node.args[0]), variable)} ${opSign} ${formatDerivativeStatement(toLatex(node.args[1]), variable)}`,
      });

      const leftDeriv = deriveNode(node.args[0], variable, collector);
      const rightDeriv = deriveNode(node.args[1], variable, collector);

      const combinedExpr = `(${leftDeriv.derivedNode.toString()}) ${opSign} (${rightDeriv.derivedNode.toString()})`;
      const combinedNode = parse(combinedExpr);

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: `Resultado de la ${opName}`,
        ruleName: 'Regla de la suma y resta',
        description: `Uniendo las derivadas de cada término obtenemos la expresión combinada.`,
        expressionLatex: `${formatDerivativeStatement(toLatex(node.args[0]), variable)} ${opSign} ${formatDerivativeStatement(toLatex(node.args[1]), variable)}`,
        resultLatex: toLatex(combinedNode),
      });

      return { derivedNode: combinedNode, latexResult: toLatex(combinedNode) };
    }

    // C. Multiplication (u * v)
    if (node.op === '*') {
      const left = node.args[0];
      const right = node.args[1];
      const leftDepends = dependsOnVariable(left, variable);
      const rightDepends = dependsOnVariable(right, variable);

      // Constant multiple rule: c * f(x)
      if (!leftDepends && rightDepends) {
        collector.rulesUsed.add('Regla del múltiplo constante');
        collector.counter++;
        const cTex = toLatex(left);
        const fTex = toLatex(right);

        collector.steps.push({
          stepNumber: collector.counter,
          title: 'Regla del múltiplo constante',
          ruleName: 'Múltiplo constante',
          description: `La constante $${cTex}$ multiplica a una función de $${variable}$. Se extrae la constante fuera de la derivada.`,
          ruleLatex: `\\frac{d}{d${variable}}[c \\cdot f(${variable})] = c \\cdot \\frac{d}{d${variable}}[f(${variable})]`,
          expressionLatex: formatDerivativeStatement(`${cTex} \\cdot ${fTex}`, variable),
          resultLatex: `${cTex} \\cdot ${formatDerivativeStatement(fTex, variable)}`,
        });

        const inner = deriveNode(right, variable, collector);
        const res = parse(`(${left.toString()}) * (${inner.derivedNode.toString()})`);
        return { derivedNode: res, latexResult: toLatex(res) };
      }

      if (leftDepends && !rightDepends) {
        // f(x) * c
        return deriveNode(parse(`(${right.toString()}) * (${left.toString()})`), variable, collector);
      }

      // True Product Rule: u(x) * v(x)
      collector.rulesUsed.add('Regla del producto');
      collector.counter++;
      const uTex = toLatex(left);
      const vTex = toLatex(right);

      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Regla del producto',
        ruleName: 'Regla del producto',
        description: `Tenemos un producto de dos funciones: $u(${variable}) = ${uTex}$ y $v(${variable}) = ${vTex}$. Aplicamos la fórmula del producto:`,
        ruleLatex: `\\frac{d}{d${variable}}[u \\cdot v] = u' \\cdot v + u \\cdot v'`,
        substitutions: [
          { variable: 'u', expression: uTex },
          { variable: 'v', expression: vTex },
        ],
        expressionLatex: formatDerivativeStatement(`${uTex} \\cdot ${vTex}`, variable),
        resultLatex: `(${formatDerivativeStatement(uTex, variable)}) \\cdot (${vTex}) + (${uTex}) \\cdot (${formatDerivativeStatement(vTex, variable)})`,
      });

      const uDeriv = deriveNode(left, variable, collector);
      const vDeriv = deriveNode(right, variable, collector);

      const prodCombined = `(${uDeriv.derivedNode.toString()}) * (${right.toString()}) + (${left.toString()}) * (${vDeriv.derivedNode.toString()})`;
      const prodNode = parse(prodCombined);

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Sustitución en la regla del producto',
        ruleName: 'Regla del producto',
        description: `Sustituyendo las derivadas calculadas de $u$ y $v$ en la fórmula:`,
        expressionLatex: `u' \\cdot v + u \\cdot v'`,
        resultLatex: toLatex(prodNode),
      });

      return { derivedNode: prodNode, latexResult: toLatex(prodNode) };
    }

    // D. Division / Quotient (u / v)
    if (node.op === '/') {
      const num = node.args[0];
      const den = node.args[1];
      const numDepends = dependsOnVariable(num, variable);
      const denDepends = dependsOnVariable(den, variable);

      // Constant in denominator: f(x) / c -> (1/c) * f'(x)
      if (numDepends && !denDepends) {
        collector.rulesUsed.add('Regla del múltiplo constante');
        const cTex = toLatex(den);
        const fTex = toLatex(num);
        collector.counter++;
        collector.steps.push({
          stepNumber: collector.counter,
          title: 'División por constante',
          ruleName: 'Múltiplo constante',
          description: `El denominador es constante ($${cTex}$). Extraemos $\\frac{1}{${cTex}}$ fuera de la derivada.`,
          ruleLatex: `\\frac{d}{d${variable}}\\left[\\frac{f(${variable})}{c}\\right] = \\frac{1}{c} \\frac{d}{d${variable}}[f(${variable})]`,
          expressionLatex: formatDerivativeStatement(`\\frac{${fTex}}{${cTex}}`, variable),
          resultLatex: `\\frac{1}{${cTex}} \\cdot ${formatDerivativeStatement(fTex, variable)}`,
        });

        const numDeriv = deriveNode(num, variable, collector);
        const res = parse(`(${numDeriv.derivedNode.toString()}) / (${den.toString()})`);
        return { derivedNode: res, latexResult: toLatex(res) };
      }

      // True Quotient Rule
      collector.rulesUsed.add('Regla del cociente');
      collector.counter++;
      const uTex = toLatex(num);
      const vTex = toLatex(den);

      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Regla del cociente',
        ruleName: 'Regla del cociente',
        description: `Tenemos una división de funciones: numerador $u(${variable}) = ${uTex}$ y denominador $v(${variable}) = ${vTex}$.`,
        ruleLatex: `\\frac{d}{d${variable}}\\left[\\frac{u}{v}\\right] = \\frac{u' \\cdot v - u \\cdot v'}{v^2}`,
        substitutions: [
          { variable: 'u', expression: uTex },
          { variable: 'v', expression: vTex },
        ],
        expressionLatex: formatDerivativeStatement(`\\frac{${uTex}}{${vTex}}`, variable),
        resultLatex: `\\frac{(${formatDerivativeStatement(uTex, variable)}) \\cdot (${vTex}) - (${uTex}) \\cdot (${formatDerivativeStatement(vTex, variable)})}{(${vTex})^2}`,
      });

      const uDeriv = deriveNode(num, variable, collector);
      const vDeriv = deriveNode(den, variable, collector);

      const quotCombined = `((${uDeriv.derivedNode.toString()}) * (${den.toString()}) - (${num.toString()}) * (${vDeriv.derivedNode.toString()})) / ((${den.toString()}) ^ 2)`;
      const quotNode = parse(quotCombined);

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Sustitución en la regla del cociente',
        ruleName: 'Regla del cociente',
        description: `Sustituimos las derivadas obtenidas $u'$ y $v'$ en el numerador del cociente:`,
        expressionLatex: `\\frac{u' \\cdot v - u \\cdot v'}{v^2}`,
        resultLatex: toLatex(quotNode),
      });

      return { derivedNode: quotNode, latexResult: toLatex(quotNode) };
    }

    // E. Power (u ^ n or u ^ v)
    if (node.op === '^') {
      const base = node.args[0];
      const exponent = node.args[1];
      const baseDepends = dependsOnVariable(base, variable);
      const expDepends = dependsOnVariable(exponent, variable);

      // Power Rule: (x)^n or (g(x))^n where n is constant
      if (baseDepends && !expDepends) {
        const nTex = toLatex(exponent);
        const baseTex = toLatex(base);

        // Simple x^n
        if (isSymbolNode(base) && base.name === variable) {
          collector.rulesUsed.add('Regla de la potencia');
          collector.counter++;
          collector.steps.push({
            stepNumber: collector.counter,
            title: 'Regla de la potencia',
            ruleName: 'Regla de la potencia',
            description: `Aplicamos la regla de la potencia: el exponente baja a multiplicar y se le resta 1.`,
            ruleLatex: `\\frac{d}{d${variable}}[${variable}^n] = n \\cdot ${variable}^{n-1}`,
            expressionLatex: formatDerivativeStatement(`${variable}^{${nTex}}`, variable),
            resultLatex: `${nTex} \\cdot ${variable}^{(${nTex} - 1)}`,
          });

          const derived = parse(`(${exponent.toString()}) * (${variable} ^ ((${exponent.toString()}) - 1))`);
          return { derivedNode: derived, latexResult: toLatex(derived) };
        }

        // Generalized Power Rule / Chain Rule: (g(x))^n
        collector.rulesUsed.add('Regla de la potencia generalizada (Cadena)');
        collector.counter++;
        collector.steps.push({
          stepNumber: collector.counter,
          title: 'Regla de la potencia generalizada (Cadena)',
          ruleName: 'Regla de la cadena',
          description: `Tenemos una función compuesta en una potencia: $[g(${variable})]^n$, con $g(${variable}) = ${baseTex}$ y exponente $n = ${nTex}$. Derivamos la potencia exterior y multiplicamos por la derivada interna $g'(${variable})$.`,
          ruleLatex: `\\frac{d}{d${variable}}[g(${variable})^n] = n \\cdot [g(${variable})]^{n-1} \\cdot g'(${variable})`,
          expressionLatex: formatDerivativeStatement(`(${baseTex})^{${nTex}}`, variable),
          resultLatex: `${nTex} \\cdot (${baseTex})^{(${nTex} - 1)} \\cdot ${formatDerivativeStatement(baseTex, variable)}`,
        });

        const innerDeriv = deriveNode(base, variable, collector);
        const derived = parse(`(${exponent.toString()}) * ((${base.toString()}) ^ ((${exponent.toString()}) - 1)) * (${innerDeriv.derivedNode.toString()})`);
        return { derivedNode: derived, latexResult: toLatex(derived) };
      }

      // Exponential Rule: a^(g(x)) where base is constant (e.g. e^x or 2^x)
      if (!baseDepends && expDepends) {
        collector.rulesUsed.add('Regla exponencial');
        collector.counter++;
        const aTex = toLatex(base);
        const gTex = toLatex(exponent);
        const isEuler = isSymbolNode(base) && (base.name === 'e' || base.name === 'E');

        if (isEuler) {
          collector.steps.push({
            stepNumber: collector.counter,
            title: 'Regla de la función exponencial natural',
            ruleName: 'Derivada exponencial natural',
            description: `La función exponencial natural $e^{g(${variable})}$ se deriva como ella misma multiplicada por la derivada de su exponente $g'(${variable})$.`,
            ruleLatex: `\\frac{d}{d${variable}}[e^{g(${variable})}] = e^{g(${variable})} \\cdot g'(${variable})`,
            expressionLatex: formatDerivativeStatement(`e^{${gTex}}`, variable),
            resultLatex: `e^{${gTex}} \\cdot ${formatDerivativeStatement(gTex, variable)}`,
          });

          const innerDeriv = deriveNode(exponent, variable, collector);
          const derived = parse(`e^(${exponent.toString()}) * (${innerDeriv.derivedNode.toString()})`);
          return { derivedNode: derived, latexResult: toLatex(derived) };
        } else {
          collector.steps.push({
            stepNumber: collector.counter,
            title: 'Regla de la función exponencial general',
            ruleName: 'Derivada exponencial base a',
            description: `Para una base constante $a = ${aTex}$, la derivada es $a^u \\ln(a) \\cdot u'$.`,
            ruleLatex: `\\frac{d}{d${variable}}[a^{g(${variable})}] = a^{g(${variable})} \\cdot \\ln(a) \\cdot g'(${variable})`,
            expressionLatex: formatDerivativeStatement(`${aTex}^{${gTex}}`, variable),
            resultLatex: `${aTex}^{${gTex}} \\cdot \\ln(${aTex}) \\cdot ${formatDerivativeStatement(gTex, variable)}`,
          });

          const innerDeriv = deriveNode(exponent, variable, collector);
          const derived = parse(`(${base.toString()}^(${exponent.toString()})) * log(${base.toString()}) * (${innerDeriv.derivedNode.toString()})`);
          return { derivedNode: derived, latexResult: toLatex(derived) };
        }
      }
    }
  }

  // 5. Function Nodes (sin, cos, tan, exp, log, sqrt, etc.)
  if (isFunctionNode(node)) {
    const fnName = getFunctionName(node);
    const arg = node.args[0];
    const argTex = toLatex(arg);
    const argIsLinear = isSymbolNode(arg) && arg.name === variable;

    // Table of elementary function derivatives
    const functionsTable: Record<string, {
      title: string;
      ruleName: string;
      formula: string;
      outerDerivExpr: (uStr: string) => string;
      outerLatex: (uTex: string) => string;
    }> = {
      sin: {
        title: 'Derivada de la función seno',
        ruleName: 'Derivada trigonométrica: seno',
        formula: `\\frac{d}{d${variable}}[\\sin(u)] = \\cos(u) \\cdot u'`,
        outerDerivExpr: u => `cos(${u})`,
        outerLatex: u => `\\cos(${u})`,
      },
      cos: {
        title: 'Derivada de la función coseno',
        ruleName: 'Derivada trigonométrica: coseno',
        formula: `\\frac{d}{d${variable}}[\\cos(u)] = -\\sin(u) \\cdot u'`,
        outerDerivExpr: u => `-sin(${u})`,
        outerLatex: u => `-\\sin(${u})`,
      },
      tan: {
        title: 'Derivada de la función tangente',
        ruleName: 'Derivada trigonométrica: tangente',
        formula: `\\frac{d}{d${variable}}[\\tan(u)] = \\sec^2(u) \\cdot u'`,
        outerDerivExpr: u => `sec(${u})^2`,
        outerLatex: u => `\\sec^2(${u})`,
      },
      sec: {
        title: 'Derivada de la función secante',
        ruleName: 'Derivada trigonométrica: secante',
        formula: `\\frac{d}{d${variable}}[\\sec(u)] = \\sec(u)\\tan(u) \\cdot u'`,
        outerDerivExpr: u => `sec(${u}) * tan(${u})`,
        outerLatex: u => `\\sec(${u})\\tan(${u})`,
      },
      csc: {
        title: 'Derivada de la función cosecante',
        ruleName: 'Derivada trigonométrica: cosecante',
        formula: `\\frac{d}{d${variable}}[\\csc(u)] = -\\csc(u)\\cot(u) \\cdot u'`,
        outerDerivExpr: u => `-csc(${u}) * cot(${u})`,
        outerLatex: u => `-\\csc(${u})\\cot(${u})`,
      },
      cot: {
        title: 'Derivada de la función cotangente',
        ruleName: 'Derivada trigonométrica: cotangente',
        formula: `\\frac{d}{d${variable}}[\\cot(u)] = -\\csc^2(u) \\cdot u'`,
        outerDerivExpr: u => `-csc(${u})^2`,
        outerLatex: u => `-\\csc^2(${u})`,
      },
      exp: {
        title: 'Derivada de la función exponencial',
        ruleName: 'Derivada exponencial natural',
        formula: `\\frac{d}{d${variable}}[e^u] = e^u \\cdot u'`,
        outerDerivExpr: u => `exp(${u})`,
        outerLatex: u => `e^{${u}}`,
      },
      log: {
        title: 'Derivada del logaritmo natural',
        ruleName: 'Derivada logarítmica',
        formula: `\\frac{d}{d${variable}}[\\ln(u)] = \\frac{1}{u} \\cdot u'`,
        outerDerivExpr: u => `1 / (${u})`,
        outerLatex: u => `\\frac{1}{${u}}`,
      },
      ln: {
        title: 'Derivada del logaritmo natural',
        ruleName: 'Derivada logarítmica',
        formula: `\\frac{d}{d${variable}}[\\ln(u)] = \\frac{1}{u} \\cdot u'`,
        outerDerivExpr: u => `1 / (${u})`,
        outerLatex: u => `\\frac{1}{${u}}`,
      },
      sqrt: {
        title: 'Derivada de la raíz cuadrada',
        ruleName: 'Derivada de raíz cuadrada',
        formula: `\\frac{d}{d${variable}}[\\sqrt{u}] = \\frac{1}{2\\sqrt{u}} \\cdot u'`,
        outerDerivExpr: u => `1 / (2 * sqrt(${u}))`,
        outerLatex: u => `\\frac{1}{2\\sqrt{${u}}}`,
      },
      asin: {
        title: 'Derivada de arcoseno',
        ruleName: 'Derivada trigonométrica inversa',
        formula: `\\frac{d}{d${variable}}[\\arcsin(u)] = \\frac{1}{\\sqrt{1 - u^2}} \\cdot u'`,
        outerDerivExpr: u => `1 / sqrt(1 - (${u})^2)`,
        outerLatex: u => `\\frac{1}{\\sqrt{1 - (${u})^2}}`,
      },
      acos: {
        title: 'Derivada de arcocoseno',
        ruleName: 'Derivada trigonométrica inversa',
        formula: `\\frac{d}{d${variable}}[\\arccos(u)] = -\\frac{1}{\\sqrt{1 - u^2}} \\cdot u'`,
        outerDerivExpr: u => `-1 / sqrt(1 - (${u})^2)`,
        outerLatex: u => `-\\frac{1}{\\sqrt{1 - (${u})^2}}`,
      },
      atan: {
        title: 'Derivada de arcotangente',
        ruleName: 'Derivada trigonométrica inversa',
        formula: `\\frac{d}{d${variable}}[\\arctan(u)] = \\frac{1}{1 + u^2} \\cdot u'`,
        outerDerivExpr: u => `1 / (1 + (${u})^2)`,
        outerLatex: u => `\\frac{1}{1 + (${u})^2}`,
      },
    };

    const handler = functionsTable[fnName];
    if (handler) {
      collector.rulesUsed.add(handler.ruleName);
      collector.counter++;

      if (argIsLinear) {
        // Direct argument (e.g. sin(x))
        collector.steps.push({
          stepNumber: collector.counter,
          title: handler.title,
          ruleName: handler.ruleName,
          description: `Aplicamos directamente la derivada de la función elemental:`,
          ruleLatex: handler.formula,
          expressionLatex: formatDerivativeStatement(`${toLatex(node)}`, variable),
          resultLatex: handler.outerLatex(argTex),
        });

        const derived = parse(handler.outerDerivExpr(arg.toString()));
        return { derivedNode: derived, latexResult: toLatex(derived) };
      } else {
        // Chain rule needed!
        collector.rulesUsed.add('Regla de la cadena');
        collector.steps.push({
          stepNumber: collector.counter,
          title: `${handler.title} (Regla de la cadena)`,
          ruleName: 'Regla de la cadena',
          description: `Identificamos una función compuesta: el argumento interno es $u(${variable}) = ${argTex}$. Por la regla de la cadena: derivamos la función exterior evaluada en $u$ y multiplicamos por la derivada interna $u'(${variable})$.`,
          ruleLatex: handler.formula,
          substitutions: [
            { variable: 'u', expression: argTex },
          ],
          expressionLatex: formatDerivativeStatement(`${toLatex(node)}`, variable),
          resultLatex: `${handler.outerLatex(argTex)} \\cdot ${formatDerivativeStatement(argTex, variable)}`,
        });

        const innerDeriv = deriveNode(arg, variable, collector);
        const derived = parse(`(${handler.outerDerivExpr(arg.toString())}) * (${innerDeriv.derivedNode.toString()})`);
        return { derivedNode: derived, latexResult: toLatex(derived) };
      }
    }
  }

  // Fallback: mathjs derivative
  try {
    collector.counter++;
    const d = derivative(node, variable);
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Diferenciación algebraica',
      ruleName: 'Diferenciación simbólica',
      description: `Se calcula la derivada simbólica de la expresión:`,
      expressionLatex: formatDerivativeStatement(toLatex(node), variable),
      resultLatex: toLatex(d),
    });
    return { derivedNode: d, latexResult: toLatex(d) };
  } catch (err) {
    throw new Error(`No se pudo derivar la expresión simbólica: ${node.toString()}`);
  }
}

/**
 * Solves a derivative step-by-step
 */
export function solveDerivative(inputExpr: string, variable: string = 'x'): CalculusResult {
  try {
    const normalized = normalizeInputExpression(inputExpr);
    const rootNode = parse(normalized);
    const inputLatex = toLatex(rootNode);

    const collector: StepCollector = {
      steps: [],
      rulesUsed: new Set<string>(),
      counter: 0,
    };

    // Initial statement step
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Planteo del problema',
      ruleName: 'Definición de derivada',
      description: `Buscamos calcular la derivada de la función respecto a la variable $${variable}$:`,
      expressionLatex: formatDerivativeStatement(inputLatex, variable),
      resultLatex: formatDerivativeStatement(inputLatex, variable),
    });

    // Derive node recursively
    const { derivedNode } = deriveNode(rootNode, variable, collector, true);

    // Simplification step
    let simplifiedLatex = toLatex(derivedNode);
    try {
      const simplifiedNode = simplify(derivedNode);
      const simplTex = toLatex(simplifiedNode);
      if (simplTex && simplTex !== simplifiedLatex) {
        collector.counter++;
        collector.rulesUsed.add('Simplificación algebraica');
        collector.steps.push({
          stepNumber: collector.counter,
          title: 'Simplificación algebraica final',
          ruleName: 'Simplificación',
          description: `Simplificamos la expresión obtenida agrupando términos semejantes y reduciendo fracciones y potencias:`,
          expressionLatex: simplifiedLatex,
          resultLatex: simplTex,
        });
        simplifiedLatex = simplTex;
      }
    } catch {
      // Keep unsimplified if simplify throws on edge cases
    }

    return {
      operation: 'derivative',
      variable,
      inputExpression: inputExpr,
      inputLatex,
      finalResultLatex: cleanLatex(simplifiedLatex),
      appliedRules: Array.from(collector.rulesUsed),
      steps: collector.steps,
      success: true,
    };
  } catch (error: any) {
    return {
      operation: 'derivative',
      variable,
      inputExpression: inputExpr,
      inputLatex: inputExpr,
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: error?.message || 'Error al analizar la expresión matemática.',
    };
  }
}

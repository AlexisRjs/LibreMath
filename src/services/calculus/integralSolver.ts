import { parse, simplify, derivative, MathNode, isOperatorNode, isSymbolNode, isConstantNode, isFunctionNode, isParenthesisNode } from 'mathjs';
import { CalculusResult, CalculusStep } from '../../types/calculus';
import { normalizeInputExpression, toLatex, formatIntegralStatement, cleanLatex } from './latexUtils';

interface StepCollector {
  steps: CalculusStep[];
  rulesUsed: Set<string>;
  counter: number;
}

function getFunctionName(node: any): string {
  if (typeof node?.name === 'string') return node.name.toLowerCase();
  if (node?.fn && typeof node.fn.name === 'string') return node.fn.name.toLowerCase();
  return String(node?.name || node?.fn || '').toLowerCase();
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
 * Splits top-level additions and subtractions into terms with their signs
 */
function splitAdditions(node: MathNode): { term: MathNode; sign: '+' | '-' }[] {
  if (isParenthesisNode(node)) {
    return splitAdditions(node.content);
  }

  if (isOperatorNode(node) && (node.op === '+' || node.op === '-')) {
    if (node.isUnary() && node.op === '-') {
      const inner = splitAdditions(node.args[0]);
      return inner.map(t => ({ term: t.term, sign: t.sign === '+' ? '-' : '+' }));
    }

    const left = splitAdditions(node.args[0]);
    const right = splitAdditions(node.args[1]);
    const rightWithSign = right.map(t => ({
      term: t.term,
      sign: node.op === '+' ? t.sign : (t.sign === '+' ? '-' : '+') as '+' | '-',
    }));
    return [...left, ...rightWithSign];
  }

  return [{ term: node, sign: '+' }];
}

/**
 * Extracts a constant coefficient from a multiplicative term: c * f(x)
 */
function extractConstantFactor(node: MathNode, variable: string): { constantFactor: number; remainingNode: MathNode } {
  if (isParenthesisNode(node)) {
    return extractConstantFactor(node.content, variable);
  }

  if (isOperatorNode(node) && node.op === '*') {
    const left = node.args[0];
    const right = node.args[1];
    if (!dependsOnVariable(left, variable) && isConstantNode(left)) {
      const c = Number(left.value);
      const sub = extractConstantFactor(right, variable);
      return { constantFactor: c * sub.constantFactor, remainingNode: sub.remainingNode };
    }
    if (!dependsOnVariable(right, variable) && isConstantNode(right)) {
      const c = Number(right.value);
      const sub = extractConstantFactor(left, variable);
      return { constantFactor: c * sub.constantFactor, remainingNode: sub.remainingNode };
    }
  }

  if (isOperatorNode(node) && node.isUnary() && node.op === '-') {
    const sub = extractConstantFactor(node.args[0], variable);
    return { constantFactor: -1 * sub.constantFactor, remainingNode: sub.remainingNode };
  }

  return { constantFactor: 1, remainingNode: node };
}

/**
 * Solves an individual single-term integral
 */
function solveSingleTerm(
  rawNode: MathNode,
  variable: string,
  collector: StepCollector
): { latex: string; exprString: string } {
  const { constantFactor, remainingNode: node } = extractConstantFactor(rawNode, variable);
  const nodeTex = toLatex(node);

  // If there's a constant factor pulled out
  if (constantFactor !== 1 && constantFactor !== -1) {
    collector.rulesUsed.add('Propiedad de linealidad (factor constante)');
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Extracción de factor constante',
      ruleName: 'Linealidad',
      description: `Extraemos la constante $${constantFactor}$ fuera del signo de integración:`,
      ruleLatex: `\\int c \\cdot f(${variable}) \\, d${variable} = c \\int f(${variable}) \\, d${variable}`,
      expressionLatex: formatIntegralStatement(`${constantFactor} \\cdot ${nodeTex}`, variable),
      resultLatex: `${constantFactor} \\cdot ${formatIntegralStatement(nodeTex, variable)}`,
    });
  }

  // 1. Constant term (doesn't depend on variable)
  if (!dependsOnVariable(node, variable)) {
    collector.rulesUsed.add('Integral de una constante');
    collector.counter++;
    const cTex = toLatex(node);
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Integral de una constante',
      ruleName: 'Integral constante',
      description: `La integral de una constante $c$ respecto a $${variable}$ es $c \\cdot ${variable}$:`,
      ruleLatex: `\\int c \\, d${variable} = c \\cdot ${variable}`,
      expressionLatex: formatIntegralStatement(cTex, variable),
      resultLatex: `${cTex} \\cdot ${variable}`,
    });

    const cVal = isConstantNode(node) ? Number(node.value) * constantFactor : constantFactor;
    if (cVal === 1) return { latex: variable, exprString: variable };
    if (cVal === -1) return { latex: `-${variable}`, exprString: `-${variable}` };
    return { latex: `${cVal} ${variable}`, exprString: `${cVal}*${variable}` };
  }

  // 2. Identity variable (x)
  if (isSymbolNode(node) && node.name === variable) {
    collector.rulesUsed.add('Regla de la potencia');
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Integral de la variable lineal',
      ruleName: 'Regla de la potencia',
      description: `Aplicamos la regla de la potencia con $n = 1$: sumamos 1 al exponente y dividimos por el nuevo exponente $1 + 1 = 2$.`,
      ruleLatex: `\\int ${variable}^n \\, d${variable} = \\frac{${variable}^{n+1}}{n+1}`,
      expressionLatex: formatIntegralStatement(variable, variable),
      resultLatex: `\\frac{${variable}^2}{2}`,
    });

    if (constantFactor === 1) return { latex: `\\frac{${variable}^2}{2}`, exprString: `(${variable}^2)/2` };
    if (constantFactor % 2 === 0) {
      const reduced = constantFactor / 2;
      return { latex: `${reduced === 1 ? '' : reduced === -1 ? '-' : reduced}${variable}^2`, exprString: `${reduced}*${variable}^2` };
    }
    return { latex: `\\frac{${constantFactor}${variable}^2}{2}`, exprString: `(${constantFactor}*${variable}^2)/2` };
  }

  // 3. Power rule: x^n
  if (isOperatorNode(node) && node.op === '^') {
    const base = node.args[0];
    const exp = node.args[1];

    if (isSymbolNode(base) && base.name === variable && !dependsOnVariable(exp, variable) && isConstantNode(exp)) {
      const n = Number(exp.value);
      collector.rulesUsed.add('Regla de la potencia');
      collector.counter++;

      if (n === -1) {
        // 1/x -> ln|x|
        collector.steps.push({
          stepNumber: collector.counter,
          title: 'Integral de la potencia n = -1 (Logarítmica)',
          ruleName: 'Integral logarítmica',
          description: `Para $${variable}^{-1} = \\frac{1}{${variable}}$, la integral es el logaritmo natural del valor absoluto de $${variable}$:`,
          ruleLatex: `\\int \\frac{1}{${variable}} \\, d${variable} = \\ln|${variable}|`,
          expressionLatex: formatIntegralStatement(`\\frac{1}{${variable}}`, variable),
          resultLatex: `\\ln|${variable}|`,
        });

        const prefix = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
        return { latex: `${prefix}\\ln|${variable}|`, exprString: `${constantFactor}*log(${variable})` };
      }

      const newExp = n + 1;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Regla de la potencia para integrales',
        ruleName: 'Regla de la potencia',
        description: `Sumamos 1 al exponente ($${n} + 1 = ${newExp}$) y dividimos por el nuevo exponente:`,
        ruleLatex: `\\int ${variable}^n \\, d${variable} = \\frac{${variable}^{n+1}}{n+1}`,
        expressionLatex: formatIntegralStatement(`${variable}^{${n}}`, variable),
        resultLatex: `\\frac{${variable}^{${newExp}}}{${newExp}}`,
      });

      if (constantFactor % newExp === 0) {
        const coef = constantFactor / newExp;
        const coefTex = coef === 1 ? '' : coef === -1 ? '-' : `${coef}`;
        return { latex: `${coefTex}${variable}^{${newExp}}`, exprString: `${coef}*${variable}^${newExp}` };
      }
      return {
        latex: `\\frac{${constantFactor === 1 ? '' : constantFactor}${variable}^{${newExp}}}{${newExp}}`,
        exprString: `(${constantFactor}*${variable}^${newExp})/${newExp}`,
      };
    }
  }

  // 4. Division 1/x or 1/(a*x + b)
  if (isOperatorNode(node) && node.op === '/') {
    const num = node.args[0];
    const den = node.args[1];

    if (isConstantNode(num) && Number(num.value) === 1 && isSymbolNode(den) && den.name === variable) {
      collector.rulesUsed.add('Integral logarítmica');
      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integral inmediata de 1/x',
        ruleName: 'Integral logarítmica',
        description: `La integral de $\\frac{1}{${variable}}$ es el logaritmo natural del valor absoluto:`,
        ruleLatex: `\\int \\frac{1}{${variable}} \\, d${variable} = \\ln|${variable}|`,
        expressionLatex: formatIntegralStatement(`\\frac{1}{${variable}}`, variable),
        resultLatex: `\\ln|${variable}|`,
      });
      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}\\ln|${variable}|`, exprString: `${constantFactor}*log(${variable})` };
    }
  }

  // 5. Exponential function e^x or e^(k*x)
  if (
    (isFunctionNode(node) && (getFunctionName(node) === 'exp' || getFunctionName(node) === 'e')) ||
    (isOperatorNode(node) && node.op === '^' && isSymbolNode(node.args[0]) && (node.args[0].name === 'e' || node.args[0].name === 'E'))
  ) {
    const arg = isFunctionNode(node) ? node.args[0] : (node as any).args[1];
    collector.rulesUsed.add('Integral exponencial');
    collector.counter++;

    // e^x
    if (isSymbolNode(arg) && arg.name === variable) {
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integral de la función exponencial natural',
        ruleName: 'Integral exponencial',
        description: `La función exponencial natural es su propia antiderivada:`,
        ruleLatex: `\\int e^{${variable}} \\, d${variable} = e^{${variable}}`,
        expressionLatex: formatIntegralStatement(`e^{${variable}}`, variable),
        resultLatex: `e^{${variable}}`,
      });
      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}e^{${variable}}`, exprString: `${constantFactor}*exp(${variable})` };
    }

    // e^(k*x)
    if (isOperatorNode(arg) && arg.op === '*') {
      const k = isConstantNode(arg.args[0]) ? Number(arg.args[0].value) : 1;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integral de e^(k*x) por sustitución',
        ruleName: 'Integral exponencial con factor',
        description: `Aplicamos sustitución simple con $u = ${k}${variable} \\implies du = ${k} d${variable}$:`,
        ruleLatex: `\\int e^{k ${variable}} \\, d${variable} = \\frac{1}{k} e^{k ${variable}}`,
        substitutions: [
          { variable: 'u', expression: `${k}${variable}`, differential: `du = ${k} d${variable}` },
        ],
        expressionLatex: formatIntegralStatement(`e^{${k}${variable}}`, variable),
        resultLatex: `\\frac{e^{${k}${variable}}}{${k}}`,
      });
      return {
        latex: `\\frac{${constantFactor === 1 ? '' : constantFactor}e^{${k}${variable}}}{${k}}`,
        exprString: `(${constantFactor}*exp(${k}*${variable}))/${k}`,
      };
    }
  }

  // 6. Trigonometric elementary functions
  if (isFunctionNode(node)) {
    const fnName = getFunctionName(node);
    const arg = node.args[0];
    const isLinear = isSymbolNode(arg) && arg.name === variable;

    if (isLinear) {
      const trigTable: Record<string, { title: string; formula: string; resLatex: string; resExpr: string }> = {
        sin: {
          title: 'Integral de seno',
          formula: `\\int \\sin(${variable}) \\, d${variable} = -\\cos(${variable})`,
          resLatex: `-\\cos(${variable})`,
          resExpr: `-cos(${variable})`,
        },
        cos: {
          title: 'Integral de coseno',
          formula: `\\int \\cos(${variable}) \\, d${variable} = \\sin(${variable})`,
          resLatex: `\\sin(${variable})`,
          resExpr: `sin(${variable})`,
        },
        sec2: {
          title: 'Integral de secante al cuadrado',
          formula: `\\int \\sec^2(${variable}) \\, d${variable} = \\tan(${variable})`,
          resLatex: `\\tan(${variable})`,
          resExpr: `tan(${variable})`,
        },
      };

      const trig = trigTable[fnName];
      if (trig) {
        collector.rulesUsed.add(`Integral trigonométrica: ${fnName}`);
        collector.counter++;
        collector.steps.push({
          stepNumber: collector.counter,
          title: trig.title,
          ruleName: `Integral de ${fnName}`,
          description: `Aplicamos la integral inmediata de la tabla trigonométrica:`,
          ruleLatex: trig.formula,
          expressionLatex: formatIntegralStatement(`\\${fnName}(${variable})`, variable),
          resultLatex: trig.resLatex,
        });

        if (fnName === 'sin') {
          const sign = constantFactor * -1;
          const p = sign === 1 ? '' : sign === -1 ? '-' : `${sign} `;
          return { latex: `${p}\\cos(${variable})`, exprString: `${sign}*cos(${variable})` };
        } else {
          const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
          return { latex: `${p}\\sin(${variable})`, exprString: `${constantFactor}*sin(${variable})` };
        }
      }
    }
  }

  // 7. Integration by Parts: x * e^x, x * sin(x), x * cos(x), ln(x)
  if (isOperatorNode(node) && node.op === '*') {
    const left = node.args[0];
    const right = node.args[1];

    // Case: x * e^x
    if (
      (isSymbolNode(left) && left.name === variable) &&
      (isFunctionNode(right) && getFunctionName(right) === 'exp' && isSymbolNode(right.args[0]) && right.args[0].name === variable)
    ) {
      collector.rulesUsed.add('Integración por partes (LIATE)');
      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integración por partes (Estrategia LIATE)',
        ruleName: 'Integración por partes',
        description: `Tenemos un producto de una función algebraica ($${variable}$) por una función exponencial ($e^{${variable}}$). Siguiendo la regla LIATE, elegimos $u$ como la algebraica y $dv$ como la exponencial:`,
        ruleLatex: `\\int u \\, dv = u \\cdot v - \\int v \\, du`,
        substitutions: [
          { variable: 'u', expression: variable, differential: `du = d${variable}`, explanation: 'Derivada de u' },
          { variable: 'dv', expression: `e^{${variable}} \\, d${variable}`, differential: `v = e^{${variable}}`, explanation: 'Integral de dv' },
        ],
        expressionLatex: formatIntegralStatement(`${variable} e^{${variable}}`, variable),
        resultLatex: `${variable} e^{${variable}} - \\int e^{${variable}} \\, d${variable}`,
      });

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Resolución de la integral remanente',
        ruleName: 'Integral inmediata',
        description: `Resolvemos la integral restante $\\int e^{${variable}} \\, d${variable} = e^{${variable}}$ y agrupamos:`,
        expressionLatex: `${variable} e^{${variable}} - \\int e^{${variable}} \\, d${variable}`,
        resultLatex: `${variable} e^{${variable}} - e^{${variable}} = (${variable} - 1) e^{${variable}}`,
      });

      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}(${variable} - 1)e^{${variable}}`, exprString: `${constantFactor}*(${variable}-1)*exp(${variable})` };
    }

    // Case: x * cos(x)
    if (
      (isSymbolNode(left) && left.name === variable) &&
      (isFunctionNode(right) && getFunctionName(right) === 'cos' && isSymbolNode(right.args[0]) && right.args[0].name === variable)
    ) {
      collector.rulesUsed.add('Integración por partes (LIATE)');
      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integración por partes: x * cos(x)',
        ruleName: 'Integración por partes',
        description: `Elegimos $u = ${variable}$ (algebraica) y $dv = \\cos(${variable}) d${variable}$ (trigonométrica).`,
        ruleLatex: `\\int u \\, dv = u \\cdot v - \\int v \\, du`,
        substitutions: [
          { variable: 'u', expression: variable, differential: `du = d${variable}` },
          { variable: 'dv', expression: `\\cos(${variable}) d${variable}`, differential: `v = \\sin(${variable})` },
        ],
        expressionLatex: formatIntegralStatement(`${variable} \\cos(${variable})`, variable),
        resultLatex: `${variable} \\sin(${variable}) - \\int \\sin(${variable}) \\, d${variable}`,
      });

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Resolución de la integral de seno',
        ruleName: 'Integral trigonométrica',
        description: `Como $\\int \\sin(${variable}) d${variable} = -\\cos(${variable})$, el signo menos cambia a más:`,
        expressionLatex: `${variable} \\sin(${variable}) - (-\\cos(${variable}))`,
        resultLatex: `${variable} \\sin(${variable}) + \\cos(${variable})`,
      });

      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}(${variable}\\sin(${variable}) + \\cos(${variable}))`, exprString: `${constantFactor}*(${variable}*sin(${variable}) + cos(${variable}))` };
    }

    // Case: x * sin(x)
    if (
      (isSymbolNode(left) && left.name === variable) &&
      (isFunctionNode(right) && getFunctionName(right) === 'sin' && isSymbolNode(right.args[0]) && right.args[0].name === variable)
    ) {
      collector.rulesUsed.add('Integración por partes (LIATE)');
      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integración por partes: x * sin(x)',
        ruleName: 'Integración por partes',
        description: `Elegimos $u = ${variable}$ y $dv = \\sin(${variable}) d${variable} \\implies v = -\\cos(${variable})$.`,
        ruleLatex: `\\int u \\, dv = u \\cdot v - \\int v \\, du`,
        substitutions: [
          { variable: 'u', expression: variable, differential: `du = d${variable}` },
          { variable: 'dv', expression: `\\sin(${variable}) d${variable}`, differential: `v = -\\cos(${variable})` },
        ],
        expressionLatex: formatIntegralStatement(`${variable} \\sin(${variable})`, variable),
        resultLatex: `-${variable} \\cos(${variable}) - \\int (-\\cos(${variable})) \\, d${variable}`,
      });

      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Resolución de la integral restante',
        ruleName: 'Integral trigonométrica',
        description: `Resolvemos $\\int \\cos(${variable}) d${variable} = \\sin(${variable})$:`,
        expressionLatex: `-${variable} \\cos(${variable}) + \\int \\cos(${variable}) \\, d${variable}`,
        resultLatex: `-${variable} \\cos(${variable}) + \\sin(${variable})`,
      });

      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}(\\sin(${variable}) - ${variable}\\cos(${variable}))`, exprString: `${constantFactor}*(sin(${variable}) - ${variable}*cos(${variable}))` };
    }
  }

  // 8. Substitution pattern check: f(g(x)) * g'(x)
  // Let's check if the term is a product or power with composite argument
  if (isOperatorNode(node) && node.op === '*') {
    // Check if one factor is derivative of inner expression of the other
    const arg0 = node.args[0];
    const arg1 = node.args[1];

    // e.g. 2*x * (x^2 + 1)^n  or  x * exp(x^2)
    let innerCandidate: MathNode | null = null;
    let outerCandidate: MathNode | null = null;

    if (isOperatorNode(arg1) && arg1.op === '^') {
      innerCandidate = arg1.args[0];
      outerCandidate = arg1;
    } else if (isFunctionNode(arg1) && (getFunctionName(arg1) === 'exp' || getFunctionName(arg1) === 'sin' || getFunctionName(arg1) === 'cos')) {
      innerCandidate = arg1.args[0];
      outerCandidate = arg1;
    }

    if (innerCandidate && dependsOnVariable(innerCandidate, variable)) {
      try {
        const dInner = derivative(innerCandidate, variable);
        // If dInner matches or is a constant multiple of arg0
        const ratio = simplify(parse(`(${arg0.toString()}) / (${dInner.toString()})`));
        if (!dependsOnVariable(ratio, variable)) {
          const ratioNum = isConstantNode(ratio) ? Number(ratio.value) : 1;
          const uTex = toLatex(innerCandidate);
          const duTex = toLatex(dInner);

          collector.rulesUsed.add('Método de sustitución (u-sustitución)');
          collector.counter++;
          collector.steps.push({
            stepNumber: collector.counter,
            title: 'Cambio de variable (Método de sustitución)',
            ruleName: 'u-Sustitución',
            description: `Reconocemos en el integrando una función interior $u = ${uTex}$ cuya derivada es $du = ${duTex} d${variable}$.`,
            ruleLatex: `\\int f(g(${variable})) g'(${variable}) \\, d${variable} = \\int f(u) \\, du`,
            substitutions: [
              { variable: 'u', expression: uTex, explanation: 'Función interior elegida' },
              { variable: 'du', expression: `${duTex} \\, d${variable}`, explanation: 'Diferencial' },
            ],
            expressionLatex: formatIntegralStatement(toLatex(rawNode), variable),
            resultLatex: `\\int f(u) \\, du`,
          });

          // If power: u^n
          if (isOperatorNode(outerCandidate) && outerCandidate.op === '^') {
            const expVal = Number((outerCandidate.args[1] as any).value);
            const newExp = expVal + 1;
            const totalFactor = constantFactor * ratioNum;

            collector.counter++;
            collector.steps.push({
              stepNumber: collector.counter,
              title: 'Integración en términos de u',
              ruleName: 'Regla de la potencia en u',
              description: `Integramos la potencia respecto a $u$: $\\int u^{${expVal}} du = \\frac{u^{${newExp}}}{${newExp}}$. Luego reemplazamos $u = ${uTex}$:`,
              expressionLatex: `\\frac{u^{${newExp}}}{${newExp}}`,
              resultLatex: `\\frac{(${uTex})^{${newExp}}}{${newExp}}`,
            });

            if (totalFactor % newExp === 0) {
              const c = totalFactor / newExp;
              const cTex = c === 1 ? '' : c === -1 ? '-' : `${c}`;
              return { latex: `${cTex}(${uTex})^{${newExp}}`, exprString: `${c}*(${innerCandidate.toString()})^${newExp}` };
            }
            return {
              latex: `\\frac{${totalFactor === 1 ? '' : totalFactor}(${uTex})^{${newExp}}}{${newExp}}`,
              exprString: `(${totalFactor}*(${innerCandidate.toString()})^${newExp})/${newExp}`,
            };
          }

          // If exp(u)
          if (isFunctionNode(outerCandidate) && getFunctionName(outerCandidate) === 'exp') {
            const totalFactor = constantFactor * ratioNum;
            collector.counter++;
            collector.steps.push({
              stepNumber: collector.counter,
              title: 'Integración en términos de u',
              ruleName: 'Integral exponencial en u',
              description: `Integramos respecto a $u$: $\\int e^u du = e^u$. Reemplazamos $u = ${uTex}$:`,
              expressionLatex: `e^u`,
              resultLatex: `e^{${uTex}}`,
            });
            const p = totalFactor === 1 ? '' : totalFactor === -1 ? '-' : `${totalFactor} `;
            return { latex: `${p}e^{${uTex}}`, exprString: `${totalFactor}*exp(${innerCandidate.toString()})` };
          }
        }
      } catch {
        // Continue to fallback
      }
    }
  }

  // 9. Natural Logarithm: ln(x) -> x*ln(x) - x
  if (isFunctionNode(node) && (getFunctionName(node) === 'log' || getFunctionName(node) === 'ln')) {
    const arg = node.args[0];
    if (isSymbolNode(arg) && arg.name === variable) {
      collector.rulesUsed.add('Integración por partes');
      collector.counter++;
      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Integral de ln(x) por partes',
        ruleName: 'Integración por partes',
        description: `Para $\\int \\ln(${variable}) d${variable}$, tomamos $u = \\ln(${variable})$ y $dv = d${variable} \\implies du = \\frac{1}{${variable}} d${variable}$ y $v = ${variable}$:`,
        ruleLatex: `\\int \\ln(${variable}) \\, d${variable} = ${variable} \\ln(${variable}) - \\int ${variable} \\cdot \\frac{1}{${variable}} \\, d${variable} = ${variable} \\ln(${variable}) - ${variable}`,
        expressionLatex: formatIntegralStatement(`\\ln(${variable})`, variable),
        resultLatex: `${variable} \\ln(${variable}) - ${variable}`,
      });
      const p = constantFactor === 1 ? '' : constantFactor === -1 ? '-' : `${constantFactor} `;
      return { latex: `${p}(${variable} \\ln|${variable}| - ${variable})`, exprString: `${constantFactor}*(${variable}*log(${variable}) - ${variable})` };
    }
  }

  // Fallback for complex polynomials or direct terms
  collector.counter++;
  collector.rulesUsed.add('Cálculo analítico');
  collector.steps.push({
    stepNumber: collector.counter,
    title: 'Resolución de término polinómico/analítico',
    ruleName: 'Antiderivada directa',
    description: `Se calcula la antiderivada analítica del término $${nodeTex}$:`,
    expressionLatex: formatIntegralStatement(nodeTex, variable),
    resultLatex: `F(${variable})`,
  });

  return {
    latex: `${constantFactor === 1 ? '' : constantFactor + ' '}\\int ${nodeTex} \\, d${variable}`,
    exprString: node.toString(),
  };
}

/**
 * Solves an indefinite integral step-by-step
 */
export function solveIntegral(inputExpr: string, variable: string = 'x'): CalculusResult {
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
      title: 'Planteo de la integral indefinida',
      ruleName: 'Definición de antiderivada',
      description: `Buscamos la familia de funciones primitivas $F(${variable}) = \\int f(${variable}) \\, d${variable} + C$:`,
      expressionLatex: formatIntegralStatement(inputLatex, variable),
      resultLatex: formatIntegralStatement(inputLatex, variable),
    });

    // Decompose sum into individual terms (Linearity property)
    const terms = splitAdditions(rootNode);

    if (terms.length > 1) {
      collector.rulesUsed.add('Propiedad de linealidad (separación de términos)');
      collector.counter++;

      const separatedLatex = terms
        .map((t, idx) => {
          const tTex = toLatex(t.term);
          const signStr = idx === 0 ? (t.sign === '-' ? '-' : '') : ` ${t.sign} `;
          return `${signStr}\\int ${tTex} \\, d${variable}`;
        })
        .join('');

      collector.steps.push({
        stepNumber: collector.counter,
        title: 'Propiedad de linealidad de la integral',
        ruleName: 'Linealidad',
        description: `La integral de una suma o resta de funciones es igual a la suma o resta de sus integrales individuales. Separamos en ${terms.length} integrales más simples:`,
        ruleLatex: `\\int [f(${variable}) \\pm g(${variable})] \\, d${variable} = \\int f(${variable}) \\, d${variable} \\pm \\int g(${variable}) \\, d${variable}`,
        expressionLatex: formatIntegralStatement(inputLatex, variable),
        resultLatex: separatedLatex,
      });
    }

    // Solve each term
    const termResults: { latex: string; sign: '+' | '-' }[] = [];

    for (let i = 0; i < terms.length; i++) {
      const { term, sign } = terms[i];
      if (terms.length > 1) {
        collector.counter++;
        collector.steps.push({
          stepNumber: collector.counter,
          title: `Resolución del término ${i + 1} de ${terms.length}: $${toLatex(term)}$`,
          ruleName: 'Paso término a término',
          description: `Procedemos a integrar el término por separado:`,
          expressionLatex: formatIntegralStatement(toLatex(term), variable),
          resultLatex: '',
        });
      }

      const res = solveSingleTerm(term, variable, collector);
      termResults.push({ latex: res.latex, sign });
    }

    // Combine term results
    let combinedResultLatex = termResults
      .map((t, idx) => {
        if (idx === 0) {
          return t.sign === '-' ? `-${t.latex}` : t.latex;
        }
        return ` ${t.sign} ${t.latex}`;
      })
      .join('');

    // Add + C (constant of integration)
    collector.rulesUsed.add('Constante de integración (+ C)');
    collector.counter++;
    collector.steps.push({
      stepNumber: collector.counter,
      title: 'Constante arbitraria de integración (+ C)',
      ruleName: 'Constante de integración',
      description: `Por el Teorema Fundamental del Cálculo, cualquier constante real sumada tiene derivada cero, por lo que toda integral indefinida incluye una constante arbitraria $C \\in \\mathbb{R}$.`,
      expressionLatex: combinedResultLatex,
      resultLatex: `${combinedResultLatex} + C`,
    });

    const finalLatex = cleanLatex(`${combinedResultLatex} + C`);

    return {
      operation: 'integral',
      variable,
      inputExpression: inputExpr,
      inputLatex,
      finalResultLatex: finalLatex,
      appliedRules: Array.from(collector.rulesUsed),
      steps: collector.steps,
      success: true,
    };
  } catch (error: any) {
    return {
      operation: 'integral',
      variable,
      inputExpression: inputExpr,
      inputLatex: inputExpr,
      finalResultLatex: '',
      appliedRules: [],
      steps: [],
      success: false,
      error: error?.message || 'Error al calcular la integral paso a paso.',
    };
  }
}

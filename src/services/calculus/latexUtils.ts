import { parse, MathNode } from 'mathjs';

/**
 * Normalizes user mathematical input into clean mathjs-compatible syntax
 */
export function normalizeInputExpression(expr: string): string {
  let cleaned = expr.trim();

  // Replace unicode characters with standard symbols
  cleaned = cleaned.replace(/×/g, '*');
  cleaned = cleaned.replace(/÷/g, '/');
  cleaned = cleaned.replace(/−/g, '-');
  cleaned = cleaned.replace(/·/g, '*');
  cleaned = cleaned.replace(/π/g, 'pi');

  // Handle implicit multiplication like 2x -> 2*x, 3sin(x) -> 3*sin(x), (x+1)(x-2) -> (x+1)*(x-2)
  // But be careful not to break function names like ln, sin, cos, tan, exp, sqrt
  cleaned = cleaned.replace(/(\d+)\s*([a-zA-Z(])/g, '$1 * $2');
  cleaned = cleaned.replace(/(\))\s*(\()/g, '$1 * $2');
  cleaned = cleaned.replace(/(\))\s*([a-zA-Z\d])/g, '$1 * $2');

  // Replace ln(x) -> log(x) for mathjs if needed, or keep standard
  // mathjs recognizes log(x) as natural logarithm by default, and ln as well
  return cleaned;
}

/**
 * Converts a mathjs expression string or MathNode to clean LaTeX string
 */
export function toLatex(expr: string | MathNode): string {
  try {
    const node = typeof expr === 'string' ? parse(normalizeInputExpression(expr)) : expr;
    return node.toTex({
      parenthesis: 'auto',
      implicit: 'hide',
    });
  } catch (err) {
    if (typeof expr === 'string') {
      return expr;
    }
    return '';
  }
}

/**
 * Formats a derivative statement: \frac{d}{dx}\left[ expr \right]
 */
export function formatDerivativeStatement(exprLatex: string, variable: string = 'x'): string {
  return `\\frac{d}{d${variable}}\\left[ ${exprLatex} \\right]`;
}

/**
 * Formats an indefinite integral statement: \int expr \, dx
 */
export function formatIntegralStatement(exprLatex: string, variable: string = 'x'): string {
  return `\\int ${exprLatex} \\, d${variable}`;
}

/**
 * Cleans up double signs, unnecessary brackets or redundant zeros in LaTeX
 */
export function cleanLatex(latex: string): string {
  return latex
    .replace(/\+\s*-/g, '- ')
    .replace(/-\s*-/g, '+ ')
    .replace(/\s+/g, ' ')
    .trim();
}

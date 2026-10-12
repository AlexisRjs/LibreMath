/**
 * Suite de Validación: Problemas de Nivel Examen Final Universitario UTN
 * Materias: Análisis Matemático I y Análisis Matemático II (Multivariable y EDOs)
 */

import { solveDerivative } from '../src/services/calculus/derivativeSolver';
import { solveIntegral } from '../src/services/calculus/integralSolver';
import { solveVectorFunction } from '../src/services/calculus/vectorFunctionsSolver';
import { solveMultivariableDerivatives } from '../src/services/calculus/multivariableDerivativesSolver';
import { solveExtrema } from '../src/services/calculus/extremaSolver';
import { solveMultipleIntegral } from '../src/services/calculus/multipleIntegralsSolver';
import { solveLineIntegral } from '../src/services/calculus/lineIntegralsSolver';
import { solveSurfaceIntegral } from '../src/services/calculus/surfaceIntegralsSolver';
import { solveDifferentialEquation } from '../src/services/calculus/differentialEquationsSolver';

interface TestResult {
  unit: string;
  problemTitle: string;
  passed: boolean;
  appliedRules: string[];
  stepsCount: number;
  finalLatex: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Fallo de aserción: ${message}`);
  }
}

console.log('='.repeat(80));
console.log('EJECUTANDO VALIDACIÓN DE PROBLEMAS DE EXAMEN FINAL UTN (AM1 & AM2)');
console.log('='.repeat(80));

// --------------------------------------------------------------------------------
// 1. AM1: Derivada por Regla de la Cadena & Integral por Partes
// --------------------------------------------------------------------------------
try {
  console.log('\n[AM1] Ejercicio de Final UTN: Derivada compuesta e Integral por partes...');
  
  // 1.a Derivada de función compuesta sin(3x^2 + 1)
  const derivRes = solveDerivative('sin(3*x^2 + 1)', 'x');
  assert(derivRes.success, 'La derivada debe resolverse con éxito');
  assert(derivRes.appliedRules.includes('Regla de la cadena'), 'Debe aplicar Regla de la cadena');
  assert(derivRes.steps.length >= 4, 'Debe tener al menos 4 pasos analíticos');
  assert(derivRes.finalResultLatex.includes('\\cos'), 'El resultado debe incluir cos');

  // 1.b Integral por partes x * exp(x) (Estrategia LIATE)
  const integRes = solveIntegral('x * exp(x)', 'x');
  assert(integRes.success, 'La integral debe resolverse con éxito');
  assert(integRes.appliedRules.some(r => r.includes('partes') || r.includes('LIATE')), 'Debe aplicar Integración por partes');
  assert(integRes.finalResultLatex.includes('+ C'), 'Debe incluir la constante de integración + C');

  results.push({
    unit: 'AM1 (1 Variable)',
    problemTitle: 'Derivada d/dx[sin(3x^2+1)] e Integral por partes ∫ x*exp(x) dx',
    passed: true,
    appliedRules: [...derivRes.appliedRules, ...integRes.appliedRules],
    stepsCount: derivRes.steps.length + integRes.steps.length,
    finalLatex: `${derivRes.finalResultLatex}  |  ${integRes.finalResultLatex}`,
  });
  console.log('  ✓ AM1 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'AM1 (1 Variable)',
    problemTitle: 'Derivada compuesta e Integral por partes',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ AM1 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 2. U1: Funciones Vectoriales (Curva Hélice Cilíndrica espacial)
// --------------------------------------------------------------------------------
try {
  console.log('\n[U1] Ejercicio de Final UTN: Curva espacial r(t) = (cos(t), sin(t), t)...');
  const u1Res = solveVectorFunction({
    xt: 'cos(t)',
    yt: 'sin(t)',
    zt: 't',
    tVal: '0',
    operationType: 'tangent_unit',
  });

  assert(u1Res.success, 'U1 debe resolverse con éxito');
  assert(u1Res.appliedRules.includes('Derivación componente a componente'), 'Debe derivar componente a componente');
  assert(u1Res.appliedRules.some(r => r.includes('unitario') || r.includes('T(t)')), 'Debe normalizar vector tangente');
  assert(u1Res.steps.length >= 3, 'Debe incluir pasos detallados de velocidad y norma');

  results.push({
    unit: 'U1: Funciones Vectoriales',
    problemTitle: 'Vector Tangente Unitario T(t) y Rapidez para r(t) = (cos(t), sin(t), t)',
    passed: true,
    appliedRules: u1Res.appliedRules,
    stepsCount: u1Res.steps.length,
    finalLatex: u1Res.finalResultLatex,
  });
  console.log('  ✓ U1 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U1: Funciones Vectoriales',
    problemTitle: 'Vector Tangente Unitario y Rapidez',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U1 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 3. U2 & U3: Derivadas Parciales, Teorema de Schwarz, Gradiente y Plano Tangente
// --------------------------------------------------------------------------------
try {
  console.log('\n[U2 & U3] Ejercicio de Final UTN: f(x, y) = x^2 * y + sin(x*y)...');
  
  // 3.a Derivadas parciales y Schwarz
  const u2Partials = solveMultivariableDerivatives({
    expression: 'x^2 * y + sin(x*y)',
    operationType: 'partials',
  });
  assert(u2Partials.success, 'U2/U3 parciales debe resolverse con éxito');
  assert(u2Partials.appliedRules.some(r => r.includes('Schwarz') || r.includes('segundo orden')), 'Debe verificar Teorema de Schwarz');

  // 3.b Derivada direccional en P(1, 2) dirección v=(3, 4)
  const u2Dir = solveMultivariableDerivatives({
    expression: 'x^2 * y + 3*x',
    x0: '1',
    y0: '2',
    vx: '3',
    vy: '4',
    operationType: 'directional',
  });
  assert(u2Dir.success, 'Derivada direccional debe resolverse');
  assert(u2Dir.appliedRules.some(r => r.includes('unitario') || r.includes('Normalización')), 'Debe normalizar dirección');
  assert(u2Dir.appliedRules.some(r => r.includes('Direccional')), 'Debe aplicar teorema de derivada direccional');

  // 3.c Plano Tangente
  const u2Plane = solveMultivariableDerivatives({
    expression: 'x^2 + y^2',
    x0: '1',
    y0: '2',
    operationType: 'tangent_plane',
  });
  assert(u2Plane.success, 'Plano tangente debe resolverse');
  assert(u2Plane.appliedRules.some(r => r.includes('Plano Tangente')), 'Debe aplicar ecuación del plano tangente');

  results.push({
    unit: 'U2-U3: Derivadas Parciales',
    problemTitle: 'Derivadas de Schwarz, Derivada Direccional Du y Plano Tangente',
    passed: true,
    appliedRules: [...u2Partials.appliedRules, ...u2Dir.appliedRules, ...u2Plane.appliedRules],
    stepsCount: u2Partials.steps.length + u2Dir.steps.length + u2Plane.steps.length,
    finalLatex: u2Plane.finalResultLatex,
  });
  console.log('  ✓ U2 & U3 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U2-U3: Derivadas Parciales',
    problemTitle: 'Derivadas parciales, Schwarz y plano tangente',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U2 & U3 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 4. U4: Extremos Relativos, Matriz Hessiana y Clasificación
// --------------------------------------------------------------------------------
try {
  console.log('\n[U4] Ejercicio de Final UTN: Clasificar extremos de f(x, y) = x^3 - 3*x + y^2 - 4*y...');
  const u4Res = solveExtrema({
    expression: 'x^3 - 3*x + y^2 - 4*y',
    criticalPointsInput: '(1, 2), (-1, 2)',
    mode: 'hessian',
  });

  assert(u4Res.success, 'U4 debe resolverse con éxito');
  assert(u4Res.appliedRules.some(r => r.includes('Hessiana')), 'Debe construir la Matriz Hessiana');
  assert(u4Res.appliedRules.some(r => r.includes('Clasificación') || r.includes('Segunda Derivada')), 'Debe clasificar puntos críticos');
  assert(u4Res.finalResultLatex.includes('MÍNIMO') || u4Res.finalResultLatex.includes('PUNTO'), 'Debe emitir diagnóstico de extremo');

  results.push({
    unit: 'U4: Extremos y Hessiana',
    problemTitle: 'Matriz Hessiana y Clasificación de Puntos Críticos (P1(1, 2) y P2(-1, 2))',
    passed: true,
    appliedRules: u4Res.appliedRules,
    stepsCount: u4Res.steps.length,
    finalLatex: u4Res.finalResultLatex,
  });
  console.log('  ✓ U4 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U4: Extremos y Hessiana',
    problemTitle: 'Extremos relativos y matriz Hessiana',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U4 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 5. U5: Integrales Múltiples (Teorema de Fubini)
// --------------------------------------------------------------------------------
try {
  console.log('\n[U5] Ejercicio de Final UTN: ∬_R (x*y^2 + 2*x) dA en [0, 2] x [1, 3]...');
  const u5Res = solveMultipleIntegral({
    expression: 'x * y^2 + 2*x',
    xMin: '0',
    xMax: '2',
    yMin: '1',
    yMax: '3',
    coordinateSystem: 'cartesian',
  });

  assert(u5Res.success, 'U5 debe resolverse con éxito');
  assert(u5Res.appliedRules.some(r => r.includes('Fubini')), 'Debe aplicar Teorema de Fubini');
  assert(u5Res.appliedRules.some(r => r.includes('Barrow')), 'Debe aplicar Regla de Barrow');
  assert(u5Res.steps.length >= 4, 'Debe descomponer la integración interior y exterior');

  results.push({
    unit: 'U5: Integrales Múltiples',
    problemTitle: 'Integral Doble Iterada por Teorema de Fubini y Regla de Barrow',
    passed: true,
    appliedRules: u5Res.appliedRules,
    stepsCount: u5Res.steps.length,
    finalLatex: u5Res.finalResultLatex,
  });
  console.log('  ✓ U5 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U5: Integrales Múltiples',
    problemTitle: 'Integral doble iterada',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U5 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 6. U6: Integrales de Línea (Campo Conservativo y Teorema de Green)
// --------------------------------------------------------------------------------
try {
  console.log('\n[U6] Ejercicio de Final UTN: F(x, y) = (2xy + y^3, x^2 + 3xy^2)...');
  
  // 6.a Test de campo conservativo y potencial
  const u6Cons = solveLineIntegral({
    pExpr: '2*x*y + y^3',
    qExpr: 'x^2 + 3*x*y^2',
    mode: 'conservative_test',
  });
  assert(u6Cons.success, 'U6 debe resolverse con éxito');
  assert(u6Cons.appliedRules.some(r => r.includes('Conservativo') || r.includes('Poincaré')), 'Debe reconocer campo conservativo');
  assert(u6Cons.finalResultLatex.includes('ES CONSERVATIVO'), 'Debe validar que el campo es conservativo');

  // 6.b Teorema de Green
  const u6Green = solveLineIntegral({
    pExpr: '2*x*y + y^3',
    qExpr: 'x^2 + 3*x*y^2',
    mode: 'green_theorem',
  });
  assert(u6Green.success, 'Teorema de Green debe resolverse');
  assert(u6Green.appliedRules.some(r => r.includes('Green')), 'Debe aplicar Teorema de Green');

  results.push({
    unit: 'U6: Integrales de Línea',
    problemTitle: 'Test de Campo Conservativo (Poincaré), Función Potencial y Teorema de Green',
    passed: true,
    appliedRules: [...u6Cons.appliedRules, ...u6Green.appliedRules],
    stepsCount: u6Cons.steps.length + u6Green.steps.length,
    finalLatex: `${u6Cons.finalResultLatex}  |  ${u6Green.finalResultLatex}`,
  });
  console.log('  ✓ U6 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U6: Integrales de Línea',
    problemTitle: 'Campos conservativos y Teorema de Green',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U6 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 7. U7: Integrales de Superficie (Divergencia / Gauss y Rotacional / Stokes)
// --------------------------------------------------------------------------------
try {
  console.log('\n[U7] Ejercicio de Final UTN: F(x, y, z) = (x^2*z, y^2*x, z^2*y)...');
  
  // 7.a Teorema de la Divergencia de Gauss
  const u7Gauss = solveSurfaceIntegral({
    pExpr: 'x^2 * z',
    qExpr: 'y^2 * x',
    rExpr: 'z^2 * y',
    mode: 'divergence_gauss',
  });
  assert(u7Gauss.success, 'Teorema de Gauss debe resolverse con éxito');
  assert(u7Gauss.appliedRules.some(r => r.includes('Gauss')), 'Debe aplicar Teorema de Gauss');
  assert(u7Gauss.appliedRules.some(r => r.includes('Divergencia')), 'Debe calcular operador divergencia');

  // 7.b Teorema de Stokes
  const u7Stokes = solveSurfaceIntegral({
    pExpr: 'x^2 * z',
    qExpr: 'y^2 * x',
    rExpr: 'z^2 * y',
    mode: 'curl_stokes',
  });
  assert(u7Stokes.success, 'Teorema de Stokes debe resolverse con éxito');
  assert(u7Stokes.appliedRules.some(r => r.includes('Stokes')), 'Debe aplicar Teorema de Stokes');
  assert(u7Stokes.appliedRules.some(r => r.includes('Rotacional')), 'Debe calcular rotacional tridimensional');

  results.push({
    unit: 'U7: Integrales de Superficie',
    problemTitle: 'Operador Divergencia (Teorema de Gauss) y Rotacional (Teorema de Stokes)',
    passed: true,
    appliedRules: [...u7Gauss.appliedRules, ...u7Stokes.appliedRules],
    stepsCount: u7Gauss.steps.length + u7Stokes.steps.length,
    finalLatex: `${u7Gauss.finalResultLatex}  |  ${u7Stokes.finalResultLatex}`,
  });
  console.log('  ✓ U7 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U7: Integrales de Superficie',
    problemTitle: 'Teoremas de Gauss y Stokes',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U7 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// 8. U8: Ecuaciones Diferenciales Ordinarias (Lineal 1er orden & 2do orden homogénea)
// --------------------------------------------------------------------------------
try {
  console.log('\n[U8] Ejercicio de Final UTN: EDOs lineales de 1er y 2do orden...');

  // 8.a Lineal de 1er orden: y' + 2y = exp(x)
  const u8Lin = solveDifferentialEquation({
    odeType: 'linear_first_order',
    px: '2',
    qx: 'exp(x)',
  });
  assert(u8Lin.success, 'EDO 1er orden debe resolverse');
  assert(u8Lin.appliedRules.some(r => r.includes('Factor Integrante')), 'Debe calcular factor integrante');
  assert(u8Lin.finalResultLatex.includes('\\mu') || u8Lin.finalResultLatex.includes('e^{-') || u8Lin.finalResultLatex.includes('C'), 'Debe incluir solución general con C');

  // 8.b Lineal de 2do orden homogénea: y'' - 5y' + 6y = 0
  const u8Second = solveDifferentialEquation({
    odeType: 'second_order_homogeneous',
    aCoeff: '1',
    bCoeff: '-5',
    cCoeff: '6',
  });
  assert(u8Second.success, 'EDO 2do orden debe resolverse');
  assert(u8Second.appliedRules.some(r => r.includes('Característica')), 'Debe formular la ecuación característica');
  assert(u8Second.appliedRules.some(r => r.includes('Discriminante') || r.includes('Delta')), 'Debe analizar discriminante');
  assert(u8Second.finalResultLatex.includes('C_1') && u8Second.finalResultLatex.includes('C_2'), 'Debe tener combinación lineal de dos soluciones independientes C1 y C2');

  results.push({
    unit: 'U8: Ecuaciones Diferenciales',
    problemTitle: 'EDO 1er orden por Factor Integrante mu(x) y EDO 2do orden homogénea (r1=3, r2=2)',
    passed: true,
    appliedRules: [...u8Lin.appliedRules, ...u8Second.appliedRules],
    stepsCount: u8Lin.steps.length + u8Second.steps.length,
    finalLatex: `${u8Lin.finalResultLatex}  |  ${u8Second.finalResultLatex}`,
  });
  console.log('  ✓ U8 Superado exitosamente');
} catch (err: any) {
  results.push({
    unit: 'U8: Ecuaciones Diferenciales',
    problemTitle: 'EDOs de primer y segundo orden',
    passed: false,
    appliedRules: [],
    stepsCount: 0,
    finalLatex: '',
    error: err.message,
  });
  console.error('  ✗ U8 Falló:', err.message);
}

// --------------------------------------------------------------------------------
// Reporte Resumen Final
// --------------------------------------------------------------------------------
console.log('\n' + '='.repeat(80));
console.log('RESUMEN DE RESULTADOS DE PRUEBAS DE EXAMEN FINAL UTN');
console.log('='.repeat(80));

let totalPassed = 0;
for (const r of results) {
  if (r.passed) {
    totalPassed++;
    console.log(`[PASS] ${r.unit.padEnd(28)} | Pasos: ${String(r.stepsCount).padStart(2)} | Reglas: ${r.appliedRules.length} aplicadas`);
  } else {
    console.log(`[FAIL] ${r.unit.padEnd(28)} | Error: ${r.error}`);
  }
}

console.log('='.repeat(80));
console.log(`TOTAL: ${totalPassed} de ${results.length} unidades aprobadas con éxito (${((totalPassed / results.length) * 100).toFixed(0)}%)`);
console.log('='.repeat(80));

if (totalPassed !== results.length) {
  process.exit(1);
} else {
  console.log('TODAS LAS PRUEBAS DE NIVEL EXAMEN FINAL UTN FUERON VALIDADAS EXITOSAMENTE.');
}

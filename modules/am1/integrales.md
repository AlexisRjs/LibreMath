---
title: "Cálculo Integral, Barrow, Aplicaciones Geométricas, Impropias y Series"
unit: "Tema 3: Cálculo Integral, Teoremas Fundamentales y Aplicaciones"
order: 3
tags:
  - "am1"
  - "integrales"
  - "barrow"
  - "leibniz"
  - "volumenes"
  - "longitud-arco"
  - "impropia"
  - "series"
  - "weierstrass"
description: "Métodos avanzados de integración, sustitución de Weierstrass, Teorema Fundamental del Cálculo, cálculo de áreas, volúmenes de revolución, longitud de arco, integrales impropias y series numéricas."
variables:
  - symbol: 'F(x) = \int f(x) \, dx'
    name: 'Primitiva o antiderivada general'
    description: 'Familia de funciones cuya derivada coincide idénticamente con el integrando f(x)'
  - symbol: 'V'
    name: 'Volumen del sólido de revolución'
    unit: 'm³'
    description: 'Generado al rotar una región plana alrededor de un eje cartesiano'
  - symbol: 'L'
    name: 'Longitud de arco de la curva rectificable'
    unit: 'm'
    description: 'Medida rectilínea de la trayectoria curva entre dos abscisas'
formulas:
  - id: 'tabla-integrales-inmediatas-basicas-upl'
    name: 'Tabla de Integrales: Inmediatas, Potencias y Exponenciales'
    latex: '\int dx = x + C, \quad \int x^n dx = \frac{x^{n+1}}{n+1} + C, \quad \int \frac{1}{x} dx = \ln|x| + C, \quad \int e^x dx = e^x + C, \quad \int a^x dx = \frac{a^x}{\ln a} + C'
    description: 'Antiderivadas inmediatas de la constante, potencias, racional y funciones exponenciales según el Formulario UPL.'
    tags: ["integrales", "tabla", "inmediatas", "potencias", "exponencial", "upl"]
  - id: 'tabla-integrales-trigonometricas-upl'
    name: 'Tabla de Integrales: Trigonométricas Directas'
    latex: '\int \sin x dx = -\cos x + C, \quad \int \cos x dx = \sin x + C, \quad \int \sec^2 x dx = \tan x + C, \quad \int \csc^2 x dx = -\cot x + C, \quad \int \sec x \tan x dx = \sec x + C, \quad \int \csc x \cot x dx = -\csc x + C'
    description: 'Integrales inmediatas de funciones trigonométricas directas del Formulario UPL.'
    tags: ["integrales", "tabla", "trigonometria", "upl"]
  - id: 'tabla-integrales-inversas-hiperbolicas-upl'
    name: 'Tabla de Integrales: Hiperbólicas, Inversas e Inversas Hiperbólicas'
    latex: '\int \sinh x dx = \cosh x + C, \quad \int \cosh x dx = \sinh x + C, \quad \int \frac{dx}{1+x^2} = \arctan x + C, \quad \int \frac{dx}{\sqrt{1-x^2}} = \arcsin x + C, \quad \int \frac{dx}{1-x^2} = \text{Argtanh } x + C, \quad \int \frac{dx}{\sqrt{1+x^2}} = \text{Argsinh } x + C, \quad \int \frac{dx}{\sqrt{x^2-1}} = \text{Argcosh } x + C'
    description: 'Integrales con formas cuadráticas que dan lugar a funciones inversas trigonométricas e hiperbólicas del Formulario UPL.'
    tags: ["integrales", "tabla", "inversas", "hiperbolicas", "argtanh", "upl"]
  - id: 'regla-leibniz-derivada-integral'
    name: 'Regla de Leibniz para Derivación de Integrales Variables'
    latex: '\frac{d}{dx} \left[ \int_{u(x)}^{v(x)} f(t) \, dt \right] = f(v(x)) \cdot v''(x) - f(u(x)) \cdot u''(x)'
    description: 'Primer Teorema Fundamental del Cálculo extendido con límites de integración dependientes de x.'
    tags: ["leibniz", "tfc", "derivada-integral"]
  - id: 'regla-barrow-integral-definida'
    name: 'Segundo Teorema Fundamental del Cálculo (Regla de Barrow)'
    latex: '\int_{a}^{b} f(x) \, dx = F(b) - F(a) = \left. F(x) \right|_{a}^{b} \quad [F''(x) = f(x)]'
    description: 'Conecta de forma directa el cálculo diferencial con el cálculo de áreas acotadas.'
    tags: ["barrow", "integral-definida", "tfc"]
  - id: 'volumen-revolucion-discos-tubos'
    name: 'Volúmenes de Sólidos de Revolución (Discos y Capas)'
    latex: 'V_x = \pi \int_{a}^{b} [f(x)]^2 \, dx, \qquad V_y = 2\pi \int_{a}^{b} x \cdot f(x) \, dx'
    description: 'Método de discos transversales y método de cascarones o capas cilíndricas.'
    tags: ["volumen", "revolucion", "discos", "cilindricas"]
  - id: 'sustitucion-weierstrass-universal'
    name: 'Sustitución Universal de Weierstrass'
    latex: 't = \tan\left(\frac{x}{2}\right) \implies \sin(x) = \frac{2t}{1+t^2}, \quad \cos(x) = \frac{1-t^2}{1+t^2}, \quad dx = \frac{2}{1+t^2} dt'
    description: 'Racionaliza cualquier función trigonométrica racional en una función puramente algebraica en t.'
    tags: ["weierstrass", "trigonometria", "sustitucion"]
---

# Cálculo Integral y Tablas de Antiderivadas

El cálculo integral abarca desde las antiderivadas inmediatas y técnicas analíticas avanzadas hasta la resolución de áreas, volúmenes de revolución y series.

---

## 1. Tabla Oficial de Integrales Inmediatas (Formulario UPL)

A continuación se detalla la tabla completa del **Formulario Oficial UPL**:

| Integral Indefinida | Antiderivada / Primitiva | Condición / Observación |
|---|---|---|
| $\int dx = \int 1 \, dx$ | $x + C$ | Constante unitaria |
| $\int x^n \, dx$ | $\frac{x^{n+1}}{n+1} + C$ | Potencia real ($n \neq -1$) |
| $\int \frac{1}{x} \, dx$ | $\ln\|x\| + C$ | Caso potencia $n = -1$ |
| $\int e^x \, dx$ | $e^x + C$ | Exponencial natural |
| $\int \sin x \, dx$ | $-\cos x + C$ | Seno |
| $\int \cos x \, dx$ | $\sin x + C$ | Coseno |
| $\int a^x \, dx$ | $\frac{a^x}{\ln a} + C$ | Exponencial base $a > 0, \; a \neq 1$ |
| $\int \sinh x \, dx$ | $\cosh x + C$ | Seno hiperbólico |
| $\int \cosh x \, dx$ | $\sinh x + C$ | Coseno hiperbólico |
| $\int \sec^2 x \, dx$ | $\tan x + C$ | Cuadrado de secante |
| $\int \csc^2 x \, dx$ | $-\cot x + C$ | Cuadrado de cosecante |
| $\int \sec x \cdot \tan x \, dx$ | $\sec x + C$ | Producto secante por tangente |
| $\int \csc x \cdot \cot x \, dx$ | $-\csc x + C$ | Producto cosecante por cotangente |
| $\int \frac{1}{1 + x^2} \, dx$ | $\arctan x + C$ | Racional cuadrática reducible |
| $\int \frac{1}{\sqrt{1 - x^2}} \, dx$ | $\arcsin x + C$ | Radical cuadrático inverso ($-1 < x < 1$) |
| $\int \frac{1}{1 - x^2} \, dx$ | $\text{Argtanh } x + C$ | Argumento tangente hiperbólica ($\|x\| < 1$) |
| $\int \frac{1}{\sqrt{1 + x^2}} \, dx$ | $\text{Argsinh } x + C$ | Argumento seno hiperbólico |
| $\int \frac{1}{\sqrt{x^2 - 1}} \, dx$ | $\text{Argcosh } x + C$ | Argumento coseno hiperbólico ($x > 1$) |

---

## 2. Técnicas Analíticas de Integración

1. **Integración por Partes:** $\int u \, dv = u \cdot v - \int v \, du$.
2. **Fracciones Simples (Factores lineales y cuadráticos irreducibles):**
   $$\frac{P(x)}{Q(x)} = \frac{A_1}{x - a} + \frac{A_2}{(x - a)^2} + \frac{B x + C}{x^2 + p x + q}$$
3. **Sustitución Trigonométrica:**
   - Para $\sqrt{a^2 - x^2}$: sustituir $x = a \sin\theta$.
   - Para $\sqrt{a^2 + x^2}$: sustituir $x = a \tan\theta$.
   - Para $\sqrt{x^2 - a^2}$: sustituir $x = a \sec\theta$.

---

## 2. Integrales Impropias

- **Primera Especie (Límites infinitos):** $\int_a^\infty f(x) dx = \lim_{b \to \infty} \int_a^b f(x) dx$.
- **Segunda Especie (Asíntotas verticales en el intervalo):** $\int_a^b \frac{dx}{(x-a)^p}$ converge si y sólo si $p < 1$.

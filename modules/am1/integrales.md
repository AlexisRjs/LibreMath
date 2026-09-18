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
  - id: 'longitud-arco-curva-plana'
    name: 'Longitud de Arco de una Curva Rectificable'
    latex: 'L = \int_{a}^{b} \sqrt{1 + \left[f''(x)\right]^2} \, dx = \int_{t_1}^{t_2} \sqrt{[x''(t)]^2 + [y''(t)]^2} \, dt'
    description: 'Elemento diferencial de arco ds integrado a lo largo del intervalo analítico.'
    tags: ["longitud-arco", "curva", "rectificable"]
  - id: 'sustitucion-weierstrass-universal'
    name: 'Sustitución Universal de Weierstrass'
    latex: 't = \tan\left(\frac{x}{2}\right) \implies \sin(x) = \frac{2t}{1+t^2}, \quad \cos(x) = \frac{1-t^2}{1+t^2}, \quad dx = \frac{2}{1+t^2} dt'
    description: 'Racionaliza cualquier función trigonométrica racional en una función puramente algebraica en t.'
    tags: ["weierstrass", "trigonometria", "sustitucion"]
  - id: 'criterio-raabe-series'
    name: 'Criterio de Raabe para Series Numéricas (Caso D''Alembert L = 1)'
    latex: 'L = \lim_{n \to \infty} n \left( 1 - \frac{a_{n+1}}{a_n} \right) \implies \begin{cases} L > 1 & \text{Converge} \\ L < 1 & \text{Diverge} \\ L = 1 & \text{Duda} \end{cases}'
    description: 'Discrimina con alta precisión la convergencia cuando el cociente de D''Alembert arroja 1.'
    tags: ["raabe", "series", "convergencia"]
---

# Cálculo Integral, Aplicaciones y Convergencia

El cálculo integral abarca desde las técnicas analíticas para resolver antiderivadas hasta la resolución geométrica de áreas, volúmenes y el análisis riguroso de convergencia en integrales impropias y series.

---

## 1. Técnicas Maestras de Integración

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

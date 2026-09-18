---
title: "Cálculo Diferencial, Teoremas del Valor Medio, Taylor y Estudio de Funciones"
unit: "Tema 2: Cálculo Diferencial, Teoremas del Valor Medio y Estudio de Funciones"
order: 2
tags:
  - "am1"
  - "derivadas"
  - "rolle"
  - "lagrange"
  - "cauchy"
  - "lhopital"
  - "taylor"
  - "concavidad"
  - "inflexion"
description: "Derivabilidad, reglas analíticas, teoremas de Rolle, Lagrange y Cauchy, Regla de L'Hôpital, desarrollo en serie de Taylor con Resto de Lagrange y estudio gráfico completo de curvas."
variables:
  - symbol: 'f''(x_0)'
    name: 'Derivada en el punto'
    description: 'Pendiente de la recta tangente a la curva en el punto (x_0, f(x_0))'
  - symbol: 'R_n(x)'
    name: 'Término de Resto de Lagrange'
    description: 'Error analítico exacto de la aproximación polinómica de orden n'
  - symbol: '\rho(x)'
    name: 'Radio de curvatura de la curva plana'
    unit: 'm'
    description: 'Radio del círculo osculador que mejor se aproxima a la curva localmente'
formulas:
  - id: 'definicion-derivada-incremental'
    name: 'Definición Rigurosa de Derivada'
    latex: 'f''(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h} = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}'
    description: 'Tasa de variación instantánea e inclinación geométrica de la recta tangente.'
    tags: ["derivada", "limite", "cociente-incremental"]
  - id: 'rectas-tangente-normal'
    name: 'Ecuaciones de Recta Tangente y Normal'
    latex: 'y - y_0 = f''(x_0)(x - x_0), \qquad y - y_0 = -\frac{1}{f''(x_0)}(x - x_0) \quad [f''(x_0) \neq 0]'
    description: 'Aproximación lineal de primer orden y su ortogonal en el punto de contacto.'
    tags: ["recta-tangente", "recta-normal", "geometria"]
  - id: 'teorema-valor-medio-lagrange'
    name: 'Teorema del Valor Medio de Lagrange'
    latex: 'f \in C[a, b] \land f \in D(a, b) \implies \exists c \in (a, b) : f''(c) = \frac{f(b) - f(a)}{b - a}'
    description: 'Existe al menos un punto donde la recta tangente es paralela a la recta secante que une los extremos.'
    tags: ["lagrange", "teorema", "valor-medio"]
  - id: 'teorema-cauchy-generalizado'
    name: 'Teorema del Valor Medio de Cauchy'
    latex: '\frac{f''(c)}{g''(c)} = \frac{f(b) - f(a)}{g(b) - g(a)} \quad \text{con } g''(c) \neq 0, \; g(b) \neq g(a)'
    description: 'Generalización fundamental del teorema de Lagrange empleada para demostrar la Regla de L''Hôpital.'
    tags: ["cauchy", "valor-medio", "lhopital"]
  - id: 'formula-taylor-resto-lagrange'
    name: 'Fórmula de Taylor con Resto de Lagrange'
    latex: 'f(x) = \sum_{k=0}^n \frac{f^{(k)}(x_0)}{k!}(x - x_0)^k + \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - x_0)^{n+1} \quad (\xi \text{ entre } x_0 \text{ y } x)'
    description: 'Aproximación polinómica de orden n con cota exacta del error residual.'
    tags: ["taylor", "polinomio", "resto-lagrange", "error"]
  - id: 'radio-curvatura-curva'
    name: 'Curvatura y Radio de Curvatura'
    latex: '\kappa(x) = \frac{|f''''(x)|}{\left[1 + (f''(x))^2\right]^{3/2}}, \qquad \rho(x) = \frac{1}{\kappa(x)}'
    description: 'Mide la rapidez con que cambia la dirección de la recta tangente por unidad de arco.'
    tags: ["curvatura", "radio-curvatura", "geometria-diferencial"]
---

# Cálculo Diferencial y Estudio de Funciones

La derivada es la herramienta analítica por excelencia para modelar razones de cambio instantáneas, optimizar variables de diseño en ingeniería y realizar el trazado cualitativo y cuantitativo de curvas.

---

## 1. Teoremas Fundamentales del Cálculo Diferencial

1. **Teorema de Rolle:** Si $f \in C[a, b]$, es derivable en $(a, b)$ y $f(a) = f(b)$, existe al menos un $c \in (a, b)$ tal que $f'(c) = 0$.
2. **Teorema de Lagrange:** Si $f \in C[a, b]$ y derivable en $(a, b)$, existe $c \in (a, b)$ con $f'(c) = \frac{f(b)-f(a)}{b-a}$.
3. **Regla de L'Hôpital:** Para formas indeterminadas del tipo $[\frac{0}{0}]$ o $[\frac{\infty}{\infty}]$:
   $$\lim_{x \to x_0} \frac{f(x)}{g(x)} = \lim_{x \to x_0} \frac{f'(x)}{g'(x)}$$
   (siempre que exista el límite del cociente de derivadas).

---

## 2. Metodología para el Estudio Completo de Funciones

Para analizar exhaustivamente una función $y = f(x)$:
1. **Dominio:** Determinar el subconjunto de $\mathbb{R}$ donde $f(x)$ está definida.
2. **Simetrías:** Paridad ($f(-x) = f(x)$ simétrica respecto a $Y$) o imparidad ($f(-x) = -f(x)$ simétrica respecto al origen).
3. **Puntos de Intersección:** Con el eje $Y$ ($f(0)$) y con el eje $X$ ($f(x) = 0$, raíces).
4. **Asíntotas:** Determinar verticales, horizontales y oblicuas.
5. **Primera Derivada $f'(x)$:**
   - Puntos críticos: $f'(x) = 0$ o no existe.
   - Criterio de monotonía: $f'(x) > 0$ (creciente), $f'(x) < 0$ (decreciente).
   - Clasificación de extremos relativos (máximos y mínimos locales).
6. **Segunda Derivada $f''(x)$:**
   - Puntos de inflexión candidatos: $f''(x) = 0$.
   - Concavidad: $f''(x) > 0$ (cóncava hacia arriba / convexa), $f''(x) < 0$ (cóncava hacia abajo).

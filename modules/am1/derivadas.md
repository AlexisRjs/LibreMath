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
  - id: 'reglas-derivacion-upl'
    name: 'Reglas de la Derivación (Producto, Cociente y Cadena)'
    latex: '(f \cdot g)'' = f''g + fg'', \qquad \left(\frac{f}{g}\right)'' = \frac{f''g - fg''}{g^2}, \qquad [f(g(x))]'' = f''(g(x)) \cdot g''(x)'
    description: 'Álgebra de derivadas y regla de la cadena para funciones compuestas según el Formulario UPL.'
    tags: ["derivadas", "reglas", "producto", "cociente", "cadena", "upl"]
  - id: 'tabla-derivadas-algebraicas-upl'
    name: 'Tabla de Derivadas: Algebraicas, Logarítmicas y Exponenciales'
    latex: '(k)'' = 0, \quad (x)'' = 1, \quad (cx)'' = c, \quad (x^n)'' = n x^{n-1}, \quad (\ln x)'' = \frac{1}{x}, \quad (e^x)'' = e^x, \quad (\log_a x)'' = \frac{1}{x \ln a}, \quad (a^x)'' = a^x \ln a'
    description: 'Derivadas de funciones potenciales, logarítmicas y exponenciales del Formulario UPL.'
    tags: ["derivadas", "tabla", "algebraicas", "logaritmos", "exponencial", "upl"]
  - id: 'tabla-derivadas-trigonometricas-upl'
    name: 'Tabla de Derivadas: Trigonométricas Directas'
    latex: '(\sin x)'' = \cos x, \quad (\cos x)'' = -\sin x, \quad (\tan x)'' = \sec^2 x, \quad (\cot x)'' = -\csc^2 x, \quad (\sec x)'' = \sec x \tan x, \quad (\csc x)'' = -\csc x \cot x'
    description: 'Derivadas de las 6 razones trigonométricas directas del Formulario UPL.'
    tags: ["derivadas", "tabla", "trigonometria", "upl"]
  - id: 'tabla-derivadas-inversas-hiperbolicas-upl'
    name: 'Tabla de Derivadas: Inversas Trigonométricas e Hiperbólicas'
    latex: '(\arctan x)'' = \frac{1}{1+x^2}, \quad (\arcsin x)'' = \frac{1}{\sqrt{1-x^2}}, \quad (\arccos x)'' = -\frac{1}{\sqrt{1-x^2}}, \quad (\sinh x)'' = \cosh x, \quad (\cosh x)'' = \sinh x'
    description: 'Derivadas de arco tangente, arco seno, arco coseno y funciones hiperbólicas del Formulario UPL.'
    tags: ["derivadas", "tabla", "inversas", "hiperbolicas", "upl"]
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
  - id: 'formula-taylor-resto-lagrange'
    name: 'Fórmula de Taylor con Resto de Lagrange'
    latex: 'f(x) = \sum_{k=0}^n \frac{f^{(k)}(x_0)}{k!}(x - x_0)^k + \frac{f^{(n+1)}(\xi)}{(n+1)!}(x - x_0)^{n+1} \quad (\xi \text{ entre } x_0 \text{ y } x)'
    description: 'Aproximación polinómica de orden n con cota exacta del error residual.'
    tags: ["taylor", "polinomio", "resto-lagrange", "error"]
---

# Cálculo Diferencial y Reglas de Derivación

La derivada es la herramienta analítica por excelencia para modelar razones de cambio instantáneas, optimizar variables de diseño en ingeniería y realizar el trazado cualitativo y cuantitativo de curvas.

---

## 1. Reglas de la Derivación (Formulario UPL)

Sean $f(x)$ y $g(x)$ funciones derivables:

### 1. Derivada de un Producto
$$y = f(x) \cdot g(x) \implies y' = f'(x) \cdot g(x) + f(x) \cdot g'(x)$$

### 2. Derivada de un Cociente
$$y = \frac{f(x)}{g(x)} \implies y' = \frac{f'(x) \cdot g(x) - f(x) \cdot g'(x)}{g^2(x)} \quad [g(x) \neq 0]$$

### 3. Regla de la Cadena (Función Compuesta)
$$h(x) = f(g(x)) \implies h'(x) = f'(g(x)) \cdot g'(x)$$

---

## 2. Tabla Oficial de Derivadas (Formulario UPL)

| Función $f(x)$ | Derivada $f'(x)$ | Tipo / Observación |
|---|---|---|
| $f(x) = k$ | $f'(x) = 0$ | Constante real |
| $f(x) = x$ | $f'(x) = 1$ | Identidad |
| $f(x) = c x$ | $f'(x) = c$ | Lineal (regla del producto) |
| $f(x) = x^n$ | $f'(x) = n \cdot x^{n-1}$ | Potencia real |
| $f(x) = \ln x$ | $f'(x) = \frac{1}{x}$ | Logaritmo natural ($x > 0$) |
| $f(x) = \log_a x$ | $f'(x) = \frac{1}{x \cdot \ln a}$ | Logaritmo base $a$ |
| $f(x) = e^x$ | $f'(x) = e^x$ | Exponencial natural |
| $f(x) = a^x$ | $f'(x) = a^x \cdot \ln a$ | Exponencial base $a$ |
| $f(x) = \sin x$ | $f'(x) = \cos x$ | Seno |
| $f(x) = \cos x$ | $f'(x) = -\sin x$ | Coseno |
| $f(x) = \tan x$ | $f'(x) = \sec^2 x$ | Tangente |
| $f(x) = \cot x$ | $f'(x) = -\csc^2 x$ | Cotangente |
| $f(x) = \sec x$ | $f'(x) = \sec x \cdot \tan x$ | Secante |
| $f(x) = \csc x$ | $f'(x) = -\csc x \cdot \cot x$ | Cosecante |
| $f(x) = \arctan x$ | $f'(x) = \frac{1}{1 + x^2}$ | Arco tangente |
| $f(x) = \arcsin x$ | $f'(x) = \frac{1}{\sqrt{1 - x^2}}$ | Arco seno ($-1 < x < 1$) |
| $f(x) = \arccos x$ | $f'(x) = -\frac{1}{\sqrt{1 - x^2}}$ | Arco coseno ($-1 < x < 1$) |
| $f(x) = \sinh x$ | $f'(x) = \cosh x$ | Seno hiperbólico |
| $f(x) = \cosh x$ | $f'(x) = \sinh x$ | Coseno hiperbólico |

---

## 3. Teoremas Fundamentales del Cálculo Diferencial

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

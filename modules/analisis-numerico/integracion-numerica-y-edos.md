---
title: "Integración Numérica (Trapecio, Simpson) y Resolución de EDOs (Euler, Runge-Kutta)"
unit: "Unidad 4: Diferenciación, Integración Numérica y Ecuaciones Diferenciales (EDO)"
order: 4
tags:
  - "analisis-numerico"
  - "utn-frro"
  - "integracion-numerica"
  - "regla-del-trapecio"
  - "simpson-1-3"
  - "simpson-3-8"
  - "edos"
  - "euler"
  - "runge-kutta"
  - "rk4"
description: "Cuadratura numérica mediante fórmulas cerradas de Newton-Cotes compuestas (Regla del Trapecio y Simpson 1/3 y 3/8) y resolución numérica de problemas de valor inicial (PVI) para ecuaciones diferenciales ordinarias mediante Euler, Heun y Runge-Kutta de 4to orden (RK4)."
variables:
  - symbol: 'h = \frac{b - a}{n}'
    name: 'Paso de discretización'
    description: 'Ancho uniforme de cada subintervalo en el mallado numérico'
  - symbol: 'y_{i+1} = y_i + \Phi(x_i, y_i, h) \cdot h'
    name: 'Esquema de paso simple para EDOs'
    description: 'Estructura general de avance temporal para resolver y'' = f(x, y)'
formulas:
  - id: 'regla-trapecio-compuesta'
    name: 'Regla del Trapecio Compuesta'
    latex: 'I \approx \frac{h}{2} \left[ f(x_0) + 2 \sum_{i=1}^{n-1} f(x_i) + f(x_n) \right], \quad E_T = -\frac{(b - a) h^2}{12} f''''(\xi)'
    description: 'Aproximación por segmentos rectilíneos. Error global de orden O(h^2).'
    tags: ["trapecio", "integracion", "newton-cotes"]
  - id: 'regla-simpson-un-tercio-compuesta'
    name: 'Regla de Simpson 1/3 Compuesta (n par)'
    latex: 'I \approx \frac{h}{3} \left[ f(x_0) + 4 \sum_{i \text{ impar}}^{n-1} f(x_i) + 2 \sum_{i \text{ par}}^{n-2} f(x_i) + f(x_n) \right], \quad E_S = -\frac{(b - a) h^4}{180} f^{(4)}(\xi)'
    description: 'Aproximación por parábolas en pares de intervalos. Precisión exacta para polinomios hasta grado 3 con error global O(h^4).'
    tags: ["simpson", "integracion", "cuadratura"]
  - id: 'metodo-de-euler-edo'
    name: 'Método de Euler para EDOs (PVI)'
    latex: 'y_{i+1} = y_i + h \cdot f(x_i, y_i)'
    description: 'Método explícito de primer orden (error local O(h^2), error global O(h)) basado en la pendiente inicial.'
    tags: ["euler", "edo", "pvi"]
  - id: 'metodo-runge-kutta-4'
    name: 'Método de Runge-Kutta de 4to Orden (RK4 Clásico)'
    latex: 'y_{i+1} = y_i + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)'
    description: 'El estándar de la industria en ingeniería para EDOs: precisión de orden O(h^4) evaluando cuatro pendientes ponderadas por paso.'
    tags: ["runge-kutta", "rk4", "edo"]
---

# Integración Numérica y Resolución de EDOs (UTN FRRO)

---

## 1. Integración Numérica (Cuadratura de Newton-Cotes)

Se busca aproximar numéricamente la integral definida $I = \int_{a}^{b} f(x) \, dx$ dividiendo el intervalo $[a, b]$ en $n$ subintervalos de ancho uniforme $h = \frac{b - a}{n}$:

### A. Regla del Trapecio Compuesta
Aproxima la función en cada subintervalo mediante un polinomio de grado 1 (recta secante):

$$I \approx \frac{h}{2} \left[ f(x_0) + 2 \sum_{i=1}^{n-1} f(x_i) + f(x_n) \right]$$

* **Error global de truncamiento**:
  $$E_T = -\frac{(b - a) h^2}{12} f''(\xi), \quad \xi \in (a, b)$$
  Es de orden $\mathcal{O}(h^2)$. Si se reduce el paso a la mitad ($h/2$), el error se divide por 4.

### B. Regla de Simpson 1/3 Compuesta
Aproxima la función por parábolas de segundo grado uniendo ternas de puntos. **Exige obligatoriamente que $n$ sea un número par** (cantidad impar de puntos):

$$I \approx \frac{h}{3} \left[ f(x_0) + 4 \sum_{i=1, 3, 5}^{n-1} f(x_i) + 2 \sum_{j=2, 4, 6}^{n-2} f(x_j) + f(x_n) \right]$$

* **Error global de truncamiento**:
  $$E_S = -\frac{(b - a) h^4}{180} f^{(4)}(\xi), \quad \xi \in (a, b)$$
  Es de orden $\mathcal{O}(h^4)$. Si se reduce el paso a la mitad, el error se divide por 16.
  > **Propiedad notable**: A pesar de usar parábolas (grado 2), por simetría el error depende de la cuarta derivada, por lo que **Simpson 1/3 integra de forma teóricamente exacta polinomios cúbicos ($x^3$)**.

### C. Regla de Simpson 3/8 Compuesta
Aproxima por polinomios cúbicos y **exige que $n$ sea múltiplo de 3**:
$$I \approx \frac{3h}{8} \left[ f(x_0) + 3 f(x_1) + 3 f(x_2) + 2 f(x_3) + \dots + f(x_n) \right]$$
* Se utiliza habitualmente combinada con Simpson 1/3 cuando la cantidad de subintervalos es impar.

---

## 2. Resolución Numérica de Ecuaciones Diferenciales Ordinarias (EDO)

Se estudia el **Problema de Valor Inicial (PVI)**:
$$\begin{cases}
\frac{dy}{dx} = f(x, y) \\
y(x_0) = y_0
\end{cases}$$
Se busca una tabla discreta de aproximaciones $y_i \approx y(x_i)$ en los puntos $x_i = x_0 + i \cdot h$.

### A. Método de Euler (Primer Orden)
Avanza utilizando la recta tangente evaluada en el inicio del subintervalo:
$$y_{i+1} = y_i + h \cdot f(x_i, y_i)$$
* **Error**: Error local $\mathcal{O}(h^2)$, error global acumulado $\mathcal{O}(h)$.
* **Estabilidad**: Requiere pasos $h$ sumamente pequeños para evitar divergencia numérica, especialmente en ecuaciones rígidas (*stiff*).

### B. Método de Heun (Euler Modificado / Predictor-Corrector)
Mejora a Euler promediando la pendiente inicial con la pendiente predicha en el punto final del paso:
1. **Predictor (Euler)**: $y_{i+1}^{(0)} = y_i + h f(x_i, y_i)$
2. **Corrector (Trapecio)**:
   $$y_{i+1} = y_i + \frac{h}{2} \left[ f(x_i, y_i) + f(x_{i+1}, y_{i+1}^{(0)}) \right]$$
* **Error global**: $\mathcal{O}(h^2)$ (Método de Runge-Kutta de 2do orden).

---

## 3. Método de Runge-Kutta de 4to Orden (RK4)

Es el método más difundido y utilizado en simulaciones de física, ingeniería aeroespacial y dinámica de fluidos debido a su extraordinario balance entre costo computacional y estabilidad.

En cada paso evalúa 4 pendientes tentativas ponderadas:
$$\begin{aligned}
k_1 &= f(x_i, y_i) \\
k_2 &= f\left(x_i + \frac{h}{2}, \; y_i + \frac{h}{2} k_1\right) \\
k_3 &= f\left(x_i + \frac{h}{2}, \; y_i + \frac{h}{2} k_2\right) \\
k_4 &= f(x_i + h, \; y_i + h k_3)
\end{aligned}$$

La actualización final promedia las 4 pendientes con pesos de la regla de Simpson ($1/6, 2/6, 2/6, 1/6$):
$$y_{i+1} = y_i + \frac{h}{6} (k_1 + 2 k_2 + 2 k_3 + k_4)$$
$$x_{i+1} = x_i + h$$

* **Error global**: $\mathcal{O}(h^4)$. Permite pasos de integración relativamente grandes manteniendo una precisión milimétrica.

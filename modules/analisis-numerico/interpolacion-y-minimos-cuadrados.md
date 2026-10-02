---
title: "Interpolación Polinómica (Lagrange, Newton) y Ajuste por Mínimos Cuadrados"
unit: "Unidad 3: Interpolación Polinómica y Ajuste por Mínimos Cuadrados"
order: 3
tags:
  - "analisis-numerico"
  - "utn-frro"
  - "interpolacion"
  - "lagrange"
  - "newton-diferencias-divididas"
  - "fenomeno-runge"
  - "minimos-cuadrados"
  - "regresion-polinomica"
description: "Aproximación de funciones discretas: Teorema de Existencia y Unicidad del polinomio interpolador, forma canónica de Lagrange, diferencias divididas de Newton, fenómeno oscilatorio de Runge y método de regresión y ajuste por mínimos cuadrados."
variables:
  - symbol: 'P_n(x)'
    name: 'Polinomio interpolador de grado \le n'
    description: 'Polinomio que satisface exactamente la condición P_n(x_i) = y_i para n + 1 puntos soporte distintos'
  - symbol: 'S = \sum_{i=1}^m [y_i - f(x_i)]^2'
    name: 'Suma de Residuos Cuadráticos'
    description: 'Métrica que se minimiza en el ajuste por mínimos cuadrados'
formulas:
  - id: 'polinomio-lagrange'
    name: 'Polinomio Interpolador en Forma de Lagrange'
    latex: 'P_n(x) = \sum_{i=0}^{n} y_i L_i(x), \qquad L_i(x) = \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}'
    description: 'Combinación lineal de los polinomios base de Lagrange con la propiedad L_i(x_j) = \delta_{ij}.'
    tags: ["lagrange", "interpolacion", "base"]
  - id: 'polinomio-newton-diferencias-divididas'
    name: 'Polinomio Interpolador de Newton'
    latex: 'P_n(x) = f[x_0] + \sum_{k=1}^n f[x_0, x_1, \dots, x_k] \prod_{j=0}^{k-1} (x - x_j)'
    description: 'Formulación progresiva que permite agregar nuevos puntos sin recalcular los términos anteriores.'
    tags: ["newton", "diferencias-divididas", "interpolacion"]
  - id: 'error-interpolacion-cauchy'
    name: 'Término de Error de Interpolación'
    latex: 'E(x) = f(x) - P_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!} \prod_{i=0}^{n} (x - x_i), \quad \xi \in (\min x_i, \max x_i)'
    description: 'Cota del error de interpolación en función de la derivada de orden n + 1 de la función original.'
    tags: ["error", "interpolacion", "cota"]
  - id: 'ecuaciones-normales-minimos-cuadrados'
    name: 'Sistema de Ecuaciones Normales de Mínimos Cuadrados'
    latex: '(A^T A) \mathbf{c} = A^T \mathbf{y}'
    description: 'Sistema lineal no singular que determina los coeficientes óptimos c que minimizan la norma euclídea del residuo.'
    tags: ["minimos-cuadrados", "ecuaciones-normales", "ajuste"]
---

# Interpolación y Ajuste de Curvas (UTN FRRO)

---

## 1. Interpolación Polinómica

Dado un conjunto de $n + 1$ puntos soporte $\{(x_0, y_0), (x_1, y_1), \dots, (x_n, y_n)\}$ con abscisas distintas dos a dos ($x_i \ne x_j$):
* **Teorema de Existencia y Unicidad**: Existe un **único** polinomio $P_n(x)$ de grado a lo sumo $n$ tal que $P_n(x_i) = y_i$ para todo $i = 0, \dots, n$.

### A. Forma de Lagrange
Construye el polinomio como una combinación lineal directa:
$$P_n(x) = \sum_{i=0}^n y_i L_i(x)$$
Donde cada polinomio base de Lagrange $L_i(x)$ de grado $n$ cumple $L_i(x_j) = 1$ si $i = j$ y $0$ si $i \ne j$:
$$L_i(x) = \frac{(x - x_0)\dots(x - x_{i-1})(x - x_{i+1})\dots(x - x_n)}{(x_i - x_0)\dots(x_i - x_{i-1})(x_i - x_{i+1})\dots(x_i - x_n)} = \prod_{j=0, j \ne i}^n \frac{x - x_j}{x_i - x_j}$$

* **Desventaja computacional**: Si se agrega un nuevo punto $(x_{n+1}, y_{n+1})$, se deben recalcular **todos** los $L_i(x)$ desde cero.

### B. Forma de Newton mediante Diferencias Divididas
Permite una construcción recursiva y dinámica:
$$P_n(x) = a_0 + a_1(x - x_0) + a_2(x - x_0)(x - x_1) + \dots + a_n(x - x_0)\dots(x - x_{n-1})$$
Los coeficientes $a_k = f[x_0, x_1, \dots, x_k]$ son las **diferencias divididas**:
* Orden 0: $f[x_i] = y_i$
* Orden 1: $f[x_i, x_{i+1}] = \frac{f[x_{i+1}] - f[x_i]}{x_{i+1} - x_i}$
* Orden $k$: $f[x_i, \dots, x_{i+k}] = \frac{f[x_{i+1}, \dots, x_{i+k}] - f[x_i, \dots, x_{i+k-1}]}{x_{i+k} - x_i}$

### Fenómeno de Runge
Si se interpolan funciones suaves como $f(x) = \frac{1}{1 + 25 x^2}$ en $[-1, 1]$ usando polinomios de grado alto ($n \ge 10$) con nodos equiespaciados, se producen **oscilaciones descontroladas cerca de los extremos del intervalo**.
* **Solución en ingeniería**: Usar **nodos de Chebyshev** (distribución no uniforme más densa en los bordes) o **Splines cúbicos** (polinomios a trozos de grado 3 con continuidad $C^2$).

---

## 2. Ajuste por Mínimos Cuadrados

Cuando los datos provienen de mediciones experimentales con ruido o cuando la cantidad de puntos $m$ es mucho mayor que el número de parámetros del modelo deseado ($m \gg n$), **interpolar no es conveniente**. Se busca una curva sencilla $y = f(x; c_0, \dots, c_n)$ que pase "cerca" de todos los puntos minimizando la suma de errores cuadráticos:

$$S = \sum_{i=1}^m [y_i - f(x_i)]^2$$

### Modelo Lineal: $y = c_0 + c_1 x$
Minimizando $S(c_0, c_1)$ igualando las derivadas parciales a cero ($\frac{\partial S}{\partial c_0} = 0, \; \frac{\partial S}{\partial c_1} = 0$):
$$\begin{cases}
m c_0 + c_1 \sum x_i = \sum y_i \\
c_0 \sum x_i + c_1 \sum x_i^2 = \sum x_i y_i
\end{cases}$$

### Formulación Matricial General
Cualquier modelo lineal en sus parámetros $f(x) = \sum_{j=0}^n c_j \phi_j(x)$ (ej. parábolas, exponenciales linealizadas, armónicos) se escribe:
$$A \mathbf{c} \approx \mathbf{y}$$
Multiplicando por la traspuesta $A^T$ se obtiene el **sistema de ecuaciones normales**:
$$(A^T A) \mathbf{c} = A^T \mathbf{y}$$
Como los vectores columna de $A$ son linealmente independientes, $A^T A$ es una matriz cuadrada, simétrica y definida positiva, por lo que siempre tiene solución única:
$$\mathbf{c} = (A^T A)^{-1} A^T \mathbf{y}$$

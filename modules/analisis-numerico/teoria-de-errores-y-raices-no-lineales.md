---
title: "Teoría de Errores y Raíces de Ecuaciones No Lineales: Bisección, Regula Falsi, Newton-Raphson y Punto Fijo"
unit: "Unidad 1: Teoría de Errores y Raíces de Ecuaciones No Lineales"
order: 1
tags:
  - "analisis-numerico"
  - "utn-frro"
  - "teoria-de-errores"
  - "propagacion-error"
  - "biseccion"
  - "regula-falsi"
  - "newton-raphson"
  - "punto-fijo"
  - "orden-convergencia"
description: "Tratamiento numérico de errores (absoluto, relativo, truncamiento y redondeo), propagación con series de Taylor. Métodos cerrados (Bisección, Falsa Posición) y abiertos (Newton-Raphson, Secante, Punto Fijo) para hallar ceros de funciones f(x) = 0."
variables:
  - symbol: 'e_{abs} = |x_{real} - x_{aprox}|'
    name: 'Error Absoluto'
    description: 'Diferencia en magnitud entre el valor real exacto y la aproximación calculada'
  - symbol: 'e_{rel} = \frac{|x_{real} - x_{aprox}|}{|x_{real}|}'
    name: 'Error Relativo'
    description: 'Cociente adimensional normalizado que dimensiona el error respecto del orden de magnitud de la variable'
formulas:
  - id: 'propagacion-error-taylor'
    name: 'Propagación del Error (Aproximación Lineal)'
    latex: '\Delta f \approx \sum_{i=1}^{n} \left| \frac{\partial f}{\partial x_i} \right| \Delta x_i'
    description: 'Estimación de cota superior de error en una función multivariable mediante derivadas parciales.'
    tags: ["errores", "propagacion", "taylor"]
  - id: 'metodo-biseccion-iteracion'
    name: 'Cota de Iteraciones en Bisección'
    latex: 'n \ge \frac{\ln(b - a) - \ln(\varepsilon)}{\ln(2)} = \log_2\left(\frac{b - a}{\varepsilon}\right)'
    description: 'Número exacto de iteraciones mínimas para garantizar un error menor a \varepsilon en el intervalo inicial [a, b].'
    tags: ["biseccion", "iteraciones", "convergencia"]
  - id: 'newton-raphson-formula'
    name: 'Fórmula Iterativa de Newton-Raphson'
    latex: 'x_{k+1} = x_k - \frac{f(x_k)}{f''(x_k)}'
    description: 'Aproximación por la recta tangente con convergencia cuadrática (orden p = 2) cerca de raíces simples.'
    tags: ["newton-raphson", "raices", "tangente"]
  - id: 'metodo-de-la-secante'
    name: 'Método de la Secante'
    latex: 'x_{k+1} = x_k - f(x_k) \frac{x_k - x_{k-1}}{f(x_k) - f(x_{k-1})}'
    description: 'Variante de Newton-Raphson que aproxima la derivada mediante diferencias finitas sin requerir f''(x).'
    tags: ["secante", "raices", "abierto"]
---

# Teoría de Errores y Ceros de Ecuaciones No Lineales (UTN FRRO)

El análisis numérico diseña e implementa algoritmos computacionales estables para resolver problemas matemáticos continuos donde no existe solución analítica cerrada o su cómputo exacto es prohibitivamente costoso.

---

## 1. Tipos de Error y Propagación

En computación científica todo cálculo numérico está sujeto a tres fuentes inevitables de error:
1. **Error Inherente**: Incertidumbre en los datos medidos por instrumental físico.
2. **Error de Truncamiento**: Diferencia producida al sustituir un proceso matemático infinito (serie infinita, límite, derivada) por uno finito (ej. truncar la serie de Taylor en el término de grado 2).
3. **Error de Redondeo**: Producido por la representación finita de números reales en punto flotante (estándar IEEE 754 de precisión simple de 32 bits o doble de 64 bits).

### Medidas Formales de Error
* **Error Absoluto**:
  $$E_a = |x - \hat{x}|$$
* **Error Relativo**:
  $$E_r = \frac{|x - \hat{x}|}{|x|}, \quad x \ne 0$$
* **Error Relativo Porcentual**: $E_p = E_r \times 100\%$.

### Propagación del Error por Series de Taylor
Dada una función $y = f(x_1, x_2, \dots, x_n)$ con errores conocidos $\Delta x_i$:
$$\Delta y \approx \left| \frac{\partial f}{\partial x_1} \right| \Delta x_1 + \left| \frac{\partial f}{\partial x_2} \right| \Delta x_2 + \dots + \left| \frac{\partial f}{\partial x_n} \right| \Delta x_n$$

---

## 2. Métodos Cerrados (Intervalo / Bracketing)

Requieren dos valores iniciales $a$ y $b$ que encierren a la raíz, cumpliendo la hipótesis del **Teorema de Bolzano**: $f(a) \cdot f(b) < 0$.

### A. Método de Bisección
1. Calcular el punto medio: $c = \frac{a + b}{2}$.
2. Si $f(c) = 0$ o $|b - a| < \varepsilon$, $c$ es la raíz.
3. Si $f(a) \cdot f(c) < 0$, la raíz se encuentra en $[a, c]$, hacer $b = c$.
4. Si $f(c) \cdot f(b) < 0$, la raíz se encuentra en $[c, b]$, hacer $a = c$.
* **Convergencia**: Lineal ($p = 1$) con factor asintótico $C = 0.5$. Es **incondicionalmente convergente**, siempre encuentra la raíz si la función es continua.

### B. Método de Regula Falsi (Falsa Posición)
En lugar de tomar el punto medio, traza la recta secante entre $(a, f(a))$ y $(b, f(b))$ e intercepta el eje $x$:
$$c = \frac{a f(b) - b f(a)}{f(b) - f(a)} = b - f(b) \frac{b - a}{f(b) - f(a)}$$

---

## 3. Métodos Abiertos

No requieren que los puntos iniciales encierren la raíz. Son más veloces pero pueden divergir si el punto inicial está alejado o si la derivada es cercana a cero.

### A. Método de Newton-Raphson
Aproxima la función por su recta tangente en el punto actual $x_k$:
$$x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}$$

* **Criterio de Convergencia Cuadrática ($p = 2$)**:
  Si $f'(r) \ne 0$ (raíz simple) y $x_0$ está suficientemente cerca de $r$:
  $$|e_{k+1}| \approx \frac{|f''(r)|}{2 |f'(r)|} |e_k|^2$$
  El número de cifras decimales correctas se **duplica** en cada iteración.
* **Fallas típicas**:
  1. $f'(x_k) \approx 0$ (división por cero, la tangente se vuelve horizontal y envía $x_{k+1}$ al infinito).
  2. Puntos de inflexión que provocan ciclos oscilatorios cerrados.

### B. Método de la Secante
Reemplaza la derivada $f'(x_k)$ por el cociente incremental entre los dos puntos previos:
$$x_{k+1} = x_k - f(x_k) \frac{x_k - x_{k-1}}{f(x_k) - f(x_{k-1})}$$
* **Orden de convergencia**: Superlineal con $p \approx 1.618$ (el número de oro $\Phi$).

### C. Método del Punto Fijo ($x = g(x)$)
Se reescribe la ecuación $f(x) = 0$ en la forma equivalente $x = g(x)$ y se itera:
$$x_{k+1} = g(x_k)$$
* **Teorema de Convergencia del Punto Fijo**:
  Si $g(x)$ y $g'(x)$ son continuas en un intervalo $[a, b]$ que contiene al punto fijo, la sucesión converge si y solo si:
  $$|g'(x)| \le k < 1 \quad \forall x \in [a, b]$$

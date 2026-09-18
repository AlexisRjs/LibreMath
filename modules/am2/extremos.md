---
title: "Extremos Locales, Matriz Hessiana y Multiplicadores de Lagrange (Stewart U4)"
unit: "U4: Extremos"
order: 4
tags:
  - "am2"
  - "extremos"
  - "puntos-criticos"
  - "hessiano"
  - "silla"
  - "lagrange"
  - "optimizacion"
  - "stewart"
description: "Puntos críticos, prueba de las segundas derivadas (discriminante D), puntos de ensilladura, extremos absolutos en compactos y Multiplicadores de Lagrange según Stewart."
variables:
  - symbol: 'D(a, b)'
    name: 'Discriminante de las segundas derivadas'
    description: 'D = f_{xx} f_{yy} - (f_{xy})^2 (determinante de la matriz hessiana 2x2)'
  - symbol: '\lambda, \, \mu'
    name: 'Multiplicadores de Lagrange'
    description: 'Factores de escala que alinean los gradientes de la función objetivo y restricciones'
formulas:
  - id: 'prueba-segundas-derivadas-stewart'
    name: 'Prueba de las Segundas Derivadas Parciales'
    latex: 'D = f_{xx}(a,b) f_{yy}(a,b) - [f_{xy}(a,b)]^2 \implies \begin{cases} D > 0 \land f_{xx} > 0 & \implies \text{Mínimo local} \\ D > 0 \land f_{xx} < 0 & \implies \text{Máximo local} \\ D < 0 & \implies \text{Punto de ensilladura} \\ D = 0 & \implies \text{Prueba no concluyente} \end{cases}'
    description: 'Clasifica puntos críticos donde el gradiente se anula (\nabla f = \mathbf{0}).'
    tags: ["discriminante", "segunda-derivada", "maximos-minimos"]
  - id: 'multiplicadores-lagrange-stewart'
    name: 'Método de los Multiplicadores de Lagrange'
    latex: '\begin{cases} \nabla f(x, y, z) = \lambda \nabla g(x, y, z) \\ g(x, y, z) = k \end{cases} \iff \begin{cases} f_x = \lambda g_x, \; f_y = \lambda g_y, \; f_z = \lambda g_z \\ g(x, y, z) = k \end{cases}'
    description: 'Optimización de f sujeta a la restricción g = k con gradiente de restricción no nulo.'
    tags: ["lagrange", "optimizacion", "restriccion"]
  - id: 'lagrange-dos-restricciones'
    name: 'Lagrange con Dos Restricciones'
    latex: '\nabla f(x, y, z) = \lambda \nabla g(x, y, z) + \mu \nabla h(x, y, z) \quad \text{con } g = k, \; h = c'
    description: 'Optimización en la curva de intersección espacial de dos superficies de restricción.'
    tags: ["lagrange", "dos-restricciones", "interseccion"]
---

# Extremos y Optimización Multivariable

En el Capítulo 14 de Stewart, se desarrollan las herramientas analíticas para encontrar y clasificar los puntos extremos de campos escalares libres y sujetos a restricciones geométricas.

---

## 1. Clasificación de Puntos Críticos

Un punto $(a, b)$ es un **punto crítico** de $f$ si:
$$\nabla f(a, b) = \mathbf{0} \iff f_x(a, b) = 0 \quad \text{y} \quad f_y(a, b) = 0$$
(o si alguna de las derivadas parciales de primer orden no existe en el punto).

---

## 2. Extremos Absolutos en Conjuntos Cerrados y Acotados

Por el Teorema del Valor Extremo para funciones multivariables (Weierstrass):
1. Determinar los valores de $f$ en los puntos críticos de $D$ que yacen en el **interior**.
2. Determinar los valores extremos de $f$ en la **frontera** de $D$ (parametrizando el borde o usando Lagrange).
3. El valor más grande de estos pasos es el **Máximo Absoluto** y el más pequeño es el **Mínimo Absoluto**.

---
title: "Ecuaciones Diferenciales Ordinarias de 1° y 2° Orden y Modelado (Stewart U8)"
unit: "U8: Ecuaciones Diferenciales"
order: 8
tags:
  - "am2"
  - "ecuaciones-diferenciales"
  - "edo"
  - "variables-separables"
  - "factor-integrante"
  - "segundo-orden"
  - "coeficientes-constantes"
  - "stewart"
description: "Modelado con EDO, variables separables, lineales de primer orden con factor integrante, y EDO lineales de 2° orden homogéneas y no homogéneas según Stewart."
variables:
  - symbol: 'I(x) = e^{\int P(x) dx}'
    name: 'Factor Integrante de Euler'
    description: 'Convierte el miembro izquierdo de una EDO lineal de primer orden en la derivada exacta de un producto'
  - symbol: 'a r^2 + b r + c = 0'
    name: 'Ecuación Característica'
    description: 'Polinomio algebraico auxiliar cuyas raíces r determinan la base del espacio de soluciones homogéneas'
formulas:
  - id: 'edo-variables-separables'
    name: 'Ecuación de Variables Separables'
    latex: '\frac{dy}{dx} = g(x) \cdot h(y) \implies \int \frac{1}{h(y)} \, dy = \int g(x) \, dx + C \quad [h(y) \neq 0]'
    description: 'Separación analítica de las variables para integración directa en ambos miembros.'
    tags: ["variables-separables", "primer-orden", "integracion"]
  - id: 'edo-lineal-primer-orden-factor'
    name: 'Solución General de EDO Lineal de 1° Orden'
    latex: 'y'' + P(x) y = Q(x) \implies y(x) = \frac{1}{I(x)} \left[ \int I(x) Q(x) \, dx + C \right], \quad I(x) = e^{\int P(x) dx}'
    description: 'Fórmula cerrada de resolución mediante factor integrante de Euler.'
    tags: ["lineal", "factor-integrante", "primer-orden"]
  - id: 'edo-segundo-orden-caracteristica'
    name: 'EDO Lineal de 2° Orden con Coeficientes Constantes'
    latex: 'a y'''' + b y'' + c y = 0 \implies y_h(x) = \begin{cases} C_1 e^{r_1 x} + C_2 e^{r_2 x} & (\Delta > 0, \; r_1 \neq r_2) \\ (C_1 + C_2 x) e^{r x} & (\Delta = 0, \; r_1 = r_2 = r) \\ e^{\alpha x} [C_1 \cos(\beta x) + C_2 \sin(\beta x)] & (\Delta < 0, \; r = \alpha \pm i \beta) \end{cases}'
    description: 'Estructura general de la solución en función del discriminante característico \Delta = b^2 - 4ac.'
    tags: ["segundo-orden", "caracteristica", "complejas"]
  - id: 'variacion-parametros-segundo-orden'
    name: 'Método de Variación de Parámetros (Solución Particular)'
    latex: 'y_p(x) = -y_1(x) \int \frac{y_2(x) G(x)}{W(y_1, y_2)} \, dx + y_2(x) \int \frac{y_1(x) G(x)}{W(y_1, y_2)} \, dx \quad \left(W = \det \begin{pmatrix} y_1 & y_2 \\ y_1'' & y_2'' \end{pmatrix}\right)'
    description: 'Determina la solución particular para cualquier término fuente continuo G(x) mediante el Wronskiano W.'
    tags: ["variacion-parametros", "particular", "wronskiano"]
---

# Ecuaciones Diferenciales Ordinarias y Modelado Matemático

En el Capítulo 17 del Cálculo de James Stewart, las ecuaciones diferenciales permiten traducir leyes naturales en expresiones analíticas predictivas (crecimiento poblacional, decaimiento radiactivo, osciladores mecánicos y circuitos RLC).

---

## 1. El Principio de Superposición Lineal

Para una ecuación diferencial lineal de segundo orden:
$$a y'' + b y' + c y = G(x)$$
La solución general es la suma directa de la **solución homogénea** $y_h$ y una **solución particular** $y_p$:
$$y(x) = y_h(x) + y_p(x)$$
Donde $y_h$ es una combinación lineal de dos soluciones linealmente independientes ($W(y_1, y_2) \neq 0$).

---

## 2. Modelado de Oscilaciones y Circuitos RLC

- **Masa-Resorte con Fricción:** $m \ddot{x} + c \dot{x} + k x = F(t)$.
- **Circuito Eléctrico RLC Serie:** $L \frac{d^2 q}{dt^2} + R \frac{dq}{dt} + \frac{1}{C} q = E(t)$.
Ambos sistemas físicos comparten idéntica estructura matemática, lo que evidencia la universalidad unificadora del cálculo diferencial en la ingeniería.

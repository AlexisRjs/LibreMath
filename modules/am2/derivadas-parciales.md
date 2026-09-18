---
title: "Derivadas Parciales, Diferenciabilidad, Cadena y Gradiente (Stewart U3)"
unit: "U3: Derivadas Parciales"
order: 3
tags:
  - "am2"
  - "derivadas-parciales"
  - "clairaut"
  - "plano-tangente"
  - "diferenciabilidad"
  - "regla-cadena"
  - "gradiente"
  - "derivada-direccional"
  - "stewart"
description: "Cálculo diferencial multivariable, Teorema de Clairaut, linealización, diferenciabilidad, regla de la cadena en varias variables, gradiente y derivada direccional según Stewart."
variables:
  - symbol: '\nabla f = \langle f_x, f_y, f_z \rangle'
    name: 'Vector Gradiente'
    description: 'Vector cuyas componentes son las derivadas parciales de primer orden'
  - symbol: 'D_{\hat{u}} f'
    name: 'Derivada direccional'
    description: 'Razón de cambio del campo a lo largo de un vector unitario \hat{u}'
  - symbol: 'L(x, y)'
    name: 'Linealización o plano tangente'
    description: 'Aproximación lineal de primer orden de la superficie cerca de (a, b)'
formulas:
  - id: 'teorema-clairaut-derivadas-cruzadas'
    name: 'Teorema de Clairaut (Igualdad de Derivadas Mixtas)'
    latex: 'f_{xy}(a, b) = f_{yx}(a, b) \quad \left[\text{si } f_{xy} \text{ y } f_{yx} \text{ son continuas en un disco abierto centrado en } (a, b)\right]'
    description: 'El orden de derivación parcial no altera el resultado final.'
    tags: ["clairaut", "derivadas-mixtas", "orden"]
  - id: 'plano-tangente-superficie-z'
    name: 'Ecuación del Plano Tangente'
    latex: 'z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)'
    description: 'Representa la superficie tangente lineal que mejor aproxima a z = f(x, y).'
    tags: ["plano-tangente", "linealizacion", "geometria"]
  - id: 'regla-cadena-multivariable-caso-general'
    name: 'Regla de la Cadena Multivariable'
    latex: '\frac{\partial z}{\partial s} = \frac{\partial z}{\partial x} \frac{\partial x}{\partial s} + \frac{\partial z}{\partial y} \frac{\partial y}{\partial s}, \qquad \frac{\partial z}{\partial t} = \frac{\partial z}{\partial x} \frac{\partial x}{\partial t} + \frac{\partial z}{\partial y} \frac{\partial y}{\partial t}'
    description: 'Suma sobre todos los caminos intermedios de dependencia funcional.'
    tags: ["regla-cadena", "arbol-dependencias", "diferencial"]
  - id: 'derivada-direccional-gradiente-stewart'
    name: 'Derivada Direccional y Gradiente'
    latex: 'D_{\hat{u}} f(\mathbf{x}) = \nabla f(\mathbf{x}) \cdot \hat{u} = \|\nabla f(\mathbf{x})\| \cos(\theta) \quad (\|\hat{u}\| = 1)'
    description: 'El valor máximo de la derivada direccional es \|\nabla f\| y ocurre en la dirección de \nabla f.'
    tags: ["derivada-direccional", "gradiente", "maximo"]
---

# Derivadas Parciales y Gradiente

En la Sección 14 de James Stewart, se formalizan las razones de cambio respecto a una sola variable manteniendo todas las demás congeladas como constantes.

---

## 1. Diferenciabilidad y Plano Tangente

Para una función de dos variables $z = f(x, y)$, la existencia de derivadas parciales no garantiza la existencia de un plano tangente bien definido.
- **Definición:** $f$ es **diferenciable** en $(a, b)$ si $\Delta z$ puede expresarse como:
  $$\Delta z = f_x(a, b) \Delta x + f_y(a, b) \Delta y + \varepsilon_1 \Delta x + \varepsilon_2 \Delta y$$
  donde $\varepsilon_1, \varepsilon_2 \to 0$ cuando $(\Delta x, \Delta y) \to (0, 0)$.
- **Condición Suficiente:** Si las derivadas parciales $f_x$ y $f_y$ existen cerca de $(a, b)$ y son **continuas** en $(a, b)$, entonces $f$ es diferenciable en $(a, b)$.

---

## 2. Ortogonalidad del Gradiente a Superficies de Nivel

Si $F(x, y, z) = k$ describe una superficie de nivel y $P_0(x_0, y_0, z_0)$ es un punto sobre ella:
$$\nabla F(P_0) \cdot (\mathbf{r} - \mathbf{r}_0) = 0 \iff F_x(P_0)(x - x_0) + F_y(P_0)(y - y_0) + F_z(P_0)(z - z_0) = 0$$
El vector gradiente $\nabla F(P_0)$ es el **vector normal** $\vec{n}$ a la superficie en dicho punto.

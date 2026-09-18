---
title: "Integrales de Línea, Campos Conservativos y Teorema de Green (Stewart U6)"
unit: "U6: Integrales de Línea"
order: 6
tags:
  - "am2"
  - "integrales-linea"
  - "trabajo"
  - "campos-conservativos"
  - "potencial"
  - "teorema-green"
  - "stewart"
description: "Integrales de línea escalares y vectoriales, trabajo mecánico, Teorema Fundamental, independencia de trayectoria, campos conservativos y Teorema de Green en el plano según Stewart."
variables:
  - symbol: 'W = \int_C \vec{F} \cdot d\vec{r}'
    name: 'Trabajo mecánico'
    unit: 'J'
    description: 'Circulación del campo de fuerza a lo largo de la curva orientada C'
  - symbol: 'f(x, y, z)'
    name: 'Función potencial escalar'
    description: 'Función tal que su gradiente coincide con el campo: \nabla f = \vec{F}'
formulas:
  - id: 'integral-linea-campo-vectorial'
    name: 'Cálculo Paramétrico de Integral de Línea'
    latex: '\int_C \vec{F} \cdot d\vec{r} = \int_a^b \vec{F}(\vec{r}(t)) \cdot \vec{r}''(t) \, dt = \int_C P \, dx + Q \, dy + R \, dz'
    description: 'Integral del producto escalar entre el campo vectorial y el diferencial de arco vectorial.'
    tags: ["integral-linea", "trabajo", "vectorial"]
  - id: 'teorema-fundamental-linea-stewart'
    name: 'Teorema Fundamental de las Integrales de Línea'
    latex: '\int_C \nabla f \cdot d\vec{r} = f(\vec{r}(b)) - f(\vec{r}(a)) \iff \oint_{C_{\text{cerrada}}} \vec{F} \cdot d\vec{r} = 0'
    description: 'El trabajo de un campo conservativo sólo depende de las posiciones final e inicial.'
    tags: ["tfc-linea", "conservativo", "independencia-camino"]
  - id: 'teorema-green-plano-stewart'
    name: 'Teorema de Green en el Plano'
    latex: '\oint_C P \, dx + Q \, dy = \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) \, dA'
    description: 'Transforma una circulación cerrada positivamente orientada en una integral doble.'
    tags: ["teorema-green", "circulacion", "flujo-2d"]
  - id: 'area-teorema-green-formula'
    name: 'Cálculo de Área con el Teorema de Green'
    latex: 'A = \oint_C x \, dy = -\oint_C y \, dx = \frac{1}{2} \oint_C (x \, dy - y \, dx)'
    description: 'Permite calcular el área encerrada por una curva simple cerrada integrando sobre el contorno.'
    tags: ["area", "green", "contorno"]
---

# Integrales de Línea y Teorema de Green

En el Capítulo 16 de James Stewart, se vincula el cálculo multivariable con el trabajo de fuerzas físicas y la circulación de fluidos en dos y tres dimensiones.

---

## 1. Caracterización de Campos Conservativos

Para un campo vectorial $\vec{F} = P \hat{\imath} + Q \hat{\jmath}$ definido en una región abierta y **simplemente conexa** (sin orificios) $D \subset \mathbb{R}^2$:
$$\vec{F} \text{ es conservativo} \iff \frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x} \text{ en todo } D$$
Si esta condición se cumple, existe una función potencial $f$ tal que $\nabla f = \vec{F}$, y el trabajo es independiente de la curva que una los puntos extremos.

---

## 2. Orientación Positiva para el Teorema de Green

La curva de frontera $C = \partial D$ tiene **orientación positiva** cuando se recorre en sentido antihorario, de modo que la región $D$ permanece siempre a la **izquierda** de una persona que camine a lo largo de ella.

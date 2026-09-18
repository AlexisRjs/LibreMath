---
title: "Integrales de Superficie, Flujo, Teorema de Stokes y Teorema de Gauss (Stewart U7)"
unit: "U7: Integrales de Superficies"
order: 7
tags:
  - "am2"
  - "integrales-superficie"
  - "flujo"
  - "teorema-stokes"
  - "teorema-gauss"
  - "divergencia"
  - "rotor"
  - "stewart"
description: "Parametrización de superficies, elemento dS, integrales de flujo vectorial, Teorema del Rotor de Stokes y Teorema de la Divergencia de Gauss según Stewart."
variables:
  - symbol: '\Phi = \iint_S \vec{F} \cdot d\vec{S}'
    name: 'Flujo del campo vectorial'
    description: 'Cantidad neta del campo que atraviesa la superficie orientada por unidad de tiempo'
  - symbol: '\vec{r}_u \times \vec{r}_v'
    name: 'Vector normal fundamental'
    description: 'Producto cruz de las derivadas parciales de la parametrización de la superficie'
formulas:
  - id: 'integral-flujo-superficie-param'
    name: 'Cálculo Paramétrico del Flujo Vectorial'
    latex: '\iint_S \vec{F} \cdot d\vec{S} = \iint_D \vec{F}(\vec{r}(u, v)) \cdot \left( \frac{\partial \vec{r}}{\partial u} \times \frac{\partial \vec{r}}{\partial v} \right) \, dA'
    description: 'Evaluación directa del flujo sin necesidad de normalizar explícitamente el vector normal.'
    tags: ["flujo", "superficie", "parametrica"]
  - id: 'teorema-stokes-stewart'
    name: 'Teorema de Stokes (Rotor de un Campo)'
    latex: '\oint_C \vec{F} \cdot d\vec{r} = \iint_S (\text{rot} \, \vec{F}) \cdot d\vec{S} = \iint_S (\nabla \times \vec{F}) \cdot \hat{n} \, dS'
    description: 'La circulación alrededor del borde cerrado orientable C equivale al flujo del rotor sobre la superficie S.'
    tags: ["teorema-stokes", "rotor", "circulacion"]
  - id: 'teorema-divergencia-gauss-stewart'
    name: 'Teorema de la Divergencia de Gauss'
    latex: '\oiint_S \vec{F} \cdot d\vec{S} = \iiint_E (\text{div} \, \vec{F}) \, dV = \iiint_E (\nabla \cdot \vec{F}) \, dV'
    description: 'El flujo saliente neto sobre una superficie cerrada equivale a la integral de la divergencia en el volumen interior.'
    tags: ["teorema-gauss", "divergencia", "flujo-cerrado"]
---

# Integrales de Superficie y Teoremas Clásicos del Análisis Vectorial

En las secciones finales del Cálculo Vectorial de James Stewart, los teoremas de Stokes y Gauss unifican el cálculo multivariable con las grandes leyes de la física (electromagnetismo de Maxwell y fluidodinámica).

---

## 1. El Teorema de Stokes

Establece que la circulación de un campo $\vec{F}$ alrededor de la curva frontera $C$ de una superficie orientada $S$ es igual al flujo del rotacional $\nabla \times \vec{F}$ a través de $S$:
$$\oint_C \vec{F} \cdot d\vec{r} = \iint_S (\nabla \times \vec{F}) \cdot \hat{n} \, dS$$
> [!NOTE]
> La superficie $S$ puede ser **cualquier superficie orientable** que tenga a $C$ como su frontera orientada positivamente.

---

## 2. El Teorema de la Divergencia (Gauss)

Relaciona el flujo de $\vec{F}$ a través de una superficie cerrada $\partial E$ con la expansión volumétrica o compresión generada en el interior de $E$:
$$\oiint_{\partial E} \vec{F} \cdot d\vec{S} = \iiint_E \left( \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z} \right) \, dV$$
- Si $\text{div}(\vec{F}) > 0$, el volumen contiene **fuentes** netas del campo.
- Si $\text{div}(\vec{F}) < 0$, el volumen contiene **sumideros** netos.

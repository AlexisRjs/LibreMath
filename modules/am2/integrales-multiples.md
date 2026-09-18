---
title: "Integrales Múltiples, Fubini, Coordenadas Polares, Cilíndricas y Esféricas (Stewart U5)"
unit: "U5: Integrales Múltiples"
order: 5
tags:
  - "am2"
  - "integrales-dobles"
  - "integrales-triples"
  - "fubini"
  - "polares"
  - "cilindricas"
  - "esfericas"
  - "jacobiano"
  - "stewart"
description: "Integrales dobles y triples, Teorema de Fubini, cálculo de masas y centroides, integrales en coordenadas polares, cilíndricas, esféricas y factor Jacobiano de escala según Stewart."
variables:
  - symbol: '\iint_D f(x, y) \, dA'
    name: 'Integral doble en región D'
    description: 'Límite de sumas dobles de Riemann que representa volumen bajo la superficie si f >= 0'
  - symbol: 'J = \frac{\partial(x, y)}{\partial(u, v)}'
    name: 'Determinante Jacobiano'
    description: 'Razón de dilatación o contracción diferencial del área bajo una transformación biyectiva'
formulas:
  - id: 'teorema-fubini-integral-doble'
    name: 'Teorema de Fubini (Regiones Tipo I y II)'
    latex: '\iint_D f(x, y) \, dA = \int_a^b \left[ \int_{g_1(x)}^{g_2(x)} f(x, y) \, dy \right] dx = \int_c^d \left[ \int_{h_1(y)}^{h_2(y)} f(x, y) \, dx \right] dy'
    description: 'Permite reducir una integral bidimensional a integrales iteradas unidimensionales.'
    tags: ["fubini", "integrales-iteradas", "doble"]
  - id: 'integrales-coordenadas-polares'
    name: 'Integrales Dobles en Coordenadas Polares'
    latex: '\iint_D f(x, y) \, dA = \int_\alpha^\beta \int_{h_1(\theta)}^{h_2(\theta)} f(r\cos\theta, r\sin\theta) \cdot r \, dr \, d\theta'
    description: 'Elemento de área en polares con factor r proveniente del Jacobiano.'
    tags: ["polares", "area", "radio"]
  - id: 'integrales-coordenadas-esfericas'
    name: 'Integrales Triples en Coordenadas Esféricas'
    latex: '\iiint_E f(x, y, z) \, dV = \int_\alpha^\beta \int_c^d \int_a^b f(\rho\sin\phi\cos\theta, \rho\sin\phi\sin\theta, \rho\cos\phi) \cdot \rho^2 \sin(\phi) \, d\rho \, d\phi \, d\theta'
    description: 'Elemento diferencial de volumen esférico dV = \rho^2 \sin(\phi) d\rho d\phi d\theta.'
    tags: ["esfericas", "volumen", "triple"]
  - id: 'cambio-variable-jacobiano-general'
    name: 'Teorema de Cambio de Variables y Jacobiano'
    latex: 'J = \det \begin{pmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{pmatrix} \implies \iint_R f(x,y) \, dA = \iint_S f(x(u,v), y(u,v)) \cdot |J| \, du \, dv'
    description: 'Relación general entre integrales bajo mapeos curvilíneos regulares.'
    tags: ["jacobiano", "transformacion", "cambio-variables"]
---

# Integrales Múltiples y Aplicaciones Físicas

En el Capítulo 15 de James Stewart, se desarrolla el cálculo integral para campos escalares en regiones bidimensionales y tridimensionales.

---

## 1. Aplicaciones a la Mecánica de Medios Continuos

Para una lámina plana $D$ con densidad superficial de masa variable $\rho(x, y)$:
- **Masa total:** $m = \iint_D \rho(x, y) \, dA$.
- **Momentos estáticos:** $M_x = \iint_D y \, \rho(x, y) \, dA, \quad M_y = \iint_D x \, \rho(x, y) \, dA$.
- **Centro de masa:** $\bar{x} = \frac{M_y}{m}, \quad \bar{y} = \frac{M_x}{m}$.
- **Momentos de inercia:** $I_x = \iint_D y^2 \rho \, dA, \quad I_y = \iint_D x^2 \rho \, dA, \quad I_0 = I_x + I_y$.

---

## 2. Coordenadas Cilíndricas vs Esféricas en $\mathbb{R}^3$

- **Cilíndricas $(r, \theta, z)$:** Indicado para cilindros, paraboloides con eje $Z$ y conos.
  $$dV = r \, dr \, d\theta \, dz$$
- **Esféricas $(\rho, \phi, \theta)$:** Indicado para esferas, conos centrados en el origen y casquetes.
  $$dV = \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta \quad (\phi \in [0, \pi], \; \theta \in [0, 2\pi])$$

---
title: "Electrostática: Ley de Coulomb, Campo Eléctrico, Ley de Gauss y Potencial"
unit: "Electricidad y Magnetismo: Electrostática"
order: 1
tags:
  - "fisica-2"
  - "electrostatica"
  - "coulomb"
  - "campo-electrico"
  - "gauss"
  - "potencial-electrico"
  - "poisson"
description: "Cargas eléctricas, Ley de Coulomb, vector campo eléctrico, flujo y Ley de Gauss (integral y diferencial), potencial electrostático y ecuación de Poisson."
variables:
  - symbol: '\vec{E}'
    name: 'Vector Campo Eléctrico'
    unit: 'N/C = V/m'
    description: 'Fuerza eléctrica por unidad de carga testigo positiva'
  - symbol: 'V'
    name: 'Potencial Electrostático'
    unit: 'V (Voltio)'
    description: 'Trabajo por unidad de carga necesario para traer una carga desde el infinito'
  - symbol: '\varepsilon_0 \approx 8.854 \times 10^{-12}'
    name: 'Permitividad del vacío'
    unit: 'F/m'
    description: 'Constante dieléctrica del vacío'
formulas:
  - id: 'ley-coulomb-vectorial'
    name: 'Ley de Coulomb Vectorial'
    latex: '\vec{F}_{12} = \frac{1}{4\pi\varepsilon_0} \frac{q_1 q_2}{r_{12}^2} \hat{r}_{12}'
    description: 'Fuerza electrostática central de atracción o repulsión entre dos cargas puntuales.'
    tags: ["coulomb", "fuerza-electrica", "cargas"]
  - id: 'ley-gauss-integral-diferencial'
    name: 'Ley de Gauss (Forma Integral y Diferencial)'
    latex: '\Phi_E = \oiint_{\partial V} \vec{E} \cdot d\vec{A} = \frac{Q_{\text{enc}}}{\varepsilon_0} \iff \nabla \cdot \vec{E} = \frac{\rho}{\varepsilon_0}'
    description: 'Primera ecuación fundamental de Maxwell para la electrostática en el vacío.'
    tags: ["gauss", "flujo-electrico", "divergencia"]
  - id: 'potencial-gradiente-campo'
    name: 'Relación entre Potencial y Campo Eléctrico'
    latex: '\vec{E} = -\nabla V, \qquad V_B - V_A = -\int_{A}^{B} \vec{E} \cdot d\vec{r}'
    description: 'El campo eléctrico apunta en la dirección de máximo decrecimiento del potencial electrostático.'
    tags: ["potencial", "gradiente", "trabajo-electrico"]
  - id: 'ecuacion-poisson-laplace'
    name: 'Ecuaciones de Poisson y Laplace'
    latex: '\nabla^2 V = -\frac{\rho}{\varepsilon_0} \quad (\text{Poisson}), \qquad \nabla^2 V = 0 \quad (\text{Laplace en zonas sin carga})'
    description: 'Ecuación diferencial en derivadas parciales para la distribución espacial del potencial.'
    tags: ["poisson", "laplace", "laplaciano"]
---

# Electrostática Clásica

En Física II, la electrostática describe las interacciones entre cargas en reposo, el flujo del campo a través de superficies cerradas y el cálculo del potencial eléctrico.

---

## 1. Aplicaciones Simétricas de la Ley de Gauss

- **Esfera Maciza con Carga Uniforme $Q$ de Radio $R$:**
  - Exterior ($r \ge R$): $E(r) = \frac{Q}{4\pi\varepsilon_0 r^2}$.
  - Interior ($r < R$): $E(r) = \frac{Q \cdot r}{4\pi\varepsilon_0 R^3}$ (crece linealmente desde el centro).
- **Hilo Rectilíneo Infinito con Densidad Lineal $\lambda$:**
  $$E(r) = \frac{\lambda}{2\pi\varepsilon_0 r}$$
- **Plano Infinito Uniformemente Cargado con Densidad $\sigma$:**
  $$E = \frac{\sigma}{2\varepsilon_0} \quad (\text{campo uniforme e independiente de la distancia})$$

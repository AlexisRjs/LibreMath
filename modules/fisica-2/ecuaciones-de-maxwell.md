---
title: "Ecuaciones de Maxwell y Corriente de Desplazamiento"
unit: "Óptica Física: Ecuaciones de Maxwell"
order: 9
tags:
  - "fisica-2"
  - "maxwell"
  - "corriente-desplazamiento"
  - "electromagnetismo"
  - "gauss"
  - "faraday"
  - "ampere-maxwell"
description: "Las cuatro ecuaciones fundamentales de Maxwell en forma integral y diferencial, corriente de desplazamiento y unificación del electromagnetismo clásico."
variables:
  - symbol: '\vec{J}_d = \varepsilon_0 \frac{\partial \vec{E}}{\partial t}'
    name: 'Densidad de Corriente de Desplazamiento de Maxwell'
    unit: 'A/m²'
    description: 'Flujo temporal de campo eléctrico que genera campo magnético incluso en el vacío absoluto'
  - symbol: 'c = \frac{1}{\sqrt{\varepsilon_0 \mu_0}}'
    name: 'Velocidad de la luz en el vacío'
    unit: 'm/s'
    description: 'Constante universal fundamental de propagación de perturbaciones electromagnéticas (aprox. 3x10^8 m/s)'
formulas:
  - id: 'ley-gauss-electrico-maxwell'
    name: '1ª Ecuación: Ley de Gauss para el Campo Eléctrico'
    latex: '\oiint_{\partial V} \vec{E} \cdot d\vec{A} = \frac{Q_{\text{enc}}}{\varepsilon_0} \iff \nabla \cdot \vec{E} = \frac{\rho}{\varepsilon_0}'
    description: 'Las cargas eléctricas son las fuentes o sumideros escalares del campo electrostático.'
    tags: ["maxwell-1", "gauss-electrico", "divergencia"]
  - id: 'ley-gauss-magnetico-maxwell'
    name: '2ª Ecuación: Ley de Gauss para el Campo Magnético'
    latex: '\oiint_{\partial V} \vec{B} \cdot d\vec{A} = 0 \iff \nabla \cdot \vec{B} = 0'
    description: 'Las líneas magnéticas son cerradas y continuas; no existen monopolos magnéticos aislados.'
    tags: ["maxwell-2", "gauss-magnetico", "solenoidal"]
  - id: 'ley-faraday-maxwell'
    name: '3ª Ecuación: Ley de Faraday de la Inducción'
    latex: '\oint_C \vec{E} \cdot d\vec{l} = -\frac{d}{dt}\iint_S \vec{B} \cdot d\vec{A} \iff \nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}'
    description: 'Un campo magnético dependiente del tiempo engendra un vórtice de campo eléctrico.'
    tags: ["maxwell-3", "faraday", "rotor-e"]
  - id: 'ley-ampere-maxwell-corriente-desplazamiento'
    name: '4ª Ecuación: Ley de Ampère-Maxwell'
    latex: '\oint_C \vec{B} \cdot d\vec{l} = \mu_0 \left( I_{\text{c}} + \varepsilon_0 \frac{d\Phi_E}{dt} \right) \iff \nabla \times \vec{B} = \mu_0 \vec{J} + \mu_0 \varepsilon_0 \frac{\partial \vec{E}}{\partial t}'
    description: 'Tanto las corrientes de conducción como los campos eléctricos variables generan campo magnético.'
    tags: ["maxwell-4", "ampere-maxwell", "corriente-desplazamiento"]
---

# Las Ecuaciones de Maxwell

La síntesis realizada por James Clerk Maxwell en 1865 representa una de las cimas de la física teórica, prediciendo matemáticamente la existencia de las ondas electromagnéticas y demostrando que la luz es un fenómeno electromagnético.

---

## 1. El Término Clave: La Corriente de Desplazamiento

Maxwell descubrió una inconsistencia en la Ley de Ampère clásica al aplicarla a la carga de un condensador:
Tomando la divergencia en $\nabla \times \vec{B} = \mu_0 \vec{J}$:
$$\nabla \cdot (\nabla \times \vec{B}) \equiv 0 \implies \nabla \cdot \vec{J} = 0$$
Sin embargo, por la ecuación de continuidad: $\nabla \cdot \vec{J} = -\frac{\partial \rho}{\partial t} \neq 0$.
Para preservar la conservación de la carga, Maxwell añadió el término:
$$\vec{J}_d = \varepsilon_0 \frac{\partial \vec{E}}{\partial t}$$
Gracias a este término simétrico, un campo eléctrico variable en el tiempo engendra un campo magnético, y viceversa, permitiendo que la onda electromagnética se auto-sustente y viaje en el vacío.

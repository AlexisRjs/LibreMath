---
title: "Propiedades Magnéticas de la Materia: Diamagnetismo, Paramagnetismo y Ferromagnetismo"
unit: "Electricidad y Magnetismo: Propiedades Magnéticas de la Materia"
order: 8
tags:
  - "fisica-2"
  - "magnetismo-materia"
  - "imanacion"
  - "campo-h"
  - "diamagnetismo"
  - "paramagnetismo"
  - "ferromagnetismo"
  - "histeresis"
description: "Vector imanación M, intensidad de campo magnético H, susceptibilidad magnética, dominios de Weiss y ciclo de histéresis ferromagnético."
variables:
  - symbol: '\vec{M}'
    name: 'Vector Imanación (Magnetización)'
    unit: 'A/m'
    description: 'Densidad de momentos dipolares magnéticos atómicos por unidad de volumen'
  - symbol: '\vec{H}'
    name: 'Vector Intensidad de Campo Magnético'
    unit: 'A/m'
    description: 'Campo auxiliar generado exclusivamente por las corrientes libres de conducción'
  - symbol: '\chi_m'
    name: 'Susceptibilidad magnética volumétrica'
    unit: 'adimensional'
    description: 'Grado de respuesta magnética del medio a un campo excitador exterior'
formulas:
  - id: 'relacion-fundamental-campos-magneticos'
    name: 'Relación Constitutiva del Medio Magnético'
    latex: '\vec{B} = \mu_0 \left( \vec{H} + \vec{M} \right) = \mu_0 (1 + \chi_m) \vec{H} = \mu \vec{H}'
    description: 'Define la inducción total B combinando el campo externo H y la respuesta dipolar M.'
    tags: ["relacion-constitutiva", "permeabilidad", "susceptibilidad"]
  - id: 'ley-ampere-generalizada-materia'
    name: 'Ley de Ampère en Medios Materiales'
    latex: '\oint_C \vec{H} \cdot d\vec{l} = I_{\text{libre, enc}} \iff \nabla \times \vec{H} = \vec{J}_{\text{libre}}'
    description: 'La circulación de H depende únicamente de las corrientes eléctricas reales de transporte.'
    tags: ["ampere-materia", "campo-h", "corrientes-libres"]
  - id: 'ley-curie-paramagnetismo'
    name: 'Ley de Curie para Materiales Paramagnéticos'
    latex: '\chi_m = \frac{C}{T} \implies M = \frac{C \cdot B}{T} \quad (T > T_C \text{ en Kelvin})'
    description: 'La agitación térmica desordena los dipolos magnéticos, reduciendo la susceptibilidad con la temperatura.'
    tags: ["curie", "paramagnetismo", "temperatura"]
  - id: 'perdidas-ciclo-histeresis'
    name: 'Pérdidas de Energía por Ciclo de Histéresis'
    latex: 'w_h = \oint_{\text{ciclo}} \vec{H} \cdot d\vec{B} = \text{Área del bucle de histéresis} \quad (\text{J/m³ por ciclo})'
    description: 'Disipación térmica por fricción interna en el reordenamiento de las paredes de dominios de Weiss.'
    tags: ["histeresis", "perdidas-hierro", "ferromagnetismo"]
---

# Magnetismo en Medios Materiales y Ferromagnetismo

La respuesta magnética de los sólidos proviene del momento angular orbital de los electrones y de su momento intrínseco de spin.

---

## 1. Clasificación de Medios Magnéticos

1. **Diamagnéticos ($\chi_m < 0$, $\mu_r \lesssim 1$):** El campo aplicado induce corrientes orbitales opuestas (efecto Lenz a escala atómica). El material es débilmente expelido del campo (cobre, agua, plata, plomo).
2. **Paramagnéticos ($\chi_m > 0$ muy pequeño, $\mu_r \gtrsim 1$):** Átomos con momentos dipolares permanentes no compensados que se alinean débilmente con el campo exterior (aluminio, platino, titanio).
3. **Ferromagnéticos ($\chi_m \gg 1$, $\mu_r \sim 10^3 - 10^5$):** Acoplamiento mecánico-cuántico cuántico de canje que alinea espontáneamente los espines en **dominios magnéticos de Weiss** (hierro, cobalto, níquel).

---

## 2. El Ciclo de Histéresis Ferromagnética

Al someter un material ferromagnético a un campo alterno $H(t)$:
- **Inducción de Remanencia ($B_r$):** Magnetización residual que retiene el material cuando el campo excitador $H$ se anula (base de los imanes permanentes).
- **Campo Coercitivo ($H_c$):** Intensidad de campo inverso requerida para desimantar totalmente el material ($B = 0$).
- **Materiales Magnéticos Blandos:** Bucle muy estrecho ($H_c$ bajo), ideales para núcleos de transformadores y motores para minimizar pérdidas térmicas.
- **Materiales Magnéticos Duros:** Bucle muy ancho ($H_c$ y $B_r$ elevados), utilizados para imanes permanentes.

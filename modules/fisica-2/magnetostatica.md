---
title: "Magnetostática: Fuerza de Lorentz, Biot-Savart, Ley de Ampère y Solenoides"
unit: "Electricidad y Magnetismo: Magnetostática"
order: 5
tags:
  - "fisica-2"
  - "magnetostatica"
  - "lorentz"
  - "biot-savart"
  - "ampere"
  - "solenoide"
  - "ciclotron"
description: "Fuerza magnética de Lorentz, movimiento de partículas cargadas, fuerza sobre conductores (Laplace), Ley de Biot-Savart y teorema de circulación de Ampère."
variables:
  - symbol: '\vec{B}'
    name: 'Vector Inducción Magnética (Campo B)'
    unit: 'T (Tesla = N/(A·m))'
    description: 'Intensidad del campo magnético generado por corrientes eléctricas estacionarias'
  - symbol: '\mu_0 = 4\pi \times 10^{-7}'
    name: 'Permeabilidad magnética del vacío'
    unit: 'T·m/A = H/m'
    description: 'Constante física que define la respuesta magnética del espacio vacío'
  - symbol: '\vec{\mu} = I \cdot A \hat{n}'
    name: 'Momento dipolar magnético de la espira'
    unit: 'A·m²'
    description: 'Vector proporcional a la corriente y área orientada de la espira'
formulas:
  - id: 'fuerza-lorentz-general'
    name: 'Fuerza Electromagnética de Lorentz'
    latex: '\vec{F} = q \left( \vec{E} + \vec{v} \times \vec{B} \right)'
    description: 'La componente magnética no realiza trabajo mecánico por ser perpendicular a la velocidad instantánea.'
    tags: ["lorentz", "fuerza-magnetica", "carga-movil"]
  - id: 'radio-frecuencia-ciclotron'
    name: 'Radio de Giro y Frecuencia de Ciclotrón'
    latex: 'R = \frac{m \cdot v_\perp}{|q| B}, \qquad \omega_c = \frac{|q| B}{m}, \qquad T = \frac{2\pi m}{|q| B}'
    description: 'Movimiento circular uniforme en el plano perpendicular a las líneas de campo magnético constante.'
    tags: ["ciclotron", "radio-giro", "particula-b"]
  - id: 'ley-biot-savart-diferencial'
    name: 'Ley de Biot-Savart'
    latex: 'd\vec{B} = \frac{\mu_0 I}{4\pi} \frac{d\vec{l} \times \hat{r}}{r^2} \implies B_{\text{hilo}} = \frac{\mu_0 I}{2\pi r}'
    description: 'Calcula el campo magnético generado por un elemento diferencial de corriente dl.'
    tags: ["biot-savart", "hilo-infinito", "campo-b"]
  - id: 'ley-ampere-circulacion'
    name: 'Ley de Circulación de Ampère'
    latex: '\oint_C \vec{B} \cdot d\vec{l} = \mu_0 I_{\text{enc}} \iff \nabla \times \vec{B} = \mu_0 \vec{J}'
    description: 'Válida para corrientes estacionarias en contornos cerrados amperianos.'
    tags: ["ampere", "circulacion", "corriente-encerrada"]
  - id: 'campo-solenoide-ideal'
    name: 'Campo Magnético de un Solenoide Ideal'
    latex: 'B = \mu_0 \cdot n \cdot I \quad \left(n = \frac{N}{L} \text{ espiras por metro}\right)'
    description: 'Campo magnético uniforme y axial confinado en el interior de la bobina cilíndrica.'
    tags: ["solenoide", "bobina", "campo-axial"]
---

# Magnetostática y Fuentes del Campo Magnético

Las corrientes eléctricas estacionarias generan campos magnéticos que interactúan con partículas cargadas en movimiento sin alterar su energía cinética.

---

## 1. Fuerza Magnética sobre Conductores (Ley de Laplace)

Para un hilo conductor por el que circula una corriente $I$:
$$\vec{F} = I \int_C (d\vec{l} \times \vec{B})$$
Si el campo es uniforme y el conductor es un segmento recto de longitud $L$:
$$\vec{F} = I (\vec{L} \times \vec{B}) \implies F = I L B \sin\theta$$

---

## 2. Inexistencia de Monopolos Magnéticos (Ley de Gauss del Magnetismo)

$$\Phi_B = \oiint \vec{B} \cdot d\vec{A} = 0 \iff \nabla \cdot \vec{B} = 0$$
Las líneas de campo magnético son **estrictamente cerradas sobre sí mismas**. No existen cargas magnéticas aisladas.

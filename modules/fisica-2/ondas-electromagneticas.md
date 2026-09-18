---
title: "Ondas Electromagnéticas: Propagación, Vector de Poynting e Intensidad"
unit: "Óptica Física: Ondas Electromagnéticas"
order: 11
tags:
  - "fisica-2"
  - "ondas-em"
  - "vector-poynting"
  - "intensidad"
  - "presion-radiacion"
  - "velocidad-luz"
description: "Deducción de la ecuación de onda EM a partir de Maxwell, carácter transversal, Vector de Poynting, flujo de energía y presión de radiación."
variables:
  - symbol: '\vec{S} = \frac{1}{\mu_0}(\vec{E} \times \vec{B})'
    name: 'Vector de Poynting'
    unit: 'W/m²'
    description: 'Tasa direccional de energía electromagnética transportada por unidad de área'
  - symbol: 'I = \langle S \rangle'
    name: 'Intensidad media o irradiancia'
    unit: 'W/m²'
    description: 'Promedio temporal de la magnitud del vector de Poynting'
  - symbol: 'P_{\text{rad}}'
    name: 'Presión de radiación'
    unit: 'N/m² = Pa'
    description: 'Presión ejercida por el momento lineal de los fotones sobre una superficie'
formulas:
  - id: 'ecuacion-onda-electromagnetica-vacio'
    name: 'Ecuaciones de Onda Electromagnética en el Vacío'
    latex: '\nabla^2 \vec{E} = \frac{1}{c^2} \frac{\partial^2 \vec{E}}{\partial t^2}, \qquad \nabla^2 \vec{B} = \frac{1}{c^2} \frac{\partial^2 \vec{B}}{\partial t^2} \quad \left(c = \frac{1}{\sqrt{\varepsilon_0 \mu_0}}\right)'
    description: 'Deducción directa de Maxwell aplicando rotacional a las leyes de Faraday y Ampère.'
    tags: ["onda-em", "velocidad-luz", "maxwell"]
  - id: 'relacion-amplitud-campos-e-b'
    name: 'Relación entre Campos Eléctrico y Magnético'
    latex: 'E(x, t) = c \cdot B(x, t) \iff E_0 = c \cdot B_0 \quad (\vec{E} \perp \vec{B} \perp \vec{k})'
    description: 'La energía electromagnética se divide en partes exactamente iguales entre el campo eléctrico y el magnético.'
    tags: ["amplitudes", "transversalidad", "campo-e-b"]
  - id: 'vector-poynting-intensidad-media'
    name: 'Vector de Poynting e Intensidad Media'
    latex: '\vec{S} = \frac{1}{\mu_0} (\vec{E} \times \vec{B}) \implies I = \langle S \rangle = \frac{1}{2} \varepsilon_0 c E_0^2 = \frac{E_0^2}{2 \mu_0 c}'
    description: 'Describe el flujo de potencia luminosa radiada que incide sobre un sensor o detector.'
    tags: ["poynting", "intensidad", "irradiancia"]
  - id: 'presion-radiacion-superficie'
    name: 'Presión de Radiación sobre Superficies'
    latex: 'P_{\text{rad}} = \frac{I}{c} \quad (\text{Absorción total}), \qquad P_{\text{rad}} = \frac{2I}{c} \quad (\text{Reflexión total especular})'
    description: 'Impulso transferido por la onda electromagnética a una superficie reflectante o absorbente.'
    tags: ["presion-radiacion", "momento-lineal", "fotones"]
---

# Propagación de Ondas Electromagnéticas

Las ondas electromagnéticas son perturbaciones transversales auto-propagables compuestas por campos eléctricos y magnéticos oscilantes en fase y perpendiculares entre sí.

---

## 1. El Espectro Electromagnético

| Banda | Rango de Longitud de Onda ($\lambda$) | Aplicación Técnica |
|---|---|---|
| **Radio y TV** | $> 1 \, \text{m}$ | Telecomunicaciones terrestres y satelitales |
| **Microondas** | $1 \, \text{mm} - 1 \, \text{m}$ | Radares, redes Wi-Fi y hornos |
| **Infrarrojo** | $750 \, \text{nm} - 1 \, \text{mm}$ | Termografía y visión nocturna |
| **Visible** | $380 \, \text{nm} - 750 \, \text{nm}$ | Sensibilidad del ojo humano y fotometría |
| **Ultravioleta** | $10 \, \text{nm} - 380 \, \text{nm}$ | Esterilización y física de semiconductores |
| **Rayos X y Gamma**| $< 10 \, \text{nm}$ | Cristalografía, medicina nuclear y radiodiagnóstico |

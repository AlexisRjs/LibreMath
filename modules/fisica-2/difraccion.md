---
title: "Difracción de la Luz: Fraunhofer, Rendija Simple, Criterio de Rayleigh y Redes"
unit: "Óptica Física: Difracción"
order: 14
tags:
  - "fisica-2"
  - "difraccion"
  - "fraunhofer"
  - "rendija-simple"
  - "disco-airy"
  - "rayleigh"
  - "red-difraccion"
description: "Principio de Huygens-Fresnel, difracción de Fraunhofer por rendija delgada, disco de Airy, límite de resolución de Rayleigh y redes de difracción espectroscópicas."
variables:
  - symbol: 'a'
    name: 'Ancho de la rendija'
    unit: 'm'
    description: 'Abertura transversal que provoca la desviación y ensanchamiento del haz'
  - symbol: '\theta_{\text{min}} = 1.22 \frac{\lambda}{D}'
    name: 'Resolución angular de Rayleigh'
    unit: 'rad'
    description: 'Ángulo mínimo entre dos fuentes puntuales para ser distinguidas como independientes a través de una pupila D'
  - symbol: 'N'
    name: 'Número de líneas iluminadas en la red de difracción'
    unit: 'adimensional'
    description: 'Determina la agudeza y poder de separación de longitudes de onda'
formulas:
  - id: 'minimos-difraccion-rendija-simple'
    name: 'Condición de Mínimos en Rendija Simple (Fraunhofer)'
    latex: 'a \sin(\theta) = m \cdot \lambda \quad (m = \pm 1, \pm 2, \pm 3, \dots \quad [m \neq 0])'
    description: 'El valor m = 0 corresponde al pico del Máximo Central de Difracción de ancho doble.'
    tags: ["difraccion", "minimos", "rendija-simple"]
  - id: 'ancho-maximo-central-difraccion'
    name: 'Ancho Lineal del Máximo Central de Difracción'
    latex: 'W_c = 2 y_1 = 2 \frac{\lambda L}{a} \quad (\text{para } L \gg a)'
    description: 'A menor ancho de rendija a, mayor es el ensanchamiento angular del haz difractado.'
    tags: ["maximo-central", "ancho", "patron"]
  - id: 'criterio-rayleigh-abertura-circular'
    name: 'Criterio de Resolución de Rayleigh (Disco de Airy)'
    latex: '\theta_{\text{min}} = 1.22 \frac{\lambda}{D}'
    description: 'Límite difraccional absoluto de resolución para cualquier telescopio o lente de diámetro D.'
    tags: ["rayleigh", "resolucion", "disco-airy", "abertura-circular"]
  - id: 'ecuacion-red-difraccion'
    name: 'Ecuación de la Red de Difracción'
    latex: 'd \sin(\theta) = m \cdot \lambda, \qquad R = \frac{\lambda}{\Delta \lambda} = N \cdot m'
    description: 'd es el paso de red (1/número de líneas por metro) y R el poder de resolución cromático.'
    tags: ["red-difraccion", "espectroscopia", "ordenes"]
---

# Difracción de la Luz y Óptica Ondulatoria

La difracción es la desviación que experimentan las ondas luminosas al bordear obstáculos o atravesar aberturas de dimensiones comparables a su longitud de onda ($\sim 500 \, \text{nm}$).

---

## 1. Patrón de Difracción de Rendija Simple

A diferencia de la interferencia donde todas las franjas tienen la misma separación y brillo similar, en la difracción de Fraunhofer:
- El **máximo central** concentra más del **85%** de toda la energía luminosa del haz y tiene el **doble de ancho** que cualquier máximo secundario.
- Los máximos laterales decrecen drásticamente en intensidad ($I_1 \approx 0.047 I_0$, $I_2 \approx 0.016 I_0$).

---

## 2. Límite de Resolución y Criterio de Rayleigh

Dos fuentes de luz puntuales (por ejemplo dos estrellas observadas mediante un telescopio) se consideran **apenas resueltas** cuando el máximo central del disco de difracción de una coincide exactamente con el primer mínimo de difracción de la otra:
$$\theta_{\text{min}} = 1.22 \frac{\lambda}{D}$$
Para mejorar la resolución angular de un instrumento astronómico, se debe aumentar el diámetro de apertura $D$ o utilizar longitudes de onda menores (luz ultravioleta o rayos X en microscopía).

---
title: "Dinámica Clásica: Marcos No Inerciales, Coriolis y Fricción de Euler"
unit: "Unidad 2: Dinámica Newtoniana y No Inercial"
order: 2
tags:
  - "dinamica"
  - "no-inercial"
  - "coriolis"
  - "centrifuga"
  - "euler-eytelwein"
  - "peralte"
description: "Fuerzas ficticias en sistemas rotantes, aceleración y fuerza de Coriolis, y transmisión por rozamiento de Euler-Eytelwein."
variables:
  - symbol: '\vec{F}_{\text{coriolis}}'
    name: 'Fuerza inercial de Coriolis'
    unit: 'N'
    description: 'Fuerza aparente perpendicular a la velocidad relativa en un referencial en rotación'
  - symbol: '\vec{\omega}'
    name: 'Vector velocidad angular del marco móvil'
    unit: 'rad/s'
    description: 'Eje y velocidad de rotación instantánea del sistema no inercial'
  - symbol: '\beta'
    name: 'Ángulo de contacto / abrace en polea'
    unit: 'rad'
    description: 'Arco de enrollamiento de la correa o cuerda sobre el tambor'
formulas:
  - id: 'fuerza-coriolis-def'
    name: 'Fuerza Inercial de Coriolis'
    latex: '\vec{F}_{\text{cor}} = -2m (\vec{\omega} \times \vec{v}'')'
    description: 'Desvía masas de aire (ciclones) y proyectiles de largo alcance en balística terrestre.'
    tags: ["coriolis", "no-inercial", "aparente"]
  - id: 'fuerza-centrifuga-vectorial'
    name: 'Fuerza Centrífuga Inercial'
    latex: '\vec{F}_{\text{cf}} = -m \, \vec{\omega} \times (\vec{\omega} \times \vec{r}'') = m \omega^2 r_{\perp} \hat{u}_r'
    description: 'Fuerza aparente dirigida radialmente hacia afuera del eje de rotación.'
    tags: ["centrifuga", "rotacion", "inercial"]
  - id: 'formula-euler-eytelwein'
    name: 'Ecuación de Euler-Eytelwein (Rozamiento de Correas y Cabrestantes)'
    latex: 'T_2 = T_1 \cdot e^{\mu \beta}'
    description: 'Razón máxima entre tensiones de una correa antes del deslizamiento sobre un tambor cilíndrico.'
    tags: ["friccion", "correas", "cabrestante", "mecanica"]
  - id: 'angulo-peralte-optimo'
    name: 'Ángulo de Peralte Óptimo en Carreteras y Vías'
    latex: '\tan(\theta) = \frac{v^2}{R \cdot g}'
    description: 'Inclinación de la calzada para que la fuerza normal compense íntegramente la aceleración centrípeta sin rozamiento lateral.'
    tags: ["peralte", "curvas", "diseno-vial"]
---

# Dinámica Avanzada y Marcos de Referencia No Inerciales

Cuando el observador o la estación de medición se encuentra acelerada respecto a un marco inercial (como la Tierra en rotación), la Segunda Ley de Newton requiere la introducción de fuerzas inerciales o ficticias.

---

## 1. Segunda Ley en Sistemas en Rotación

Para un referencial móvil que gira con velocidad angular constante $\vec{\omega}$:

$$m \vec{a}' = \Sigma \vec{F}_{\text{reales}} + \vec{F}_{\text{centrífuga}} + \vec{F}_{\text{Coriolis}}$$

Donde:
- $\vec{F}_{\text{centrífuga}} = -m \vec{\omega} \times (\vec{\omega} \times \vec{r}')$
- $\vec{F}_{\text{Coriolis}} = -2m (\vec{\omega} \times \vec{v}')$

> [!WARNING]
> La Fuerza de Coriolis actúa **únicamente cuando el cuerpo se mueve respecto al marco giratorio** ($\vec{v}' \neq \mathbf{0}$) y es siempre **perpendicular a la velocidad relativa**, por lo que **NO realiza trabajo mecánico** ($W_{\text{cor}} = 0$).

---

## 2. Rozamiento en Cabrestantes: Ecuación de Euler-Eytelwein

Un elemento diferencial de cuerda de longitud $d\theta$ en contacto con un tambor cilíndrico satisface el balance de fuerzas:

$$\begin{cases} dN = T d\theta \\ dT = \mu dN = \mu T d\theta \end{cases} \implies \frac{dT}{T} = \mu d\theta$$

Integrando entre los extremos $\theta = 0$ y $\theta = \beta$:
$$\int_{T_1}^{T_2} \frac{dT}{T} = \mu \int_{0}^{\beta} d\theta \implies \ln\left(\frac{T_2}{T_1}\right) = \mu \beta \implies \mathbf{T_2 = T_1 e^{\mu \beta}}$$

Esta amplificación exponencial explica por qué bastan 3 o 4 vueltas de soga en la bita de amarre de un buque para retener toneladas de fuerza de arrastre con esfuerzo humano manual mínimo.

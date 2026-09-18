---
title: "Dinámica del Sólido Rígido: Teorema de Steiner, Rodadura Pura y Momento Angular"
unit: "Unidad 5: Dinámica del Sólido Rígido, Steiner y Rodadura Pura"
order: 5
tags:
  - "solido-rigido"
  - "inercia"
  - "steiner"
  - "rodadura-pura"
  - "momento-angular"
  - "konig"
description: "Tensor y momento de inercia, Teorema de Steiner, rodadura sin resbalamiento en planos inclinados y conservación de L en la UTN FRRO."
variables:
  - symbol: 'I_{\text{cm}}'
    name: 'Momento de inercia baricéntrico'
    unit: 'kg·m²'
    description: 'Inercia a la rotación respecto al eje que pasa por el centro de masa'
  - symbol: 'a_{\text{cm}}'
    name: 'Aceleración lineal del CM'
    unit: 'm/s²'
    description: 'Aceleración en rodadura pura sobre plano inclinado'
  - symbol: '\vec{\tau} = \vec{r} \times \vec{F}'
    name: 'Torque o momento de una fuerza'
    unit: 'N·m'
    description: 'Capacidad de una fuerza para provocar giro alrededor de un punto'
formulas:
  - id: 'steiner-rotacion-utn'
    name: 'Teorema de Steiner (Ejes Paralelos)'
    latex: 'I_z = I_{\text{cm}} + M \cdot d^2'
    description: 'Traslación del momento de inercia a cualquier eje paralelo situado a distancia d.'
    tags: ["steiner", "inercia", "rotacion"]
  - id: 'aceleracion-rodadura-pura'
    name: 'Aceleración de Rodadura Pura en Plano Inclinado'
    latex: 'a_{\text{cm}} = \frac{g \sin(\theta)}{1 + \frac{I_{\text{cm}}}{M R^2}}'
    description: 'La fuerza de rozamiento estático fs impone la condición cinemática a_cm = \alpha R sin disipar calor.'
    tags: ["rodadura", "aceleracion", "plano-inclinado"]
  - id: 'teorema-konig-energia-cinetica'
    name: 'Teorema de König (Energía de Rototraslación)'
    latex: 'E_c = \frac{1}{2} M v_{\text{cm}}^2 + \frac{1}{2} I_{\text{cm}} \omega^2'
    description: 'Suma desacoplada de la energía cinética traslacional del CM y la rotacional relativa.'
    tags: ["konig", "energia", "rototraslacion"]
  - id: 'conservacion-momento-angular'
    name: 'Conservación del Momento Angular'
    latex: '\Sigma \vec{\tau}_{\text{ext}} = \mathbf{0} \implies \vec{L} = I \vec{\omega} = \text{cte}'
    description: 'Si el momento neto externo es nulo, el momento angular vectorial permanece constante.'
    tags: ["momento-angular", "conservacion", "giroscopio"]
---

# Dinámica de Rotación del Sólido Rígido

En la UTN FRRO, los exámenes de Física I dedican un problema completo al balance dinámico y energético de cuerpos con rotación y traslación combinada (rodadura pura).

---

## 1. El Teorema de los Ejes Paralelos (Steiner)

Dado el momento de inercia $I_{\text{cm}}$ respecto a un eje baricéntrico, el momento de inercia respecto a un eje paralelo a distancia $d$ es:

$$I = I_{\text{cm}} + M d^2$$

> [!TIP]
> **Ejemplo de Parcial:** Calcular el momento de inercia de un disco uniforme de masa $M$ y radio $R$ respecto a un eje tangente a su borde:
> - Eje baricéntrico del disco: $I_{\text{cm}} = \frac{1}{2} M R^2$.
> - Distancia al borde: $d = R$.
> - Por Steiner: $I_{\text{borde}} = \frac{1}{2} M R^2 + M R^2 = \mathbf{\frac{3}{2} M R^2}$.

---

## 2. Condición Dinámica para Rodar sin Deslizar

Para que un cuerpo ruede sin deslizar sobre una superficie con coeficiente de rozamiento estático $\mu_e$, la fuerza de fricción $f_s$ requerida debe ser menor o igual al límite estático:

$$f_s \le \mu_e \cdot N = \mu_e M g \cos\theta$$

De las ecuaciones dinámicas $f_s = I_{\text{cm}} \frac{a_{\text{cm}}}{R^2} = M g \sin\theta \frac{\frac{I_{\text{cm}}}{M R^2}}{1 + \frac{I_{\text{cm}}}{M R^2}}$, la condición para no deslizar es:
$$\tan\theta \le \mu_e \left( 1 + \frac{M R^2}{I_{\text{cm}}} \right)$$

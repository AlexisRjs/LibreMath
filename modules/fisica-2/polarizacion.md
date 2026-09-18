---
title: "Polarización de la Luz: Ley de Malus, Ángulo de Brewster y Birrefringencia"
unit: "Óptica Física: Polarización"
order: 12
tags:
  - "fisica-2"
  - "polarizacion"
  - "malus"
  - "brewster"
  - "birrefringencia"
  - "dicroismo"
description: "Estados de polarización (lineal, circular, elíptica), atenuación por filtros polaroides (Ley de Malus), ángulo de Brewster y cristales anisótropos."
variables:
  - symbol: 'I(\theta)'
    name: 'Intensidad de luz transmitida'
    unit: 'W/m²'
    description: 'Irradiancia que emerge tras atravesar un segundo polarizador (analizador)'
  - symbol: '\theta_B'
    name: 'Ángulo de polarización de Brewster'
    unit: 'grados o rad'
    description: 'Ángulo de incidencia al cual la luz reflejada queda 100% polarizada linealmente'
formulas:
  - id: 'ley-malus-polarizadores'
    name: 'Ley de Malus'
    latex: 'I(\theta) = I_0 \cos^2(\theta)'
    description: '\theta es el ángulo relativo entre los ejes de transmisión del polarizador y analizador.'
    tags: ["ley-malus", "polarizador", "analizador", "intensidad"]
  - id: 'angulo-brewster-polarizacion-reflexion'
    name: 'Ley de Brewster para Polarización por Reflexión'
    latex: '\tan(\theta_B) = \frac{n_2}{n_1} \iff \theta_B + \theta_r = 90^\circ'
    description: 'El rayo reflejado y el transmitido forman un ángulo recto exacto de 90°.'
    tags: ["brewster", "reflexion", "polarizacion-total"]
  - id: 'paso-luz-natural-primer-polarizador'
    name: 'Regla del 50% para Luz Natural No Polarizada'
    latex: 'I_1 = \frac{1}{2} I_{\text{inc}}'
    description: 'Cualquier polarizador ideal transmite exactamente la mitad de la intensidad de un haz natural no polarizado.'
    tags: ["luz-natural", "despolarizada", "atenuacion"]
---

# Polarización Óptica

La polarización es una prueba directa de la naturaleza transversal de las ondas electromagnéticas, describiendo la trayectoria que traza el vector campo eléctrico $\vec{E}$ en el plano perpendicular al avance del rayo.

---

## 1. Estados Fundamentales de Polarización

1. **Polarización Lineal:** Las dos componentes transversales $E_x$ y $E_y$ oscilan estrictamente en fase ($\Delta\phi = 0$ o $\pi$), manteniendo la oscilación en un plano fijo.
2. **Polarización Circular:** $E_x$ y $E_y$ tienen amplitudes idénticas ($E_{0x} = E_{0y}$) y un desfase exacto de $\Delta\phi = \pm 90^\circ = \pm \frac{\pi}{2}$. El vector campo eléctrico gira a velocidad angular constante $\omega$ describiendo una circunferencia.
3. **Polarización Elíptica:** Caso general para cualquier desfase y amplitudes distintas.

---

## 2. Birrefringencia (Doble Refracción)

En cristales ópticamente anisótropos (como la calcita $\text{CaCO}_3$ o el cuarzo), el índice de refracción depende de la dirección de oscilación del campo eléctrico:
- **Rayo Ordinario ($n_o$):** Cumple la ley de Snell en todas las direcciones.
- **Rayo Extraordinario ($n_e$):** Su velocidad de fase depende del ángulo con el eje óptico del cristal.
Este fenómeno permite construir **prismas de Nicol** y **láminas retardadoras** de cuarto de onda ($\lambda/4$) para convertir luz lineal en circular.

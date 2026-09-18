---
title: "Corriente Alterna: Fasores, Impedancia RLC, Resonancia y Potencia Compleja"
unit: "Electricidad y Magnetismo: Corriente Alterna"
order: 7
tags:
  - "fisica-2"
  - "corriente-alterna"
  - "fasores"
  - "impedancia"
  - "reactancia"
  - "resonancia-rlc"
  - "factor-potencia"
description: "Valores eficaces (RMS), cálculo fasorial, reactancias inductiva y capacitiva, impedancia compleja RLC, condición de resonancia serie y triángulo de potencias."
variables:
  - symbol: 'Z = R + j(X_L - X_C)'
    name: 'Impedancia compleja'
    unit: 'Ω (Ohm)'
    description: 'Oposición total de un circuito pasivo al flujo de corriente alterna sinusoidal'
  - symbol: 'X_L = \omega L, \quad X_C = \frac{1}{\omega C}'
    name: 'Reactancias inductiva y capacitiva'
    unit: 'Ω (Ohm)'
    description: 'Oposición debida al almacenamiento de energía en campos magnéticos y eléctricos'
  - symbol: '\cos(\phi)'
    name: 'Factor de potencia'
    unit: 'adimensional'
    description: 'Coseno del desfase entre tensión y corriente; mide la eficiencia energética'
formulas:
  - id: 'valores-eficaces-rms'
    name: 'Valores Eficaces (RMS) en Régimen Sinusoidal'
    latex: 'V_{\text{rms}} = \frac{V_{\text{max}}}{\sqrt{2}} \approx 0.707 \cdot V_{\text{max}}, \qquad I_{\text{rms}} = \frac{I_{\text{max}}}{\sqrt{2}}'
    description: 'Valor de corriente continua que disiparía idéntica potencia térmica en una resistencia pura.'
    tags: ["rms", "eficaz", "sinusoidal"]
  - id: 'modulo-fase-impedancia-rlc'
    name: 'Módulo y Fase de la Impedancia RLC Serie'
    latex: '|Z| = \sqrt{R^2 + \left(\omega L - \frac{1}{\omega C}\right)^2}, \qquad \tan(\phi) = \frac{\omega L - \frac{1}{\omega C}}{R}'
    description: 'Determina la amplitud y el ángulo de desfase entre la tensión de fuente y la corriente.'
    tags: ["impedancia", "modulo-z", "fase", "rlc"]
  - id: 'frecuencia-resonancia-serie'
    name: 'Frecuencia de Resonancia Serie RLC'
    latex: 'X_L = X_C \implies \omega_0 = \frac{1}{\sqrt{LC}} \iff f_0 = \frac{1}{2\pi \sqrt{LC}}'
    description: 'La impedancia es puramente resistiva y mínima (|Z| = R); la corriente alcanza su pico máximo.'
    tags: ["resonancia", "frecuencia-propia", "sintonia"]
  - id: 'triangulo-potencias-activa-reactiva-aparente'
    name: 'Triángulo de Potencias en CA'
    latex: 'P = V I \cos\phi \quad (\text{W}), \qquad Q = V I \sin\phi \quad (\text{VAR}), \qquad S = V I = \sqrt{P^2 + Q^2} \quad (\text{VA})'
    description: 'Potencia activa (trabajo útil), reactiva (oscilante en campos) y aparente.'
    tags: ["potencia", "activa", "reactiva", "aparente"]
---

# Corriente Alterna y Circuitos en Régimen Sinusoidal

En los sistemas industriales y residenciales modernos, la corriente alterna sinusoidal permite la transmisión eficiente de potencia a alta tensión minimizando pérdidas por efecto Joule.

---

## 1. Comportamiento Elemental de Componentes Pasivos

| Componente | Ecuación Temporal | Impedancia Compleja $Z$ | Desfase Temporal |
|---|---|---|---|
| **Resistencia $R$** | $v_R(t) = R \cdot i(t)$ | $Z_R = R$ | En fase ($\phi = 0$) |
| **Inductancia $L$** | $v_L(t) = L \frac{di}{dt}$ | $Z_L = j \omega L$ | La tensión **adelanta** $90^\circ$ a la corriente |
| **Capacitancia $C$** | $i_C(t) = C \frac{dv}{dt}$ | $Z_C = \frac{1}{j\omega C} = -j\frac{1}{\omega C}$ | La corriente **adelanta** $90^\circ$ a la tensión |

---

## 2. Factor de Potencia y su Corrección

Un bajo factor de potencia ($\cos\phi \ll 1$) significa corrientes de línea innecesariamente elevadas para entregar la misma potencia activa $P$, sobrecargando generadores y transformadores.
- Se corrige conectando **bancos de capacitores en paralelo** con la carga inductiva para compensar la potencia reactiva:
  $$Q_C = P (\tan\phi_1 - \tan\phi_2) \implies C = \frac{P(\tan\phi_1 - \tan\phi_2)}{\omega V_{\text{rms}}^2}$$

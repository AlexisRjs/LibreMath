---
title: "Movimiento Armónico Simple (MAS), Péndulos y Resonancia Mecánica"
unit: "Unidad 7: Movimiento Armónico Simple (MAS) y Resonancia"
order: 7
tags:
  - "mas"
  - "oscilaciones"
  - "pendulo-simple"
  - "pendulo-fisico"
  - "amortiguamiento"
  - "resonancia"
description: "Ecuación diferencial lineal armónica, oscilador masa-resorte, péndulo físico, regímenes de amortiguamiento y fenómeno de resonancia en UTN FRRO."
variables:
  - symbol: '\omega_0'
    name: 'Pulsación propia o natural'
    unit: 'rad/s'
    description: '\omega_0 = \sqrt{k/m} para masa-resorte o \sqrt{g/L} para péndulo simple'
  - symbol: 'T = \frac{2\pi}{\omega_0}'
    name: 'Período de oscilación'
    unit: 's'
    description: 'Tiempo que tarda el oscilador en completar un ciclo completo de vaivén'
  - symbol: 'I_O'
    name: 'Momento de inercia respecto al eje de suspensión'
    unit: 'kg·m²'
    description: 'Inercia a la rotación en el punto de pivote del péndulo físico'
formulas:
  - id: 'ecuacion-diferencial-mas'
    name: 'Ecuación Diferencial del MAS'
    latex: '\ddot{x}(t) + \omega_0^2 x(t) = 0 \implies x(t) = A \cos(\omega_0 t + \phi_0)'
    description: 'La aceleración instantánea es directamente proporcional al desplazamiento y de sentido opuesto.'
    tags: ["mas", "edo", "armonico"]
  - id: 'periodo-pendulo-fisico-compuesto'
    name: 'Período del Péndulo Físico (Cuerpo Rígido Oscilante)'
    latex: 'T = 2\pi \sqrt{\frac{I_O}{M \cdot g \cdot d}} = 2\pi \sqrt{\frac{I_{\text{cm}} + M d^2}{M \cdot g \cdot d}}'
    description: 'd es la distancia entre el centro de masa y el punto de suspensión fijo O.'
    tags: ["pendulo-fisico", "periodo", "steiner"]
  - id: 'amplitud-resonancia-forzada'
    name: 'Amplitud del Oscilador Forzado y Resonancia'
    latex: 'A(\omega) = \frac{F_0 / m}{\sqrt{(\omega_0^2 - \omega^2)^2 + 4 \gamma^2 \omega^2}} \quad \left(\text{Pico en } \omega_r = \sqrt{\omega_0^2 - 2\gamma^2}\right)'
    description: 'Describe la amplificación catastrófica de vibraciones cuando la frecuencia excitadora coincide con la natural.'
    tags: ["resonancia", "forzado", "amplitud"]
---

# Oscilaciones Mecánicas y Análisis Modal

En la UTN FRRO, el estudio del oscilador armónico es el prototipo analítico para el diseño antisísmico, suspensiones de vehículos y análisis de vibraciones mecánicas.

---

## 1. Péndulo Simple vs Péndulo Físico

- **Péndulo Simple:** Masa puntual colgada de hilo inextensible sin masa:
  $$T = 2\pi \sqrt{\frac{L}{g}}$$
- **Péndulo Físico (Cuerpo Continuo):** Aplicando la ecuación de rotación respecto al pivote $\tau = -M g d \sin\theta = I_O \ddot{\theta}$:
  Para pequeños ángulos ($\sin\theta \approx \theta$):
  $$I_O \ddot{\theta} + M g d \, \theta = 0 \implies \omega_0 = \sqrt{\frac{M g d}{I_O}} \implies \mathbf{T = 2\pi \sqrt{\frac{I_O}{M g d}}}$$

> [!TIP]
> **Longitud Equivalente del Péndulo Simple ($L_{\text{eq}}$):**
> Un péndulo físico oscila con el mismo período que un péndulo simple si:
> $$L_{\text{eq}} = \frac{I_O}{M d} = \frac{I_{\text{cm}} + M d^2}{M d} = d + \frac{I_{\text{cm}}}{M d}$$

---

## 2. Los Tres Regímenes de Amortiguamiento ($\ddot{x} + 2\gamma \dot{x} + \omega_0^2 x = 0$)

1. **Subamortiguado ($\gamma < \omega_0$):** Oscilaciones sinusoidales con envolvente exponencial decreciente $x(t) = A_0 e^{-\gamma t} \cos(\omega_d t + \phi)$ con pseudofrecuencia $\omega_d = \sqrt{\omega_0^2 - \gamma^2}$.
2. **Críticamente Amortiguado ($\gamma = \omega_0$):** El sistema retorna a la posición de equilibrio en el **menor tiempo posible sin oscilar** (ajuste ideal para amortiguadores de automóviles).
3. **Sobreamortiguado ($\gamma > \omega_0$):** Movimiento aperiódico lento y viscoso sin oscilación.

---
title: "Electrocinética: Corriente Continua, Ley de Ohm, Kirchhoff y Circuitos RC"
unit: "Electricidad y Magnetismo: Electrocinética"
order: 4
tags:
  - "fisica-2"
  - "corriente"
  - "ley-ohm"
  - "resistividad"
  - "kirchhoff"
  - "circuito-rc"
  - "efecto-joule"
description: "Intensidad y densidad de corriente, Ley de Ohm microscópica y macroscópica, efecto Joule, Leyes de mallas y nodos de Kirchhoff y transitorio de circuitos RC."
variables:
  - symbol: 'I = \frac{dq}{dt}'
    name: 'Intensidad de corriente eléctrica'
    unit: 'A (Amperio = C/s)'
    description: 'Flujo neto de carga eléctrica por unidad de tiempo a través de la sección recta del conductor'
  - symbol: '\vec{J} = n \cdot q \cdot \vec{v}_d'
    name: 'Densidad de corriente volumétrica'
    unit: 'A/m²'
    description: 'Vector proporcional a la densidad numérica de portadores, carga y velocidad de deriva'
  - symbol: '\tau = R \cdot C'
    name: 'Constante de tiempo capacitiva'
    unit: 's'
    description: 'Tiempo característico en el cual la carga del capacitor alcanza el 63.2% de su valor final'
formulas:
  - id: 'ley-ohm-micro-macro'
    name: 'Ley de Ohm Microscópica y Macroscópica'
    latex: '\vec{J} = \sigma \vec{E} = \frac{1}{\rho}\vec{E} \iff V = I \cdot R \quad \left(R = \rho \frac{L}{A}\right)'
    description: 'Relación lineal entre campo eléctrico y densidad de corriente en conductores óhmicos.'
    tags: ["ley-ohm", "resistencia", "resistividad"]
  - id: 'potencia-efecto-joule'
    name: 'Potencia Eléctrica y Efecto Joule'
    latex: 'P = V \cdot I = I^2 \cdot R = \frac{V^2}{R}'
    description: 'Tasa de disipación de energía electrostática en energía térmica por colisiones atómicas.'
    tags: ["potencia", "joule", "disipacion"]
  - id: 'leyes-kirchhoff-nodos-mallas'
    name: 'Leyes de Kirchhoff (Conservación de Carga y Energía)'
    latex: '\sum_{k} I_k = 0 \quad (\text{Ley de Nodos}), \qquad \sum_{k} \mathcal{E}_k = \sum_{k} I_k R_k \quad (\text{Ley de Mallas})'
    description: 'Formulación fundamental para la resolución de redes eléctricas multimalas.'
    tags: ["kirchhoff", "mallas", "nodos", "circuitos"]
  - id: 'transitorio-carga-circuito-rc'
    name: 'Ecuación Transitoria de Carga en Circuito RC Serie'
    latex: 'q(t) = C \mathcal{E} \left( 1 - e^{-t / (RC)} \right), \qquad I(t) = \frac{\mathcal{E}}{R} e^{-t / (RC)}'
    description: 'Evolución exponencial asintótica de la carga y corriente en el condensador.'
    tags: ["circuito-rc", "transitorio", "carga-capacitor"]
---

# Electrocinética y Circuitos de Corriente Continua

El estudio de las cargas en movimiento estacionario a lo largo de redes de conductores es el núcleo operativo de la ingeniería eléctrica.

---

## 1. Variación de la Resistividad con la Temperatura

Para metales conductores (cobre, aluminio):
$$\rho(T) = \rho_0 \left[ 1 + \alpha (T - T_0) \right]$$
Donde $\alpha > 0$ es el coeficiente de temperatura. En semiconductores, $\alpha < 0$ (la resistencia disminuye al calentarse).

---

## 2. Descarga de un Capacitor ($V_C(0) = V_0$)

Desconectada la fuente y cerrando el interruptor sobre la resistencia $R$:
$$q(t) = Q_0 e^{-t / \tau}, \qquad V_C(t) = V_0 e^{-t / \tau}, \qquad I(t) = -\frac{V_0}{R} e^{-t / \tau}$$
Para $t = 5\tau$, el condensador se considera plenamente descargado en ingeniería ($e^{-5} \approx 0.0067 < 1\%$).

---
title: "Termodinámica: Primer y Segundo Principio, Gases Ideales y Ciclo de Carnot"
unit: "Unidad 8: Termodinámica, Gases Ideales y Ciclo de Carnot"
order: 8
tags:
  - "termodinamica"
  - "primer-principio"
  - "carnot"
  - "gases-ideales"
  - "entropia"
  - "adiabatica"
  - "rendimiento"
description: "Transformaciones cuasiestáticas de gases ideales, balance energético del 1er principio, ciclo y rendimiento de Carnot y entropía en UTN FRRO."
variables:
  - symbol: '\Delta U = n C_v \Delta T'
    name: 'Variación de energía interna'
    unit: 'J'
    description: 'Función de estado que para un gas ideal depende exclusivamente de la temperatura'
  - symbol: 'W = \int P \, dV'
    name: 'Trabajo termodinámico de expansión'
    unit: 'J'
    description: 'Área bajo la curva en el diagrama de Clapeyron (P-V)'
  - symbol: '\eta_{\text{carnot}}'
    name: 'Rendimiento térmico del ciclo de Carnot'
    unit: 'adimensional'
    description: 'Límite superior absoluto de eficiencia para cualquier máquina térmica que opera entre T_C y T_F'
formulas:
  - id: 'primer-principio-termodinamica'
    name: 'Primer Principio de la Termodinámica (Criterio de Signos Tradicional)'
    latex: 'Q = \Delta U + W \iff \Delta U = Q - W \quad \left(W = \int_{V_1}^{V_2} P \, dV\right)'
    description: 'Conservación estricta de la energía en procesos termodinámicos cerrados.'
    tags: ["primer-principio", "calor", "trabajo", "energia-interna"]
  - id: 'transformacion-adiabatica-laplace'
    name: 'Ecuaciones de Laplace para Procesos Adiabáticos Reversibles'
    latex: 'P \cdot V^\gamma = \text{cte}, \qquad T \cdot V^{\gamma - 1} = \text{cte}, \qquad T^\gamma \cdot P^{1 - \gamma} = \text{cte} \quad \left(\gamma = \frac{C_p}{C_v}\right)'
    description: 'Expansión o compresión sin intercambio de calor (Q = 0) con gas ideal.'
    tags: ["adiabatica", "laplace", "gas-ideal"]
  - id: 'rendimiento-ciclo-carnot'
    name: 'Teorema y Rendimiento del Ciclo de Carnot'
    latex: '\eta_{\text{carnot}} = 1 - \frac{T_F}{T_C} \quad (T_F, T_C \text{ en Kelvin})'
    description: 'Formado por dos isotermas reversibles y dos adiabáticas reversibles.'
    tags: ["carnot", "segundo-principio", "rendimiento", "kelvin"]
  - id: 'variacion-entropia-clausius'
    name: 'Definición de Entropía de Clausius'
    latex: '\Delta S = \int_{A}^{B} \frac{dQ_{\text{rev}}}{T}, \qquad \Delta S_{\text{universo}} = \Delta S_{\text{sistema}} + \Delta S_{\text{entorno}} \ge 0'
    description: 'Mide el grado de irreversibilidad y degradación de la energía útil.'
    tags: ["entropia", "clausius", "segundo-principio"]
---

# Termodinámica Técnica y Ciclos de Potencia

En la UTN FRRO, la termodinámica de Física I sienta las bases de Máquinas Térmicas, Termodinámica Aplicada, Centrales Eléctricas y Motores de Combustión Interna.

---

## 1. Transformaciones de un Gas Ideal ($P V = n R T$)

| Proceso | Condición | Trabajo $W = \int P dV$ | Calor $Q$ | Energía Interna $\Delta U$ |
|---|---|---|---|---|
| **Isocórico** | $V = \text{cte}$ | $W = 0$ | $Q = n C_v \Delta T$ | $\Delta U = Q$ |
| **Isobárico** | $P = \text{cte}$ | $W = P(V_2 - V_1) = n R \Delta T$ | $Q = n C_p \Delta T$ | $\Delta U = n C_v \Delta T$ |
| **Isotérmico** | $T = \text{cte}$ | $W = n R T \ln\left(\frac{V_2}{V_1}\right)$ | $Q = W$ | $\Delta U = 0$ |
| **Adiabático** | $Q = 0$ | $W = -\Delta U = -n C_v (T_2 - T_1)$ | $Q = 0$ | $\Delta U = \frac{P_2 V_2 - P_1 V_1}{1 - \gamma}$ |

> [!NOTE]
> **Relación de Mayer:** Para cualquier gas ideal, la diferencia entre calores específicos molares es:
> $$C_p - C_v = R \approx 8.314 \, \frac{\text{J}}{\text{mol}\cdot\text{K}}$$
> - Para gas monoatómico ($\text{He}, \text{Ar}$): $C_v = \frac{3}{2}R, \; C_p = \frac{5}{2}R \implies \gamma = \frac{5}{3} \approx 1.67$.
> - Para gas diatómico ($\text{N}_2, \text{O}_2$, aire): $C_v = \frac{5}{2}R, \; C_p = \frac{7}{2}R \implies \gamma = \frac{7}{5} = 1.40$.

---

## 2. El Ciclo de Carnot

Constituye el ciclo más eficiente que puede operar entre una fuente caliente a temperatura absoluta $T_C$ y una fuente fría a $T_F$:

1. **Expansión isotérmica reversible** a $T_C$ (absorbe $Q_C = n R T_C \ln(V_2/V_1)$).
2. **Expansión adiabática reversible** (la temperatura desciende de $T_C$ a $T_F$).
3. **Compresión isotérmica reversible** a $T_F$ (cede calor $|Q_F| = n R T_F \ln(V_3/V_4)$).
4. **Compresión adiabática reversible** (la temperatura asciende de $T_F$ a $T_C$).

El rendimiento térmico es:
$$\eta = \frac{W_{\text{neto}}}{Q_C} = \frac{Q_C - |Q_F|}{Q_C} = 1 - \frac{|Q_F|}{Q_C} = \mathbf{1 - \frac{T_F}{T_C}}$$

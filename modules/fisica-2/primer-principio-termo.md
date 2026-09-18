---
title: "Primer Principio de la Termodinámica: Conservación de Energía y Procesos"
unit: "Termodinámica: Primer Principio"
order: 16
tags:
  - "fisica-2"
  - "primer-principio"
  - "energia-interna"
  - "trabajo-termodinamico"
  - "mayer"
  - "adiabatica"
  - "gas-ideal"
description: "Balance energético del Primer Principio, trabajo en transformaciones cuasiestáticas, relación de Mayer, ecuaciones de Laplace para procesos adiabáticos."
variables:
  - symbol: '\Delta U = n C_v \Delta T'
    name: 'Variación de energía interna'
    unit: 'J (Joule)'
    description: 'Función de estado que para un gas ideal depende únicamente de la temperatura absoluta T'
  - symbol: 'W = \int P \, dV'
    name: 'Trabajo mecánico de frontera móvil'
    unit: 'J (Joule)'
    description: 'Área bajo la trayectoria en el diagrama de Clapeyron (P-V)'
  - symbol: '\gamma = \frac{C_p}{C_v}'
    name: 'Coeficiente de dilatación adiabática (Poisson)'
    unit: 'adimensional'
    description: 'Razón entre capacidades caloríficas a presión constante y a volumen constante'
formulas:
  - id: 'primer-principio-conservacion'
    name: 'Primer Principio de la Termodinámica'
    latex: '\Delta U = Q - W \iff dU = \delta Q - \delta W \quad \left(W = \int_{V_1}^{V_2} P \, dV\right)'
    description: 'La energía interna es una función de estado exacta; el calor y el trabajo son funciones de trayectoria.'
    tags: ["primer-principio", "conservacion", "balance-energia"]
  - id: 'relacion-mayer-gases-ideales'
    name: 'Relación de Mayer para Gases Ideales'
    latex: 'C_p - C_v = R \approx 8.314 \, \frac{\text{J}}{\text{mol}\cdot\text{K}} \implies \gamma = \frac{C_p}{C_v} > 1'
    description: 'El trabajo de expansión realizado a presión constante explica el exceso de Cp sobre Cv.'
    tags: ["mayer", "capacidades-calorificas", "gas-ideal"]
  - id: 'ecuaciones-laplace-proceso-adiabatico'
    name: 'Ecuaciones de Laplace (Proceso Adiabático Reversible)'
    latex: 'P \cdot V^\gamma = \text{cte}, \qquad T \cdot V^{\gamma - 1} = \text{cte}, \qquad T^\gamma \cdot P^{1 - \gamma} = \text{cte}'
    description: 'Transformación sin transferencia de calor (Q = 0) con variación simultánea de P, V y T.'
    tags: ["laplace", "adiabatica", "poisson"]
  - id: 'trabajo-expansion-isoterma'
    name: 'Trabajo en Transformación Isotérmica Reversible'
    latex: 'W = n R T \ln\left(\frac{V_2}{V_1}\right) = n R T \ln\left(\frac{P_1}{P_2}\right) \quad (\Delta U = 0 \implies Q = W)'
    description: 'Todo el calor absorbido de la fuente térmica se convierte íntegramente en trabajo de expansión.'
    tags: ["isoterma", "trabajo", "expansion"]
---

# El Primer Principio de la Termodinámica

El Primer Principio es la formulación rigurosa de la Ley de Conservación de la Energía para sistemas en los cuales intervienen transferencias de calor y trabajo mecánico.

---

## 1. Tabla Resumen de Procesos Cuasiestáticos (Gas Ideal)

| Transformación | Condición | Trabajo $W = \int P dV$ | Calor $Q$ | Energía Interna $\Delta U$ |
|---|---|---|---|---|
| **Isocórica** | $V = \text{cte}$ | $W = 0$ | $Q = n C_v \Delta T$ | $\Delta U = Q$ |
| **Isobárica** | $P = \text{cte}$ | $W = P(V_2 - V_1) = n R \Delta T$ | $Q = n C_p \Delta T$ | $\Delta U = n C_v \Delta T$ |
| **Isotérmica** | $T = \text{cte}$ | $W = n R T \ln(V_2 / V_1)$ | $Q = W$ | $\Delta U = 0$ |
| **Adiabática** | $Q = 0$ | $W = -\Delta U = -n C_v \Delta T$ | $Q = 0$ | $\Delta U = \frac{P_2 V_2 - P_1 V_1}{1 - \gamma}$ |

---

## 2. Grados de Libertad y Coeficiente $\gamma$

Por el Teorema de Equipartición de la Energía:
- **Gas Monoatómico ($\text{He, Ne, Ar}$):** 3 grados de libertad traslacionales $\implies C_v = \frac{3}{2}R, \; C_p = \frac{5}{2}R \implies \gamma = \frac{5}{3} \approx 1.67$.
- **Gas Diatómico ($\text{N}_2, \text{O}_2$, Aire a temp. ambiente):** 3 traslacionales + 2 rotacionales $\implies C_v = \frac{5}{2}R, \; C_p = \frac{7}{2}R \implies \gamma = \frac{7}{5} = 1.40$.

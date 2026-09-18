---
title: "Segundo Principio de la Termodinámica: Máquinas Térmicas, Carnot y Entropía"
unit: "Termodinámica: Segundo Principio"
order: 17
tags:
  - "fisica-2"
  - "segundo-principio"
  - "carnot"
  - "maquinas-termicas"
  - "clausius"
  - "kelvin-planck"
  - "entropia"
  - "irreversibilidad"
description: "Enunciados de Kelvin-Planck y Clausius, rendimiento de máquinas térmicas y frigoríficas, ciclo de Carnot, desigualdad de Clausius y principio de aumento de entropía."
variables:
  - symbol: '\eta_{\text{carnot}} = 1 - \frac{T_F}{T_C}'
    name: 'Rendimiento límite de Carnot'
    unit: 'adimensional'
    description: 'Máxima eficiencia teórica alcanzable por cualquier ciclo operando entre TC y TF'
  - symbol: '\Delta S = \int \frac{\delta Q_{\text{rev}}}{T}'
    name: 'Variación de Entropía de Clausius'
    unit: 'J/K'
    description: 'Función de estado que cuantifica el grado de degradación y desorden microscópico'
formulas:
  - id: 'rendimiento-maquina-termica'
    name: 'Rendimiento de una Máquina Térmica Real'
    latex: '\eta = \frac{W_{\text{neto}}}{Q_C} = \frac{Q_C - |Q_F|}{Q_C} = 1 - \frac{|Q_F|}{Q_C} < \eta_{\text{carnot}}'
    description: 'QC es el calor absorbido de la caldera (fuente caliente) y QF el calor cedido al sumidero frío.'
    tags: ["rendimiento", "maquina-termica", "eficiencia"]
  - id: 'teorema-carnot-rendimiento'
    name: 'Teorema y Eficiencia del Ciclo de Carnot'
    latex: '\eta_{\text{carnot}} = 1 - \frac{T_F}{T_C} \quad (T_F, T_C \text{ en Kelvin})'
    description: 'Compuesto por dos isotermas reversibles y dos adiabáticas reversibles.'
    tags: ["carnot", "limite-teorico", "reversible"]
  - id: 'desigualdad-clausius-ciclos'
    name: 'Desigualdad de Clausius'
    latex: '\oint \frac{\delta Q}{T} \le 0 \quad (\text{= 0 para ciclo reversible, } < 0 \text{ para irreversible})'
    description: 'Criterio analítico universal para la viabilidad de cualquier proceso termodinámico cíclico.'
    tags: ["desigualdad-clausius", "entropia", "ciclo"]
  - id: 'aumento-entropia-universo'
    name: 'Principio del Aumento de Entropía del Universo'
    latex: '\Delta S_{\text{universo}} = \Delta S_{\text{sistema}} + \Delta S_{\text{entorno}} \ge 0'
    description: 'Todo proceso físico real e irreversible incrementa inexorablemente la entropía total del universo.'
    tags: ["segundo-principio", "flecha-tiempo", "entropia-universo"]
---

# El Segundo Principio de la Termodinámica y la Entropía

Mientras que el Primer Principio establece la conservación numérica de la energía, el Segundo Principio determina la **dirección natural y la degradación cualitativa** de los procesos espontáneos.

---

## 1. Enunciados Clásicos del Segundo Principio

1. **Enunciado de Kelvin-Planck:**
   > *Es imposible construir un dispositivo que opere en un ciclo y cuyo único efecto sea extraer calor de un único foco térmico y convertirlo íntegramente en una cantidad equivalente de trabajo mecánico.*
   (No existe el móvil perpetuo de segunda especie; $\eta < 100\%$).
2. **Enunciado de Clausius:**
   > *Es imposible construir un dispositivo que opere en un ciclo y cuyo único efecto sea transferir calor de un cuerpo más frío a otro más caliente sin el consumo simultáneo de trabajo exterior.*

---

## 2. Cálculo de la Variación de Entropía en Procesos Típicos

- **Expansión Isotérmica de Gas Ideal ($T = \text{cte}$):**
  $$\Delta S = \int \frac{\delta Q_{\text{rev}}}{T} = n R \ln\left(\frac{V_2}{V_1}\right)$$
- **Calentamiento a Presión Constante ($P = \text{cte}$):**
  $$\Delta S = \int_{T_1}^{T_2} \frac{m c_p \, dT}{T} = m c_p \ln\left(\frac{T_2}{T_1}\right)$$
- **Cambio de Fase Isotérmico a Temperatura $T_{\text{fase}}$:**
  $$\Delta S_{\text{fase}} = \frac{m L}{T_{\text{fase}}}$$

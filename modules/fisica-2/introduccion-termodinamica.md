---
title: "Introducción a la Termodinámica: Ley Cero, Escalas, Dilatación y Calorimetría"
unit: "Termodinámica: Introducción Termodinámica"
order: 15
tags:
  - "fisica-2"
  - "termodinamica"
  - "ley-cero"
  - "dilatacion"
  - "calorimetria"
  - "temperatura"
  - "calor-latente"
description: "Equilibrio térmico, Ley Cero de la Termodinámica, escalas termométricas absolutas, coeficientes de dilatación térmica y balance de calorimetría con cambios de fase."
variables:
  - symbol: 'T_K = T_C + 273.15'
    name: 'Temperatura Absoluta Kelvin'
    unit: 'K (Kelvin)'
    description: 'Escala termodinámica absoluta basada en el cero absoluto de agitación molecular'
  - symbol: 'c'
    name: 'Calor específico sensible'
    unit: 'J/(kg·K) o cal/(g·°C)'
    description: 'Cantidad de energía térmica necesaria para elevar 1 K la temperatura de 1 kg de sustancia'
  - symbol: 'L_f, \, L_v'
    name: 'Calor latente de cambio de fase'
    unit: 'J/kg'
    description: 'Energía absorbida o cedida durante una transición de fase a temperatura estrictamente constante'
formulas:
  - id: 'dilatacion-termica-solidos'
    name: 'Leyes de Dilatación Térmica (Lineal y Volumétrica)'
    latex: '\Delta L = \alpha \cdot L_0 \cdot \Delta T, \qquad \Delta V = \beta \cdot V_0 \cdot \Delta T \approx 3\alpha \cdot V_0 \cdot \Delta T'
    description: '\alpha es el coeficiente de dilatación lineal y \beta el volumétrico.'
    tags: ["dilatacion", "termica", "coeficiente-alfa"]
  - id: 'calor-sensible-calorimetria'
    name: 'Ecuación Fundamental de la Calorimetría'
    latex: 'Q = m \cdot c \cdot \Delta T = n \cdot C_m \cdot \Delta T'
    description: 'Calor absorbido (Q > 0) o cedido (Q < 0) sin cambio de fase del sistema.'
    tags: ["calor-sensible", "calorimetria", "capacidad-calorifica"]
  - id: 'calor-latente-cambio-fase'
    name: 'Calor Latente de Transición de Fase'
    latex: 'Q_L = \pm m \cdot L \quad (T = \text{constante durante el proceso})'
    description: 'Energía requerida para vencer las fuerzas de enlace intermolecular en cambios de estado.'
    tags: ["calor-latente", "fase", "fusion", "ebullicion"]
  - id: 'balance-calorimetrico-sistema-aislado'
    name: 'Principio de Conservación Térmica en Mezclas'
    latex: '\sum Q_{\text{absorbidos}} + \sum Q_{\text{cedidos}} = 0 \iff \sum Q_i = 0'
    description: 'Conservación de la energía térmica en un calorímetro ideal adiabático.'
    tags: ["balance-calor", "equilibrio-termico", "conservacion"]
---

# Introducción a la Termodinámica y Calorimetría

La termodinámica estudia las transformaciones mutuas entre energía térmica y trabajo mecánico en sistemas macroscópicos.

---

## 1. La Ley Cero de la Termodinámica

> *Si los cuerpos A y B están independientemente en equilibrio térmico con un tercer cuerpo C, entonces A y B se encuentran necesariamente en equilibrio térmico mutuo entre sí.*

Esta ley garantiza la existencia unívoca de la **temperatura** como propiedad macroscópica y fundamenta el funcionamiento de los termómetros.

---

## 2. Comportamiento Anómalo del Agua

A diferencia de la inmensa mayoría de los líquidos que se contraen continuamente al enfriarse, el agua líquida alcanza su **máxima densidad a $3.98^\circ\text{C}$**:
- Entre $0^\circ\text{C}$ y $4^\circ\text{C}$, el agua **se expande al enfriarse** ($\beta < 0$).
- Al congelarse en hielo, su volumen aumenta aproximadamente un 9%, flotando en la superficie y permitiendo la supervivencia de la vida acuática en lagos y océanos bajo el casquete de hielo superficial.

---
title: "Estática del Sólido Rígido y Teoría de la Elasticidad (Ley de Hooke y Módulo de Young)"
unit: "Unidad 6: Estática del Cuerpo Rígido y Elasticidad (Hooke/Young)"
order: 6
tags:
  - "estatica"
  - "equilibrio"
  - "elasticidad"
  - "modulo-young"
  - "hooke"
  - "esfuerzo-deformacion"
  - "poisson"
description: "Condiciones fundamentales de equilibrio estático, diagramas de cuerpo libre con vínculos mecánicos y ley de Hooke generalizada en UTN FRRO."
variables:
  - symbol: '\sigma = \frac{F_{\perp}}{A}'
    name: 'Esfuerzo normal (Tensión)'
    unit: 'Pa = N/m²'
    description: 'Fuerza perpendicular aplicada por unidad de área de sección transversal'
  - symbol: '\varepsilon = \frac{\Delta L}{L_0}'
    name: 'Deformación lineal unitaria'
    unit: 'adimensional'
    description: 'Cociente entre el alargamiento relativo y la longitud inicial del elemento'
  - symbol: 'Y'
    name: 'Módulo de Young (Elasticidad longitudinal)'
    unit: 'Pa = N/m²'
    description: 'Constante elástica intrínseca del material (ej. Acero \approx 200 \times 10^9 Pa)'
formulas:
  - id: 'condiciones-equilibrio-estatico'
    name: 'Condiciones Generales de Equilibrio Estático'
    latex: '\Sigma \vec{F}_{\text{ext}} = \mathbf{0} \quad \text{y} \quad \Sigma \vec{\tau}_{O,\text{ext}} = \mathbf{0} \quad (\forall O)'
    description: 'Equilibrio simultáneo de traslación y rotación respecto a cualquier punto de referencia.'
    tags: ["estatica", "equilibrio", "torque"]
  - id: 'ley-hooke-modulo-young'
    name: 'Ley de Hooke Unidimensional y Módulo de Young'
    latex: '\sigma = Y \cdot \varepsilon \iff \frac{F}{A} = Y \frac{\Delta L}{L_0} \implies \Delta L = \frac{F \cdot L_0}{A \cdot Y}'
    description: 'Alargamiento elástico de barras, tirantes y columnas sometidas a tracción o compresión axil.'
    tags: ["hooke", "young", "alargamiento", "elasticidad"]
  - id: 'energia-deformacion-elastica'
    name: 'Densidad de Energía de Deformación Elástica'
    latex: 'u = \frac{1}{2} \sigma \cdot \varepsilon = \frac{1}{2} Y \varepsilon^2 = \frac{\sigma^2}{2Y}'
    description: 'Energía interna por unidad de volumen almacenada bajo régimen elástico lineal.'
    tags: ["energia-deformacion", "resiliencia", "elasticidad"]
---

# Estática y Elasticidad en Ingeniería Mecánica y Civil

En la UTN FRRO, la estática y la teoría de la elasticidad de Física I preparan al estudiante para materias troncales como Estabilidad, Resistencia de Materiales y Elementos de Máquinas.

---

## 1. Condiciones de Equilibrio en el Plano

Para una estructura en dos dimensiones:

$$\Sigma F_x = 0, \qquad \Sigma F_y = 0, \qquad \Sigma \tau_O = 0$$

> [!NOTE]
> **Tipos de Apoyos y Reacciones:**
> 1. **Apoyo Simple o Móvil (Rodillo):** Restringe 1 grado de libertad (reacción perpendicular a la superficie $R_y$).
> 2. **Articulación Fija (Perno):** Restringe 2 grados de libertad (reacciones horizontal $R_x$ y vertical $R_y$).
> 3. **Empotramiento:** Restringe los 3 grados de libertad (reacciones $R_x, R_y$ y momento flector reactivo $M_z$).

---

## 2. Diagrama Tensión-Deformación ($\sigma - \varepsilon$)

Al ensayar una probeta metálica a tracción en máquina universal:
1. **Zona Proporcional / Elástica Lineal ($\sigma \le \sigma_p$):** Se cumple estrictamente la **Ley de Hooke** ($\sigma = Y \varepsilon$). Al retirar la carga, la deformación es 100% reversible ($\Delta L \to 0$).
2. **Límite Elástico ($\sigma_e$):** Máxima tensión antes de que aparezcan deformaciones permanentes.
3. **Zona de Fluencia o Cedencia ($\sigma_f$):** El material se deforma notablemente sin aumento de carga.
4. **Resistencia Última a Tracción ($\sigma_u$):** Pico máximo de la curva antes del inicio de la estricción.
5. **Punto de Rotura ($\sigma_r$):** Fractura mecánica del componente.

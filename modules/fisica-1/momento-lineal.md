---
title: "Cantidad de Movimiento, Impulso, Choques y Centro de Masa"
unit: "Unidad 4: Cantidad de Movimiento, Choques y Centro de Masa"
order: 4
tags:
  - "momento-lineal"
  - "impulso"
  - "choques"
  - "centro-masa"
  - "coeficiente-restitucion"
  - "colisiones"
description: "Teorema del impulso y la cantidad de movimiento, conservación en sistemas aislados, choques 1D/2D y cinemática del centro de masa en UTN FRRO."
variables:
  - symbol: '\vec{p} = m \vec{v}'
    name: 'Cantidad de movimiento (Momento lineal)'
    unit: 'kg·m/s'
    description: 'Magnitud vectorial que cuantifica el estado de inercia y movimiento traslacional'
  - symbol: '\vec{J} = \int \vec{F} \, dt'
    name: 'Impulso lineal'
    unit: 'N·s'
    description: 'Integral temporal de la fuerza neta que provoca la variación del momento'
  - symbol: 'e'
    name: 'Coeficiente de restitución'
    unit: 'adimensional'
    description: 'Medida de elasticidad del choque: e = 1 (elástico), 0 < e < 1 (inelástico), e = 0 (plástico)'
formulas:
  - id: 'teorema-impulso-momento-lineal'
    name: 'Teorema del Impulso y la Cantidad de Movimiento'
    latex: '\vec{J} = \int_{t_1}^{t_2} \Sigma \vec{F} \, dt = \Delta \vec{p} = m \vec{v}_f - m \vec{v}_0'
    description: 'El impulso resultante de todas las fuerzas externas equivale a la variación del momento lineal.'
    tags: ["impulso", "momento", "teorema"]
  - id: 'conservacion-momento-aislado'
    name: 'Ley de Conservación del Momento Lineal'
    latex: '\Sigma \vec{F}_{\text{ext}} = \mathbf{0} \implies \vec{P}_{\text{total}} = \sum_{i=1}^n m_i \vec{v}_i = \text{cte}'
    description: 'Válida en toda colisión durante el brevísimo intervalo de impacto.'
    tags: ["conservacion", "choques", "sistema-aislado"]
  - id: 'coeficiente-restitucion-newton'
    name: 'Coeficiente de Restitución de Newton (Choque 1D)'
    latex: 'e = -\frac{v_{2f} - v_{1f}}{v_{20} - v_{10}} = \frac{v_{\text{separacion}}}{v_{\text{aproximacion}}}'
    description: 'Determina la pérdida relativa de energía cinética tras el impacto.'
    tags: ["restitucion", "choque", "elasticidad"]
  - id: 'velocidad-choque-plastico'
    name: 'Velocidad Final en Choque Plástico / Totalmente Inelástico'
    latex: 'v_f = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}, \qquad \Delta E_c = \frac{1}{2} \frac{m_1 m_2}{m_1 + m_2} (v_1 - v_2)^2 \quad (\text{Pérdida máxima})'
    description: 'Los cuerpos continúan acoplados con una masa conjunta (m1 + m2).'
    tags: ["plastico", "perdida-energia", "choque-inelastico"]
---

# Cantidad de Movimiento y Colisiones

En la UTN FRRO, los problemas de colisiones mecánicas abordan el balance simultáneo de la cantidad de movimiento vectorial y las variaciones de energía cinética mecánica.

---

## 1. Tipología y Clasificación de Choques

1. **Choque Perfectamente Elástico ($e = 1$):**
   - Se conserva la cantidad de movimiento total: $\vec{P}_{\text{total}} = \text{cte}$.
   - Se conserva la energía cinética mecánica total: $\Delta E_c = 0$.
2. **Choque Inelástico Real ($0 < e < 1$):**
   - Se conserva $\vec{P}_{\text{total}}$, pero parte de $E_c$ se disipa en calor y deformación plástica permanente.
3. **Choque Totalmente Inelástico o Plástico ($e = 0$):**
   - Los cuerpos quedan adheridos y viajan a la misma velocidad común $v_f$. La pérdida de energía cinética es **máxima**.

---

## 2. Movimiento del Centro de Masa (CM)

Para un sistema de partículas discretas:

$$\vec{R}_{\text{cm}} = \frac{\sum m_i \vec{r}_i}{M_{\text{total}}}, \qquad \vec{V}_{\text{cm}} = \frac{\sum m_i \vec{v}_i}{M_{\text{total}}} = \frac{\vec{P}_{\text{total}}}{M_{\text{total}}}$$

$$\Sigma \vec{F}_{\text{ext}} = M_{\text{total}} \vec{A}_{\text{cm}}$$

> [!TIP]
> Si sobre un sistema cerrado no actúan fuerzas externas netas ($\Sigma \vec{F}_{\text{ext}} = \mathbf{0}$), el centro de masa se desplaza con **velocidad estrictamente constante** ($\vec{V}_{\text{cm}} = \text{cte}$), incluso si en el interior del sistema se producen explosiones, choques o reacciones químicas.

---
title: "Geometría Analítica en R3: Rectas Alabeadas, Haces de Planos y Distancias"
unit: "Unidad 3: Geometría Vectorial en R2 y R3"
order: 3
tags:
  - "vectores"
  - "rectas-alabeadas"
  - "distancia-rectas"
  - "haz-planos"
  - "producto-mixto"
  - "posicion-relativa"
description: "Distancia mínima entre rectas alabeadas por producto mixto, haz de planos secantes y posiciones relativas en el espacio euclídeo."
variables:
  - symbol: 'd(r_1, r_2)'
    name: 'Distancia mínima entre dos rectas alabeadas'
    description: 'Longitud del segmento perpendicular común a ambas rectas'
  - symbol: '[\vec{P_1P_2}, \vec{v_1}, \vec{v_2}]'
    name: 'Producto mixto'
    description: 'Determinante 3x3 que evalúa si las rectas son coplanares (= 0) o alabeadas (\neq 0)'
  - symbol: '\pi: Ax + By + Cz + D = 0'
    name: 'Ecuación general del plano'
    description: '\vec{n} = (A, B, C) es el vector normal ortogonal al plano'
formulas:
  - id: 'distancia-rectas-alabeadas'
    name: 'Distancia entre Rectas Alabeadas (No Coplanares)'
    latex: 'd(r_1, r_2) = \frac{|(\vec{P_2} - \vec{P_1}) \cdot (\vec{v_1} \times \vec{v_2})|}{\|\vec{v_1} \times \vec{v_2}\|}'
    description: 'Proyección del vector que une dos puntos de las rectas sobre el vector perpendicular común.'
    tags: ["alabeadas", "distancia", "producto-mixto"]
  - id: 'haz-planos-recta'
    name: 'Ecuación del Haz de Planos Secantes a una Recta r'
    latex: '\alpha (A_1 x + B_1 y + C_1 z + D_1) + \beta (A_2 x + B_2 y + C_2 z + D_2) = 0 \quad (\alpha, \beta \text{ no simultáneamente nulos})'
    description: 'Familia de todos los infinitos planos del espacio que contienen a la recta r.'
    tags: ["haz-planos", "interseccion", "familia"]
  - id: 'distancia-punto-recta-r3'
    name: 'Distancia de un Punto Q a una Recta r en R^3'
    latex: 'd(Q, r) = \frac{\|(\vec{Q} - \vec{P_0}) \times \vec{v}\|}{\|\vec{v}\|}'
    description: 'Cociente entre el área del paralelogramo generado y la base (módulo del vector director).'
    tags: ["distancia", "punto-recta", "vectorial"]
---

# Geometría Vectorial y Espacios Euclídeos

En robótica espacial, diseño asistido por computadora (CAD) e ingeniería civil, la geometría en $\mathbb{R}^3$ rige el posicionamiento y la orientación de elementos estructurales y cinemáticos.

---

## 1. Clasificación de Posiciones Relativas entre Dos Rectas en $\mathbb{R}^3$

Dadas $r_1: P_1 + \lambda \vec{v_1}$ y $r_2: P_2 + \mu \vec{v_2}$:

1. **¿Son $\vec{v_1}$ y $\vec{v_2}$ paralelos? ($\vec{v_1} \times \vec{v_2} = \mathbf{0}$):**
   - Si $P_1 \in r_2 \implies$ **Rectas coincidentes**.
   - Si $P_1 \notin r_2 \implies$ **Rectas paralelas distintas** ($d(r_1, r_2) = \frac{\|(\vec{P_2}-\vec{P_1}) \times \vec{v_1}\|}{\|\vec{v_1}\|}$).
2. **Si $\vec{v_1}$ y $\vec{v_2}$ no son paralelos ($\vec{v_1} \times \vec{v_2} \neq \mathbf{0}$):**
   - Si el producto mixto $[(\vec{P_2} - \vec{P_1}), \vec{v_1}, \vec{v_2}] = 0 \implies$ **Rectas secantes** (se cortan en un único punto $Q$).
   - Si el producto mixto $[(\vec{P_2} - \vec{P_1}), \vec{v_1}, \vec{v_2}] \neq 0 \implies$ **Rectas alabeadas** (se cruzan en el espacio sin cortarse jamás).

---

## 2. El Método del Haz de Planos

Para hallar la ecuación de un plano $\pi$ que contiene a una recta $r$ (dada como intersección de dos planos $\pi_1 = 0$ y $\pi_2 = 0$) y además satisface una condición extra (como pasar por un punto $P_0$ exterior):

1. Se plantea el haz: $\pi_1 + k \cdot \pi_2 = 0$.
2. Se sustituyen las coordenadas de $P_0$ para despejar el escalar $k$.
3. Se expande algebraicamente para obtener la ecuación general única $Ax + By + Cz + D = 0$.

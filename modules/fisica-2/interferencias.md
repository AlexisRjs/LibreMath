---
title: "Interferencia Lumínica: Experimento de Young, Láminas Delgadas y Michelson"
unit: "Óptica Física: Interferencias"
order: 13
tags:
  - "fisica-2"
  - "interferencia"
  - "young"
  - "doble-rendija"
  - "laminas-delgadas"
  - "coherencia"
  - "michelson"
description: "Condiciones de coherencia de fuentes, interferencia de Young por doble rendija, franjas brillantes y oscuras, reflexión con salto de fase y películas antirreflectantes."
variables:
  - symbol: 'd'
    name: 'Distancia de separación entre las rendijas'
    unit: 'm'
    description: 'Separación micrométrica entre los dos centros emisores de ondas coherentes'
  - symbol: '\Delta y = \frac{\lambda L}{d}'
    name: 'Interfranja (Distancia entre franjas consecutivas)'
    unit: 'm'
    description: 'Espaciado lineal constante entre dos máximos de iluminación consecutivos sobre la pantalla'
  - symbol: 'm = 0, \pm 1, \pm 2, \dots'
    name: 'Orden del máximo o mínimo de interferencia'
    unit: 'adimensional'
    description: 'Número entero que identifica la franja de interferencia'
formulas:
  - id: 'condicion-maximos-interferencia-young'
    name: 'Condición de Interferencia Constructiva (Máximos)'
    latex: 'd \sin(\theta) = m \cdot \lambda \implies y_m \approx m \frac{\lambda L}{d} \quad (m = 0, \pm 1, \pm 2, \dots)'
    description: 'La diferencia de camino \Delta r es un múltiplo entero exacto de la longitud de onda.'
    tags: ["maximos", "constructiva", "young", "interferencia"]
  - id: 'condicion-minimos-interferencia-young'
    name: 'Condición de Interferencia Destructiva (Mínimos / Franjas Oscuras)'
    latex: 'd \sin(\theta) = \left(m + \frac{1}{2}\right)\lambda \implies y''_m \approx \left(m + \frac{1}{2}\right)\frac{\lambda L}{d}'
    description: 'Las ondas llegan a la pantalla en contrafase exacta (desfase de 180° = \pi rad).'
    tags: ["minimos", "destructiva", "franja-oscura"]
  - id: 'distribucion-intensidad-doble-rendija'
    name: 'Distribución de Intensidad en Doble Rendija'
    latex: 'I(\theta) = 4 I_0 \cos^2\left(\frac{\pi d \sin\theta}{\lambda}\right) = 4 I_0 \cos^2\left(\frac{\phi}{2}\right)'
    description: 'I_0 es la intensidad emitida por una sola rendija aislada.'
    tags: ["intensidad", "patron-interferencia", "coseno"]
  - id: 'laminas-delgadas-pelicula-antirreflejo'
    name: 'Interferencia en Láminas Delgadas (Salto de Fase \pi)'
    latex: '2 n t = \left(m + \frac{1}{2}\right)\lambda \quad (\text{Constructiva con 1 reflexión dura}), \qquad 2nt = m\lambda \quad (\text{Destructiva})'
    description: 'Al reflejarse en un medio con mayor índice óptico (n2 > n1), la onda experimenta un salto de fase de \pi rad (\lambda/2).'
    tags: ["laminas-delgadas", "salto-fase", "antirreflejo"]
---

# Fenómenos de Interferencia Óptica

La interferencia es el resultado de la superposición de dos o más trenes de ondas coherentes, donde la intensidad resultante en cada punto del espacio depende de la diferencia de fase relativa entre ellas.

---

## 1. El Experimento Histórico de Thomas Young (1801)

Young dividió un frente de onda mediante dos rendijas micrométricas paralelas $S_1$ y $S_2$ separadas por una distancia $d$:
- Para ángulos pequeños ($\sin\theta \approx \tan\theta = y/L$):
  - El máximo central ($m = 0$) tiene intensidad cuádruple $4I_0$.
  - El espaciado entre franjas consecutivas es constante: $\mathbf{\Delta y = \frac{\lambda L}{d}}$.
  - Si se utiliza luz blanca policromática, el máximo central es blanco puro, mientras que los órdenes superiores muestran franjas irisadas con el violeta más cercano al centro y el rojo más alejado.

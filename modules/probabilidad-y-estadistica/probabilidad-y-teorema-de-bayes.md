---
title: "Espacios de Probabilidad, Regla del Producto, Probabilidad Total y Teorema de Bayes"
unit: "Unidad 1: Espacios de Probabilidad, Probabilidad Condicional y Teorema de Bayes"
order: 1
tags:
  - "pye"
  - "utn-frro"
  - "probabilidad"
  - "axiomas-kolmogorov"
  - "bayes"
  - "probabilidad-total"
  - "independencia"
description: "Axiomática de Kolmogorov, cálculo combinatorio, probabilidad condicional, regla de la multiplicación, particiones del espacio muestral, teorema de probabilidad total y teorema de Bayes con aplicaciones a diagnóstico e ingeniería."
variables:
  - symbol: 'P(A)'
    name: 'Probabilidad del evento A'
    description: 'Medida acotada en [0, 1] que cuantifica la certidumbre de ocurrencia del suceso A'
  - symbol: 'P(A \mid B)'
    name: 'Probabilidad condicional de A dado B'
    description: 'Probabilidad de ocurrencia de A sabiendo que el evento B ya ha ocurrido con P(B) > 0'
formulas:
  - id: 'probabilidad-condicional-def'
    name: 'Definición de Probabilidad Condicional'
    latex: 'P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad \text{con } P(B) > 0'
    description: 'Razón entre la probabilidad de la intersección y la probabilidad del evento condicionante.'
    tags: ["probabilidad", "condicional", "definicion"]
  - id: 'teorema-probabilidad-total'
    name: 'Teorema de la Probabilidad Total'
    latex: 'P(B) = \sum_{i=1}^{n} P(B \mid A_i) \cdot P(A_i)'
    description: 'Permite calcular la probabilidad de un evento B a través de una partición exhaustiva y excluyente {A_1, ..., A_n}.'
    tags: ["probabilidad-total", "particion", "teorema"]
  - id: 'teorema-de-bayes'
    name: 'Teorema de Bayes (Actualización de Probabilidades a Posteriori)'
    latex: 'P(A_k \mid B) = \frac{P(B \mid A_k) \cdot P(A_k)}{\sum_{i=1}^{n} P(B \mid A_i) \cdot P(A_i)}'
    description: 'Fórmula fundamental de inferencia bayesiana: probabilidad a posteriori de la causa A_k dado el efecto observado B.'
    tags: ["bayes", "posteriori", "priori", "inferencia"]
  - id: 'independencia-eventos'
    name: 'Condición de Independencia Estadística'
    latex: 'A \text{ y } B \text{ independientes} \iff P(A \cap B) = P(A) \cdot P(B)'
    description: 'Dos eventos son estadísticamente independientes si y solo si la probabilidad de su intersección es el producto de sus probabilidades marginales.'
    tags: ["independencia", "eventos"]
---

# Probabilidad Clásica y Teorema de Bayes (UTN FRRO)

La teoría de probabilidades formaliza el estudio riguroso de fenómenos y experimentos aleatorios donde el resultado exacto no puede determinarse a priori con certeza.

---

## 1. Axiomática de Kolmogorov

Sea $\Omega$ el **espacio muestral** (conjunto de todos los resultados posibles) y $\mathcal{F}$ la $\sigma$-álgebra de eventos:

1. **No Negatividad**: Para todo evento $A$, $P(A) \ge 0$.
2. **Certeza**: $P(\Omega) = 1$.
3. **Aditividad Fuerte (Eventos Mutuamente Excluyentes)**:
   Si $A_1, A_2, \dots$ es una secuencia de eventos disjuntos dos a dos ($A_i \cap A_j = \emptyset$ para $i \ne j$), entonces:
   $$P\left( \bigcup_{i=1}^{\infty} A_i \right) = \sum_{i=1}^{\infty} P(A_i)$$

### Propiedades Inmediatas Derivadas
* Probabilidad del suceso vacío: $P(\emptyset) = 0$.
* Evento complementario: $P(A^c) = 1 - P(A)$.
* Regla general de la adición (no disjuntos):
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
* Si $A \subseteq B \implies P(A) \le P(B)$.

---

## 2. Probabilidad Condicional e Independencia

La ocurrencia de información previa modifica el espacio muestral efectivo:

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)} \quad \implies \quad P(A \cap B) = P(B) \cdot P(A \mid B) = P(A) \cdot P(B \mid A)$$

### Criterio de Independencia
Dos sucesos $A$ y $B$ son **estocásticamente independientes** si y solo si:
$$P(A \cap B) = P(A) \cdot P(B)$$
O equivalentemente: $P(A \mid B) = P(A)$ y $P(B \mid A) = P(B)$.

> **Atención en exámenes UTN FRRO:**
> Mutuamente excluyentes ($A \cap B = \emptyset$) **NO** es lo mismo que independientes. De hecho, si dos eventos con probabilidad no nula son mutuamente excluyentes, ¡son fuertemente dependientes porque si ocurre uno, el otro jamás puede ocurrir ($P(A \cap B) = 0 \ne P(A)P(B)$)!

---

## 3. Teorema de la Probabilidad Total y Teorema de Bayes

Sea $\{A_1, A_2, \dots, A_n\}$ una **partición** del espacio muestral $\Omega$, lo que significa:
1. $A_i \cap A_j = \emptyset$ para todo $i \ne j$ (disjuntos).
2. $\bigcup_{i=1}^n A_i = \Omega$ (exhaustivos).
3. $P(A_i) > 0$ para todo $i$.

### Teorema de la Probabilidad Total
Para cualquier evento arbitrario $B \subseteq \Omega$:
$$P(B) = \sum_{i=1}^n P(A_i \cap B) = \sum_{i=1}^n P(A_i) \cdot P(B \mid A_i)$$

### Teorema de Bayes
Permite "invertir" el condicionamiento para calcular la probabilidad de una causa $A_k$ habiendo observado la evidencia o síntoma $B$:

$$P(A_k \mid B) = \frac{P(A_k \cap B)}{P(B)} = \frac{P(B \mid A_k) \cdot P(A_k)}{\sum_{i=1}^n P(B \mid A_i) \cdot P(A_i)}$$

* $P(A_k)$: **Probabilidad a priori** (antes de observar la evidencia).
* $P(B \mid A_k)$: **Verosimilitud** (*likelihood*).
* $P(A_k \mid B)$: **Probabilidad a posteriori** (actualizada con los datos).

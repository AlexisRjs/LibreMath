---
title: "Espacios y Subespacios Vectoriales, Bases, Dimensión y Teorema de Grassmann"
unit: "Unidad 4: Espacios y Subespacios Vectoriales, Bases y Dimensión"
order: 4
tags:
  - "espacios-vectoriales"
  - "subespacios"
  - "independencia-lineal"
  - "base"
  - "dimension"
  - "grassmann"
  - "cambio-base"
description: "Condición de subespacio, combinaciones lineales, bases, coordenadas, suma directa y fórmula de las dimensiones de Grassmann en la UTN FRRO."
variables:
  - symbol: 'S \le V'
    name: 'Subespacio vectorial de V'
    description: 'Subconjunto no vacío que hereda la estructura de espacio vectorial sobre el cuerpo real'
  - symbol: '\dim(V)'
    name: 'Dimensión del espacio vectorial'
    description: 'Número cardinal de vectores que componen cualquier base de V'
  - symbol: '[v]_B'
    name: 'Vector de coordenadas respecto a la base B'
    description: 'Escalares únicos (\alpha_1, ..., \alpha_n) tales que v = \sum \alpha_i v_i'
formulas:
  - id: 'condicion-subespacio-vectorial'
    name: 'Condición Necesaria y Suficiente de Subespacio'
    latex: 'S \subseteq V \text{ es subespacio } \iff \begin{cases} 1) \; \mathbf{0} \in S \\ 2) \; \forall \mathbf{u}, \mathbf{v} \in S \implies \mathbf{u} + \mathbf{v} \in S \\ 3) \; \forall \alpha \in \mathbb{R}, \, \forall \mathbf{u} \in S \implies \alpha \mathbf{u} \in S \end{cases}'
    description: 'Criterio analítico para verificar si un subconjunto cerrado es subespacio vectorial.'
    tags: ["subespacio", "condicion", "criterio"]
  - id: 'teorema-dimensiones-grassmann'
    name: 'Fórmula de las Dimensiones de Grassmann'
    latex: '\dim(S_1 + S_2) = \dim(S_1) + \dim(S_2) - \dim(S_1 \cap S_2)'
    description: 'Relaciona la dimensión de la suma de subespacios con la de su intersección.'
    tags: ["grassmann", "dimensiones", "suma-interseccion"]
  - id: 'suma-directa-condicion'
    name: 'Condición de Suma Directa (S_1 \oplus S_2)'
    latex: 'S_1 \oplus S_2 \iff S_1 \cap S_2 = \{ \mathbf{0} \} \iff \dim(S_1 + S_2) = \dim(S_1) + \dim(S_2)'
    description: 'Descomposición única de cualquier vector de la suma como suma de elementos de cada subespacio.'
    tags: ["suma-directa", "interseccion-trivial"]
  - id: 'matriz-cambio-base'
    name: 'Ecuación de Cambio de Base'
    latex: '[\mathbf{v}]_B = P_{B \leftarrow B''} \cdot [\mathbf{v}]_{B''} \quad \text{donde } P = [ [v''_1]_B \mid [v''_2]_B \mid \cdots \mid [v''_n]_B ]'
    description: 'Las columnas de la matriz de pasaje son las coordenadas de los vectores de B'' expresados en la base B.'
    tags: ["cambio-base", "matriz-pasaje", "coordenadas"]
---

# Espacios Vectoriales, Bases y Dimensión

La teoría de espacios vectoriales en la UTN FRRO es el puente conceptual que unifica los sistemas de ecuaciones lineales, los polinomios, las matrices y las soluciones de ecuaciones diferenciales.

---

## 1. Verificación de Subespacios en Exámenes

Para determinar si un conjunto $S = \{ (x, y, z) \in \mathbb{R}^3 : f(x, y, z) = 0 \}$ es subespacio:

> [!WARNING]
> **Trampa clásica de parcial:**
> - Si la ecuación es **afín no homogénea** (ej. $2x - y + 3z = 4$), el vector nulo **$\mathbf{0} = (0, 0, 0)$ no pertenece a $S$**, por lo que **NO es subespacio**.
> - Si la ecuación contiene términos cuadráticos o productos cruzados (ej. $x \cdot y = 0$ o $x^2 + y^2 = z^2$), falla la clausura bajo la suma de vectores.
> - Sólo los planos o rectas que **pasan por el origen** ($Ax + By + Cz = 0$) son subespacios vectoriales de $\mathbb{R}^3$.

---

## 2. Dependencia e Independencia Lineal

Un conjunto de vectores $\{ \mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_k \}$ es **linealmente independiente (LI)** si:

$$c_1 \mathbf{v}_1 + c_2 \mathbf{v}_2 + \cdots + c_k \mathbf{v}_k = \mathbf{0} \implies c_1 = c_2 = \cdots = c_k = 0$$

> [!TIP]
> **Método matricial rápido en $\mathbb{R}^n$:**
> Se colocan los vectores como filas (o columnas) de una matriz $A$.
> - Si $\det(A) \neq 0$ (o $\text{rg}(A) = k = n$), el conjunto es **LI y forma una base**.
> - Si $\det(A) = 0$ (o $\text{rg}(A) < k$), los vectores son **linealmente dependientes (LD)**.

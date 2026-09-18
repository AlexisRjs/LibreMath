---
title: "Matrices, Álgebra de Bloques, Determinantes y Matriz Adjunta"
unit: "Unidad 1: Matrices y Determinantes"
order: 1
tags:
  - "matrices"
  - "determinantes"
  - "inversa"
  - "adjunta"
  - "gauss-jordan"
  - "ortogonales"
  - "laplace"
description: "Propiedades algebraicas rigurosas, algoritmo de inversión de Gauss-Jordan, identidades de la matriz adjunta y matrices ortogonales."
variables:
  - symbol: 'A \in \mathbb{R}^{n \times n}'
    name: 'Matriz cuadrada real de orden n'
    description: 'Operador lineal en espacio vectorial euclídeo'
  - symbol: '\det(A)'
    name: 'Determinante escalar'
    description: 'Factor de dilatación de volumen del paralelepípedo generado por sus columnas'
  - symbol: '\text{Adj}(A) = [C_{ij}]^T'
    name: 'Matriz Adjunta (Traspuesta de Cofactores)'
    description: 'Matriz formada por los cofactores algebraicos traspuestos'
formulas:
  - id: 'identidad-matriz-adjunta'
    name: 'Teorema de la Matriz Adjunta e Inversa'
    latex: 'A \cdot \text{Adj}(A) = \text{Adj}(A) \cdot A = \det(A) \cdot I_n \implies A^{-1} = \frac{1}{\det(A)} \text{Adj}(A)'
    description: 'Relación exacta entre la matriz, su adjunta y la matriz identidad de orden n.'
    tags: ["adjunta", "identidad", "inversa"]
  - id: 'determinante-adjunta'
    name: 'Determinante de la Matriz Adjunta'
    latex: '\det(\text{Adj}(A)) = [\det(A)]^{n - 1} \quad (A \in \mathbb{R}^{n \times n})'
    description: 'Identidad clásica en ejercicios de examen teórico de álgebra lineal.'
    tags: ["teorema", "determinante", "adjunta"]
  - id: 'matriz-ortogonal-def'
    name: 'Condición de Matriz Ortogonal'
    latex: 'A^T \cdot A = A \cdot A^T = I \iff A^{-1} = A^T \implies \det(A) = \pm 1'
    description: 'Conserva el producto escalar, longitudes y ángulos (isometría euclídea).'
    tags: ["ortogonal", "isometria", "traspuesta"]
  - id: 'desarrollo-laplace-fila-columna'
    name: 'Desarrollo de Laplace por Fila i o Columna j'
    latex: '\det(A) = \sum_{j=1}^n a_{ij} (-1)^{i+j} M_{ij} = \sum_{i=1}^n a_{ij} (-1)^{i+j} M_{ij}'
    description: 'Desarrollo por cofactores adecuado para matrices dispersas o con ceros.'
    tags: ["laplace", "cofactores", "menores"]
---

# Álgebra Matricial y Determinantes en Ingeniería

En ingeniería, las matrices modelan sistemas mecánicos discretos, redes de distribución eléctrica, estados cuánticos y operadores de deformación en elasticidad.

---

## 1. Algoritmo de Inversión de Gauss-Jordan

Para calcular la inversa $A^{-1}$ de forma eficiente y numérica (sin calcular $n^2$ determinantes):

1. Se construye la matriz aumentada $[A \mid I_n]$ con la matriz identidad a la derecha.
2. Se aplican operaciones elementales sobre filas hasta transformar el bloque izquierdo en la matriz identidad escalonada reducida:
$$[A \mid I_n] \xrightarrow{\text{Operaciones Elementales}} [I_n \mid A^{-1}]$$

> [!NOTE]
> Si en algún momento del proceso aparece una fila nula en el bloque izquierdo, el rango de $A$ es estrictamente menor que $n$, por lo que **$\det(A) = 0$ y la matriz no es invertible**.

---

## 2. Propiedades Avanzadas del Determinante

Para matrices cuadradas $A, B \in \mathbb{R}^{n \times n}$ y escalar $k \in \mathbb{R}$:

- $\det(A \cdot B) = \det(A) \cdot \det(B)$
- $\det(k \cdot A) = k^n \det(A)$ *(¡Trampa común: no olvidar la potencia $n$!)*
- $\det(A^T) = \det(A)$
- $\det(A^{-1}) = \frac{1}{\det(A)}$
- $\det(A) = 0 \iff$ las filas (o columnas) de $A$ son **linealmente dependientes**.

---

## 3. Demostración de $\det(\text{Adj}(A)) = [\det(A)]^{n-1}$

Partiendo de la identidad fundamental:
$$A \cdot \text{Adj}(A) = \det(A) \cdot I_n$$

Tomando determinantes a ambos miembros:
$$\det(A \cdot \text{Adj}(A)) = \det(\det(A) \cdot I_n)$$
$$\det(A) \cdot \det(\text{Adj}(A)) = [\det(A)]^n \cdot \det(I_n)$$

Como $\det(I_n) = 1$, dividiendo ambos miembros por $\det(A)$ (asumiendo $\det(A) \neq 0$):
$$\det(\text{Adj}(A)) = [\det(A)]^{n - 1}$$

---
title: "Sistemas de Ecuaciones Lineales: Discusión Paramétrica y Teorema de Rouché-Frobenius"
unit: "Unidad 2: Sistemas de Ecuaciones Lineales"
order: 2
tags:
  - "sistemas"
  - "rouche-frobenius"
  - "gauss-jordan"
  - "parametros"
  - "subespacio-solucion"
description: "Clasificación de sistemas lineales con parámetros reales, teorema de Rouché-Frobenius y estructura afín de las soluciones."
variables:
  - symbol: 'A \mathbf{x} = \mathbf{b}'
    name: 'Sistema lineal en notación matricial'
    description: 'A matriz de coeficientes (m x n), b vector de términos independientes'
  - symbol: '\text{rg}(A)'
    name: 'Rango de la matriz principal'
    description: 'Número máximo de filas o columnas linealmente independientes'
  - symbol: '\text{rg}(A|\mathbf{b})'
    name: 'Rango de la matriz ampliada'
    description: 'Rango incluyendo la columna del vector de términos independientes'
formulas:
  - id: 'rouche-frobenius-general'
    name: 'Teorema de Rouché-Frobenius Completo'
    latex: '\begin{cases} \text{rg}(A) \neq \text{rg}(A|\mathbf{b}) & \implies \text{Sistema Incompatible (SI) } \implies \mathcal{S} = \emptyset \\ \text{rg}(A) = \text{rg}(A|\mathbf{b}) = n & \implies \text{Compatible Determinado (SCD) } \implies \text{Solución única} \\ \text{rg}(A) = \text{rg}(A|\mathbf{b}) = r < n & \implies \text{Compatible Indeterminado (SCI) } \implies \infty^{n-r} \text{ soluciones} \end{cases}'
    description: 'Condición necesaria y suficiente para existencia y dimensionalidad del conjunto solución.'
    tags: ["rouche-frobenius", "clasificacion", "grados-libertad"]
  - id: 'estructura-solucion-afin'
    name: 'Estructura Afín del Conjunto Solución'
    latex: '\mathcal{S} = \mathbf{x}_p + \text{Nu}(A) = \{ \mathbf{x}_p + \mathbf{x}_h : A \mathbf{x}_h = \mathbf{0} \}'
    description: 'Toda solución es suma de una solución particular más una solución del sistema homogéneo asociado.'
    tags: ["nucleo", "solucion-particular", "espacio-afin"]
---

# Sistemas Lineales y Discusión con Parámetros

El análisis de compatibilidad de sistemas de ecuaciones lineales es el núcleo del análisis estático de estructuras reticuladas, redes de Kirchhoff y balance de flujos en ingeniería química.

---

## 1. Discusión Paramétrica: El Ejercicio Clásico de Parcial

**Consigna de Examen:** Discutir la compatibilidad del siguiente sistema según los valores del parámetro $k \in \mathbb{R}$:

$$\begin{cases} x + y + k z = 1 \\ x + k y + z = 1 \\ k x + y + z = 1 \end{cases}$$

### Paso 1: Cálculo del determinante de la matriz de coeficientes $A$
$$|A| = \begin{vmatrix} 1 & 1 & k \\ 1 & k & 1 \\ k & 1 & 1 \end{vmatrix}$$

Sumando la fila 2 y la fila 3 a la fila 1:
$$|A| = \begin{vmatrix} k+2 & k+2 & k+2 \\ 1 & k & 1 \\ k & 1 & 1 \end{vmatrix} = (k+2) \begin{vmatrix} 1 & 1 & 1 \\ 1 & k & 1 \\ k & 1 & 1 \end{vmatrix}$$

Restando la columna 1 a las columnas 2 y 3:
$$|A| = (k+2) \begin{vmatrix} 1 & 0 & 0 \\ 1 & k-1 & 0 \\ k & 1-k & 1-k \end{vmatrix} = (k+2)(k-1)(1-k) = -(k+2)(k-1)^2$$

### Paso 2: Análisis de casos
- **Caso 1: $k \neq 1$ y $k \neq -2$:**
  $\det(A) \neq 0 \implies \text{rg}(A) = \text{rg}(A|\mathbf{b}) = 3$ (número de incógnitas).
  $\implies$ **Sistema Compatible Determinado (SCD)** con solución única.

- **Caso 2: $k = 1$:**
  Las tres ecuaciones son idénticas: $x + y + z = 1$.
  $\text{rg}(A) = \text{rg}(A|\mathbf{b}) = 1 < 3$.
  $\implies$ **Sistema Compatible Indeterminado (SCI)** con $3 - 1 = 2$ grados de libertad (un plano en $\mathbb{R}^3$).

- **Caso 3: $k = -2$:**
  $\text{rg}(A) = 2$. Evaluando la matriz ampliada:
  Sumando las 3 filas: $(1+1-2)x + (1-2+1)y + (-2+1+1)z = 1+1+1 \implies 0 = 3$ (absurdo).
  $\implies \text{rg}(A) = 2 \neq \text{rg}(A|\mathbf{b}) = 3 \implies$ **Sistema Incompatible (SI)**.

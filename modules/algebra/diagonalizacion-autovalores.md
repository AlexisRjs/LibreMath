---
title: "Autovalores, Autovectores, Diagonalización y Teorema Espectral"
unit: "Unidad 6: Autovalores, Autovectores y Diagonalización"
order: 6
tags:
  - "autovalores"
  - "autovectores"
  - "diagonalizacion"
  - "cayley-hamilton"
  - "teorema-espectral"
  - "multiplicidad"
description: "Cálculo de espectro propio, autoespacios, multiplicidades algebraicas y geométricas, y diagonalización ortogonal en la UTN FRRO."
variables:
  - symbol: '\lambda_i'
    name: 'Autovalor (Valor propio)'
    description: 'Raíz real de la ecuación característica \det(A - \lambda I) = 0'
  - symbol: 'S_{\lambda} = \ker(A - \lambda I)'
    name: 'Autoespacio asociado'
    description: 'Subespacio vectorial formado por todos los autovectores correspondientes a \lambda'
  - symbol: 'm_a(\lambda), m_g(\lambda)'
    name: 'Multiplicidades algebraica y geométrica'
    description: 'm_a: orden de multiplicidad de la raíz en P(\lambda); m_g = \dim(S_\lambda)'
formulas:
  - id: 'ecuacion-caracteristica-autovalores'
    name: 'Ecuación Característica'
    latex: 'P(\lambda) = \det(A - \lambda I_n) = (-1)^n \lambda^n + (-1)^{n-1} \text{Tr}(A) \lambda^{n-1} + \cdots + \det(A) = 0'
    description: 'Polinomio de grado n cuyas raíces determinan el espectro del operador matricial.'
    tags: ["caracteristica", "autovalor", "espectro"]
  - id: 'teorema-diagonalizacion-completo'
    name: 'Condición Necesaria y Suficiente de Diagonalizabilidad'
    latex: 'A \text{ es diagonalizable } \iff \sum_{i=1}^k m_a(\lambda_i) = n \quad \text{y} \quad m_g(\lambda_i) = m_a(\lambda_i) \; \forall i \in \{1, \dots, k\}'
    description: 'Garantiza la existencia de una base de autovectores en R^n tal que A = P D P^{-1}.'
    tags: ["diagonalizacion", "criterio", "autoespacios"]
  - id: 'potencias-matriz-diagonal'
    name: 'Cálculo de Potencias Elevadas A^k'
    latex: 'A^k = P \cdot D^k \cdot P^{-1} = P \cdot \begin{pmatrix} \lambda_1^k & 0 & \cdots \\ 0 & \lambda_2^k & \cdots \\ \vdots & \vdots & \ddots \end{pmatrix} \cdot P^{-1}'
    description: 'Permite resolver sistemas dinámicos discretos y cadenas de Markov en un solo paso.'
    tags: ["potencias", "diagonal", "markov"]
  - id: 'teorema-cayley-hamilton'
    name: 'Teorema de Cayley-Hamilton'
    latex: 'P(A) = \mathbf{0} \implies (-1)^n A^n + c_{n-1} A^{n-1} + \cdots + \det(A) \cdot I = \mathbf{0}'
    description: 'Toda matriz cuadrada satisface su propia ecuación característica (útil para despejar A^{-1}).'
    tags: ["cayley-hamilton", "polinomio-anulador"]
---

# Diagonalización de Operadores Matriciales

En la UTN FRRO, la unidad de diagonalización es una de las más evaluadas en exámenes finales por su conexión directa con las frecuencias naturales de resonancia de edificios y puentes y la resolución de sistemas de ecuaciones diferenciales lineales.

---

## 1. El Desbalance $m_g \le m_a$

Para cualquier matriz $A \in \mathbb{R}^{n \times n}$ y autovalor $\lambda$:

$$1 \le m_g(\lambda) = n - \text{rg}(A - \lambda I) \le m_a(\lambda)$$

> [!WARNING]
> **Causa de No Diagonalizabilidad:**
> Si para algún autovalor la multiplicidad geométrica es estrictamente menor que la multiplicidad algebraica ($m_g < m_a$), el operador es **defectivo** y **NO se puede diagonalizar**.
> Sin embargo, si todas las raíces son simples ($m_a = 1$ para todo $i$), como $1 \le m_g \le m_a = 1 \implies m_g = 1$, la matriz es **automáticamente diagonalizable**.

---

## 2. Diagonalización Ortogonal (Matrices Simétricas Reales)

Si $A^T = A$:
1. Todos los autovalores son reales.
2. Autovectores de autovalores distintos son ortogonales ($\mathbf{v}_1 \cdot \mathbf{v}_2 = 0$).
3. Normalizando los autovectores ($\mathbf{u}_i = \frac{\mathbf{v}_i}{\|\mathbf{v}_i\|}$), la matriz $P = [\mathbf{u}_1 \mid \cdots \mid \mathbf{u}_n]$ es **ortogonal** ($P^{-1} = P^T$).
4. $$A = P \cdot D \cdot P^T$$

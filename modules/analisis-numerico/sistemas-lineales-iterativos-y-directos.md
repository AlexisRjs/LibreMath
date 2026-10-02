---
title: "Sistemas de Ecuaciones Lineales: Eliminación de Gauss, Factorización LU, Métodos de Jacobi y Gauss-Seidel"
unit: "Unidad 2: Sistemas de Ecuaciones Lineales: Métodos Directos e Iterativos"
order: 2
tags:
  - "analisis-numerico"
  - "utn-frro"
  - "sistemas-lineales"
  - "gauss"
  - "pivoteo-parcial"
  - "factorizacion-lu"
  - "jacobi"
  - "gauss-seidel"
  - "radio-espectral"
description: "Resolución numérica de sistemas Ax = b: métodos directos exactos (Eliminación de Gauss con pivoteo parcial, factorización A = LU de Doolittle y Crout) y métodos iterativos aproximados (Jacobi, Gauss-Seidel, matrices diagonalmente dominantes y radio espectral)."
variables:
  - symbol: 'A \mathbf{x} = \mathbf{b}'
    name: 'Sistema Lineal'
    description: 'Matriz de coeficientes A de n x n, vector de incógnitas x y vector de términos independientes b'
  - symbol: '\rho(T) = \max_i |\lambda_i|'
    name: 'Radio Espectral'
    description: 'Módulo del autovalor de mayor magnitud de la matriz de iteración T'
formulas:
  - id: 'jacobi-formula-componentes'
    name: 'Método Iterativo de Jacobi'
    latex: 'x_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j \ne i} a_{ij} x_j^{(k)} \right), \quad i = 1, \dots, n'
    description: 'Actualización simultánea de todas las incógnitas utilizando exclusivamente los valores del paso anterior k.'
    tags: ["jacobi", "iterativo", "sistemas-lineales"]
  - id: 'gauss-seidel-formula-componentes'
    name: 'Método Iterativo de Gauss-Seidel'
    latex: 'x_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j=1}^{i-1} a_{ij} x_j^{(k+1)} - \sum_{j=i+1}^{n} a_{ij} x_j^{(k)} \right)'
    description: 'Actualización sucesiva e inmediata que utiliza las componentes recién calculadas en el mismo paso k+1.'
    tags: ["gauss-seidel", "iterativo", "sistemas-lineales"]
  - id: 'condicion-convergencia-radio-espectral'
    name: 'Teorema de Convergencia por Radio Espectral'
    latex: '\mathbf{x}^{(k+1)} = T \mathbf{x}^{(k)} + \mathbf{c} \text{ converge para cualquier } \mathbf{x}^{(0)} \iff \rho(T) < 1'
    description: 'Condición necesaria y suficiente para la convergencia de cualquier método iterativo estacionario.'
    tags: ["convergencia", "radio-espectral", "teorema"]
---

# Sistemas de Ecuaciones Lineales: Métodos Directos e Iterativos (UTN FRRO)

---

## 1. Métodos Directos

Producen la solución teóricamente exacta en un número finito de operaciones aritméticas elementales (salvo por errores de redondeo de punto flotante).

### A. Eliminación Gaussiana con Pivoteo Parcial
1. **Motivación del Pivoteo**: Si el elemento pivote $a_{kk}^{(k)}$ es muy pequeño o cero, la división por el pivote amplifica catastróficamente los errores de redondeo.
2. **Estrategia de Pivoteo Parcial**: Antes de eliminar la columna $k$, se busca el elemento de mayor valor absoluto en la columna $k$ desde la fila $k$ hasta la $n$:
   $$p = \operatorname{argmax}_{k \le i \le n} |a_{ik}^{(k)}|$$
   Si $p \ne k$, se intercambian las filas completas $k$ y $p$ (incluyendo el vector $b$).
3. **Costo Computacional**: $\frac{2}{3} n^3 + \mathcal{O}(n^2)$ operaciones de punto flotante (FLOPs).

### B. Factorización Matricial $A = L U$
Descompone la matriz $A$ en el producto de una matriz triangular inferior $L$ (*Lower*) con 1s en la diagonal principal y una matriz triangular superior $U$ (*Upper*):

$$A \mathbf{x} = \mathbf{b} \iff (L U) \mathbf{x} = \mathbf{b}$$
Se resuelve en dos pasos sumamente veloces de sustitución progresiva y regresiva ($\mathcal{O}(n^2)$):
1. **Sustitución Progresiva**: Resolver $L \mathbf{y} = \mathbf{b}$.
2. **Sustitución Regresiva**: Resolver $U \mathbf{x} = \mathbf{y}$.

> **Ventaja en Ingeniería:** Si se tienen múltiples vectores de carga independientes $\mathbf{b}_1, \mathbf{b}_2, \dots$ para una misma estructura o circuito (matriz $A$ fija), la descomposición $LU$ se calcula una sola vez ($\mathcal{O}(n^3)$) y luego cada solución solo cuesta $\mathcal{O}(n^2)$.

---

## 2. Métodos Iterativos

Aproximan la solución mediante una sucesión de vectores $\mathbf{x}^{(0)}, \mathbf{x}^{(1)}, \mathbf{x}^{(2)}, \dots \to \mathbf{x}^*$. Son ideales para matrices dispersas (*sparse*) de gran tamaño ($n > 10^4$), muy frecuentes en elementos finitos y redes eléctricas.

Descomponiendo $A = D - L - U$ (Diagonal, Triangular inferior estricta, Triangular superior estricta):

### A. Método de Jacobi
Aisla la diagonal $D$:
$$D \mathbf{x}^{(k+1)} = (L + U) \mathbf{x}^{(k)} + \mathbf{b}$$
$$\mathbf{x}^{(k+1)} = D^{-1}(L + U)\mathbf{x}^{(k)} + D^{-1}\mathbf{b} = T_J \mathbf{x}^{(k)} + \mathbf{c}_J$$
* Matriz de iteración de Jacobi: $T_J = D^{-1}(L + U)$.

### B. Método de Gauss-Seidel
Aisla $(D - L)$:
$$(D - L) \mathbf{x}^{(k+1)} = U \mathbf{x}^{(k)} + \mathbf{b}$$
$$\mathbf{x}^{(k+1)} = (D - L)^{-1}U \mathbf{x}^{(k)} + (D - L)^{-1}\mathbf{b} = T_{GS} \mathbf{x}^{(k)} + \mathbf{c}_{GS}$$
* Matriz de iteración de Gauss-Seidel: $T_{GS} = (D - L)^{-1}U$.
* **Ventaja**: Generalmente converge el doble de rápido que Jacobi y requiere la mitad de memoria al sobrescribir las variables en el mismo arreglo.

---

## 3. Criterios de Convergencia

### A. Condición Suficiente: Matriz Estrictamente Diagonal Dominante (EDD)
Una matriz $A$ es **diagonal dominante estricta por filas** si en cada fila el módulo del elemento diagonal supera a la suma de los módulos de todos los demás elementos de esa fila:
$$|a_{ii}| > \sum_{j \ne i} |a_{ij}|, \quad \forall i = 1, \dots, n$$
* **Teorema**: Si $A$ es EDD, los métodos de **Jacobi y Gauss-Seidel convergen** para cualquier vector inicial $\mathbf{x}^{(0)}$.

### B. Condición Necesaria y Suficiente: Radio Espectral
Sea $\rho(T) = \max_i |\lambda_i|$ el radio espectral de la matriz de iteración $T$:
$$\text{El método converge} \iff \rho(T) < 1$$
Cuanto más cercano a cero sea $\rho(T)$, mayor es la velocidad asintótica de convergencia.

### Criterio de Parada
$$\frac{\|\mathbf{x}^{(k+1)} - \mathbf{x}^{(k)}\|}{\|\mathbf{x}^{(k+1)}\|} < \text{Tol} \quad \text{o} \quad \|\mathbf{b} - A\mathbf{x}^{(k+1)}\| < \text{Tol}$$

---
title: "Teoría de Conjuntos, Relaciones de Equivalencia, Orden Parcial y Funciones"
unit: "Unidad 2: Teoría de Conjuntos, Relaciones y Funciones"
order: 2
tags:
  - "led"
  - "utn-frro"
  - "conjuntos"
  - "relaciones"
  - "equivalencia"
  - "orden-parcial"
  - "diagrama-hasse"
  - "reticulados"
  - "funciones"
description: "Estructuras algebraicas discretas fundamentales: operaciones de conjuntos, producto cartesiano, propiedades de relaciones (reflexiva, simétrica, antisimétrica, transitiva), clases de equivalencia, diagramas de Hasse y clasificación funcional."
variables:
  - symbol: 'R \subseteq A \times B'
    name: 'Relación binaria'
    description: 'Subconjunto del producto cartesiano entre el conjunto origen A y el conjunto destino B'
  - symbol: '[a] = \{ x \in A : x \, R \, a \}'
    name: 'Clase de equivalencia'
    description: 'Conjunto de todos los elementos equivalentes al elemento representante a'
formulas:
  - id: 'inclusion-exclusion-2'
    name: 'Principio de Inclusión-Exclusión (2 Conjuntos)'
    latex: '|A \cup B| = |A| + |B| - |A \cap B|'
    description: 'Cardinalidad de la unión de dos conjuntos finitos.'
    tags: ["conjuntos", "cardinalidad", "combinatoria"]
  - id: 'inclusion-exclusion-3'
    name: 'Principio de Inclusión-Exclusión (3 Conjuntos)'
    latex: '|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|'
    description: 'Cardinalidad de la unión de tres conjuntos finitos.'
    tags: ["conjuntos", "cardinalidad", "combinatoria"]
  - id: 'clases-particion-teorema'
    name: 'Teorema Fundamental de las Relaciones de Equivalencia'
    latex: 'R \text{ es de equivalencia en } A \iff A / R = \{ [a] : a \in A \} \text{ es una partición de } A'
    description: 'Toda relación de equivalencia define una partición del conjunto y viceversa.'
    tags: ["equivalencia", "particion", "teorema"]
---

# Teoría de Conjuntos, Relaciones y Funciones (UTN FRRO)

---

## 1. Operaciones de Conjuntos y Álgebra Booleana

Sean $A, B \subseteq U$ subconjuntos de un universo referencial:
* **Unión**: $A \cup B = \{ x \in U : x \in A \lor x \in B \}$
* **Intersección**: $A \cap B = \{ x \in U : x \in A \land x \in B \}$
* **Diferencia**: $A \setminus B = \{ x \in U : x \in A \land x \notin B \}$
* **Complemento**: $A^c = \overline{A} = \{ x \in U : x \notin A \}$
* **Diferencia Simétrica**: $A \triangle B = (A \setminus B) \cup (B \setminus A) = (A \cup B) \setminus (A \cap B)$
* **Conjunto de Partes (Potencia)**: $\mathcal{P}(A) = \{ S : S \subseteq A \}$. Si $|A| = n$, entonces $|\mathcal{P}(A)| = 2^n$.

---

## 2. Propiedades de las Relaciones Binarias

Sea $R$ una relación sobre un conjunto $A$ ($R \subseteq A \times A$):

| Propiedad | Definición Formal | Representación Matricial $M_R$ | Grafo Dirigido |
| :--- | :--- | :--- | :--- |
| **Reflexiva** | $\forall x \in A, \; (x, x) \in R$ | Diagonal principal completa de 1s | Cada nodo tiene un lazo (*bucle*) |
| **Arreflexiva** | $\forall x \in A, \; (x, x) \notin R$ | Diagonal principal de 0s | Ningún nodo tiene lazos |
| **Simétrica** | $\forall x, y \in A, \; (x, y) \in R \implies (y, x) \in R$ | Matriz simétrica: $M_R = M_R^T$ | Aristas bidireccionales |
| **Antisimétrica** | $\forall x, y \in A, \; ((x, y) \in R \land (y, x) \in R) \implies x = y$ | No hay 1s simétricos fuera de diagonal | No hay ciclos de longitud 2 |
| **Transitiva** | $\forall x, y, z \in A, \; ((x, y) \in R \land (y, z) \in R) \implies (x, z) \in R$ | $M_R^{[2]} \le M_R$ (producto booleano) | Si hay camino $x \to y \to z$, hay flecha directa $x \to z$ |

---

## 3. Relaciones de Equivalencia y Particiones

Una relación $R$ sobre $A$ es de **Equivalencia** si y solo si es:
1. **Reflexiva**
2. **Simétrica**
3. **Transitiva**

### Clase de Equivalencia y Conjunto Cociente
* **Clase de equivalencia de $a$**:
  $$[a] = \{ x \in A : (x, a) \in R \}$$
* **Conjunto Cociente $A / R$**:
  $$A / R = \{ [a] : a \in A \}$$
* **Propiedades de las clases**:
  * Para todo $a \in A$, $[a] \neq \emptyset$ (por reflexividad, $a \in [a]$).
  * $[a] = [b] \iff (a, b) \in R$.
  * Si $[a] \neq [b]$, entonces $[a] \cap [b] = \emptyset$ (son disjuntas dos a dos).
  * $\bigcup_{a \in A} [a] = A$ (su unión reconstituye todo el conjunto $A$).

---

## 4. Relaciones de Orden Parcial y Diagramas de Hasse

Una relación $R$ sobre $A$ es de **Orden Parcial** si y solo si es:
1. **Reflexiva**
2. **Antisimétrica**
3. **Transitiva**

El par $(A, R)$ se denomina **Conjunto Parcialmente Ordenado (POSET)**.

### Construcción del Diagrama de Hasse
1. Se dibuja un grafo donde los elementos son vértices.
2. Si $(x, y) \in R$ con $x \ne y$, se dibuja $y$ en un nivel superior a $x$.
3. Se omiten todos los lazos (propiedad reflexiva implícita).
4. Se omiten las aristas redundantes de transitividad (si $x \to y$ y $y \to z$, no se dibuja $x \to z$).
5. Se eliminan las flechas, dejando líneas ascendentes (se asume dirección hacia arriba).

### Elementos Notables en un POSET
* **Minimales y Maximales**:
  * $m$ es *minimal* si no existe $x \in A$ tal que $x < m$.
  * $M$ es *maximal* si no existe $x \in A$ tal que $M < x$.
* **Mínimo y Máximo (Primero y Último elemento)**:
  * Si existen, son únicos. El mínimo precede a **todos** los elementos; el máximo es precedido por **todos**.
* **Cota Superior e Inferior**:
  * Sean $S \subseteq A$. $c$ es cota superior de $S$ si $\forall s \in S, s \le c$.
* **Supremo ($\sup S$) e Ínfimo ($\inf S$)**:
  * $\sup S$: la menor de las cotas superiores.
  * $\inf S$: la mayor de las cotas inferiores.

> **Definición de Reticulado (Lattice):**
> Un POSET $(A, \le)$ es un **reticulado** si todo par de elementos $\{a, b\} \subseteq A$ posee un ínfimo único ($a \wedge b$, *meet*) y un supremo único ($a \vee b$, *join*).

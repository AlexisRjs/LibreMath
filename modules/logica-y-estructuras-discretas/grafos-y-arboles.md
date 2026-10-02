---
title: "Teoría de Grafos, Caminos Eulerianos, Hamiltonianos, Árboles y Algoritmos Voraces"
unit: "Unidad 4: Grafos, Árboles y Máquinas de Estado"
order: 4
tags:
  - "led"
  - "utn-frro"
  - "grafos"
  - "arboles"
  - "kruskal"
  - "prim"
  - "euler"
  - "hamilton"
  - "dijkstra"
description: "Modelado mediante estructuras de grafos: matrices de adyacencia e incidencia, grados de vértices, ciclos eulerianos y hamiltonianos, árboles generadores de peso mínimo (MST con Kruskal y Prim) y árboles binarios."
variables:
  - symbol: 'G = (V, E)'
    name: 'Grafo'
    description: 'Conjunto finito de vértices V y conjunto de aristas E'
  - symbol: '\deg(v)'
    name: 'Grado del vértice'
    description: 'Cantidad de aristas incidentes al vértice v'
formulas:
  - id: 'lema-apretones-manos'
    name: 'Teorema de los Grados (Lema del Apretón de Manos)'
    latex: '\sum_{v \in V} \deg(v) = 2 |E|'
    description: 'La suma de los grados de todos los vértices es siempre igual al doble del número de aristas. Corolario: el número de vértices de grado impar es siempre par.'
    tags: ["grafos", "grados", "teorema"]
  - id: 'formula-euler-grafos-planos'
    name: 'Fórmula Poliédrica de Euler para Grafos Planos Conexos'
    latex: '|V| - |E| + |R| = 2'
    description: 'Relación invariante entre vértices V, aristas E y regiones o caras R en una representación planar.'
    tags: ["grafos-planos", "euler", "invariante"]
  - id: 'aristas-arbol'
    name: 'Propiedad Fundamental de Árboles'
    latex: 'T \text{ es un árbol conexo con } n \text{ vértices} \implies |E| = n - 1'
    description: 'Todo árbol conexo con n vértices tiene exactamente n - 1 aristas y carece de ciclos simples.'
    tags: ["arboles", "propiedad", "aristas"]
---

# Teoría de Grafos y Árboles (UTN FRRO)

Los grafos constituyen el modelo matemático por excelencia para representar redes de telecomunicaciones, diagramas de flujo de programas, topologías de servidores y redes neuronales.

---

## 1. Conceptos Fundamentales y Representación

Un grafo $G = (V, E)$ consta de un conjunto no vacío de vértices $V$ y un conjunto de aristas $E$.

* **Grafo simple**: No tiene lazos (aristas de un vértice a sí mismo) ni aristas múltiples entre el mismo par de vértices.
* **Multigrafo**: Permite múltiples aristas entre dos vértices.
* **Grafo Dirigido (Dígrafo)**: Las aristas son pares ordenados con dirección $(u \to v)$.
* **Grafo Bipartito**: $V = V_1 \cup V_2$ tal que no existen aristas entre vértices del mismo subconjunto.
* **Grafo Completo ($K_n$)**: Grafo simple con $n$ vértices donde existe una arista entre cada par de vértices. Número de aristas: $|E| = \frac{n(n-1)}{2}$.

### Representaciones Computacionales
1. **Matriz de Adyacencia ($A_G$)**:
   Matriz cuadrada $n \times n$ donde $a_{ij} = 1$ si existe arista entre $v_i$ y $v_j$, y $0$ si no. Para grafos no dirigidos es simétrica.
   > **Propiedad de potencias**: El elemento $(i, j)$ de la matriz $(A_G)^k$ indica la cantidad exacta de caminos de longitud $k$ que van del vértice $v_i$ al vértice $v_j$.
2. **Matriz de Incidencia ($M$)**:
   Matriz de dimensión $|V| \times |E|$ donde $m_{ij} = 1$ si el vértice $v_i$ es extremo de la arista $e_j$.

---

## 2. Caminos y Circuitos Especiales

### A. Grafos Eulerianos
* **Definición**: Un camino que recorre **cada arista del grafo exactamente una vez**. Si empieza y termina en el mismo vértice, es un **circuito euleriano**.
* **Teorema de Euler**:
  * Un grafo conexo admite un *circuito euleriano* $\iff$ **todos sus vértices tienen grado par**.
  * Un grafo conexo admite un *camino euleriano abierto* $\iff$ **tiene exactamente dos vértices con grado impar** (el camino debe comenzar en uno de ellos y terminar en el otro).

### B. Grafos Hamiltonianos
* **Definición**: Un ciclo que visita **cada vértice del grafo exactamente una vez** (cerrándose en el origen).
* **Criterios suficientes (Dirac y Ore)**:
  * **Teorema de Dirac**: Si $G$ es simple con $n \ge 3$ y para todo vértice $v \in V$, $\deg(v) \ge \frac{n}{2}$, entonces $G$ es hamiltoniano.
  * **Teorema de Ore**: Si para todo par de vértices no adyacentes $u, v$, $\deg(u) + \deg(v) \ge n$, entonces $G$ es hamiltoniano.

---

## 3. Árboles y Árboles Generadores Mínimos (MST)

Un **árbol** es un grafo conexo y acíclico.
* Un árbol con $n$ vértices tiene exactamente $n - 1$ aristas.
* Entre cualquier par de vértices de un árbol existe un **único camino simple**.
* Al agregar una arista a un árbol, se crea exactamente un ciclo simple.

### Algoritmos Voraces (Greedy) para Árbol Generador Mínimo

Dado un grafo ponderado y conexo, el problema consiste en hallar un árbol que contenga todos los vértices minimizando la suma de pesos de las aristas:

#### 1. Algoritmo de Kruskal
1. Ordenar todas las aristas del grafo de menor a mayor peso.
2. Inicializar el árbol vacío.
3. Tomar la arista más liviana disponible.
4. Agregarla al árbol **siempre y cuando no forme un ciclo** con las aristas ya seleccionadas (se controla eficientemente mediante la estructura Disjoint-Set / Union-Find).
5. Repetir hasta tener exactamente $n - 1$ aristas.

#### 2. Algoritmo de Prim
1. Seleccionar un vértice arbitrario de inicio como nodo raíz del árbol.
2. Identificar todas las aristas que conectan los vértices del árbol actual con vértices aún no visitados.
3. Elegir la arista de **menor peso** de esa frontera y agregar el nuevo vértice al árbol.
4. Repetir el paso anterior hasta incluir los $n$ vértices.

---
title: "Álgebra de Boole, Funciones Lógicas, Mapas de Karnaugh y Compuertas"
unit: "Unidad 3: Álgebra de Boole y Circuitos Lógicos"
order: 3
tags:
  - "led"
  - "utn-frro"
  - "algebra-de-boole"
  - "karnaugh"
  - "miniterminos"
  - "maxiterminos"
  - "compuertas-logicas"
  - "simplificacion"
description: "Teoría formal del álgebra booleana, postulados de Huntington, formas canónicas de suma de productos (SOP) y producto de sumas (POS), simplificación gráfica por mapas de Karnaugh de 2, 3 y 4 variables y diseño de compuertas lógicas."
variables:
  - symbol: 'f(x_1, x_2, \dots, x_n) \in \{0, 1\}'
    name: 'Función Booleana'
    description: 'Mapeo discreto de n variables binarias hacia el cuerpo de dos elementos {0, 1}'
formulas:
  - id: 'miniterminos-forma-canonica'
    name: 'Forma Canónica Disyuntiva (SOP - Sum of Products)'
    latex: 'f(A, B, C) = \sum m(i) = \bigvee_{i : f(m_i)=1} m_i'
    description: 'Expresión canónica de una función como suma de minitérminos.'
    tags: ["boole", "miniterminos", "sop"]
  - id: 'maxiterminos-forma-canonica'
    name: 'Forma Canónica Conjuntiva (POS - Product of Sums)'
    latex: 'f(A, B, C) = \prod M(i) = \bigwedge_{i : f(M_i)=0} M_i'
    description: 'Expresión canónica de una función como producto de maxitérminos.'
    tags: ["boole", "maxiterminos", "pos"]
  - id: 'dualidad-boole'
    name: 'Principio de Dualidad de Boole'
    latex: '\Phi(+, \cdot, 0, 1) \equiv \Phi(\cdot, +, 1, 0)'
    description: 'Cualquier identidad booleana permanece válida al intercambiar operadores (+ por ·) y elementos neutros (0 por 1).'
    tags: ["boole", "dualidad", "postulados"]
---

# Álgebra de Boole y Diseño de Circuitos Lógicos (UTN FRRO)

El **Álgebra de Boole** es una estructura algebraica $(B, +, \cdot, ', 0, 1)$ que formaliza las operaciones lógicas binarias y constituye el cimiento matemático de la arquitectura de procesadores y circuitos integrados.

---

## 1. Postulados de Huntington y Teoremas Fundamentales

Para todo elemento $a, b, c \in B$:

1. **Cerradura**: $a + b \in B$ y $a \cdot b \in B$.
2. **Existencia de Elementos Neutros**:
   $$a + 0 = a, \qquad a \cdot 1 = a$$
3. **Conmutatividad**:
   $$a + b = b + a, \qquad a \cdot b = b \cdot a$$
4. **Distributividad**:
   $$a \cdot (b + c) = (a \cdot b) + (a \cdot c)$$
   $$a + (b \cdot c) = (a + b) \cdot (a + c) \quad \text{(¡Dual distributiva!)}$$
5. **Complementación**:
   $$a + a' = 1, \qquad a \cdot a' = 0$$

### Teoremas de Simplificación Clave
* **Idempotencia**: $x + x = x, \quad x \cdot x = x$
* **Acotamiento**: $x + 1 = 1, \quad x \cdot 0 = 0$
* **Involución**: $(x')' = x$
* **Absorción**:
  $$x + (x \cdot y) = x, \qquad x \cdot (x + y) = x$$
  $$x + (x' \cdot y) = x + y, \qquad x \cdot (x' + y) = x \cdot y$$
* **Consenso**:
  $$x \cdot y + x' \cdot z + y \cdot z = x \cdot y + x' \cdot z$$

---

## 2. Formas Canónicas: Minitérminos y Maxitérminos

Dada una función de $n$ variables binarias:

### A. Minitérminos ($m_i$)
* Es un producto booleano (término $\text{AND}$) que contiene **todas** las variables (directas o complementadas).
* Corresponde a las filas de la tabla de verdad donde la función vale $1$.
* Una variable vale $1$ si no está negada ($A$) y $0$ si está negada ($A'$).
* *Ejemplo*: Fila $A=1, B=0, C=1 \implies m_5 = A \cdot B' \cdot C$.

### B. Maxitérminos ($M_i$)
* Es una suma booleana (término $\text{OR}$) que contiene **todas** las variables.
* Corresponde a las filas de la tabla de verdad donde la función vale $0$.
* Una variable vale $0$ si no está negada ($A$) y $1$ si está negada ($A'$).
* *Ejemplo*: Fila $A=1, B=0, C=1 \implies M_5 = A' + B + C'$.
* **Relación de De Morgan**: $M_i = (m_i)'$.

---

## 3. Mapas de Karnaugh (K-Maps)

El mapa de Karnaugh es un método gráfico de simplificación que agrupa términos adyacentes que difieren en una sola variable, aprovechando el **código Gray** ($00, 01, 11, 10$):

### Mapa de Karnaugh de 4 Variables ($A, B, C, D$)
Las filas representan $AB$ y las columnas $CD$:

```
        CD  00      01      11      10
    AB +-------+-------+-------+-------+
    00 |  m0   |  m1   |  m3   |  m2   |
       +-------+-------+-------+-------+
    01 |  m4   |  m5   |  m7   |  m6   |
       +-------+-------+-------+-------+
    11 |  m12  |  m13  |  m15  |  m14  |
       +-------+-------+-------+-------+
    10 |  m8   |  m9   |  m11  |  m10  |
       +-------+-------+-------+-------+
```

### Reglas de Agrupamiento
1. Solo se pueden formar grupos rectangulares de tamaño potencia de 2 ($1, 2, 4, 8, 16$).
2. Los bordes son adyacentes (esféricos/toroidales): la columna `00` es adyacente a la `10`, y la fila `00` a la `10`. Las 4 esquinas forman un grupo válido de 4 ($m_0, m_2, m_8, m_{10}$).
3. Se deben armar los grupos **lo más grandes posibles** para eliminar la mayor cantidad de variables.
4. Se deben cubrir todos los $1$ con la menor cantidad total de grupos (**implicantes primos esenciales**).
5. Las condiciones de "no importa" (*Don't Care* o $X$) se pueden tratar como $1$ si ayudan a agrandar un grupo, o como $0$ en caso contrario.

---

## 4. Compuertas Lógicas Fundamentales

| Compuerta | Símbolo Booleano | Expresión | Comportamiento |
| :---: | :---: | :---: | :--- |
| **NOT (Inversor)** | `~` | $Y = A'$ | Invierte el bit de entrada |
| **AND** | `&` | $Y = A \cdot B$ | 1 solo si todas las entradas son 1 |
| **OR** | `\|` | $Y = A + B$ | 1 si al menos una entrada es 1 |
| **NAND** | `~&` | $Y = (A \cdot B)'$ | **Compuerta universal**: niega la salida de AND |
| **NOR** | `~\|` | $Y = (A + B)'$ | **Compuerta universal**: niega la salida de OR |
| **XOR** | `^` | $Y = A \oplus B = A'B + AB'$ | 1 si las entradas son distintas (suma módulo 2) |
| **XNOR** | `<=>` | $Y = (A \oplus B)' = AB + A'B'$ | 1 si las entradas son iguales (comparador de igualdad) |

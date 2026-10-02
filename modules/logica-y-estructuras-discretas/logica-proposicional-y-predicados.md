---
title: "Lógica Proposicional, Equivalencias Notables y Cálculo de Predicados"
unit: "Unidad 1: Lógica Proposicional y Cálculo de Predicados"
order: 1
tags:
  - "led"
  - "utn-frro"
  - "logica-proposicional"
  - "predicados"
  - "tablas-de-verdad"
  - "de-morgan"
  - "modus-ponens"
  - "cuantificadores"
description: "Fundamentos de lógica formal matemática: conectivos lógicos, tautologías, contradicciones, leyes de equivalencia lógica (De Morgan, implicación), reglas de inferencia y cuantificadores universal y existencial."
variables:
  - symbol: 'p, q, r'
    name: 'Proposiciones atómicas'
    description: 'Enunciados declarativos con un único valor de verdad asignable: Verdadero (V o 1) o Falso (F o 0)'
  - symbol: '\forall x, \, \exists x'
    name: 'Cuantificadores lógicos'
    description: 'Cuantificador universal (\forall: para todo) y existencial (\exists: existe al menos uno)'
formulas:
  - id: 'implicacion-material'
    name: 'Equivalencia de la Implicación Material'
    latex: 'p \implies q \equiv \neg p \lor q'
    description: 'Conversión canónica del condicional en términos de negación y disyunción.'
    tags: ["logica", "implicacion", "equivalencia"]
  - id: 'leyes-de-morgan-logica'
    name: 'Leyes de De Morgan (Lógica Proposicional)'
    latex: '\neg(p \land q) \equiv \neg p \lor \neg q, \qquad \neg(p \lor q) \equiv \neg p \land \neg q'
    description: 'Dualidad de la negación respecto a la conjunción y disyunción.'
    tags: ["de-morgan", "dualidad", "equivalencia"]
  - id: 'contrareciproco'
    name: 'Ley del Contrarrecíproco (Transposición)'
    latex: 'p \implies q \equiv \neg q \implies \neg p'
    description: 'Fundamento lógico del método de demostración por reducción al absurdo o por contrarrecíproco.'
    tags: ["contrareciproco", "demostracion"]
  - id: 'negacion-cuantificadores'
    name: 'Negación de Cuantificadores'
    latex: '\neg (\forall x \, P(x)) \equiv \exists x \, \neg P(x), \qquad \neg (\exists x \, P(x)) \equiv \forall x \, \neg P(x)'
    description: 'Regla de dualidad de De Morgan aplicada al cálculo de predicados de primer orden.'
    tags: ["cuantificadores", "predicados", "negacion"]
---

# Lógica Proposicional y de Predicados (UTN FRRO)

La lógica simbólica constituye la base matemática del diseño de hardware digital, diseño de bases de datos relacionales, verificación formal de algoritmos y teoría de la computación.

---

## 1. Conectivos Lógicos y Tablas de Verdad

Una **proposición** es una afirmación declarativa que es verdadera ($V$ o $1$) o falsa ($F$ o $0$), pero no ambas simultáneamente.

| $p$ | $q$ | Negación $\neg p$ | Conjunción $p \land q$ | Disyunción $p \lor q$ | Disy. Exclusiva $p \oplus q$ | Condicional $p \implies q$ | Bicondicional $p \iff q$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| V | V | F | **V** | **V** | F | **V** | **V** |
| V | F | F | F | **V** | **V** | **F** | F |
| F | V | V | F | **V** | **V** | **V** | F |
| F | F | V | F | F | F | **V** | **V** |

> **Nota de cátedra UTN FRRO sobre el condicional $p \implies q$:**
> El condicional solo es **Falso** cuando el antecedente $p$ es Verdadero y el consecuente $q$ es Falso. Si el antecedente es Falso, la proposición compuesta es siempre Verdadera por vaciedad (*verdad por vacuidad*).

---

## 2. Leyes de Equivalencia Lógica Canónicas

Estas identidades permiten simplificar expresiones complejas sin recurrir a construir tablas de verdad completas ($2^n$ filas):

1. **Idempotencia**:
   $$p \lor p \equiv p, \qquad p \land p \equiv p$$
2. **Conmutatividad**:
   $$p \lor q \equiv q \lor p, \qquad p \land q \equiv q \land p$$
3. **Asociatividad**:
   $$(p \lor q) \lor r \equiv p \lor (q \lor r), \qquad (p \land q) \land r \equiv p \land (q \land r)$$
4. **Distributividad**:
   $$p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$$
   $$p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$$
5. **Doble Negación (Involución)**:
   $$\neg(\neg p) \equiv p$$
6. **Leyes de De Morgan**:
   $$\neg (p \land q) \equiv \neg p \lor \neg q, \qquad \neg (p \lor q) \equiv \neg p \land \neg q$$
7. **Leyes de Absorción**:
   $$p \lor (p \land q) \equiv p, \qquad p \land (p \lor q) \equiv p$$
8. **Implicación y Bicondicional**:
   $$p \implies q \equiv \neg p \lor q$$
   $$p \iff q \equiv (p \implies q) \land (q \implies p) \equiv (\neg p \lor q) \land (\neg q \lor p)$$

---

## 3. Reglas de Inferencia Lógica (Deducción)

Un argumento es válido si la conjunción de las premisas implica tautológicamente la conclusión:

* **Modus Ponens (Afirmación del antecedente)**:
  $$\frac{p \implies q, \quad p}{\therefore q}$$
* **Modus Tollens (Negación del consecuente)**:
  $$\frac{p \implies q, \quad \neg q}{\therefore \neg p}$$
* **Silogismo Hipotético (Transitividad)**:
  $$\frac{p \implies q, \quad q \implies r}{\therefore p \implies r}$$
* **Silogismo Disyuntivo**:
  $$\frac{p \lor q, \quad \neg p}{\therefore q}$$
* **Regla de Resolución (Base de Prolog y demostradores automáticos)**:
  $$\frac{p \lor q, \quad \neg p \lor r}{\therefore q \lor r}$$

---

## 4. Cálculo de Predicados y Cuantificadores

Un **predicado** $P(x)$ es una función proposicional cuyo valor de verdad depende de una o más variables evaluadas sobre un conjunto referencial o dominio del discurso $U$.

* **Cuantificador Universal ($\forall x \, P(x)$)**: Es verdadero si y solo si $P(a)$ es verdadero para todo elemento $a \in U$.
* **Cuantificador Existencial ($\exists x \, P(x)$)**: Es verdadero si existe al menos un elemento $a \in U$ tal que $P(a)$ sea verdadero.
* **Existencia Única ($\exists! x \, P(x)$)**: Existe uno y solo un elemento en el dominio que satisface el predicado.

### Negación de Proposiciones Cuantificadas
$$\neg \Big( \forall x \in \mathbb{R}, \; x^2 \ge 0 \Big) \equiv \exists x \in \mathbb{R} : x^2 < 0$$
$$\neg \Big( \exists x \in \mathbb{Z} : 2x = 5 \Big) \equiv \forall x \in \mathbb{Z}, \; 2x \ne 5$$

---
title: "Variables Aleatorias Discretas: Distribución de Probabilidad, Esperanza y Modelos Notables"
unit: "Unidad 2: Variables Aleatorias Discretas y Distribuciones Especiales"
order: 2
tags:
  - "pye"
  - "utn-frro"
  - "variables-aleatorias"
  - "discretas"
  - "esperanza"
  - "varianza"
  - "binomial"
  - "poisson"
  - "geometrica"
  - "hipergeometrica"
description: "Estudio riguroso de variables aleatorias discretas: función de cuantía p(x), función de distribución acumulada F(x), media, varianza y modelos clásicos: Binomial B(n, p), Poisson P(\lambda), Geométrica e Hipergeométrica."
variables:
  - symbol: 'E[X] = \mu'
    name: 'Esperanza Matemática (Valor Esperado)'
    description: 'Promedio ponderado por probabilidades del comportamiento a largo plazo de la variable aleatoria X'
  - symbol: 'V(X) = \sigma^2'
    name: 'Varianza de la variable'
    description: 'Medida cuadrática de dispersión de la variable aleatoria respecto de su esperanza'
formulas:
  - id: 'esperanza-discreta'
    name: 'Esperanza de una Variable Discreta'
    latex: 'E[X] = \sum_{x} x \cdot P(X = x)'
    description: 'Suma de los productos de cada valor del recorrido por su probabilidad puntual.'
    tags: ["esperanza", "discreta", "media"]
  - id: 'varianza-discreta-formula-practica'
    name: 'Fórmula Práctica de la Varianza'
    latex: 'V(X) = E[X^2] - (E[X])^2 = \sum_x x^2 P(X=x) - \mu^2'
    description: 'Diferencia entre el momento de segundo orden y el cuadrado de la media.'
    tags: ["varianza", "dispersion", "formula-practica"]
  - id: 'distribucion-binomial'
    name: 'Distribución Binomial: B(n, p)'
    latex: 'P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}, \quad k \in \{0, 1, \dots, n\}'
    description: 'Probabilidad de obtener exactamente k éxitos en n ensayos de Bernoulli independientes con probabilidad constante p.'
    tags: ["binomial", "bernoulli", "discreta"]
  - id: 'distribucion-poisson'
    name: 'Distribución de Poisson: P(\lambda)'
    latex: 'P(X = k) = \frac{e^{-\lambda} \lambda^k}{k!}, \quad k \in \{0, 1, 2, \dots\}'
    description: 'Número de eventos raros que ocurren en un intervalo continuo de tiempo o espacio con tasa media \lambda.'
    tags: ["poisson", "procesos-puntuales", "discreta"]
---

# Variables Aleatorias Discretas (UTN FRRO)

Una **variable aleatoria** $X: \Omega \to \mathbb{R}$ es una función que asigna un número real a cada resultado elemental del espacio muestral. Es **discreta** si su recorrido $R_X$ es un conjunto finito o infinito numerable.

---

## 1. Función de Probabilidad Puntual y Función Acumulada

### A. Función de Cuantía o Masa de Probabilidad: $p(x) = P(X = x)$
Condiciones axiomáticas:
1. $p(x_i) \ge 0$ para todo $x_i \in R_X$.
2. $\sum_{x_i \in R_X} p(x_i) = 1$.

### B. Función de Distribución Acumulada: $F(x) = P(X \le x)$
* $F(x) = \sum_{x_i \le x} p(x_i)$
* Es una función monótona no decreciente: si $a \le b \implies F(a) \le F(b)$.
* Es continua por la derecha: $\lim_{h \to 0^+} F(x + h) = F(x)$.
* Límites en el infinito: $\lim_{x \to -\infty} F(x) = 0$ y $\lim_{x \to +\infty} F(x) = 1$.
* Cálculo de probabilidades en intervalos:
  $$P(a < X \le b) = F(b) - F(a)$$

---

## 2. Parámetros Estadísticos: Esperanza y Varianza

### Esperanza Matemática (Media)
$$E[X] = \mu = \sum_{x_i} x_i \cdot P(X = x_i)$$
* **Linealidad de la esperanza**: Para constantes $a, b \in \mathbb{R}$:
  $$E[aX + b] = a E[X] + b$$
* Para dos variables arbitrarias (independientes o no): $E[X + Y] = E[X] + E[Y]$.

### Varianza y Desvío Estándar
$$V(X) = \sigma^2 = E[(X - \mu)^2] = E[X^2] - (E[X])^2$$
$$\sigma = \sqrt{V(X)}$$
* **Propiedades de la varianza**:
  * $V(c) = 0$ (la varianza de una constante es nula).
  * $V(aX + b) = a^2 V(X)$ (las constantes aditivas no alteran la dispersión).
  * Si $X$ e $Y$ son **independientes**: $V(X \pm Y) = V(X) + V(Y)$.

---

## 3. Modelos Notables de Probabilidad Discreta

| Distribución | Notación y Parámetros | Función de Probabilidad $P(X = k)$ | Esperanza $E[X]$ | Varianza $V(X)$ |
| :--- | :---: | :---: | :---: | :---: |
| **Bernoulli** | $\text{Ber}(p)$ | $p^k (1-p)^{1-k}, \quad k \in \{0, 1\}$ | $p$ | $p(1-p)$ |
| **Binomial** | $B(n, p)$ | $\binom{n}{k} p^k (1-p)^{n-k}, \quad k = 0, \dots, n$ | $n p$ | $n p (1-p)$ |
| **Poisson** | $P(\lambda)$ | $\frac{e^{-\lambda} \lambda^k}{k!}, \quad k = 0, 1, 2, \dots$ | $\lambda$ | $\lambda$ |
| **Geométrica** | $G(p)$ | $(1-p)^{k-1} p, \quad k = 1, 2, \dots$ | $\frac{1}{p}$ | $\frac{1-p}{p^2}$ |
| **Hipergeométrica** | $H(N, K, n)$ | $\frac{\binom{K}{k} \binom{N-K}{n-k}}{\binom{N}{n}}$ | $n \frac{K}{N}$ | $n \frac{K}{N} \left(1 - \frac{K}{N}\right) \frac{N-n}{N-1}$ |

### Guía de Criterios de Selección para Parciales UTN FRRO:
* **Binomial**: $n$ repeticiones idénticas e independientes, dos resultados (éxito/fracaso), muestreo **con reposición**.
* **Hipergeométrica**: Población finita $N$, muestreo **sin reposición** (la probabilidad cambia en cada extracción).
* **Poisson**: Ocurrencias en continuo (paquetes por segundo que llegan a un router, fallas por metro de cable, clientes por hora). También aproxima a la Binomial cuando $n \ge 30$ y $p \le 0.05$ tomando $\lambda = n p$.
* **Geométrica**: Número de ensayos hasta observar el **primer** éxito (propiedad de carencia de memoria).

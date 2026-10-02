---
title: "Variables Aleatorias Continuas: Densidad, Normal Estándar y Teorema Central del Límite"
unit: "Unidad 3: Variables Aleatorias Continuas y Teorema Central del Límite"
order: 3
tags:
  - "pye"
  - "utn-frro"
  - "variables-aleatorias"
  - "continuas"
  - "densidad-probabilidad"
  - "normal-gaussiana"
  - "estandarizacion-z"
  - "exponencial"
  - "teorema-central-limite"
description: "Tratamiento infinitesimal de variables continuas: función de densidad f(x), cálculo de probabilidades por integración, modelo Normal N(\mu, \sigma^2), estandarización a Z, distribución Exponencial y Teorema Central del Límite (TCL)."
variables:
  - symbol: 'f(x)'
    name: 'Función de densidad de probabilidad (f.d.p.)'
    description: 'Curva cuya integral sobre un intervalo representa la probabilidad de que la variable caiga en dicha región'
  - symbol: 'Z = \frac{X - \mu}{\sigma} \sim N(0, 1)'
    name: 'Variable normal tipificada (Puntaje Z)'
    description: 'Transformación lineal que normaliza cualquier variable gaussiana a media 0 y varianza 1'
formulas:
  - id: 'probabilidad-integral-continua'
    name: 'Cálculo de Probabilidad Continua'
    latex: 'P(a \le X \le b) = \int_{a}^{b} f(x) \, dx = F(b) - F(a)'
    description: 'La probabilidad en variables continuas corresponde al área bajo la curva de densidad. Consecuencia: P(X = c) = 0 para cualquier punto puntual c.'
    tags: ["continua", "densidad", "integral"]
  - id: 'distribucion-normal-densidad'
    name: 'Función de Densidad Gaussiana Normal'
    latex: 'f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma}\right)^2}, \quad x \in \mathbb{R}'
    description: 'Campana simétrica centrada en la media \mu con puntos de inflexión en \mu \pm \sigma.'
    tags: ["normal", "gauss", "campana"]
  - id: 'estandarizacion-normal-z'
    name: 'Fórmula de Tipificación / Estandarización Z'
    latex: 'Z = \frac{X - \mu}{\sigma} \implies P(X \le k) = \Phi\left(\frac{k - \mu}{\sigma}\right)'
    description: 'Permite utilizar la tabla única de la normal estándar N(0, 1) para cualquier parámetro \mu y \sigma.'
    tags: ["normal", "estandarizacion", "tabla-z"]
  - id: 'teorema-central-del-limite'
    name: 'Teorema Central del Límite (TCL - Lindeberg-Lévy)'
    latex: '\bar{X}_n = \frac{1}{n} \sum_{i=1}^n X_i \xrightarrow{d} N\left(\mu, \; \frac{\sigma^2}{n}\right) \quad \text{cuando } n \to \infty'
    description: 'La media muestral de n variables aleatorias independientes e idénticamente distribuidas converge a una normal sin importar la distribución subyacente.'
    tags: ["tcl", "limite", "convergencia", "media-muestral"]
---

# Variables Aleatorias Continuas y Distribución Normal (UTN FRRO)

Una variable aleatoria $X$ es **continua** si puede asumir cualquier valor dentro de un intervalo real continuo $[a, b] \subseteq \mathbb{R}$.

---

## 1. Función de Densidad y Distribución Acumulada

A diferencia del caso discreto, para una variable continua la probabilidad de adoptar un valor individual exacto es **cero**: $P(X = x_0) = 0$. Las probabilidades se definen únicamente sobre intervalos.

### A. Función de Densidad de Probabilidad (f.d.p.) $f(x)$
Condiciones axiomáticas:
1. $f(x) \ge 0$ para todo $x \in \mathbb{R}$.
2. Normalización de área total:
   $$\int_{-\infty}^{+\infty} f(x) \, dx = 1$$
3. Probabilidad en un intervalo:
   $$P(a \le X \le b) = P(a < X < b) = \int_{a}^{b} f(x) \, dx$$

### B. Función de Distribución Acumulada $F(x)$
$$F(x) = P(X \le x) = \int_{-\infty}^{x} f(t) \, dt$$
Por el Primer Teorema Fundamental del Cálculo, si $f(x)$ es continua:
$$f(x) = \frac{d}{dx} F(x) = F'(x)$$

### Esperanza y Varianza Continua
$$E[X] = \mu = \int_{-\infty}^{+\infty} x \cdot f(x) \, dx$$
$$V(X) = \sigma^2 = \int_{-\infty}^{+\infty} (x - \mu)^2 f(x) \, dx = \left( \int_{-\infty}^{+\infty} x^2 f(x) \, dx \right) - \mu^2$$

---

## 2. Distribución Normal o Gaussiana: $X \sim N(\mu, \sigma^2)$

Es la distribución más trascendente en la ingeniería y ciencias experimentales debido a la abundancia de fenómenos producidos por la suma de múltiples perturbaciones elementales.

* **Parámetros**: $\mu$ (media y centro de simetría) y $\sigma^2$ (varianza y dispersión).
* **Propiedades de la Campana**:
  * Simetría absoluta respecto al eje vertical $x = \mu$: $f(\mu - x) = f(\mu + x)$.
  * Máximo en $x = \mu$ con valor $f(\mu) = \frac{1}{\sigma \sqrt{2\pi}}$.
  * Puntos de inflexión exactamente en $x = \mu \pm \sigma$.
  * Coincidencia de medidas centrales: $\text{Media} = \text{Mediana} = \text{Moda} = \mu$.

### Regla Empírica del 68-95-99.7%
* $P(\mu - \sigma \le X \le \mu + \sigma) \approx 0.6826$ (68.26% del área).
* $P(\mu - 2\sigma \le X \le \mu + 2\sigma) \approx 0.9544$ (95.44% del área).
* $P(\mu - 3\sigma \le X \le \mu + 3\sigma) \approx 0.9974$ (99.74% del área).

### Tipificación a la Normal Estándar $Z \sim N(0, 1)$
Cualquier cálculo con una normal general se reduce a la variable estandarizada:
$$Z = \frac{X - \mu}{\sigma}$$
* Función acumulada estándar: $\Phi(z) = P(Z \le z)$.
* Por simetría: $\Phi(-z) = 1 - \Phi(z)$.
* Probabilidad entre dos cotas:
  $$P(a \le X \le b) = \Phi\left(\frac{b - \mu}{\sigma}\right) - \Phi\left(\frac{a - \mu}{\sigma}\right)$$

---

## 3. Distribución Exponencial: $X \sim \text{Exp}(\lambda)$

Modela el **tiempo transcurrido entre llegadas consecutivas** en un proceso de Poisson con tasa media $\lambda$:

* **Densidad**: $f(x) = \lambda e^{-\lambda x}$ para $x \ge 0$.
* **Acumulada**: $F(x) = 1 - e^{-\lambda x}$.
* **Esperanza**: $E[X] = \frac{1}{\lambda}$.
* **Varianza**: $V(X) = \frac{1}{\lambda^2}$.
* **Propiedad de Carencia de Memoria**:
  $$P(X > s + t \mid X > s) = P(X > t)$$
  El componente no "envejece": la probabilidad de que funcione $t$ horas más no depende de que ya haya funcionado $s$ horas.

---

## 4. Teorema Central del Límite (TCL)

Sean $X_1, X_2, \dots, X_n$ variables aleatorias independientes e idénticamente distribuidas (i.i.d.) con media $\mu$ y varianza finita $\sigma^2$:

Para un tamaño de muestra $n$ suficientemente grande (en la práctica de la UTN FRRO se adopta convencionalmente $n \ge 30$):
* **Suma total**: $S_n = \sum_{i=1}^n X_i \approx N(n \mu, \, n \sigma^2)$.
* **Media muestral**: $\bar{X}_n = \frac{S_n}{n} \approx N\left(\mu, \, \frac{\sigma^2}{n}\right)$.
* **Variable tipificada de la media**:
  $$Z = \frac{\bar{X}_n - \mu}{\frac{\sigma}{\sqrt{n}}} \xrightarrow{d} N(0, 1)$$

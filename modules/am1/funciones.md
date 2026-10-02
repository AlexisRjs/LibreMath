---
title: "Funciones, Límites, Continuidad y Teoremas Fundamentales"
unit: "Tema 1: Funciones, Límites y Continuidad"
order: 1
tags:
  - "am1"
  - "funciones"
  - "limites"
  - "continuidad"
  - "bolzano"
  - "weierstrass"
  - "asintotas"
  - "infinitesimos"
description: "Estudio exhaustivo de funciones reales: dominios, límites notables, indeterminaciones, infinitésimos equivalentes, teoremas de continuidad y cálculo de asíntotas."
variables:
  - symbol: 'L = \lim_{x \to x_0} f(x)'
    name: 'Límite de la función'
    description: 'Valor finito al cual se aproxima f(x) cuando x tiende al punto de acumulación x_0'
  - symbol: '\varepsilon, \, \delta > 0'
    name: 'Entornos de tolerancia'
    description: 'Parámetros infinitesimales de la definición rigurosa de Cauchy-Weierstrass'
  - symbol: 'y = m x + b'
    name: 'Ecuación de la asíntota oblicua'
    description: 'Recta asíntota con pendiente m y ordenada al origen b'
formulas:
  - id: 'definicion-formal-limite'
    name: 'Definición Rigurosa de Límite (\varepsilon - \delta)'
    latex: '\lim_{x \to x_0} f(x) = L \iff \forall \varepsilon > 0, \, \exists \delta > 0 : 0 < |x - x_0| < \delta \implies |f(x) - L| < \varepsilon'
    description: 'Formalización rigurosa de Cauchy de la aproximación continua.'
    tags: ["limite", "definicion", "epsilon-delta"]
  - id: 'limites-notables-trigonometricos-upl'
    name: 'Límites Trigonométricos Notables (Formulario UPL)'
    latex: '\lim_{x \to 0} \frac{\sin x}{x} = 1, \qquad \lim_{x \to 0} \frac{x}{\sin x} = 1, \qquad \lim_{x \to 0} \frac{\tan x}{x} = 1'
    description: 'Trío canónico de límites notables trigonométricos de infinitésimos equivalentes.'
    tags: ["limites", "trigonometria", "notables", "upl"]
  - id: 'limites-notables-numero-e-upl'
    name: 'Límites Notables del Número e (Formulario UPL)'
    latex: '\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e, \quad \lim_{x \to \infty} \left(1 + \frac{k}{x}\right)^x = e^k, \quad \lim_{x \to \infty} \left(1 + \frac{k}{x+a}\right)^{x+a} = e^k'
    description: 'Familia generalizada del límite exponencial para resolver indeterminaciones del tipo 1^{\infty}.'
    tags: ["limites", "numero-e", "indeterminacion", "upl"]
  - id: 'teorema-bolzano-ceros'
    name: 'Teorema de Bolzano (Existencia de Raíces)'
    latex: 'f \in C[a, b] \land f(a) \cdot f(b) < 0 \implies \exists c \in (a, b) : f(c) = 0'
    description: 'Garantiza la existencia de al menos una raíz real en el intervalo abierto.'
    tags: ["bolzano", "continuidad", "teorema", "raices"]
  - id: 'teorema-weierstrass-extremos'
    name: 'Teorema de Weierstrass (Extremos en Intervalos Cerrados)'
    latex: 'f \in C[a, b] \implies \exists x_m, x_M \in [a, b] : f(x_m) \le f(x) \le f(x_M) \quad \forall x \in [a, b]'
    description: 'Toda función continua en un conjunto compacto alcanza su máximo y mínimo absoluto.'
    tags: ["weierstrass", "maximo-minimo", "compacto"]
  - id: 'asintotas-oblicuas-formulas'
    name: 'Cálculo Analítico de Asíntotas Oblicuas'
    latex: 'm = \lim_{x \to \pm\infty} \frac{f(x)}{x}, \qquad b = \lim_{x \to \pm\infty} [f(x) - m x]'
    description: 'Si m es finito y no nulo, y b es finito, la recta y = mx + b es asíntota oblicua.'
    tags: ["asintotas", "oblicua", "estudio-funciones"]
---

# Funciones, Límites y Continuidad

En Análisis Matemático I para ingeniería, el estudio riguroso de las funciones y sus límites constituye el cimiento lógico sobre el cual se edifican el cálculo diferencial y el cálculo integral.

---

## 1. Límites Notables del Formulario Oficial UPL

Para resolver indeterminaciones $[\frac{0}{0}]$ y $[1^\infty]$ sin necesidad de recurrir a la regla de L'Hôpital:

### Límites Trigonométricos Fundamentales

$$\lim_{x \to 0} \frac{\sin x}{x} = 1, \qquad \lim_{x \to 0} \frac{x}{\sin x} = 1, \qquad \lim_{x \to 0} \frac{\tan x}{x} = 1$$

### Límites Exponenciales del Número $e$

$$\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e$$

$$\lim_{x \to \infty} \left(1 + \frac{k}{x}\right)^x = e^k$$

$$\lim_{x \to \infty} \left(1 + \frac{k}{x+a}\right)^{x+a} = e^k$$

---

## 2. Indeterminaciones y Técnicas de Resolución

| Indeterminación | Técnica Analítica Principal |
|---|---|
| $[\frac{0}{0}]$ algebraica | Factorización por Ruffini, simplificación o racionalización con binomio conjugado |
| $[\frac{0}{0}]$ trigonométrica | Sustitución por infinitésimos equivalentes ($\sin x \sim x, \; \tan x \sim x, \; 1-\cos x \sim \frac{x^2}{2}$) |
| $[\frac{\infty}{\infty}]$ | División de numerador y denominador por la máxima potencia de $x$ dominante |
| $[\infty - \infty]$ con raíces | Multiplicación y división por el conjugado radical $(\sqrt{A} - \sqrt{B})\frac{\sqrt{A}+\sqrt{B}}{\sqrt{A}+\sqrt{B}}$ |
| $[1^\infty]$ | Transformación exponencial o aplicación de los límites notables tipo $\left(1 + \frac{k}{x}\right)^x = e^k$ |

> [!NOTE]
> **Jerarquía de Órdenes de Infinito ($x \to \infty$):**
> $$\ln^p(x) \ll x^q \ll a^x \ll x! \ll x^x \quad (p, q > 0, \; a > 1)$$

---

## 2. Continuidad y Discontinuidades

Una función $f(x)$ es **continua en $x_0$** si y sólo si se verifican tres condiciones simultáneas:
1. Existe $f(x_0)$ (el punto pertenece al dominio).
2. Existe $\lim_{x \to x_0} f(x)$ finito (límites laterales coinciden: $\lim_{x \to x_0^-} f(x) = \lim_{x \to x_0^+} f(x)$).
3. $\lim_{x \to x_0} f(x) = f(x_0)$.

- **Discontinuidad Evitable:** Existe el límite finito pero no coincide con $f(x_0)$ o el punto no está definido. Se redefine asignando $f(x_0) = L$.
- **Discontinuidad Inevitable de Salto Finito:** Los límites laterales existen y son finitos pero distintos. Salto $S = |L_1 - L_2|$.
- **Discontinuidad Esencial o de Segunda Especie:** Al menos uno de los límites laterales es infinito ($\pm\infty$) o no existe.

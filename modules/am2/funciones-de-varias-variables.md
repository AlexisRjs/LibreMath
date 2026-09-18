---
title: "Funciones de Varias Variables, Curvas de Nivel, Límites y Continuidad (Stewart U2)"
unit: "U2: Funciones de Varias Variables"
order: 2
tags:
  - "am2"
  - "multivariable"
  - "curvas-nivel"
  - "limites-dobles"
  - "radiales"
  - "polares"
  - "continuidad"
  - "stewart"
description: "Campos escalares, curvas y superficies de nivel, límites multivariables por trayectorias y coordenadas polares, y continuidad en Rn según Stewart."
variables:
  - symbol: 'z = f(x, y)'
    name: 'Campo escalar de dos variables'
    description: 'Asigna a cada par ordenado (x, y) en el dominio D un único número real z'
  - symbol: 'f(x, y) = k'
    name: 'Curva de nivel'
    description: 'Conjunto de puntos del plano xy donde la función adquiere una cota constante k'
formulas:
  - id: 'limite-doble-stewart'
    name: 'Definición Formal de Límite en R2'
    latex: '\lim_{(x,y) \to (x_0,y_0)} f(x, y) = L \iff \forall \varepsilon > 0, \, \exists \delta > 0 : 0 < \sqrt{(x-x_0)^2 + (y-y_0)^2} < \delta \implies |f(x,y) - L| < \varepsilon'
    description: 'El valor L debe alcanzarse independientemente de la trayectoria continua de aproximación.'
    tags: ["limite-doble", "epsilon-delta", "multivariable"]
  - id: 'limites-radiales-trayectorias'
    name: 'Criterio de Dos Trayectorias (Inexistencia del Límite)'
    latex: '\lim_{x \to 0} f(x, m x) = L_1(m) \implies \text{Si } L_1 \text{ depende de } m \implies \nexists \lim_{(x,y)\to(0,0)} f(x, y)'
    description: 'Si dos trayectorias distintas conducen a valores límites diferentes, el límite doble no existe.'
    tags: ["trayectorias", "radiales", "inexistencia"]
  - id: 'limite-coordenadas-polares-acotacion'
    name: 'Demostración de Existencia con Coordenadas Polares'
    latex: 'x = r\cos\theta, \; y = r\sin\theta \implies |f(r\cos\theta, r\sin\theta) - L| \le g(r) \xrightarrow[r \to 0^+]{} 0 \quad (\text{indep. de } \theta)'
    description: 'Aísla la distancia radial r para asegurar convergencia uniforme angular.'
    tags: ["polares", "acotacion", "existencia"]
---

# Funciones de Varias Variables y Límites

En el Capítulo 14 de Stewart, se extiende el concepto de función real a espacios de dimensión superior $f: D \subset \mathbb{R}^n \to \mathbb{R}$.

---

## 1. Curvas y Superficies de Nivel

- **Curvas de Nivel en $\mathbb{R}^2$:** Son las trazas horizontales de la superficie $z = f(x, y)$ proyectadas sobre el plano $xy$. Un mapa topográfico de curvas de nivel densas indica una pendiente muy pronunciada.
- **Superficies de Nivel en $\mathbb{R}^3$:** Para una función $w = f(x, y, z)$, la ecuación $f(x, y, z) = c$ define una superficie en el espacio tridimensional (ej. isotermas en meteorología, equipotenciales en electrostática).

---

## 2. Continuidad en Varias Variables

Una función $f(x, y)$ es continua en $(a, b)$ si:
$$\lim_{(x,y) \to (a,b)} f(x, y) = f(a, b)$$
Los polinomios en dos variables y las funciones racionales son continuos en todo su dominio de definición.

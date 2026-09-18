---
title: "Funciones Vectoriales, Curvas Espaciales y Geometría Diferencial (Stewart U1)"
unit: "U1: Funciones Vectoriales"
order: 1
tags:
  - "am2"
  - "funciones-vectoriales"
  - "frenet"
  - "curvatura"
  - "triedro"
  - "longitud-arco"
  - "stewart"
description: "Curvas espaciales en R3, límites y derivadas vectoriales, triedro móvil de Frenet-Serret (T, N, B), curvatura, torsión y componentes de la aceleración."
variables:
  - symbol: '\vec{r}(t) = \langle x(t), y(t), z(t) \rangle'
    name: 'Vector de posición paramétrico'
    description: 'Describe una curva suave en el espacio tridimensional en función del parámetro escalar t'
  - symbol: '\kappa(t)'
    name: 'Curvatura espacial'
    unit: 'm⁻¹'
    description: 'Rapidez de cambio de dirección del vector tangente respecto a la longitud de arco'
  - symbol: '\vec{T}, \, \vec{N}, \, \vec{B}'
    name: 'Triedro móvil de Frenet-Serret'
    description: 'Vectores ortonormales: Tangente unitario, Normal principal y Binormal'
formulas:
  - id: 'vector-tangente-unitario'
    name: 'Vector Tangente Unitario'
    latex: '\vec{T}(t) = \frac{\vec{r}''(t)}{\|\vec{r}''(t)\|} \quad [\|\vec{r}''(t)\| \neq 0]'
    description: 'Determina la dirección instantánea de movimiento a lo largo de la curva.'
    tags: ["tangente", "unitario", "frenet"]
  - id: 'vector-normal-principal'
    name: 'Vector Normal Principal y Binormal'
    latex: '\vec{N}(t) = \frac{\vec{T}''(t)}{\|\vec{T}''(t)\|}, \qquad \vec{B}(t) = \vec{T}(t) \times \vec{N}(t)'
    description: 'N apunta hacia el centro de curvatura y B es perpendicular al plano osculador.'
    tags: ["normal", "binormal", "triedro"]
  - id: 'curvatura-formula-vectorial'
    name: 'Fórmula General de la Curvatura Espacial'
    latex: '\kappa(t) = \frac{\|\vec{r}''(t) \times \vec{r}''''(t)\|}{\|\vec{r}''(t)\|^3}'
    description: 'Permite calcular la curvatura en cualquier parametrización sin necesidad del parámetro natural s.'
    tags: ["curvatura", "producto-cruz", "geometria-diferencial"]
  - id: 'componentes-aceleracion-tangencial-normal'
    name: 'Componentes Tangencial y Normal de la Aceleración'
    latex: '\vec{a} = a_T \vec{T} + a_N \vec{N} \implies a_T = \frac{\vec{r}''(t) \cdot \vec{r}''''(t)}{\|\vec{r}''(t)\|}, \quad a_N = \frac{\|\vec{r}''(t) \times \vec{r}''''(t)\|}{\|\vec{r}''(t)\|}'
    description: 'Descomposición intrínseca del vector aceleración en la dirección del movimiento y normal.'
    tags: ["aceleracion", "cinematica", "tangencial", "normal"]
---

# Funciones Vectoriales y Curvas Espaciales

En el Capítulo 14 de James Stewart, las funciones vectoriales $\vec{r}: \mathbb{R} \to \mathbb{R}^3$ permiten estudiar la cinemática de trayectorias en el espacio y las propiedades geométricas intrínsecas de las curvas.

---

## 1. El Triedro de Frenet-Serret y Planos Asociados

En cada punto regular de la curva espacial se definen tres vectores ortogonales de norma unitaria:
1. **Vector Tangente Unitario:** $\vec{T}(t) = \frac{\vec{r}'(t)}{\|\vec{r}'(t)\|}$.
2. **Vector Normal Principal:** $\vec{N}(t) = \frac{\vec{T}'(t)}{\|\vec{T}'(t)\|}$ (apunta hacia la concavidad).
3. **Vector Binormal:** $\vec{B}(t) = \vec{T}(t) \times \vec{N}(t)$.

Estos vectores generan tres planos fundamentales en el punto $P$:
- **Plano Osculador:** Contiene a $\vec{T}$ y $\vec{N}$ (normal: $\vec{B}$). Es el plano que mejor se ajusta a la curva localmente.
- **Plano Normal:** Perpendicular a la curva (normal: $\vec{T}$).
- **Plano Rectificante:** Contiene a $\vec{T}$ y $\vec{B}$ (normal: $\vec{N}$).

---

## 2. Longitud de Arco como Parámetro Natural

La función longitud de arco medida desde $t = a$ es:
$$s(t) = \int_a^t \|\vec{r}'(u)\| \, du \implies \frac{ds}{dt} = \|\vec{r}'(t)\| = v(t)$$
Al reparametrizar en función de $s$, la rapidez es unitaria: $\|\frac{d\vec{r}}{ds}\| = 1$, y la curvatura se simplifica a $\kappa = \|\frac{d\vec{T}}{ds}\|$.

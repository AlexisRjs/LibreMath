---
title: "Cinemática Diferencial: Componentes Intrínsecas y Coordenadas Polares"
unit: "Unidad 1: Cinemática Vectorial"
order: 1
tags:
  - "cinematica"
  - "intrinsecas"
  - "curvatura"
  - "polares"
  - "tiro-balistico"
  - "frenet-serret"
description: "Aceleración tangencial y centrípeta, triedro de Frenet, cinemática en coordenadas polares planas y análisis balístico avanzado."
variables:
  - symbol: '\vec{a} = a_t \hat{u}_t + a_n \hat{u}_n'
    name: 'Aceleración en coordenadas intrínsecas'
    description: 'Descomposición en componente tangencial (cambio de rapidez) y normal (cambio de dirección)'
  - symbol: '\rho'
    name: 'Radio de curvatura de la trayectoria'
    unit: 'm'
    description: 'Radio local del círculo osculador tangente a la curva'
  - symbol: '\dot{\theta} = \omega'
    name: 'Velocidad angular'
    unit: 'rad/s'
    description: 'Derivada temporal de la coordenada azimutal en polares'
formulas:
  - id: 'aceleracion-intrinseca'
    name: 'Componentes Intrínsecas de la Aceleración'
    latex: '\vec{a} = \frac{dv}{dt} \hat{u}_t + \frac{v^2}{\rho} \hat{u}_n'
    description: 'La aceleración tangencial altera el módulo del vector velocidad; la aceleración centrípeta curva la trayectoria.'
    tags: ["intrinsecas", "frenet", "centripeta"]
  - id: 'cinematica-coordenadas-polares'
    name: 'Aceleración en Coordenadas Polares Planas'
    latex: '\vec{a} = (\ddot{r} - r \dot{\theta}^2) \hat{u}_r + (r \ddot{\theta} + 2 \dot{r} \dot{\theta}) \hat{u}_\theta'
    description: 'El término 2\dot{r}\dot{\theta} es la aceleración complementaria o de Coriolis transversal.'
    tags: ["polares", "vectorial", "coriolis-cinematica"]
  - id: 'parabola-seguridad-balistica'
    name: 'Ecuación de la Parábola de Seguridad (Envolvente de Tiro)'
    latex: 'y = \frac{v_0^2}{2g} - \frac{g}{2 v_0^2} x^2'
    description: 'Frontera matemática del espacio accesible por un proyectil con rapidez inicial v_0 a cualquier ángulo.'
    tags: ["envolvente", "balistica", "seguridad"]
---

# Cinemática Vectorial Avanzada

En ingeniería mecánica y aeroespacial, el movimiento de vehículos y mecanismos articulados se modela mediante triedros móviles locales (Frenet-Serret) o coordenadas curvilíneas generalizadas.

---

## 1. El Triedro de Frenet y Componentes Intrínsecas

Dado el vector posición $\vec{r}(t)$, la velocidad es tangente a la curva: $\vec{v}(t) = v \hat{u}_t$, donde $v = \|\vec{v}\| = \frac{ds}{dt}$ es la rapidez escalar.

Derivando respecto al tiempo:
$$\vec{a}(t) = \frac{d}{dt}(v \hat{u}_t) = \frac{dv}{dt} \hat{u}_t + v \frac{d\hat{u}_t}{dt}$$

Por las relaciones de Frenet, $\frac{d\hat{u}_t}{ds} = \kappa \hat{u}_n = \frac{1}{\rho} \hat{u}_n$, por lo que $\frac{d\hat{u}_t}{dt} = \frac{v}{\rho} \hat{u}_n$:

$$\vec{a}(t) = \underbrace{\frac{dv}{dt} \hat{u}_t}_{\text{Aceleración Tangencial } a_t} + \underbrace{\frac{v^2}{\rho} \hat{u}_n}_{\text{Aceleración Normal / Centrípeta } a_n}$$

El módulo total de la aceleración resultante es:
$$a = \sqrt{a_t^2 + a_n^2} = \sqrt{\left(\frac{dv}{dt}\right)^2 + \left(\frac{v^2}{\rho}\right)^2}$$

---

## 2. Movimiento en Coordenadas Polares $(r, \theta)$

En el plano, la posición se define por $\vec{r} = r \hat{u}_r$. Como los versores $\hat{u}_r$ y $\hat{u}_\theta$ rotan con el móvil:

$$\frac{d\hat{u}_r}{dt} = \dot{\theta} \hat{u}_\theta, \qquad \frac{d\hat{u}_\theta}{dt} = -\dot{\theta} \hat{u}_r$$

- **Vector Velocidad:**
  $$\vec{v} = \dot{r} \hat{u}_r + r \dot{\theta} \hat{u}_\theta$$
- **Vector Aceleración:**
  $$\vec{a} = (\ddot{r} - r \dot{\theta}^2) \hat{u}_r + (r \ddot{\theta} + 2\dot{r}\dot{\theta}) \hat{u}_\theta$$

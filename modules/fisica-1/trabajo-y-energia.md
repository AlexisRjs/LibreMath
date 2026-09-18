---
title: "Trabajo, Curvas de Energía Potencial, Equilibrio y Pequeñas Oscilaciones"
unit: "Unidad 3: Trabajo y Energía"
order: 3
tags:
  - "energia"
  - "pozo-potencial"
  - "estabilidad"
  - "oscilaciones"
  - "gradiente"
  - "equilibrio"
description: "Campos conservativos por gradiente, análisis de pozos de energía potencial, estabilidad lineal y cálculo de frecuencias propias."
variables:
  - symbol: 'U(\vec{r})'
    name: 'Función escalar de energía potencial'
    unit: 'J'
    description: 'Campo escalar tal que \vec{F} = -\nabla U'
  - symbol: 'x_0'
    name: 'Punto de equilibrio estático'
    unit: 'm'
    description: 'Posición donde la fuerza neta se anula: dU/dx = 0'
  - symbol: '\omega_0'
    name: 'Frecuencia angular de pequeñas oscilaciones'
    unit: 'rad/s'
    description: 'Pulsación natural alrededor de una posición de equilibrio estable'
formulas:
  - id: 'relacion-fuerza-gradiente-potencial'
    name: 'Fuerza Conservativa como Gradiente del Potencial'
    latex: '\vec{F} = -\nabla U = -\left( \frac{\partial U}{\partial x}\hat{\imath} + \frac{\partial U}{\partial y}\hat{\jmath} + \frac{\partial U}{\partial z}\hat{k} \right)'
    description: 'Condición necesaria: rotacional nulo \nabla \times \vec{F} = \mathbf{0} en dominio simplemente conexo.'
    tags: ["gradiente", "conservativo", "rotacional"]
  - id: 'criterio-estabilidad-potencial'
    name: 'Criterio de Estabilidad de Puntos de Equilibrio'
    latex: '\begin{cases} U''(x_0) > 0 & \implies \text{Equilibrio Estable (mínimo de potencial)} \\ U''(x_0) < 0 & \implies \text{Equilibrio Inestable (máximo de potencial)} \\ U''(x_0) = 0 & \implies \text{Equilibrio Indiferente o de orden superior} \end{cases}'
    description: 'Clasificación matemática de estados de reposo en diseño estructural y mecatrónica.'
    tags: ["estabilidad", "equilibrio", "segunda-derivada"]
  - id: 'frecuencia-pequenas-oscilaciones'
    name: 'Pulsación Propia de Pequeñas Oscilaciones'
    latex: '\omega_0 = \sqrt{\frac{U''''(x_0)}{m}} \implies T = 2\pi \sqrt{\frac{m}{U''''(x_0)}}'
    description: 'Aproximación armónica de segundo orden de Taylor de cualquier pozo de potencial arbitrario.'
    tags: ["oscilaciones", "frecuencia-propia", "taylor-potencial"]
---

# Teoría del Potencial y Análisis de Estabilidad

En dinámica no lineal e ingeniería estructural, el trazado de curvas de energía potencial $U(x)$ permite determinar de inmediato las trayectorias de fase, las regiones prohibidas clásicamente ($E < U(x)$) y la respuesta a perturbaciones.

---

## 1. Linealización de Pozos de Potencial (Aproximación Armónica)

Sea un sistema conservativo 1D con energía potencial $U(x)$ suave. Desarrollando en serie de Taylor alrededor de un punto de equilibrio estable $x_0$ ($U'(x_0) = 0$):

$$U(x) = U(x_0) + \underbrace{U'(x_0)}_{=0}(x - x_0) + \frac{1}{2} U''(x_0)(x - x_0)^2 + \mathcal{O}((x - x_0)^3)$$

Definiendo la constante elástica equivalente $k_{\text{eq}} = U''(x_0) > 0$:

$$U(x) \approx U(x_0) + \frac{1}{2} k_{\text{eq}} (\Delta x)^2$$

La fuerza restauradora lineal es:
$$F(x) = -\frac{dU}{dx} = -k_{\text{eq}} (x - x_0)$$

Por la Segunda Ley de Newton $m \ddot{x} = -k_{\text{eq}} x \implies \ddot{x} + \frac{k_{\text{eq}}}{m} x = 0$, la pulsación natural de vibración es exactamente:
$$\omega_0 = \sqrt{\frac{U''(x_0)}{m}}$$

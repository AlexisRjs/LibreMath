---
title: "Movimiento Ondulatorio: Ecuación de Onda, Parámetros y Ondas Estacionarias"
unit: "Óptica Física: Movimiento Ondulatorio"
order: 10
tags:
  - "fisica-2"
  - "movimiento-ondulatorio"
  - "ecuacion-onda"
  - "dalembert"
  - "ondas-estacionarias"
  - "velocidad-fase"
description: "Propagación ondulatoria, solución armónica de D'Alembert, frecuencia, longitud de onda, transporte de potencia y modos estacionarios."
variables:
  - symbol: 'k = \frac{2\pi}{\lambda}'
    name: 'Número de onda angular'
    unit: 'rad/m'
    description: 'Frecuencia espacial o número de ciclos por unidad de longitud'
  - symbol: 'v = \lambda \cdot f = \frac{\omega}{k}'
    name: 'Velocidad de fase de propagación'
    unit: 'm/s'
    description: 'Rapidez con la cual se desplaza el frente de onda o cresta en el medio'
  - symbol: 'y(x, t) = A \cos(kx - \omega t + \phi)'
    name: 'Función de onda progresiva armónica'
    unit: 'm'
    description: 'Describe el desplazamiento del punto x en el instante temporal t'
formulas:
  - id: 'ecuacion-onda-clasica-dalembert'
    name: 'Ecuación Diferencial de Onda 1D (D''Alembert)'
    latex: '\frac{\partial^2 y}{\partial x^2} = \frac{1}{v^2} \frac{\partial^2 y}{\partial t^2} \implies y(x, t) = f(x - vt) + g(x + vt)'
    description: 'EDP lineal que rige la propagación de cualquier perturbación no dispersiva.'
    tags: ["ecuacion-onda", "dalembert", "edp"]
  - id: 'velocidad-onda-cuerda-tensa'
    name: 'Velocidad de Propagación en Cuerda Tensa'
    latex: 'v = \sqrt{\frac{T}{\mu}} \quad \left(\mu = \frac{m}{L} \text{ densidad lineal de masa}\right)'
    description: 'T es la tensión mecánica de tracción en Newtons.'
    tags: ["velocidad-onda", "cuerda", "tension"]
  - id: 'potencia-media-onda-mecanica'
    name: 'Potencia Media Transportada por una Onda'
    latex: '\bar{P} = \frac{1}{2} \mu \cdot v \cdot \omega^2 \cdot A^2 \implies I = \frac{\bar{P}}{\text{Área}} \propto A^2 \omega^2'
    description: 'El flujo de energía es estrictamente proporcional al cuadrado de la amplitud y frecuencia.'
    tags: ["potencia-onda", "intensidad", "energia"]
  - id: 'modos-normales-ondas-estacionarias'
    name: 'Frecuencias de Modos Normales (Extremos Fijos)'
    latex: 'f_n = n \cdot \frac{v}{2L} = \frac{n}{2L} \sqrt{\frac{T}{\mu}} \quad (n = 1, 2, 3, \dots)'
    description: 'Condición de contorno que establece nodos en los extremos rígidos de la cuerda.'
    tags: ["ondas-estacionarias", "modos-normales", "nodos"]
---

# Teoría del Movimiento Ondulatorio

Una onda es la propagación de una perturbación física que transporta energía e impulso a través del espacio sin acarrear consigo materia neta.

---

## 1. Ondas Estacionarias y Superposición

Al interferir dos ondas idénticas viajando en sentidos contrarios:
$$y(x, t) = [2A \sin(kx)] \cos(\omega t)$$
- **Nodos (desplazamiento nulo permanente):** Ocurren donde $\sin(kx) = 0 \implies x_n = n \frac{\lambda}{2}$.
- **Vientres o Antinodos (amplitud máxima $2A$):** Ocurren donde $\sin(kx) = \pm 1 \implies x_v = (2n + 1)\frac{\lambda}{4}$.
A diferencia de las ondas progresivas, una onda estacionaria **no transporta energía neta** en el espacio.

---
title: "Capacidad, Condensadores, Dieléctricos y Energía Electrostática"
unit: "Electricidad y Magnetismo: Capacidad y Capacitores"
order: 3
tags:
  - "fisica-2"
  - "capacidad"
  - "capacitores"
  - "condensadores"
  - "dielectricos"
  - "energia-almacenada"
description: "Definición de capacidad eléctrica, geometrías fundamentales (plano, cilíndrico, esférico), asociaciones en serie/paralelo y densidad de energía electrostática."
variables:
  - symbol: 'C = \frac{Q}{\Delta V}'
    name: 'Capacidad eléctrica'
    unit: 'F (Faradio = C/V)'
    description: 'Capacidad de un sistema de conductores para almacenar carga eléctrica por unidad de diferencia de potencial'
  - symbol: 'U = \frac{1}{2} C V^2'
    name: 'Energía potencial electrostática almacenada'
    unit: 'J'
    description: 'Trabajo necesario para transferir la carga de una armadura a otra'
  - symbol: 'u_E = \frac{1}{2} \varepsilon E^2'
    name: 'Densidad volumétrica de energía'
    unit: 'J/m³'
    description: 'Energía almacenada directamente en el campo eléctrico por unidad de volumen'
formulas:
  - id: 'capacidad-capacitor-plano'
    name: 'Capacidad del Capacitor de Placas Paralelas'
    latex: 'C = \kappa \cdot \varepsilon_0 \frac{A}{d} = \varepsilon \frac{A}{d}'
    description: 'A es el área de las armaduras y d la distancia de separación dieléctrica.'
    tags: ["capacitor-plano", "geometria", "dielectrico"]
  - id: 'capacidad-capacitor-cilindrico-esferico'
    name: 'Capacitores Cilíndricos y Esféricos'
    latex: 'C_{\text{cil}} = \frac{2\pi\varepsilon L}{\ln(b/a)}, \qquad C_{\text{esf}} = 4\pi\varepsilon \frac{a \cdot b}{b - a}'
    description: 'Radios concéntricos a (interior) y b (exterior) con longitud axial L.'
    tags: ["cilindrico", "esferico", "geometrias"]
  - id: 'asociacion-serie-paralelo-capacitores'
    name: 'Asociación de Capacitores (Serie y Paralelo)'
    latex: 'C_{\text{paralelo}} = \sum_{i=1}^n C_i, \qquad \frac{1}{C_{\text{serie}}} = \sum_{i=1}^n \frac{1}{C_i}'
    description: 'En paralelo se suman las cargas (mismo V); en serie se suman las tensiones (misma Q).'
    tags: ["asociacion", "serie", "paralelo", "equivalente"]
  - id: 'energia-almacenada-capacitor'
    name: 'Energía Almacenada en un Capacitor'
    latex: 'U = \frac{1}{2} Q \cdot \Delta V = \frac{1}{2} C (\Delta V)^2 = \frac{Q^2}{2C}'
    description: 'Energía acumulada en el campo electrostático confinado entre las placas.'
    tags: ["energia", "almacenada", "joule"]
---

# Capacidad y Almacenamiento de Energía Eléctrica

Los capacitores o condensadores son dispositivos capaces de almacenar energía electrostática mediante la separación controlada de cargas en armaduras conductoras aisladas por un dieléctrico.

---

## 1. Efecto de la Inserción de un Dieléctrico

Cuando se introduce un material aislante con constante dieléctrica $\kappa > 1$:
1. **Capacitor Conectado a Fuente Constante ($V = \text{cte}$):**
   $$C = \kappa C_0, \qquad Q = \kappa Q_0, \qquad E = E_0, \qquad U = \kappa U_0$$
2. **Capacitor Desconectado y Aislado ($Q = \text{cte}$):**
   $$C = \kappa C_0, \qquad V = \frac{V_0}{\kappa}, \qquad E = \frac{E_0}{\kappa}, \qquad U = \frac{U_0}{\kappa}$$

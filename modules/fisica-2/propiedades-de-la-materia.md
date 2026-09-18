---
title: "Propiedades Eléctricas de la Materia: Conductores y Dieléctricos"
unit: "Electricidad y Magnetismo: Propiedades de la Materia"
order: 2
tags:
  - "fisica-2"
  - "conductores"
  - "dielectricos"
  - "polarizacion"
  - "desplazamiento"
  - "faraday"
description: "Conductores en equilibrio electrostático, efecto punta, jaula de Faraday, dipolos moleculares, vector polarización P y vector desplazamiento D en medios materiales."
variables:
  - symbol: '\vec{P}'
    name: 'Vector Polarización Eléctrica'
    unit: 'C/m²'
    description: 'Momento dipolar eléctrico inducido por unidad de volumen de material dieléctrico'
  - symbol: '\vec{D}'
    name: 'Vector Desplazamiento Eléctrico'
    unit: 'C/m²'
    description: 'Campo auxiliar que relaciona el campo eléctrico con las cargas libres exclusivamente'
  - symbol: '\kappa = \varepsilon_r'
    name: 'Constante dieléctrica relativa'
    unit: 'adimensional'
    description: 'Factor de atenuación del campo electrostático al introducir el aislante'
formulas:
  - id: 'campo-superficie-conductor'
    name: 'Campo Eléctrico en la Superficie de un Conductor'
    latex: 'E_{\text{sup}} = \frac{\sigma}{\varepsilon_0} \hat{n}, \qquad \vec{E}_{\text{interior}} = \mathbf{0}, \qquad V = \text{cte en todo el conductor}'
    description: 'El exceso de carga libre reside exclusivamente en la frontera externa del conductor en equilibrio.'
    tags: ["conductor", "equilibrio", "superficie", "campo-nulo"]
  - id: 'vector-desplazamiento-gauss-materia'
    name: 'Vector Desplazamiento D y Ley de Gauss en Dieléctricos'
    latex: '\vec{D} = \varepsilon_0 \vec{E} + \vec{P} = \varepsilon \vec{E} \implies \oiint \vec{D} \cdot d\vec{A} = Q_{\text{libre}} \iff \nabla \cdot \vec{D} = \rho_{\text{libre}}'
    description: 'Permite calcular campos en presencia de medios aislantes sin conocer las cargas ligadas.'
    tags: ["desplazamiento", "dielectricos", "gauss-materia"]
  - id: 'densidades-carga-polarizacion'
    name: 'Cargas Ligadas de Polarización en Dieléctricos'
    latex: '\sigma_p = \vec{P} \cdot \hat{n}, \qquad \rho_p = -\nabla \cdot \vec{P}'
    description: 'Densidades de carga inducidas por el alineamiento de dipolos moleculares.'
    tags: ["cargas-ligadas", "polarizacion", "dipolo"]
---

# Conductores y Dieléctricos en Campos Electrostáticos

En los medios materiales reales, los campos eléctricos interactúan con electrones libres en los metales y redistribuyen los momentos dipolares en los dieléctricos.

---

## 1. Conductores en Equilibrio Electrostático

1. **Campo Eléctrico Nulo en el Interior:** $\vec{E} = \mathbf{0}$. Si hubiera campo, los electrones libres experimentarían fuerza neta acelerándose, rompiendo el equilibrio.
2. **Carga en la Superficie:** Toda la carga neta se ubica en la superficie exterior ($\rho_{\text{int}} = 0$).
3. **Equipotencialidad:** Todo el conductor se encuentra a un mismo potencial electrostático constante $V$.
4. **Jaula de Faraday (Blindaje Electrostático):** En una cavidad vacía dentro de un conductor, el campo eléctrico es exactamente idéntico a cero, aislando cualquier instrumento interno de campos exteriores.

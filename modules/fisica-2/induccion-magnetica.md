---
title: "Inducción Electromagnética: Faraday-Lenz, Autoinducción y Circuitos RL"
unit: "Electricidad y Magnetismo: Inducción Magnética"
order: 6
tags:
  - "fisica-2"
  - "induccion"
  - "faraday"
  - "lenz"
  - "autoinduccion"
  - "circuito-rl"
  - "energia-magnetica"
description: "Flujo magnético variable, Ley de Faraday-Lenz, fem de movimiento, inductancia mutua, coeficiente de autoinducción L y energía almacenada en inductores."
variables:
  - symbol: '\mathcal{E}'
    name: 'Fuerza electromotriz inducida (fem)'
    unit: 'V (Voltio)'
    description: 'Circulación del campo eléctrico inducido no electrostático'
  - symbol: 'L'
    name: 'Coeficiente de autoinducción (Inductancia)'
    unit: 'H (Henrio = V·s/A = Ω·s)'
    description: 'Relación de proporcionalidad entre el flujo propio y la corriente que lo genera'
  - symbol: '\tau_L = \frac{L}{R}'
    name: 'Constante de tiempo inductiva'
    unit: 's'
    description: 'Tiempo necesario para que la corriente en un circuito RL alcance el 63.2% de su régimen permanente'
formulas:
  - id: 'ley-faraday-lenz-integral'
    name: 'Ley de Faraday-Lenz (Integral y Diferencial)'
    latex: '\mathcal{E} = -\frac{d\Phi_B}{dt} = -\frac{d}{dt} \iint_S \vec{B} \cdot d\vec{A} \iff \oint_C \vec{E} \cdot d\vec{l} = -\iint_S \frac{\partial \vec{B}}{\partial t} \cdot d\vec{A}'
    description: 'Un campo magnético variable en el tiempo engendra un campo eléctrico no conservativo.'
    tags: ["faraday", "lenz", "fem-inducida", "flujo"]
  - id: 'fem-movimiento-conductor-movil'
    name: 'Fuerza Electromotriz de Movimiento'
    latex: '\mathcal{E}_{\text{motriz}} = \oint (\vec{v} \times \vec{B}) \cdot d\vec{l} = B \cdot L \cdot v \quad (\vec{v} \perp \vec{B} \perp \vec{L})'
    description: 'Fem generada por el desplazamiento mecánico de una varilla conductora en seno de un campo B uniforme.'
    tags: ["fem-movimiento", "conductor-movil", "generador"]
  - id: 'autoinduccion-solenoide'
    name: 'Coeficiente de Autoinducción de un Solenoide'
    latex: 'L = \frac{N \Phi_B}{I} = \mu_0 \cdot n^2 \cdot A \cdot l = \mu_0 \frac{N^2 A}{l}'
    description: 'Depende exclusivamente de la geometría del solenoide y de las propiedades del núcleo.'
    tags: ["autoinduccion", "henrio", "solenoide"]
  - id: 'energia-almacenada-inductor'
    name: 'Energía Almacenada en un Campo Magnético'
    latex: 'U_B = \frac{1}{2} L I^2 \implies u_B = \frac{B^2}{2\mu_0} \quad (\text{Densidad volumétrica de energía})'
    description: 'Energía acumulada en el campo magnético del inductor durante el paso de corriente.'
    tags: ["energia-magnetica", "densidad-energia", "inductor"]
---

# Inducción Electromagnética y Ley de Faraday

La inducción electromagnética es el principio operativo sobre el cual reposa la generación y transformación de energía eléctrica industrial en todo el planeta.

---

## 1. Regla de Oposición de Lenz

El signo negativo en $\mathcal{E} = -\frac{d\Phi_B}{dt}$ refleja la conservación de la energía:
> *El sentido de la corriente inducida es tal que el campo magnético que ella misma crea se opone rigurosamente a la variación del flujo magnético primario que la origina.*

---

## 2. Transitorio en Circuito RL Serie

Al conectar una bobina pura $L$ con resistencia $R$ a una fuente continua $\mathcal{E}_0$:
$$I(t) = \frac{\mathcal{E}_0}{R} \left( 1 - e^{-t / \tau_L} \right), \qquad V_L(t) = \mathcal{E}_0 e^{-t / \tau_L}$$
La inductancia $L$ actúa como una inercia eléctrica, oponiéndose a los cambios bruscos de corriente.

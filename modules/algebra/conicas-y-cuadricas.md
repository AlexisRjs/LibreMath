---
title: "Cónicas, Rotación Matricial de Ejes y Superficies Cuádricas"
unit: "Unidad 7: Cónicas, Rotación Matricial y Superficies Cuádricas"
order: 7
tags:
  - "conicas"
  - "cuadricas"
  - "rotacion-matricial"
  - "elipsoide"
  - "hiperboloide"
  - "paraboloide"
  - "trazas"
description: "Eliminación de términos cruzados en cónicas por diagonalización ortogonal, y catálogo completo de superficies cuádricas en UTN FRRO."
variables:
  - symbol: 'Q(x, y, z) = 0'
    name: 'Ecuación general de segundo grado en R^3'
    description: 'Forma cuadrática general que define una superficie cuádrica en el espacio'
  - symbol: '\theta'
    name: 'Ángulo de rotación de ejes'
    unit: 'rad'
    description: '\cot(2\theta) = \frac{A - C}{B} para desacoplar el término rectangular Bxy'
formulas:
  - id: 'rotacion-ejes-matricial'
    name: 'Rotación de Ejes en R^2 por Matriz Ortogonal'
    latex: '\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \begin{pmatrix} x'' \\ y'' \end{pmatrix} \quad \text{donde } \cot(2\theta) = \frac{A - C}{B}'
    description: 'Transforma Ax^2 + Bxy + Cy^2 en forma canónica diagonal A''(x'')^2 + C''(y'')^2.'
    tags: ["rotacion", "ortogonal", "conicas"]
  - id: 'elipsoide-canonica'
    name: 'Ecuación Canónica del Elipsoide'
    latex: '\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1'
    description: 'Superficie cerrada y acotada con simetría en los tres planos coordenados y trazas elípticas.'
    tags: ["elipsoide", "cuadrica", "cerrada"]
  - id: 'hiperboloide-una-dos-hojas'
    name: 'Hiperboloides de 1 Hoja y 2 Hojas'
    latex: '\text{1 Hoja: } \frac{x^2}{a^2} + \frac{y^2}{b^2} - \frac{z^2}{c^2} = 1, \qquad \text{2 Hojas: } -\frac{x^2}{a^2} - \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1'
    description: 'El signo negativo indica el eje a lo largo del cual se abren o se bifurcan las ramas de la cuádrica.'
    tags: ["hiperboloide", "una-hoja", "dos-hojas"]
  - id: 'paraboloides-eliptico-hiperbolico'
    name: 'Paraboloides Elíptico e Hiperbólico (Silla de Montar)'
    latex: '\text{Elíptico: } \frac{z}{c} = \frac{x^2}{a^2} + \frac{y^2}{b^2}, \qquad \text{Hiperbólico: } \frac{z}{c} = \frac{y^2}{b^2} - \frac{x^2}{a^2}'
    description: 'Cuádricas no centradas cuyas secciones son parábolas y elipses/hipérbolas.'
    tags: ["paraboloide", "silla-montar", "sin-centro"]
---

# Geometría Cuadrática y Superficies en $\mathbb{R}^3$

En la UTN FRRO, el estudio de cónicas y cuádricas articula el cálculo de autovalores con la visualización espacial requerida en Estructuras, Resistencia de Materiales y Electromagnetismo.

---

## 1. Catálogo Fundamental de Superficies Cuádricas

| Superficie Cuádrica | Ecuación Canónica (Centro en $(0,0,0)$) | Trazas Paralelas a los Planos Coordenados |
|---|---|---|
| **Elipsoide** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} + \frac{z^2}{c^2} = 1$ | Elipses en los tres planos ($|z| \le c$) |
| **Hiperboloide de 1 Hoja** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} - \frac{z^2}{c^2} = 1$ | Elipses en planos paralelos a $xy$, hipérbolas en $xz$ y $yz$ |
| **Hiperboloide de 2 Hojas** | $\frac{z^2}{c^2} - \frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$ | Elipses en $|z| \ge c$, hipérbolas en $xz$ y $yz$ |
| **Cono Elíptico** | $\frac{x^2}{a^2} + \frac{y^2}{b^2} - \frac{z^2}{c^2} = 0$ | Punto en el origen, elipses para $z \neq 0$ y pares de rectas secantes |
| **Paraboloide Elíptico** | $\frac{z}{c} = \frac{x^2}{a^2} + \frac{y^2}{b^2}$ | Parábolas en $xz$ y $yz$, elipses para $z > 0$ |
| **Paraboloide Hiperbólico** | $\frac{z}{c} = \frac{y^2}{b^2} - \frac{x^2}{a^2}$ | Parábolas de curvatura opuesta y familias de rectas regladas |

> [!TIP]
> **Técnica de examen para identificar cuádricas:**
> Observar los signos de las variables cuadráticas:
> - Tres signos $(+, +, +) \implies$ **Elipsoide**.
> - Dos positivos y uno negativo $(+, +, -)$ igualado a $1 \implies$ **Hiperboloide de 1 Hoja**.
> - Un positivo y dos negativos $(+, -, -)$ igualado a $1 \implies$ **Hiperboloide de 2 Hojas**.
> - Dos variables cuadráticas y una lineal de grado 1 $\implies$ **Paraboloide**.

---
title: "Transformaciones Lineales, Núcleo, Imagen y Teorema de las Dimensiones"
unit: "Unidad 5: Transformaciones Lineales, Núcleo e Imagen"
order: 5
tags:
  - "transformaciones-lineales"
  - "nucleo"
  - "imagen"
  - "teorema-dimensiones"
  - "monomorfismo"
  - "epimorfismo"
  - "isomorfismo"
  - "matriz-asociada"
description: "Definición axiomática, determinación del núcleo e imagen, matriz estándar y asociada a bases cualesquiera en la UTN FRRO."
variables:
  - symbol: 'T: V \to W'
    name: 'Transformación Lineal'
    description: 'Operador lineal entre dos espacios vectoriales sobre el cuerpo real'
  - symbol: '\text{Nu}(T) = \ker(T)'
    name: 'Núcleo o Kernel'
    description: 'Subespacio de V formado por los vectores cuya imagen es el vector nulo de W'
  - symbol: '\text{Im}(T)'
    name: 'Imagen o Rango'
    description: 'Subespacio de W formado por todas las imágenes generadas por T'
formulas:
  - id: 'teorema-fundamental-dimensiones-tl'
    name: 'Teorema Fundamental de las Dimensiones para TL'
    latex: '\dim(V) = \dim(\text{Nu}(T)) + \dim(\text{Im}(T)) \iff n = \text{nulidad}(T) + \text{rango}(T)'
    description: 'La dimensión del espacio de partida se reparte entre la nulidad y el rango del operador.'
    tags: ["teorema", "dimensiones", "nucleo-imagen"]
  - id: 'criterio-inyectividad-tl'
    name: 'Criterio de Inyectividad (Monomorfismo)'
    latex: 'T \text{ es inyectiva (monomorfismo) } \iff \text{Nu}(T) = \{ \mathbf{0}_V \} \iff \dim(\text{Nu}(T)) = 0'
    description: 'Una transformación lineal es inyectiva si y sólo si su núcleo es estrictamente trivial.'
    tags: ["inyectiva", "monomorfismo", "nucleo-trivial"]
  - id: 'matriz-asociada-tl'
    name: 'Ecuación Fundamental con Matriz Asociada'
    latex: '[T(\mathbf{v})]_{B_W} = [T]_{B_V}^{B_W} \cdot [\mathbf{v}]_{B_V}'
    description: 'Las columnas de la matriz asociada son las imágenes de los vectores de la base de partida expresadas en la base de llegada.'
    tags: ["matriz-asociada", "representacion", "bases"]
---

# Transformaciones Lineales y Representación Matricial

Las transformaciones lineales son los homomorfismos entre espacios vectoriales. En ingeniería gobiernan el procesamiento digital de señales, las rotaciones tridimensionales en computación gráfica y el análisis modal.

---

## 1. Definición y Propiedades Inmediatas

Una aplicación $T: V \to W$ es lineal si satisface simultáneamente:
1. $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}), \quad \forall \mathbf{u}, \mathbf{v} \in V$
2. $T(\alpha \mathbf{u}) = \alpha T(\mathbf{u}), \quad \forall \alpha \in \mathbb{R}, \; \forall \mathbf{u} \in V$

> [!NOTE]
> **Propiedades obligatorias:**
> - $T(\mathbf{0}_V) = \mathbf{0}_W$ (si no envía el nulo al nulo, **no es lineal**).
> - $T(-\mathbf{v}) = -T(\mathbf{v})$.
> - $T\left( \sum c_i \mathbf{v}_i \right) = \sum c_i T(\mathbf{v}_i)$ (principio de superposición lineal).

---

## 2. Clasificación de Transformaciones Lineales

Dada $T: V \to W$:
- **Monomorfismo (Inyectiva):** $\text{Nu}(T) = \{ \mathbf{0} \}$. Transforma conjuntos LI de $V$ en conjuntos LI de $W$.
- **Epimorfismo (Sobreyectiva):** $\text{Im}(T) = W \iff \dim(\text{Im}(T)) = \dim(W)$.
- **Isomorfismo (Biyectiva):** Monomorfismo y Epimorfismo simultáneamente. Si $\dim(V) = \dim(W) = n$, basta con probar cualquiera de las dos condiciones.
- **Endomorfismo:** Cuando el espacio de llegada coincide con el de partida ($T: V \to V$).
- **Automorfismo:** Endomorfismo biyectivo.

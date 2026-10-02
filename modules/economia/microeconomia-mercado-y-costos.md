---
title: "Microeconomía: Leyes de Mercado, Elasticidad y Teoría de los Costos de Producción"
unit: "Unidad 1: Microeconomía: Demanda, Oferta, Elasticidad y Costos de Producción"
order: 1
tags:
  - "economia"
  - "utn-frro"
  - "microeconomia"
  - "oferta-demanda"
  - "elasticidad"
  - "costos"
  - "punto-equilibrio"
  - "estructuras-mercado"
description: "Mecanismo de precios en mercados competitivos: curvas de oferta y demanda, elasticidad precio e ingreso, función de producción a corto y largo plazo, costos fijos, variables, marginales y cálculo del punto de equilibrio operativo."
variables:
  - symbol: 'Q_d, Q_s'
    name: 'Cantidad demandada y ofrecida'
    description: 'Cantidades de un bien que los consumidores desean adquirir y los productores están dispuestos a vender a determinado nivel de precios'
  - symbol: 'P_e, Q_e'
    name: 'Precio y Cantidad de Equilibrio'
    description: 'Valores donde se iguala la oferta y la demanda, vaciando el mercado sin escasez ni excedente'
formulas:
  - id: 'elasticidad-precio-demanda'
    name: 'Elasticidad Precio de la Demanda'
    latex: '\varepsilon_p = \frac{\Delta Q / Q}{\Delta P / P} = \frac{dQ}{dP} \cdot \frac{P}{Q}'
    description: 'Variación porcentual en la cantidad demandada ante una variación del 1% en el precio del bien.'
    tags: ["elasticidad", "demanda", "microeconomia"]
  - id: 'costo-marginal'
    name: 'Costo Marginal (CMg)'
    latex: 'CMg = \frac{d(CT)}{dQ} = \frac{\Delta CT}{\Delta Q}'
    description: 'Incremento en el costo total al producir una unidad adicional del bien.'
    tags: ["costos", "marginal", "derivada"]
  - id: 'punto-de-equilibrio-unidades'
    name: 'Punto de Equilibrio Operativo (Break-Even Point)'
    latex: 'Q^* = \frac{CF}{P - CV_u}'
    description: 'Nivel mínimo de producción y ventas en unidades físicas donde los ingresos totales igualan a los costos totales (beneficio cero).'
    tags: ["punto-equilibrio", "costos-fijos", "break-even"]
---

# Microeconomía y Teoría de Costos para Ingenieros (UTN FRRO)

La microeconomía estudia la toma de decisiones de agentes individuales (empresas, consumidores e industrias) y la asignación eficiente de recursos escasos.

---

## 1. Funcionamiento del Mercado: Oferta y Demanda

### A. Ley de la Demanda
Existe una relación inversa entre el precio ($P$) de un bien y la cantidad demandada ($Q_d$), manteniendo constantes las demás variables (*ceteris paribus*):
$$Q_d = a - b P, \quad b > 0$$
* **Desplazamientos sobre la curva**: Causados exclusivamente por cambios en el precio propio del bien.
* **Desplazamientos de toda la curva**: Causados por cambios en el ingreso de los consumidores, precios de bienes sustitutos o complementarios, gustos/preferencias y expectativas.

### B. Ley de la Oferta
Existe una relación directa y positiva entre el precio y la cantidad que los productores desean ofrecer en el mercado:
$$Q_s = c + d P, \quad d > 0$$

### C. Equilibrio de Mercado
El equilibrio se alcanza cuando la cantidad demandada es exactamente igual a la ofrecida ($Q_d = Q_s$):
$$a - b P_e = c + d P_e \implies P_e = \frac{a - c}{b + d}$$
* Si $P > P_e$: Hay **exceso de oferta** (excedente de stock), lo que presiona los precios a la baja.
* Si $P < P_e$: Hay **exceso de demanda** (escasez), lo que presiona los precios al alza.

---

## 2. Elasticidad Precio de la Demanda ($\varepsilon_p$)

Mide el grado de sensibilidad de la demanda ante variaciones en el precio:

$$\varepsilon_p = \left| \frac{\% \Delta Q}{\% \Delta P} \right| = \left| \frac{dQ}{dP} \cdot \frac{P}{Q} \right|$$

* **Elástica ($\varepsilon_p > 1$)**: La cantidad demandada varía en mayor proporción que el precio (bienes con muchos sustitutos, bienes de lujo). Conviene bajar precios para maximizar el ingreso total ($IT = P \cdot Q$).
* **Inelástica ($\varepsilon_p < 1$)**: La cantidad responde poco a cambios de precio (bienes de primera necesidad, electricidad, insulina, combustibles). Conviene subir precios para aumentar el ingreso total.
* **Elasticidad Unitaria ($\varepsilon_p = 1$)**: El ingreso total es máximo.

---

## 3. Teoría de los Costos de Producción en el Corto Plazo

En el corto plazo coexisten factores de producción fijos (maquinaria, instalaciones) y variables (mano de obra directa, materias primas):

1. **Costo Fijo ($CF$)**: No varía con el volumen de producción ($Q$).
2. **Costo Variable ($CV$)**: Varía directamente con el nivel de actividad ($CV(Q) = CV_u \cdot Q$).
3. **Costo Total ($CT$)**:
   $$CT = CF + CV(Q)$$
4. **Costo Medio o Unitario ($CMe$)**:
   $$CMe = \frac{CT}{Q} = \frac{CF}{Q} + \frac{CV}{Q} = CFMe + CVMe$$
5. **Costo Marginal ($CMg$)**:
   $$CMg = \frac{d(CT)}{dQ} = \frac{d(CV)}{dQ}$$
   > **Regla de oro de maximización de beneficios de la empresa**:
   > Cualquier empresa maximiza sus beneficios en el nivel de producción donde el **Ingreso Marginal iguala al Costo Marginal**:
   $$IMg = CMg$$
   En competencia perfecta, como el precio viene dado por el mercado ($P = IMg$), la condición se reduce a $P = CMg$.

---

## 4. Cálculo del Punto de Equilibrio Operativo (Break-Even)

El **Punto de Equilibrio** es el nivel de actividad donde la empresa no gana ni pierde dinero (Beneficio $B = 0$):

$$\text{Ingreso Total} = \text{Costo Total}$$
$$P \cdot Q^* = CF + CV_u \cdot Q^*$$
$$Q^*(P - CV_u) = CF \implies Q^* = \frac{CF}{P - CV_u}$$

* $P - CV_u$: **Margen de Contribución Unitario ($MC_u$)**. Indica cuánto aporta cada unidad vendida a cubrir los costos fijos de estructura y generar ganancia.
* **Punto de equilibrio en pesos / facturación**:
  $$\text{Ventas}^* = \frac{CF}{1 - \frac{CV_u}{P}}$$

---

## 5. Estructuras de Mercado

| Característica | Competencia Perfecta | Monopolio | Oligopolio | Competencia Monopolística |
| :--- | :--- | :--- | :--- | :--- |
| **N° de oferentes** | Infinitos / Muy numerosos | **Uno solo** | Pocos dominantes | Muchos |
| **Tipo de producto** | Homogéneo / Idéntico | Único (sin sustitutos) | Homogéneo o diferenciado | Diferenciado (marcas) |
| **Poder de mercado** | Nulo (*Price-takers*) | **Total (*Price-maker*)** | Alto (interdependencia estratégica) | Leve sobre su marca |
| **Barreras de entrada**| Nulas / Libre entrada | **Muy altas** (patentes, naturales) | Altas (capital intensivo) | Bajas |
| **Ejemplo real** | Mercados de granos (trigo, soja) | Transporte de gas por red, patentes farmacéuticas | Telecomunicaciones (Claro, Telecom, Movistar) | Cafeterías, software SaaS |

---
title: "Evaluación Económica de Proyectos: Flujo de Fondos, VAN, TIR y Payback"
unit: "Unidad 3: Evaluación Económica y Financiera de Proyectos de Inversión"
order: 3
tags:
  - "economia"
  - "utn-frro"
  - "evaluacion-proyectos"
  - "van"
  - "tir"
  - "payback"
  - "flujo-de-fondos"
  - "tasa-descuento"
  - "ingenieria-economica"
description: "Metodologías cuantitativas para la toma de decisiones de inversión en ingeniería: construcción del flujo de caja proyectado, valor tiempo del dinero, cálculo del Valor Actual Neto (VAN), Tasa Interna de Retorno (TIR) y período de recupero."
variables:
  - symbol: 'I_0'
    name: 'Inversión inicial'
    description: 'Desembolso de capital en el momento cero para adquirir activos fijos y capital de trabajo'
  - symbol: 'FF_t'
    name: 'Flujo de fondos neto del período t'
    description: 'Diferencia neta entre ingresos cobrables y egresos operativos y fiscales en el período t'
  - symbol: 'r = k'
    name: 'Tasa de descuento / Costo de oportunidad del capital'
    description: 'Rendimiento mínimo exigido al proyecto según el riesgo del negocio (WACC)'
formulas:
  - id: 'valor-actual-neto-van'
    name: 'Valor Actual Neto (VAN / NPV)'
    latex: '\text{VAN} = -I_0 + \sum_{t=1}^{n} \frac{FF_t}{(1 + r)^t}'
    description: 'Suma de todos los flujos de fondos netos futuros descontados a valor presente menos la inversión inicial.'
    tags: ["van", "npv", "evaluacion", "inversion"]
  - id: 'tasa-interna-retorno-tir'
    name: 'Tasa Interna de Retorno (TIR / IRR)'
    latex: '\text{VAN}(\text{TIR}) = 0 \iff -I_0 + \sum_{t=1}^{n} \frac{FF_t}{(1 + \text{TIR})^t} = 0'
    description: 'Tasa de descuento intrínseca del proyecto que iguala el valor presente de los ingresos futuros con la inversión inicial.'
    tags: ["tir", "irr", "tasa-retorno"]
  - id: 'relacion-beneficio-costo'
    name: 'Relación Beneficio-Costo (B/C)'
    latex: 'B/C = \frac{\sum_{t=1}^n \frac{FF_t}{(1 + r)^t}}{I_0}'
    description: 'Cociente entre el valor presente de los ingresos netos futuros y la inversión inicial. El proyecto es viable si B/C > 1.'
    tags: ["beneficio-costo", "rentabilidad"]
---

# Evaluación Financiera de Proyectos de Inversión (UTN FRRO)

Todo ingeniero debe justificar económicamente la viabilidad de sus propuestas técnicas (modernización de servidores, automatización de líneas de planta, desarrollo de nuevo software). La viabilidad técnica es condición necesaria, pero **la viabilidad económica es la condición suficiente** para la aprobación de un proyecto.

---

## 1. El Valor Tiempo del Dinero

Un peso hoy vale más que un peso dentro de un año debido a tres factores fundamentales:
1. **Costo de oportunidad**: El dinero disponible hoy puede invertirse para generar rendimientos (tasa de interés).
2. **Inflación**: La pérdida sistemática de poder adquisitivo a lo largo del tiempo.
3. **Incertidumbre y riesgo**: El futuro es probabilístico; existe riesgo de no cobro o contingencias operativas.

* **Capitalización compuesta (Valor Futuro)**:
  $$VF = VP \cdot (1 + r)^t$$
* **Actualización o Descuento (Valor Presente)**:
  $$VP = \frac{VF}{(1 + r)^t}$$

---

## 2. Construcción del Flujo de Fondos (Cash Flow)

El flujo de fondos debe construirse bajo el **criterio de caja o percibido** (entradas y salidas reales de dinero), **no** bajo el criterio contable de lo devengado.

| Renglón del Flujo de Fondos Proyectado | Signo |
| :--- | :---: |
| **Ingresos por Ventas** ($P \times Q$) | $+$ |
| $(-)$ Costos Operativos Variables | $-$ |
| $(-)$ Costos Fijos Erogables (Mantenimiento, Salarios) | $-$ |
| $(-)$ Amortizaciones y Depreciaciones (Gasto no erogable) | $-$ |
| **(=) Resultado Operativo antes de Impuestos (EBIT)** | |
| $(-)$ Impuesto a las Ganancias (35% en Argentina) | $-$ |
| **(=) Resultado Neto después de Impuestos** | |
| $(+)$ Recupero de Amortizaciones (No implicaron salida física de dinero) | $+$ |
| $(-)$ Inversión en Capital de Trabajo Operativo | $-$ |
| $(-)$ Inversión en Bienes de Uso / Capex | $-$ |
| **(=) FLUJO DE FONDOS NETO ($FF_t$)** | **=** |

---

## 3. Criterios Clásicos de Decisión de Inversión

### A. Valor Actual Neto (VAN)
Mide en moneda constante la cantidad neta de riqueza incremental que el proyecto añadirá a los inversores, descontando los flujos a la tasa de costo de oportunidad del capital ($r$):

$$\text{VAN} = -I_0 + \sum_{t=1}^n \frac{FF_t}{(1 + r)^t}$$

* **Criterio de decisión**:
  * $\text{VAN} > 0$: **Se acepta el proyecto** (crea valor y rinde más que la tasa alternativa $r$).
  * $\text{VAN} = 0$: Indiferente (rinde exactamente lo exigido).
  * $\text{VAN} < 0$: **Se rechaza** (destruye valor económico).

### B. Tasa Interna de Retorno (TIR)
Es la tasa de rendimiento intrínseca del proyecto que anula el VAN:
$$\text{VAN}(\text{TIR}) = 0$$

* **Criterio de decisión** frente a la tasa de corte $r$:
  * $\text{TIR} > r$: **Se acepta el proyecto**.
  * $\text{TIR} < r$: **Se rechaza el proyecto**.

> **Ventajas del VAN sobre la TIR en UTN FRRO:**
> 1. El VAN asume reinversión de los flujos intermedios a la tasa de costo de capital $r$ (supuesto realista), mientras que la TIR asume reinversión a la propia TIR (a menudo irrealmente optimista).
> 2. Si el flujo de fondos tiene más de un cambio de signo (flujos no convencionales con desmantelamientos futuros o reparaciones mayores), el polinomio puede admitir **múltiples TIRs reales** o ninguna (Regla de los signos de Descartes), mientras que el VAN siempre es único y monotónico.

### C. Período de Recupero de la Inversión (Payback)
Tiempo exacto necesario para que los flujos de fondos netos acumulados igualen la inversión inicial $I_0$:
* **Payback Simple**: Suma directa sin descontar flujos (muy criticado porque ignora el valor tiempo del dinero y los flujos posteriores al recupero).
* **Payback Descontado**: Suma acumulada de flujos actualizados $\frac{FF_t}{(1+r)^t}$ hasta cubrir $I_0$.

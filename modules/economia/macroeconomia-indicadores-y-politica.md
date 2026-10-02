---
title: "Macroeconomía: Cuentas Nacionales, PBI, Inflación, Desempleo y Políticas Fiscal y Monetaria"
unit: "Unidad 2: Macroeconomía, PBI, Inflación y Políticas Económicas"
order: 2
tags:
  - "economia"
  - "utn-frro"
  - "macroeconomia"
  - "pbi"
  - "inflacion"
  - "desempleo"
  - "politica-fiscal"
  - "politica-monetaria"
description: "Agregados macroeconómicos y dinámica económica global: Producto Bruto Interno (PBI por método del gasto, ingreso y valor agregado), medición de la inflación (IPC vs Deflactor), mercado de trabajo e instrumentos de política económica."
variables:
  - symbol: 'Y = \text{PBI}'
    name: 'Producto Bruto Interno'
    description: 'Valor monetario a precios de mercado de todos los bienes y servicios finales producidos en un país durante un período determinado'
formulas:
  - id: 'pbi-metodo-del-gasto'
    name: 'Ecuación Fundamental Macroeconómica (PBI por el Gasto)'
    latex: 'Y = C + I + G + (X - M)'
    description: 'Suma de Consumo privado (C), Inversión bruta interna (I), Gasto público (G) y Exportaciones netas (X - M).'
    tags: ["pbi", "macroeconomia", "demanda-agregada"]
  - id: 'tasa-de-inflacion-ipc'
    name: 'Tasa de Inflación Mensual / Interanual'
    latex: '\pi_t = \frac{\text{IPC}_t - \text{IPC}_{t-1}}{\text{IPC}_{t-1}} \times 100\%'
    description: 'Variación porcentual del Índice de Precios al Consumidor respecto del período anterior.'
    tags: ["inflacion", "ipc", "indicadores"]
  - id: 'ecuacion-cuantitativa-dinero'
    name: 'Teoría Cuantitativa del Dinero (Fisher)'
    latex: 'M \cdot V = P \cdot Y'
    description: 'La masa monetaria M multiplicada por su velocidad de circulación V iguala al nivel general de precios P por el PBI real Y.'
    tags: ["monetaria", "fisher", "dinero"]
---

# Macroeconomía y Políticas Económicas (UTN FRRO)

La **macroeconomía** analiza el comportamiento global de la economía a través de variables agregadas como el crecimiento económico, la inflación, el desempleo y el equilibrio externo.

---

## 1. Medición de la Actividad Económica: El Producto Bruto Interno (PBI)

El **PBI** representa el valor monetario de todos los bienes y servicios finales producidos en las fronteras geográficas de un país durante un año o trimestre.

### Métodos de Cálculo del PBI
1. **Método del Gasto (Demanda Agregada)**:
   $$Y = C + I + G + (X - M)$$
   * $C$: Consumo final de los hogares.
   * $I$: Inversión bruta interna (maquinarias, software, construcción).
   * $G$: Gasto corriente del sector público en bienes y servicios.
   * $X - M$: Balanza comercial neta (Exportaciones menos Importaciones).
2. **Método del Valor Agregado (Oferta / Producción)**:
   $$PBI = \sum (\text{Valor Bruto de Producción} - \text{Consumo Intermedio})$$
   Evita la doble contabilización sumando solo el valor añadido en cada eslabón de la cadena de valor.
3. **Método del Ingreso**:
   $$PBI = \text{Salarios} + \text{Beneficios y Excedente Bruto} + \text{Rentas} + \text{Impuestos indirectos netos}$$

### PBI Nominal vs. PBI Real
* **PBI Nominal**: Valuado a **precios corrientes** de cada año. Su crecimiento puede deberse tanto a aumento de cantidades como a simple aumento de precios (inflación).
* **PBI Real**: Valuado a **precios constantes** de un año base de referencia. Mide el crecimiento genuino del volumen físico de producción:
  $$\text{Deflactor del PBI} = \frac{\text{PBI Nominal}}{\text{PBI Real}} \times 100$$

---

## 2. Inflación y Métricas de Precios

La **inflación** es el aumento sostenido y generalizado del nivel general de precios en la economía, provocando la pérdida de poder adquisitivo de la moneda nacional.

### Principales Enfoques Teóricos sobre las Causas de la Inflación
1. **Monetarista**:
   Parte de la identidad cuantitativa $M \cdot V = P \cdot Y$. Asumiendo velocidad $V$ y producto real $Y$ estables en el corto plazo, todo incremento en la emisión monetaria $M$ sin respaldo de demanda de dinero se traslada directamente a precios $P$.
2. **Estructuralista (frecuente en la historia económica argentina)**:
   Atribuye la inflación a cuellos de botella en la oferta, puja distributiva salarios-ganancias, oligopolios formadores de precios y restricción externa de divisas (devaluaciones del tipo de cambio oficial).
3. **Inflación de Demanda**:
   Ocurre cuando la Demanda Agregada supera la capacidad instalada productiva máxima de pleno empleo.
4. **Inflación de Costos**:
   Impulsada por subas bruscas en insumos críticos (combustibles, energía, tarifas, materias primas importadas).

---

## 3. Mercado de Trabajo y Empleo

Definiciones operativas del INDEC (Instituto Nacional de Estadística y Censos):

* **Población Económicamente Activa (PEA)**: Personas en edad de trabajar que tienen una ocupación o están buscándola activamente.
* **Tasa de Actividad**: $\frac{\text{PEA}}{\text{Población Total}} \times 100\%$
* **Tasa de Empleo**: $\frac{\text{Ocupados}}{\text{Población Total}} \times 100\%$
* **Tasa de Desempleo**:
  $$\text{Desempleo} = \frac{\text{Desocupados (que buscan activamente)}}{\text{PEA}} \times 100\%$$

---

## 4. Políticas Económicas del Estado

### A. Política Fiscal (Ministerio de Economía)
Gestiona el presupuesto nacional a través del **Gasto Público ($G$)** y los **Impuestos ($T$)**:
* **Expansiva**: Aumenta $G$ o reduce $T$ para reactivar el nivel de actividad en épocas de recesión (efecto multiplicador keynesiano). Riesgo: déficit fiscal y endeudamiento.
* **Contractiva**: Disminuye $G$ o sube $T$ para enfriar la economía y corregir desbalances fiscales.

### B. Política Monetaria (Banco Central - BCRA)
Controla la liquidez y el costo del crédito mediante:
1. **Tasa de Interés de Referencia** (tasas de pases/letras).
2. **Encajes Bancarios** (porcentaje de reservas obligatorias sobre depósitos).
3. **Operaciones de Mercado Abierto** (compra y venta de títulos públicos).

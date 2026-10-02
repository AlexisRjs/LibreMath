---
title: "Lectocomprensión: Técnicas de Lectura, Conectores Lógicos y Manuales Técnicos"
unit: "Unidad 2: Lectocomprensión, Manuales y Especificaciones Técnicas"
order: 2
tags:
  - "ingles-1"
  - "utn-frro"
  - "lectocomprension"
  - "skimming"
  - "scanning"
  - "conectores-logicos"
  - "datasheets"
  - "especificaciones"
description: "Estrategias de lectura veloz y focalizada (skimming, scanning), tabla exhaustiva de conectores discursivos lógicos y decodificación de manuales de hardware y especificaciones de software."
variables: []
formulas: []
---

# Lectocomprensión de Textos Técnicos y Hojas de Datos

En las evaluaciones de **Inglés I** en **UTN FRRO**, los estudiantes se enfrentan a textos técnicos auténticos donde deben extraer información crítica sin detenerse a traducir palabra por palabra.

---

## 1. Técnicas de Lectura Focalizada

### A. Skimming (Lectura Panorámica Rápida)
* **Objetivo**: Captar la idea global (*gist*) del documento en menos de un minuto.
* **Pasos recomendados**:
  1. Leer el **título principal** y los subtítulos (*headings / subheadings*).
  2. Leer la primera y última oración de cada párrafo (oraciones temáticas).
  3. Observar diagramas de bloques, tablas y epígrafes de figuras.
  4. Identificar palabras en negrita o código formateado.

### B. Scanning (Lectura de Barrido / Búsqueda Específica)
* **Objetivo**: Localizar un dato puntual (número de versión, pinout de un chip, valor de frecuencia de reloj, tiempo de respuesta en milisegundos).
* **Pasos recomendados**:
  1. Definir la palabra clave o unidad de medida que se busca (ej. `MHz`, `latency`, `error 404`).
  2. Deslizar la mirada rápidamente por el texto buscando el patrón visual sin leer el contenido adyacente.

---

## 2. Guía de Conectores Lógicos y Transiciones Discursivas

Los conectores señalan cómo se relacionan las ideas en el razonamiento técnico:

| Tipo de Relación | Conectores Clave | Significado en Español | Ejemplo Técnico |
| :--- | :--- | :--- | :--- |
| **Causa y Efecto** | *Therefore, Consequently, As a result, Due to, Hence* | Por lo tanto, en consecuencia, debido a | *"The cache hit ratio was high; therefore, latency decreased."* |
| **Contraste / Oposición** | *However, Whereas, In contrast, Nonetheless, While* | Sin embargo, mientras que, en cambio | *"SRAM is faster than DRAM; however, it is much more expensive."* |
| **Condición** | *Unless, Provided that, As long as, In case of* | A menos que, siempre que, en caso de | *"Data will be sent provided that the acknowledgment is received."* |
| **Adición** | *Furthermore, Moreover, In addition, Besides* | Además, por otra parte, asimismo | *"The microcontroller supports I2C; furthermore, it features SPI."* |
| **Propósito / Finalidad** | *In order to, So as to, With the aim of* | Para, con el fin de, a fin de | *"Filters are installed in order to minimize electromagnetic noise."* |
| **Ejemplificación** | *For instance, Such as, Namely, e.g.* | Por ejemplo, tales como, a saber | *"High-level languages, such as Python and Rust, abstract memory management."* |

---

## 3. Anatomía de un Datasheet y Manual de Ingeniería

En un manual técnico de hardware o software estándar encontraremos las siguientes secciones canónicas:

1. **Features / Highlights (Prestaciones destacadas)**:
   * Lista en viñetas de las capacidades primarias del producto.
   * *Ejemplo*: *"Low-power consumption: 15 mW at 3.3V operating voltage."*
2. **Absolute Maximum Ratings (Límites máximos de operación)**:
   * Especificaciones extremas que bajo ningún concepto deben sobrepasarse sin riesgo de daño físico al componente.
   * *Vocabulario frecuente*: *Supply Voltage ($V_{CC}$)*, *Operating Junction Temperature ($T_J$)*, *Storage Temperature*.
3. **Pin Configuration & Function Descriptions (Configuración de pines)**:
   * Descripción de entradas de reloj (*CLK*), alimentación (*GND, VDD*), habilitadores (*EN - Enable*), reinicio (*RST - Reset*).
4. **Troubleshooting & Error Codes (Resolución de fallas)**:
   * Tabla causa-solución orientada a síntomas comunes de operación.

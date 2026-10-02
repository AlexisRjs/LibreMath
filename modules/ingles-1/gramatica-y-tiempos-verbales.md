---
title: "Morfosintaxis Técnica: Tiempos Verbales, Afijos y Voz Pasiva Elemental"
unit: "Unidad 1: Morfosintaxis Técnica y Tiempos Verbales"
order: 1
tags:
  - "ingles-1"
  - "utn-frro"
  - "tiempos-verbales"
  - "afijos"
  - "prefijos-sufijos"
  - "voz-pasiva"
  - "verbos-modales"
description: "Estructuras gramaticales esenciales para la lectura e interpretación de textos técnicos en ingeniería y sistemas: tiempos verbales, derivación léxica mediante prefijos/sufijos y patrones de voz pasiva."
variables: []
formulas: []
---

# Morfosintaxis Técnica para Ingeniería (UTN FRRO)

El enfoque pedagógico de la cátedra de **Inglés I** en la **UTN FRRO** está orientado a la **lectocomprensión técnica** (*reading comprehension*). El objetivo principal no es la producción oral coloquial, sino la decodificación ágil, precisa y contextualizada de textos científicos, hojas de datos (*datasheets*), manuales de usuario y estándares internacionales (IEEE, ISO, RFC).

---

## 1. Tiempos Verbales Clave en Literatura Técnica

En los textos de ingeniería predominan construcciones impersonales y tiempos verbales con funciones descriptivas y procedimentales concretas:

### A. Present Simple (Presente Simple)
Se utiliza para describir **leyes físicas, propiedades universales, especificaciones fijas de hardware** y funcionamiento estándar de algoritmos.
* *Estructura*: $\text{Sujeto} + \text{Verbo en infinitivo} \text{ (o } -s/-es \text{ para 3ª pers.)}$
* *Ejemplo*: `"A router directs data packets along networks using IP routing tables."`
* *Traducción técnica*: «Un enrutador direcciona paquetes de datos a lo largo de redes utilizando tablas de enrutamiento IP».

### B. Present Continuous (Presente Continuo)
Describe procesos en ejecución dinámica o estados transitorios en sistemas concurrentes.
* *Estructura*: $\text{Sujeto} + \text{am/is/are} + \text{Verbo-ing}$
* *Ejemplo*: `"The operating system is currently allocating memory blocks to the thread."`

### C. Past Simple (Pasado Simple)
Documenta experimentos realizados, metodologías previas y cronología de pruebas de laboratorio.
* *Estructura*: $\text{Sujeto} + \text{Verbo en pasado (-ed o irregular)}$
* *Ejemplo*: `"The engineers benchmarked the processor under maximum thermal load."`

### D. Present Perfect (Pretérito Perfecto)
Describe investigaciones previas, antecedentes de diseño o estados alcanzados con relevancia actual.
* *Estructura*: $\text{Sujeto} + \text{have/has} + \text{Participio pasado (-ed o 3ª columna)}$
* *Ejemplo*: `"Recent developments have significantly reduced energy dissipation in CMOS gates."`

---

## 2. Derivación Léxica: Prefijos y Sufijos Técnicos

Reconocer la morfología de las palabras permite inferir el significado de terminología especializada sin recurrir constantemente al diccionario:

### Prefijos de Frecuencia y Magnitud en Computación e Ingeniería
| Prefijo | Significado | Ejemplo Técnico | Equivalencia en Español |
| :--- | :--- | :--- | :--- |
| **multi-** | Múltiples / muchos | *multithreading*, *multiplexing* | Multihilo, multiplexación |
| **inter-** | Entre / interconectado | *interface*, *interoperability* | Interfaz, interoperabilidad |
| **intra-** | Dentro de | *intranet*, *intracluster* | Red interna, intragrupo |
| **over-** | Exceso / por encima | *overflow*, *overheating*, *override* | Desbordamiento, sobrecalentamiento |
| **under-** | Defecto / insuficiente | *underflow*, *underclocking* | Subdesbordamiento, bajada de reloj |
| **mis-** | Erróneo / incorrecto | *misconfiguration*, *mismatch* | Desconfiguración, desajuste |
| **sub-** | Debajo / subordinado | *subnet*, *subprocess*, *subroutine* | Subred, subproceso, subrutina |
| **semi-** | Parcial / medio | *semiconductor* | Semiconductor |

### Sufijos de Categorización Gramatical
* **Sufijos que forman sustantivos abstractos de proceso**:
  * `-tion / -sion`: *attenuation* (atenuación), *transmission* (transmisión), *compression* (compresión).
  * `-ment`: *measurement* (medición), *deployment* (despliegue), *enhancement* (mejora).
  * `-ance / -ence`: *impedance* (impedancia), *capacitance* (capacitancia), *persistence* (persistencia).
* **Sufijos que forman sustantivos de agente/herramienta**:
  * `-er / -or`: *compiler* (compilador), *rectifier* (rectificador), *actuator* (actuador).
* **Sufijos que forman adjetivos de capacidad o cualidad**:
  * `-able / -ible`: *scalable* (escalable), *compressible* (comprimible), *executable* (ejecutable).
  * `-ive`: *conductive* (conductivo), *recursive* (recursivo), *adaptive* (adaptativo).

---

## 3. Verbos Modales (Modal Auxiliaries)

Expresan condiciones de operatividad, restricciones técnicas y niveles de obligatoriedad según normas de ingeniería:

| Modal | Grado / Sentido | Ejemplo Técnico | Interpretación |
| :--- | :--- | :--- | :--- |
| **Must** | Obligación estricta / Requisito mandatorio | *"The input voltage must not exceed 5V."* | El voltaje no debe exceder los 5V (daño irreversible). |
| **Should** | Recomendación de buena práctica (*Best Practice*) | *"Developers should sanitize all user SQL inputs."* | Conviene sanear las entradas (vulnerabilidad de inyección). |
| **Can / Could** | Capacidad técnica / Habilidad del sistema | *"This optical bus can sustain up to 10 Gbps throughput."* | El bus es capaz de sostener hasta 10 Gbps. |
| **May / Might** | Probabilidad / Permiso | *"Corrupted parity bits may trigger an interrupt."* | Bits de paridad corruptos podrían disparar una interrupción. |

---

## 4. Voz Pasiva Elemental (Passive Voice)

En los textos técnicos, el sujeto agente a menudo carece de relevancia; el foco está en el **objeto afectado** o en el **fenómeno observado**:

$$\text{Active:} \quad \text{The technician checks the oscilloscope calibration.}$$
$$\text{Passive:} \quad \text{The oscilloscope calibration is checked (by the technician).}$$

* **Regla de oro**: `Sujeto Paciente + [Verbo To Be conjugado] + [Participio Pasado (-ed / 3ª columna)]`
* **Ejemplos frecuentes en UTN FRRO**:
  * *"Data is stored in non-volatile flash registers."* (Los datos son almacenados en registros flash no volátiles).
  * *"The algorithms were benchmarked on a distributed cluster."* (Los algoritmos fueron evaluados en un clúster distribuido).

---
title: "Estadística Inferencial: Intervalos de Confianza, Test de Hipótesis y Regresión Lineal"
unit: "Unidad 4: Estadística Descriptiva, Inferencia, Intervalos y Regresión"
order: 4
tags:
  - "pye"
  - "utn-frro"
  - "inferencia-estadistica"
  - "intervalos-de-confianza"
  - "test-de-hipotesis"
  - "t-student"
  - "regresion-lineal"
  - "minimos-cuadrados"
description: "Herramientas de inferencia cuantitativa: estimación puntual, intervalos de confianza para la media poblacional (\sigma conocida y desconocida con t de Student), pruebas de hipótesis con errores Tipo I y II, y modelo de regresión lineal simple."
variables:
  - symbol: '1 - \alpha'
    name: 'Nivel de confianza'
    description: 'Probabilidad a priori de que el intervalo contenga al verdadero parámetro poblacional (típicamente 95% o 99%)'
  - symbol: 'S = \sqrt{\frac{1}{n-1}\sum (X_i - \bar{X})^2}'
    name: 'Cuasivarianza / Desvío estándar muestral'
    description: 'Estimador insesgado de la varianza poblacional \sigma^2 con corrección de Bessel (n - 1 grados de libertad)'
formulas:
  - id: 'intervalo-confianza-media-sigma-conocida'
    name: 'Intervalo de Confianza para la Media (\sigma conocida)'
    latex: 'IC_{1-\alpha}(\mu) = \left[ \bar{X} - z_{1-\alpha/2} \frac{\sigma}{\sqrt{n}}, \quad \bar{X} + z_{1-\alpha/2} \frac{\sigma}{\sqrt{n}} \right]'
    description: 'Intervalo simétrico para la media con varianza poblacional conocida basado en la normal estándar.'
    tags: ["intervalos", "media", "normal", "sigma-conocida"]
  - id: 'intervalo-confianza-media-sigma-desconocida'
    name: 'Intervalo de Confianza para la Media (\sigma desconocida - Student)'
    latex: 'IC_{1-\alpha}(\mu) = \left[ \bar{X} - t_{n-1, \, 1-\alpha/2} \frac{S}{\sqrt{n}}, \quad \bar{X} + t_{n-1, \, 1-\alpha/2} \frac{S}{\sqrt{n}} \right]'
    description: 'Intervalo de confianza con varianza desconocida reemplazada por el desvío muestral S mediante la distribución t de Student.'
    tags: ["intervalos", "student", "sigma-desconocida"]
  - id: 'regresion-lineal-coeficientes'
    name: 'Coeficientes de Regresión Lineal por Mínimos Cuadrados'
    latex: '\hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} = \frac{S_{xy}}{S_{xx}}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}'
    description: 'Pendiente y ordenada al origen que minimizan la suma de residuos cuadráticos en el modelo y = \beta_0 + \beta_1 x.'
    tags: ["regresion", "minimos-cuadrados", "ajuste"]
  - id: 'coeficiente-correlacion-pearson'
    name: 'Coeficiente de Correlación Lineal de Pearson'
    latex: 'r = \frac{S_{xy}}{\sqrt{S_{xx} S_{yy}}} \in [-1, 1]'
    description: 'Grado de asociación lineal entre dos variables aleatorias continuas.'
    tags: ["correlacion", "pearson", "asociacion"]
---

# Estadística Inferencial y Regresión (UTN FRRO)

La **estadística inferencial** permite deducir propiedades y tomar decisiones sobre una población completa a partir de la observación de una muestra representativa finita.

---

## 1. Estimación Puntual y Propiedades de los Estimadores

Sea $\theta$ un parámetro poblacional desconocido (ej. la media $\mu$ o varianza $\sigma^2$) y $\hat{\theta} = g(X_1, \dots, X_n)$ un estimador muestral:

1. **Insesgadez**: El valor esperado del estimador coincide con el parámetro: $E[\hat{\theta}] = \theta$.
   * La media muestral $\bar{X} = \frac{1}{n} \sum X_i$ es insesgada: $E[\bar{X}] = \mu$.
   * La varianza muestral simple $\frac{1}{n}\sum (X_i - \bar{X})^2$ es sesgada. Por eso se define la **cuasivarianza** con $n - 1$:
     $$S^2 = \frac{1}{n - 1} \sum_{i=1}^n (X_i - \bar{X})^2 \implies E[S^2] = \sigma^2$$
2. **Consistencia**: Al aumentar el tamaño muestral, el estimador converge en probabilidad al parámetro: $\lim_{n \to \infty} P(|\hat{\theta}_n - \theta| < \varepsilon) = 1$.
3. **Eficiencia**: Entre estimadores insesgados, se prefiere aquel que tenga la menor varianza posible (cota inferior de Cramér-Rao).

---

## 2. Intervalos de Confianza

Un intervalo $[L_1, L_2]$ es un intervalo de confianza al nivel $1 - \alpha$ si $P(L_1 \le \mu \le L_2) = 1 - \alpha$. El margen de error $E$ depende de la precisión y del desvío estándar del estimador.

### Resumen de Casos para la Media $\mu$
* **Caso 1: $\sigma$ conocida** (o $n \ge 30$ por TCL):
  $$IC = \bar{X} \pm z_{1 - \alpha/2} \cdot \frac{\sigma}{\sqrt{n}}$$
  * Para $95\%$ de confianza: $z_{0.975} = 1.96$.
  * Para $99\%$ de confianza: $z_{0.995} = 2.576$.
* **Caso 2: $\sigma$ desconocida y muestra pequeña ($n < 30$)** con población normal:
  Se utiliza la distribución **$t$ de Student** con $\nu = n - 1$ grados de libertad:
  $$IC = \bar{X} \pm t_{n-1, \, 1 - \alpha/2} \cdot \frac{S}{\sqrt{n}}$$

### Intervalo de Confianza para una Proporción $p$ (Muestras Grandes)
$$\hat{p} = \frac{X}{n} \implies IC_{1-\alpha}(p) = \hat{p} \pm z_{1 - \alpha/2} \sqrt{\frac{\hat{p}(1 - \hat{p})}{n}}$$

---

## 3. Pruebas de Hipótesis Estadísticas

Un **test de hipótesis** es una regla de decisión formal entre dos proposiciones antagónicas:
* **Hipótesis Nula ($H_0$)**: Afirmación conservadora de no cambio, igualdad o status quo (ej. $H_0: \mu = \mu_0$).
* **Hipótesis Alternativa ($H_1$)**: Afirmación del investigador que requiere evidencia empírica suficiente para ser aceptada (ej. $H_1: \mu \ne \mu_0$, $H_1: \mu > \mu_0$ o $H_1: \mu < \mu_0$).

### Tipos de Error y Potencia
| Decisión / Realidad | $H_0$ es Verdadera | $H_0$ es Falsa |
| :--- | :--- | :--- |
| **No Rechazar $H_0$** | Decisión correcta ($1 - \alpha$) | **Error Tipo II ($\beta$)** |
| **Rechazar $H_0$** | **Error Tipo I ($\alpha$)** (Nivel de significación) | Decisión correcta ($1 - \beta$, Potencia del test) |

* **p-valor**: Es la probabilidad de haber obtenido un estadístico de prueba tan o más extremo que el observado, asumiendo que $H_0$ es verdadera.
  * Si $\text{p-valor} < \alpha \implies$ Se **rechaza** $H_0$ (el resultado es estadísticamente significativo).
  * Si $\text{p-valor} \ge \alpha \implies$ No hay evidencia suficiente para rechazar $H_0$.

---

## 4. Regresión Lineal Simple y Correlación

Estudia la relación funcional entre una variable independiente o predictora $X$ y una variable dependiente o respuesta $Y$:

$$Y = \beta_0 + \beta_1 X + \varepsilon, \qquad \varepsilon \sim N(0, \sigma^2)$$

### Estimación por Mínimos Cuadrados Ordinarios (MCO)
Minimizando la suma de los residuos al cuadrado $\sum e_i^2 = \sum (y_i - (\beta_0 + \beta_1 x_i))^2$:
$$\hat{\beta}_1 = \frac{n \sum x_i y_i - \sum x_i \sum y_i}{n \sum x_i^2 - (\sum x_i)^2}$$
$$\hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}$$

### Coeficiente de Determinación ($R^2$)
$$R^2 = r^2 = \frac{\text{Suma de Cuadrados de la Regresión (SCR)}}{\text{Suma de Cuadrados Total (SCT)}} \in [0, 1]$$
Indica la proporción de la variabilidad total de $Y$ que es explicada por el modelo lineal ajustado respecto de $X$.

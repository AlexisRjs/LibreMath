---
title: "Fundamentos de Precálculo, Trigonometría, Cónicas y Álgebra"
unit: "Tema 0: Fundamentos, Trigonometría y Cónicas (Formulario UPL)"
order: 0
tags:
  - "am1"
  - "upl"
  - "logaritmos"
  - "valor-absoluto"
  - "trigonometria"
  - "hiperbolicas"
  - "conicas"
  - "division"
  - "laplace"
description: "Herramientas matemáticas del Formulario Oficial UPL para Análisis Matemático 1: propiedades de logaritmos, valor absoluto, trigonometría, funciones hiperbólicas, cónicas canónicas y trasladadas, división polinómica y Teorema de Laplace."
variables:
  - symbol: 'a, \, b, \, x, \, y'
    name: 'Bases y variables reales'
    description: 'Parámetros reales positivos en logaritmos (a, b > 0, a, b \neq 1) y variables en el plano cartesiano'
  - symbol: '(h, \, k)'
    name: 'Coordenadas del centro trasladado'
    description: 'Vector de traslación del origen para el centro de una cónica no canónica'
  - symbol: 'r'
    name: 'Radio de la circunferencia'
    description: 'Distancia constante desde el centro a cualquier punto de la circunferencia'
  - symbol: 'a, \, b'
    name: 'Semiejes de elipse / hipérbola'
    description: 'Longitud del semieje transversal / mayor (a) y semieje conjugado / menor (b)'
  - symbol: 'D(x), \, d(x), \, c(x), \, R(x)'
    name: 'Polinomios de la división'
    description: 'Dividendo, divisor, cociente y resto con grado(R) < grado(d)'
  - symbol: 'M_{i,j}'
    name: 'Menor complementario en Laplace'
    description: 'Determinante de la submatriz obtenida al suprimir la i-ésima fila y j-ésima columna'
formulas:
  - id: 'propiedades-logaritmos-producto-cociente'
    name: 'Propiedades de Logaritmos (Producto y Cociente)'
    latex: '\log_a(x \cdot y) = \log_a|x| + \log_a|y|, \qquad \log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y'
    description: 'Descomposición analítica de multiplicaciones y divisiones en sumas y restas logarítmicas.'
    tags: ["logaritmos", "producto", "cociente", "upl"]
  - id: 'propiedades-logaritmos-potencia-cambio-base'
    name: 'Potencias, Raíces e Inversión de Base de Logaritmos'
    latex: '\log_b(a^n) = n \cdot \log_b a, \quad \log_{b^n}(a^n) = \log_b a, \quad \log_b a = \frac{1}{\log_a b} = \frac{\log_c a}{\log_c b}'
    description: 'Propiedad de la potencia del argumento y cambio de base a cualquier base auxiliar c.'
    tags: ["logaritmos", "potencia", "cambio-base", "upl"]
  - id: 'definicion-e-identidad-logaritmica'
    name: 'Definición e Identidad Fundamental del Logaritmo'
    latex: '\log_b n = x \iff b^x = n, \qquad a^{\log_a x} = x, \qquad \log_a 1 = 0, \quad \log_a a = 1'
    description: 'Equivalencia entre logaritmo y exponencial, junto con valores notables.'
    tags: ["logaritmos", "definicion", "identidad", "upl"]
  - id: 'propiedades-valor-absoluto'
    name: 'Propiedades del Valor Absoluto y Desigualdad Triangular'
    latex: '|a| = |-a|, \qquad |ab| = |a||b|, \qquad \left|\frac{a}{b}\right| = \frac{|a|}{|b|}, \qquad |x + y| \le |x| + |y|'
    description: 'Propiedades algebraicas del módulo de números reales y cota triangular en desigualdades.'
    tags: ["valor-absoluto", "modulo", "desigualdad-triangular", "upl"]
  - id: 'identidades-trigonometricas-fundamentales'
    name: 'Identidades Pitagóricas y Ángulo Doble'
    latex: '\sin^2 x + \cos^2 x = 1, \qquad \tan^2 x + 1 = \sec^2 x, \qquad \sin(2x) = 2\sin x \cos x'
    description: 'Relaciones fundamentales para simplificar expresiones e integrales trigonométricas.'
    tags: ["trigonometria", "pitagorica", "angulo-doble", "upl"]
  - id: 'trigonometria-suma-diferencia-angulos'
    name: 'Suma de Ángulos Trigonométricos'
    latex: '\sin(\alpha + \beta) = \sin\alpha \cos\beta + \cos\alpha \sin\beta, \qquad \cos(\alpha + \beta) = \cos\alpha \cos\beta - \sin\alpha \sin\beta'
    description: 'Fórmulas de adición para seno y coseno empleadas en transformaciones analíticas.'
    tags: ["trigonometria", "suma-angulos", "upl"]
  - id: 'angulos-mitad-potencias'
    name: 'Fórmulas de Reducción de Potencia (Ángulo Mitad)'
    latex: '\sin^2 x = \frac{1 - \cos(2x)}{2}, \qquad \cos^2 x = \frac{1 + \cos(2x)}{2}'
    description: 'Esenciales para integrar potencias pares de funciones trigonométricas directas.'
    tags: ["trigonometria", "potencia", "angulo-mitad", "upl"]
  - id: 'definicion-relaciones-hiperbolicas'
    name: 'Funciones Hiperbólicas y su Identidad Fundamental'
    latex: '\sinh x = \frac{e^x - e^{-x}}{2}, \qquad \cosh x = \frac{e^x + e^{-x}}{2}, \qquad \cosh^2 x - \sinh^2 x = 1'
    description: 'Definiciones del seno y coseno hiperbólico en base a exponenciales reales.'
    tags: ["hiperbolicas", "sinh", "cosh", "upl"]
  - id: 'conicas-ecuaciones-canonicas'
    name: 'Ecuaciones Canónicas de las Cónicas (Centro en el Origen)'
    latex: 'x^2 + y^2 = r^2 \quad (\text{Circ}), \qquad \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (\text{Elipse}), \qquad \frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \quad (\text{Hipérbola})'
    description: 'Estructura canónica de la circunferencia, elipse e hipérbola con centro en (0, 0).'
    tags: ["conicas", "circunferencia", "elipse", "hiperbola", "upl"]
  - id: 'conicas-centro-trasladado'
    name: 'Ecuaciones de Cónicas con Centro Trasladado (h, k)'
    latex: '(x - h)^2 + (y - k)^2 = r^2, \qquad \frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1, \qquad \frac{(y-k)^2}{a^2} - \frac{(x-h)^2}{b^2} = 1'
    description: 'Regla de sustitución de traslación: reemplazar x por (x - h) e y por (y - k).'
    tags: ["conicas", "traslacion", "centro", "upl"]
  - id: 'propiedad-fundamental-division-polinomios'
    name: 'Propiedad Fundamental de la División Polinómica'
    latex: 'D(x) = d(x) \cdot c(x) + R(x) \iff \frac{D(x)}{d(x)} = c(x) + \frac{R(x)}{d(x)}'
    description: 'Descomposición euclídea de polinomios para resolución de límites e integración por fracciones simples.'
    tags: ["division", "polinomios", "euclides", "upl"]
  - id: 'algebra-lineal-teorema-laplace'
    name: 'Álgebra Lineal: Teorema de Laplace (Determinantes)'
    latex: '\det(B) = \sum_{j=1}^n (-1)^{i+j} \cdot B_{i,j} \cdot M_{i,j}'
    description: 'Cálculo del determinante por cofactores mediante menores complementarios.'
    tags: ["laplace", "algebra-lineal", "determinantes", "upl"]
---

# Fundamentos de Precálculo, Trigonometría y Cónicas

Este compendio reúne el herramental analítico fundamental del **Formulario Oficial UPL (*Universitarios por la Libertad*)** para cursar **Análisis Matemático I** en Ingeniería (UTN FRRO).

---

## 1. Logaritmos y sus Propiedades

Por definición, el logaritmo en base $b$ de un número real positivo $n$ es el exponente al que debe elevarse la base para obtener dicho número:

$$\log_b n = x \iff b^x = n \quad (b > 0, \; b \neq 1, \; n > 0)$$

### Propiedades Operativas Clave

| Propiedad | Expresión Matemática | Descripción / Utilidad |
|---|---|---|
| **Identidad fundamental** | $a^{\log_a x} = x$ | Simplificación directa de potencias y logaritmos |
| **Logaritmo de 1 y de la base** | $\log_a 1 = 0, \quad \log_a a = 1$ | Valores frontera canónicos |
| **Logaritmo de un producto** | $\log_a(x \cdot y) = \log_a|x| + \log_a|y|$ | Convierte multiplicaciones en sumas analíticas |
| **Logaritmo de un cociente** | $\log_a(x / y) = \log_a x - \log_a y$ | Convierte divisiones en diferencias |
| **Potencia del argumento** | $\log_b(a^n) = n \cdot \log_b a$ | Baja el exponente como factor lineal |
| **Potencia idéntica de base y argumento** | $\log_{b^n}(a^n) = \log_b a$ | Simplificación de bases homogéneas |
| **Inversión de base** | $\log_b a = \frac{1}{\log_a b}$ | Permutación de base y argumento |
| **Cambio de base a $c$** | $\log_b a = \frac{\log_c a}{\log_c b} = \frac{\ln a}{\ln b}$ | Conversión a logaritmo natural o decimal |

> [!TIP]
> En cálculo infinitesimal, la propiedad de la potencia $\ln(u(x)^{v(x)}) = v(x) \ln u(x)$ es la base del método de **derivación logarítmica** y de la resolución de límites con indeterminación $[1^\infty]$, $[0^0]$ y $[\infty^0]$.

---

## 2. Valor Absoluto (Módulo)

El valor absoluto de $x \in \mathbb{R}$ se define como:

$$|x| = \begin{cases} x & \text{si } x \ge 0 \\ -x & \text{si } x < 0 \end{cases}$$

### Propiedades Esenciales

1. **Simetría:** $|a| = |-a|$
2. **Multiplicatividad:** $|a \cdot b| = |a| \cdot |b|$
3. **Divisibilidad:** $\left|\frac{a}{b}\right| = \frac{|a|}{|b|} \quad (b \neq 0)$
4. **Desigualdad Triangular:**
   $$|x + y| \le |x| + |y|$$
   *(Garantía de acotación en demostraciones rigurosas de límites $\varepsilon - \delta$ y convergencia de sucesiones).*

---

## 3. Trigonometría e Hiperbólicas

### Razones Trigonométricas Fundamentales

$$\tan x = \frac{\sin x}{\cos x}, \qquad \cot x = \frac{\cos x}{\sin x}, \qquad \sec x = \frac{1}{\cos x}, \qquad \csc x = \frac{1}{\sin x}$$

### Identidades Pitagóricas e Hiperbólicas

$$\sin^2 x + \cos^2 x = 1 \implies \tan^2 x + 1 = \sec^2 x$$

$$\cosh^2 x - \sinh^2 x = 1 \implies 1 - \tanh^2 x = \text{sech}^2 x$$

### Suma de Ángulos y Ángulo Doble

- **Suma de senos:** $\sin(\alpha + \beta) = \sin\alpha \cos\beta + \cos\alpha \sin\beta$
- **Suma de cosenos:** $\cos(\alpha + \beta) = \cos\alpha \cos\beta - \sin\alpha \sin\beta$
- **Ángulo doble del seno:** $\sin(2x) = 2 \sin x \cos x$

### Fórmulas de Reducción de Potencia (Ángulo Mitad)

Fundamentales para calcular integrales del tipo $\int \sin^2 x \, dx$ y $\int \cos^2 x \, dx$:

$$\sin^2 x = \frac{1 - \cos(2x)}{2}, \qquad \cos^2 x = \frac{1 + \cos(2x)}{2}$$

### Definición de Funciones Hiperbólicas

$$\sinh x = \frac{e^x - e^{-x}}{2}, \qquad \cosh x = \frac{e^x + e^{-x}}{2}$$

---

## 4. Cónicas en el Plano

Para conocer la ecuación de cualquier cónica con centro desplazado al punto $(h, k)$, se aplica la **transformación por traslación de ejes cartesianos**:

$$x \longrightarrow (x - h), \qquad y \longrightarrow (y - k)$$

### 1. Circunferencia

- **Canónica (centro en el origen):** $x^2 + y^2 = r^2$
- **Trasladada con centro $(h, k)$:** $(x - h)^2 + (y - k)^2 = r^2$

### 2. Elipse

- **Canónica (eje focal horizontal):** $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b)$
- **Trasladada con centro $(h, k)$:** $\frac{(x - h)^2}{a^2} + \frac{(y - k)^2}{b^2} = 1$

### 3. Hipérbola

- **Eje transversal horizontal (ramas abren hacia izquierda y derecha):**
  $$\frac{(x - h)^2}{a^2} - \frac{(y - k)^2}{b^2} = 1$$
- **Eje transversal vertical (ramas abren hacia arriba y hacia abajo):**
  $$\frac{(y - k)^2}{a^2} - \frac{(x - h)^2}{b^2} = 1$$

---

## 5. Propiedad Fundamental de la División Polinómica

Dados dos polinomios $D(x)$ (dividendo) y $d(x) \neq 0$ (divisor), existen únicos $c(x)$ (cociente) y $R(x)$ (resto) tales que:

$$D(x) = d(x) \cdot c(x) + R(x) \quad \text{con } \text{grado}(R) < \text{grado}(d)$$

Dividiendo miembro a miembro por $d(x)$:

$$\frac{D(x)}{d(x)} = c(x) + \frac{R(x)}{d(x)}$$

> [!NOTE]
> Esta descomposición es el primer paso obligatorio al resolver **integrales racionales impropias** ($\text{grado}(D) \ge \text{grado}(d)$) antes de descomponer en fracciones simples.

---

## 6. Álgebra Lineal: Teorema de Laplace

El determinante de una matriz cuadrada $B \in \mathbb{R}^{n \times n}$ se puede calcular desarrollando por los elementos de cualquier fila $i$ (o columna $j$):

$$\det(B) = \sum_{j=1}^n (-1)^{i+j} \cdot B_{i,j} \cdot M_{i,j}$$

donde $M_{i,j}$ es el **menor complementario**, es decir, el determinante de la submatriz obtenida al remover la $i$-ésima fila y la $j$-ésima columna de $B$.

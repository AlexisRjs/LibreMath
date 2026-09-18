# 📐 IngeData

> **La navaja suiza del estudiante de ingeniería.**  
> Diseñada en base al programa y cursado de ingeniería (UTN Rosario), optimizada para ser ultra rápida, ligera y accesible para cualquier estudiante, incluso en computadoras de bajos recursos.

---

## 🚀 ¿Por qué Tauri (Rust + Web Frontend)? — Justificación Arquitectónica

Al diseñar una aplicación de escritorio técnica que acompañe a los estudiantes durante sus horas de estudio, el rendimiento y el consumo de recursos son factores críticos. Muchos estudiantes universitarios utilizan laptops con especificaciones modestas (procesadores Intel Celeron / Core i3 de generaciones anteriores, 4 GB de RAM y discos mecánicos HDD).

Evaluamos detenidamente **cuatro alternativas tecnológicas** antes de consolidar la arquitectura de IngeData:

### 📊 Matriz Comparativa

| Criterio | Electron (Previo) | Flet (Python + Flutter) | Rust Nativo (Iced/Slint) | ⭐ **Tauri 2 (Rust + Web)** |
| :--- | :--- | :--- | :--- | :--- |
| **Consumo de RAM** | ⚠️ 180 – 350 MB | 🟡 90 – 160 MB | 🟢 15 – 35 MB | 🟢 **35 – 60 MB** |
| **Tiempo de arranque (HDD)** | ⚠️ 3 a 6 s | 🟡 2 a 4 s | 🟢 < 0.3 s | 🟢 **< 1 s** |
| **Tamaño del instalador** | ⚠️ ~80 – 120 MB | 🟡 ~40 – 70 MB | 🟢 ~10 – 20 MB | 🟢 **~3 – 8 MB** |
| **Fórmulas $\LaTeX$** | 🟢 Excelente (KaTeX) | 🔴 Muy limitado | 🔴 Sin soporte maduro | 🟢 **Excelente (KaTeX)** |
| **Grafos de Conocimiento** | 🟢 Maduro (D3.js) | 🟡 Complejo | 🔴 Desarrollar de cero | 🟢 **Maduro (D3.js)** |
| **Editor de Notas Markdown** | 🟢 Excelente (CodeMirror) | 🟡 Básico | 🟡 En desarrollo | 🟢 **Excelente (CodeMirror)** |
| **Portabilidad y Mantenimiento** | 🟡 Alto costo de memoria | 🔴 Intérprete Python pesado | 🔴🔴 Meses de desarrollo extra | 🟢 **Óptimo y modular** |

---

### 🔬 Análisis de las Alternativas Evaluadas

#### 1. ¿Por qué descartamos mantener Electron?
* **Sobrecarga de recursos**: Electron empaqueta una instancia completa de Chromium y Node.js para cada ventana.
* En un equipo con 4 GB de RAM, donde Windows ya consume más de 2.5 GB, una app en Electron compitiendo con un lector de PDFs y un navegador web empuja al sistema a utilizar memoria virtual (swap en disco), provocando congelamientos y lentitud extrema.

#### 2. ¿Por qué descartamos Flet (Python + Flutter)?
* **Limitación en renderizado matemático**: IngeData requiere renderizar expresiones matemáticas avanzadas (integrales múltiples, tensores, matrices de derivadas, ecuaciones de Maxwell). Las librerías actuales en Flutter (`flutter_math`) carecen de la madurez y fidelidad tipográfica de KaTeX.
* **Arranque en frío**: Desempaquetar y arrancar el intérprete de Python desde un ejecutable congelado en discos mecánicos (HDD) suele ser notablemente lento.
* **Falta de ecosistema para grafos interactivos**: Replicar la física de nodos de D3.js en Flutter demandaría un esfuerzo desproporcionado.

#### 3. ¿Por qué descartamos Rust Nativo Puro (Iced / Slint / egui)?
* Aunque el consumo de RAM en Rust puro es insuperable (15–30 MB), el ecosistema de interfaces de usuario en Rust carece hoy de motores tipográficos maduros capaces de diagramar fórmulas matemáticas complejas en tiempo real o editores de texto con autocompletado y syntax highlighting extensibles.

#### 4. La Solución Ganadora: Tauri 2 (Rust + Web Frontend)
Tauri combina **la velocidad y el bajísimo consumo de Rust** en el backend con **la potencia visual del ecosistema Web** en el frontend:
* **Sin Chromium empaquetado**: En Windows utiliza directamente **WebView2** (el motor Edge integrado en el sistema operativo), reduciendo el tamaño del instalador a tan solo **~4 MB** y el uso de RAM a **~40 MB**.
* **Fórmulas matemáticas perfectas**: Renderizado instantáneo y fiel con **KaTeX**.
* **Visualización de grafos**: Interactividad fluida a 60 fps mediante **D3.js**.
* **Almacenamiento directo y seguro**: El backend en **Rust** maneja el acceso al sistema de archivos local para guardar y leer notas markdown con latencia sub-milisegundo.

---

## ✨ Características Principales

- 📚 **Base de Conocimiento Estructurada**: Módulos organizados por materias (Física I, Física II, Álgebra, Análisis Matemático I y II) con notas en formato Markdown y metadatos YAML.
- ⚛️ **Renderizado Matemático $\LaTeX$**: Ecuaciones nítidas y de alta precisión tipográfica gracias a KaTeX.
- 🕸️ **Grafo Interactivo de Conceptos**: Mapa conceptual interactivo con física de fuerzas (D3.js) para navegar entre temas correlacionados.
- 📝 **Editor de Notas Integrado**: Editor Markdown con resaltado de sintaxis (CodeMirror) que guarda cambios directamente en archivos `.md` locales.
- 🧮 **Calculadoras de Ingeniería**:
  - Evaluador de fórmulas y expresiones matemáticas.
  - Calculadora de operaciones matriciales (suma, producto, determinantes, inversa).
- 🔍 **Buscador Instantáneo**: Command Palette (`Ctrl + K`) con búsqueda difusa (Fuzzy Search) para encontrar fórmulas, leyes y definiciones en milisegundos.
- 💾 **100% Offline**: Funciona completamente desconectado de internet; no requiere cuentas, servidores ni suscripciones.

---

## 🛠️ Requisitos del Sistema

- **Sistema Operativo**: Windows 10 / 11, Linux o macOS.
- **Node.js**: Versión 18 o superior.
- **Rust & Cargo**: (Opcional, solo para compilar la versión de escritorio nativa con Tauri).

---

## 📦 Instalación y Uso

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/usuario/ingedata-app.git
cd "IngeData APP"
npm install
```

### 2. Ejecutar en Modo Web (Navegador)
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 3. Ejecutar en Modo Escritorio Nativo (Tauri + Rust)
```bash
npm run desktop:dev
```
Inicia la ventana nativa de escritorio con recarga en vivo tanto para el frontend como para los comandos de Rust.

### 4. Generar el Instalador de Escritorio (.msi / .exe)
```bash
npm run desktop:build
```
Genera un instalador ultra ligero (~4 MB) en la carpeta `src-tauri/target/release/bundle/`.

---

## 📂 Estructura del Proyecto

```text
IngeData APP/
├── modules/              # Notas de estudio en Markdown por materia
│   ├── algebra/          # Matrices, espacios vectoriales, cónicas...
│   ├── am1/              # Funciones, derivadas, integrales...
│   ├── am2/              # Cálculo multivariable, campos vectoriales...
│   ├── fisica-1/         # Cinemática, dinámica, termodinámica...
│   └── fisica-2/         # Electromagnetismo, ondas, óptica...
├── src/                  # Frontend en React + TypeScript
│   ├── components/       # Componentes de UI (Graph, Editor, Math, Calculadoras)
│   ├── services/         # Puente Tauri/Rust, motor de búsqueda, parser
│   └── types/            # Tipos de TypeScript para módulos y fórmulas
├── src-tauri/            # Backend nativo de escritorio en Rust
│   ├── src/lib.rs        # Comandos de Rust (lectura, guardado de archivos)
│   ├── Cargo.toml        # Dependencias de Rust
│   └── tauri.conf.json   # Configuración de ventana y empaquetado Tauri
└── package.json          # Scripts de ejecución y dependencias frontend
```

---

## 📄 Licencia

Desarrollado para la comunidad universitaria y de ingeniería. Libre para uso y estudio.

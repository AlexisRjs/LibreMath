# 📐 IngeData (LibreMath)

> **La navaja suiza del estudiante de ingeniería.**  
> Diseñada en base al programa y cursado de ingeniería (UTN Rosario), optimizada para ser ultra rápida, ligera y accesible para cualquier estudiante, incluso en computadoras de recursos moderados.

---

## 🚀 ¿Por qué Tauri (Rust + Web Frontend)? — Justificación Arquitectónica

Al diseñar una aplicación de escritorio técnica que acompañe a los estudiantes durante sus horas de estudio, el rendimiento y el consumo de memoria son factores críticos. Muchos estudiantes universitarios utilizan laptops con especificaciones modestas (procesadores Intel Celeron / Core i3 de generaciones anteriores, 4 GB de RAM y discos mecánicos HDD).

Evaluamos detenidamente **cuatro alternativas tecnológicas** antes de consolidar la arquitectura de IngeData:

### 📊 Matriz Comparativa

| Criterio | Electron (Previo) | Flet (Python + Flutter) | Rust Nativo (Iced/Slint) | ⭐ **Tauri 2 (Rust + Web)** |
| :--- | :--- | :--- | :--- | :--- |
| **Consumo de RAM** | ⚠️ 180 – 350 MB | 🟡 90 – 160 MB | 🟢 15 – 35 MB | 🟢 **35 – 70 MB** |
| **Tiempo de arranque (HDD)** | ⚠️ 3 a 6 s | 🟡 2 a 4 s | 🟢 < 0.3 s | 🟢 **< 1 s** |
| **Tamaño del instalador** | ⚠️ ~80 – 120 MB | 🟡 ~40 – 70 MB | 🟢 ~10 – 20 MB | 🟢 **~4 – 10 MB** |
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
* **Limitación en renderizado matemático**: IngeData requiere renderizar expresiones matemáticas avanzadas (integrales múltiples, tensores, matrices de derivadas, ecuaciones diferenciales). Las librerías actuales en Flutter (`flutter_math`) carecen de la madurez y fidelidad tipográfica de KaTeX.
* **Arranque en frío**: Desempaquetar y arrancar el intérprete de Python desde un ejecutable congelado en discos mecánicos (HDD) suele ser notablemente lento.
* **Falta de ecosistema para grafos interactivos**: Replicar la física de nodos de D3.js en Flutter demandaría un esfuerzo desproporcionado.

#### 3. ¿Por qué descartamos Rust Nativo Puro (Iced / Slint / egui)?
* Aunque el consumo de RAM en Rust puro es insuperable (15–30 MB), el ecosistema de interfaces de usuario en Rust carece hoy de motores tipográficos maduros capaces de diagramar fórmulas matemáticas complejas en tiempo real o editores de texto con autocompletado y syntax highlighting extensibles.

#### 4. La Solución Ganadora: Tauri 2 (Rust + Web Frontend)
Tauri combina **la velocidad y el bajísimo consumo de Rust** en el backend con **la potencia visual del ecosistema Web** en el frontend:
* **Sin Chromium empaquetado**: En Windows utiliza directamente **WebView2** (el motor Edge Evergreen integrado en el sistema operativo), reduciendo el tamaño del instalador a tan solo **~5 a 10 MB** y el uso de RAM a **~40 a 70 MB**.
* **Fórmulas matemáticas perfectas**: Renderizado instantáneo y fiel con **KaTeX**.
* **Visualización de grafos**: Interactividad fluida a 60 fps mediante física de fuerzas con **D3.js**.
* **Almacenamiento directo y seguro**: El backend en **Rust** maneja el acceso al sistema de archivos local para guardar y leer notas Markdown con latencia sub-milisegundo.

---

## ✨ Características Principales

- 📚 **Materias y Contenidos de Ingeniería (UTN FRRO)**:
  - **Álgebra y Geometría Analítica** (Vectores, rectas, planos, matrices, cónicas).
  - **Análisis Matemático I y II** (Límites, derivadas, integrales, cálculo multivariable, teoremas de Green/Stokes/Gauss).
  - **Física I y II** (Cinemática, dinámica, termodinámica, electromagnetismo, óptica).
  - **Lógica y Estructuras Discretas** (Lógica proposicional, teoría de conjuntos, grafos, álgebra de Boole).
  - **Probabilidad y Estadística** (Variables aleatorias, distribuciones discretas y continuas, inferencia).
  - **Economía** (Microeconomía, macroeconomía, costos, evaluación de proyectos).
  - **Análisis Numérico** (Métodos iterativos, interpolación, integración numérica, resolución de EDOs).
  - **Inglés I e Inglés II** (Gramática técnica, vocabulario de ingeniería, comprensión lectora de papers).

- 🗂️ **Organización por Carpetas y Materias Personalizadas**:
  - Creación de nuevas carpetas y materias raíz creadas por el usuario con paletas de colores personalizables.
  - Sincronización instantánea de carpetas y notas creadas con el mapa interactivo de grafos.
  - Persistencia local permanente (`localStorage`).

- 🕸️ **Grafo Interactivo de Conceptos (Knowledge Graph)**:
  - Visualización de relaciones conceptuales en 2D con física de fuerzas (D3.js Force Simulation).
  - Filtro por materia, agrupación por clusters independientes y navegación fluida a 60 FPS.

- 📝 **Editor de Notas Markdown**:
  - Editor con resaltado de sintaxis (CodeMirror 6) y renderizado matemático en tiempo real con KaTeX.
  - Lienzo limpio sin apuntes basura precargados: el usuario crea y gestiona sus propias notas.

- 📅 **Agenda TO-DO Académica**:
  - Registro de Parciales, Finales, Tareas y Trabajos Prácticos.
  - Selector de fechas límite, etiquetas de prioridad cromáticas (alta, media, baja) y persistencia local.

- ⏱️ **Temporizador Pomodoro con Widget Flotante**:
  - Presets preconfigurados: **Sesión Profunda** (1h $\times$ 10m) y **Sprint Rápido** (30m $\times$ 5m).
  - Modo **Personalizado** que recuerda y mantiene los últimos tiempos definidos por el usuario de forma persistente.
  - **Mini-widget flotante** en la esquina inferior derecha para no perder de vista el tiempo al navegar apuntes.
  - **Aviso sonoro suave (Chime)** generado mediante Web Audio API al llegar a `0:00` con botón de prueba en cabecera.

- 🧮 **Calculadora Matricial Integrada**:
  - Acceso directo dentro de la sección de Álgebra: suma, producto, determinantes, matrices transpuestas e inversas (hasta 5x5).

- 🔍 **Buscador Instantáneo (Command Palette)**:
  - Accesible con `Ctrl + K` con búsqueda difusa (Fuse.js) sobre temas, fórmulas y apuntes personales.

- 💾 **100% Offline y Privado**:
  - No requiere conexión a internet, cuentas, servidores ni telemetría. Toda la información pertenece al usuario.

---

## 🖥️ Requisitos del Sistema para el Instalador

IngeData está optimizada para ejecutarse fluidamente en hardware modesto. Se recomiendan los siguientes parámetros para el instalador y entorno de ejecución:

| Requisito | Mínimo | Recomendado |
| :--- | :--- | :--- |
| **Sistema Operativo** | Windows 10 (64-bit, v1809 o superior) / Windows 11 | Windows 10 / 11 (64-bit, actualizado) |
| **Procesador (CPU)** | Dual-Core a 1.6 GHz (Intel Celeron, Core i3 4ª gen, AMD Athlon o equivalente) | Quad-Core a 2.0 GHz+ (Intel Core i3/i5 8ª gen+, AMD Ryzen 3/5 o superior) |
| **Memoria RAM** | **2 GB** (mínimo 600 MB libres para la aplicación) | **4 GB o más** (recomendado para multitarea con navegador y PDFs) |
| **Gráficos (GPU)** | Gráficos integrados con soporte DirectX 11 / WebGL (Intel HD 4000+) | Gráficos integrados modernos (Intel UHD / Iris Xe / AMD Radeon Vega) |
| **Almacenamiento** | **150 MB** de espacio libre en disco | **500 MB** de espacio libre (apuntes Markdown, cachés e índices) |
| **Resolución de Pantalla**| **1280 × 720 (HD)** | **1920 × 1080 (Full HD)** o superior |
| **Software Adicional** | **Microsoft Edge WebView2 Runtime** *(incluido de fábrica en Windows 10/11)* | WebView2 Evergreen Runtime actualizado |

> 💡 **Nota sobre el instalador de Windows (NSIS / MSI):**  
> Gracias a Tauri, el instalador pesa menos de **10 MB**. Si la máquina del usuario tuviese una versión desactualizada de Windows 10 sin WebView2, el instalador puede descargarlo automáticamente de los servidores de Microsoft de manera desatendida.

---

## 📦 Instalación y Uso para Desarrolladores

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/usuario/ingedata-app.git
cd "IngeData APP"
npm install
```

### 2. Ejecutar en Modo Web (Vite Dev Server)
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 3. Ejecutar en Modo Escritorio Nativo (Tauri + Rust)
```bash
npm run desktop:dev
```
Inicia la ventana nativa de escritorio con Hot Module Replacement (HMR) tanto para el frontend como para los módulos nativos de Rust.

### 4. Compilar el Instalador de Producción (.exe / .msi)
```bash
npm run desktop:build
```
Genera los instaladores optimizados de alta compresión en la carpeta `src-tauri/target/release/bundle/`.

---

## 📂 Estructura del Proyecto

```text
IngeData APP/
├── modules/                      # Base de apuntes estructurada en Markdown + YAML
│   ├── algebra/                  # Álgebra y Geometría Analítica
│   ├── am1/                      # Análisis Matemático I
│   ├── am2/                      # Análisis Matemático II
│   ├── fisica-1/                 # Física I
│   ├── fisica-2/                 # Física II
│   ├── ingles-1/                 # Inglés I
│   ├── ingles-2/                 # Inglés II
│   ├── logica-discreta/          # Lógica y Estructuras Discretas
│   ├── probabilidad-estadistica/ # Probabilidad y Estadística
│   ├── economia/                 # Economía
│   └── analisis-numerico/        # Análisis Numérico
├── src/                          # Frontend React 19 + TypeScript + Tailwind CSS
│   ├── components/               # Componentes de interfaz
│   │   ├── calculators/          # Calculadora matricial y evaluador de fórmulas
│   │   ├── FloatingPomodoroWidget.tsx # Widget flotante de Pomodoro
│   │   ├── GraphView.tsx         # Grafo interactivo D3.js
│   │   ├── NewFolderModal.tsx    # Modal de creación de carpetas/materias
│   │   ├── NewNoteModal.tsx      # Modal de creación de notas
│   │   ├── NoteEditor.tsx        # Editor Markdown CodeMirror 6
│   │   ├── PomodoroView.tsx      # Vista completa de temporizador Pomodoro
│   │   └── Sidebar.tsx           # Barra lateral con navegación, TO-DO y materias
│   ├── hooks/                    # Hooks personalizados (usePomodoro, useTodos, etc.)
│   ├── services/                 # Servicios de carga, almacenamiento local y búsqueda
│   │   ├── customModuleStorage.ts # Gestión y persistencia de carpetas/materias de usuario
│   │   ├── moduleLoader.ts       # Carga reactiva de módulos y notas
│   │   └── storage.ts            # Persistencia de notas y configuraciones
│   ├── types/                    # Definiciones TypeScript (módulos, notas, pomodoro)
│   └── utils/                    # Utilidades de sonido (Web Audio chime) y formateo
├── src-tauri/                    # Backend nativo de escritorio en Rust (Tauri v2)
│   ├── src/lib.rs                # Comandos Rust nativos
│   ├── Cargo.toml                # Dependencias de Rust
│   └── tauri.conf.json           # Configuración de ventana y empaquetado Tauri
└── package.json                  # Dependencias frontend y scripts de desarrollo
```

---

## 📄 Licencia

Desarrollado para la comunidad universitaria y de ingeniería. Libre para uso, extensión y estudio.

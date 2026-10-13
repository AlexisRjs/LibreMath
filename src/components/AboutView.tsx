import React from 'react';
import {
  Code2,
  GraduationCap,
  Layers,
  Info,
  ExternalLink,
  Calculator,
  Grid,
  FileText,
  Network,
  Heart,
  ShieldCheck,
  Globe,
  HardDrive,
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-zinc-300">
      {/* 1. Hero Header */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-b from-purple-950/30 via-zinc-950 to-black border border-[#7c3aed]/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl border border-[#7c3aed]/50 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] shrink-0"
              style={{ backgroundColor: '#09090b' }}
            >
              <img src="/app-icon.png" alt="LibreMath" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">LibreMath</h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#c4b5fd] border border-[#7c3aed]/40 font-semibold">
                  v1.0.0 Desktop
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                La navaja suiza de apuntes, cálculo y herramientas para estudiantes de ingeniería.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              UTN FRRo • UPL
            </span>
          </div>
        </div>
      </div>

      {/* 2. Creador y Propósito */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 text-white font-semibold text-base border-b border-zinc-900 pb-3">
          <GraduationCap className="w-5 h-5 text-[#a78bfa]" />
          <span>Sobre el Creador y Proyecto</span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          <p>
            ¡Hola! Mi nombre es <strong className="text-white font-semibold">Alexis Fernando Rojas</strong>, creador y desarrollador de <strong className="text-[#c4b5fd]">LibreMath</strong>. Soy estudiante de <strong className="text-white">Ingeniería en Sistemas de Información</strong> en la <strong className="text-white">UTN FRRo</strong> (Facultad Regional Rosario).
          </p>
          <p>
            Desarrollé LibreMath como una iniciativa estudiantil y de código abierto para resolver una necesidad común en nuestras cursadas: contar con un espacio unificado, ágil, offline y con renderizado matemático de primer nivel que combine apuntes teóricos, cálculo simbólico avanzado paso a paso y herramientas de productividad.
          </p>
          <p className="text-zinc-400">
            El proyecto se articula en conjunto con la comunidad de <strong className="text-zinc-200">UPL (Unidad Popular de Lucha)</strong> de UTN Rosario, buscando facilitar el acceso a apuntes, ejercicios resueltos y materiales para toda la comunidad académica.
          </p>
        </div>

        {/* Action Buttons: GitHub & Instagram */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/AlexisRjs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 hover:border-[#7c3aed] text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <GithubIcon className="w-4 h-4 text-white" />
            <span>GitHub (@AlexisRjs)</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>

          <a
            href="https://www.instagram.com/alexisrojas.1/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800/70 hover:to-pink-800/70 border border-purple-700/50 text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>Instagram Personal (@alexisrojas.1)</span>
            <ExternalLink className="w-3 h-3 text-pink-300" />
          </a>

          <a
            href="https://www.instagram.com/upl_utnrosario/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <InstagramIcon className="w-4 h-4 text-[#a78bfa]" />
            <span>Instagram UPL (@upl_utnrosario)</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* 3. Funcionalidades Principales */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-white font-semibold text-base">
          <Layers className="w-5 h-5 text-[#a78bfa]" />
          <span>Funcionalidades Integradas de la Aplicación</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Calculadora Paso a Paso */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
            <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
              <Calculator className="w-4 h-4 text-[#a78bfa]" />
              <span>Calculadora Analítica Paso a Paso (AM1 y AM2)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Resuelve problemas indicando qué regla o teorema de cátedra aplicar, detallando el procedimiento y dando el resultado final:
            </p>
            <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
              <li><strong className="text-zinc-200">AM1:</strong> Derivadas (cadena, producto, cociente) e Integrales (LIATE, sustitución, Barrow).</li>
              <li><strong className="text-zinc-200">U1:</strong> Funciones vectoriales r(t), velocidad, vector tangente unitario T(t) y curvatura κ(t).</li>
              <li><strong className="text-zinc-200">U2-U3:</strong> Derivadas parciales, Teorema de Schwarz, gradiente ∇f, derivada direccional y plano tangente.</li>
              <li><strong className="text-zinc-200">U4:</strong> Extremos relativos, Matriz Hessiana H, discriminante D y Multiplicadores de Lagrange.</li>
              <li><strong className="text-zinc-200">U5:</strong> Integrales dobles por Teorema de Fubini y coordenadas polares con Jacobiano r.</li>
              <li><strong className="text-zinc-200">U6:</strong> Campos conservativos, función potencial φ, Teorema de Green y trabajo de una fuerza.</li>
              <li><strong className="text-zinc-200">U7:</strong> Divergencia (Teorema de Gauss) y Rotacional (Teorema de Stokes).</li>
              <li><strong className="text-zinc-200">U8:</strong> EDOs lineales de 1er orden por factor integrante, variables separables y 2do orden homogéneas.</li>
            </ul>
          </div>

          {/* Card: Calculadora Matricial & Fórmulas */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
            <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
              <Grid className="w-4 h-4 text-[#a78bfa]" />
              <span>Calculadora Matricial y Banco de Fórmulas</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Álgebra lineal interactiva con cálculo de determinantes, matrices inversas, suma, multiplicación de matrices y transpuesta. Banco de fórmulas categorizado con evaluador numérico instantáneo.
            </p>
          </div>

          {/* Card: Editor de Apuntes Markdown & KaTeX */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
            <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
              <FileText className="w-4 h-4 text-[#a78bfa]" />
              <span>Editor de Apuntes Markdown & KaTeX</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Editor con soporte completo de KaTeX para tipografía matemática de calidad editorial, modo vista previa en vivo, resaltado de código y exportación rápida.
            </p>
          </div>

          {/* Card: Grafo de Correlatividades y Pomodoro */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
            <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
              <Network className="w-4 h-4 text-[#a78bfa]" />
              <span>Grafo de Conocimiento y Modo Enfoque Pomodoro</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Visualización topológica interactiva con D3.js de materias y correlatividades, junto a un temporizador Pomodoro con avisos sonoros y widget flotante para estudiar con disciplina.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Tecnologías Utilizadas */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 text-white font-semibold text-base border-b border-zinc-900 pb-3">
          <Code2 className="w-5 h-5 text-[#a78bfa]" />
          <span>Stack Tecnológico</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: 'Tauri v2 (Rust)', desc: 'Motor nativo desktop ultra ligero y veloz' },
            { name: 'React 19 & TypeScript', desc: 'Frontend moderno, componentes y tipado estricto' },
            { name: 'KaTeX & Math.js', desc: 'Renderizado tipográfico y motor de cálculo simbólico' },
            { name: 'Vite', desc: 'Bundler y entorno de desarrollo de última generación' },
            { name: 'Tailwind CSS', desc: 'Diseño de interfaz oscura premium minimalista' },
            { name: 'D3.js & CodeMirror', desc: 'Visualización de grafos y editor de texto profesional' },
          ].map(tech => (
            <div key={tech.name} className="p-3 rounded-xl bg-black/60 border border-zinc-900 space-y-1">
              <span className="text-xs font-semibold text-white block">{tech.name}</span>
              <span className="text-[11px] text-zinc-500 block leading-tight">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Filosofía de Privacidad, Backend y Persistencia */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 text-white font-semibold text-base border-b border-zinc-900 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Privacidad, Persistencia y Filosofía sin Backend</span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
          <p>
            <strong className="text-white">LibreMath es una herramienta de enfoque libre y privado:</strong> la aplicación no hostea un backend centralizado en la nube ni requiere autenticar cuentas con contraseñas. Toda la computación matemática y el almacenamiento se procesan localmente en tu propio dispositivo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Versión Web (Navegador)</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Al ejecutar LibreMath desde el navegador, las notas que crees se guardan en el <strong className="text-zinc-200">almacenamiento local (localStorage)</strong> de tu navegador actual. Si cambias de navegador, limpias cookies o usas otra PC, las notas no se sincronizan automáticamente.
              </p>
              <div className="flex items-start gap-2 text-[11px] text-amber-300/90 font-medium bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/40">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Recomendación Web:</strong> Utiliza el botón <em>&quot;Exportar como Markdown (.md)&quot;</em> para guardar copias de seguridad de tus notas en tu equipo y cárgalas cuando quieras con <em>&quot;Importar archivo (.md)&quot;</em>.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-purple-900/40 space-y-2">
              <div className="flex items-center gap-2 text-[#c4b5fd] font-semibold text-xs">
                <HardDrive className="w-4 h-4 text-[#a78bfa]" />
                <span>Versión Instalable (.exe / Windows)</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                En la aplicación de escritorio empaquetada con <strong className="text-zinc-200">Tauri (Rust)</strong>, las notas se guardan <strong className="text-white">de forma persistente en los archivos de tu disco duro</strong>. No se pierden al limpiar el navegador ni dependen de sesiones de internet.
              </p>
              <div className="flex items-start gap-2 text-[11px] text-purple-300 font-medium bg-purple-950/40 p-2.5 rounded-lg border border-purple-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300 shrink-0 mt-0.5" />
                <span><strong>100% Offline:</strong> Acceso permanente sin conexión, cero telemetría y máximo rendimiento nativo.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Colaboración y Contacto */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-purple-900/50 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>¿Querés sumar apuntes o colaborar con LibreMath?</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Si cursas alguna materia en la UTN (Álgebra, Análisis Matemático, Física, Química, Algoritmos, o materias avanzadas) y querés sumar apuntes, corregir fórmulas, proponer ejercicios de exámenes finales o colaborar en el desarrollo, escribime directamente por Instagram a <strong className="text-purple-300">@alexisrojas.1</strong> o a <strong className="text-purple-300">@upl_utnrosario</strong>.
        </p>
      </div>
    </div>
  );
};

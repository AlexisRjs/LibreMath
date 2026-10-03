import React from 'react';
import { Play, Pause, Maximize2, X, Coffee, Brain } from 'lucide-react';
import { PomodoroMode } from '../types/pomodoro';

interface FloatingPomodoroWidgetProps {
  isVisible: boolean;
  mode: PomodoroMode;
  timeLeftFormatted: string;
  isRunning: boolean;
  progressPercent: number;
  onToggle: () => void;
  onOpenFullView: () => void;
  onDismiss: () => void;
}

export const FloatingPomodoroWidget: React.FC<FloatingPomodoroWidgetProps> = ({
  isVisible,
  mode,
  timeLeftFormatted,
  isRunning,
  progressPercent,
  onToggle,
  onOpenFullView,
  onDismiss,
}) => {
  if (!isVisible) return null;

  const isStudy = mode === 'study';

  return (
    <div className="fixed bottom-10 right-6 z-40 flex items-center gap-3 bg-zinc-950/95 backdrop-blur-md border border-[#7c3aed]/40 hover:border-[#a78bfa] transition-all duration-200 rounded-2xl p-2.5 px-3.5 shadow-2xl shadow-purple-950/50 animate-in slide-in-from-bottom-5 text-white select-none">
      {/* Mode icon with animated indicator */}
      <div
        onClick={onOpenFullView}
        className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
          isStudy
            ? 'bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40'
            : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
        }`}
        title="Abrir Pomodoro en pantalla completa"
      >
        {isStudy ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
      </div>

      {/* Timer info */}
      <div onClick={onOpenFullView} className="cursor-pointer min-w-[70px]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning
                ? isStudy
                  ? 'bg-violet-400 animate-ping'
                  : 'bg-emerald-400 animate-ping'
                : 'bg-zinc-600'
            }`}
          />
          <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
            {isStudy ? 'Estudio' : 'Descanso'}
          </span>
        </div>
        <div className="text-sm font-bold font-mono tracking-tight text-white">
          {timeLeftFormatted}
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-12 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full transition-all duration-300 ${
            isStudy ? 'bg-[#7c3aed]' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 pl-1 border-l border-zinc-800/80">
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
            isRunning
              ? 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40'
              : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xs'
          } hover:scale-105 active:scale-95`}
          title={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={onOpenFullView}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          title="Ver panel completo de Pomodoro"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors cursor-pointer"
          title="Ocultar reloj emergente"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

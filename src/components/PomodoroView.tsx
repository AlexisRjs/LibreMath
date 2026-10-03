import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Coffee,
  Brain,
  Sliders,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Bell,
} from 'lucide-react';
import { PomodoroMode, PomodoroPresetId } from '../types/pomodoro';

interface PomodoroViewProps {
  mode: PomodoroMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  studyDurationMinutes: number;
  breakDurationMinutes: number;
  customStudyMinutes: number;
  customBreakMinutes: number;
  selectedPresetId: PomodoroPresetId;
  sessionsCompleted: number;
  formatTime: (sec: number) => string;
  progressPercent: number;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSelectPreset: (presetId: PomodoroPresetId) => void;
  onSetCustomDurations: (studyMins: number, breakMins: number) => void;
  onTestSound?: () => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  mode,
  timeLeft,
  isRunning,
  studyDurationMinutes,
  breakDurationMinutes,
  customStudyMinutes,
  customBreakMinutes,
  selectedPresetId,
  sessionsCompleted,
  formatTime,
  progressPercent,
  onToggle,
  onReset,
  onSkip,
  onSelectPreset,
  onSetCustomDurations,
  onTestSound,
}) => {
  const isStudy = mode === 'study';

  // Local state initialized with user's last customized times
  const [customStudy, setCustomStudy] = useState(customStudyMinutes);
  const [customBreak, setCustomBreak] = useState(customBreakMinutes);
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Sync when custom times change
  useEffect(() => {
    setCustomStudy(customStudyMinutes);
    setCustomBreak(customBreakMinutes);
  }, [customStudyMinutes, customBreakMinutes]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onSetCustomDurations(customStudy, customBreak);
    setIsEditingCustom(false);
  };

  // SVG circular ring calculations
  const strokeWidth = 8;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="h-full overflow-y-auto bg-[#09090b] text-white p-6 sm:p-10 flex flex-col items-center justify-between font-sans select-none animate-view-fade">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/40 flex items-center justify-center text-[#c084fc] shadow-lg shadow-purple-950/30">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>Temporizador Pomodoro</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-purple-300 border border-purple-800/40">
                Enfoque
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Método de bloques de estudio intenso y descansos programados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTestSound && (
            <button
              onClick={onTestSound}
              type="button"
              title="Probar sonido de notificación (campana suave)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline text-[11px] font-medium">Probar sonido</span>
            </button>
          )}

          {/* Sessions Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs shadow-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="font-semibold text-zinc-200">{sessionsCompleted}</span>
            <span className="text-zinc-500 text-[11px]">sesiones</span>
          </div>
        </div>
      </div>

      {/* Main Clock & Circular Ring */}
      <div className="my-8 flex flex-col items-center justify-center relative">
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          {/* Background Glow */}
          <div
            className={`absolute inset-4 rounded-full blur-2xl transition-all duration-500 opacity-20 ${
              isStudy ? 'bg-[#7c3aed]' : 'bg-emerald-500'
            }`}
          />

          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background track circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="#27272a"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={isStudy ? '#a855f7' : '#10b981'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Central Clock Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {/* Mode badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 transition-all ${
                isStudy
                  ? 'bg-[#7c3aed]/20 text-purple-300 border border-[#7c3aed]/40'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
              }`}
            >
              {isStudy ? (
                <>
                  <Brain className="w-3.5 h-3.5 text-[#c084fc]" />
                  <span>Modo Estudio</span>
                </>
              ) : (
                <>
                  <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Descanso</span>
                </>
              )}
            </div>

            {/* Time Countdown */}
            <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tighter text-white tabular-nums">
              {formatTime(timeLeft)}
            </div>

            {/* Status text */}
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {isRunning
                ? isStudy
                  ? 'Concéntrate en tus apuntes y fórmulas'
                  : 'Tómate un respiro, estira y relaja'
                : 'En pausa'}
            </p>
          </div>
        </div>

        {/* Big Control Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onReset}
            className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Reiniciar bloque"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggle}
            className={`px-8 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2.5 transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-purple-950/50'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Comenzar</span>
              </>
            )}
          </button>

          <button
            onClick={onSkip}
            className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            title={isStudy ? 'Pasar a Descanso' : 'Pasar a Estudio'}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Modalidades de Tiempo</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            {isStudy ? `${studyDurationMinutes} min estudio` : `${breakDurationMinutes} min descanso`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Preset 1: 1h estudio x 10 descanso */}
          <button
            onClick={() => onSelectPreset('1h-10m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedPresetId === '1h-10m'
                ? 'border-[#7c3aed] bg-[#7c3aed]/15 shadow-md shadow-purple-950/30'
                : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Sesión Profunda</span>
              {selectedPresetId === '1h-10m' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c084fc]" />
              )}
            </div>
            <div className="text-sm font-extrabold font-mono text-[#a78bfa]">
              1h <span className="text-zinc-500 font-normal">x</span> 10m
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              60 min estudio • 10 min descanso
            </p>
          </button>

          {/* Preset 2: 30min estudio x 5 descanso */}
          <button
            onClick={() => onSelectPreset('30m-5m')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedPresetId === '30m-5m'
                ? 'border-[#7c3aed] bg-[#7c3aed]/15 shadow-md shadow-purple-950/30'
                : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Sprint Rápido</span>
              {selectedPresetId === '30m-5m' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c084fc]" />
              )}
            </div>
            <div className="text-sm font-extrabold font-mono text-[#a78bfa]">
              30m <span className="text-zinc-500 font-normal">x</span> 5m
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              30 min estudio • 5 min descanso
            </p>
          </button>

          {/* Preset 3: Personalizar */}
          <button
            onClick={() => {
              onSelectPreset('custom');
              setIsEditingCustom(true);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedPresetId === 'custom'
                ? 'border-[#7c3aed] bg-[#7c3aed]/15 shadow-md shadow-purple-950/30'
                : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Personalizado</span>
              <Sliders className="w-3.5 h-3.5 text-[#c084fc]" />
            </div>
            <div className="text-sm font-extrabold font-mono text-[#a78bfa]">
              {customStudyMinutes}m <span className="text-zinc-500 font-normal">x</span> {customBreakMinutes}m
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              {selectedPresetId === 'custom' ? 'Activo • Clic para reajustar' : 'Último guardado • Clic para usar'}
            </p>
          </button>
        </div>

        {/* Custom Edit Drawer if Custom is active */}
        {(selectedPresetId === 'custom' || isEditingCustom) && (
          <form
            onSubmit={handleApplyCustom}
            className="mt-3 p-3.5 rounded-xl bg-zinc-950 border border-purple-900/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-[10px] font-semibold uppercase text-zinc-400 mb-1">
                  Estudio (minutos)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={customStudy}
                    onChange={e => setCustomStudy(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-black border border-zinc-800 rounded-lg px-2.5 py-1 text-center font-mono text-sm text-white focus:outline-hidden focus:border-[#7c3aed]"
                  />
                  <span className="text-xs text-zinc-400">min</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-zinc-400 mb-1">
                  Descanso (minutos)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={customBreak}
                    onChange={e => setCustomBreak(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-black border border-zinc-800 rounded-lg px-2.5 py-1 text-center font-mono text-sm text-white focus:outline-hidden focus:border-[#7c3aed]"
                  />
                  <span className="text-xs text-zinc-400">min</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-purple-950/40"
            >
              Guardar y Aplicar
            </button>
          </form>
        )}
      </div>

      {/* Footer Pro-Tip */}
      <div className="w-full max-w-xl mt-6 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
          <span>Suena un suave chime al llegar a 0:00 y sigue flotando al navegar tus notas</span>
        </span>
        <span className="font-mono text-zinc-600">LibreMath • IngeData Focus</span>
      </div>
    </div>
  );
};

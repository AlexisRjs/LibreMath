import { useEffect, useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
  onDismiss: () => void;
  isVisible: boolean;
}

export function WelcomeBanner({ userName, onDismiss, isVisible }: WelcomeBannerProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    setProgress(100);
    const duration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  const displayName = userName.trim() ? userName.trim() : 'Estudiante';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300 ease-out"
    >
      <div className="relative overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-3 shadow-xl shadow-black/60 text-white flex items-center gap-3">
        {/* Subtle Accent Indicator */}
        <div className="shrink-0 w-8 h-8 rounded-md bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa]">
          <BookOpen className="w-4 h-4" />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs sm:text-sm text-zinc-100 font-medium tracking-tight truncate">
            Hola <span className="font-semibold text-white">{displayName}</span>, ¿Listo para tu sesión de estudio?
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          title="Cerrar notificación"
          aria-label="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 1px Timing Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900">
          <div
            className="h-full bg-[#7c3aed] transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

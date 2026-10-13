import { useState, useEffect } from 'react';
import {
  X,
  User,
  Info,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSaveUserName: (name: string) => void;
  onTriggerWelcomeAnimation: (customName?: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  userName,
  onSaveUserName,
  onTriggerWelcomeAnimation,
}: SettingsModalProps) {
  const [localName, setLocalName] = useState(userName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setLocalName(userName);
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveUserName(localName.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestWelcome = () => {
    const effectiveName = localName.trim() || userName;
    onSaveUserName(effectiveName);
    onTriggerWelcomeAnimation(effectiveName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Ajustes del Estudiante</h2>
              <p className="text-[11px] text-zinc-400">Personaliza tu perfil y saludo en LibreMath</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-6">
          {/* Nombre de Usuario */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-medium text-zinc-200">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#a78bfa]" />
                Nombre del Estudiante (Usuario)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Visible en saludos</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                placeholder="Ej. Alexis Fernando"
                maxLength={40}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                }}
              />
              {savedSuccess && (
                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-xs text-emerald-400 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardado</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              Al entrar a LibreMath se te mostrará una animación personalizada con tu nombre.
            </p>
            <button
              type="button"
              onClick={handleTestWelcome}
              className="mt-1 text-xs text-[#a78bfa] hover:text-violet-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span>Probar saludo de bienvenida ahora</span> &rarr;
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950/40">
          <span className="text-[10px] text-zinc-500">LibreMath v1.0.0</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-violet-900/30 transition-all cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

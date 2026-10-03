import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Palette, BookOpen } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string, color?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose') => void;
}

const COLOR_OPTIONS: { id: 'violet' | 'cyan' | 'emerald' | 'amber' | 'blue' | 'rose'; name: string; bg: string; border: string }[] = [
  { id: 'violet', name: 'Violeta', bg: 'bg-violet-600', border: 'border-violet-400' },
  { id: 'cyan', name: 'Cian', bg: 'bg-cyan-600', border: 'border-cyan-400' },
  { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-600', border: 'border-emerald-400' },
  { id: 'amber', name: 'Ámbar', bg: 'bg-amber-600', border: 'border-amber-400' },
  { id: 'rose', name: 'Rosa', bg: 'bg-rose-600', border: 'border-rose-400' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-600', border: 'border-blue-400' },
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose'>('violet');
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setSelectedColor('violet');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = folderName.trim();
    if (!cleanName) {
      setError('Por favor escribe un nombre para la nueva materia / carpeta.');
      return;
    }

    onCreateFolder(cleanName, selectedColor);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0e0e12] border border-zinc-800 rounded-2xl shadow-2xl shadow-purple-950/25 overflow-hidden flex flex-col text-white text-xs animate-modal-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-black border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa]">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Nueva Materia / Carpeta Raíz
              </h2>
              <p className="text-[11px] text-zinc-400">
                Agrega una nueva materia a tu bóveda para organizar tus notas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Folder / Subject Name */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Nombre de la Materia / Carpeta</span>
            </label>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={e => setFolderName(e.target.value)}
              placeholder="Ej: Química General, Sistemas Operativos, Arquitectura..."
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs"
            />
            <span className="inline-block mt-1 text-[10px] text-zinc-500">
              Se creará como una materia independiente en tu barra lateral y en el grafo.
            </span>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Color en el Grafo y Etiquetas</span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {COLOR_OPTIONS.map(c => {
                const isSelected = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#7c3aed] bg-[#7c3aed]/20 text-white font-medium shadow-xs'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Crear Materia</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

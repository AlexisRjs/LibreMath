import React, { useState, useEffect } from 'react';
import { ModuleManifest } from '../types/modules';
import { X, FilePlus, Sparkles, Folder, Tag, Layers, AlignLeft } from 'lucide-react';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifests: ModuleManifest[];
  defaultModuleId?: string;
  onCreateNote: (noteData: {
    moduleId: string;
    title: string;
    slug: string;
    unit: string;
    tags: string[];
    description: string;
  }) => Promise<void> | void;
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({
  isOpen,
  onClose,
  manifests,
  defaultModuleId,
  onCreateNote,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>(
    defaultModuleId || manifests[0]?.id || 'algebra'
  );
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [unit, setUnit] = useState('Apuntes y Anotaciones');
  const [tagsInput, setTagsInput] = useState('apuntes, notas');
  const [description, setDescription] = useState('Anotaciones y apuntes de estudio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selectedModule when defaultModuleId changes
  useEffect(() => {
    if (defaultModuleId) {
      setSelectedModule(defaultModuleId);
    }
  }, [defaultModuleId]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSlug('');
      setUnit('Apuntes y Anotaciones');
      setTagsInput('apuntes, notas');
      setDescription('Anotaciones y apuntes de estudio');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric to hyphens
      .replace(/^-+|-+$/g, ''); // trim hyphens
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor ingresa un título para la nota.');
      return;
    }
    if (!slug.trim()) {
      setError('Por favor especifica un nombre de archivo válido.');
      return;
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-');

    const tagsList = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateNote({
        moduleId: selectedModule,
        title: title.trim(),
        slug: cleanSlug,
        unit: unit.trim() || 'Apuntes y Anotaciones',
        tags: tagsList.length > 0 ? tagsList : ['apuntes'],
        description: description.trim() || 'Anotaciones personales',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la nota');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeManifest = manifests.find(m => m.id === selectedModule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161224] border border-purple-900/50 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-200 text-xs"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1b152d] border-b border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Nueva Nota Markdown
              </h2>
              <p className="text-[11px] text-purple-300/70">
                Se indexará automáticamente en el grafo de la materia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Module / Subject Selector */}
          <div>
            <label className="block text-[11px] font-medium text-purple-200/90 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-purple-400" />
              <span>Materia / Asignatura de Destino</span>
            </label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full bg-[#1e1733] border border-purple-900/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-hidden focus:border-purple-500 transition-colors text-xs cursor-pointer"
            >
              {manifests.map(m => (
                <option key={m.id} value={m.id} className="bg-[#1b152d]">
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
            {activeManifest && (
              <span className="inline-block mt-1 text-[10px] text-purple-400/80 font-mono">
                Carpeta física: /modules/{activeManifest.id}/
              </span>
            )}
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-[11px] font-medium text-purple-200/90 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
              <span>Título de la Nota</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Ej: Teorema de Gauss y Aplicaciones"
              className="w-full bg-[#1e1733] border border-purple-900/60 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors text-xs"
            />
          </div>

          {/* File Slug */}
          <div>
            <label className="block text-[11px] font-medium text-purple-200/90 mb-1.5 flex items-center gap-1.5">
              <span className="font-mono text-purple-400 text-xs">#</span>
              <span>Nombre de archivo (.md)</span>
            </label>
            <div className="flex items-center bg-[#1e1733] border border-purple-900/60 rounded-lg overflow-hidden focus-within:border-purple-500">
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="teorema-de-gauss"
                className="w-full bg-transparent px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-hidden text-xs font-mono"
              />
              <span className="px-2.5 py-2 text-[11px] text-purple-400/80 font-mono bg-purple-950/40 border-l border-purple-900/40">
                .md
              </span>
            </div>
          </div>

          {/* Unit / Unidad */}
          <div>
            <label className="block text-[11px] font-medium text-purple-200/90 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Unidad temática / Categoría</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="Ej: Electrostática o Apuntes Personales"
              className="w-full bg-[#1e1733] border border-purple-900/60 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors text-xs"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-purple-200/90 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              <span>Etiquetas (separadas por coma)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="apuntes, formulas, teoria"
              className="w-full bg-[#1e1733] border border-purple-900/60 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-purple-900/40 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-lg border border-purple-900/40 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !slug.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-md shadow-purple-950/50 disabled:opacity-50 transition-all text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creando nota...' : 'Crear e Indexar Nota'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

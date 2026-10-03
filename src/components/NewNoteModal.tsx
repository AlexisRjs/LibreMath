import React, { useState, useEffect } from 'react';
import { ModuleManifest, UserFolder, Topic, TopicSummary } from '../types/modules';
import { X, FilePlus, Sparkles, Folder, Tag, Layers, AlignLeft, FolderPlus } from 'lucide-react';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifests: ModuleManifest[];
  defaultModuleId?: string;
  defaultFolder?: string;
  availableFolders?: string[];
  allFolders?: UserFolder[];
  allTopics?: (Topic | TopicSummary)[];
  onCreateNote: (noteData: {
    moduleId: string;
    title: string;
    slug: string;
    unit: string;
    tags: string[];
    description: string;
    folder?: string;
  }) => Promise<void> | void;
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({
  isOpen,
  onClose,
  manifests,
  defaultModuleId,
  defaultFolder,
  availableFolders = [],
  allFolders = [],
  allTopics = [],
  onCreateNote,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>(
    defaultModuleId || manifests[0]?.id || 'algebra'
  );
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [unit, setUnit] = useState('Apuntes y Anotaciones');
  const [folder, setFolder] = useState<string>(defaultFolder || '');
  const [isCustomFolder, setIsCustomFolder] = useState(false);
  const [customFolderName, setCustomFolderName] = useState('');
  const [tagsInput, setTagsInput] = useState('apuntes, notas');
  const [description, setDescription] = useState('Anotaciones y apuntes de estudio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute available folders dynamically based on currently selected module
  const computedAvailableFolders = React.useMemo(() => {
    if (allFolders.length > 0 || allTopics.length > 0) {
      const fromStored = allFolders
        .filter(f => f.moduleId === selectedModule)
        .map(f => f.name);
      const fromTopics = allTopics
        .filter(t => t.moduleId === selectedModule && t.folder)
        .map(t => t.folder as string);
      return Array.from(new Set([...fromStored, ...fromTopics]));
    }
    return availableFolders;
  }, [allFolders, allTopics, selectedModule, availableFolders]);

  // Sync selectedModule when defaultModuleId changes
  useEffect(() => {
    if (defaultModuleId) {
      setSelectedModule(defaultModuleId);
    }
  }, [defaultModuleId]);

  // Sync defaultFolder
  useEffect(() => {
    if (defaultFolder) {
      setFolder(defaultFolder);
      setIsCustomFolder(false);
    }
  }, [defaultFolder]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSlug('');
      setUnit('Apuntes y Anotaciones');
      setFolder(defaultFolder || '');
      setIsCustomFolder(false);
      setCustomFolderName('');
      setTagsInput('apuntes, notas');
      setDescription('Anotaciones y apuntes de estudio');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, defaultFolder]);

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

    const finalFolder = isCustomFolder ? customFolderName.trim() : folder.trim();

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateNote({
        moduleId: selectedModule,
        title: title.trim(),
        slug: cleanSlug,
        unit: unit.trim() || 'Apuntes y Anotaciones',
        folder: finalFolder || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#0e0e12] border border-zinc-800 rounded-2xl shadow-2xl shadow-purple-950/25 overflow-hidden flex flex-col text-white text-xs animate-modal-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-black border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa]">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Nueva Nota Markdown
              </h2>
              <p className="text-[11px] text-zinc-400">
                Se indexará automáticamente en el grafo de la materia
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

          {/* Module / Subject Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Materia / Asignatura de Destino</span>
            </label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs cursor-pointer"
            >
              {manifests.map(m => (
                <option key={m.id} value={m.id} className="bg-[#0e0e12]">
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
            {activeManifest && (
              <span className="inline-block mt-1 text-[10px] text-zinc-400 font-mono">
                Carpeta física: <span className="text-[#a78bfa]">/modules/{activeManifest.id}/</span>
              </span>
            )}
          </div>

          {/* Destination Folder Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>Carpeta de Destino (Opcional)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomFolder(prev => !prev)}
                className="text-[10px] text-[#a78bfa] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3 h-3" />
                <span>{isCustomFolder ? 'Elegir existente' : '+ Nueva carpeta'}</span>
              </button>
            </div>

            {isCustomFolder ? (
              <input
                type="text"
                value={customFolderName}
                onChange={e => setCustomFolderName(e.target.value)}
                placeholder="Nombre de la nueva carpeta dentro de esta materia..."
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs"
              />
            ) : (
              <select
                value={folder}
                onChange={e => setFolder(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs cursor-pointer"
              >
                <option value="">(Raíz de la materia / Sin carpeta)</option>
                {computedAvailableFolders.map(f => (
                  <option key={f} value={f} className="bg-[#0e0e12]">
                    📁 {f}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Note Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Título de la Nota</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Ej: Teorema de Gauss y Aplicaciones"
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs"
            />
          </div>

          {/* File Slug */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <span className="font-mono text-[#a78bfa] text-xs">#</span>
              <span>Nombre de archivo (.md)</span>
            </label>
            <div className="flex items-center bg-black border border-zinc-800 rounded-lg overflow-hidden focus-within:border-[#7c3aed]">
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="teorema-de-gauss"
                className="w-full bg-transparent px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden text-xs font-mono"
              />
              <span className="px-2.5 py-2 text-[11px] text-zinc-400 font-mono bg-zinc-900 border-l border-zinc-800">
                .md
              </span>
            </div>
          </div>

          {/* Unit / Unidad */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Unidad temática / Categoría</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="Ej: Electrostática o Apuntes Personales"
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Etiquetas (separadas por coma)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="apuntes, formulas, teoria"
              className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#7c3aed] transition-colors text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !slug.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#8b5cf6] text-white font-semibold shadow-xs disabled:opacity-50 transition-all text-xs cursor-pointer"
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

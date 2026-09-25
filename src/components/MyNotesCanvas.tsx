import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, ModuleManifest } from '../types/modules';
import { saveTopicFile, createTopicFile, deleteTopicFile } from '../services/desktopBridge';
import { exportTopicToPdf } from '../services/pdfExporter';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  FileText,
  Plus,
  Check,
  Sparkles,
  Heading1,
  Heading2,
  Heading3,
  Underline,
  Strikethrough,
  Code,
  Sigma,
  Eye,
  Columns,
  PenTool,
  Trash2,
  MoreHorizontal,
  FileDown,
  Copy,
} from 'lucide-react';

interface MyNotesCanvasProps {
  manifests: ModuleManifest[];
  allTopics: Topic[];
  initialTopic?: Topic | null;
  onTopicCreated?: () => void;
  onTopicSelect?: (topic: Topic) => void;
  onDeleteNote?: (topic: Topic) => void;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

export const MyNotesCanvas: React.FC<MyNotesCanvasProps> = ({
  manifests,
  allTopics,
  initialTopic,
  onTopicCreated,
  onTopicSelect,
  onDeleteNote,
}) => {
  // Filter all user notes
  const userNotes = allTopics.filter(t => t.isUserNote);

  // Active note state
  const [activeNote, setActiveNote] = useState<Topic>(() => {
    if (initialTopic && initialTopic.isUserNote) return initialTopic;
    if (userNotes.length > 0) return userNotes[0];
    // Default fallback note
    return {
      slug: 'mis-apuntes-generales',
      moduleId: manifests[0]?.id || 'algebra',
      moduleName: manifests[0]?.name || 'Álgebra',
      title: 'Mis Apuntes y Fórmulas',
      unit: 'Apuntes Personales',
      order: 100,
      tags: ['apuntes', 'notas'],
      description: 'Lienzo para escribir notas, fórmulas y apuntes rápidos',
      variables: [],
      formulas: [],
      content: `# Mis Apuntes y Fórmulas\n\nHaz clic derecho en cualquier parte de este lienzo para aplicar formatos:\n- Subrayado\n- Fórmulas matemáticas\n- Rayado (tachado)\n- Código de programación\n- Título 1, 2, 3 o texto común\n\n$$\n\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)\n$$\n\nPuedes escribir directamente aquí sin cambiar entre modo lectura y escritura.\n`,
      isUserNote: true,
    };
  });

  const [noteTitle, setNoteTitle] = useState(activeNote.title);
  const [content, setContent] = useState(activeNote.content);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [viewLayout, setViewLayout] = useState<'canvas-only' | 'split'>('canvas-only');
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when active note changes
  useEffect(() => {
    setNoteTitle(activeNote.title);
    setContent(activeNote.content);
    setSaveStatus('saved');
  }, [activeNote.slug, activeNote.moduleId]);

  // Debounced auto-save directly to disk & localStorage
  const triggerAutoSave = useCallback(
    (newTitle: string, newBody: string) => {
      setSaveStatus('unsaved');
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        setSaveStatus('saving');
        try {
          const yamlTags = (activeNote.tags || ['apuntes'])
            .map(t => `"${t}"`)
            .join(', ');
          const rawMarkdown = `---\ntitle: "${newTitle.replace(/"/g, '\\"')}"\nunit: "${activeNote.unit}"\norder: ${activeNote.order}\ndescription: "${activeNote.description}"\ntags: [${yamlTags}]\nformulas: []\nvariables: []\n---\n\n${newBody}`;

          await saveTopicFile(activeNote.moduleId, activeNote.slug, rawMarkdown);
          setSaveStatus('saved');
        } catch (e) {
          console.error('Error saving note:', e);
          setSaveStatus('unsaved');
        }
      }, 700);
    },
    [activeNote]
  );

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutoSave(noteTitle, val);
  };

  const handleTitleChange = (val: string) => {
    setNoteTitle(val);
    triggerAutoSave(val, content);
  };

  // Create a brand new note directly
  const handleCreateNewNote = async () => {
    const slug = `nota-${Date.now()}`;
    const targetModule = manifests[0]?.id || 'algebra';
    const newTitle = 'Nueva Nota';
    const initialBody = `# ${newTitle}\n\nComienza a escribir directamente aquí...\n`;

    const res = await createTopicFile({
      moduleId: targetModule,
      slug,
      title: newTitle,
      initialContent: initialBody,
    });

    if (res.success && res.topic) {
      setActiveNote(res.topic);
      onTopicCreated?.();
    }
  };

  const handleExportPdf = () => {
    setIsOptionsMenuOpen(false);
    exportTopicToPdf({
      title: noteTitle,
      unit: activeNote.unit || 'Mis Notas',
      moduleName: 'LibreMath - Mis Notas',
      markdownContent: content,
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 1500);
    setIsOptionsMenuOpen(false);
  };

  const handleDeleteNote = async (noteToDelete: Topic, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la nota "${noteToDelete.title}" definitivamente?`
      )
    ) {
      await deleteTopicFile(noteToDelete.moduleId, noteToDelete.slug);
      onDeleteNote?.(noteToDelete);
      onTopicCreated?.();
      const remaining = userNotes.filter(n => n.slug !== noteToDelete.slug);
      if (activeNote.slug === noteToDelete.slug) {
        if (remaining.length > 0) {
          setActiveNote(remaining[0]);
        } else {
          handleCreateNewNote();
        }
      }
    }
  };

  // Right-click context menu handler
  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 240);
    const y = Math.min(e.clientY, window.innerHeight - 340);
    setContextMenu({ x, y });
  };

  // Close context menu on outside click or escape
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Format insertion actions (underline, math, strike, code, headings, common text)
  const applyFormat = (formatType: 'underline' | 'math' | 'strike' | 'code' | 'h1' | 'h2' | 'h3' | 'common') => {
    setContextMenu(null);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (formatType) {
      case 'underline':
        if (selectedText) {
          replacement = `<u>${selectedText}</u>`;
          cursorOffset = replacement.length;
        } else {
          replacement = `<u>texto subrayado</u>`;
          cursorOffset = 3; // inside tag
        }
        break;

      case 'math':
        if (selectedText) {
          replacement = `$$\n${selectedText}\n$$`;
          cursorOffset = replacement.length;
        } else {
          replacement = `$$\n\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)\n$$`;
          cursorOffset = replacement.length;
        }
        break;

      case 'strike':
        if (selectedText) {
          replacement = `~~${selectedText}~~`;
          cursorOffset = replacement.length;
        } else {
          replacement = `~~texto rayado~~`;
          cursorOffset = 2;
        }
        break;

      case 'code':
        if (selectedText) {
          replacement = `\`\`\`python\n${selectedText}\n\`\`\``;
          cursorOffset = replacement.length;
        } else {
          replacement = `\`\`\`python\n# Código de programación\ndef calcular(x):\n    return x ** 2\n\`\`\``;
          cursorOffset = replacement.length;
        }
        break;

      case 'h1': {
        // Find beginning of current line
        const before = content.substring(0, start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineEnd = content.indexOf('\n', start);
        const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;
        const currentLine = content.substring(lineStart, actualLineEnd);
        const cleanLine = currentLine.replace(/^#+\s*/, '');
        const updatedContent = content.substring(0, lineStart) + `# ${cleanLine}` + content.substring(actualLineEnd);
        setContent(updatedContent);
        triggerAutoSave(noteTitle, updatedContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(lineStart + 2 + cleanLine.length, lineStart + 2 + cleanLine.length);
        }, 10);
        return;
      }

      case 'h2': {
        const before = content.substring(0, start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineEnd = content.indexOf('\n', start);
        const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;
        const currentLine = content.substring(lineStart, actualLineEnd);
        const cleanLine = currentLine.replace(/^#+\s*/, '');
        const updatedContent = content.substring(0, lineStart) + `## ${cleanLine}` + content.substring(actualLineEnd);
        setContent(updatedContent);
        triggerAutoSave(noteTitle, updatedContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(lineStart + 3 + cleanLine.length, lineStart + 3 + cleanLine.length);
        }, 10);
        return;
      }

      case 'h3': {
        const before = content.substring(0, start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineEnd = content.indexOf('\n', start);
        const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;
        const currentLine = content.substring(lineStart, actualLineEnd);
        const cleanLine = currentLine.replace(/^#+\s*/, '');
        const updatedContent = content.substring(0, lineStart) + `### ${cleanLine}` + content.substring(actualLineEnd);
        setContent(updatedContent);
        triggerAutoSave(noteTitle, updatedContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(lineStart + 4 + cleanLine.length, lineStart + 4 + cleanLine.length);
        }, 10);
        return;
      }

      case 'common': {
        // Strip markdown headings on the current line
        const before = content.substring(0, start);
        const lineStart = before.lastIndexOf('\n') + 1;
        const lineEnd = content.indexOf('\n', start);
        const actualLineEnd = lineEnd === -1 ? content.length : lineEnd;
        const currentLine = content.substring(lineStart, actualLineEnd);
        const cleanLine = currentLine.replace(/^#+\s*/, '');
        const updatedContent = content.substring(0, lineStart) + cleanLine + content.substring(actualLineEnd);
        setContent(updatedContent);
        triggerAutoSave(noteTitle, updatedContent);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(lineStart + cleanLine.length, lineStart + cleanLine.length);
        }, 10);
        return;
      }
    }

    const updated = content.substring(0, start) + replacement + content.substring(end);
    setContent(updated);
    triggerAutoSave(noteTitle, updated);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 10);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerAutoSave(noteTitle, content);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [noteTitle, content, triggerAutoSave]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  return (
    <div className="flex h-full w-full bg-[#14101e] text-slate-200 select-none overflow-hidden font-sans">
      {/* 1. Left Drawer: Notes List */}
      <aside className="w-56 h-full bg-[#110d19] border-r border-purple-950/60 flex flex-col shrink-0 select-none">
        {/* Header */}
        <div className="p-3 border-b border-purple-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-xs">
            <PenTool className="w-3.5 h-3.5 text-purple-400" />
            <span>Mis Notas</span>
          </div>

          <button
            onClick={handleCreateNewNote}
            className="p-1 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-colors text-xs flex items-center gap-1"
            title="Crear nueva nota en blanco"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px]">Nueva</span>
          </button>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {userNotes.length === 0 ? (
            <div className="p-4 text-center text-[#777777] text-xs font-sans">
              No tienes notas aún. Haz clic en "Nueva" para comenzar.
            </div>
          ) : (
            userNotes.map(note => {
              const isSelected = activeNote.slug === note.slug;
              return (
                <div
                  key={note.slug}
                  className="flex items-center group/note rounded-lg transition-colors pr-1"
                >
                  <button
                    onClick={() => {
                      setActiveNote(note);
                      onTopicSelect?.(note);
                    }}
                    className={`flex-1 text-left p-2 rounded-lg text-xs transition-colors flex items-center gap-2 min-w-0 ${
                      isSelected
                        ? 'bg-purple-950/90 text-white font-medium border border-purple-800/60 shadow-md shadow-purple-950/50'
                        : 'text-slate-400 hover:bg-[#1a1426] hover:text-slate-200'
                    }`}
                  >
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-[#666666]'}`} />
                    <span className="truncate flex-1">{note.title}</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteNote(note, e)}
                    className="p-1 rounded text-purple-400/50 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover/note:opacity-100 transition-all shrink-0 ml-1"
                    title="Eliminar esta nota definitivamente"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2 border-t border-purple-950/60 text-[10px] text-[#777777] text-center font-mono">
          {userNotes.length} notas personales
        </div>
      </aside>

      {/* 2. Main Writing Canvas Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#161122]">
        {/* Top Header Bar */}
        <div className="px-6 py-2.5 bg-[#171224] border-b border-purple-950/50 flex items-center justify-between shrink-0">
          {/* Note Title Input Directly on Canvas */}
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
            <span className="text-purple-400 text-sm font-mono font-bold">#</span>
            <input
              type="text"
              value={noteTitle}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Título del apunte..."
              className="bg-transparent border-b border-transparent hover:border-purple-800/40 focus:border-purple-500 text-base sm:text-lg font-bold text-white outline-none w-full transition-colors select-text"
            />
          </div>

          {/* Quick Controls & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Save Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/50 border border-purple-900/40 text-[11px] font-mono">
              {saveStatus === 'saved' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400/90">Guardado auto</span>
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <Sparkles className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-purple-300">Guardando...</span>
                </>
              ) : (
                <span className="text-amber-400">Sin guardar</span>
              )}
            </div>

            {/* Split Preview Toggle */}
            <button
              onClick={() => setViewLayout(prev => (prev === 'canvas-only' ? 'split' : 'canvas-only'))}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                viewLayout === 'split'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-[#1b152d] border-purple-900/40 text-slate-300 hover:text-white'
              }`}
              title={viewLayout === 'split' ? 'Ocultar vista previa dividida' : 'Ver pantalla dividida con KaTeX'}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Dividir</span>
            </button>

            {/* 3-Dots Options Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOptionsMenuOpen(prev => !prev)}
                className="p-1.5 rounded-lg border border-purple-900/40 bg-[#1b152d] text-slate-300 hover:text-white transition-colors"
                title="Más opciones"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isOptionsMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#181324] border border-purple-800/50 rounded-lg shadow-xl shadow-black/60 py-1 z-50 text-xs text-slate-200 font-sans">
                  <button
                    onClick={handleExportPdf}
                    className="w-full px-3 py-1.5 hover:bg-purple-900/50 flex items-center gap-2 text-left transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-purple-400" />
                    <span>Exportar como PDF</span>
                  </button>
                  <button
                    onClick={handleCopyMarkdown}
                    className="w-full px-3 py-1.5 hover:bg-purple-900/50 flex items-center gap-2 text-left transition-colors"
                  >
                    {copiedMarkdown ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{copiedMarkdown ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                  <div className="h-[1px] bg-purple-950/60 my-1" />
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDeleteNote(activeNote);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-rose-950/60 flex items-center gap-2 text-left text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar nota</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Format Ribbon */}
        <div className="px-6 py-1.5 bg-[#140e21] border-b border-purple-950/40 flex items-center gap-1 overflow-x-auto text-xs text-slate-300">
          <span className="text-[10px] font-mono text-purple-400/80 mr-1 shrink-0">Click derecho o atajos:</span>

          <button
            onClick={() => applyFormat('h1')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0 font-medium"
            title="Formatear como Título 1"
          >
            <Heading1 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">T1</span>
          </button>
          <button
            onClick={() => applyFormat('h2')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0 font-medium"
            title="Formatear como Título 2"
          >
            <Heading2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">T2</span>
          </button>
          <button
            onClick={() => applyFormat('h3')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0 font-medium"
            title="Formatear como Título 3"
          >
            <Heading3 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">T3</span>
          </button>

          <span className="text-purple-900 mx-1">|</span>

          <button
            onClick={() => applyFormat('underline')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0"
            title="Subrayar texto (<u>...</u>)"
          >
            <Underline className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">Subrayado</span>
          </button>
          <button
            onClick={() => applyFormat('math')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0"
            title="Insertar bloque de fórmula matemática KaTeX"
          >
            <Sigma className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">Fórmula</span>
          </button>
          <button
            onClick={() => applyFormat('strike')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0"
            title="Rayar / Tachar texto (~~...~~)"
          >
            <Strikethrough className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">Rayado</span>
          </button>
          <button
            onClick={() => applyFormat('code')}
            className="px-2 py-0.5 rounded hover:bg-purple-900/50 hover:text-white flex items-center gap-1 shrink-0"
            title="Bloque de código de programación"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px]">Código</span>
          </button>
        </div>

        {/* 3. The Pure Writing Canvas */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Writing Canvas (Direct Textarea Canvas) */}
          <div className={`h-full flex flex-col ${viewLayout === 'split' ? 'w-1/2 border-r border-purple-950/60' : 'w-full'}`}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              onContextMenu={handleContextMenu}
              autoFocus
              placeholder="Escribe directamente aquí en tu lienzo... (Clic derecho para formatear)"
              className="flex-1 w-full h-full p-6 sm:p-8 bg-[#151020] text-slate-100 font-mono text-sm leading-relaxed outline-none resize-none placeholder:text-[#555555] selection:bg-purple-600/40 select-text"
            />
          </div>

          {/* Optional Split Live Preview Canvas */}
          {viewLayout === 'split' && (
            <div className="w-1/2 h-full overflow-y-auto p-6 sm:p-8 bg-[#171225] select-text">
              <div className="text-[11px] font-mono text-purple-400/80 uppercase tracking-wider mb-4 pb-2 border-b border-purple-900/40 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualización en tiempo real</span>
              </div>
              <div className="prose-obsidian max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          )}

          {/* 4. Sleek Right-Click Floating Context Menu */}
          {contextMenu && (
            <div
              style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
              onClick={e => e.stopPropagation()}
              className="fixed z-50 w-56 rounded-xl bg-[#160f25] border border-purple-800/70 shadow-2xl shadow-black/80 py-1.5 text-xs text-slate-200 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 select-none"
            >
              {/* Size Section */}
              <div className="px-3 py-1 text-[10px] font-mono text-purple-300/70 uppercase tracking-wider">
                Tamaño de Texto
              </div>
              <button
                onClick={() => applyFormat('h1')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading1 className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-sm">Título 1</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">#</span>
              </button>
              <button
                onClick={() => applyFormat('h2')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading2 className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-xs">Título 2</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">##</span>
              </button>
              <button
                onClick={() => applyFormat('h3')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs">Título 3</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">###</span>
              </button>
              <button
                onClick={() => applyFormat('common')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#888888]" />
                  <span>Texto común</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Normal</span>
              </button>

              <div className="h-[1px] bg-purple-900/40 my-1" />

              {/* Format Section */}
              <div className="px-3 py-1 text-[10px] font-mono text-purple-300/70 uppercase tracking-wider">
                Formato
              </div>
              <button
                onClick={() => applyFormat('underline')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Underline className="w-4 h-4 text-purple-400" />
                  <span className="underline">Subrayado</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400/80">&lt;u&gt;</span>
              </button>
              <button
                onClick={() => applyFormat('math')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sigma className="w-4 h-4 text-emerald-400" />
                  <span>Fórmula matemática</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">$$ LaTeX</span>
              </button>
              <button
                onClick={() => applyFormat('strike')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Strikethrough className="w-4 h-4 text-rose-400" />
                  <span className="line-through">Rayado</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400">~~texto~~</span>
              </button>
              <button
                onClick={() => applyFormat('code')}
                className="w-full text-left px-3 py-1.5 hover:bg-purple-900/50 flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Código de prog.</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">```code</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="h-6 px-6 bg-[#130f1e] border-t border-purple-950/50 flex items-center justify-between text-[11px] text-[#777777] font-mono">
          <div className="flex items-center gap-4">
            <span>{lineCount} líneas</span>
            <span>{wordCount} palabras</span>
            <span>{content.length} caracteres</span>
          </div>

          <div className="flex items-center gap-2 text-purple-400/80">
            <Sparkles className="w-3 h-3" />
            <span>Lienzo Activo LibreMath</span>
          </div>
        </div>
      </main>
    </div>
  );
};

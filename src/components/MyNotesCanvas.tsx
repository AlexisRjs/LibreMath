import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Topic, ModuleManifest } from '../types/modules';
import { saveTopicFile, createTopicFile, deleteTopicFile } from '../services/desktopBridge';
import { exportTopicToPdf } from '../services/pdfExporter';
import { MarkdownRenderer } from './MarkdownRenderer';
import { markdownToHtml, htmlToMarkdown } from '../services/htmlMarkdownConverter';
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
  Bold,
  Italic,
  Code,
  Sigma,
  Eye,
  Columns,
  PenTool,
  Trash2,
  MoreHorizontal,
  FileDown,
  Copy,
  Edit3,
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
  const [activeNote, setActiveNote] = useState<Topic | null>(() => {
    if (initialTopic && initialTopic.isUserNote) return initialTopic;
    if (userNotes.length > 0) return userNotes[0];
    return null;
  });

  const [noteTitle, setNoteTitle] = useState(activeNote?.title || '');
  const [content, setContent] = useState(activeNote?.content || '');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [editorMode, setEditorMode] = useState<'visual' | 'markdown'>('visual');
  const [viewLayout, setViewLayout] = useState<'canvas-only' | 'split'>('canvas-only');
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync activeNote with changes to initialTopic or userNotes
  useEffect(() => {
    if (initialTopic && initialTopic.isUserNote) {
      setActiveNote(initialTopic);
    } else if (!activeNote && userNotes.length > 0) {
      setActiveNote(userNotes[0]);
    } else if (activeNote && !userNotes.some(n => n.slug === activeNote.slug && n.moduleId === activeNote.moduleId)) {
      setActiveNote(userNotes.length > 0 ? userNotes[0] : null);
    }
  }, [initialTopic, userNotes]);

  // Sync when active note changes
  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setContent(activeNote.content);
      setSaveStatus('saved');

      // Populate visual editor with rendered HTML
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = markdownToHtml(activeNote.content);
      }
    } else {
      setNoteTitle('');
      setContent('');
      setSaveStatus('saved');
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = '';
      }
    }
  }, [activeNote?.slug, activeNote?.moduleId]);

  // Debounced auto-save directly to disk & localStorage
  const triggerAutoSave = useCallback(
    (newTitle: string, newBody: string) => {
      if (!activeNote) return;
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

  // Handle typing inside the visual WYSIWYG editor
  const handleVisualInput = () => {
    if (!visualEditorRef.current) return;
    const md = htmlToMarkdown(visualEditorRef.current);
    setContent(md);
    triggerAutoSave(noteTitle, md);
  };

  // Handle typing inside markdown raw textarea (if in markdown mode)
  const handleMarkdownTextareaChange = (val: string) => {
    setContent(val);
    triggerAutoSave(noteTitle, val);
  };

  const handleTitleChange = (val: string) => {
    setNoteTitle(val);
    triggerAutoSave(val, content);
  };

  // Switch between Visual (no markdown symbols) and Raw Markdown
  const handleSwitchMode = (mode: 'visual' | 'markdown') => {
    if (mode === editorMode) return;
    if (mode === 'visual') {
      // Sync markdown back into visual editor
      setEditorMode('visual');
      setTimeout(() => {
        if (visualEditorRef.current) {
          visualEditorRef.current.innerHTML = markdownToHtml(content);
        }
      }, 10);
    } else {
      // Sync from visual editor to markdown before switching
      if (visualEditorRef.current) {
        const md = htmlToMarkdown(visualEditorRef.current);
        setContent(md);
      }
      setEditorMode('markdown');
    }
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
    if (!activeNote) return;
    setIsOptionsMenuOpen(false);
    exportTopicToPdf({
      title: noteTitle,
      unit: activeNote.unit || 'Mis Notas',
      moduleName: 'Mis Notas',
      markdownContent: content,
      isUserNote: true,
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
      if (activeNote?.slug === noteToDelete.slug) {
        setActiveNote(remaining.length > 0 ? remaining[0] : null);
      }
    }
  };

  // Right-click context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 240);
    const y = Math.min(e.clientY, window.innerHeight - 380);
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

  // Format insertion actions (underline, math, strike, code, headings, bold, italic, common text)
  const applyFormat = (formatType: 'underline' | 'math' | 'strike' | 'bold' | 'italic' | 'code' | 'h1' | 'h2' | 'h3' | 'common') => {
    setContextMenu(null);

    if (editorMode === 'visual') {
      const visualEl = visualEditorRef.current;
      if (!visualEl) return;
      visualEl.focus();

      switch (formatType) {
        case 'h1':
          document.execCommand('formatBlock', false, '<h1>');
          break;
        case 'h2':
          document.execCommand('formatBlock', false, '<h2>');
          break;
        case 'h3':
          document.execCommand('formatBlock', false, '<h3>');
          break;
        case 'common':
          document.execCommand('formatBlock', false, '<p>');
          break;
        case 'underline':
          document.execCommand('underline');
          break;
        case 'strike':
          document.execCommand('strikeThrough');
          break;
        case 'bold':
          document.execCommand('bold');
          break;
        case 'italic':
          document.execCommand('italic');
          break;
        case 'code': {
          const selection = window.getSelection();
          if (selection && selection.toString()) {
            document.execCommand('insertHTML', false, `<code>${selection.toString()}</code>`);
          } else {
            document.execCommand('insertHTML', false, `<pre><code># Código\ndef calcular(x):\n    return x ** 2</code></pre><p><br></p>`);
          }
          break;
        }
        case 'math': {
          const selection = window.getSelection();
          const mathExpr = selection && selection.toString() ? selection.toString() : '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)';
          document.execCommand('insertHTML', false, `<p>$$\n${mathExpr}\n$$</p><p><br></p>`);
          break;
        }
      }

      handleVisualInput();
      return;
    }

    // Markdown textarea fallback format application
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (formatType) {
      case 'underline':
        replacement = selectedText ? `<u>${selectedText}</u>` : `<u>texto subrayado</u>`;
        cursorOffset = selectedText ? replacement.length : 3;
        break;
      case 'strike':
        replacement = selectedText ? `~~${selectedText}~~` : `~~texto rayado~~`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'bold':
        replacement = selectedText ? `**${selectedText}**` : `**texto en negrita**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = selectedText ? `*${selectedText}*` : `*texto en cursiva*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'math':
        replacement = selectedText ? `$$\n${selectedText}\n$$` : `$$\n\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)\n$$`;
        cursorOffset = replacement.length;
        break;
      case 'code':
        replacement = selectedText ? `\`\`\`python\n${selectedText}\n\`\`\`` : `\`\`\`python\n# Código\ndef calcular(x):\n    return x ** 2\n\`\`\``;
        cursorOffset = replacement.length;
        break;
      case 'h1': {
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

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    }, 10);
  };

  // Keyboard shortcut Ctrl+S, Ctrl+B, Ctrl+I, Ctrl+U
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 's') {
          e.preventDefault();
          triggerAutoSave(noteTitle, content);
        } else if (key === 'b' && editorMode === 'visual') {
          e.preventDefault();
          applyFormat('bold');
        } else if (key === 'i' && editorMode === 'visual') {
          e.preventDefault();
          applyFormat('italic');
        } else if (key === 'u' && editorMode === 'visual') {
          e.preventDefault();
          applyFormat('underline');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [noteTitle, content, editorMode, triggerAutoSave]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  return (
    <div className="flex h-full w-full bg-[#09090b] text-white select-none overflow-hidden font-sans">
      {/* 1. Left Drawer: Notes List */}
      <aside className="w-56 h-full bg-black border-r border-zinc-800 flex flex-col shrink-0 select-none">
        {/* Header */}
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
            <PenTool className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Mis Notas</span>
          </div>

          <button
            onClick={handleCreateNewNote}
            className="px-2 py-1 rounded-md bg-[#7c3aed] hover:bg-[#8b5cf6] text-white font-semibold transition-colors text-xs flex items-center gap-1 shadow-xs"
            title="Crear nueva nota en blanco"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[10px]">Nueva</span>
          </button>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {userNotes.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs font-sans">
              No tienes notas aún. Haz clic en &quot;Nueva&quot; para comenzar.
            </div>
          ) : (
            userNotes.map(note => {
              const isSelected = activeNote?.slug === note.slug;
              return (
                <div
                  key={note.slug}
                  className="flex items-center group/note rounded-md transition-colors pr-1"
                >
                  <button
                    onClick={() => {
                      setActiveNote(note);
                      onTopicSelect?.(note);
                    }}
                    className={`flex-1 text-left p-2 rounded-md text-xs transition-all flex items-center gap-2 min-w-0 ${
                      isSelected
                        ? 'bg-[#7c3aed]/15 text-white font-semibold border-l-2 border-[#7c3aed]'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                  >
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#a78bfa]' : 'text-zinc-600'}`} />
                    <span className="truncate flex-1">{note.title}</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteNote(note, e)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover/note:opacity-100 transition-all shrink-0 ml-1"
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
        <div className="p-2 border-t border-zinc-800 text-[10px] text-zinc-500 text-center font-mono">
          {userNotes.length} notas personales
        </div>
      </aside>

      {/* 2. Main Writing Canvas Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
        {!activeNote ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#09090b]">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-[#a78bfa] shadow-lg shadow-purple-950/20">
              <PenTool className="w-8 h-8" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-2 font-sans">
              No tienes notas personales todavía
            </h2>
            <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed font-sans">
              Crea tus propios apuntes con soporte de fórmulas LaTeX, resúmenes de cursada, bloques de código y exportación directa a PDF.
            </p>
            <button
              onClick={handleCreateNewNote}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] font-medium text-xs shadow-md transition-all cursor-pointer font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi primera nota</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top Header Bar */}
            <div className="px-6 py-2.5 bg-black border-b border-zinc-800 flex items-center justify-between shrink-0">
          {/* Note Title Input Directly on Canvas */}
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
            <span className="text-[#a78bfa] text-sm font-mono font-bold">#</span>
            <input
              type="text"
              value={noteTitle}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Título del apunte..."
              className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-[#7c3aed] text-base sm:text-lg font-bold text-white outline-none w-full transition-colors select-text placeholder:text-zinc-600"
            />
          </div>

          {/* Quick Controls & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Editor Mode Selector: Visual WYSIWYG vs Raw Markdown */}
            <div className="flex items-center bg-black border border-zinc-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => handleSwitchMode('visual')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  editorMode === 'visual'
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Modo visual en vivo (ves el formato aplicado sin símbolos markdown)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px]">Visual</span>
              </button>
              <button
                onClick={() => handleSwitchMode('markdown')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  editorMode === 'markdown'
                    ? 'bg-white text-black font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Modo código Markdown"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Markdown</span>
              </button>
            </div>

            {/* Save Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
              {saveStatus === 'saved' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Guardado</span>
                </>
              ) : saveStatus === 'saving' ? (
                <>
                  <Sparkles className="w-3 h-3 text-[#a78bfa] animate-spin" />
                  <span className="text-[#a78bfa]">Guardando...</span>
                </>
              ) : (
                <span className="text-amber-400">Sin guardar</span>
              )}
            </div>

            {/* Split Preview Toggle */}
            <button
              onClick={() => setViewLayout(prev => (prev === 'canvas-only' ? 'split' : 'canvas-only'))}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-xs ${
                viewLayout === 'split'
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white font-medium'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title={viewLayout === 'split' ? 'Ocultar vista previa dividida' : 'Ver pantalla dividida con vista previa'}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Dividir</span>
            </button>

            {/* 3-Dots Options Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOptionsMenuOpen(prev => !prev)}
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
                title="Más opciones"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isOptionsMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#0e0e12] border border-zinc-800 rounded-xl shadow-2xl shadow-black py-1 z-50 text-xs text-zinc-200 font-sans animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleExportPdf}
                    className="w-full px-3 py-2 hover:bg-zinc-800/80 flex items-center gap-2 text-left transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Exportar como PDF</span>
                  </button>
                  <button
                    onClick={handleCopyMarkdown}
                    className="w-full px-3 py-2 hover:bg-zinc-800/80 flex items-center gap-2 text-left transition-colors"
                  >
                    {copiedMarkdown ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>{copiedMarkdown ? '¡Copiado!' : 'Copiar Markdown'}</span>
                  </button>
                  <div className="h-[1px] bg-zinc-800 my-1" />
                  <button
                    onClick={() => {
                      setIsOptionsMenuOpen(false);
                      handleDeleteNote(activeNote);
                    }}
                    className="w-full px-3 py-2 hover:bg-rose-950/60 flex items-center gap-2 text-left text-rose-400 transition-colors"
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
        <div className="px-6 py-1.5 bg-[#0e0e12] border-b border-zinc-800 flex items-center gap-1 overflow-x-auto text-xs text-zinc-300">
          <span className="text-[10px] font-mono text-zinc-500 mr-1 shrink-0">
            {editorMode === 'visual' ? 'Formato:' : 'Markdown:'}
          </span>

          <button
            onClick={() => applyFormat('h1')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 font-medium transition-colors"
            title="Formatear como Título 1 (H1)"
          >
            <Heading1 className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="text-[11px]">T1</span>
          </button>
          <button
            onClick={() => applyFormat('h2')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 font-medium transition-colors"
            title="Formatear como Título 2 (H2)"
          >
            <Heading2 className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="text-[11px]">T2</span>
          </button>
          <button
            onClick={() => applyFormat('h3')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 font-medium transition-colors"
            title="Formatear como Título 3 (H3)"
          >
            <Heading3 className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="text-[11px]">T3</span>
          </button>

          <span className="text-zinc-700 mx-1">|</span>

          <button
            onClick={() => applyFormat('bold')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 font-bold transition-colors"
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px]">Negrita</span>
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 italic transition-colors"
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px]">Cursiva</span>
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
            title="Subrayar texto (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="text-[11px] underline">Subrayado</span>
          </button>
          <button
            onClick={() => applyFormat('strike')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
            title="Rayar / Tachar texto"
          >
            <Strikethrough className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] line-through">Rayado</span>
          </button>

          <span className="text-zinc-700 mx-1">|</span>

          <button
            onClick={() => applyFormat('math')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
            title="Insertar bloque de fórmula matemática KaTeX"
          >
            <Sigma className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Fórmula</span>
          </button>
          <button
            onClick={() => applyFormat('code')}
            className="px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white flex items-center gap-1 shrink-0 transition-colors"
            title="Bloque de código de programación"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Código</span>
          </button>
        </div>

        {/* 3. The Pure Writing Canvas */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Writing Canvas (Visual WYSIWYG or Markdown) */}
          <div className={`h-full flex flex-col ${viewLayout === 'split' ? 'w-1/2 border-r border-zinc-800' : 'w-full'}`}>
            {editorMode === 'visual' ? (
              <div
                ref={visualEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleVisualInput}
                onContextMenu={handleContextMenu}
                data-placeholder="Escribe directamente aquí tus apuntes... (El formato se ve aplicado en tiempo real)"
                className="visual-notes-editor flex-1 w-full h-full p-6 sm:p-8 bg-[#09090b] text-white outline-none overflow-y-auto leading-relaxed selection:bg-[#7c3aed]/40 select-text font-sans"
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => handleMarkdownTextareaChange(e.target.value)}
                onContextMenu={handleContextMenu}
                autoFocus
                placeholder="Escribe en formato Markdown aquí..."
                className="flex-1 w-full h-full p-6 sm:p-8 bg-[#09090b] text-white font-mono text-sm leading-relaxed outline-none resize-none placeholder:text-zinc-600 selection:bg-[#7c3aed]/40 select-text"
              />
            )}
          </div>

          {/* Optional Split Live Preview Canvas */}
          {viewLayout === 'split' && (
            <div className="w-1/2 h-full overflow-y-auto p-6 sm:p-8 bg-black/40 select-text">
              <div className="text-[11px] font-mono text-[#a78bfa] uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Previsualización en tiempo real</span>
              </div>
              <div className="prose-obsidian max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          )}

          {/* 4. Modern Flat Context Menu */}
          {contextMenu && (
            <div
              style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
              onClick={e => e.stopPropagation()}
              className="fixed z-50 w-56 rounded-xl bg-[#0e0e12] border border-zinc-800 shadow-2xl shadow-black py-1.5 text-xs text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 select-none"
            >
              {/* Size Section */}
              <div className="px-3 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Tamaño de Texto
              </div>
              <button
                onClick={() => applyFormat('h1')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading1 className="w-4 h-4 text-[#a78bfa]" />
                  <span className="font-semibold text-sm">Título 1</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Grande</span>
              </button>
              <button
                onClick={() => applyFormat('h2')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading2 className="w-4 h-4 text-[#a78bfa]" />
                  <span className="font-medium text-xs">Título 2</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Mediano</span>
              </button>
              <button
                onClick={() => applyFormat('h3')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heading3 className="w-4 h-4 text-[#a78bfa]" />
                  <span className="text-xs">Título 3</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Subsección</span>
              </button>
              <button
                onClick={() => applyFormat('common')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span>Texto común</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Normal</span>
              </button>

              <div className="h-[1px] bg-zinc-800 my-1" />

              {/* Format Section */}
              <div className="px-3 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Formato Aplicado
              </div>
              <button
                onClick={() => applyFormat('bold')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors font-bold"
              >
                <div className="flex items-center gap-2">
                  <Bold className="w-4 h-4 text-[#a78bfa]" />
                  <span>Negrita</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Ctrl+B</span>
              </button>
              <button
                onClick={() => applyFormat('italic')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors italic"
              >
                <div className="flex items-center gap-2">
                  <Italic className="w-4 h-4 text-[#a78bfa]" />
                  <span>Cursiva</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Ctrl+I</span>
              </button>
              <button
                onClick={() => applyFormat('underline')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/80 flex items-center justify-between text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Underline className="w-4 h-4 text-[#a78bfa]" />
                  <span className="underline">Subrayado</span>
                </div>
                <span className="text-[10px] font-mono text-[#a78bfa]">Ctrl+U</span>
              </button>
              <button
                onClick={() => applyFormat('strike')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Strikethrough className="w-4 h-4 text-rose-400" />
                  <span className="line-through">Rayado</span>
                </div>
                <span className="text-[10px] font-mono text-rose-400">Tachado</span>
              </button>
              <button
                onClick={() => applyFormat('math')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sigma className="w-4 h-4 text-emerald-400" />
                  <span>Fórmula matemática</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">KaTeX</span>
              </button>
              <button
                onClick={() => applyFormat('code')}
                className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 flex items-center justify-between text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Código de prog.</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Bloque</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="h-6 px-6 bg-black border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-4">
            <span>{lineCount} líneas</span>
            <span>{wordCount} palabras</span>
            <span>{content.length} caracteres</span>
            <span className="text-[#a78bfa]">
              Modo: {editorMode === 'visual' ? 'Visual en vivo' : 'Markdown'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#a78bfa]">
            <Sparkles className="w-3 h-3" />
            <span>Lienzo Activo IngeData</span>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

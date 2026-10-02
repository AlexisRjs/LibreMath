import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Topic } from '../types/modules';
import { saveTopicFile } from '../services/electronBridge';
import { Save, Check, Code, Sparkles } from 'lucide-react';

interface NoteEditorProps {
  topic: Topic;
  onClose?: () => void;
  onSaveSuccess?: (updatedContent: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  topic,
  onSaveSuccess,
}) => {
  // Reconstruct full markdown content (frontmatter + content)
  const initialContent = `---\ntitle: "${topic.title}"\nunit: "${topic.unit}"\norder: ${topic.order}\ndescription: "${topic.description}"\ntags: [${topic.tags.map(t => `"${t}"`).join(', ')}]\n---\n\n${topic.content}`;

  const [code, setCode] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');

  useEffect(() => {
    const freshContent = `---\ntitle: "${topic.title}"\nunit: "${topic.unit}"\norder: ${topic.order}\ndescription: "${topic.description}"\ntags: [${topic.tags.map(t => `"${t}"`).join(', ')}]\n---\n\n${topic.content}`;
    setCode(freshContent);
    setSavedStatus('saved');
  }, [topic.moduleId, topic.slug, topic.content]);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedStatus('saving');
    try {
      const res = await saveTopicFile(topic.moduleId, topic.slug, code);
      if (res.success) {
        setSavedStatus('saved');
        onSaveSuccess?.(code);
      } else {
        alert(`Error al guardar: ${res.error}`);
        setSavedStatus('unsaved');
      }
    } catch (e: any) {
      alert(`Error al guardar: ${e.message}`);
      setSavedStatus('unsaved');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInsertSnippet = (snippet: string) => {
    setCode(prev => prev + '\n' + snippet);
    setSavedStatus('unsaved');
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, topic.moduleId, topic.slug]);

  const wordCount = code.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-white font-semibold">
            <Code className="w-4 h-4 text-[#a78bfa]" />
            <span>{topic.moduleId}/{topic.slug}.md</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400 font-mono text-[11px]">CodeMirror 6</span>
        </div>

        {/* Snippet Insert Tools */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleInsertSnippet('$$\n\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)\n$$')}
            className="px-2.5 py-1 rounded-md bg-[#0e0e12] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-mono cursor-pointer"
            title="Insertar Bloque Matemático KaTeX"
          >
            $$ LaTeX $$
          </button>
          <button
            onClick={() => handleInsertSnippet('> [!NOTE]\n> Explicación o propiedad teórica relevante')}
            className="px-2.5 py-1 rounded-md bg-[#0e0e12] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-mono cursor-pointer"
            title="Insertar Callout Obsidian"
          >
            [!NOTE]
          </button>
          <button
            onClick={() => handleInsertSnippet('> [!TIP]\n> Consejo práctico o regla mnemotécnica')}
            className="px-2.5 py-1 rounded-md bg-[#0e0e12] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-mono cursor-pointer"
            title="Insertar Callout TIP"
          >
            [!TIP]
          </button>
          <button
            onClick={() => handleInsertSnippet('[[nombre-del-tema]]')}
            className="px-2.5 py-1 rounded-md bg-[#0e0e12] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors font-mono text-xs cursor-pointer"
            title="Insertar Wiki Link Obsidian"
          >
            [[Link]]
          </button>
        </div>

        {/* Save Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              savedStatus === 'saved'
                ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                : 'bg-[#7c3aed] hover:bg-[#8b5cf6] text-white shadow-xs'
            }`}
          >
            {savedStatus === 'saved' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guardado</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Guardar (Ctrl+S)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CodeMirror 6 Active Canvas */}
      <div className="flex-1 overflow-auto text-sm font-mono leading-relaxed p-1 bg-[#09090b]">
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[markdown()]}
          onChange={val => {
            setCode(val);
            setSavedStatus('unsaved');
          }}
          className="h-full codemirror-obsidian"
        />
      </div>

      {/* Status Bar at Bottom of Editor */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-black border-t border-zinc-800 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-4">
          <span>{lineCount} líneas</span>
          <span>{wordCount} palabras</span>
          <span>{code.length} caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-[#a78bfa]" />
          <span>IngeData Markdown Engine</span>
        </div>
      </div>
    </div>
  );
};

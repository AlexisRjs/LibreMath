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
    <div className="flex flex-col h-full bg-[#110d1a] text-slate-200 border border-purple-900/40 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Toolbar (Obsidian style) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161022] border-b border-purple-900/40 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-purple-300 font-medium">
            <Code className="w-4 h-4 text-purple-400" />
            <span>{topic.moduleId}/{topic.slug}.md</span>
          </div>
          <span className="text-purple-700">|</span>
          <span className="text-slate-400">CodeMirror 6</span>
        </div>

        {/* Snippet Insert Tools */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => handleInsertSnippet('$$\n\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)\n$$')}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-colors"
            title="Insertar Bloque Matemático KaTeX"
          >
            $$ LaTeX $$
          </button>
          <button
            onClick={() => handleInsertSnippet('> [!NOTE]\n> Explicación o propiedad teórica relevante')}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-colors"
            title="Insertar Callout Obsidian"
          >
            [!NOTE]
          </button>
          <button
            onClick={() => handleInsertSnippet('> [!TIP]\n> Consejo práctico o regla mnemotécnica')}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-colors"
            title="Insertar Callout TIP"
          >
            [!TIP]
          </button>
          <button
            onClick={() => handleInsertSnippet('[[nombre-del-tema]]')}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 transition-colors font-mono"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              savedStatus === 'saved'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
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
      <div className="flex-1 overflow-auto text-sm font-mono leading-relaxed p-1">
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

      {/* Obsidian Status Bar at Bottom of Editor */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#120c1c] border-t border-purple-900/30 text-[11px] text-purple-300/70 font-mono">
        <div className="flex items-center gap-4">
          <span>{lineCount} líneas</span>
          <span>{wordCount} palabras</span>
          <span>{code.length} caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Obsidian Live Engine</span>
        </div>
      </div>
    </div>
  );
};

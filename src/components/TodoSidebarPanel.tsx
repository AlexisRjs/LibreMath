import React, { useState, useMemo } from 'react';
import { TodoItem, TodoType, TodoPriority } from '../types/todo';
import { ModuleManifest } from '../types/modules';
import {
  Plus,
  Trash2,
  Calendar,
  Check,
  CheckSquare,
  X,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface TodoSidebarPanelProps {
  todos: TodoItem[];
  manifests: ModuleManifest[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoSidebarPanel: React.FC<TodoSidebarPanelProps> = ({
  todos,
  manifests,
  onToggleTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'examenes' | 'tps' | 'pendientes'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TodoType>('parcial');
  const [priority, setPriority] = useState<TodoPriority>('alta');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
  });
  const [moduleId, setModuleId] = useState<string>('am1');

  const pendingCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  );

  const filteredTodos = useMemo(() => {
    let list = [...todos];

    if (filter === 'pendientes') {
      list = list.filter(t => !t.completed);
    } else if (filter === 'examenes') {
      list = list.filter(t => t.type === 'parcial' || t.type === 'final');
    } else if (filter === 'tps') {
      list = list.filter(t => t.type === 'tp' || t.type === 'tarea');
    }

    // Sort: incomplete first, then by date ascending
    return list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [todos, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      type,
      priority,
      date,
      completed: false,
      moduleId,
    });

    setTitle('');
    setIsAdding(false);
  };

  // Helper for date formatting & relative days
  const formatDaysRemaining = (targetDateStr: string) => {
    if (!targetDateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Vencido (${Math.abs(diffDays)}d)`, isUrgent: true };
    }
    if (diffDays === 0) {
      return { text: '¡Hoy!', isUrgent: true };
    }
    if (diffDays === 1) {
      return { text: 'Mañana', isUrgent: true };
    }
    return { text: `en ${diffDays} días`, isUrgent: diffDays <= 3 };
  };

  // Type styling details
  const getTypeBadge = (t: TodoType) => {
    switch (t) {
      case 'parcial':
        return {
          label: 'Parcial',
          className: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
        };
      case 'final':
        return {
          label: 'Final',
          className: 'bg-purple-950/40 text-[#c084fc] border-[#7c3aed]/40',
        };
      case 'tp':
        return {
          label: 'TP',
          className: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
        };
      case 'tarea':
        return {
          label: 'Tarea',
          className: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
        };
    }
  };

  // Priority indicator (subtle color)
  const getPriorityStyle = (p: TodoPriority) => {
    switch (p) {
      case 'alta':
        return {
          borderClass: 'border-l-2 border-l-rose-500',
          dotClass: 'bg-rose-500 shadow-rose-500/50',
          label: 'Alta',
          textClass: 'text-rose-400',
        };
      case 'media':
        return {
          borderClass: 'border-l-2 border-l-amber-500',
          dotClass: 'bg-amber-500 shadow-amber-500/50',
          label: 'Media',
          textClass: 'text-amber-400',
        };
      case 'baja':
        return {
          borderClass: 'border-l-2 border-l-[#7c3aed]',
          dotClass: 'bg-[#7c3aed] shadow-purple-500/50',
          label: 'Baja',
          textClass: 'text-[#a78bfa]',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white select-none">
      {/* Top Header of the TO-DO panel */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-white">
            Agenda / TO-DO
          </span>
          {pendingCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-900 text-[#a78bfa] border border-[#7c3aed]/30 font-semibold">
              {pendingCount}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isAdding
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title={isAdding ? 'Cerrar formulario' : 'Añadir nueva fecha / examen'}
        >
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-2 py-1.5 border-b border-zinc-800/80 bg-[#0e0e12] flex items-center gap-1 overflow-x-auto text-[10px]">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
            filter === 'all'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          Todas ({todos.length})
        </button>
        <button
          onClick={() => setFilter('pendientes')}
          className={`px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
            filter === 'pendientes'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('examenes')}
          className={`px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
            filter === 'examenes'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          Exámenes
        </button>
        <button
          onClick={() => setFilter('tps')}
          className={`px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
            filter === 'tps'
              ? 'bg-white text-black font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          TPs / Tareas
        </button>
      </div>

      {/* Main List & Add Form Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 font-sans">
        {/* Inline Add Task Form */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#0e0e12] border border-zinc-800 rounded-xl space-y-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#a78bfa]" />
                Nueva Anotación
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Title Input */}
            <div>
              <input
                type="text"
                autoFocus
                placeholder="Ej: 1° Parcial Teórico..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-[#7c3aed]"
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-semibold">
                Categoría
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['parcial', 'final', 'tp', 'tarea'] as TodoType[]).map(t => {
                  const b = getTypeBadge(t);
                  const isSelected = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-1 text-[10px] font-medium rounded border text-center transition-all cursor-pointer ${
                        isSelected
                          ? `${b.className} font-bold ring-1 ring-[#7c3aed]`
                          : 'border-zinc-800 bg-black/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Importance / Priority Selector */}
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-semibold">
                Importancia / Prioridad
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['alta', 'media', 'baja'] as TodoPriority[]).map(p => {
                  const pStyle = getPriorityStyle(p);
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex items-center justify-center gap-1.5 py-1 text-[10px] rounded border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-700 bg-zinc-900 text-white font-bold ring-1 ring-white/20'
                          : 'border-zinc-800 bg-black/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dotClass}`} />
                      <span>{pStyle.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Module Selector in Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-zinc-400" />
                  <span>Fecha</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-hidden focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
                  <BookOpen className="w-2.5 h-2.5 text-zinc-400" />
                  <span>Materia</span>
                </label>
                <select
                  value={moduleId}
                  onChange={e => setModuleId(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-hidden focus:border-[#7c3aed] cursor-pointer"
                >
                  <option value="general">General</option>
                  {manifests.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#0e0e12]">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-[10px] rounded border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-3 py-1 text-[10px] rounded bg-[#7c3aed] hover:bg-[#8b5cf6] text-white font-semibold disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        )}

        {/* List of Tasks */}
        {filteredTodos.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-zinc-800/80 rounded-xl bg-[#0e0e12]/40 p-4">
            <CheckSquare className="w-7 h-7 mx-auto text-zinc-600" />
            <p className="text-xs font-semibold text-zinc-300">Sin tareas en esta vista</p>
            <p className="text-[11px] text-zinc-500 max-w-[200px] mx-auto">
              Presiona el botón <strong className="text-white">+</strong> para registrar tus parciales, finales y entregas.
            </p>
          </div>
        ) : (
          filteredTodos.map(item => {
            const typeBadge = getTypeBadge(item.type);
            const priorityStyle = getPriorityStyle(item.priority);
            const daysInfo = formatDaysRemaining(item.date);
            const moduleMatch = manifests.find(m => m.id === item.moduleId);

            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border border-zinc-800 bg-[#0e0e12] p-2.5 transition-all hover:border-zinc-700 shadow-xs ${
                  item.completed ? 'opacity-60 bg-black/40' : ''
                } ${priorityStyle.borderClass}`}
              >
                {/* Header Row: Category Badge + Priority Indicator + Delete Button */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${typeBadge.className}`}
                    >
                      {typeBadge.label}
                    </span>

                    {moduleMatch && (
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800">
                        {moduleMatch.id.toUpperCase()}
                      </span>
                    )}

                    <span
                      className={`text-[9px] font-medium flex items-center gap-1 ${priorityStyle.textClass}`}
                      title={`Prioridad: ${priorityStyle.label}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dotClass}`} />
                      <span>{priorityStyle.label}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteTodo(item.id)}
                    className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Body: Checkbox + Title */}
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => onToggleTodo(item.id)}
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                      item.completed
                        ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                        : 'border-zinc-700 bg-black hover:border-[#a78bfa]'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <span
                    onClick={() => onToggleTodo(item.id)}
                    className={`text-xs text-zinc-200 cursor-pointer select-text font-medium leading-tight flex-1 ${
                      item.completed ? 'line-through text-zinc-500' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Footer: Date & Countdown badge */}
                <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>{item.date}</span>
                  </div>

                  {daysInfo && (
                    <span
                      className={`flex items-center gap-0.5 ${
                        item.completed
                          ? 'text-zinc-600'
                          : daysInfo.isUrgent
                          ? 'text-rose-400 font-semibold'
                          : 'text-[#a78bfa]'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{daysInfo.text}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between bg-black">
        <span>IngeData Agenda</span>
        <span className="text-[#a78bfa]">
          {todos.filter(t => t.completed).length}/{todos.length} listas
        </span>
      </div>
    </div>
  );
};

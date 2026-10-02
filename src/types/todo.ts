export type TodoType = 'parcial' | 'final' | 'tp' | 'tarea';

export type TodoPriority = 'alta' | 'media' | 'baja';

export interface TodoItem {
  id: string;
  title: string;
  type: TodoType;
  priority: TodoPriority;
  date: string; // Formato YYYY-MM-DD
  completed: boolean;
  moduleId?: string; // e.g. 'am1', 'algebra', 'fisica-1', 'general'
  createdAt: number;
}

import { TodoItem } from '../types/todo';

const STORAGE_KEY = 'ingedata_todos';

export function getStoredTodos(): TodoItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Clean out previous mock seed data if present
    const cleaned = parsed.filter(t => !['todo-1', 'todo-2', 'todo-3', 'todo-4'].includes(t.id));
    if (cleaned.length !== parsed.length) {
      saveStoredTodos(cleaned);
    }
    return cleaned;
  } catch (err) {
    console.error('Error reading todos from storage:', err);
    return [];
  }
}

export function saveStoredTodos(todos: TodoItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Error saving todos to storage:', err);
  }
}

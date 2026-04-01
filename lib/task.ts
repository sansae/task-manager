export type TaskPriority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  text: string;
  createdAt: string; // ISO string
  completed: boolean;
  priority: TaskPriority;
  /** Optional due date as YYYY-MM-DD (from `<input type="date">`). */
  dueDate?: string | null;
};


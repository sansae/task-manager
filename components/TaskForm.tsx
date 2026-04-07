"use client";

import { useState } from "react";
import type { Task, TaskPriority } from "@/lib/task";

export default function TaskForm({
  onTaskCreated,
}: {
  onTaskCreated?: (task: Task) => void;
}) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const task: Task = {
        id: crypto.randomUUID(),
        text: trimmed,
        createdAt: new Date().toISOString(),
        completed: false,
        priority,
        dueDate: dueDate.trim() || null,
      };

      setText("");
      setDueDate("");
      setPriority("Medium");
      onTaskCreated?.(task);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
    >
      <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Add task
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          Due date (optional)
        </span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
          className="h-10 w-full max-w-xs rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 sm:w-auto"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          Priority
        </span>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          disabled={loading}
          className="h-10 w-full max-w-xs rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 sm:w-auto"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Write README"
          className="h-10 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:text-zinc-100"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="h-10 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-opacity disabled:opacity-50 dark:bg-zinc-100 dark:text-black hover:bg-blue-600 hover:text-white hover:cursor-pointer sm:w-auto"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </form>
  );
}


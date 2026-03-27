"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setError(null);
    try {
      const res = await fetch("/api/tasks", { method: "GET" });
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status}).`);
      const data = (await res.json()) as { tasks: Task[] };
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function deleteTask(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Delete failed (${res.status}).`);
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-6 font-sans dark:bg-black">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Task Manager
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Add tasks and keep track of what needs doing.
          </p>
        </header>

        <TaskForm
          onTaskCreated={(task) => {
            // Optimistic UI: add the new item to the top.
            setTasks((prev) => [task, ...prev]);
          }}
        />

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No tasks yet. Add one above.
          </p>
        ) : (
          <TaskList tasks={tasks} onDeleteTask={deleteTask} />
        )}
      </div>
    </div>
  );
}

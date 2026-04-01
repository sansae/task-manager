"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/lib/task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

type TaskFilter = "All" | "Active" | "Completed";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    let list =
      activeFilter === "Active"
        ? tasks.filter((t) => !t.completed)
        : activeFilter === "Completed"
          ? tasks.filter((t) => t.completed)
          : tasks;

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, activeFilter, searchQuery]);

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

  async function editTask(id: string, newText: string) {
    setError(null);
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Edit failed (${res.status}).`);
      }
      const data = (await res.json()) as { task: Task };
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }

  async function toggleComplete(id: string, completed: boolean) {
    setError(null);
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Update failed (${res.status}).`);
      }
      const data = (await res.json()) as { task: Task };
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-4 py-6 font-sans dark:bg-black sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
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
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="task-search" className="sr-only">
                Search tasks
              </label>
              <input
                id="task-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                autoComplete="off"
                className="min-w-[12rem] flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
              />
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                disabled={searchQuery.length === 0}
                aria-label="Clear search"
                className="shrink-0 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors enabled:hover:bg-zinc-100 enabled:hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 enabled:dark:hover:bg-zinc-900"
              >
                Clear
              </button>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter tasks"
            >
              {(
                [
                  { key: "All" as const, label: "All" },
                  { key: "Active" as const, label: "Active" },
                  { key: "Completed" as const, label: "Completed" },
                ] as const
              ).map(({ key, label }) => {
                const isSelected = activeFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveFilter(key)}
                    className={
                      isSelected
                        ? "rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                        : "rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 hover:bg-blue-600 hover:text-white hover:cursor-pointer"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {filteredTasks.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {searchQuery.trim()
                  ? "No tasks match your search."
                  : "No tasks match this filter."}
              </p>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onToggleCompleteTask={toggleComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

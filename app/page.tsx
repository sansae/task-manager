"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type TaskFilter = "All" | "Active" | "Completed";
const TASKS_STORAGE_KEY = "task-manager.tasks";

export default function Home() {
  const [tasks, setTasks, hasLoaded] = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    [],
  );
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

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function editTask(id: string, newText: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    );
  }

  function toggleComplete(id: string, completed: boolean) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t)),
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-100/90 px-4 py-6 font-sans text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
              Task Manager
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Add tasks and keep track of what needs doing.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <TaskForm
          onTaskCreated={(task) => {
            // Optimistic UI: add the new item to the top.
            setTasks((prev) => [task, ...prev]);
          }}
        />

        {!hasLoaded ? (
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
                className="min-w-[12rem] flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
              />
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                disabled={searchQuery.length === 0}
                aria-label="Clear search"
                className="shrink-0 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors enabled:hover:cursor-pointer enabled:hover:border-zinc-300 enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 enabled:dark:hover:border-zinc-600 enabled:dark:hover:bg-zinc-800"
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
                        : "rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
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

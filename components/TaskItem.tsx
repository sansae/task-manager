"use client";

import { useMemo, useState } from "react";
import { formatDueDateLabel, isDueOverdue } from "@/lib/dueDate";
import type { Task, TaskPriority } from "@/lib/task";

const priorityBadgeClass: Record<
  TaskPriority,
  string
> = {
  High:
    "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-400/30",
  Medium:
    "bg-yellow-100 text-yellow-900 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-950/50 dark:text-yellow-200 dark:ring-yellow-400/30",
  Low:
    "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20 dark:bg-green-950/50 dark:text-green-300 dark:ring-green-400/30",
};

export default function TaskItem({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}: {
  task: Task;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  onToggleComplete: (completed: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const trimmedDraft = useMemo(() => draft.trim(), [draft]);

  const dueLabel = formatDueDateLabel(task.dueDate);
  const overdue = isDueOverdue(task.dueDate, task.completed);

  function startEditing() {
    setDraft(task.text);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraft(task.text);
    setIsEditing(false);
  }

  function saveEditing() {
    if (!trimmedDraft) return;
    onEdit(trimmedDraft);
    setIsEditing(false);
  }

  function confirmAndDelete() {
    const ok = window.confirm(`Delete this task?\n\n"${task.text}"`);
    if (!ok) return;
    onDelete();
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900/85 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggleComplete(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-full accent-zinc-900 dark:accent-zinc-100"
          aria-label={`Mark "${task.text}" as completed`}
        />

        <div className="min-w-0">
          {isEditing ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
              autoFocus
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadgeClass[task.priority]}`}
                >
                  {task.priority}
                </span>
                <p
                  onClick={() => startEditing()}
                  className={`min-w-0 flex-1 text-wrap truncate text-sm font-medium hover:cursor-pointer ${
                    task.completed
                      ? "text-zinc-500 line-through dark:text-zinc-400"
                      : overdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.text}
                </p>
              </div>
              <div className="mt-1 flex flex-col gap-0.5 text-xs">
                {dueLabel ? (
                  <p
                    className={
                      overdue
                        ? "font-medium text-red-600 dark:text-red-400"
                        : "text-zinc-600 dark:text-zinc-400"
                    }
                  >
                    Due: {dueLabel}
                  </p>
                ) : null}
                <p className="text-zinc-500 dark:text-zinc-400">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:shrink-0 sm:flex-nowrap sm:justify-end">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={saveEditing}
              disabled={!trimmedDraft}
              className="w-full rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50 hover:cursor-pointer hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300 sm:w-auto"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 sm:w-auto"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEditing}
              className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 sm:w-auto"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={confirmAndDelete}
              className="w-full rounded-lg border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:cursor-pointer hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400 sm:w-auto"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}


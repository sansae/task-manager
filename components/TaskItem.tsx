"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/task";

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

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
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
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:text-zinc-100"
            autoFocus
          />
        ) : (
          <>
            <p
              className={`truncate text-sm font-medium ${
                task.completed
                  ? "text-zinc-500 line-through dark:text-zinc-400"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {task.text}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </>
        )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={saveEditing}
              disabled={!trimmedDraft}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-opacity disabled:opacity-50 dark:bg-zinc-100 dark:text-black hover:bg-blue-600 hover:text-white hover:cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 hover:bg-white hover:text-red-600 hover:border-red-600 hover:cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEditing}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-blue-600 hover:text-white dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 hover:cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md border px-3 py-1.5 text-xs font-medium border-zinc-200 bg-red-600 text-white hover:bg-white hover:text-red-600 hover:border-red-600 hover:cursor-pointer"
              // className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-colors bg-red-600 text-white"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}


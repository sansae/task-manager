"use client";

import { useState } from "react";
import type { Task } from "@/lib/task";

export default function TaskForm({
  onTaskCreated,
}: {
  onTaskCreated?: (task: Task) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }

      const data = (await res.json()) as { task: Task };
      setText("");
      onTaskCreated?.(data.task);
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


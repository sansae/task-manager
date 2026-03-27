import type { Task } from "@/lib/task";

export default function TaskItem({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {task.text}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {new Date(task.createdAt).toLocaleString()}
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        Delete
      </button>
    </div>
  );
}


/** Parses YYYY-MM-DD in local calendar time. Returns null if invalid. */
function parseLocalDateString(iso: string): Date | null {
  const trimmed = iso.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, mo - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/**
 * Returns a short relative label: "Today", "Tomorrow", "In X days",
 * or for past dates "Yesterday" / "X days ago". Empty/invalid input returns null.
 */
export function formatDueDateLabel(
  dueDate: string | null | undefined
): string | null {
  if (dueDate == null || String(dueDate).trim() === "") return null;
  const due = parseLocalDateString(String(dueDate));
  if (!due) return null;

  const today = startOfToday();
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  const d = new Date(dueDate).toLocaleDateString();
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days (${d})`;
  if (diffDays === -1) return "Yesterday";
  return `${-diffDays} days ago`;
}

/** True when the task has a valid due date before today and is not completed. */
export function isDueOverdue(
  dueDate: string | null | undefined,
  completed: boolean
): boolean {
  if (completed) return false;
  if (dueDate == null || String(dueDate).trim() === "") return false;
  const due = parseLocalDateString(String(dueDate));
  if (!due) return false;
  return due.getTime() < startOfToday().getTime();
}

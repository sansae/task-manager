import type { Task, TaskPriority } from "@/lib/task";
import { NextResponse } from "next/server";

const PRIORITIES: TaskPriority[] = ["High", "Medium", "Low"];

function parsePriority(value: unknown): TaskPriority {
  if (typeof value === "string" && PRIORITIES.includes(value as TaskPriority)) {
    return value as TaskPriority;
  }
  return "Medium";
}

// In-memory storage for development/demo purposes.
// Note: resets when the server restarts.
const tasks: Task[] = [];

function createId() {
  // `crypto.randomUUID` exists in modern runtimes, but keep a fallback.
  const c = globalThis.crypto;
  if (c && "randomUUID" in c) {
    return c.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function GET() {
  return NextResponse.json({ tasks });
}

function parseOptionalDueDate(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  if (!s) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return undefined;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    text?: unknown;
    priority?: unknown;
    dueDate?: unknown;
  } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { error: "Missing or empty `text`." },
      { status: 400 }
    );
  }

  const priority = parsePriority(body?.priority);
  const dueDate = parseOptionalDueDate(body?.dueDate);

  const task: Task = {
    id: createId(),
    text,
    createdAt: new Date().toISOString(),
    completed: false,
    priority,
    ...(dueDate !== undefined ? { dueDate } : {}),
  };

  tasks.unshift(task);
  return NextResponse.json({ task }, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return NextResponse.json({ error: "Missing `id`." }, { status: 400 });
  }

  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const [task] = tasks.splice(idx, 1);
  return NextResponse.json({ task });
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json({ error: "Missing `id`." }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as
    | { text?: unknown; completed?: unknown }
    | null;
  const textInput = body?.text;
  const completedInput = body?.completed;
  const hasText = typeof textInput === "string";
  const text = hasText ? textInput.trim() : "";
  const hasCompleted = typeof completedInput === "boolean";

  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!hasText && !hasCompleted) {
    return NextResponse.json(
      { error: "Provide `text` or `completed`." },
      { status: 400 }
    );
  }

  if (hasText && !text) {
    return NextResponse.json(
      { error: "Missing or empty `text`." },
      { status: 400 }
    );
  }

  const updates: Partial<Task> = {};
  if (hasText) updates.text = text;
  if (hasCompleted) updates.completed = completedInput;

  tasks[idx] = { ...tasks[idx], ...updates };
  return NextResponse.json({ task: tasks[idx] });
}


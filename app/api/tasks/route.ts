import type { Task } from "@/lib/task";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { error: "Missing or empty `text`." },
      { status: 400 }
    );
  }

  const task: Task = {
    id: createId(),
    text,
    createdAt: new Date().toISOString(),
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


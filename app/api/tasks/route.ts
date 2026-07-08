import pool from "@/lib/db";
import type { TaskPriority } from "@/lib/task";
import { NextResponse } from "next/server";

const PRIORITIES: TaskPriority[] = ["High", "Medium", "Low"];

function parsePriority(value: unknown): TaskPriority {
  if (typeof value === "string" && PRIORITIES.includes(value as TaskPriority)) {
    return value as TaskPriority;
  }
  return "Medium";
}

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    // because of how we created the created_at column
    // we need to format it here or else we'll get "Invalid Date"
    const formattedRows = result.rows.map((row) => ({
      ...row,
      created_at: row.created_at?.toISOString()
    }));

    return NextResponse.json(formattedRows);
  } catch (err) {
    console.error(err);
  }
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
    
  try {
    const result = await pool.query(
      `
      INSERT INTO tasks (text, priority, due_date)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [text, priority, dueDate]
    );
    
    return NextResponse.json(
      { task: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
} // end POST route for tasks (i.e. adding tasks to psql db)

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return NextResponse.json({ error: "Missing `id`." }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *", [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Task Not Found." }, { status: 404 });
    }

    return NextResponse.json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
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

  try {
    const fields = [];
    const values = [];
    let param = 1;

    if (hasText) {
      fields.push(`text = $${param++}`);
      values.push(text);
    }

    if (hasCompleted) {
      fields.push(`completed = $${param++}`);
      values.push(completedInput);
    }

    if (!hasText && !hasCompleted) {
      return NextResponse.json(
        { error: "Provide text or completed"},
        { status: 400 }
      )
    }

    values.push(id);

    const result = await pool.query(
      `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = $${param}
      RETURNING *;
      `,
      values
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 })
    }

    return NextResponse.json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}


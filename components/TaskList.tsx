"use client";

import type { Task } from "@/lib/task";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onDeleteTask,
}: {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} onDelete={() => onDeleteTask(task.id)} />
        </li>
      ))}
    </ul>
  );
}


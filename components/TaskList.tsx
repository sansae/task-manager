"use client";

import type { Task } from "@/lib/task";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onDeleteTask,
  onEditTask,
}: {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
}) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onDelete={() => onDeleteTask(task.id)}
            onEdit={(newText) => onEditTask(task.id, newText)}
          />
        </li>
      ))}
    </ul>
  );
}


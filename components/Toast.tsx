"use client";

import { useEffect, useState } from "react";

type ToastTone = "success" | "error";

export type ToastMessage = {
  id: number;
  message: string;
  tone: ToastTone;
};

const toneClass: Record<ToastTone, string> = {
  success:
    "bg-green-600 text-white shadow-green-950/20 dark:bg-green-500 dark:text-zinc-950",
  error:
    "bg-red-600 text-white shadow-red-950/20 dark:bg-red-500 dark:text-zinc-950",
};

export default function Toast({
  toast,
  onDone,
}: {
  toast: ToastMessage;
  onDone: (id: number) => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setVisible(true), 10);
    const exitTimer = window.setTimeout(() => setVisible(false), 2700);
    const doneTimer = window.setTimeout(() => onDone(toast.id), 3000);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone, toast.id]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
        toneClass[toast.tone]
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
    >
      {toast.message}
    </div>
  );
}

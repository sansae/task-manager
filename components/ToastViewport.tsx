"use client";

import Toast, { type ToastMessage } from "./Toast";

export default function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 z-50 flex sm:w-medium max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDone={onDismiss} />
      ))}
    </div>
  );
}

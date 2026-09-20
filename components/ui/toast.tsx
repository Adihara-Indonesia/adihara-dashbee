"use client";

import { useEffect, useState } from "react";

export type ToastMessage = { type: "success" | "error"; text: string } | null;

/** Bridges a useActionState result into a toast: shows one whenever the
 * state object changes (i.e. after a real submission). Adjusts state
 * during render (React's sanctioned pattern for deriving state from a
 * changed prop) rather than in an effect, since — unlike a plain mirror —
 * this comparison is the actual point of the hook, not optional cleanup. */
export function useActionToast<T extends { error?: string; success?: string }>(
  state: T,
) {
  const [message, setMessage] = useState<ToastMessage>(null);
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    if (state.error) {
      setMessage({ type: "error", text: state.error });
    } else if (state.success) {
      setMessage({ type: "success", text: state.success });
    }
  }

  return { message, dismiss: () => setMessage(null) };
}

export function Toast({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
        message.type === "success" ? "bg-good text-white" : "bg-danger text-white"
      }`}
    >
      {message.text}
    </div>
  );
}

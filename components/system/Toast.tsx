"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastInput {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  action?: { label: string; onClick: () => void };
}

interface InternalToast extends Required<Omit<ToastInput, "action" | "description">> {
  description?: string;
  action?: { label: string; onClick: () => void };
  createdAt: number;
}

interface ToastContextValue {
  toast: (t: ToastInput) => string;
  dismiss: (id: string) => void;
  toasts: InternalToast[];
}

const Context = React.createContext<ToastContextValue | null>(null);

const ICON_BY_VARIANT: Record<ToastVariant, React.ReactNode> = {
  default: <Info size={16} className="text-[var(--accent)]" />,
  success: <CheckCircle2 size={16} className="text-[var(--success)]" />,
  error:   <AlertCircle size={16} className="text-[var(--danger)]" />,
  warning: <AlertTriangle size={16} className="text-[var(--warning)]" />,
  info:    <Info size={16} className="text-[var(--accent)]" />,
};

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<InternalToast[]>([]);
  const timers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = React.useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (input: ToastInput): string => {
      const id = input.id ?? uid();
      const next: InternalToast = {
        id,
        title: input.title,
        variant: input.variant ?? "default",
        durationMs: input.durationMs ?? 4500,
        createdAt: Date.now(),
        description: input.description,
        action: input.action,
      };
      setToasts((curr) => [...curr, next].slice(-5));
      if (next.durationMs > 0) {
        const tm = setTimeout(() => dismiss(id), next.durationMs);
        timers.current.set(id, tm);
      }
      return id;
    },
    [dismiss],
  );

  React.useEffect(
    () => () => {
      for (const tm of timers.current.values()) clearTimeout(tm);
      timers.current.clear();
    },
    [],
  );

  const value = React.useMemo<ToastContextValue>(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);

  return (
    <Context.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </Context.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: InternalToast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-sm flex-col-reverse gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto rounded-xl border bg-[var(--surface-elevated)] px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
            "border-[var(--border)]",
            "animate-[fade-in_0.25s_var(--ease-out-soft)]",
          )}
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="mt-0.5">{ICON_BY_VARIANT[t.variant]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-[12.5px] text-[var(--text-2)] leading-snug">{t.description}</p>
              )}
              {t.action && (
                <button
                  onClick={() => {
                    t.action!.onClick();
                    onDismiss(t.id);
                  }}
                  className="mt-2 text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(Context);
  if (!ctx) {
    return {
      toast: () => "",
      dismiss: () => {},
      toasts: [],
    };
  }
  return ctx;
}

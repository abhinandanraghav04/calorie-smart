"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "info" | "default";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
};

type ToastInput = Omit<Toast, "id"> & { duration?: number };

type ToastContextValue = {
  toast: (options: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timeouts = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeoutId = timeouts.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeouts.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    ({ duration = 4000, ...options }: ToastInput) => {
      const id = createToastId();
      setToasts((prev) => [...prev, { ...options, id }]);
      if (duration > 0) {
        const timeoutId = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timeouts.current.set(id, timeoutId);
      }
    },
    [dismiss]
  );

  React.useEffect(() => {
    const currentTimeouts = timeouts.current;
    return () => {
      currentTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      currentTimeouts.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  const getIcon = (type: ToastType = "default") => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "error":
        return (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 50,
              scale: shouldReduceMotion ? 1 : 0.95,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 20,
              scale: shouldReduceMotion ? 1 : 0.95,
            }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className={cn(
              "bg-card pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",
              toast.type === "error" && "border-red-500/50",
              toast.type === "success" && "border-green-500/50"
            )}
          >
            {getIcon(toast.type)}
            <div className="flex-1 space-y-1">
              <div className="text-sm leading-none font-semibold">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-muted-foreground text-sm">
                  {toast.description}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dismiss(toast.id)}
              aria-label="Close toast"
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  dismissible = true,
  className,
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={() => dismissible && onClose()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "border-border bg-popover text-popover-foreground relative z-10 w-full max-w-lg rounded-lg border p-6 shadow-lg",
              className
            )}
            initial={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 40,
              scale: shouldReduceMotion ? 1 : 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: shouldReduceMotion ? 1 : 0,
              y: shouldReduceMotion ? 0 : 20,
              scale: shouldReduceMotion ? 1 : 0.98,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.25,
              ease: "easeOut",
            }}
          >
            {(title || dismissible) && (
              <header className="mb-4 flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <h2 className="text-lg leading-none font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {description}
                    </p>
                  )}
                </div>
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </header>
            )}
            <div className="text-muted-foreground space-y-4 text-sm">
              {children}
            </div>
            {footer && <footer className="mt-6 pt-4">{footer}</footer>}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

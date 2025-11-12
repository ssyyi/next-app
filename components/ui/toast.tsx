"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      showToast(customEvent.detail.message, customEvent.detail.type);
    };
    window.addEventListener("toast", handleToast);
    return () => {
      window.removeEventListener("toast", handleToast);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-top-5",
              toast.type === "success" && "bg-green-50 border-green-200 text-green-900",
              toast.type === "error" && "bg-red-50 border-red-200 text-red-900",
              toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-900"
            )}
          >
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// 兼容 antd message API
export const message = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", { detail: { message: msg, type: "success" } });
      window.dispatchEvent(event);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", { detail: { message: msg, type: "error" } });
      window.dispatchEvent(event);
    }
  },
  info: (msg: string) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("toast", { detail: { message: msg, type: "info" } });
      window.dispatchEvent(event);
    }
  },
};


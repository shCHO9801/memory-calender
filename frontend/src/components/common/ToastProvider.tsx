"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

type ToastType = "success" | "error";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextValue = {
    showToast: (
        message: string,
        type?: ToastType,
    ) => void;
};

const ToastContext =
    createContext<ToastContextValue | null>(null);

export function ToastProvider({
                                  children,
                              }: {
    children: ReactNode;
}) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (
            message: string,
            type: ToastType = "success",
        ) => {
            const id = Date.now();

            setToasts((prev) => [
                ...prev,
                {
                    id,
                    message,
                    type,
                },
            ]);

            window.setTimeout(() => {
                setToasts((prev) =>
                    prev.filter(
                        (toast) => toast.id !== id,
                    ),
                );
            }, 3000);
        },
        [],
    );

    const removeToast = (id: number) => {
        setToasts((prev) =>
            prev.filter((toast) => toast.id !== id),
        );
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
            }}
        >
            {children}

            <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg ${
                            toast.type === "success"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-red-200 bg-red-50 text-red-700"
                        }`}
                    >
                        <p className="text-sm font-medium">
                            {toast.message}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                removeToast(toast.id)
                            }
                            className="shrink-0 text-sm opacity-60 hover:opacity-100"
                            aria-label="알림 닫기"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used within ToastProvider",
        );
    }

    return context;
}
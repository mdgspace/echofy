import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../components/Toast";

export type ToastType = "success" | "failure";

export interface ToastData {
  id: string;
  type: ToastType;
  label: string;
  description: string;
}

interface ToastContextProps {
  showToast: (type: ToastType, label: string, description: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (type: ToastType, label: string, description: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, label, description }]);
    
    // Auto vanish after 10 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 10000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            label={toast.label}
            description={toast.description}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

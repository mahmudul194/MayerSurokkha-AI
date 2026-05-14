'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function CustomToast({ message, type, isVisible, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    error: <AlertCircle className="h-6 w-6 text-red-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  const colors = {
    success: "bg-green-50/90 border-green-100",
    error: "bg-red-50/90 border-red-100",
    info: "bg-blue-50/90 border-blue-100",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={cn(
            "fixed bottom-12 right-12 z-[100] min-w-[320px] max-w-md p-6 rounded-[2rem] border-2 backdrop-blur-xl shadow-2xl flex items-center gap-5",
            colors[type]
          )}
        >
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-black text-slate-900 leading-tight">
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

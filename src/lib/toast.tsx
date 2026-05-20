'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: ToastType, message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right surface-2',
              toast.type === 'success' && 'shadow-[0_0_0_1px_rgba(0,255,136,0.3),0_8px_32px_rgba(0,255,136,0.1)]',
              toast.type === 'error' && 'shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_8px_32px_rgba(239,68,68,0.1)]',
              toast.type === 'info' && 'shadow-[0_0_0_1px_rgba(0,212,255,0.3),0_8px_32px_rgba(0,212,255,0.1)]',
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-green" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />}
            {toast.type === 'info' && <Info className="h-5 w-5 shrink-0 text-cyan" />}
            <p className="flex-1 text-body text-zinc-200">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

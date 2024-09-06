import React, { useState, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons' // Replace with any icon you prefer

// Toast Provider
export const ToastContext = React.createContext<any>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([])

  const addToast = (newToast: any) => {
    setToasts((prevToasts) => [...prevToasts, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className='fixed right-4 top-4 z-[100] flex flex-col-reverse space-y-2 space-y-reverse'>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Toast Component
export function Toast({ toast }: { toast: any }) {
  const { removeToast } = React.useContext(ToastContext)

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration || 5000) // auto-close after 5 seconds or user-defined duration

    return () => {
      clearTimeout(timer)
    }
  }, [removeToast, toast])

  return (
    <div
      className={`mb-2 rounded-md p-4 shadow-lg transition-all ${
        toast.variant === 'destructive'
          ? 'border border-red-500 bg-red-500 text-white'
          : 'border border-black bg-white text-black shadow-md dark:border-white dark:bg-black dark:text-white dark:shadow-lg'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div>
          {toast.title && <div className='font-medium'>{toast.title}</div>}
          {toast.description && (
            <div className='text-sm'>{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className='ml-4 text-gray-500 hover:text-gray-300'
        >
          <Cross2Icon className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

// Toast Hook for Managing Toasts
export function useToast() {
  const { addToast } = React.useContext(ToastContext)

  const toast = ({
    title = '',
    description = '',
    variant = 'default',
    duration = 5000,
  }: {
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
    duration?: number
  }) => {
    const id = Math.random().toString(36).substring(7)
    addToast({ id, title, description, variant, duration })
  }

  return { toast }
}

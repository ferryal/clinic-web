import * as React from 'react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEsc)
    } else {
      document.removeEventListener('keydown', handleEsc)
    }

    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      <DialogOverlay onClose={() => onOpenChange(false)} />
      <div
        className='fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg sm:rounded-lg'
        role='dialog'
        aria-modal='true'
      >
        {children}
      </div>
    </>
  )
}

const DialogOverlay = ({ onClose }: { onClose: () => void }) => (
  <div
    onClick={onClose}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
    )}
    aria-hidden='true'
  />
)

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className='space-y-4'>{children}</div>
)

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className='flex flex-col space-y-1.5 text-center sm:text-left'>
    {children}
  </div>
)

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className='text-lg font-semibold leading-none tracking-tight'>
    {children}
  </h2>
)

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
    {children}
  </div>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter }

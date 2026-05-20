'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* ────────── Input ────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all duration-200',
            'border-zinc-800 focus:border-[#FF4500]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

/* ────────── Textarea ────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'min-h-[100px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 resize-y',
            'border-zinc-800 focus:border-[#FF4500]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

/* ────────── Select ────────── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg border bg-black px-3 py-2 text-sm text-zinc-100 transition-all duration-200 appearance-none',
            'border-zinc-800 focus:border-[#FF4500]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/20 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-zinc-600">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Input, Textarea, Select }
export type { InputProps, TextareaProps, SelectProps }
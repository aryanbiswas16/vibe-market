'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-label text-zinc-400">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg bg-[#07080a] px-3 py-2 text-body text-[#f7f8f8] placeholder:text-[#8a8f98] transition-all duration-200 border border-white/[0.08]',
            'focus:border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-brand/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-small text-red-500">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-label text-zinc-400">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'min-h-[100px] w-full rounded-lg bg-[#07080a] px-3 py-2 text-body text-[#f7f8f8] placeholder:text-[#8a8f98] transition-all duration-200 resize-y border border-white/[0.08]',
            'focus:border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-brand/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-small text-red-500">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

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
          <label htmlFor={id} className="text-label text-zinc-400">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            'h-10 w-full rounded-lg bg-[#07080a] px-3 py-2 text-body text-[#f7f8f8] transition-all duration-200 appearance-none border border-white/[0.08]',
            'focus:border-white/[0.15] focus:outline-none focus:ring-2 focus:ring-brand/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
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
            <option key={opt.value} value={opt.value} className="bg-zinc-950">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-small text-red-500">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Input, Textarea, Select }
export type { InputProps, TextareaProps, SelectProps }
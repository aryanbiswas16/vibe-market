'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-caption font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:brightness-110',
        secondary:
          'bg-zinc-900 text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-zinc-800 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
        ghost:
          'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]',
        danger:
          'bg-red-600 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-small',
        md: 'h-10 px-5 text-caption',
        lg: 'h-12 px-6 text-body',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

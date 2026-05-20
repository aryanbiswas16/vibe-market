'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/50',
        primary: 'bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30',
        green: 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20',
        cyan: 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20',
        pink: 'bg-[#FF00FF]/10 text-[#FF00FF] border border-[#FF00FF]/20',
        yellow: 'bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20',
        outline: 'bg-transparent text-zinc-400 border border-zinc-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-1.5 w-1.5 rounded-full',
              variant === 'primary' && 'bg-[#FF4500]',
              variant === 'green' && 'bg-[#00FF88]',
              variant === 'cyan' && 'bg-[#00D4FF]',
              variant === 'pink' && 'bg-[#FF00FF]',
              variant === 'yellow' && 'bg-[#FFE600]',
              (!variant || variant === 'default') && 'bg-zinc-400',
            )}
          />
        )}
        {children}
      </span>
    )
  },
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
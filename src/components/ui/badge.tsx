'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-transparent text-zinc-400 border border-white/[0.08]',
        primary: 'bg-brand/10 text-brand border border-brand/20',
        green: 'bg-green/10 text-green border border-green/20',
        cyan: 'bg-cyan/10 text-cyan border border-cyan/20',
        pink: 'bg-pink/10 text-pink border border-pink/20',
        yellow: 'bg-yellow/10 text-yellow border border-yellow/20',
        outline:
          'bg-transparent text-zinc-400 border border-white/[0.08]',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] font-medium',
        md: 'px-2.5 py-1 text-[11px] font-medium',
        lg: 'px-3 py-1 text-[12px] font-medium',
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
              'w-2 h-2 rounded-full',
              variant === 'primary' && 'bg-brand',
              variant === 'green' && 'bg-green',
              variant === 'cyan' && 'bg-cyan',
              variant === 'pink' && 'bg-pink',
              variant === 'yellow' && 'bg-yellow',
              (!variant || variant === 'default' || variant === 'outline') && 'bg-zinc-400',
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
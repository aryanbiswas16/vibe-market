'use client'

import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-transparent text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
        primary: 'bg-brand/10 text-brand',
        green: 'bg-green/10 text-green',
        cyan: 'bg-cyan/10 text-cyan',
        pink: 'bg-pink/10 text-pink',
        yellow: 'bg-yellow/10 text-yellow',
        outline:
          'bg-transparent text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-0.5 text-small',
        lg: 'px-3 py-1 text-caption',
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
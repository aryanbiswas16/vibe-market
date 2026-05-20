'use client'

import { useState, type HTMLAttributes, forwardRef } from 'react'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away'
}

const sizeMap = {
  sm: 'h-8 w-8 text-small',
  md: 'h-10 w-10 text-body',
  lg: 'h-14 w-14 text-heading',
  xl: 'h-20 w-20 text-display',
}

const statusDotSize = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
}

const statusColors = {
  online: 'bg-green',
  offline: 'bg-zinc-600',
  away: 'bg-yellow',
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', name = '', size = 'md', status, ...props }, ref) => {
    const [imgError, setImgError] = useState(false)
    const initials = name ? getInitials(name) : '?'

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', className)}
        {...props}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full overflow-hidden',
            sizeMap[size],
            !src || imgError
              ? 'bg-gradient-to-br from-brand/30 to-zinc-800 text-zinc-300 font-semibold'
              : '',
          )}
        >
          {src && !imgError ? (
            <img
              src={src}
              alt={alt || name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-black',
              statusDotSize[size],
              statusColors[status],
            )}
          />
        )}
      </div>
    )
  },
)
Avatar.displayName = 'Avatar'

export { Avatar }
export type { AvatarProps }

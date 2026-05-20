import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 5) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return 'text-[#00FF88]'
    case 'in_progress':
      return 'text-[#00D4FF]'
    case 'completed':
      return 'text-[#FFE600]'
    case 'cancelled':
      return 'text-zinc-500'
    case 'pending':
      return 'text-[#FFE600]'
    case 'accepted':
      return 'text-[#00FF88]'
    case 'rejected':
      return 'text-red-500'
    default:
      return 'text-zinc-400'
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-[#00FF88]/10'
    case 'in_progress':
      return 'bg-[#00D4FF]/10'
    case 'completed':
      return 'bg-[#FFE600]/10'
    case 'cancelled':
      return 'bg-zinc-500/10'
    case 'pending':
      return 'bg-[#FFE600]/10'
    case 'accepted':
      return 'bg-[#00FF88]/10'
    case 'rejected':
      return 'bg-red-500/10'
    default:
      return 'bg-zinc-400/10'
  }
}

export function getGameIcon(gameType: string): string {
  switch (gameType) {
    case 'steam':
      return '🎮'
    case 'fortnite':
      return '⚔️'
    case 'roblox':
      return '🧊'
    case 'minecraft':
      return '⛏️'
    case 'other':
      return '🎯'
    default:
      return '🎮'
  }
}

export function getPayoutLabel(payoutType: string): string {
  switch (payoutType) {
    case 'fixed':
      return 'Fixed'
    case 'per_hour':
      return 'Per Hour'
    case 'per_viewer':
      return 'Per Viewer'
    default:
      return payoutType
  }
}

export function getPlatformLabel(platform: string): string {
  switch (platform) {
    case 'twitch':
      return 'Twitch'
    case 'youtube':
      return 'YouTube'
    case 'both':
      return 'Twitch + YouTube'
    default:
      return platform
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getRatingStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}
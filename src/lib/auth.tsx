'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from './types'
import { streamers, devs } from './data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (user: User) => void
  signUp: (role: UserRole, data: Partial<User>) => User
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem('vibe_auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed.role === 'streamer'
          ? streamers.find(s => s.id === parsed.id) ?? null
          : devs.find(d => d.id === parsed.id) ?? null
      }
    } catch { /* ignore */ }
    return null
  })
  const [isLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return false
  })

  const persistAuth = useCallback((u: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_auth', JSON.stringify({ id: u.id, role: u.role }))
    }
  }, [])

  const signIn = useCallback((u: User) => {
    setUser(u)
    persistAuth(u)
  }, [persistAuth])

  const signOut = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vibe_auth')
    }
  }, [])

  const signUp = useCallback((role: UserRole, data: Partial<User>): User => {
    const id = generateId()
    const newUser: User = {
      id: role === 'streamer' ? `s${Date.now()}` : `d${Date.now()}`,
      name: data.name || '',
      handle: data.handle || '',
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.handle || id}`,
      role,
      bio: data.bio || '',
      joinedAt: new Date().toISOString(),
      twitchConnected: data.twitchConnected || false,
      youtubeConnected: data.youtubeConnected || false,
      avgViewers: role === 'streamer' ? 0 : undefined,
      followers: role === 'streamer' ? 0 : undefined,
      totalGigsCompleted: 0,
      rating: 0,
      vibeScore: 50,
      ...data,
    }
    // Add to appropriate array
    if (role === 'streamer') {
      streamers.push(newUser)
    } else {
      devs.push(newUser)
    }
    setUser(newUser)
    persistAuth(newUser)
    return newUser
  }, [persistAuth])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      // Update the array too
      if (prev.role === 'streamer') {
        const idx = streamers.findIndex(s => s.id === prev.id)
        if (idx >= 0) streamers[idx] = updated
      } else {
        const idx = devs.findIndex(d => d.id === prev.id)
        if (idx >= 0) devs[idx] = updated
      }
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
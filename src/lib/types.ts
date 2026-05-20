export type UserRole = 'streamer' | 'dev'

export interface User {
  id: string
  name: string
  handle: string
  avatar: string
  role: UserRole
  bio: string
  joinedAt: string
  twitchConnected: boolean
  youtubeConnected: boolean
  avgViewers?: number
  followers?: number
  totalGigsCompleted: number
  rating: number
  vibeScore: number
}

export interface Gig {
  id: string
  devId: string
  devName: string
  devAvatar: string
  title: string
  description: string
  game: string
  gameType: 'steam' | 'fortnite' | 'roblox' | 'minecraft' | 'other'
  platform: 'twitch' | 'youtube' | 'both'
  budget: number
  payoutType: 'fixed' | 'per_hour' | 'per_viewer'
  minFollowers?: number
  minAvgViewers?: number
  duration: string
  scheduledDate: string
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  tags: string[]
  applicants: number
  createdAt: string
}

export interface Application {
  id: string
  gigId: string
  streamerId: string
  streamerName: string
  streamerAvatar: string
  streamerFollowers: number
  streamerAvgViewers: number
  message: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  appliedAt: string
}
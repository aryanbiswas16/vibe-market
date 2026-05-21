import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      handle: string
    }
  }
  interface User {
    role: string
    handle: string
  }
}
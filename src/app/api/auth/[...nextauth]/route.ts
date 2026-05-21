import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth.config"

const { handlers, auth } = NextAuth(authOptions)
export const { GET, POST } = handlers
export { auth }
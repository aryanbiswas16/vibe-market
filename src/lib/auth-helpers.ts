import NextAuth from "next-auth"
import { authOptions } from "./auth.config"

const { auth } = NextAuth(authOptions)
export { auth }
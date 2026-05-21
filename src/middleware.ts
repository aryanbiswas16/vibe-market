import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth.config"

const { auth } = NextAuth(authOptions)

export default auth((req) => {
  // req.auth contains the session — middleware simply keeps session alive
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth pages like login)
     * - / (homepage)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth|$).*)",
  ],
}
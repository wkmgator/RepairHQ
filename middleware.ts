import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/inventory",
    "/customers",
    "/tickets",
    "/invoices",
    "/pos",
    "/settings",
    "/reports",
  ]

  const path = req.nextUrl.pathname

  // Check if the path is protected
  if (protectedPaths.some((prefix) => path.startsWith(prefix))) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Redirect to login if no session
    if (!session) {
      const redirectUrl = new URL("/auth/signin", req.url)
      redirectUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}

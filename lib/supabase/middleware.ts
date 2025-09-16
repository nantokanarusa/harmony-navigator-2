import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return request.cookies.get(key)?.value || null
        },
        setItem: (key: string, value: string) => {
          supabaseResponse.cookies.set(key, value, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          })
        },
        removeItem: (key: string) => {
          supabaseResponse.cookies.delete(key)
        },
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

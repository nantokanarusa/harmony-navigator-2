"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flame, User } from "lucide-react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, streakCount, setUser, setProfile, setValueSettings, reset } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_name: session.user.user_metadata?.user_name,
        })
        loadUserProfile(session.user.id)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          user_name: session.user.user_metadata?.user_name,
        })
        await loadUserProfile(session.user.id)
      } else {
        reset()
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setValueSettings, reset])

  const loadUserProfile = async (userId: string) => {
    const supabase = createClient()

    // Load profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profile) {
      setProfile(profile)
    }

    // Load value settings
    const { data: valueSettings } = await supabase.from("value_settings").select("*").eq("profile_id", userId).single()

    if (valueSettings) {
      setValueSettings(valueSettings)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Record", href: "/record" },
    { name: "Settings", href: "/settings" },
    { name: "Achievements", href: "/achievements" },
  ]

  if (isLoading) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-lg">Harmony Navigator</span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            {/* Streak Counter */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950">
              <Flame className="h-4 w-4 text-orange-500" />
              <Badge variant="secondary" className="bg-transparent border-0 p-0">
                {streakCount} day streak
              </Badge>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm">
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.user_name || "User"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/record">Record</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="md:hidden">
                  <Link href="/achievements">Achievements</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

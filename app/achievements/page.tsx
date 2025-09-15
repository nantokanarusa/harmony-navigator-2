import type React from "react"
import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Calendar, TrendingUp, Award, Star, Flame, CheckCircle } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
  category: "streak" | "milestone" | "consistency" | "growth"
}

async function getAchievements(userId: string) {
  const supabase = createServerClient()

  // Get user's records and profile
  const { data: records } = await supabase
    .from("daily_records")
    .select("*")
    .eq("user_id", userId)
    .order("record_date", { ascending: true })

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!records || !profile) return []

  const today = new Date()
  const recordDates = records.map((r) => new Date(r.record_date))
  const totalRecords = records.length
  const currentStreak = calculateCurrentStreak(recordDates, today)
  const longestStreak = calculateLongestStreak(recordDates)
  const daysSinceStart = Math.floor((today.getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const consistencyRate = daysSinceStart > 0 ? (totalRecords / daysSinceStart) * 100 : 0

  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: "first-record",
      title: "First Steps",
      description: "Record your first daily experience",
      icon: <Star className="h-6 w-6" />,
      progress: Math.min(totalRecords, 1),
      maxProgress: 1,
      unlocked: totalRecords >= 1,
      category: "milestone",
    },
    {
      id: "week-streak",
      title: "Week Warrior",
      description: "Maintain a 7-day recording streak",
      icon: <Flame className="h-6 w-6" />,
      progress: Math.min(currentStreak, 7),
      maxProgress: 7,
      unlocked: currentStreak >= 7,
      category: "streak",
    },
    {
      id: "month-streak",
      title: "Monthly Master",
      description: "Maintain a 30-day recording streak",
      icon: <Trophy className="h-6 w-6" />,
      progress: Math.min(currentStreak, 30),
      maxProgress: 30,
      unlocked: currentStreak >= 30,
      category: "streak",
    },
    {
      id: "hundred-days",
      title: "Centurion",
      description: "Record 100 daily experiences",
      icon: <Target className="h-6 w-6" />,
      progress: Math.min(totalRecords, 100),
      maxProgress: 100,
      unlocked: totalRecords >= 100,
      category: "milestone",
    },
    {
      id: "consistent-tracker",
      title: "Consistency Champion",
      description: "Maintain 80% recording consistency",
      icon: <CheckCircle className="h-6 w-6" />,
      progress: Math.min(consistencyRate, 80),
      maxProgress: 80,
      unlocked: consistencyRate >= 80,
      category: "consistency",
    },
    {
      id: "year-journey",
      title: "Year-Long Journey",
      description: "Record experiences for 365 days",
      icon: <Calendar className="h-6 w-6" />,
      progress: Math.min(totalRecords, 365),
      maxProgress: 365,
      unlocked: totalRecords >= 365,
      category: "milestone",
    },
  ]

  return achievements
}

function calculateCurrentStreak(dates: Date[], today: Date): number {
  if (dates.length === 0) return 0

  const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime())
  let streak = 0
  const currentDate = new Date(today)
  currentDate.setHours(0, 0, 0, 0)

  for (const date of sortedDates) {
    const recordDate = new Date(date)
    recordDate.setHours(0, 0, 0, 0)

    if (recordDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (recordDate.getTime() < currentDate.getTime()) {
      break
    }
  }

  return streak
}

function calculateLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())
  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currentDate = new Date(sortedDates[i])

    prevDate.setHours(0, 0, 0, 0)
    currentDate.setHours(0, 0, 0, 0)

    const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

    if (dayDiff === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

function getCategoryColor(category: Achievement["category"]) {
  switch (category) {
    case "streak":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "milestone":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "consistency":
      return "bg-green-100 text-green-800 border-green-200"
    case "growth":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

async function AchievementsContent() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth")
  }

  const achievements = await getAchievements(user.id)
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600 mb-4">Celebrate your journey of self-discovery and consistent growth</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium">
              {unlockedCount} of {totalCount} unlocked
            </span>
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="flex-1 max-w-xs" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all duration-200 ${
              achievement.unlocked
                ? "border-cyan-200 bg-gradient-to-br from-white to-cyan-50"
                : "border-gray-200 bg-gray-50 opacity-75"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked ? "bg-cyan-100 text-cyan-600" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                      {achievement.title}
                    </CardTitle>
                    <Badge variant="outline" className={`mt-1 text-xs ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </Badge>
                  </div>
                </div>
                {achievement.unlocked && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className={`mb-4 ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                {achievement.description}
              </CardDescription>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={achievement.unlocked ? "text-gray-600" : "text-gray-400"}>Progress</span>
                  <span className={`font-medium ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                </div>
                <Progress
                  value={(achievement.progress / achievement.maxProgress) * 100}
                  className={`h-2 ${achievement.unlocked ? "" : "opacity-50"}`}
                />
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-gray-500 mt-3">
                  Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-gold-50 rounded-full border border-cyan-200">
          <TrendingUp className="h-4 w-4 text-cyan-600" />
          <span className="text-sm font-medium text-gray-700">Keep recording to unlock more achievements!</span>
        </div>
      </div>
    </div>
  )
}

export default function AchievementsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AchievementsContent />
    </Suspense>
  )
}

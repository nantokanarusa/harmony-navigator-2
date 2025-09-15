"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Heart, Target, Calendar } from "lucide-react"

interface RecordData {
  s_health: number
  s_relationships: number
  s_finance: number
  s_autonomy: number
  s_meaning: number
  s_leisure: number
  s_competition: number
  g_happiness: number
  record_date: string
}

interface ValueSettings {
  q_health: number
  q_relationships: number
  q_finance: number
  q_autonomy: number
  q_meaning: number
  q_leisure: number
  q_competition: number
}

interface RHISummaryCardsProps {
  records: RecordData[]
  valueSettings: ValueSettings | null
}

export function RHISummaryCards({ records, valueSettings }: RHISummaryCardsProps) {
  if (!records.length || !valueSettings) return null

  const calculateRHI = (records: RecordData[], valueSettings: ValueSettings) => {
    const weights = {
      s_health: valueSettings.q_health / 100,
      s_relationships: valueSettings.q_relationships / 100,
      s_finance: valueSettings.q_finance / 100,
      s_autonomy: valueSettings.q_autonomy / 100,
      s_meaning: valueSettings.q_meaning / 100,
      s_leisure: valueSettings.q_leisure / 100,
      s_competition: valueSettings.q_competition / 100,
    }

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)

    const avgScores = records.reduce(
      (acc, record) => {
        acc.s_health += record.s_health || 0
        acc.s_relationships += record.s_relationships || 0
        acc.s_finance += record.s_finance || 0
        acc.s_autonomy += record.s_autonomy || 0
        acc.s_meaning += record.s_meaning || 0
        acc.s_leisure += record.s_leisure || 0
        acc.s_competition += record.s_competition || 0
        return acc
      },
      {
        s_health: 0,
        s_relationships: 0,
        s_finance: 0,
        s_autonomy: 0,
        s_meaning: 0,
        s_leisure: 0,
        s_competition: 0,
      },
    )

    Object.keys(avgScores).forEach((key) => {
      avgScores[key as keyof typeof avgScores] /= records.length
    })

    const rhi =
      (avgScores.s_health * weights.s_health +
        avgScores.s_relationships * weights.s_relationships +
        avgScores.s_finance * weights.s_finance +
        avgScores.s_autonomy * weights.s_autonomy +
        avgScores.s_meaning * weights.s_meaning +
        avgScores.s_leisure * weights.s_leisure +
        avgScores.s_competition * weights.s_competition) /
      totalWeight

    return Math.round(rhi)
  }

  const currentRHI = calculateRHI(records, valueSettings)
  const avgHappiness = Math.round(records.reduce((sum, record) => sum + record.g_happiness, 0) / records.length)

  // Calculate trend (compare first half vs second half of period)
  const midPoint = Math.floor(records.length / 2)
  const firstHalf = records.slice(0, midPoint)
  const secondHalf = records.slice(midPoint)

  let trend = 0
  let trendIcon = Minus
  let trendColor = "text-muted-foreground"

  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstHalfRHI = calculateRHI(firstHalf, valueSettings)
    const secondHalfRHI = calculateRHI(secondHalf, valueSettings)
    trend = secondHalfRHI - firstHalfRHI

    if (trend > 5) {
      trendIcon = TrendingUp
      trendColor = "text-green-600"
    } else if (trend < -5) {
      trendIcon = TrendingDown
      trendColor = "text-red-600"
    }
  }

  const getRHIBadgeVariant = (rhi: number) => {
    if (rhi >= 80) return "default"
    if (rhi >= 60) return "secondary"
    return "outline"
  }

  const getRHIDescription = (rhi: number) => {
    if (rhi >= 80) return "Excellent well-being alignment"
    if (rhi >= 60) return "Good well-being balance"
    if (rhi >= 40) return "Moderate well-being"
    return "Needs attention"
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Relative Harmony Index</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{currentRHI}</div>
            <Badge variant={getRHIBadgeVariant(currentRHI)}>RHI</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{getRHIDescription(currentRHI)}</p>
          <div className="flex items-center mt-2">
            {React.createElement(trendIcon, { className: `h-4 w-4 ${trendColor}` })}
            <span className={`text-xs ml-1 ${trendColor}`}>
              {trend > 0 ? `+${trend}` : trend < 0 ? trend : "No change"} from previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Happiness</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgHappiness}</div>
          <p className="text-xs text-muted-foreground">Out of 100</p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${avgHappiness}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tracking Streak</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{records.length}</div>
          <p className="text-xs text-muted-foreground">Days recorded in this period</p>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="text-xs">
              {records.length > 20 ? "Excellent" : records.length > 10 ? "Good" : "Getting Started"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

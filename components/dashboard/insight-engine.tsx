"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface RecordData {
  s_health: number
  s_relationships: number
  s_finance: number
  s_autonomy: number
  s_meaning: number
  s_leisure: number
  s_competition: number
  g_happiness: number
  event_log: string
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

interface InsightEngineProps {
  records: RecordData[]
  valueSettings: ValueSettings | null
}

export function InsightEngine({ records, valueSettings }: InsightEngineProps) {
  if (!records.length || !valueSettings) return null

  const generateInsights = () => {
    const insights = []

    // Calculate averages and trends
    const categories = [
      "s_health",
      "s_relationships",
      "s_finance",
      "s_autonomy",
      "s_meaning",
      "s_leisure",
      "s_competition",
    ]
    const categoryLabels: Record<string, string> = {
      s_health: "Health",
      s_relationships: "Relationships",
      s_finance: "Finance",
      s_autonomy: "Autonomy",
      s_meaning: "Meaning",
      s_leisure: "Leisure",
      s_competition: "Competition",
    }

    const averages: Record<string, number> = {}
    const trends: Record<string, number> = {}

    categories.forEach((category) => {
      const scores = records.map((r) => r[category as keyof RecordData] as number)
      averages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length

      // Calculate trend (first half vs second half)
      if (scores.length >= 4) {
        const midPoint = Math.floor(scores.length / 2)
        const firstHalf = scores.slice(0, midPoint)
        const secondHalf = scores.slice(midPoint)
        const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
        const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length
        trends[category] = secondAvg - firstAvg
      }
    })

    // Find strongest and weakest areas
    const strongest = categories.reduce((a, b) => (averages[a] > averages[b] ? a : b))
    const weakest = categories.reduce((a, b) => (averages[a] < averages[b] ? a : b))

    insights.push({
      type: "strength",
      icon: TrendingUp,
      title: `${categoryLabels[strongest]} is your strongest area`,
      description: `You're scoring ${Math.round(averages[strongest])} on average in ${categoryLabels[strongest].toLowerCase()}.`,
      color: "text-green-600",
    })

    if (averages[weakest] < 60) {
      insights.push({
        type: "improvement",
        icon: AlertTriangle,
        title: `${categoryLabels[weakest]} needs attention`,
        description: `Your ${categoryLabels[weakest].toLowerCase()} score is ${Math.round(averages[weakest])}, which is below your other areas.`,
        color: "text-orange-600",
      })
    }

    // Find biggest positive trend
    const biggestImprovement = Object.entries(trends).reduce((a, b) => (a[1] > b[1] ? a : b))
    if (biggestImprovement[1] > 5) {
      insights.push({
        type: "trend",
        icon: TrendingUp,
        title: `${categoryLabels[biggestImprovement[0]]} is improving`,
        description: `You've improved by ${Math.round(biggestImprovement[1])} points in ${categoryLabels[biggestImprovement[0]].toLowerCase()} recently.`,
        color: "text-green-600",
      })
    }

    // Find biggest negative trend
    const biggestDecline = Object.entries(trends).reduce((a, b) => (a[1] < b[1] ? a : b))
    if (biggestDecline[1] < -5) {
      insights.push({
        type: "concern",
        icon: TrendingDown,
        title: `${categoryLabels[biggestDecline[0]]} is declining`,
        description: `Your ${categoryLabels[biggestDecline[0]].toLowerCase()} score has dropped by ${Math.round(Math.abs(biggestDecline[1]))} points recently.`,
        color: "text-red-600",
      })
    }

    // Value alignment insight
    const valueImportance: Record<string, number> = {
      s_health: valueSettings.q_health,
      s_relationships: valueSettings.q_relationships,
      s_finance: valueSettings.q_finance,
      s_autonomy: valueSettings.q_autonomy,
      s_meaning: valueSettings.q_meaning,
      s_leisure: valueSettings.q_leisure,
      s_competition: valueSettings.q_competition,
    }

    const biggestGap = categories.reduce((biggest, category) => {
      const gap = Math.abs(averages[category] - valueImportance[category])
      const biggestGap = Math.abs(averages[biggest] - valueImportance[biggest])
      return gap > biggestGap ? category : biggest
    })

    const gap = averages[biggestGap] - valueImportance[biggestGap]
    if (Math.abs(gap) > 15) {
      insights.push({
        type: "alignment",
        icon: Lightbulb,
        title: `${categoryLabels[biggestGap]} alignment opportunity`,
        description:
          gap > 0
            ? `You're scoring higher in ${categoryLabels[biggestGap].toLowerCase()} than you value it. Consider if this balance is right for you.`
            : `You value ${categoryLabels[biggestGap].toLowerCase()} highly but aren't scoring well in this area.`,
        color: "text-blue-600",
      })
    }

    return insights.slice(0, 4) // Return top 4 insights
  }

  const insights = generateInsights()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Insight Engine
        </CardTitle>
        <CardDescription>AI-powered insights from your well-being data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {insight.type}
            </Badge>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keep tracking for more personalized insights!
          </p>
        )}
      </CardContent>
    </Card>
  )
}

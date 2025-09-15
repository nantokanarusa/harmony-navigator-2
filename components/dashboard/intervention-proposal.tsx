"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, ArrowRight, CheckCircle } from "lucide-react"

interface RecordData {
  s_health: number
  s_relationships: number
  s_finance: number
  s_autonomy: number
  s_meaning: number
  s_leisure: number
  s_competition: number
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

interface InterventionProposalProps {
  records: RecordData[]
  valueSettings: ValueSettings | null
}

export function InterventionProposal({ records, valueSettings }: InterventionProposalProps) {
  if (!records.length || !valueSettings) return null

  const generateInterventions = () => {
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

    const interventions: Record<string, string[]> = {
      s_health: [
        "Schedule 30 minutes of daily exercise",
        "Establish a consistent sleep routine",
        "Plan nutritious meals for the week",
        "Take regular breaks from screen time",
      ],
      s_relationships: [
        "Schedule weekly check-ins with close friends",
        "Plan a date night or quality time with your partner",
        "Join a community group or club",
        "Practice active listening in conversations",
      ],
      s_finance: [
        "Create a monthly budget and track expenses",
        "Set up an emergency fund savings goal",
        "Review and optimize your investment portfolio",
        "Negotiate a raise or explore new income streams",
      ],
      s_autonomy: [
        "Set boundaries around your time and energy",
        "Make one independent decision each day",
        "Explore a new hobby or interest",
        "Practice saying no to commitments that don't align with your values",
      ],
      s_meaning: [
        "Volunteer for a cause you care about",
        "Set meaningful goals aligned with your values",
        "Reflect on your purpose and life direction",
        "Seek opportunities to mentor or help others",
      ],
      s_leisure: [
        "Schedule regular downtime without obligations",
        "Try a new recreational activity",
        "Plan a weekend getaway or vacation",
        "Create a relaxing evening routine",
      ],
      s_competition: [
        "Set a challenging but achievable goal",
        "Join a competitive sport or game",
        "Track your progress on personal metrics",
        "Celebrate your wins and achievements",
      ],
    }

    // Calculate averages
    const averages: Record<string, number> = {}
    categories.forEach((category) => {
      const scores = records.map((r) => r[category as keyof RecordData] as number)
      averages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })

    // Find areas that need improvement (low scores or high importance but low performance)
    const priorities = categories
      .map((category) => ({
        category,
        score: averages[category],
        importance: valueSettings[`q_${category.substring(2)}` as keyof ValueSettings],
        gap: valueSettings[`q_${category.substring(2)}` as keyof ValueSettings] - averages[category],
      }))
      .filter((item) => item.score < 70 || item.gap > 15)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 2)

    return priorities.map((priority) => ({
      category: priority.category,
      label: categoryLabels[priority.category],
      score: Math.round(priority.score),
      importance: priority.importance,
      gap: Math.round(priority.gap),
      suggestions: interventions[priority.category].slice(0, 3),
    }))
  }

  const interventions = generateInterventions()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Intervention Proposals
        </CardTitle>
        <CardDescription>Personalized recommendations to improve your well-being</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {interventions.map((intervention, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{intervention.label}</h4>
                <p className="text-sm text-muted-foreground">
                  Current: {intervention.score} | Importance: {intervention.importance}
                </p>
              </div>
              <Badge variant={intervention.gap > 20 ? "destructive" : "secondary"}>
                {intervention.gap > 0 ? `+${intervention.gap}` : intervention.gap} gap
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Suggested actions:</p>
              {intervention.suggestions.map((suggestion, suggestionIndex) => (
                <div key={suggestionIndex} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Start Working on {intervention.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
        {interventions.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-medium mb-2">You're doing great!</h4>
            <p className="text-sm text-muted-foreground">
              Your well-being scores are well-aligned with your values. Keep up the good work!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

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

interface GapAnalysisChartProps {
  records: RecordData[]
  valueSettings: ValueSettings | null
}

export function GapAnalysisChart({ records, valueSettings }: GapAnalysisChartProps) {
  if (!records.length || !valueSettings) return null

  // Calculate averages
  const averages = records.reduce(
    (acc, record) => {
      acc.health += record.s_health || 0
      acc.relationships += record.s_relationships || 0
      acc.finance += record.s_finance || 0
      acc.autonomy += record.s_autonomy || 0
      acc.meaning += record.s_meaning || 0
      acc.leisure += record.s_leisure || 0
      acc.competition += record.s_competition || 0
      return acc
    },
    {
      health: 0,
      relationships: 0,
      finance: 0,
      autonomy: 0,
      meaning: 0,
      leisure: 0,
      competition: 0,
    },
  )

  Object.keys(averages).forEach((key) => {
    averages[key as keyof typeof averages] = Math.round(averages[key as keyof typeof averages] / records.length)
  })

  const data = [
    {
      category: "Health",
      actual: averages.health,
      importance: valueSettings.q_health,
      gap: averages.health - valueSettings.q_health,
    },
    {
      category: "Relationships",
      actual: averages.relationships,
      importance: valueSettings.q_relationships,
      gap: averages.relationships - valueSettings.q_relationships,
    },
    {
      category: "Finance",
      actual: averages.finance,
      importance: valueSettings.q_finance,
      gap: averages.finance - valueSettings.q_finance,
    },
    {
      category: "Autonomy",
      actual: averages.autonomy,
      importance: valueSettings.q_autonomy,
      gap: averages.autonomy - valueSettings.q_autonomy,
    },
    {
      category: "Meaning",
      actual: averages.meaning,
      importance: valueSettings.q_meaning,
      gap: averages.meaning - valueSettings.q_meaning,
    },
    {
      category: "Leisure",
      actual: averages.leisure,
      importance: valueSettings.q_leisure,
      gap: averages.leisure - valueSettings.q_leisure,
    },
    {
      category: "Competition",
      actual: averages.competition,
      importance: valueSettings.q_competition,
      gap: averages.competition - valueSettings.q_competition,
    },
  ]

  const getBarColor = (gap: number) => {
    if (gap > 10) return "hsl(var(--chart-1))" // Good - exceeding expectations
    if (gap > -10) return "hsl(var(--chart-3))" // Neutral - close to expectations
    return "hsl(var(--chart-2))" // Needs attention - below expectations
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="category" className="text-xs" />
          <YAxis domain={[-50, 50]} className="text-xs" />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value > 0 ? "+" : ""}${value}`,
              name === "gap" ? "Gap (Actual - Importance)" : name,
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="gap" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.gap)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

interface RecordData {
  s_health: number
  s_relationships: number
  s_finance: number
  s_autonomy: number
  s_meaning: number
  s_leisure: number
  s_competition: number
}

interface RadarChartProps {
  records: RecordData[]
}

export function RadarChart({ records }: RadarChartProps) {
  if (!records.length) return null

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
    { subject: "Health", A: averages.health, fullMark: 100 },
    { subject: "Relationships", A: averages.relationships, fullMark: 100 },
    { subject: "Finance", A: averages.finance, fullMark: 100 },
    { subject: "Autonomy", A: averages.autonomy, fullMark: 100 },
    { subject: "Meaning", A: averages.meaning, fullMark: 100 },
    { subject: "Leisure", A: averages.leisure, fullMark: 100 },
    { subject: "Competition", A: averages.competition, fullMark: 100 },
  ]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis dataKey="subject" className="text-xs" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
          <Radar
            name="Current Scores"
            dataKey="A"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"

interface RecordData {
  id: string
  record_date: string
  s_health: number
  s_relationships: number
  s_finance: number
  s_autonomy: number
  s_meaning: number
  s_leisure: number
  s_competition: number
  g_happiness: number
  event_log: string
  mode: string
}

interface TimeSeriesChartProps {
  records: RecordData[]
}

export function TimeSeriesChart({ records }: TimeSeriesChartProps) {
  const chartData = records.map((record) => ({
    date: format(new Date(record.record_date), "MMM dd"),
    fullDate: record.record_date,
    Health: record.s_health,
    Relationships: record.s_relationships,
    Finance: record.s_finance,
    Autonomy: record.s_autonomy,
    Meaning: record.s_meaning,
    Leisure: record.s_leisure,
    Competition: record.s_competition,
    Happiness: record.g_happiness,
    eventLog: record.event_log,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-semibold mb-2">{format(new Date(data.fullDate), "MMMM dd, yyyy")}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
          {data.eventLog && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-1">Event Log:</p>
              <p className="text-xs text-muted-foreground">{data.eventLog.substring(0, 100)}...</p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis domain={[0, 100]} className="text-xs" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Happiness"
            stroke="hsl(var(--chart-1))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Health"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Relationships"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Meaning"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Autonomy"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-5))", strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

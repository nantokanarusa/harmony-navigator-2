"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { decryptText } from "@/lib/crypto"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { RadarChart } from "@/components/charts/radar-chart"
import { GapAnalysisChart } from "@/components/charts/gap-analysis-chart"
import { RHISummaryCards } from "@/components/dashboard/rhi-summary-cards"
import { InsightEngine } from "@/components/dashboard/insight-engine"
import { InterventionProposal } from "@/components/dashboard/intervention-proposal"
import { format, subDays } from "date-fns"
import { Calendar, AlertCircle, Loader2, BarChart3 } from "lucide-react"

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

interface ValueSettings {
  q_health: number
  q_relationships: number
  q_finance: number
  q_autonomy: number
  q_meaning: number
  q_leisure: number
  q_competition: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, valueSettings } = useAppStore()
  const [timePeriod, setTimePeriod] = useState("30")
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<RecordData[]>([])
  const [decryptedRecords, setDecryptedRecords] = useState<RecordData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    loadDashboardData()
  }, [user, timePeriod])

  const loadDashboardData = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const endDate = new Date()
      const startDate = getStartDate(endDate, timePeriod)

      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("profile_id", user.id)
        .gte("record_date", format(startDate, "yyyy-MM-dd"))
        .lte("record_date", format(endDate, "yyyy-MM-dd"))
        .order("record_date", { ascending: true })

      if (error) throw error

      setRecords(data || [])

      // Decrypt event logs client-side
      const decrypted = await Promise.all(
        (data || []).map(async (record) => ({
          ...record,
          event_log: await decryptText(record.event_log || ""),
        })),
      )

      setDecryptedRecords(decrypted)
    } catch (error: any) {
      setError(error.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const getStartDate = (endDate: Date, period: string) => {
    switch (period) {
      case "7":
        return subDays(endDate, 7)
      case "14":
        return subDays(endDate, 14)
      case "30":
        return subDays(endDate, 30)
      case "90":
        return subDays(endDate, 90)
      default:
        return subDays(endDate, 30)
    }
  }

  const calculateRHI = (records: RecordData[], valueSettings: ValueSettings | null) => {
    if (!records.length || !valueSettings) return 0

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

  const getEmptyStateMessage = () => {
    if (records.length === 0) {
      return {
        title: "No Data Available",
        description: `You haven't recorded any entries in the last ${timePeriod} days. Start tracking your well-being to see insights here.`,
        action: "Record Your First Entry",
        actionHref: "/record",
      }
    }

    if (records.length < 3) {
      return {
        title: "More Data Needed",
        description: `You have ${records.length} entries. We need at least 3 entries to generate meaningful insights and trends.`,
        action: "Add More Entries",
        actionHref: "/record",
      }
    }

    return null
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const emptyState = getEmptyStateMessage()

  return (
    <div className="container mx-auto max-w-7xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your personal well-being insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 2 weeks</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : emptyState ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{emptyState.title}</h3>
              <p className="text-muted-foreground max-w-md">{emptyState.description}</p>
            </div>
            <Button onClick={() => router.push(emptyState.actionHref)}>{emptyState.action}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* RHI Summary Cards */}
          <RHISummaryCards records={records} valueSettings={valueSettings} />

          {/* Main Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Well-being Trends</CardTitle>
                <CardDescription>Your well-being scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart records={decryptedRecords} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
                <CardDescription>Your current well-being profile</CardDescription>
              </CardHeader>
              <CardContent>
                <RadarChart records={records} />
              </CardContent>
            </Card>
          </div>

          {/* Gap Analysis */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Gap Analysis</CardTitle>
              <CardDescription>How your actual scores compare to your personal values</CardDescription>
            </CardHeader>
            <CardContent>
              <GapAnalysisChart records={records} valueSettings={valueSettings} />
            </CardContent>
          </Card>

          {/* Insights and Interventions */}
          <div className="grid lg:grid-cols-2 gap-6">
            <InsightEngine records={decryptedRecords} valueSettings={valueSettings} />
            <InterventionProposal records={records} valueSettings={valueSettings} />
          </div>
        </>
      )}
    </div>
  )
}

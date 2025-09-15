"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { encryptText } from "@/lib/crypto"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Element categories for detailed tracking
const elementCategories = {
  health: [
    { key: "s_element_睡眠", label: "Sleep Quality", description: "How well did you sleep?" },
    { key: "s_element_食事", label: "Nutrition", description: "How satisfied are you with your eating?" },
    { key: "s_element_運動", label: "Physical Activity", description: "How active were you today?" },
    { key: "s_element_身体的快適さ", label: "Physical Comfort", description: "How comfortable did your body feel?" },
    {
      key: "s_element_感覚的快楽",
      label: "Sensory Pleasure",
      description: "Did you enjoy pleasant sensory experiences?",
    },
    { key: "s_element_性的幸福", label: "Sexual Well-being", description: "How satisfied are you with intimacy?" },
  ],
  relationships: [
    { key: "s_element_家族", label: "Family", description: "How connected did you feel with family?" },
    {
      key: "s_element_パートナー・恋愛",
      label: "Partner/Romance",
      description: "How fulfilled is your romantic life?",
    },
    { key: "s_element_友人", label: "Friends", description: "How connected did you feel with friends?" },
    { key: "s_element_社会的承認", label: "Social Recognition", description: "Did you feel valued by others?" },
    {
      key: "s_element_利他性・貢献",
      label: "Helping Others",
      description: "Did you contribute to others' well-being?",
    },
    {
      key: "s_element_共感・繋がり",
      label: "Empathy & Connection",
      description: "Did you feel emotionally connected?",
    },
  ],
  meaning: [
    { key: "s_element_やりがい", label: "Fulfillment", description: "Did your work/activities feel meaningful?" },
    { key: "s_element_達成感", label: "Achievement", description: "Did you accomplish something important?" },
    { key: "s_element_信念との一致", label: "Values Alignment", description: "Did you act according to your values?" },
    {
      key: "s_element_キャリアの展望",
      label: "Career Prospects",
      description: "How optimistic are you about your future?",
    },
    { key: "s_element_社会への貢献", label: "Social Contribution", description: "Did you contribute to society?" },
    { key: "s_element_有能感", label: "Competence", description: "Did you feel capable and skilled?" },
  ],
  autonomy: [
    {
      key: "s_element_自由・自己決定",
      label: "Freedom & Choice",
      description: "Did you feel free to make your own choices?",
    },
    { key: "s_element_挑戦・冒険", label: "Challenge & Adventure", description: "Did you embrace new challenges?" },
    {
      key: "s_element_自己成長の実感",
      label: "Personal Growth",
      description: "Did you feel you were growing as a person?",
    },
    { key: "s_element_変化の享受", label: "Embracing Change", description: "Did you welcome new experiences?" },
    { key: "s_element_独立・自己信頼", label: "Independence", description: "Did you feel self-reliant?" },
    { key: "s_element_好奇心", label: "Curiosity", description: "Did you explore new ideas or experiences?" },
  ],
  finance: [
    { key: "s_element_経済的安定", label: "Financial Stability", description: "How secure do you feel financially?" },
    {
      key: "s_element_経済的余裕",
      label: "Financial Comfort",
      description: "Do you have enough money for what you need?",
    },
    { key: "s_element_労働環境", label: "Work Environment", description: "How satisfied are you with your workplace?" },
    {
      key: "s_element_ワークライフバランス",
      label: "Work-Life Balance",
      description: "How balanced is your work and personal life?",
    },
    {
      key: "s_element_公正な評価",
      label: "Fair Recognition",
      description: "Do you feel fairly compensated/recognized?",
    },
    { key: "s_element_職業的安定性", label: "Job Security", description: "How secure is your employment?" },
  ],
  leisure: [
    { key: "s_element_心の平穏", label: "Peace of Mind", description: "Did you feel calm and at peace?" },
    { key: "s_element_自己肯定感", label: "Self-Esteem", description: "Did you feel good about yourself?" },
    { key: "s_element_創造性の発揮", label: "Creativity", description: "Did you express your creative side?" },
    { key: "s_element_感謝", label: "Gratitude", description: "Did you feel thankful for what you have?" },
    {
      key: "s_element_娯楽・楽しさ",
      label: "Fun & Entertainment",
      description: "Did you enjoy yourself and have fun?",
    },
    { key: "s_element_芸術・自然", label: "Art & Nature", description: "Did you appreciate beauty in art or nature?" },
  ],
  competition: [
    {
      key: "s_element_優越感・勝利",
      label: "Success & Victory",
      description: "Did you feel successful or victorious?",
    },
  ],
}

export default function RecordPage() {
  const router = useRouter()
  const { user, profile } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [recordMode, setRecordMode] = useState<"quick" | "detailed">("quick")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form data
  const [quickData, setQuickData] = useState({
    s_health: 50,
    s_relationships: 50,
    s_finance: 50,
    s_autonomy: 50,
    s_meaning: 50,
    s_leisure: 50,
    s_competition: 50,
    g_happiness: 50,
  })

  const [detailedData, setDetailedData] = useState<Record<string, number>>({})
  const [eventLog, setEventLog] = useState("")
  const [existingRecord, setExistingRecord] = useState<any>(null)

  const maxEventLogLength = 2000

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Set initial record mode from profile
    if (profile?.record_mode) {
      setRecordMode(profile.record_mode as "quick" | "detailed")
    }

    // Initialize detailed data with default values
    const initialDetailedData: Record<string, number> = {}
    Object.values(elementCategories).forEach((category) => {
      category.forEach((element) => {
        initialDetailedData[element.key] = 50
      })
    })
    setDetailedData(initialDetailedData)

    loadExistingRecord()
  }, [user, profile, selectedDate])

  const loadExistingRecord = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const dateString = format(selectedDate, "yyyy-MM-dd")

      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("profile_id", user.id)
        .eq("record_date", dateString)
        .single()

      if (data) {
        setExistingRecord(data)
        // Populate form with existing data
        setQuickData({
          s_health: data.s_health || 50,
          s_relationships: data.s_relationships || 50,
          s_finance: data.s_finance || 50,
          s_autonomy: data.s_autonomy || 50,
          s_meaning: data.s_meaning || 50,
          s_leisure: data.s_leisure || 50,
          s_competition: data.s_competition || 50,
          g_happiness: data.g_happiness || 50,
        })

        // Populate detailed data
        const updatedDetailedData: Record<string, number> = {}
        Object.values(elementCategories).forEach((category) => {
          category.forEach((element) => {
            updatedDetailedData[element.key] = data[element.key] || 50
          })
        })
        setDetailedData(updatedDetailedData)

        setEventLog(data.event_log || "")
        setRecordMode(data.mode || (profile?.record_mode as "quick" | "detailed") || "quick")
      } else {
        setExistingRecord(null)
        setEventLog("")
      }
    } catch (error: any) {
      if (error.code !== "PGRST116") {
        // PGRST116 is "not found" which is expected for new records
        setError("Failed to load existing record")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSliderChange = (key: string, value: number[]) => {
    setQuickData((prev) => ({
      ...prev,
      [key]: value[0],
    }))
  }

  const handleDetailedSliderChange = (key: string, value: number[]) => {
    setDetailedData((prev) => ({
      ...prev,
      [key]: value[0],
    }))
  }

  const handleSave = async () => {
    if (!user) return

    if (eventLog.length > maxEventLogLength) {
      setError(`Event log must be ${maxEventLogLength} characters or less`)
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const dateString = format(selectedDate, "yyyy-MM-dd")

      // Encrypt event log
      const encryptedEventLog = await encryptText(eventLog)

      // Prepare record data
      const recordData = {
        profile_id: user.id,
        record_date: dateString,
        mode: recordMode,
        event_log: encryptedEventLog,
        g_happiness:
          recordMode === "quick"
            ? quickData.g_happiness
            : Math.round(
                Object.values(detailedData).reduce((sum, val) => sum + val, 0) / Object.values(detailedData).length,
              ),
        s_health:
          recordMode === "quick"
            ? quickData.s_health
            : Math.round(
                elementCategories.health.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.health.length,
              ),
        s_relationships:
          recordMode === "quick"
            ? quickData.s_relationships
            : Math.round(
                elementCategories.relationships.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.relationships.length,
              ),
        s_finance:
          recordMode === "quick"
            ? quickData.s_finance
            : Math.round(
                elementCategories.finance.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.finance.length,
              ),
        s_autonomy:
          recordMode === "quick"
            ? quickData.s_autonomy
            : Math.round(
                elementCategories.autonomy.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.autonomy.length,
              ),
        s_meaning:
          recordMode === "quick"
            ? quickData.s_meaning
            : Math.round(
                elementCategories.meaning.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.meaning.length,
              ),
        s_leisure:
          recordMode === "quick"
            ? quickData.s_leisure
            : Math.round(
                elementCategories.leisure.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.leisure.length,
              ),
        s_competition:
          recordMode === "quick"
            ? quickData.s_competition
            : Math.round(
                elementCategories.competition.reduce((sum, el) => sum + detailedData[el.key], 0) /
                  elementCategories.competition.length,
              ),
        // Include all detailed elements if in detailed mode
        ...(recordMode === "detailed" ? detailedData : {}),
      }

      const { error } = await supabase.from("records").upsert(recordData)

      if (error) throw error

      setSuccess("Journal entry saved successfully!")
      setExistingRecord({ ...recordData, id: existingRecord?.id })

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to save journal entry")
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Record</h1>
          <p className="text-muted-foreground">Track your daily experiences and well-being</p>
        </div>
        <Badge variant={existingRecord ? "secondary" : "outline"}>
          {existingRecord ? "Entry Exists" : "New Entry"}
        </Badge>
      </div>

      {/* Date Picker */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={recordMode} onValueChange={(value) => setRecordMode(value as "quick" | "detailed")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Log</TabsTrigger>
            <TabsTrigger value="detailed">Deep Dive</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Assessment</CardTitle>
                <CardDescription>Rate how you felt in each area today (0-100)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(quickData).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    s_health: "Health & Physical Well-being",
                    s_relationships: "Relationships & Social Connection",
                    s_finance: "Financial Security",
                    s_autonomy: "Personal Autonomy",
                    s_meaning: "Meaningful Work",
                    s_leisure: "Leisure & Recreation",
                    s_competition: "Competition & Achievement",
                    g_happiness: "Overall Happiness",
                  }

                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">{labels[key]}</Label>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(val) => handleQuickSliderChange(key, val)}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {Object.entries(elementCategories).map(([categoryKey, elements]) => (
              <Card key={categoryKey} className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="capitalize">{categoryKey.replace("_", " & ")}</CardTitle>
                  <CardDescription>Rate each aspect (0-100)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {elements.map((element) => (
                    <div key={element.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">{element.label}</Label>
                          <p className="text-sm text-muted-foreground">{element.description}</p>
                        </div>
                        <Badge variant="outline">{detailedData[element.key] || 50}</Badge>
                      </div>
                      <Slider
                        value={[detailedData[element.key] || 50]}
                        onValueChange={(val) => handleDetailedSliderChange(element.key, val)}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* Event Log */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>
            What happened today? Your thoughts are encrypted and private.
            {eventLog.length > 0 && (
              <span
                className={`ml-2 ${eventLog.length > maxEventLogLength ? "text-destructive" : "text-muted-foreground"}`}
              >
                ({eventLog.length}/{maxEventLogLength})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your day, thoughts, feelings, or any significant events..."
            value={eventLog}
            onChange={(e) => setEventLog(e.target.value)}
            className="min-h-32 resize-none"
            maxLength={maxEventLogLength}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Journal Entry
        </Button>
      </div>
    </div>
  )
}

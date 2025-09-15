"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

// Pairwise comparison questions
const pairwiseQuestions = [
  {
    id: 1,
    optionA: "Health & Physical Well-being",
    optionB: "Relationships & Social Connection",
    category: "health_vs_relationships",
  },
  { id: 2, optionA: "Financial Security", optionB: "Personal Autonomy", category: "finance_vs_autonomy" },
  { id: 3, optionA: "Meaningful Work", optionB: "Leisure & Recreation", category: "meaning_vs_leisure" },
  { id: 4, optionA: "Health & Physical Well-being", optionB: "Financial Security", category: "health_vs_finance" },
  {
    id: 5,
    optionA: "Relationships & Social Connection",
    optionB: "Personal Autonomy",
    category: "relationships_vs_autonomy",
  },
  { id: 6, optionA: "Meaningful Work", optionB: "Competition & Achievement", category: "meaning_vs_competition" },
  { id: 7, optionA: "Health & Physical Well-being", optionB: "Meaningful Work", category: "health_vs_meaning" },
  {
    id: 8,
    optionA: "Financial Security",
    optionB: "Relationships & Social Connection",
    category: "finance_vs_relationships",
  },
  { id: 9, optionA: "Personal Autonomy", optionB: "Leisure & Recreation", category: "autonomy_vs_leisure" },
  {
    id: 10,
    optionA: "Competition & Achievement",
    optionB: "Health & Physical Well-being",
    category: "competition_vs_health",
  },
  { id: 11, optionA: "Meaningful Work", optionB: "Personal Autonomy", category: "meaning_vs_autonomy" },
  { id: 12, optionA: "Financial Security", optionB: "Leisure & Recreation", category: "finance_vs_leisure" },
  {
    id: 13,
    optionA: "Relationships & Social Connection",
    optionB: "Competition & Achievement",
    category: "relationships_vs_competition",
  },
  { id: 14, optionA: "Health & Physical Well-being", optionB: "Personal Autonomy", category: "health_vs_autonomy" },
  { id: 15, optionA: "Meaningful Work", optionB: "Financial Security", category: "meaning_vs_finance" },
  { id: 16, optionA: "Leisure & Recreation", optionB: "Competition & Achievement", category: "leisure_vs_competition" },
  {
    id: 17,
    optionA: "Relationships & Social Connection",
    optionB: "Meaningful Work",
    category: "relationships_vs_meaning",
  },
  { id: 18, optionA: "Personal Autonomy", optionB: "Competition & Achievement", category: "autonomy_vs_competition" },
  { id: 19, optionA: "Health & Physical Well-being", optionB: "Leisure & Recreation", category: "health_vs_leisure" },
  { id: 20, optionA: "Financial Security", optionB: "Competition & Achievement", category: "finance_vs_competition" },
  {
    id: 21,
    optionA: "Relationships & Social Connection",
    optionB: "Leisure & Recreation",
    category: "relationships_vs_leisure",
  },
]

const valueCategories = [
  {
    key: "q_health",
    label: "Health & Physical Well-being",
    description: "Physical fitness, nutrition, sleep, and overall health",
  },
  {
    key: "q_relationships",
    label: "Relationships & Social Connection",
    description: "Family, friends, community, and social bonds",
  },
  {
    key: "q_finance",
    label: "Financial Security",
    description: "Economic stability, wealth, and financial independence",
  },
  { key: "q_autonomy", label: "Personal Autonomy", description: "Freedom, independence, and self-determination" },
  { key: "q_meaning", label: "Meaningful Work", description: "Purpose, contribution, and fulfilling career" },
  { key: "q_leisure", label: "Leisure & Recreation", description: "Fun, hobbies, entertainment, and relaxation" },
  {
    key: "q_competition",
    label: "Competition & Achievement",
    description: "Success, recognition, and competitive accomplishment",
  },
]

export default function WizardPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Pairwise comparisons
  const [pairwiseAnswers, setPairwiseAnswers] = useState<Record<string, string>>({})

  // Step 2: Value sliders
  const [valueSliders, setValueSliders] = useState<Record<string, number>>({
    q_health: 50,
    q_relationships: 50,
    q_finance: 50,
    q_autonomy: 50,
    q_meaning: 50,
    q_leisure: 50,
    q_competition: 50,
  })

  // Step 3: Recording preferences
  const [recordMode, setRecordMode] = useState("quick")

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Calculate running total for value sliders
  const sliderTotal = Object.values(valueSliders).reduce((sum, value) => sum + value, 0)
  const isSliderTotalValid = sliderTotal === 350 // 7 categories * 50 average

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const handlePairwiseAnswer = (questionId: number, answer: string) => {
    setPairwiseAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSliderChange = (key: string, value: number[]) => {
    setValueSliders((prev) => ({
      ...prev,
      [key]: value[0],
    }))
  }

  const calculateValueScores = () => {
    // Calculate scores based on pairwise comparisons
    const scores: Record<string, number> = {
      q_health: 0,
      q_relationships: 0,
      q_finance: 0,
      q_autonomy: 0,
      q_meaning: 0,
      q_leisure: 0,
      q_competition: 0,
    }

    // Process pairwise answers to calculate initial scores
    Object.entries(pairwiseAnswers).forEach(([questionId, answer]) => {
      const question = pairwiseQuestions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        // Map answers to score increments
        if (answer === question.optionA) {
          // Increment score for option A
          if (question.optionA.includes("Health")) scores.q_health += 1
          else if (question.optionA.includes("Relationships")) scores.q_relationships += 1
          else if (question.optionA.includes("Financial")) scores.q_finance += 1
          else if (question.optionA.includes("Autonomy")) scores.q_autonomy += 1
          else if (question.optionA.includes("Meaningful")) scores.q_meaning += 1
          else if (question.optionA.includes("Leisure")) scores.q_leisure += 1
          else if (question.optionA.includes("Competition")) scores.q_competition += 1
        } else {
          // Increment score for option B
          if (question.optionB.includes("Health")) scores.q_health += 1
          else if (question.optionB.includes("Relationships")) scores.q_relationships += 1
          else if (question.optionB.includes("Financial")) scores.q_finance += 1
          else if (question.optionB.includes("Autonomy")) scores.q_autonomy += 1
          else if (question.optionB.includes("Meaningful")) scores.q_meaning += 1
          else if (question.optionB.includes("Leisure")) scores.q_leisure += 1
          else if (question.optionB.includes("Competition")) scores.q_competition += 1
        }
      }
    })

    // Normalize scores to 1-100 range and apply slider adjustments
    const maxScore = Math.max(...Object.values(scores))
    const normalizedScores: Record<string, number> = {}

    Object.entries(scores).forEach(([key, score]) => {
      const normalized = maxScore > 0 ? Math.round((score / maxScore) * 50) + 25 : 50
      normalizedScores[key] = Math.round((normalized + valueSliders[key]) / 2)
    })

    return normalizedScores
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const finalScores = calculateValueScores()

      // Create or update profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        user_name: user.user_name,
        record_mode: recordMode,
        created_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Create value settings
      const { error: valueError } = await supabase.from("value_settings").upsert({
        profile_id: user.id,
        ...finalScores,
        created_at: new Date().toISOString(),
      })

      if (valueError) throw valueError

      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "An error occurred while saving your preferences")
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedFromStep1 = Object.keys(pairwiseAnswers).length === pairwiseQuestions.length
  const canProceedFromStep2 = isSliderTotalValid

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-card to-muted">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push("/welcome"))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Badge variant="secondary">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Setup Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Personal Values Assessment</CardTitle>
              <CardDescription>
                We'll show you pairs of values. Choose which one is more important to you personally. There are no right
                or wrong answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {pairwiseQuestions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Question {index + 1} of {pairwiseQuestions.length}
                    </h3>
                    {pairwiseAnswers[question.id] && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">Which is more important to you?</p>
                  <RadioGroup
                    value={pairwiseAnswers[question.id] || ""}
                    onValueChange={(value) => handlePairwiseAnswer(question.id, value)}
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={question.optionA} id={`${question.id}-a`} />
                      <Label htmlFor={`${question.id}-a`} className="flex-1 cursor-pointer">
                        {question.optionA}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value={question.optionB} id={`${question.id}-b`} />
                      <Label htmlFor={`${question.id}-b`} className="flex-1 cursor-pointer">
                        {question.optionB}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} disabled={!canProceedFromStep1} size="lg">
                  Continue to Value Tuning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Fine-tune Your Values</CardTitle>
              <CardDescription>
                Adjust the importance of each value category. The total must equal 350 points.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span className="font-medium">Total Points:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${isSliderTotalValid ? "text-primary" : "text-destructive"}`}>
                    {sliderTotal}
                  </span>
                  <span className="text-muted-foreground">/ 350</span>
                  {isSliderTotalValid && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
              </div>

              {valueCategories.map((category) => (
                <div key={category.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant="outline">{valueSliders[category.key]} points</Badge>
                  </div>
                  <Slider
                    value={[valueSliders[category.key]]}
                    onValueChange={(value) => handleSliderChange(category.key, value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}

              {!isSliderTotalValid && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please adjust your values so the total equals 350 points. You're currently{" "}
                    {sliderTotal > 350 ? "over" : "under"} by {Math.abs(350 - sliderTotal)} points.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(3)} disabled={!canProceedFromStep2} size="lg">
                  Continue to Preferences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recording Preferences</CardTitle>
              <CardDescription>Choose how you'd like to record your daily experiences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={recordMode} onValueChange={setRecordMode}>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="quick" id="quick" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="quick" className="cursor-pointer">
                      <div className="font-medium">Quick Log</div>
                      <div className="text-sm text-muted-foreground">
                        Simple sliders and brief notes. Perfect for daily tracking without much time investment.
                      </div>
                    </Label>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="detailed" className="cursor-pointer">
                      <div className="font-medium">Deep Dive</div>
                      <div className="text-sm text-muted-foreground">
                        Comprehensive tracking with detailed questions and longer reflection periods.
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading} size="lg">
                  {isLoading ? "Setting up..." : "Complete Setup"}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

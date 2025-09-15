"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Settings, Save, Download, Trash2, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

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

const personas = [
  {
    id: "balanced",
    name: "Balanced Explorer",
    description: "Values all aspects of life equally",
    values: {
      q_health: 50,
      q_relationships: 50,
      q_finance: 50,
      q_autonomy: 50,
      q_meaning: 50,
      q_leisure: 50,
      q_competition: 50,
    },
  },
  {
    id: "wellness_focused",
    name: "Wellness Warrior",
    description: "Prioritizes health and personal well-being",
    values: {
      q_health: 70,
      q_relationships: 60,
      q_finance: 40,
      q_autonomy: 50,
      q_meaning: 45,
      q_leisure: 55,
      q_competition: 30,
    },
  },
  {
    id: "relationship_centered",
    name: "Connection Seeker",
    description: "Values relationships and social bonds above all",
    values: {
      q_health: 50,
      q_relationships: 80,
      q_finance: 40,
      q_autonomy: 45,
      q_meaning: 55,
      q_leisure: 50,
      q_competition: 30,
    },
  },
  {
    id: "achievement_oriented",
    name: "Goal Achiever",
    description: "Driven by success and meaningful accomplishments",
    values: {
      q_health: 45,
      q_relationships: 50,
      q_finance: 60,
      q_autonomy: 55,
      q_meaning: 70,
      q_leisure: 35,
      q_competition: 85,
    },
  },
  {
    id: "freedom_seeker",
    name: "Freedom Seeker",
    description: "Values independence and personal autonomy",
    values: {
      q_health: 55,
      q_relationships: 45,
      q_finance: 50,
      q_autonomy: 80,
      q_meaning: 60,
      q_leisure: 60,
      q_competition: 40,
    },
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, valueSettings, setProfile, setValueSettings } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [recordMode, setRecordMode] = useState("quick")
  const [selectedPersona, setSelectedPersona] = useState("")
  const [valueSliders, setValueSliders] = useState<Record<string, number>>({
    q_health: 50,
    q_relationships: 50,
    q_finance: 50,
    q_autonomy: 50,
    q_meaning: 50,
    q_leisure: 50,
    q_competition: 50,
  })

  // Profile form states
  const [profileForm, setProfileForm] = useState({
    user_name: "",
    age_group: "",
    gender_identity: "",
    country: "",
    living_situation: "",
    marital_status: "",
    has_children: "",
    occupation_category: "",
    income_range: "",
    chronic_illness: "",
  })

  // Account deletion
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const sliderTotal = Object.values(valueSliders).reduce((sum, value) => sum + value, 0)
  const isSliderTotalValid = sliderTotal === 350

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    loadSettings()
  }, [user])

  const loadSettings = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      // Load profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
        setRecordMode(profileData.record_mode || "quick")
        setProfileForm({
          user_name: profileData.user_name || "",
          age_group: profileData.age_group || "",
          gender_identity: profileData.gender_identity || "",
          country: profileData.country || "",
          living_situation: profileData.living_situation || "",
          marital_status: profileData.marital_status || "",
          has_children: profileData.has_children || "",
          occupation_category: profileData.occupation_category || "",
          income_range: profileData.income_range || "",
          chronic_illness: profileData.chronic_illness || "",
        })
      }

      // Load value settings
      const { data: valueData } = await supabase.from("value_settings").select("*").eq("profile_id", user.id).single()

      if (valueData) {
        setValueSettings(valueData)
        setValueSliders({
          q_health: valueData.q_health,
          q_relationships: valueData.q_relationships,
          q_finance: valueData.q_finance,
          q_autonomy: valueData.q_autonomy,
          q_meaning: valueData.q_meaning,
          q_leisure: valueData.q_leisure,
          q_competition: valueData.q_competition,
        })
      }
    } catch (error: any) {
      setError("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePersonaSelect = (personaId: string) => {
    const persona = personas.find((p) => p.id === personaId)
    if (persona) {
      setSelectedPersona(personaId)
      setValueSliders(persona.values)
    }
  }

  const handleSliderChange = (key: string, value: number[]) => {
    setValueSliders((prev) => ({
      ...prev,
      [key]: value[0],
    }))
    setSelectedPersona("") // Clear persona selection when manually adjusting
  }

  const saveRecordingSettings = async () => {
    if (!user) return

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update({ record_mode: recordMode }).eq("id", user.id)

      if (error) throw error

      setSuccess("Recording preferences saved!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to save recording preferences")
    } finally {
      setIsSaving(false)
    }
  }

  const saveCompassTuning = async () => {
    if (!user || !isSliderTotalValid) return

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("value_settings").upsert({
        profile_id: user.id,
        ...valueSliders,
      })

      if (error) throw error

      setValueSettings({
        profile_id: user.id,
        id: valueSettings?.id || 0,
        created_at: new Date().toISOString(),
        ...valueSliders,
      })
      setSuccess("Value settings saved!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to save value settings")
    } finally {
      setIsSaving(false)
    }
  }

  const saveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").update(profileForm).eq("id", user.id)

      if (error) throw error

      setProfile({ ...profile, ...profileForm })
      setSuccess("Profile updated!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const exportData = async () => {
    if (!user) return

    try {
      const supabase = createClient()

      // Get all user data
      const [profileResult, valueSettingsResult, recordsResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("value_settings").select("*").eq("profile_id", user.id).single(),
        supabase.from("records").select("*").eq("profile_id", user.id).order("record_date", { ascending: true }),
      ])

      const exportData = {
        profile: profileResult.data,
        valueSettings: valueSettingsResult.data,
        records: recordsResult.data,
        exportDate: new Date().toISOString(),
      }

      // Create and download CSV
      const csvContent = convertToCSV(recordsResult.data || [])
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `harmony-navigator-data-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setSuccess("Data exported successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError("Failed to export data")
    }
  }

  const convertToCSV = (records: any[]) => {
    if (!records.length) return "No data to export"

    const headers = Object.keys(records[0]).join(",")
    const rows = records.map((record) => Object.values(record).join(","))
    return [headers, ...rows].join("\n")
  }

  const deleteAccount = async () => {
    if (!user || !deletePassword) return

    setIsDeleting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      })

      if (signInError) throw new Error("Invalid password")

      // Delete user data (RLS will handle permissions)
      await Promise.all([
        supabase.from("records").delete().eq("profile_id", user.id),
        supabase.from("value_settings").delete().eq("profile_id", user.id),
        supabase.from("profiles").delete().eq("id", user.id),
      ])

      // Delete auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) throw deleteError

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Failed to delete account")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </div>
      </div>

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
        <Tabs defaultValue="recording" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recording">Recording</TabsTrigger>
            <TabsTrigger value="compass">Compass</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="recording" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recording Settings</CardTitle>
                <CardDescription>Choose how you prefer to track your daily experiences</CardDescription>
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
                <Button onClick={saveRecordingSettings} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Recording Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compass" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Compass Tuning</CardTitle>
                <CardDescription>Adjust your personal values to fine-tune your well-being compass</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Choose a Persona (Optional)</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {personas.map((persona) => (
                      <div
                        key={persona.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedPersona === persona.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => handlePersonaSelect(persona.id)}
                      >
                        <div className="font-medium">{persona.name}</div>
                        <div className="text-sm text-muted-foreground">{persona.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

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

                <Button onClick={saveCompassTuning} disabled={isSaving || !isSliderTotalValid}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Value Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your demographic and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">Name</Label>
                    <Input
                      id="user_name"
                      value={profileForm.user_name}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, user_name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age_group">Age Group</Label>
                    <Select
                      value={profileForm.age_group}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, age_group: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55-64">55-64</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender_identity">Gender Identity</Label>
                    <Select
                      value={profileForm.gender_identity}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, gender_identity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender identity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileForm.country}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="Your country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="living_situation">Living Situation</Label>
                    <Select
                      value={profileForm.living_situation}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, living_situation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select living situation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alone">Live alone</SelectItem>
                        <SelectItem value="with-partner">With partner</SelectItem>
                        <SelectItem value="with-family">With family</SelectItem>
                        <SelectItem value="with-roommates">With roommates</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select
                      value={profileForm.marital_status}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, marital_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="in-relationship">In a relationship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={saveProfile} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Download your data in CSV format</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportData} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data as CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="delete-password">Confirm your password</Label>
                        <Input
                          id="delete-password"
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeletePassword("")}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={deleteAccount} disabled={!deletePassword || isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

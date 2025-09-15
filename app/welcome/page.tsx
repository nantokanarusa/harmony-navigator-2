import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Brain, BarChart3, CheckCircle } from "lucide-react"

export default async function WelcomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: valueSettings } = await supabase.from("value_settings").select("*").eq("profile_id", user.id).single()

  if (profile && valueSettings) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-muted">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <Badge variant="secondary" className="w-fit mx-auto">
            Welcome to Harmony Navigator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            Welcome, {user.user_metadata?.user_name || "Friend"}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            You're about to embark on a journey of self-discovery. Let's set up your personal compass in just a few
            simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="border-0 shadow-sm text-center">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">1. Record</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Capture your daily experiences with our intuitive logging system. Quick entries or deep dives - your
                choice.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm text-center">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">2. Understand</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI analyzes your patterns and reveals insights about what drives your happiness and fulfillment.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm text-center">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">3. Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get personalized recommendations and track your progress toward a more harmonious life.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription>
              We'll guide you through a quick setup process to personalize your experience. This takes about 5 minutes
              and helps us understand what matters most to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Answer 21 quick preference questions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Set your personal value priorities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Choose your recording preferences</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/wizard" className="flex-1">
                <Button size="lg" className="w-full">
                  Start Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Skip for Now
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              You can always complete this setup later in your settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

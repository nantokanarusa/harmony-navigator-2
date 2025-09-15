import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Brain, Heart, Shield, Star, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-card to-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Your Personal Well-being Compass
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                  Discover What Truly <span className="text-primary">Matters</span> to You
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Track your daily experiences, understand your patterns, and grow toward a more fulfilling life with
                  Harmony Navigator's personalized insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Privacy-first design</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>10,000+ users</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 flex items-center justify-center">
                <img
                  src="/peaceful-meditation-scene-with-person-sitting-by-c.jpg"
                  alt="Peaceful meditation scene representing personal well-being"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple. Powerful. Personal.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Three simple steps to unlock deeper insights about your well-being journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Record</h3>
              <p className="text-muted-foreground text-pretty">
                Capture your daily experiences with our intuitive logging system. Quick entries or deep dives - your
                choice.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">2. Understand</h3>
              <p className="text-muted-foreground text-pretty">
                Our AI analyzes your patterns and reveals insights about what drives your happiness and fulfillment.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Grow</h3>
              <p className="text-muted-foreground text-pretty">
                Get personalized recommendations and track your progress toward a more harmonious life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Comprehensive tools designed to support your personal growth journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Daily Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Log your experiences with customizable sliders and secure, encrypted journaling.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  Visual Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Interactive charts and analytics that reveal patterns in your well-being over time.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personalized suggestions based on your unique patterns and preferences.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Your data is encrypted and secure. You own your information, always.</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Achievement System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay motivated with streaks, milestones, and personalized achievement badges.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  Research Backed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Built on validated psychological research and well-being frameworks.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">See Your Progress</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Beautiful, intuitive dashboards that make understanding your well-being effortless
            </p>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-card to-muted rounded-2xl p-8 flex items-center justify-center shadow-2xl">
              <img
                src="/clean-modern-dashboard-interface-with-charts-and-w.jpg"
                alt="Dashboard preview showing wellness tracking interface"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Start Your Journey?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-pretty">
            Join thousands of people who are already discovering what truly matters to them with Harmony Navigator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-75">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="font-semibold text-lg">Harmony Navigator</span>
              </div>
              <p className="text-sm text-muted-foreground">Your personal compass for well-being and growth.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Security
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Harmony Navigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

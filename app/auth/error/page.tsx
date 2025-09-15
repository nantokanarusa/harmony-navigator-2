import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-muted">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground text-center">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">An unspecified authentication error occurred.</p>
            )}
            <div className="space-y-2">
              <Link href="/auth" className="block">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlanForm } from "@/components/dashboard/plan-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_trainer) {
    redirect("/feed")
  }

  // Get the plan
  const { data: plan, error } = await supabase
    .from("fitness_plans")
    .select("*")
    .eq("id", id)
    .eq("trainer_id", user.id)
    .single()

  if (error || !plan) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Fitness Plan</h1>
          <p className="text-muted-foreground">Update your fitness plan details</p>
        </div>

        <PlanForm trainerId={user.id} plan={plan} />
      </main>
    </div>
  )
}

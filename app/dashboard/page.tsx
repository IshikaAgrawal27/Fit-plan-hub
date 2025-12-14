import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PlansList } from "@/components/dashboard/plans-list"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_trainer) {
    redirect("/feed")
  }

  const { data: plans } = await supabase
    .from("fitness_plans")
    .select("*, subscriptions(count)")
    .eq("trainer_id", user.id)
    .order("created_at", { ascending: false })

  const totalPlans = plans?.length || 0
  const totalSubscribers = plans?.reduce((acc, plan) => acc + (plan.subscriptions?.[0]?.count || 0), 0) || 0
  const totalRevenue = plans?.reduce((acc, plan) => acc + plan.price * (plan.subscriptions?.[0]?.count || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
                <Link href="/feed">Feed</Link>
              </Button>
              <form
                action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect("/auth/login")
                }}
              >
                <Button type="submit" variant="ghost" size="sm" className="text-sm font-normal">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3">{profile?.full_name}</h1>
          <p className="text-lg text-muted-foreground font-light">Trainer dashboard</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <div className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm space-y-1">
            <p className="text-sm text-muted-foreground font-light">Total Programs</p>
            <p className="text-4xl font-semibold tracking-tight">{totalPlans}</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm space-y-1">
            <p className="text-sm text-muted-foreground font-light">Subscribers</p>
            <p className="text-4xl font-semibold tracking-tight">{totalSubscribers}</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm space-y-1">
            <p className="text-sm text-muted-foreground font-light">Revenue</p>
            <p className="text-4xl font-semibold tracking-tight">${totalRevenue.toFixed(0)}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Your Programs</h2>
            <Button asChild className="rounded-full">
              <Link href="/dashboard/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Link>
            </Button>
          </div>
          <PlansList plans={plans || []} />
        </div>
      </main>
    </div>
  )
}

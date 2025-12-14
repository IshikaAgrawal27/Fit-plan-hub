import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlanCard } from "@/components/plans/plan-card"

export default async function MyPlansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      plan:fitness_plans(
        *,
        trainer:profiles!fitness_plans_trainer_id_fkey(*)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("subscribed_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/my-plans" className="text-xl font-semibold tracking-tight">
              My Programs
            </Link>
            <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
              <Link href="/feed">Feed</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3">Your Programs</h1>
          <p className="text-lg text-muted-foreground font-light">Active subscriptions</p>
        </div>

        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((sub) => (
              <PlanCard key={sub.id} plan={sub.plan} trainer={sub.plan.trainer} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <p className="text-lg text-muted-foreground font-light">No active programs.</p>
            <Button asChild className="rounded-full">
              <Link href="/feed">Browse Programs</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

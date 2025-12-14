import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, User } from "lucide-react"
import { notFound } from "next/navigation"
import { SubscribeButton } from "@/components/plans/subscribe-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PlanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Get the plan with trainer info
  const { data: plan, error } = await supabase
    .from("fitness_plans")
    .select(
      `
      *,
      trainer:profiles!fitness_plans_trainer_id_fkey(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !plan) {
    notFound()
  }

  // Check if user is subscribed
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_id", id)
    .single()

  const isSubscribed = !!subscription
  const isTrainer = profile?.is_trainer && plan.trainer_id === user.id

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/feed" className="text-xl font-semibold tracking-tight">
              FitPlanHub
            </Link>
            <div className="flex items-center gap-2">
              {profile?.is_trainer && (
                <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
                <Link href="/feed">Feed</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isSubscribed && (
                  <Badge className="rounded-full bg-foreground text-background font-normal">Subscribed</Badge>
                )}
                {isTrainer && (
                  <Badge variant="outline" className="rounded-full font-normal">
                    Your Plan
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-balance">{plan.title}</h1>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground font-light">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{plan.duration_days} days</span>
              </div>
            </div>

            <div className="space-y-4">
              {isSubscribed ? (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight">Program Details</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                    {plan.description}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold tracking-tight">Preview</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    {plan.description.length > 200 ? `${plan.description.slice(0, 200)}...` : plan.description}
                  </p>
                  <p className="text-sm text-muted-foreground font-light pt-4">
                    Subscribe to access the complete program and all training materials.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <div className="space-y-6 p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-muted">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{plan.trainer.full_name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground font-light">Certified Trainer</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/40 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">${plan.price}</span>
                </div>
                {!isTrainer && (
                  <SubscribeButton
                    planId={plan.id}
                    planTitle={plan.title}
                    planPrice={plan.price}
                    userId={user.id}
                    isSubscribed={isSubscribed}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

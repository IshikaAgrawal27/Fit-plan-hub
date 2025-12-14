import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { notFound } from "next/navigation"
import { FollowButton } from "@/components/trainers/follow-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlanCard } from "@/components/plans/plan-card"

export default async function TrainerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: trainer, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("is_trainer", true)
    .single()

  if (error || !trainer) {
    notFound()
  }

  const { data: plans } = await supabase
    .from("fitness_plans")
    .select("*")
    .eq("trainer_id", id)
    .order("created_at", { ascending: false })

  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", id)

  const { data: followRecord } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", user.id)
    .eq("trainer_id", id)
    .single()

  const isFollowing = !!followRecord

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/feed" className="text-xl font-semibold tracking-tight">
              FitPlanHub
            </Link>
            <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
              <Link href="/feed">Feed</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16 max-w-6xl">
        <div className="mb-16 p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-muted">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                  {trainer.full_name || "Anonymous"}
                </h1>
                <p className="text-muted-foreground font-light">Certified Trainer</p>
              </div>

              {trainer.bio && (
                <p className="text-muted-foreground font-light leading-relaxed max-w-2xl">{trainer.bio}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground font-light">
                <div>
                  <span className="font-semibold text-foreground text-base">{followerCount || 0}</span> followers
                </div>
                <div>
                  <span className="font-semibold text-foreground text-base">{plans?.length || 0}</span> programs
                </div>
              </div>

              {user.id !== id && <FollowButton trainerId={id} userId={user.id} isFollowing={isFollowing} />}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight">Training Programs</h2>
          {plans && plans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} trainer={trainer} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground font-light">No programs available yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

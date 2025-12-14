import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanCard } from "@/components/plans/plan-card"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get followed trainer IDs
  const { data: follows } = await supabase.from("follows").select("trainer_id").eq("follower_id", user.id)

  const followedTrainerIds = follows?.map((f) => f.trainer_id) || []

  // Get plans from followed trainers
  let followedPlans: any[] = []
  if (followedTrainerIds.length > 0) {
    const { data } = await supabase
      .from("fitness_plans")
      .select(
        `
        *,
        trainer:profiles!fitness_plans_trainer_id_fkey(*)
      `,
      )
      .in("trainer_id", followedTrainerIds)
      .order("created_at", { ascending: false })
      .limit(20)

    followedPlans = data || []
  }

  // Get user's subscriptions
  const { data: subscriptions } = await supabase.from("subscriptions").select("plan_id").eq("user_id", user.id)

  const subscribedPlanIds = subscriptions?.map((s) => s.plan_id) || []

  // Get all plans for discovery
  const { data: allPlans } = await supabase
    .from("fitness_plans")
    .select(
      `
      *,
      trainer:profiles!fitness_plans_trainer_id_fkey(*)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-2xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/feed"
              className="text-xl font-semibold tracking-tight hover:text-muted-foreground transition-colors duration-200"
            >
              FitPlanHub
            </Link>
            <nav className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm font-normal hover:bg-accent transition-all duration-200"
              >
                <Link href="/my-plans">My Plans</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm font-normal hover:bg-accent transition-all duration-200"
              >
                <Link href="/following">Following</Link>
              </Button>
              {profile?.is_trainer && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-sm font-normal hover:bg-accent transition-all duration-200"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
              <form
                action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect("/auth/login")
                }}
              >
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-sm font-normal hover:bg-accent transition-all duration-200"
                >
                  Sign out
                </Button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3 animate-in fade-in duration-500">
            {profile?.full_name || "Welcome"}
          </h1>
          <p className="text-lg text-muted-foreground font-light animate-in fade-in duration-700">
            Your personalized training programs.
          </p>
        </div>

        <Tabs defaultValue="discover" className="space-y-10">
          <TabsList className="bg-muted/50 p-1 border border-border/40">
            <TabsTrigger
              value="following"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-6 transition-all duration-200"
            >
              Following
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-6 transition-all duration-200"
            >
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="space-y-8 animate-in fade-in duration-500">
            {followedPlans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {followedPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PlanCard
                      plan={plan}
                      trainer={plan.trainer}
                      showFollowButton={true}
                      isFollowing={true}
                      currentUserId={user.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center animate-in fade-in duration-500">
                <p className="text-lg text-muted-foreground font-light mb-6">Follow trainers to see their programs.</p>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full hover:bg-accent hover:scale-105 transition-all duration-200"
                >
                  <Link href="/feed?tab=discover">Browse All</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-8 animate-in fade-in duration-500">
            {allPlans && allPlans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PlanCard
                      plan={plan}
                      trainer={plan.trainer}
                      showFollowButton={true}
                      isFollowing={followedTrainerIds.includes(plan.trainer_id)}
                      currentUserId={user.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center animate-in fade-in duration-500">
                <p className="text-lg text-muted-foreground font-light">No programs available yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

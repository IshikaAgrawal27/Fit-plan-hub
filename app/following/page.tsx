import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default async function FollowingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: follows } = await supabase
    .from("follows")
    .select(
      `
      *,
      trainer:profiles!follows_trainer_id_fkey(*)
    `,
    )
    .eq("follower_id", user.id)
    .order("followed_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/following" className="text-xl font-semibold tracking-tight">
              Following
            </Link>
            <Button asChild variant="ghost" size="sm" className="text-sm font-normal">
              <Link href="/feed">Feed</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-8 py-12 lg:py-16 max-w-3xl">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3">Following</h1>
          <p className="text-lg text-muted-foreground font-light">Trainers you follow</p>
        </div>

        {follows && follows.length > 0 ? (
          <div className="space-y-4">
            {follows.map((follow) => (
              <div
                key={follow.id}
                className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{follow.trainer.full_name || "Anonymous"}</h3>
                      <p className="text-sm text-muted-foreground font-light">{follow.trainer.email}</p>
                    </div>
                  </div>
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link href={`/trainers/${follow.trainer.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <p className="text-lg text-muted-foreground font-light">Not following any trainers yet.</p>
            <Button asChild className="rounded-full">
              <Link href="/feed">Discover Trainers</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

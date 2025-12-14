import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import type { FitnessPlan, Profile } from "@/lib/types"

type PlanCardProps = {
  plan: FitnessPlan
  trainer?: Profile
  showFollowButton?: boolean
  isFollowing?: boolean
  currentUserId?: string
}

export function PlanCard({
  plan,
  trainer,
  showFollowButton = false,
  isFollowing = false,
  currentUserId,
}: PlanCardProps) {
  return (
    <Card className="group relative border border-border/60 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-sm hover:border-border hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col overflow-hidden">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-3 mb-6">
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-foreground transition-all duration-300 group-hover:scale-[1.01] origin-left">
            {plan.title}
          </h3>
          {trainer && (
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/trainers/${trainer.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-light transition-colors duration-200 group/trainer"
              >
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover/trainer:bg-accent transition-colors duration-200">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="group-hover/trainer:underline underline-offset-2">
                  {trainer.full_name || "Anonymous"}
                </span>
              </Link>
              {showFollowButton && currentUserId && trainer.id !== currentUserId && (
                <FollowButtonMini trainerId={trainer.id} userId={currentUserId} isFollowing={isFollowing} />
              )}
            </div>
          )}
          <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">{plan.description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border/60 group-hover:border-border/80 transition-colors duration-300">
          <div className="space-y-1">
            <p className="text-2xl font-semibold tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left inline-block">
              ${plan.price}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-light">{plan.duration_days} days</span>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-accent hover:scale-105 transition-all duration-200"
          >
            <Link href={`/plans/${plan.id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FollowButtonMini({
  trainerId,
  userId,
  isFollowing,
}: { trainerId: string; userId: string; isFollowing: boolean }) {
  return (
    <form action={isFollowing ? `/api/unfollow` : `/api/follow`} method="POST">
      <input type="hidden" name="trainerId" value={trainerId} />
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        className="h-7 text-xs rounded-full hover:scale-105 transition-all duration-200"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </form>
  )
}

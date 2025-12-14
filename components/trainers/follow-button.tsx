"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"

type FollowButtonProps = {
  trainerId: string
  userId: string
  isFollowing: boolean
}

export function FollowButton({ trainerId, userId, isFollowing }: FollowButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("follows").insert({
        follower_id: userId,
        trainer_id: trainerId,
      })

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error following trainer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfollow = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("follows").delete().eq("follower_id", userId).eq("trainer_id", trainerId)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error unfollowing trainer")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFollowing) {
    return (
      <Button
        variant="outline"
        onClick={handleUnfollow}
        disabled={isLoading}
        className="rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200 hover:scale-105 bg-transparent"
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserMinus className="mr-2 h-4 w-4" />}
        {isLoading ? "Unfollowing..." : "Unfollow"}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      className="rounded-full hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/20"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
      {isLoading ? "Following..." : "Follow"}
    </Button>
  )
}

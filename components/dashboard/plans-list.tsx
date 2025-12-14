"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type Plan = {
  id: string
  title: string
  description: string
  price: number
  duration_days: number
  subscriptions?: { count: number }[]
}

export function PlansList({ plans }: { plans: Plan[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    setDeletingId(planId)
    const supabase = createClient()

    const { error } = await supabase.from("fitness_plans").delete().eq("id", planId)

    if (error) {
      alert("Error deleting plan: " + error.message)
    } else {
      router.refresh()
    }
    setDeletingId(null)
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven&apos;t created any plans yet.</p>
        <Button asChild>
          <Link href="/dashboard/plans/new">Create Your First Plan</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{plan.title}</h3>
              <Badge variant="secondary">{plan.subscriptions?.[0]?.count || 0} subscribers</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{plan.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">${plan.price}</span>
              <span className="text-muted-foreground">{plan.duration_days} days</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/plans/${plan.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)} disabled={deletingId === plan.id}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

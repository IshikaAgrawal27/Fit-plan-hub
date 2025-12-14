"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Plan = {
  id: string
  title: string
  description: string
  price: number
  duration_days: number
}

export function PlanForm({ trainerId, plan }: { trainerId: string; plan?: Plan }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: plan?.title || "",
    description: plan?.description || "",
    price: plan?.price || 0,
    duration_days: plan?.duration_days || 30,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (plan) {
        // Update existing plan
        const { error } = await supabase
          .from("fitness_plans")
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price,
            duration_days: formData.duration_days,
            updated_at: new Date().toISOString(),
          })
          .eq("id", plan.id)

        if (error) throw error
      } else {
        // Create new plan
        const { error } = await supabase.from("fitness_plans").insert({
          trainer_id: trainerId,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          duration_days: formData.duration_days,
        })

        if (error) throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input
              id="title"
              placeholder="e.g., Fat Loss Beginner Plan"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your fitness plan in detail..."
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="49.99"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="30"
                required
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

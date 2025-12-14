import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { planId } = await request.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("plan_id", planId)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 400 })
    }

    // Create subscription
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan_id: planId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, subscription: data })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

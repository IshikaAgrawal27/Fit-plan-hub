import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()

  const trainerId = formData.get("trainerId") as string
  const userId = formData.get("userId") as string

  try {
    const { error } = await supabase.from("follows").insert({
      follower_id: userId,
      trainer_id: trainerId,
    })

    if (error) throw error

    revalidatePath("/feed")
    revalidatePath("/following")
    revalidatePath(`/trainers/${trainerId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error following trainer" },
      { status: 500 },
    )
  }
}

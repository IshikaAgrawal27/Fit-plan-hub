export type Profile = {
  id: string
  email: string
  full_name: string | null
  is_trainer: boolean
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type FitnessPlan = {
  id: string
  trainer_id: string
  title: string
  description: string
  price: number
  duration_days: number
  created_at: string
  updated_at: string
  trainer?: Profile
}

export type Subscription = {
  id: string
  user_id: string
  plan_id: string
  subscribed_at: string
  plan?: FitnessPlan
}

export type Follow = {
  id: string
  follower_id: string
  trainer_id: string
  followed_at: string
  trainer?: Profile
}

"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check } from "lucide-react"
import { PaymentModal } from "@/components/payment/payment-modal"

type SubscribeButtonProps = {
  planId: string
  planTitle: string
  planPrice: number
  userId: string
  isSubscribed: boolean
}

export function SubscribeButton({ planId, planTitle, planPrice, userId, isSubscribed }: SubscribeButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleUnsubscribe = async () => {
    if (!confirm("Are you sure you want to unsubscribe from this plan?")) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) throw new Error("Failed to unsubscribe")

      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error unsubscribing from plan")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="space-y-3">
        <Button className="w-full rounded-full h-11" disabled>
          <Check className="mr-2 h-4 w-4" />
          Subscribed
        </Button>
        <Button
          variant="ghost"
          className="w-full rounded-full h-11 text-muted-foreground hover:text-foreground"
          onClick={handleUnsubscribe}
          disabled={isLoading}
        >
          {isLoading ? "Unsubscribing..." : "Unsubscribe"}
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button className="w-full rounded-full h-11" onClick={() => setShowPaymentModal(true)}>
        Subscribe
      </Button>
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        planId={planId}
        planTitle={planTitle}
        planPrice={planPrice}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

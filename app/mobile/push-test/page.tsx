import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import PushNotificationTester from "@/components/mobile/push-notification-tester"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Push Notification Testing - RepairHQ",
  description: "Test push notifications on Android devices",
}

export default async function PushTestPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id || ""

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Push Notification Testing</h1>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <PushNotificationTester userId={userId} />
      </Suspense>
    </div>
  )
}

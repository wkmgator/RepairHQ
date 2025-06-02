import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import PushNotificationRegistration from "@/components/mobile/push-notification-registration"
import { Skeleton } from "@/components/ui/skeleton"

export default async function MobileDashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id || ""

  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<Skeleton className="h-24 w-full mb-4" />}>
        <PushNotificationRegistration userId={userId} />
      </Suspense>

      {/* Rest of dashboard content */}
      <h1 className="text-2xl font-bold mb-6">Mobile Dashboard</h1>

      {/* Dashboard content here */}
    </div>
  )
}

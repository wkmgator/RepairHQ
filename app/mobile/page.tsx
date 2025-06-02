import { MobileDashboard } from "@/components/mobile/mobile-dashboard"
import { redirect } from "next/navigation"

export default function MobilePage() {
  // This would be replaced with actual auth logic
  const mockUser = {
    uid: "user123",
    role: "technician",
    storeId: "store123",
  }

  if (!mockUser) {
    redirect("/auth/signin")
  }

  return <MobileDashboard userId={mockUser.uid} userRole={mockUser.role} storeId={mockUser.storeId} />
}

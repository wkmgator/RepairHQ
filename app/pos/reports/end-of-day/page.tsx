"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function EndOfDayReportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState

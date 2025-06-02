"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

interface ReferralLinkCardProps {
  referralLink: string
}

export function ReferralLinkCard({ referralLink }: ReferralLinkCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (referralLink === "N/A - Become a reseller to get your link.") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn commissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{referralLink}</p>
          <Button disabled className="mt-2">
            Copy Link
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Link</CardTitle>
        <CardDescription>Share this link to invite others and earn rewards!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input type="text" value={referralLink} readOnly className="flex-grow" />
          <Button onClick={handleCopy} variant="outline" size="icon" aria-label="Copy referral link">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Anyone who signs up using your link will be attributed to you.
        </p>
      </CardContent>
    </Card>
  )
}

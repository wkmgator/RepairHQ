"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

export function APIIntegration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration</CardTitle>
        <CardDescription>Connect with third-party services via our API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Use our API to automate tasks, integrate with other systems, and extend the functionality of RepairHQ.</p>
        <div className="space-y-2">
          <h4 className="font-medium">Key Resources</h4>
          <ul>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                API Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Authentication Guide
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Code Samples
              </a>
            </li>
          </ul>
        </div>
        <Button variant="outline" className="w-full">
          <Code className="h-4 w-4 mr-2" />
          Developer Portal
        </Button>
      </CardContent>
    </Card>
  )
}

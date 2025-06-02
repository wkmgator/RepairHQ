"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { posSupabase } from "@/lib/supabase-pos"

export function POSOfflineTester() {
  const { toast } = useToast()
  const { isOnline, isSimulating, toggleSimulation, setSimulatedOnlineStatus } = useOnlineStatus()
  const { pendingCount, getPendingTransactions, clearPendingTransaction, clearAllPendingTransactions } = useIndexedDB()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 })
  const [showResults, setShowResults] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

  // Load pending transactions
  const loadPendingTransactions = async () => {
    setIsLoadingTransactions(true)
    try {
      const transactions = await getPendingTransactions()
      setPendingTransactions(transactions)
    } catch (error) {
      console.error("Error loading pending transactions:", error)
      toast({
        title: "Error Loading Transactions",
        description: "Could not load pending offline transactions.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  // Sync pending transactions
  const syncPendingTransactions = async () => {
    if (!isOnline) {
      toast({
        title: "Cannot Sync",
        description: "You are currently offline. Please connect to the internet to sync transactions.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    setSyncResults({ success: 0, failed: 0 })
    setShowResults(false)

    try {
      const transactions = await getPendingTransactions()
      let successCount = 0
      let failedCount = 0

      for (const transaction of transactions) {
        try {
          // Remove local ID properties that might conflict with the server
          const { id, offline_created, ...transactionData } = transaction

          // Process with Supabase
          await posSupabase.createTransaction(transactionData)

          // Clear the transaction from IndexedDB
          await clearPendingTransaction(transaction.id)

          successCount++
        } catch (error) {
          console.error("Error syncing transaction:", error)
          failedCount++
        }
      }

      setSyncResults({ success: successCount, failed: failedCount })
      setShowResults(true)

      // Reload pending transactions
      loadPendingTransactions()

      toast({
        title: "Sync Complete",
        description: `Successfully synced ${successCount} transactions. Failed: ${failedCount}`,
        variant: failedCount > 0 ? "destructive" : "default",
      })
    } catch (error) {
      console.error("Error during sync process:", error)
      toast({
        title: "Sync Error",
        description: "An error occurred during the sync process.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Load pending transactions on mount
  useEffect(() => {
    loadPendingTransactions()
  }, [pendingCount])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>POS Offline Mode Tester</CardTitle>
          <CardDescription>Test your POS system's offline functionality by simulating internet outages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Connection Status</div>
              <div className="flex items-center text-sm text-muted-foreground">
                {isOnline ? (
                  <>
                    <Wifi className="mr-2 h-4 w-4 text-green-500" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="mr-2 h-4 w-4 text-red-500" />
                    Offline
                  </>
                )}
                {isSimulating && (
                  <Badge variant="outline" className="ml-2">
                    Simulated
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimulatedOnlineStatus(!isOnline)}
                disabled={!isSimulating}
              >
                Toggle Status
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="simulation-mode" checked={isSimulating} onCheckedChange={toggleSimulation} />
            <Label htmlFor="simulation-mode">Enable Simulation Mode</Label>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Testing Instructions</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Enable simulation mode above</li>
                <li>Toggle the connection status to "Offline"</li>
                <li>Go to the POS screen and complete a transaction</li>
                <li>Toggle back to "Online" and use the sync button below</li>
                <li>Verify that transactions are properly synced</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm">
            Pending Transactions: <Badge variant="secondary">{pendingCount}</Badge>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={loadPendingTransactions} disabled={isLoadingTransactions}>
              {isLoadingTransactions ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button onClick={syncPendingTransactions} disabled={isSyncing || pendingCount === 0 || !isOnline}>
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sync Transactions
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showResults && (
        <Alert variant={syncResults.failed > 0 ? "destructive" : "default"}>
          <AlertTitle>Sync Results</AlertTitle>
          <AlertDescription>
            Successfully synced {syncResults.success} transactions. Failed: {syncResults.failed}
          </AlertDescription>
        </Alert>
      )}

      {pendingTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Offline Transactions</CardTitle>
            <CardDescription>These transactions are stored locally and will be synced when online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Transaction #</th>
                    <th className="p-2 text-left">Created</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-center">Items</th>
                    <th className="p-2 text-center">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t">
                      <td className="p-2">{transaction.transaction_number}</td>
                      <td className="p-2">{new Date(transaction.offline_created).toLocaleString()}</td>
                      <td className="p-2 text-right">${transaction.total_amount.toFixed(2)}</td>
                      <td className="p-2 text-center">{transaction.items.length}</td>
                      <td className="p-2 text-center">
                        <Badge variant="outline">{transaction.payment_method}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => clearAllPendingTransactions()}
              disabled={isSyncing}
            >
              Clear All Pending Transactions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

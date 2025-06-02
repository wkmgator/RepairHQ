"use client"

import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { useIndexedDB, type OfflinePOSTransaction } from "@/hooks/useIndexedDB"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wifi, WifiOff, CloudIcon as CloudSync, ListChecks, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { posSupabase } from "@/lib/supabase-pos"
import { format } from "date-fns"

export function OfflineStatusIndicator() {
  const { isOnline } = useOnlineStatus()
  const {
    pendingCount,
    getPendingTransactions,
    clearPendingTransaction,
    clearAllPendingTransactions,
    isLoading: isDbLoading,
  } = useIndexedDB()
  const [isSyncing, setIsSyncing] = useState(false)
  const [showPendingDialog, setShowPendingDialog] = useState(false)
  const [pendingTransactionsList, setPendingTransactionsList] = useState<OfflinePOSTransaction[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (showPendingDialog) {
      fetchPendingTransactions()
    }
  }, [showPendingDialog])

  const fetchPendingTransactions = async () => {
    if (isDbLoading) return
    const transactions = await getPendingTransactions()
    setPendingTransactionsList(transactions)
  }

  const syncTransactions = async () => {
    if (!isOnline || pendingCount === 0) {
      toast({
        title: "Cannot Sync",
        description: !isOnline ? "You are offline." : "No pending transactions to sync.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    try {
      const transactionsToSync = await getPendingTransactions() // Fetch fresh list
      let successCount = 0
      let errorCount = 0

      for (const transaction of transactionsToSync) {
        try {
          // Remove local ID properties that might conflict with the server or are not part of the server schema
          const { id, offline_created_at, sync_error, ...transactionDataForSupabase } = transaction
          // If the original transaction had an ID (not a 'local-' one), it means it was likely an update scenario
          // For this simple sync, we assume all are new creations. Complex scenarios need more logic.
          const payload = { ...transactionDataForSupabase, id: undefined } // Ensure Supabase generates ID

          await posSupabase.createTransaction(payload)
          await clearPendingTransaction(transaction.id!) // Use the ID from IndexedDB record
          successCount++
        } catch (error) {
          console.error("Error syncing transaction:", transaction.transaction_number, error)
          errorCount++
          // Optionally mark transaction with sync_error in IndexedDB here
        }
      }

      toast({
        title: "Sync Complete",
        description: `Successfully synced ${successCount} transaction(s). ${errorCount > 0 ? `${errorCount} failed.` : ""}`,
      })
      if (showPendingDialog) fetchPendingTransactions() // Refresh list in dialog
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

  const handleClearTransaction = async (id: string) => {
    await clearPendingTransaction(id)
    toast({ title: "Transaction Cleared", description: "Selected transaction removed from local queue." })
    fetchPendingTransactions() // Refresh list
  }

  const handleClearAllTransactions = async () => {
    await clearAllPendingTransactions()
    toast({ title: "All Transactions Cleared", description: "All pending transactions removed from local queue." })
    setShowPendingDialog(false) // Close dialog as list is empty
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isDbLoading) {
    return <Badge variant="outline">Loading Status...</Badge>
  }

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
          <Wifi className="mr-1 h-3 w-3" />
          Online
        </Badge>
      ) : (
        <Badge variant="destructive" className="bg-red-50 border-red-200 text-red-700">
          <WifiOff className="mr-1 h-3 w-3" />
          Offline Mode
        </Badge>
      )}

      {pendingCount > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setShowPendingDialog(true)}
            disabled={isSyncing}
          >
            <ListChecks className="mr-1 h-3 w-3" />
            {pendingCount} Pending
          </Button>
          {isOnline && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={syncTransactions}
              disabled={isSyncing || !isOnline}
            >
              {isSyncing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <CloudSync className="mr-1 h-3 w-3" />}
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          )}
        </>
      )}

      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pending Offline Transactions ({pendingTransactionsList.length})</DialogTitle>
            <DialogDescription>
              These transactions were saved while offline and are waiting to be synced.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-3">
            {pendingTransactionsList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No pending transactions.</p>
            ) : (
              <div className="space-y-2">
                {pendingTransactionsList.map((tx) => (
                  <div key={tx.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{tx.transaction_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(tx.total_amount)} - Saved:{" "}
                        {tx.offline_created_at ? format(new Date(tx.offline_created_at), "Pp") : "N/A"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => tx.id && handleClearTransaction(tx.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="sm:justify-between mt-4">
            <Button
              variant="destructive"
              onClick={handleClearAllTransactions}
              disabled={pendingTransactionsList.length === 0 || isSyncing}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                onClick={syncTransactions}
                disabled={pendingTransactionsList.length === 0 || isSyncing || !isOnline}
              >
                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudSync className="mr-2 h-4 w-4" />}
                Sync All
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

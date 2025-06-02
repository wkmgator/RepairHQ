"use client"

import { useState, useEffect } from "react"
import { openDB, type IDBPDatabase } from "idb"
import { nanoid } from "nanoid"
import type { POSTransaction as OriginalPOSTransaction } from "@/lib/supabase-pos" // Renamed to avoid conflict

// Define an interface for transactions stored in IndexedDB, extending the original
export interface OfflinePOSTransaction extends OriginalPOSTransaction {
  offline_created_at?: string // Timestamp when saved offline
  sync_error?: string // Error message if sync failed
}

interface IndexedDBHook {
  saveTransaction: (transaction: OriginalPOSTransaction) => Promise<string>
  getPendingTransactions: () => Promise<OfflinePOSTransaction[]>
  clearPendingTransaction: (id: string) => Promise<void>
  clearAllPendingTransactions: () => Promise<void>
  pendingCount: number
  isLoading: boolean
  error: Error | null
}

const DB_NAME = "repairhq_pos"
const DB_VERSION = 1 // Keep version, if schema changes, increment this
const TRANSACTION_STORE = "offline_transactions"

export function useIndexedDB(): IndexedDBHook {
  const [db, setDb] = useState<IDBPDatabase | null>(null)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize the database
  useEffect(() => {
    async function initDB() {
      try {
        setIsLoading(true)
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(TRANSACTION_STORE)) {
              db.createObjectStore(TRANSACTION_STORE, { keyPath: "id" })
            }
          },
        })
        setDb(database)

        const count = await database.count(TRANSACTION_STORE)
        setPendingCount(count)
        setIsLoading(false)
      } catch (err) {
        console.error("Error initializing IndexedDB:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
      }
    }

    initDB()

    return () => {
      db?.close()
    }
  }, []) // db dependency removed to avoid re-initialization loops

  const updatePendingCount = async (currentDb: IDBPDatabase) => {
    const count = await currentDb.count(TRANSACTION_STORE)
    setPendingCount(count)
  }

  // Save a transaction to IndexedDB
  const saveTransaction = async (transaction: OriginalPOSTransaction): Promise<string> => {
    if (!db) throw new Error("Database not initialized")

    try {
      const localId = transaction.id || `local-${nanoid()}`
      const transactionToStore: OfflinePOSTransaction = {
        ...transaction,
        id: localId, // Ensure ID is set
        offline_created_at: new Date().toISOString(),
      }

      await db.put(TRANSACTION_STORE, transactionToStore)
      await updatePendingCount(db)
      return localId
    } catch (err) {
      console.error("Error saving transaction to IndexedDB:", err)
      throw err
    }
  }

  // Get all pending transactions
  const getPendingTransactions = async (): Promise<OfflinePOSTransaction[]> => {
    if (!db) throw new Error("Database not initialized")

    try {
      return await db.getAll(TRANSACTION_STORE)
    } catch (err) {
      console.error("Error getting pending transactions from IndexedDB:", err)
      throw err
    }
  }

  // Clear a specific pending transaction
  const clearPendingTransaction = async (id: string): Promise<void> => {
    if (!db) throw new Error("Database not initialized")

    try {
      await db.delete(TRANSACTION_STORE, id)
      await updatePendingCount(db)
    } catch (err) {
      console.error("Error clearing pending transaction from IndexedDB:", err)
      throw err
    }
  }

  // Clear all pending transactions
  const clearAllPendingTransactions = async (): Promise<void> => {
    if (!db) throw new Error("Database not initialized")

    try {
      await db.clear(TRANSACTION_STORE)
      setPendingCount(0)
    } catch (err) {
      console.error("Error clearing all pending transactions from IndexedDB:", err)
      throw err
    }
  }

  return {
    saveTransaction,
    getPendingTransactions,
    clearPendingTransaction,
    clearAllPendingTransactions,
    pendingCount,
    isLoading,
    error,
  }
}

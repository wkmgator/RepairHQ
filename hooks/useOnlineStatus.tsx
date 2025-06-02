"use client"

import { useState, useEffect } from "react"

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [simulatedStatus, setSimulatedStatus] = useState<boolean>(true)

  useEffect(() => {
    const handleOnline = () => {
      if (!isSimulating) {
        setIsOnline(true)
      }
    }

    const handleOffline = () => {
      if (!isSimulating) {
        setIsOnline(false)
      }
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isSimulating])

  // Function to toggle simulation mode
  const toggleSimulation = (simulate: boolean) => {
    setIsSimulating(simulate)
    if (!simulate) {
      // If turning off simulation, revert to actual online status
      setIsOnline(navigator.onLine)
      setSimulatedStatus(navigator.onLine)
    }
  }

  // Function to set simulated online status
  const setSimulatedOnlineStatus = (status: boolean) => {
    if (isSimulating) {
      setIsOnline(status)
      setSimulatedStatus(status)
    }
  }

  return {
    isOnline,
    isSimulating,
    simulatedStatus,
    toggleSimulation,
    setSimulatedOnlineStatus,
  }
}

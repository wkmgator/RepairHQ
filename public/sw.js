const CACHE_NAME = "repairhq-mobile-v1.0.0"
const urlsToCache = [
  "/mobile",
  "/mobile/dashboard",
  "/mobile/tickets",
  "/mobile/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Background sync for Android
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

// Push notifications for Android
self.addEventListener("push", (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch (e) {
    payload = {
      title: "RepairHQ Notification",
      body: event.data ? event.data.text() : "New notification from RepairHQ",
    }
  }

  const title = payload.title || "RepairHQ Notification"
  const options = {
    body: payload.body || "You have a new notification",
    icon: payload.icon || "/icons/icon-192x192.png",
    badge: payload.badge || "/icons/badge-72x72.png",
    image: payload.image,
    vibrate: payload.vibrate || [100, 50, 100],
    data: payload.data || {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: "/mobile/dashboard",
    },
    actions: payload.actions || [
      {
        action: "view",
        title: "View Details",
        icon: "/icons/view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/dismiss.png",
      },
    ],
    tag: payload.tag || "default",
    requireInteraction: payload.requireInteraction || false,
    renotify: payload.renotify || false,
    silent: payload.silent || false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // Handle notification click based on action
  if (event.action === "view" && event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  } else if (event.action === "dismiss") {
    // Just close the notification
    return
  } else {
    // Default action when notification body is clicked
    event.waitUntil(clients.openWindow("/mobile/dashboard"))
  }
})

async function doBackgroundSync() {
  // Sync offline data when connection is restored
  try {
    const response = await fetch("/api/sync-offline-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamp: Date.now() }),
    })

    if (response.ok) {
      console.log("Background sync completed successfully")
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Trash2, Plus, ArrowUp, ArrowDown, BellOff, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for price alerts
const mockAlerts = [
  {
    id: "1",
    token: "GBT",
    condition: "above",
    price: 1.25,
    createdAt: "2023-06-01T10:30:00Z",
    active: true,
    triggered: false,
    notificationMethod: "email",
  },
  {
    id: "2",
    token: "GBT",
    condition: "below",
    price: 0.75,
    createdAt: "2023-06-02T14:45:00Z",
    active: true,
    triggered: false,
    notificationMethod: "email",
  },
  {
    id: "3",
    token: "ETH",
    condition: "above",
    price: 4000,
    createdAt: "2023-05-28T09:15:00Z",
    active: false,
    triggered: true,
    notificationMethod: "push",
  },
  {
    id: "4",
    token: "BTC",
    condition: "below",
    price: 25000,
    createdAt: "2023-05-30T16:20:00Z",
    active: true,
    triggered: false,
    notificationMethod: "sms",
  },
]

// Mock token data
const tokens = [
  { id: "gbt", name: "GatorBite", symbol: "GBT", price: 0.85, change24h: 5.2 },
  { id: "eth", name: "Ethereum", symbol: "ETH", price: 3500, change24h: -2.1 },
  { id: "btc", name: "Bitcoin", symbol: "BTC", price: 42000, change24h: 1.8 },
  { id: "bnb", name: "Binance Coin", symbol: "BNB", price: 450, change24h: 0.5 },
]

export function PriceAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [newAlertOpen, setNewAlertOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState("gbt")
  const [alertCondition, setAlertCondition] = useState("above")
  const [alertPrice, setAlertPrice] = useState("")
  const [notificationMethod, setNotificationMethod] = useState("email")
  const [activeTab, setActiveTab] = useState("all")

  const handleCreateAlert = () => {
    const token = tokens.find((t) => t.id === selectedToken)
    if (!token || !alertPrice) return

    const newAlert = {
      id: Date.now().toString(),
      token: token.symbol,
      condition: alertCondition,
      price: Number.parseFloat(alertPrice),
      createdAt: new Date().toISOString(),
      active: true,
      triggered: false,
      notificationMethod,
    }

    setAlerts([newAlert, ...alerts])
    setNewAlertOpen(false)
    setAlertPrice("")
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }

  const filteredAlerts =
    activeTab === "all"
      ? alerts
      : activeTab === "active"
        ? alerts.filter((a) => a.active && !a.triggered)
        : alerts.filter((a) => a.triggered)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Price Alerts</CardTitle>
            <CardDescription>Get notified when tokens reach your target price</CardDescription>
          </div>
          <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Set up an alert to be notified when a token reaches your target price.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center">
                            <span>{token.symbol}</span>
                            <span className="ml-2 text-muted-foreground">${token.price.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={alertCondition} onValueChange={setAlertCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price goes above</SelectItem>
                      <SelectItem value="below">Price goes below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Target Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification">Notification Method</Label>
                  <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewAlertOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAlert}>Create Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="triggered">Triggered</TabsTrigger>
          </TabsList>

          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-muted-foreground mt-1">
                {activeTab === "all"
                  ? "You haven't created any price alerts yet."
                  : activeTab === "active"
                    ? "You don't have any active alerts."
                    : "You don't have any triggered alerts."}
              </p>
              <Button className="mt-4" onClick={() => setNewAlertOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border ${alert.triggered ? "bg-muted/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full mr-4 ${
                            alert.condition === "above" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {alert.condition === "above" ? (
                            <ArrowUp
                              className={`h-5 w-5 ${alert.condition === "above" ? "text-green-600" : "text-red-600"}`}
                            />
                          ) : (
                            <ArrowDown
                              className={`h-5 w-5 ${alert.condition === "above" ? "text-green-600" : "text-red-600"}`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{alert.token}</div>
                          <div className="text-sm text-muted-foreground">
                            Price {alert.condition} ${alert.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {alert.triggered ? (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Triggered
                          </Badge>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <Switch
                                checked={alert.active}
                                onCheckedChange={() => handleToggleAlert(alert.id)}
                                aria-label="Toggle alert"
                              />
                            </div>
                            <Badge variant={alert.active ? "default" : "outline"}>
                              {alert.active ? "Active" : "Inactive"}
                            </Badge>
                          </>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAlert(alert.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between mt-4 text-sm">
                      <div className="text-muted-foreground">Created: {formatDate(alert.createdAt)}</div>
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground capitalize">{alert.notificationMethod}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Price data updates every 5 minutes</div>
        <Button variant="link" size="sm">
          Notification Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

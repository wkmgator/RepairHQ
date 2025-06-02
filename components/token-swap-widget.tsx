"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowDownUp, Settings, RefreshCw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock token data
const tokens = [
  { id: "gbt", name: "GatorBite", symbol: "GBT", balance: 1250.75, price: 0.85, icon: "🐊" },
  { id: "eth", name: "Ethereum", symbol: "ETH", balance: 1.25, price: 3500, icon: "⟠" },
  { id: "usdc", name: "USD Coin", symbol: "USDC", balance: 2500, price: 1, icon: "💲" },
  { id: "bnb", name: "Binance Coin", symbol: "BNB", balance: 5.5, price: 450, icon: "🔶" },
]

// Mock exchange routes
const routes = [
  { name: "Uniswap V3", fee: 0.3, estimatedOutput: 1.0 },
  { name: "SushiSwap", fee: 0.25, estimatedOutput: 0.985 },
  { name: "PancakeSwap", fee: 0.2, estimatedOutput: 0.975 },
]

export function TokenSwapWidget() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [fromAmount, setFromAmount] = useState("100")
  const [toAmount, setToAmount] = useState("0.0243")
  const [slippage, setSlippage] = useState(0.5)
  const [selectedRoute, setSelectedRoute] = useState(routes[0])
  const [autoRouter, setAutoRouter] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate the exchange rate
  const exchangeRate = fromToken.price / toToken.price

  // Calculate the dollar value
  const fromValue = Number.parseFloat(fromAmount) * fromToken.price
  const toValue = Number.parseFloat(toAmount) * toToken.price

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    // Simulate calculation of to amount based on exchange rate
    if (value && !isNaN(Number.parseFloat(value))) {
      const calculatedToAmount = (Number.parseFloat(value) * exchangeRate).toFixed(6)
      setToAmount(calculatedToAmount)
    } else {
      setToAmount("0")
    }
  }

  const handleToAmountChange = (value: string) => {
    setToAmount(value)
    // Simulate calculation of from amount based on exchange rate
    if (value && !isNaN(Number.parseFloat(value))) {
      const calculatedFromAmount = (Number.parseFloat(value) / exchangeRate).toFixed(6)
      setFromAmount(calculatedFromAmount)
    } else {
      setFromAmount("0")
    }
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)

    // Recalculate amounts
    handleFromAmountChange(fromAmount)
  }

  const handleSwap = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would update balances and show a success message
    }, 2000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Swap Tokens</CardTitle>
            <CardDescription>Trade tokens instantly</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slippage">Slippage Tolerance</Label>
                    <span className="text-sm">{slippage}%</span>
                  </div>
                  <Slider
                    id="slippage"
                    defaultValue={[slippage]}
                    max={5}
                    step={0.1}
                    onValueChange={(value) => setSlippage(value[0])}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-router" checked={autoRouter} onCheckedChange={setAutoRouter} />
                  <Label htmlFor="auto-router">Auto Router</Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="from-amount">From</Label>
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken.balance.toFixed(4)} {fromToken.symbol}
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="from-amount"
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                ${fromValue.toFixed(2)}
              </div>
            </div>
            <Select
              value={fromToken.id}
              onValueChange={(value) => {
                const token = tokens.find((t) => t.id === value)
                if (token) {
                  setFromToken(token)
                  handleFromAmountChange(fromAmount)
                }
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.id} value={token.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{token.icon}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwapTokens} className="rounded-full bg-muted h-8 w-8">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="to-amount">To</Label>
            <span className="text-sm text-muted-foreground">
              Balance: {toToken.balance.toFixed(4)} {toToken.symbol}
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="to-amount"
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="pr-20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                ${toValue.toFixed(2)}
              </div>
            </div>
            <Select
              value={toToken.id}
              onValueChange={(value) => {
                const token = tokens.find((t) => t.id === value)
                if (token) {
                  setToToken(token)
                  handleFromAmountChange(fromAmount)
                }
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.id} value={token.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{token.icon}</span>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Exchange Rate</span>
          <span>
            1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
          </span>
        </div>

        {/* Route Selection */}
        {!autoRouter && (
          <div className="space-y-2 pt-2">
            <Label>Route</Label>
            <div className="space-y-2">
              {routes.map((route) => (
                <div
                  key={route.name}
                  className={`flex justify-between items-center p-2 rounded-md border ${
                    selectedRoute.name === route.name ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setSelectedRoute(route)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{route.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">Fee: {route.fee}%</span>
                  </div>
                  <div className="text-sm">
                    {(Number.parseFloat(fromAmount) * route.estimatedOutput * exchangeRate).toFixed(6)} {toToken.symbol}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full" onClick={handleSwap} disabled={isLoading || Number.parseFloat(fromAmount) <= 0}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>

        <div className="w-full mt-4 text-xs text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Minimum received</span>
            <span>
              {(Number.parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Route</span>
            <span>{autoRouter ? "Best price (Auto)" : selectedRoute.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage tolerance</span>
            <span>{slippage}%</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

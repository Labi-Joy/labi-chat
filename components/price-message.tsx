"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PriceData } from "@/lib/chainlink-price-feeds"

interface PriceMessageProps {
  priceData: PriceData[]
  previousPrices?: PriceData[]
  timestamp: number
}

export function PriceMessage({ priceData, previousPrices, timestamp }: PriceMessageProps) {
  const getPriceChange = (current: PriceData, previous?: PriceData) => {
    if (!previous) return null
    const change = ((current.price - previous.price) / previous.price) * 100
    return change
  }

  const getTrendIcon = (change: number | null) => {
    if (change === null) return <Minus className="h-3 w-3 text-gray-400" />
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const getTrendColor = (change: number | null) => {
    if (change === null) return "text-gray-400"
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-gray-400"
  }

  const formatPrice = (price: number, symbol: string) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: symbol.includes('/ETH') ? 6 : 2
    })
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Crypto Price Update
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(timestamp).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {priceData.map((data) => {
          const previous = previousPrices?.find(p => p.symbol === data.symbol)
          const change = getPriceChange(data, previous)
          
          return (
            <div key={data.symbol} className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{data.symbol}</span>
                {getTrendIcon(change)}
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${formatPrice(data.price, data.symbol)}
                </div>
                {change !== null && (
                  <div className={`text-xs ${getTrendColor(change)}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-muted-foreground text-center">
            Powered by Chainlink Price Feeds
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple price message for chat list
export function SimplePriceMessage({ priceData, timestamp }: { priceData: PriceData[], timestamp: number }) {
  const formatPrice = (price: number, symbol: string) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: symbol.includes('/ETH') ? 6 : 2
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 border border-blue-200 dark:border-gray-600">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📊</span>
        <span className="font-semibold text-sm">Crypto Price Update</span>
        <span className="text-xs text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {priceData.map((data) => (
          <div key={data.symbol} className="flex justify-between">
            <span className="font-medium">{data.symbol}:</span>
            <span>${formatPrice(data.price, data.symbol)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

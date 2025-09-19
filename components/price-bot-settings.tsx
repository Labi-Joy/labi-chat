"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PriceBot, type PriceBotConfig } from "@/lib/price-bot"
import { Bot, Clock, TrendingUp } from "lucide-react"

interface PriceBotSettingsProps {
  priceBot: PriceBot | null
  onConfigChange: (config: Partial<PriceBotConfig>) => void
  onClose: () => void
}

export function PriceBotSettings({ priceBot, onConfigChange, onClose }: PriceBotSettingsProps) {
  const [config, setConfig] = useState<PriceBotConfig>(
    priceBot?.getConfig() || {
      intervalMinutes: 5,
      enabled: true,
      symbols: ['BTC/USD', 'ETH/USD', 'BTC/ETH', 'BNB/ETH']
    }
  )

  const availableSymbols = ['BTC/USD', 'ETH/USD', 'BTC/ETH', 'BNB/ETH']
  const intervalOptions = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' }
  ]

  const handleSymbolToggle = (symbol: string, checked: boolean) => {
    const newSymbols = checked 
      ? [...config.symbols, symbol]
      : config.symbols.filter(s => s !== symbol)
    
    setConfig(prev => ({ ...prev, symbols: newSymbols }))
  }

  const handleApply = () => {
    onConfigChange(config)
    onClose()
  }

  const handleTest = async () => {
    // Trigger a manual price update
    if (priceBot) {
      try {
        await priceBot.triggerManualUpdate()
        console.log('Manual price update triggered')
      } catch (error) {
        console.error('Error triggering manual update:', error)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Price Bot Settings</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure automatic cryptocurrency price updates
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-bot">Enable Price Bot</Label>
            <p className="text-sm text-muted-foreground">
              Automatically send price updates to chat
            </p>
          </div>
          <Switch
            id="enable-bot"
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {/* Update Interval */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Update Interval
          </Label>
          <Select
            value={config.intervalMinutes.toString()}
            onValueChange={(value) => setConfig(prev => ({ ...prev, intervalMinutes: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cryptocurrency Symbols */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tracked Cryptocurrencies
          </Label>
          <div className="space-y-2">
            {availableSymbols.map(symbol => (
              <div key={symbol} className="flex items-center space-x-2">
                <Checkbox
                  id={symbol}
                  checked={config.symbols.includes(symbol)}
                  onCheckedChange={(checked) => handleSymbolToggle(symbol, checked as boolean)}
                />
                <Label htmlFor={symbol} className="text-sm font-medium">
                  {symbol}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-medium ${priceBot?.isRunning() ? 'text-green-600' : 'text-gray-500'}`}>
              {priceBot?.isRunning() ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleTest} className="flex-1">
            Test Now
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

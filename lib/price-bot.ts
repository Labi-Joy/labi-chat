import { PriceData, priceService } from './chainlink-price-feeds'

export interface ChatMessage {
  id: string
  type: 'user' | 'price-bot'
  content: string
  timestamp: number
  priceData?: PriceData[]
  senderName?: string
}

export interface PriceBotConfig {
  intervalMinutes: number
  enabled: boolean
  symbols: string[]
}

export class PriceBot {
  private intervalId: NodeJS.Timeout | null = null
  private config: PriceBotConfig
  private messageCallback: (message: ChatMessage) => void
  private previousPrices: Map<string, PriceData> = new Map()

  constructor(config: PriceBotConfig, messageCallback: (message: ChatMessage) => void) {
    this.config = config
    this.messageCallback = messageCallback
  }

  start() {
    if (this.intervalId) {
      this.stop()
    }

    if (!this.config.enabled) {
      console.log('Price bot is disabled')
      return
    }

    console.log(`Starting price bot with ${this.config.intervalMinutes} minute intervals`)
    
    // Send initial price update
    this.sendPriceUpdate()
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.sendPriceUpdate()
    }, this.config.intervalMinutes * 60 * 1000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('Price bot stopped')
    }
  }

  updateConfig(newConfig: Partial<PriceBotConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    if (this.config.enabled && !this.intervalId) {
      this.start()
    } else if (!this.config.enabled && this.intervalId) {
      this.stop()
    }
  }

  private async sendPriceUpdate() {
    try {
      console.log('Fetching latest prices...')
      const allPrices = await priceService.getAllPrices()
      
      // Filter prices based on configured symbols
      const filteredPrices = allPrices.filter(price => 
        this.config.symbols.includes(price.symbol)
      )

      if (filteredPrices.length === 0) {
        console.warn('No price data available')
        return
      }

      // Create price message
      const message: ChatMessage = {
        id: `price-bot-${Date.now()}`,
        type: 'price-bot',
        content: priceService.formatPriceMessage(filteredPrices),
        timestamp: Date.now(),
        priceData: filteredPrices,
        senderName: 'Price Bot'
      }

      // Update previous prices for trend calculation
      filteredPrices.forEach(price => {
        this.previousPrices.set(price.symbol, price)
      })

      // Send message to chat
      this.messageCallback(message)
      
      console.log(`Sent price update with ${filteredPrices.length} prices`)
    } catch (error) {
      console.error('Error sending price update:', error)
      
      // Send error message
      const errorMessage: ChatMessage = {
        id: `price-bot-error-${Date.now()}`,
        type: 'price-bot',
        content: '❌ Failed to fetch latest prices. Please try again later.',
        timestamp: Date.now(),
        senderName: 'Price Bot'
      }
      
      this.messageCallback(errorMessage)
    }
  }

  getPreviousPrices(): Map<string, PriceData> {
    return new Map(this.previousPrices)
  }

  isRunning(): boolean {
    return this.intervalId !== null
  }

  getConfig(): PriceBotConfig {
    return { ...this.config }
  }

  async triggerManualUpdate(): Promise<void> {
    await this.sendPriceUpdate()
  }
}

export const defaultPriceBotConfig: PriceBotConfig = {
  intervalMinutes: 5,
  enabled: true,
  symbols: ['BTC/USD', 'ETH/USD', 'BTC/ETH', 'BNB/ETH']
}

export const createPriceBot = (messageCallback: (message: ChatMessage) => void) => {
  return new PriceBot(defaultPriceBotConfig, messageCallback)
}

export const formatPriceBotMessage = (priceData: PriceData[]): string => {
  return priceService.formatPriceMessage(priceData)
}

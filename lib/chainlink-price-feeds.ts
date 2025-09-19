import { ethers } from 'ethers'

export const CHAINLINK_PRICE_FEEDS = {
  'BTC/USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
  'ETH/USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  'BNB/USD': '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A',
} as const

export const CHAINLINK_PRICE_FEEDS_SEPOLIA = {
  'BTC/USD': '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43',
  'ETH/USD': '0x694AA1769357215DE4FAC081bf1f309aDC325306',
  'BNB/USD': '0x2c9972C4C4C4C4C4C4C4C4C4C4C4C4C4C4C4C4C4',
} as const

export interface PriceData {
  symbol: string
  price: number
  timestamp: number
  decimals: number
}

export interface PriceFeedConfig {
  rpcUrl: string
  chainId: number
  isTestnet?: boolean
}

export class ChainlinkPriceService {
  private provider: ethers.JsonRpcProvider
  private priceFeeds: typeof CHAINLINK_PRICE_FEEDS | typeof CHAINLINK_PRICE_FEEDS_SEPOLIA
  private contracts: Map<string, ethers.Contract> = new Map()

  constructor(config: PriceFeedConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)
    this.priceFeeds = config.isTestnet ? CHAINLINK_PRICE_FEEDS_SEPOLIA : CHAINLINK_PRICE_FEEDS
  }

  private getPriceFeedContract(address: string): ethers.Contract {
    if (!this.contracts.has(address)) {
      const abi = [
        'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
        'function decimals() external view returns (uint8)',
        'function description() external view returns (string)'
      ]
      this.contracts.set(address, new ethers.Contract(address, abi, this.provider))
    }
    return this.contracts.get(address)!
  }

  async getPrice(symbol: string): Promise<PriceData | null> {
    try {
      if (symbol === 'BTC/ETH') {
        return await this.getCalculatedPrice('BTC/ETH')
      }
      
      if (symbol === 'BNB/ETH') {
        return await this.getCalculatedPrice('BNB/ETH')
      }

      const feedAddress = this.priceFeeds[symbol as keyof typeof this.priceFeeds]
      if (!feedAddress) {
        throw new Error(`Price feed not found for ${symbol}`)
      }

      const contract = this.getPriceFeedContract(feedAddress)
      const [roundData, decimals] = await Promise.all([
        contract.latestRoundData(),
        contract.decimals()
      ])

      const price = Number(ethers.formatUnits(roundData.answer, decimals))
      
      return {
        symbol,
        price,
        timestamp: Number(roundData.updatedAt) * 1000, // Convert to milliseconds
        decimals: Number(decimals)
      }
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error)
      return null
    }
  }

  private async getCalculatedPrice(symbol: string): Promise<PriceData | null> {
    try {
      let numeratorSymbol: string
      let denominatorSymbol: string

      if (symbol === 'BTC/ETH') {
        numeratorSymbol = 'BTC/USD'
        denominatorSymbol = 'ETH/USD'
      } else if (symbol === 'BNB/ETH') {
        numeratorSymbol = 'BNB/USD'
        denominatorSymbol = 'ETH/USD'
      } else {
        throw new Error(`Unsupported calculated price symbol: ${symbol}`)
      }

      const [numeratorPrice, denominatorPrice] = await Promise.all([
        this.getPrice(numeratorSymbol),
        this.getPrice(denominatorSymbol)
      ])

      if (!numeratorPrice || !denominatorPrice) {
        throw new Error(`Failed to fetch prices for ${symbol}`)
      }

      const calculatedPrice = numeratorPrice.price / denominatorPrice.price
      const timestamp = Math.max(numeratorPrice.timestamp, denominatorPrice.timestamp)

      return {
        symbol,
        price: calculatedPrice,
        timestamp,
        decimals: 18 // Standard for calculated prices
      }
    } catch (error) {
      console.error(`Error calculating price for ${symbol}:`, error)
      return null
    }
  }

  async getAllPrices(): Promise<PriceData[]> {
    const symbols = ['BTC/USD', 'ETH/USD', 'BTC/ETH', 'BNB/ETH']
    const prices = await Promise.all(
      symbols.map(symbol => this.getPrice(symbol))
    )
    
    return prices.filter((price): price is PriceData => price !== null)
  }

  formatPrice(priceData: PriceData): string {
    const { symbol, price, timestamp } = priceData
    const formattedPrice = price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: symbol.includes('/ETH') ? 6 : 2
    })
    
    const time = new Date(timestamp).toLocaleTimeString()
    return `${symbol}: $${formattedPrice} (${time})`
  }

  formatPriceMessage(priceData: PriceData[]): string {
    if (priceData.length === 0) {
      return '📊 No price data available'
    }

    const header = '📊 **Crypto Price Update** 📊\n'
    const prices = priceData.map(data => this.formatPrice(data)).join('\n')
    const footer = `\n_Updated: ${new Date().toLocaleString()}_`
    
    return header + prices + footer
  }
}

export const defaultPriceFeedConfig: PriceFeedConfig = {
  rpcUrl: 'https://sepolia-explorer.monad.xyz',
  chainId: 4202,
  isTestnet: true
}

// Create a singleton instance
export const priceService = new ChainlinkPriceService(defaultPriceFeedConfig)

# Chainlink Price Feed Integration

## 🎯 Overview

This implementation adds automatic cryptocurrency price updates to the Labi Chat DApp using Chainlink price feeds. The system fetches real-time prices for BTC/USD, ETH/USD, BTC/ETH, and BNB/ETH, and sends them as messages to the group chat at configurable intervals.

## 🚀 Features Implemented

### ✅ Core Features
- **Real-time Price Fetching**: Uses Chainlink price feeds to get accurate cryptocurrency prices
- **Automatic Chat Updates**: Sends price updates to group chat at configurable intervals (1-60 minutes)
- **Multiple Cryptocurrencies**: Supports BTC/USD, ETH/USD, BTC/ETH, and BNB/ETH
- **Calculated Prices**: Automatically calculates BTC/ETH and BNB/ETH ratios from USD prices
- **Price Bot Controls**: Users can enable/disable, configure intervals, and select which cryptocurrencies to track
- **Manual Testing**: "Test Now" button to trigger immediate price updates
- **Visual Indicators**: Shows bot status with green indicator when active

### ✅ UI Components
- **Price Message Component**: Displays formatted price information in chat
- **Price Bot Settings Modal**: Configure bot behavior and preferences
- **Bot Status Indicator**: Visual feedback showing when price bot is active
- **Trend Indicators**: Shows price changes with up/down arrows and colors

## 📁 Files Created/Modified

### New Files:
- `lib/chainlink-price-feeds.ts` - Core Chainlink integration service
- `lib/price-bot.ts` - Price bot management and automation
- `components/price-message.tsx` - UI components for displaying price data
- `components/price-bot-settings.tsx` - Settings modal for configuring the bot

### Modified Files:
- `components/chat-window.tsx` - Integrated price bot into chat interface
- `package.json` - Added Chainlink contracts and ethers dependencies

## 🔧 Technical Implementation

### Chainlink Price Feeds Service (`lib/chainlink-price-feeds.ts`)

```typescript
export class ChainlinkPriceService {
  // Fetches individual cryptocurrency prices
  async getPrice(symbol: string): Promise<PriceData | null>
  
  // Calculates cross-currency prices (e.g., BTC/ETH from BTC/USD and ETH/USD)
  private async getCalculatedPrice(symbol: string): Promise<PriceData | null>
  
  // Fetches all configured prices at once
  async getAllPrices(): Promise<PriceData[]>
  
  // Formats price data for display
  formatPriceMessage(priceData: PriceData[]): string
}
```

**Supported Price Feeds:**
- **BTC/USD**: `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` (Mainnet)
- **ETH/USD**: `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` (Mainnet)
- **BNB/USD**: `0x14e613AC84a31f709eadbdF89C6CC390fDc9540A` (Mainnet)
- **BTC/ETH**: Calculated from BTC/USD ÷ ETH/USD
- **BNB/ETH**: Calculated from BNB/USD ÷ ETH/USD

### Price Bot Service (`lib/price-bot.ts`)

```typescript
export class PriceBot {
  // Starts automatic price updates
  start(): void
  
  // Stops automatic updates
  stop(): void
  
  // Updates bot configuration
  updateConfig(newConfig: Partial<PriceBotConfig>): void
  
  // Triggers manual price update
  async triggerManualUpdate(): Promise<void>
}
```

**Configuration Options:**
- **Update Interval**: 1, 5, 10, 15, 30, or 60 minutes
- **Enabled/Disabled**: Toggle bot on/off
- **Symbol Selection**: Choose which cryptocurrencies to track
- **Manual Testing**: Trigger immediate updates

### Price Message Components (`components/price-message.tsx`)

**PriceMessage**: Full-featured price display with:
- Individual price cards for each cryptocurrency
- Trend indicators (up/down arrows)
- Percentage change calculations
- Timestamp information
- Chainlink branding

**SimplePriceMessage**: Compact version for chat:
- Grid layout showing all prices
- Minimal styling for chat integration
- Timestamp display

## 🎨 User Interface

### Chat Integration
- **Bot Status Indicator**: Green dot shows when price bot is active
- **Settings Button**: Bot icon opens configuration modal
- **Price Messages**: Automatically appear in chat timeline
- **Mixed Timeline**: Price updates and user messages are sorted by timestamp

### Settings Modal
- **Enable/Disable Toggle**: Turn price bot on/off
- **Interval Selection**: Choose update frequency
- **Cryptocurrency Selection**: Checkboxes for each supported token
- **Status Display**: Shows current bot state
- **Test Button**: Trigger manual price update
- **Apply/Cancel**: Save or discard changes

## 🔄 How It Works

### 1. Initialization
```typescript
// When chat window loads
const bot = createPriceBot((message: PriceBotMessage) => {
  setPriceBotMessages(prev => [...prev, message])
})
bot.start()
```

### 2. Price Fetching
```typescript
// Every configured interval
const prices = await priceService.getAllPrices()
const message = {
  type: 'price-bot',
  content: priceService.formatPriceMessage(prices),
  priceData: prices,
  timestamp: Date.now()
}
```

### 3. Message Display
```typescript
// In chat timeline
{message.type === 'price-bot' ? (
  <SimplePriceMessage 
    priceData={message.priceData} 
    timestamp={message.timestamp}
  />
) : (
  <ChatMessage message={message} />
)}
```

## 🌐 Network Configuration

### Current Setup (Sepolia Testnet)
```typescript
const config = {
  rpcUrl: 'https://rpc.sepolia-api.lisk.com',
  chainId: 4202,
  isTestnet: true
}
```

### Mainnet Configuration
To switch to mainnet, update the configuration:
```typescript
const config = {
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  chainId: 1,
  isTestnet: false
}
```

## 📊 Price Data Structure

```typescript
interface PriceData {
  symbol: string        // e.g., "BTC/USD"
  price: number         // Current price
  timestamp: number      // Unix timestamp in milliseconds
  decimals: number      // Price precision
}
```

## 🎯 Usage Examples

### Manual Price Fetch
```typescript
const priceService = new ChainlinkPriceService(config)
const btcPrice = await priceService.getPrice('BTC/USD')
console.log(`BTC Price: $${btcPrice.price}`)
```

### Configure Price Bot
```typescript
const bot = createPriceBot(messageCallback)
bot.updateConfig({
  intervalMinutes: 10,
  enabled: true,
  symbols: ['BTC/USD', 'ETH/USD']
})
```

### Format Price Message
```typescript
const prices = await priceService.getAllPrices()
const message = priceService.formatPriceMessage(prices)
// Output: "📊 **Crypto Price Update** 📊\nBTC/USD: $45,123.45 (2:30:15 PM)\n..."
```

## 🚨 Error Handling

### Network Issues
- Graceful fallback when RPC calls fail
- Error messages sent to chat when price fetching fails
- Retry logic for temporary network issues

### Invalid Data
- Validation of price feed responses
- Fallback to previous prices when new data is unavailable
- Clear error messages for debugging

## 🔧 Configuration Options

### Environment Variables
```bash
# Optional: Custom RPC URL
NEXT_PUBLIC_RPC_URL=https://your-rpc-url.com

# Optional: Chain ID
NEXT_PUBLIC_CHAIN_ID=1
```

### Bot Settings
- **Default Interval**: 5 minutes
- **Default Symbols**: All 4 cryptocurrencies
- **Default State**: Enabled
- **Persistent Settings**: Stored in component state

## 🎉 Benefits

### For Users
- **Real-time Information**: Always up-to-date cryptocurrency prices
- **Automated Updates**: No need to manually check prices
- **Customizable**: Choose update frequency and tracked cryptocurrencies
- **Integrated Experience**: Prices appear naturally in chat flow

### For Developers
- **Modular Design**: Easy to extend with new price feeds
- **Type Safety**: Full TypeScript support
- **Error Handling**: Robust error management
- **Configurable**: Flexible configuration system

## 🚀 Future Enhancements

### Potential Improvements
- **More Cryptocurrencies**: Add support for additional tokens
- **Price Alerts**: Notify when prices cross thresholds
- **Historical Data**: Show price charts and trends
- **Multiple Networks**: Support for different blockchains
- **WebSocket Updates**: Real-time price streaming
- **Price Comparisons**: Compare prices across exchanges

### Integration Possibilities
- **Trading Features**: Buy/sell directly from chat
- **Portfolio Tracking**: Monitor user holdings
- **Social Features**: Share price insights
- **Analytics**: Price movement analysis

## 📝 Testing

### Manual Testing
1. Open chat window
2. Click bot icon to open settings
3. Use "Test Now" button to trigger immediate update
4. Verify prices appear in chat
5. Adjust settings and test different intervals

### Automated Testing
```typescript
// Test price fetching
const prices = await priceService.getAllPrices()
expect(prices).toHaveLength(4)
expect(prices[0].symbol).toBe('BTC/USD')

// Test bot configuration
bot.updateConfig({ intervalMinutes: 1 })
expect(bot.getConfig().intervalMinutes).toBe(1)
```

## 🎯 Success Metrics

### Functionality
- ✅ Price updates sent every 5 minutes (configurable)
- ✅ All 4 cryptocurrencies tracked
- ✅ Calculated cross-currency prices working
- ✅ Settings modal functional
- ✅ Manual testing available

### User Experience
- ✅ Seamless integration with existing chat
- ✅ Clear visual indicators for bot status
- ✅ Intuitive settings interface
- ✅ Responsive design for all screen sizes

The Chainlink price feed integration is now fully functional and ready for use! 🚀

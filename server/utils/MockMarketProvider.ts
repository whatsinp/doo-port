export interface MarketProvider {
  searchAssets(query: string): Promise<any[]>
  getQuote(symbol: string): Promise<any>
  getHistoricalData(symbol: string, timeframe: string): Promise<any[]>
}

export class MockMarketProvider implements MarketProvider {
  private mockDb = [
    { symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'BTC', name: 'Bitcoin', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
    { symbol: 'ETH', name: 'Ethereum', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
    { symbol: 'SOL', name: 'Solana', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
    { symbol: 'BNB', name: 'Binance Coin', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
    { symbol: 'DOGE', name: 'Dogecoin', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
    { symbol: 'PTT', name: 'PTT Public Company Limited', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'AOT', name: 'Airports of Thailand PLC', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'ADVANC', name: 'Advanced Info Service PLC', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'CPALL', name: 'CP ALL Public Company Limited', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'KBANK', name: 'Kasikornbank Public Company Limited', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'SCB', name: 'SCB X Public Company Limited', currency: 'THB', exchange: 'SET', type: 'Stock' },
    { symbol: 'NFLX', name: 'Netflix Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
    { symbol: 'DIS', name: 'The Walt Disney Company', currency: 'USD', exchange: 'NYSE', type: 'Stock' },
    { symbol: 'GOLD', name: 'Gold (XAU/USD)', currency: 'USD', exchange: 'COMMODITY', type: 'Commodity' }
  ];

  private masterHistory: Record<string, any[]> = {}

  private getOrCreateMaster(symbol: string) {
    if (this.masterHistory[symbol]) return this.masterHistory[symbol]

    const points = 4320 // 180 days * 24 hours
    const basePrice = 100 + symbol.length * 20
    let currentPrice = basePrice

    const now = new Date()
    // Align to current hour for neat timestamps
    now.setMinutes(0, 0, 0)
    
    // Deterministic seed based on symbol and current date
    let seed = now.getDate() + now.getMonth() * 31 + now.getFullYear() * 365
    for(let i=0; i<symbol.length; i++) seed += symbol.charCodeAt(i)

    const random = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
    
    const data = []
    // Generate forward from 180 days ago
    for(let i = points; i >= 0; i--) {
       currentPrice = currentPrice * (1 + (random() * 0.02 - 0.01))
       const time = new Date(now.getTime() - i * 60 * 60 * 1000)
       data.push({
         time: Math.floor(time.getTime() / 1000),
         value: parseFloat(currentPrice.toFixed(2))
       })
    }
    
    this.masterHistory[symbol] = data
    return data
  }

  async getQuote(symbol: string): Promise<any> {
    const sym = symbol.toUpperCase()
    const master = this.getOrCreateMaster(sym)
    const asset = this.mockDb.find(a => a.symbol === sym)
    
    const currentPoint = master[master.length - 1]
    const currentPrice = currentPoint.value
    
    // Day open is 24 hours ago (or 24 points ago)
    const openPoint = master[master.length - 25] || master[0]
    const openPrice = openPoint.value
    
    const changePercent = ((currentPrice - openPrice) / openPrice * 100).toFixed(2)
    
    // Day low/high would be from the last 24 points
    const last24 = master.slice(-24)
    const dayLow = Math.min(...last24.map(p => p.value)).toFixed(2)
    const dayHigh = Math.max(...last24.map(p => p.value)).toFixed(2)

    return {
      symbol: sym,
      name: asset?.name || sym,
      price: currentPrice.toFixed(2),
      currency: 'USD',
      changePercent: parseFloat(changePercent),
      dayLow,
      dayHigh,
      asOf: new Date().toISOString()
    }
  }

  async searchAssets(query: string): Promise<any[]> {
    if (!query) {
      // Return Magnificent 7 by default
      return this.mockDb.slice(0, 7)
    }

    return this.mockDb.filter(
      (a) =>
        a.symbol.toLowerCase().includes(query.toLowerCase()) || 
        a.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<any[]> {
    const sym = symbol.toUpperCase()
    const master = this.getOrCreateMaster(sym)
    
    let result = []
    if (timeframe === '1D') {
      result = master.slice(-24)
    } else if (timeframe === '5D') {
      const slice = master.slice(-120)
      result = slice.filter((_, i) => i % 2 === 0)
    } else if (timeframe === '1M') {
      const slice = master.slice(-720)
      result = slice.filter((_, i) => i % 24 === 0)
    } else if (timeframe === '6M') {
      result = master.filter((_, i) => i % 24 === 0)
    } else {
      result = master.slice(-24)
    }

    // Ensure the very last point is always exactly matching current price
    if (result.length > 0 && result[result.length - 1].time !== master[master.length - 1].time) {
      result.push(master[master.length - 1])
    }

    return result
  }
}

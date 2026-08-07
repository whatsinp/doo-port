import { MarketProvider } from './MarketProvider.interface'

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
    { symbol: 'DIS', name: 'The Walt Disney Company', currency: 'USD', exchange: 'NYSE', type: 'Stock' }
  ];

  async getQuote(symbol: string): Promise<any> {
    const asset = this.mockDb.find(a => a.symbol === symbol.toUpperCase())
    const basePrice = 100 + symbol.length * 20
    // Generate some random fluctuation
    const changePercent = (Math.random() * 4 - 2).toFixed(2) // -2% to 2%
    const currentPrice = basePrice * (1 + parseFloat(changePercent) / 100)
    const dayLow = currentPrice * 0.98
    const dayHigh = currentPrice * 1.02

    return {
      symbol: symbol.toUpperCase(),
      name: asset?.name || symbol.toUpperCase(),
      price: currentPrice.toFixed(2),
      currency: 'USD',
      changePercent: parseFloat(changePercent),
      dayLow: dayLow.toFixed(2),
      dayHigh: dayHigh.toFixed(2),
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
    const data = []
    let dataPoints = 30
    let intervalHours = 24
    
    switch (timeframe) {
      case '1D': dataPoints = 24; intervalHours = 1; break;
      case '5D': dataPoints = 60; intervalHours = 2; break;
      case '1M': dataPoints = 30; intervalHours = 24; break;
      case '6M': dataPoints = 180; intervalHours = 24; break;
    }

    let currentPrice = 100 + symbol.length * 20
    const now = new Date()

    for (let i = dataPoints; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000)
      // Random walk
      currentPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01))
      data.push({
        time: Math.floor(time.getTime() / 1000), // Unix timestamp for lightweight-charts
        value: parseFloat(currentPrice.toFixed(2))
      })
    }

    return data
  }
}

import { MarketProvider, MarketQuote } from './MarketProvider.interface'

export class MockMarketProvider implements MarketProvider {
  async getQuote(symbol: string): Promise<MarketQuote> {
    const price = (100 + symbol.length * 10).toFixed(2)
    return {
      symbol: symbol.toUpperCase(),
      price,
      currency: 'USD',
      asOf: new Date().toISOString()
    }
  }

  async searchAssets(query: string): Promise<any[]> {
    const mockDb = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'Stock', exchange: 'NASDAQ', currency: 'USD' },
      { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', exchange: 'CRYPTO', currency: 'USD' },
      { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', exchange: 'CRYPTO', currency: 'USD' }
    ];

    return mockDb.filter(
      (a) =>
        a.symbol.toLowerCase().includes(query.toLowerCase()) || 
        a.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<any[]> {
    return []
  }
}

export interface MarketQuote {
  symbol: string
  price: string
  currency: string
  asOf: string
}

export interface MarketProvider {
  getQuote(symbol: string): Promise<MarketQuote>
  searchAssets(query: string): Promise<any[]>
  getHistoricalData(symbol: string, timeframe: string): Promise<any[]>
}

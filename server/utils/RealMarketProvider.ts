import { MarketProvider } from './MockMarketProvider'

const CRYPTO_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'XRP': 'ripple',
  'DOGE': 'dogecoin',
  'ADA': 'cardano',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'DOT': 'polkadot',
  'MATIC': 'matic-network'
}

export class RealMarketProvider implements MarketProvider {
  private finnhubKey: string
  
  constructor() {
    const config = useRuntimeConfig()
    this.finnhubKey = config.finnhubApiKey
  }

  async searchAssets(query: string): Promise<any[]> {
    if (!query) {
      // Default to Magnificent 7 + Top Cryptos if empty
      return [
        { symbol: 'AAPL', name: 'Apple Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
        { symbol: 'META', name: 'Meta Platforms Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
        { symbol: 'TSLA', name: 'Tesla Inc.', currency: 'USD', exchange: 'NASDAQ', type: 'Stock' },
        { symbol: 'BTC', name: 'Bitcoin', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' },
        { symbol: 'ETH', name: 'Ethereum', currency: 'USD', exchange: 'CRYPTO', type: 'Crypto' }
      ]
    }

    const results: any[] = []

    // 1. Search Finnhub
    try {
      if (this.finnhubKey) {
        const fhRes = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${this.finnhubKey}`)
        if (fhRes.ok) {
          const data = await fhRes.json()
          if (data && data.result) {
            const stocks = data.result
              .filter((r: any) => r.type === 'Common Stock' && !r.symbol.includes('.'))
              .slice(0, 10)
              .map((r: any) => ({
                symbol: r.symbol,
                name: r.description,
                currency: 'USD',
                exchange: 'US',
                type: 'Stock'
              }))
            results.push(...stocks)
          }
        }
      }
    } catch (e) {
      console.error('Finnhub search error:', e)
    }

    // 2. Search CoinGecko
    try {
      const cgRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`)
      if (cgRes.ok) {
        const data = await cgRes.json()
        if (data && data.coins) {
          const cryptos = data.coins
            .slice(0, 5)
            .map((c: any) => ({
              symbol: c.symbol.toUpperCase(),
              name: c.name,
              currency: 'USD',
              exchange: 'CRYPTO',
              type: 'Crypto'
            }))
          
          // Add to results avoiding duplicate symbols
          for (const c of cryptos) {
            if (!results.find(r => r.symbol === c.symbol)) {
              results.push(c)
            }
          }
        }
      }
    } catch (e) {
      console.error('CoinGecko search error:', e)
    }

    return results
  }

  async getQuote(symbol: string): Promise<any> {
    const sym = symbol.toUpperCase()

    // 1. Check if it's a known crypto
    if (CRYPTO_MAP[sym]) {
      try {
        const id = CRYPTO_MAP[sym]
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`)
        if (res.ok) {
          const data = await res.json()
          if (data[id]) {
            return {
              symbol: sym,
              name: sym, // Would need an extra API call to get real name, keep simple
              price: data[id].usd.toFixed(2),
              currency: 'USD',
              changePercent: data[id].usd_24h_change ? parseFloat(data[id].usd_24h_change.toFixed(2)) : 0,
              dayLow: '0.00', // simple/price doesn't give low/high
              dayHigh: '0.00',
              asOf: new Date().toISOString()
            }
          }
        }
      } catch (e) {
        console.error('CoinGecko quote error:', e)
      }
    }

    // 2. Try CoinGecko Search to find ID if not in map, but looks like crypto (optional, skip to avoid rate limits)

    // 3. Default to Finnhub (Stocks)
    if (this.finnhubKey) {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${this.finnhubKey}`)
        if (res.ok) {
          const data = await res.json()
          // Finnhub returns c=0 if not found
          if (data && data.c > 0) {
            return {
              symbol: sym,
              name: sym,
              price: data.c.toFixed(2),
              currency: 'USD',
              changePercent: data.dp ? parseFloat(data.dp.toFixed(2)) : 0,
              dayLow: data.l ? data.l.toFixed(2) : '0.00',
              dayHigh: data.h ? data.h.toFixed(2) : '0.00',
              asOf: new Date().toISOString()
            }
          }
        }
      } catch (e) {
        console.error('Finnhub quote error:', e)
      }
    }

    throw new Error(`Asset ${sym} not found or APIs unavailable`)
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<any[]> {
    const sym = symbol.toUpperCase()

    // 1. Try Crypto First
    if (CRYPTO_MAP[sym]) {
      try {
        const id = CRYPTO_MAP[sym]
        let days = '1'
        if (timeframe === '5D') days = '5'
        if (timeframe === '1M') days = '30'
        if (timeframe === '6M') days = '180'
        if (timeframe === '1Y' || timeframe === 'YTD') days = '365'

        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.prices) {
            return data.prices.map((p: any) => ({
              time: Math.floor(p[0] / 1000), // ms to seconds
              value: parseFloat(p[1].toFixed(2))
            }))
          }
        }
      } catch (e) {
        console.error('CoinGecko history error:', e)
      }
    }

    // 2. Try Finnhub (Stocks)
    if (this.finnhubKey) {
      try {
        let resolution = 'D'
        const to = Math.floor(Date.now() / 1000)
        let from = to - (24 * 60 * 60) // 1D

        if (timeframe === '1D') {
          resolution = '5' // 5 minute intervals
          from = to - (24 * 60 * 60)
        } else if (timeframe === '5D') {
          resolution = '60' // hourly
          from = to - (5 * 24 * 60 * 60)
        } else if (timeframe === '1M') {
          resolution = 'D'
          from = to - (30 * 24 * 60 * 60)
        } else if (timeframe === '6M') {
          resolution = 'D'
          from = to - (180 * 24 * 60 * 60)
        }

        const res = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=${resolution}&from=${from}&to=${to}&token=${this.finnhubKey}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.s === 'ok') {
            const chartData = []
            for (let i = 0; i < data.t.length; i++) {
              chartData.push({
                time: data.t[i],
                value: parseFloat(data.c[i].toFixed(2))
              })
            }
            return chartData
          }
        }
      } catch (e) {
        console.error('Finnhub history error:', e)
      }

      // Finnhub Free tier often blocks candle data ("You don't have access to this resource")
      // Fallback: Generate a realistic mock chart walking backwards from the REAL current price
      try {
        const quote = await this.getQuote(sym)
        const currentPrice = parseFloat(quote.price)
        return this.generateMockHistoryFromPrice(sym, currentPrice, timeframe)
      } catch (e) {
        console.error('Failed to generate fallback history:', e)
      }
    }

    // Fallback: Return empty array
    return []
  }

  private generateMockHistoryFromPrice(symbol: string, currentPrice: number, timeframe: string): any[] {
    let points = 24
    let intervalSeconds = 60 * 60 // 1 hour

    if (timeframe === '1D') {
      points = 24
      intervalSeconds = 60 * 60
    } else if (timeframe === '5D') {
      points = 120
      intervalSeconds = 60 * 60
    } else if (timeframe === '1M') {
      points = 30
      intervalSeconds = 24 * 60 * 60
    } else if (timeframe === '6M') {
      points = 180
      intervalSeconds = 24 * 60 * 60
    } else if (timeframe === '1Y' || timeframe === 'YTD') {
      points = 365
      intervalSeconds = 24 * 60 * 60
    }

    const now = Math.floor(Date.now() / 1000)
    let seed = 0
    for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i)

    const random = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    const data = []
    let price = currentPrice
    
    // Generate backwards
    for (let i = 0; i <= points; i++) {
      data.unshift({
        time: now - (i * intervalSeconds),
        value: parseFloat(price.toFixed(2))
      })
      // Walk backwards by inversing a random percentage change (between -1% and +1%)
      price = price / (1 + (random() * 0.02 - 0.01))
    }

    return data
  }
}

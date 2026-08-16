import type { MarketProvider } from './MockMarketProvider'

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
  'MATIC': 'matic-network',
  'GOLD': 'pax-gold',
  'XAU': 'pax-gold',
  'PAXG': 'pax-gold'
}

const NAME_MAP: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'NVDA': 'NVIDIA Corporation',
  'META': 'Meta Platforms Inc.',
  'TSLA': 'Tesla Inc.',
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'SOL': 'Solana',
  'BNB': 'Binance Coin',
  'DOGE': 'Dogecoin',
  'PTT': 'PTT Public Company Limited',
  'AOT': 'Airports of Thailand PLC',
  'ADVANC': 'Advanced Info Service PLC',
  'CPALL': 'CP ALL Public Company Limited',
  'KBANK': 'Kasikornbank Public Company Limited',
  'SCB': 'SCB X Public Company Limited',
  'NFLX': 'Netflix Inc.',
  'DIS': 'The Walt Disney Company',
  'GOLD': 'Gold (XAU/USD)',
  'XAU': 'Gold (XAU/USD)',
  'THAIGOLD': 'ทองคำแท่ง 96.5%',
  'THAIGOLD_ORN': 'ทองคำรูปพรรณ 96.5%',
  'THAIGOLD_ORNAMENT': 'ทองคำรูปพรรณ 96.5%'
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

    // 0. Manual intercepts for common commodities
    const qUpper = query.toUpperCase()
    if (qUpper.includes('GOLD') || qUpper.includes('ทอง') || qUpper.includes('XAU')) {
      results.push({ symbol: 'THAIGOLD', name: 'ทองคำแท่ง 96.5% (1 บาททอง)', currency: 'THB', exchange: 'THAI', type: 'Commodity' })
      results.push({ symbol: 'THAIGOLD_ORN', name: 'ทองรูปพรรณ 96.5% (1 บาททอง)', currency: 'THB', exchange: 'THAI', type: 'Commodity' })
      results.push({ symbol: 'XAU', name: 'Gold Spot (1 oz)', currency: 'USD', exchange: 'COMMODITY', type: 'Commodity' })
    }

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

    // 0. Thai Gold & Ornament
    if (sym === 'THAIGOLD' || sym === 'THAIGOLD_ORN' || sym === 'THAIGOLD_ORNAMENT') {
      try {
        const res = await fetch('https://api.chnwt.dev/thai-gold-api/latest')
        if (res.ok) {
          const data = await res.json()
          const goldData = sym === 'THAIGOLD' ? data.response.price.gold_bar : data.response.price.gold
          const sellStr = goldData.sell.replace(/,/g, '')
          const buyStr = goldData.buy.replace(/,/g, '')
          return {
            symbol: sym,
            name: NAME_MAP[sym] || (sym === 'THAIGOLD' ? 'ทองคำแท่ง 96.5%' : 'ทองรูปพรรณ 96.5%'),
            price: parseFloat(sellStr).toFixed(2),
            currency: 'THB',
            changePercent: 0, // API doesn't provide % change easily
            dayLow: parseFloat(buyStr).toFixed(2),
            dayHigh: parseFloat(sellStr).toFixed(2),
            asOf: new Date().toISOString()
          }
        }
      } catch (e) {
        console.error('Thai Gold API error:', e)
      }
      throw new Error(`Thai Gold API unavailable`)
    }

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
              name: NAME_MAP[sym] || sym,
              price: data[id].usd.toFixed(2),
              currency: 'USD',
              changePercent: data[id].usd_24h_change ? parseFloat(data[id].usd_24h_change.toFixed(2)) : 0,
              dayLow: '0.00', // simple/price doesn't give low/high
              dayHigh: '0.00',
              asOf: new Date().toISOString()
            }
          }
        } else {
          console.warn(`CoinGecko rate limit hit for ${sym}. Trying Binance...`)
        }
      } catch (e) {
        console.error('CoinGecko quote error:', e)
      }

      // Fallback to Binance API for crypto if CoinGecko fails
      try {
        let binanceSym = sym
        if (sym === 'XAU' || sym === 'GOLD') binanceSym = 'PAXG'
        const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSym}USDT`)
        if (binanceRes.ok) {
           const bData = await binanceRes.json()
           if (bData && bData.lastPrice) {
             return {
              symbol: sym,
              name: NAME_MAP[sym] || sym, 
              price: parseFloat(bData.lastPrice).toFixed(2),
              currency: 'USD',
              changePercent: parseFloat(bData.priceChangePercent),
              dayLow: parseFloat(bData.lowPrice).toFixed(2),
              dayHigh: parseFloat(bData.highPrice).toFixed(2),
              asOf: new Date().toISOString()
             }
           }
        }
      } catch(e) {
         console.error('Binance quote error:', e)
      }

      throw new Error(`Crypto APIs unavailable for ${sym}`)
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
              name: NAME_MAP[sym] || sym,
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

    // 0. Thai Gold Historical (Real data derived from PAXG)
    if (sym === 'THAIGOLD' || sym === 'THAIGOLD_ORN' || sym === 'THAIGOLD_ORNAMENT') {
      try {
        let interval = '5m'
        let limit = 576 // 48 hours for 1D to ensure coverage
        if (timeframe === '5D') { interval = '1h'; limit = 120 }
        else if (timeframe === '1M') { interval = '1d'; limit = 30 }
        else if (timeframe === '6M') { interval = '1d'; limit = 180 }
        else if (timeframe === '1Y' || timeframe === 'YTD') { interval = '1d'; limit = 365 }

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=${interval}&limit=${limit}`)
        if (res.ok) {
          const data = await res.json()
          // 1 Baht Gold = 15.244 / 31.1034 oz. Current USD/THB approx 33.07
          const multiplier = (15.244 / 31.1034) * 33.07
          let resData = data.map((p: any) => ({
            time: Math.floor(p[0] / 1000),
            value: parseFloat((parseFloat(p[4]) * multiplier).toFixed(2)),
            volume: parseFloat(p[5])
          }))

          if (timeframe === '1D') {
            const nowSec = Math.floor(Date.now() / 1000)
            const localSec = nowSec + 7 * 3600
            const localMidnight = localSec - (localSec % 86400)
            const utcMidnight = localMidnight - 7 * 3600
            const currentHourICT = (nowSec - utcMidnight) / 3600

            let startSec = utcMidnight + 9 * 3600 // 09:00 ICT
            let endSec = startSec + 8.5 * 3600 // 17:30 ICT

            if (currentHourICT < 9) {
              startSec -= 24 * 3600
              endSec -= 24 * 3600
            }

            resData = resData.filter((d: any) => d.time >= startSec && d.time <= endSec)
          }

          return resData
        }
      } catch (e) {
        console.error('Binance gold history error:', e)
      }
      return []
    }

    // 1. Try Crypto
    if (CRYPTO_MAP[sym]) {
      try {
        let interval = '5m'
        let limit = 576 // 48h to ensure full coverage for 1D
        if (timeframe === '5D') { interval = '1h'; limit = 120 }
        else if (timeframe === '1M') { interval = '1d'; limit = 30 }
        else if (timeframe === '6M') { interval = '1d'; limit = 180 }
        else if (timeframe === '1Y' || timeframe === 'YTD') { interval = '1d'; limit = 365 }

        let binanceSym = sym
        if (sym === 'XAU' || sym === 'GOLD') binanceSym = 'PAXG'

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}USDT&interval=${interval}&limit=${limit}`)
        if (res.ok) {
          const data = await res.json()
          let resData = data.map((p: any) => ({
            time: Math.floor(p[0] / 1000),
            value: parseFloat(parseFloat(p[4]).toFixed(2)),
            volume: parseFloat(p[5])
          }))

          if (timeframe === '1D') {
            const nowSec = Math.floor(Date.now() / 1000)
            const localSec = nowSec + 7 * 3600
            const localMidnight = localSec - (localSec % 86400)
            const startSec = localMidnight - 7 * 3600 // 00:00 ICT
            const endSec = startSec + 24 * 3600 // 24:00 ICT

            resData = resData.filter((d: any) => d.time >= startSec && d.time <= endSec)
          }

          return resData
        }
      } catch (e) {
        console.error('Binance crypto history error:', e)
      }
      return []
    }

    // 2. Try Yahoo Finance (Stocks)
    // We don't strictly need finnhubKey for historical data now since we use Yahoo Finance.
    try {
      let interval = '1d'
      let range = '1y'

      if (timeframe === '1D') {
        interval = '5m'
        range = '1d'
      } else if (timeframe === '5D') {
        interval = '60m'
        range = '5d'
      } else if (timeframe === '1M') {
        interval = '1d'
        range = '1mo'
      } else if (timeframe === '6M') {
        interval = '1d'
        range = '6mo'
      } else if (timeframe === '1Y' || timeframe === 'YTD') {
        interval = '1d'
        range = '1y'
      }

      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=${interval}&range=${range}`)
      if (res.ok) {
        const data = await res.json()
        const result = data.chart?.result?.[0]
        
        if (result && result.timestamp && result.indicators?.quote?.[0]?.close) {
          let chartData = []
          const timestamps = result.timestamp
          const closes = result.indicators.quote[0].close
          const volumes = result.indicators.quote[0].volume
          
          for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
              chartData.push({
                time: timestamps[i],
                value: parseFloat(closes[i].toFixed(2)),
                volume: volumes && volumes[i] ? parseFloat(volumes[i]) : undefined
              })
            }
          }
          
          return chartData
        }
      }
    } catch (e) {
      console.error('Yahoo Finance history error:', e)
    }

    // Fallback: Return empty array so chart knows there is no data
    return []
  }
}

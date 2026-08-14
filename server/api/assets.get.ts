export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const symbolsParam = query.symbols as string || ''
  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)

  if (symbols.length === 0) {
    return {
      stocks: [],
      crypto: [],
      gold: null,
      thaiGold: [],
      updatedAt: new Date().toISOString(),
      errors: []
    }
  }

  const marketProvider = new RealMarketProvider()

  // Pre-defined mapping for popular crypto
  const CRYPTO_MAP: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'XRP': 'ripple',
    'BNB': 'binancecoin',
    'DOGE': 'dogecoin',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'ADA': 'cardano'
  }

  const stocksToFetch: string[] = []
  const cryptoToFetch: { symbol: string, id: string }[] = []
  const thaiGoldToFetch: string[] = []
  let fetchGold = false

  for (const sym of symbols) {
    if (sym === 'XAU' || sym === 'GOLD') {
      fetchGold = true
    } else if (sym.startsWith('THAIGOLD')) {
      thaiGoldToFetch.push(sym)
    } else if (CRYPTO_MAP[sym]) {
      cryptoToFetch.push({ symbol: sym, id: CRYPTO_MAP[sym] })
    } else {
      stocksToFetch.push(sym)
    }
  }

  const promises: Promise<any>[] = []

  // Add stock promises
  for (const sym of stocksToFetch) {
    promises.push(fetchStockPrice(sym).then(data => ({ type: 'stock', data })))
  }

  // Add crypto promises
  for (const crypto of cryptoToFetch) {
    promises.push(fetchCryptoPrice(crypto.id, crypto.symbol).then(data => ({ type: 'crypto', data })))
  }

  // Add gold promise
  if (fetchGold) {
    promises.push(fetchGoldPrice().then(data => ({ type: 'gold', data })))
  }

  // Add thai gold promises
  for (const sym of thaiGoldToFetch) {
    promises.push(marketProvider.getQuote(sym).then(data => ({ type: 'thaiGold', data })))
  }

  const results = await Promise.allSettled(promises)

  const response = {
    stocks: [] as any[],
    crypto: [] as any[],
    gold: null as any,
    thaiGold: [] as any[],
    updatedAt: new Date().toISOString(),
    errors: [] as string[]
  }

  for (const res of results) {
    if (res.status === 'fulfilled') {
      const { type, data } = res.value
      if (type === 'stock') response.stocks.push(data)
      else if (type === 'crypto') response.crypto.push(data)
      else if (type === 'gold') response.gold = data
      else if (type === 'thaiGold') response.thaiGold.push(data)
    } else {
      console.error('Provider error:', res.reason)
      response.errors.push(res.reason?.message || String(res.reason))
    }
  }

  return response
})

export const fetchStockPrice = defineCachedFunction(async (symbol: string) => {
  const config = useRuntimeConfig()
  if (!config.finnhubApiKey) {
    throw new Error('FINNHUB_API_KEY is not set')
  }
  
  // Free tier Finnhub limits: 60 API calls/minute. 
  const res = await $fetch<any>(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.finnhubApiKey}`)
  
  // res.c: Current price, res.d: Change, res.dp: Percent change
  if (res && res.c !== undefined && res.c !== 0) {
    return {
      symbol,
      price: res.c,
      change: res.d || 0,
      changePercent: res.dp || 0,
      currency: 'USD'
    }
  }
  throw new Error(`Invalid or zero price response for ${symbol}`)
}, {
  maxAge: 30,
  name: 'finnhubQuote',
  getKey: (symbol: string) => symbol
})

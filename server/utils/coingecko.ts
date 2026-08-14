export const fetchCryptoPrice = defineCachedFunction(async (id: string, symbol: string) => {
  const config = useRuntimeConfig()
  
  const headers: Record<string, string> = {}
  if (config.coingeckoApiKey) {
    headers['x-cg-demo-api-key'] = config.coingeckoApiKey
  }
  
  try {
    const res = await $fetch<any>(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`, { headers, retry: 0 })
    
    const data = res[id]
    if (data && data.usd !== undefined) {
      return {
        symbol,
        price: data.usd,
        changePercent: data.usd_24h_change || 0,
        currency: 'USD'
      }
    }
  } catch (err) {
    console.warn(`CoinGecko failed for ${symbol}, trying Binance...`)
    try {
      let binanceSym = symbol
      if (symbol === 'XAU' || symbol === 'GOLD') binanceSym = 'PAXG'
      const bRes = await $fetch<any>(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSym}USDT`, { retry: 0 })
      if (bRes && bRes.lastPrice) {
        return {
          symbol,
          price: parseFloat(bRes.lastPrice),
          changePercent: parseFloat(bRes.priceChangePercent) || 0,
          currency: 'USD'
        }
      }
    } catch (bErr) {
      console.error(`Binance fallback failed for ${symbol}`)
    }
  }
  
  throw new Error(`Crypto API unavailable for ${symbol}`)
}, {
  maxAge: 30,
  name: 'coingeckoPrice',
  getKey: (id: string, symbol: string) => id
})

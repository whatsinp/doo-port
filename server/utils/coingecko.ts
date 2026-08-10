export const fetchCryptoPrice = defineCachedFunction(async (id: string, symbol: string) => {
  const config = useRuntimeConfig()
  
  const headers: Record<string, string> = {}
  if (config.coingeckoApiKey) {
    headers['x-cg-demo-api-key'] = config.coingeckoApiKey
  }
  
  const res = await $fetch<any>(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`, { headers })
  
  const data = res[id]
  if (data && data.usd !== undefined) {
    return {
      symbol,
      price: data.usd,
      changePercent: data.usd_24h_change || 0,
      currency: 'USD'
    }
  }
  throw new Error(`Invalid response for ${id}`)
}, {
  maxAge: 30,
  name: 'coingeckoPrice',
  getKey: (id: string, symbol: string) => id
})

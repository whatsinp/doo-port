export const fetchGoldPrice = defineCachedFunction(async () => {
  const config = useRuntimeConfig()
  
  // The gold-api.com has a free endpoint that does not require an API key
  // But if the user provides GOLD_API_KEY, we pass it just in case it's for goldapi.io or similar
  const headers: Record<string, string> = {}
  if (config.goldApiKey) {
    headers['x-access-token'] = config.goldApiKey
    headers['x-api-key'] = config.goldApiKey
  }
  
  try {
    const res = await $fetch<any>('https://api.gold-api.com/price/XAU')
    if (res && res.price) {
      return {
        symbol: 'XAU',
        price: res.price,
        currency: 'USD',
        unit: 'oz',
        changePercent: 0 // Free API might not provide this
      }
    }
    throw new Error('Invalid response from Gold API')
  } catch (error) {
    console.error('Error fetching Gold API:', error)
    throw error
  }
}, {
  maxAge: 30,
  name: 'goldPrice',
  getKey: () => 'gold'
})

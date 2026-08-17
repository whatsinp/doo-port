export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const symbol = getRouterParam(event, 'symbol')
  if (!symbol) return { logo: null }
  
  try {
    const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${config.finnhubApiKey}`)
    if (res.ok) {
      const data = await res.json()
      return { logo: data.logo || null }
    }
  } catch (e) {
    console.error('Finnhub profile error', e)
  }
  return { logo: null }
}, {
  maxAge: 86400 * 7, // cache for 7 days
  name: 'asset-profile',
  getKey: (event) => getRouterParam(event, 'symbol') || 'unknown'
})

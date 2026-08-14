export default defineCachedEventHandler(async (event) => {
  const provider = new RealMarketProvider()
  const symbol = getRouterParam(event, 'symbol')
  if (!symbol) {
    throw createError({ statusCode: 400, statusMessage: 'Symbol is required' })
  }
  
  try {
    const quote = await provider.getQuote(symbol)
    return { success: true, message: 'Quote retrieved', data: quote }
  } catch (e: any) {
    return { success: false, message: e.message || 'API Error', data: null }
  }
}, {
  maxAge: 60, // Cache for 60 seconds
  name: 'market-quote',
  getKey: (event) => getRouterParam(event, 'symbol') || 'unknown'
})

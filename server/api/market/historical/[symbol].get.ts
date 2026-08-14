export default defineCachedEventHandler(async (event) => {
  const provider = new RealMarketProvider()
  const symbol = getRouterParam(event, 'symbol')
  if (!symbol) {
    throw createError({ statusCode: 400, statusMessage: 'Symbol is required' })
  }
  
  const query = getQuery(event)
  const timeframe = (query.timeframe as string) || '1M'
  
  try {
    const data = await provider.getHistoricalData(symbol, timeframe)
    return { success: true, message: 'Historical data retrieved', data }
  } catch (e: any) {
    return { success: false, message: e.message || 'API Error', data: null }
  }
}, {
  maxAge: 300, // Cache for 5 minutes
  name: 'market-historical',
  getKey: (event) => {
    const symbol = getRouterParam(event, 'symbol') || 'unknown'
    const timeframe = getQuery(event).timeframe || '1M'
    return `${symbol}-${timeframe}`
  }
})

export default defineEventHandler(async (event) => {
  const provider = new RealMarketProvider()
  const symbol = getRouterParam(event, 'symbol')
  if (!symbol) {
    throw createError({ statusCode: 400, statusMessage: 'Symbol is required' })
  }
  
  const query = getQuery(event)
  const timeframe = (query.timeframe as string) || '1M'
  
  const data = await provider.getHistoricalData(symbol, timeframe)
  
  return { success: true, message: 'Historical data retrieved', data }
})

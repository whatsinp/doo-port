export default defineEventHandler(async (event) => {
  const provider = new RealMarketProvider()
  const symbol = getRouterParam(event, 'symbol')
  if (!symbol) {
    throw createError({ statusCode: 400, statusMessage: 'Symbol is required' })
  }
  
  const quote = await provider.getQuote(symbol)
  
  return { success: true, message: 'Quote retrieved', data: quote }
})

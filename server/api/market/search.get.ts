export default defineEventHandler(async (event) => {
  const provider = new RealMarketProvider()
  const query = getQuery(event)
  const q = (query.query as string) || (query.q as string) || ''
  
  const results = await provider.searchAssets(q)
  
  return { success: true, message: 'Search results', data: results }
})

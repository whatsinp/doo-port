import { Router } from 'express'
import { MockMarketProvider } from '../providers/MockMarketProvider'

const router = Router()
const provider = new MockMarketProvider()

router.get('/search', async (req, res) => {
  const query = (req.query.query as string) || (req.query.q as string) || ''
  const results = await provider.searchAssets(query)
  res.json({ success: true, message: 'Search results', data: results })
})

router.get('/quotes/:symbol', async (req, res) => {
  const symbol = req.params.symbol
  const quote = await provider.getQuote(symbol)
  res.json({ success: true, message: 'Quote retrieved', data: quote })
})

router.get('/historical/:symbol', async (req, res) => {
  const symbol = req.params.symbol
  const timeframe = (req.query.timeframe as string) || '1M'
  const data = await provider.getHistoricalData(symbol, timeframe)
  res.json({ success: true, message: 'Historical data retrieved', data })
})

export default router

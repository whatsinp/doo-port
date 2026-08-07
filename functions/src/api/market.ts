import { Router } from 'express'
import { MockMarketProvider } from '../providers/MockMarketProvider'

const router = Router()
const provider = new MockMarketProvider()

router.get('/search', async (req, res) => {
  const query = (req.query.q as string) || ''
  const results = await provider.searchAssets(query)
  res.json({ success: true, message: 'Search results', data: results })
})

router.get('/quotes/:symbol', async (req, res) => {
  const symbol = req.params.symbol
  const quote = await provider.getQuote(symbol)
  res.json({ success: true, message: 'Quote retrieved', data: quote })
})

export default router

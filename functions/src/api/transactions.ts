import { Router } from 'express'
import { LedgerService } from '../services/LedgerService'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const ledgerService = new LedgerService()

router.use(requireAuth)

router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Received buy transaction request body:', req.body)
    const uid = req.user!.uid
    const result = await ledgerService.processBuyTransaction(uid, req.body)
    res.json(result)
  } catch (error: any) {
    console.error('Buy Transaction error:', error)
    res.status(400).json({ success: false, message: error.message, data: null })
  }
})

router.post('/sell', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Received sell transaction request body:', req.body)
    const uid = req.user!.uid
    const result = await ledgerService.processSellTransaction(uid, req.body)
    res.json(result)
  } catch (error: any) {
    console.error('Sell Transaction error:', error)
    res.status(400).json({ success: false, message: error.message, data: null })
  }
})

router.delete('/holding/:portfolioId/:assetSymbol', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Received delete holding request params:', req.params)
    const uid = req.user!.uid
    const portfolioId = req.params.portfolioId as string
    const assetSymbol = req.params.assetSymbol as string
    const result = await ledgerService.deleteHolding(uid, portfolioId, assetSymbol)
    res.json(result)
  } catch (error: any) {
    console.error('Delete Holding error:', error)
    res.status(400).json({ success: false, message: error.message, data: null })
  }
})

export default router

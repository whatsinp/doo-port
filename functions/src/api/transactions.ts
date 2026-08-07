import { Router } from 'express'
import { LedgerService } from '../services/LedgerService'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const ledgerService = new LedgerService()

router.use(requireAuth)

router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Received transaction request body:', req.body)
    const uid = req.user!.uid
    const result = await ledgerService.processBuyTransaction(uid, req.body)
    res.json(result)
  } catch (error: any) {
    console.error('Transaction error:', error)
    res.status(400).json({ success: false, message: error.message, data: null })
  }
})

export default router

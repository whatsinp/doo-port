import * as functions from 'firebase-functions/v2'
import * as admin from 'firebase-admin'
import express from 'express'
import cors from 'cors'

import marketRouter from './api/market'
import transactionsRouter from './api/transactions'

admin.initializeApp()

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// API Routes
app.use('/api/v1/market', marketRouter)
app.use('/api/v1/transactions', transactionsRouter)

// Fallback error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Internal Server Error', data: null })
})

// Export the Express API as a Firebase HTTP Cloud Function
export const api = functions.https.onRequest(app)

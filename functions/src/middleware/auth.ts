import { Request, Response, NextFunction } from 'express'
import * as admin from 'firebase-admin'

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided', data: null })
    return
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)

    // Suspend user check (Custom claims)
    if (decodedToken.suspended) {
      res.status(403).json({ success: false, message: 'Forbidden: Account suspended', data: null })
      return
    }

    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Error verifying auth token', error)
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token', data: null })
  }
}

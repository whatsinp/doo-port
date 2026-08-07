import * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import Decimal from 'decimal.js'

Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

export class LedgerService {
  private get db() {
    return admin.firestore()
  }

  async processBuyTransaction(userId: string, data: any) {
    // 1. Extract payload
    const { portfolioId, assetSymbol, quantity, unitPrice, tradeCurrency } = data

    if (!portfolioId || !assetSymbol || !quantity || !unitPrice) {
      throw new Error('Missing required fields')
    }

    const buyQty = new Decimal(quantity)
    const price = new Decimal(unitPrice)
    if (buyQty.lte(0) || price.lte(0))
      throw new Error('Quantity and price must be greater than zero')

    const grossAmount = buyQty.times(price)
    const txId = this.db.collection('transactions').doc().id
    const holdingId = `${portfolioId}_${assetSymbol}`

    const holdingRef = this.db.collection('holdings').doc(holdingId)
    const txRef = this.db.collection('transactions').doc(txId)

    // 2. Perform atomic transaction
    await this.db.runTransaction(async (t) => {
      const holdingDoc = await t.get(holdingRef)

      let prevQty = new Decimal(0)
      let prevCostBasis = new Decimal(0)

      if (holdingDoc.exists) {
        const hData = holdingDoc.data()!
        if (hData.userId !== userId) throw new Error('Unauthorized')
        prevQty = new Decimal(hData.quantity)
        prevCostBasis = new Decimal(hData.costBasis)
      }

      // 3. Calculate new holding per CALCULATION_SPEC.md
      const newQuantity = prevQty.plus(buyQty)
      const newCostBasis = prevCostBasis.plus(grossAmount)
      const newAverageCost = newQuantity.isZero()
        ? new Decimal(0)
        : newCostBasis.dividedBy(newQuantity)

      // 4. Save Transaction
      t.set(txRef, {
        id: txId,
        userId,
        portfolioId,
        type: 'BUY',
        assetSymbol,
        quantity: buyQty.toFixed(6),
        unitPrice: price.toFixed(6),
        fees: '0',
        taxes: '0',
        grossAmount: grossAmount.toFixed(6),
        tradeCurrency: tradeCurrency || 'USD',
        transactionDate: new Date().toISOString(),
        createdAt: FieldValue.serverTimestamp()
      })

      // 5. Save Holding
      t.set(
        holdingRef,
        {
          id: holdingId,
          userId,
          portfolioId,
          assetSymbol,
          tradeCurrency: tradeCurrency || 'USD',
          quantity: newQuantity.toFixed(6),
          costBasis: newCostBasis.toFixed(6),
          averageCost: newAverageCost.toFixed(6),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      )
    })

    return { success: true, message: 'Buy transaction processed securely', data: { id: txId } }
  }
}

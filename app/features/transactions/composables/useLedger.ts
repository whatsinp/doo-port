import { useAuth } from '~/features/auth/composables/useAuth'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, collection, runTransaction, serverTimestamp, getDocs, query, where, writeBatch } from 'firebase/firestore'
import Decimal from 'decimal.js'

Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

export const useLedger = () => {
  const auth = useAuth()
  const db = getFirestore()

  const getUserId = () => {
    const user = getAuth().currentUser
    if (!user) throw new Error('Not logged in')
    return user.uid
  }

  const processBuy = async (
    portfolioId: string,
    assetSymbol: string,
    quantity: number,
    unitPrice: number,
    tradeCurrency: string = 'USD'
  ) => {
    const userId = getUserId()
    
    if (!portfolioId || !assetSymbol || !quantity || !unitPrice) {
      throw new Error('Missing required fields')
    }

    const buyQty = new Decimal(quantity)
    const price = new Decimal(unitPrice)
    if (buyQty.lte(0) || price.lte(0))
      throw new Error('Quantity and price must be greater than zero')

    const grossAmount = buyQty.times(price)
    
    const txRef = doc(collection(db, 'transactions'))
    const txId = txRef.id
    
    const holdingId = `${portfolioId}_${assetSymbol}`
    const holdingRef = doc(db, 'holdings', holdingId)

    await runTransaction(db, async (t) => {
      const holdingDoc = await t.get(holdingRef)

      let prevQty = new Decimal(0)
      let prevCostBasis = new Decimal(0)

      if (holdingDoc.exists()) {
        const hData = holdingDoc.data()
        if (hData.userId !== userId) throw new Error('Unauthorized')
        prevQty = new Decimal(hData.quantity)
        prevCostBasis = new Decimal(hData.costBasis)
      }

      const newQuantity = prevQty.plus(buyQty)
      const newCostBasis = prevCostBasis.plus(grossAmount)
      const newAverageCost = newQuantity.isZero()
        ? new Decimal(0)
        : newCostBasis.dividedBy(newQuantity)

      t.set(txRef, {
        id: txId,
        userId,
        portfolioId,
        type: 'BUY',
        assetSymbol: assetSymbol.toUpperCase(),
        quantity: buyQty.toFixed(6),
        unitPrice: price.toFixed(6),
        fees: '0',
        taxes: '0',
        grossAmount: grossAmount.toFixed(6),
        tradeCurrency,
        transactionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      })

      t.set(
        holdingRef,
        {
          id: holdingId,
          userId,
          portfolioId,
          assetSymbol: assetSymbol.toUpperCase(),
          tradeCurrency,
          quantity: newQuantity.toFixed(6),
          costBasis: newCostBasis.toFixed(6),
          averageCost: newAverageCost.toFixed(6),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    })

    return { success: true, message: 'Buy transaction processed securely', data: { id: txId } }
  }

  const processSell = async (
    portfolioId: string,
    assetSymbol: string,
    quantity: number,
    unitPrice: number,
    tradeCurrency: string = 'USD'
  ) => {
    const userId = getUserId()

    if (!portfolioId || !assetSymbol || !quantity || !unitPrice) {
      throw new Error('Missing required fields')
    }

    const sellQty = new Decimal(quantity)
    const price = new Decimal(unitPrice)
    if (sellQty.lte(0) || price.lte(0))
      throw new Error('Quantity and price must be greater than zero')

    const grossAmount = sellQty.times(price)
    
    const txRef = doc(collection(db, 'transactions'))
    const txId = txRef.id
    
    const holdingId = `${portfolioId}_${assetSymbol}`
    const holdingRef = doc(db, 'holdings', holdingId)

    await runTransaction(db, async (t) => {
      const holdingDoc = await t.get(holdingRef)

      if (!holdingDoc.exists()) {
        throw new Error('Holding not found. Cannot sell asset you do not own.')
      }

      const hData = holdingDoc.data()
      if (hData.userId !== userId) throw new Error('Unauthorized')

      const prevQty = new Decimal(hData.quantity)
      const prevCostBasis = new Decimal(hData.costBasis)
      const prevAverageCost = new Decimal(hData.averageCost)

      if (sellQty.gt(prevQty)) {
        throw new Error('Cannot sell more than the currently owned quantity.')
      }

      const costOfSoldQuantity = prevAverageCost.times(sellQty)
      const realizedProfit = grossAmount.minus(costOfSoldQuantity)
      
      const newQuantity = prevQty.minus(sellQty)
      const newCostBasis = prevCostBasis.minus(costOfSoldQuantity)
      const newAverageCost = newQuantity.isZero() ? new Decimal(0) : prevAverageCost

      t.set(txRef, {
        id: txId,
        userId,
        portfolioId,
        type: 'SELL',
        assetSymbol: assetSymbol.toUpperCase(),
        quantity: sellQty.toFixed(6),
        unitPrice: price.toFixed(6),
        fees: '0',
        taxes: '0',
        grossAmount: grossAmount.toFixed(6),
        realizedProfit: realizedProfit.toFixed(6),
        tradeCurrency,
        transactionDate: new Date().toISOString(),
        createdAt: serverTimestamp()
      })

      t.set(
        holdingRef,
        {
          id: holdingId,
          userId,
          portfolioId,
          assetSymbol: assetSymbol.toUpperCase(),
          tradeCurrency,
          quantity: newQuantity.toFixed(6),
          costBasis: newCostBasis.toFixed(6),
          averageCost: newAverageCost.toFixed(6),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    })

    return { success: true, message: 'Sell transaction processed securely', data: { id: txId } }
  }

  const deleteHolding = async (portfolioId: string, assetSymbol: string) => {
    const userId = getUserId()
    
    if (!portfolioId || !assetSymbol) {
      throw new Error('Missing required fields')
    }

    const holdingId = `${portfolioId}_${assetSymbol.toUpperCase()}`
    const holdingRef = doc(db, 'holdings', holdingId)

    await runTransaction(db, async (t) => {
      const holdingDoc = await t.get(holdingRef)

      if (!holdingDoc.exists()) {
        throw new Error('Holding not found.')
      }

      const hData = holdingDoc.data()
      if (hData.userId !== userId) throw new Error('Unauthorized')

      t.delete(holdingRef)
    })

    // Batch delete related transactions outside of atomic block
    const txQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('portfolioId', '==', portfolioId),
      where('assetSymbol', '==', assetSymbol.toUpperCase())
    )

    const txDocs = await getDocs(txQuery)
    if (!txDocs.empty) {
      const batch = writeBatch(db)
      txDocs.forEach((d) => {
        batch.delete(d.ref)
      })
      await batch.commit()
    }

    return { success: true, message: 'Holding completely deleted' }
  }

  return { processBuy, processSell, deleteHolding }
}

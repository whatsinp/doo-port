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
    tradeCurrency: string = 'USD',
    exchangeRateUsed: number = 1
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
      let prevCostBasisTHB = new Decimal(0)

      if (holdingDoc.exists()) {
        const hData = holdingDoc.data()
        if (hData.userId !== userId) throw new Error('Unauthorized')
        prevQty = new Decimal(hData.quantity)
        prevCostBasis = new Decimal(hData.costBasis)
        prevCostBasisTHB = hData.costBasisTHB !== undefined ? new Decimal(hData.costBasisTHB) : prevCostBasis.times(exchangeRateUsed)
      }

      let grossAmountBaseCurrency = grossAmount
      if (assetSymbol.startsWith('THAIGOLD')) {
        if (tradeCurrency === 'USD') {
          grossAmountBaseCurrency = grossAmount.times(exchangeRateUsed)
        }
      } else {
        if (tradeCurrency === 'THB') {
          grossAmountBaseCurrency = grossAmount.dividedBy(exchangeRateUsed)
        }
      }

      const newQuantity = prevQty.plus(buyQty)
      const newCostBasis = prevCostBasis.plus(grossAmountBaseCurrency)
      const newAverageCost = newQuantity.isZero()
        ? new Decimal(0)
        : newCostBasis.dividedBy(newQuantity)
        
      const buyAmountTHB = tradeCurrency === 'THB' ? grossAmount : grossAmount.times(exchangeRateUsed)
      const newCostBasisTHB = prevCostBasisTHB.plus(buyAmountTHB)

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
        exchangeRateUsed: exchangeRateUsed.toString(),
        grossAmountTHB: buyAmountTHB.toFixed(6),
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
          tradeCurrency: assetSymbol.startsWith('THAIGOLD') ? 'THB' : 'USD',
          quantity: newQuantity.toFixed(6),
          costBasis: newCostBasis.toFixed(6),
          costBasisTHB: newCostBasisTHB.toFixed(6),
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
    tradeCurrency: string = 'USD',
    exchangeRateUsed: number = 1
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
      const prevCostBasisTHB = hData.costBasisTHB !== undefined ? new Decimal(hData.costBasisTHB) : prevCostBasis.times(exchangeRateUsed)

      if (sellQty.gt(prevQty)) {
        throw new Error('Cannot sell more than the currently owned quantity.')
      }

      let grossAmountBaseCurrency = grossAmount
      if (assetSymbol.startsWith('THAIGOLD')) {
        if (tradeCurrency === 'USD') {
          grossAmountBaseCurrency = grossAmount.times(exchangeRateUsed)
        }
      } else {
        if (tradeCurrency === 'THB') {
          grossAmountBaseCurrency = grossAmount.dividedBy(exchangeRateUsed)
        }
      }

      const costOfSoldQuantity = prevAverageCost.times(sellQty)
      const costOfSoldQuantityTHB = prevCostBasisTHB.times(sellQty.dividedBy(prevQty))
      const realizedProfit = grossAmountBaseCurrency.minus(costOfSoldQuantity)
      
      const newQuantity = prevQty.minus(sellQty)
      const newCostBasis = prevCostBasis.minus(costOfSoldQuantity)
      const newCostBasisTHB = prevCostBasisTHB.minus(costOfSoldQuantityTHB)
      const newAverageCost = newQuantity.isZero() ? new Decimal(0) : prevAverageCost
      
      const sellAmountTHB = tradeCurrency === 'THB' ? grossAmount : grossAmount.times(exchangeRateUsed)

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
        exchangeRateUsed: exchangeRateUsed.toString(),
        grossAmountTHB: sellAmountTHB.toFixed(6),
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
          tradeCurrency: assetSymbol.startsWith('THAIGOLD') ? 'THB' : 'USD',
          quantity: newQuantity.toFixed(6),
          costBasis: newCostBasis.toFixed(6),
          costBasisTHB: newCostBasisTHB.toFixed(6),
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

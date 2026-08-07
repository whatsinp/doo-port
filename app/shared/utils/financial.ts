import Decimal from 'decimal.js'
import type { DecimalString } from '../types/money'
import type { Holding, InvestmentTransaction } from '../types/domain'

// Configure Decimal.js strictly according to spec
Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

export const ZERO = '0'

/**
 * Ensures strict monetary representation
 */
export function toDecimalString(value: Decimal.Value, decimalPlaces = 6): DecimalString {
  return new Decimal(value).toFixed(decimalPlaces, Decimal.ROUND_HALF_UP)
}

/**
 * Calculates a BUY transaction according to CALCULATION_SPEC.md
 */
export function calculateBuy(
  previousHolding: Holding | null,
  transaction: InvestmentTransaction
): { newHolding: Holding; realizedProfit: DecimalString } {
  if (transaction.type !== 'BUY') throw new Error('Transaction must be of type BUY')

  const buyQty = new Decimal(transaction.quantity)
  if (buyQty.lte(0)) throw new Error('Buy quantity must be greater than zero')

  const prevQty = previousHolding ? new Decimal(previousHolding.quantity) : new Decimal(0)
  const prevCostBasis = previousHolding ? new Decimal(previousHolding.costBasis) : new Decimal(0)

  const grossAmount = new Decimal(transaction.grossAmount)
  const fees = new Decimal(transaction.fees || 0)
  const taxes = new Decimal(transaction.taxes || 0)

  const newQuantity = prevQty.plus(buyQty)
  const newCostBasis = prevCostBasis.plus(grossAmount).plus(fees).plus(taxes)
  const newAverageCost = newQuantity.isZero() ? new Decimal(0) : newCostBasis.dividedBy(newQuantity)

  const newHolding: Holding = {
    portfolioId: transaction.portfolioId,
    assetSymbol: transaction.assetSymbol,
    tradeCurrency: transaction.tradeCurrency,
    quantity: toDecimalString(newQuantity),
    costBasis: toDecimalString(newCostBasis),
    averageCost: toDecimalString(newAverageCost),
    updatedAt: new Date().toISOString()
  }

  return { newHolding, realizedProfit: ZERO }
}

/**
 * Calculates a SELL transaction according to CALCULATION_SPEC.md
 */
export function calculateSell(
  previousHolding: Holding,
  transaction: InvestmentTransaction
): { newHolding: Holding; realizedProfit: DecimalString } {
  if (transaction.type !== 'SELL') throw new Error('Transaction must be of type SELL')

  const sellQty = new Decimal(transaction.quantity)
  if (sellQty.lte(0)) throw new Error('Sell quantity must be greater than zero')

  const prevQty = new Decimal(previousHolding.quantity)
  if (sellQty.gt(prevQty)) throw new Error('Cannot sell more than current holding quantity')

  const prevAvgCost = new Decimal(previousHolding.averageCost)
  const prevCostBasis = new Decimal(previousHolding.costBasis)

  const grossAmount = new Decimal(transaction.grossAmount)
  const fees = new Decimal(transaction.fees || 0)
  const taxes = new Decimal(transaction.taxes || 0)

  // netCashChange from a sell: grossAmount - fees - taxes
  const netSellProceeds = grossAmount.minus(fees).minus(taxes)

  const costOfSoldQuantity = prevAvgCost.times(sellQty)
  const realizedProfit = netSellProceeds.minus(costOfSoldQuantity)

  const newQuantity = prevQty.minus(sellQty)
  // Ensure that if we sold exactly all, cost basis becomes exactly 0
  const newCostBasis = newQuantity.isZero()
    ? new Decimal(0)
    : prevCostBasis.minus(costOfSoldQuantity)
  const newAverageCost = newQuantity.isZero() ? new Decimal(0) : newCostBasis.dividedBy(newQuantity)

  const newHolding: Holding = {
    ...previousHolding,
    quantity: toDecimalString(newQuantity),
    costBasis: toDecimalString(newCostBasis),
    averageCost: toDecimalString(newAverageCost),
    updatedAt: new Date().toISOString()
  }

  return { newHolding, realizedProfit: toDecimalString(realizedProfit) }
}

/**
 * Calculate basic monetary transaction amounts
 */
export function calculateTransactionAmounts(
  type: 'BUY' | 'SELL',
  quantity: Decimal.Value,
  unitPrice: Decimal.Value,
  fees: Decimal.Value = 0,
  taxes: Decimal.Value = 0
): { grossAmount: DecimalString; netCashChange: DecimalString } {
  const qty = new Decimal(quantity)
  const price = new Decimal(unitPrice)
  const f = new Decimal(fees)
  const t = new Decimal(taxes)

  const grossAmount = qty.times(price)

  let netCashChange: Decimal
  if (type === 'BUY') {
    netCashChange = grossAmount.plus(f).plus(t).negated()
  } else {
    netCashChange = grossAmount.minus(f).minus(t)
  }

  return {
    grossAmount: toDecimalString(grossAmount),
    netCashChange: toDecimalString(netCashChange)
  }
}

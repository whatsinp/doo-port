import { describe, it, expect } from 'vitest'
import {
  calculateBuy,
  calculateSell,
  calculateTransactionAmounts
} from '../../app/shared/utils/financial'
import type { Holding, InvestmentTransaction } from '../../app/shared/types/domain'

describe('Financial Utils', () => {
  describe('calculateTransactionAmounts', () => {
    it('correctly calculates BUY transaction amounts with floating point precision safety', () => {
      // 0.1 * 0.2 in normal JS is 0.020000000000000004
      const result = calculateTransactionAmounts('BUY', '0.1', '0.2', '0.01', '0.01')
      expect(result.grossAmount).toBe('0.020000') // 0.1 * 0.2
      expect(result.netCashChange).toBe('-0.040000') // -(0.02 + 0.01 + 0.01)
    })

    it('correctly calculates SELL transaction amounts', () => {
      const result = calculateTransactionAmounts('SELL', '10', '100', '5', '1')
      expect(result.grossAmount).toBe('1000.000000')
      expect(result.netCashChange).toBe('994.000000') // 1000 - 5 - 1
    })
  })

  describe('calculateBuy', () => {
    it('creates a new holding correctly when none exists', () => {
      const tx: InvestmentTransaction = {
        id: '1',
        portfolioId: 'p1',
        type: 'BUY',
        assetSymbol: 'AAPL',
        quantity: '10',
        unitPrice: '150',
        fees: '2',
        taxes: '1',
        grossAmount: '1500',
        netCashChange: '-1503',
        tradeCurrency: 'USD',
        exchangeRate: '1',
        transactionDate: '',
        createdAt: ''
      }
      const { newHolding, realizedProfit } = calculateBuy(null, tx)
      expect(realizedProfit).toBe('0')
      expect(newHolding.quantity).toBe('10.000000')
      expect(newHolding.costBasis).toBe('1503.000000')
      expect(newHolding.averageCost).toBe('150.300000')
    })

    it('updates an existing holding correctly (averaging up)', () => {
      const prevHolding: Holding = {
        portfolioId: 'p1',
        assetSymbol: 'AAPL',
        tradeCurrency: 'USD',
        quantity: '10',
        costBasis: '1503',
        averageCost: '150.3',
        updatedAt: ''
      }
      const tx: InvestmentTransaction = {
        id: '2',
        portfolioId: 'p1',
        type: 'BUY',
        assetSymbol: 'AAPL',
        quantity: '10',
        unitPrice: '200',
        fees: '0',
        taxes: '0',
        grossAmount: '2000',
        netCashChange: '-2000',
        tradeCurrency: 'USD',
        exchangeRate: '1',
        transactionDate: '',
        createdAt: ''
      }
      const { newHolding } = calculateBuy(prevHolding, tx)
      expect(newHolding.quantity).toBe('20.000000')
      expect(newHolding.costBasis).toBe('3503.000000') // 1503 + 2000
      expect(newHolding.averageCost).toBe('175.150000') // 3503 / 20
    })
  })

  describe('calculateSell', () => {
    it('calculates partial sell and realized profit correctly', () => {
      const prevHolding: Holding = {
        portfolioId: 'p1',
        assetSymbol: 'AAPL',
        tradeCurrency: 'USD',
        quantity: '20',
        costBasis: '3503',
        averageCost: '175.15',
        updatedAt: ''
      }
      const tx: InvestmentTransaction = {
        id: '3',
        portfolioId: 'p1',
        type: 'SELL',
        assetSymbol: 'AAPL',
        quantity: '10',
        unitPrice: '300',
        fees: '10',
        taxes: '5',
        grossAmount: '3000',
        netCashChange: '2985',
        tradeCurrency: 'USD',
        exchangeRate: '1',
        transactionDate: '',
        createdAt: ''
      }
      const { newHolding, realizedProfit } = calculateSell(prevHolding, tx)

      // Cost of sold quantity: 175.15 * 10 = 1751.5
      // Net proceeds: 3000 - 15 = 2985
      // Realized Profit = 2985 - 1751.5 = 1233.5
      expect(realizedProfit).toBe('1233.500000')
      expect(newHolding.quantity).toBe('10.000000')
      expect(newHolding.costBasis).toBe('1751.500000') // 3503 - 1751.5
      expect(newHolding.averageCost).toBe('175.150000') // Unchanged
    })

    it('calculates full sell and correctly zeroes out cost basis', () => {
      const prevHolding: Holding = {
        portfolioId: 'p1',
        assetSymbol: 'AAPL',
        tradeCurrency: 'USD',
        quantity: '10',
        costBasis: '1751.5',
        averageCost: '175.15',
        updatedAt: ''
      }
      const tx: InvestmentTransaction = {
        id: '4',
        portfolioId: 'p1',
        type: 'SELL',
        assetSymbol: 'AAPL',
        quantity: '10',
        unitPrice: '200',
        fees: '0',
        taxes: '0',
        grossAmount: '2000',
        netCashChange: '2000',
        tradeCurrency: 'USD',
        exchangeRate: '1',
        transactionDate: '',
        createdAt: ''
      }
      const { newHolding, realizedProfit } = calculateSell(prevHolding, tx)

      expect(realizedProfit).toBe('248.500000') // 2000 - 1751.5
      expect(newHolding.quantity).toBe('0.000000')
      expect(newHolding.costBasis).toBe('0.000000')
      expect(newHolding.averageCost).toBe('0.000000')
    })

    it('throws error if selling more than owned', () => {
      const prevHolding: Holding = {
        portfolioId: 'p1',
        assetSymbol: 'AAPL',
        tradeCurrency: 'USD',
        quantity: '10',
        costBasis: '1500',
        averageCost: '150',
        updatedAt: ''
      }
      const tx: InvestmentTransaction = {
        id: '5',
        portfolioId: 'p1',
        type: 'SELL',
        assetSymbol: 'AAPL',
        quantity: '15',
        unitPrice: '200',
        fees: '0',
        taxes: '0',
        grossAmount: '3000',
        netCashChange: '3000',
        tradeCurrency: 'USD',
        exchangeRate: '1',
        transactionDate: '',
        createdAt: ''
      }
      expect(() => calculateSell(prevHolding, tx)).toThrow(
        'Cannot sell more than current holding quantity'
      )
    })
  })
})

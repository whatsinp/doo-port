import type { DecimalString, CurrencyCode } from './money'

export type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW'

export interface BaseTransaction {
  id: string
  portfolioId: string
  type: TransactionType
  transactionDate: string // ISO date
  createdAt: string // ISO date
  notes?: string
}

export interface InvestmentTransaction extends BaseTransaction {
  type: 'BUY' | 'SELL'
  assetSymbol: string
  quantity: DecimalString
  unitPrice: DecimalString
  fees: DecimalString
  taxes: DecimalString
  grossAmount: DecimalString
  netCashChange: DecimalString
  tradeCurrency: CurrencyCode
  exchangeRate: DecimalString // defaults to '1' if local
}

export interface CashTransaction extends BaseTransaction {
  type: 'DEPOSIT' | 'WITHDRAW'
  netCashChange: DecimalString
  tradeCurrency: CurrencyCode
}

export type Transaction = InvestmentTransaction | CashTransaction

export interface Holding {
  portfolioId: string
  assetSymbol: string
  tradeCurrency: CurrencyCode
  quantity: DecimalString
  costBasis: DecimalString
  averageCost: DecimalString
  updatedAt: string
}

export interface CashAccount {
  portfolioId: string
  currency: CurrencyCode
  balance: DecimalString
  updatedAt: string
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface PortfolioValuationSnapshot {
  id: string
  portfolioId: string
  valuationDate: string // ISO date
  displayCurrency: CurrencyCode
  holdingsValue: DecimalString
  cashValue: DecimalString
  totalValue: DecimalString
  calculationVersion: number
  fxAsOf: string
  quoteAsOf: string
}

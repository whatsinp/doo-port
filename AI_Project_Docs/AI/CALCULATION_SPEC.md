# CALCULATION_SPEC

Version: 1.0

---

# Purpose

This document is the single source of truth for financial calculations.

No portfolio, dashboard, transaction, or chart calculation may be implemented from an undocumented assumption.

---

# Monetary Precision

- Do not use JavaScript floating-point arithmetic for money, prices, quantities, or exchange rates.
- Persist decimal values as canonical decimal strings.
- Every instrument defines `quantityScale` and `priceScale`.
- Display rounding never changes persisted values.
- All calculation results use `ROUND_HALF_UP` unless a later ADR explicitly replaces it.

---

# Transaction Amounts

For a buy transaction:

```text
grossAmount = quantity * unitPrice
netCashChange = -(grossAmount + fees + taxes)
```

For a sell transaction:

```text
grossAmount = quantity * unitPrice
netCashChange = grossAmount - fees - taxes
```

`fees` and `taxes` default to `0` but must be stored explicitly.

---

# Average Cost

Average Cost is calculated in the instrument trading currency.

For a buy:

```text
newQuantity = previousQuantity + buyQuantity
newCostBasis = previousCostBasis + grossAmount + fees + taxes
newAverageCost = newCostBasis / newQuantity
```

For a sell:

```text
costOfSoldQuantity = previousAverageCost * sellQuantity
realizedProfit = netSellProceeds - costOfSoldQuantity
newQuantity = previousQuantity - sellQuantity
newCostBasis = previousCostBasis - costOfSoldQuantity
```

- A sell must never exceed the current settled quantity.
- A zero quantity holding has a zero cost basis and zero average cost.
- Selling all quantity removes the active holding projection but preserves the immutable transaction ledger.
- Transactions are processed by `transactionDate`, then `createdAt`, then document ID.

---

# Currency Conversion

- `tradeCurrency` is the currency of the instrument price and cash settlement.
- `displayCurrency` affects presentation only; it never changes ledger values.
- `exchangeRate` on a transaction is immutable and records the user-confirmed rate for that transaction.
- Current dashboard conversion uses the latest available FX quote and must expose `fxAsOf`.
- Historical chart conversion uses the rate for the valuation date. If unavailable, the point is unavailable; it must not silently use a current rate.
- FX rate direction is always explicit: `baseCurrency`, `quoteCurrency`, and `rate` mean one unit of base currency equals `rate` units of quote currency.

---

# Portfolio and Dashboard Metrics

```text
currentValue = quantity * currentPrice
unrealizedProfit = currentValue - currentCostBasis
portfolioValue = convertedHoldingsValue + convertedCashBalance
totalProfit = realizedProfit + unrealizedProfit
allocation = assetCurrentValue / portfolioValue
```

- `All Portfolio` is a virtual aggregate and is never a persisted cash account or holding owner.
- `todayChange` is the value change between the latest available market close and the previous market close, converted using rates at the corresponding valuation times.
- A metric must return its `asOf`, source, and stale status.
- `Top Gainer` and `Top Loser` are determined by percentage change among holdings with an available previous close. Cash is excluded.

---

# Historical Performance

- The application stores one `portfolioValuations` snapshot per portfolio and valuation date.
- A snapshot includes holdings value, cash value, total value, display currency, quote timestamp, FX timestamp, and `calculationVersion`.
- The dashboard chart reads snapshots; it must not replay an unbounded transaction history in the client.

---

# Corrections and Corporate Actions

- A confirmed transaction is an immutable ledger event.
- A user correction creates a reversal event and a replacement event; it does not overwrite the original financial event.
- A user may cancel a transaction only when the reversal leaves no later holding state invalid.
- Stock splits, reverse splits, mergers, spin-offs, delistings, and symbol changes are not supported in MVP. Affected instruments must show a data-quality warning instead of silently changing cost basis.

---

# Validation

- Quantity and price must be greater than zero for buy and sell transactions.
- Fees and taxes must be zero or greater.
- Deposits and withdrawals must be greater than zero.
- A withdrawal must not exceed the available cash balance in the selected cash account.
- A transaction date cannot be in the future and must be within the supported market-history window.

# FEATURES

Version: 1.0

---

# Overview

This document defines all functional features of the Investment Portfolio Tracker MVP.

Every feature must be implemented according to the business rules defined in this document.

---

# Feature List

- Authentication
- User Profile
- Dashboard
- Portfolio Management
- Investment Management
- Cash Management
- Market Search
- Asset Detail
- Favorite Assets
- Notification Center
- Settings
- Admin Panel

---

# Authentication

## Description

Allow users to securely access the application.

## Features

- Register with Email
- Login with Email
- Login with Google
- Email Verification
- Reset Password
- Remember Login
- Logout

## Business Rules

- Email verification is required before first login.
- Google Login skips email verification.
- Remember Login should persist user sessions.
- Multiple active sessions are allowed.
- Passwords are never stored manually.

---

# User Profile

## Description

Allow users to manage personal information.

## Editable Fields

- Profile Image
- First Name
- Last Name
- Nickname
- Language
- Theme
- Default Currency

## Business Rules

- Email cannot be changed.
- Profile image is optional.
- Nickname is displayed throughout the application.

---

# Dashboard

## Description

Display an overview of the user's investments.

## Display

- Portfolio Value
- Today's Change
- Invested Amount
- Current Value
- Cash Balance
- Total Profit/Loss
- Profit Percentage
- Allocation
- Top Gainer
- Top Loser
- Portfolio Performance Chart
- Number of Assets

## Business Rules

- Values update automatically after transactions.
- Portfolio Value includes all portfolios.
- Charts respect the selected currency.
- Every market-derived value shows a quote timestamp and delayed or stale state when applicable.
- `All Portfolio` is a virtual aggregate; it cannot receive a cash entry or hold an asset directly.

---

# Portfolio Management

## Description

Allow users to organize investments.

## Features

- Create Portfolio
- Rename Portfolio
- Delete Portfolio
- Reorder Portfolio
- Move Assets
- View Portfolio

## Business Rules

Maximum portfolios

10

Default Portfolio

All Portfolio

Rules

- Created automatically.
- Includes every asset.
- Cannot be renamed.
- Cannot be deleted.
- Cannot be manually edited.

Deleting a portfolio

- Requires confirmation.
- Does not delete investment records.
- User must move assets first.

---

# Investment Management

## Description

Manage investment transactions.

## Buy Transaction

Fields

- Asset
- Market
- Quantity
- Buy Price
- Currency
- Buy Date
- Investment Amount
- Note

## Sell Transaction

Fields

- Sell Price
- Sell Quantity
- Sell Date
- Note

## Supported Actions

- Add
- Edit
- Delete
- Buy
- Sell

## Business Rules

- Users may buy the same asset multiple times.
- Users may partially sell holdings.
- Users cannot sell more than current holdings.
- Transactions update immediately.

Cost Basis

Average Cost

Calculations

- Average Cost
- Realized Profit
- Unrealized Profit
- Total Profit

Delete Transaction

- Confirmation required.

---

# Cash Management

## Description

Manage available cash.

## Features

- Deposit Cash
- Withdraw Cash
- View Cash Balance

## Business Rules

Buying

Cash decreases.

Selling

Cash increases.

Withdrawals

Cannot exceed current balance.

Cash balance is shown on Dashboard.

Deposits and withdrawals are tracking records only; the application never moves money. Cash is held in a selected portfolio and currency account. Every cash action records a ledger transaction and requires balance validation in a trusted operation.

---

# Transaction Corrections

- Financial transaction documents are immutable ledger events.
- A correction creates a reversal and replacement event after validation.
- A correction is rejected when it would make a later holding or cash balance invalid.
- The full calculation policy is defined in `CALCULATION_SPEC.md`.

---

# Market Search

## Description

Search supported investment assets.

## Search By

- Company Name
- Ticker Symbol

## Categories

- Thai Stocks
- US Stocks
- ETF
- Gold
- Currency

## Features

- Autocomplete
- Search History
- Category Filter

## Business Rules

If no result exists

Display

"No data found."

---

# Asset Detail

## Description

Display market information.

## Display

- Company Name
- Ticker
- Current Price
- Price Change
- Percentage Change
- Historical Chart

Supported Timeframes

- 1D
- 5D
- 1W
- 1M
- 6M
- YTD
- 1Y
- 5Y

## Business Rules

If timeframe data does not exist

Display

"This timeframe is unavailable."

---

# Favorite Assets

## Description

Users can bookmark assets.

## Features

- Add Favorite
- Remove Favorite
- Favorite List

## Business Rules

Maximum

20 assets

Favorites can be added from

- Search
- Dashboard
- Asset Detail

---

# Notification Center

## Description

Internal application notifications.

## Supported Notifications

- Account Updates
- Portfolio Updates
- System Messages

## Business Rules

Push Notification

Not included.

Notifications are only visible inside the application.

Architecture must support future

- Price Alerts
- Portfolio Alerts

---

# Settings

## Description

User preferences.

## Features

Theme

- Light
- Dark
- System

Language

- Thai
- English

Currency

- USD
- THB

---

# Admin Panel

## Description

Administrative tools.

## Features

Manage Users

Edit User

Suspend User

Reactivate User

View Statistics

Search Users

## Business Rules

Admin only.

Suspended users cannot login.

Administrative actions require a reason and create an audit record. Admin privileges and account suspension are enforced by trusted backend code, not by hidden UI or a user-editable Firestore field.

Statistics include

- Total Users
- Active Users
- Suspended Users

---

# Loading States

Every page must support

- Loading
- Skeleton Loading

---

# Empty States

Every feature must provide meaningful empty states.

Examples

No Portfolio

No Favorite

No Search Result

No Notification

---

# Error Handling

Every feature must support

- API Error
- Network Error
- Permission Error
- Validation Error

Friendly messages are required.

---

# Responsive Design

Support

Desktop

Tablet

Mobile

Every feature must remain usable on all supported devices.

---

# Accessibility

Every feature should support

- Keyboard Navigation
- Focus States
- Screen Reader Labels
- Sufficient Color Contrast

---

# Future Features

Not included in MVP

- Push Notifications
- Price Alerts
- Portfolio Sharing
- CSV Export
- CSV Import
- Dividend Tracking
- Watchlists
- Mobile Application
- Premium Subscription
- Broker Integration
- Trading
- Crypto Wallet

```

```

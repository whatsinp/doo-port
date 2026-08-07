# PROJECT

Version: 1.0

---

# Project Name

Investment Portfolio Tracker

---

# Project Vision

Build a modern, beautiful, responsive web application that allows users to record and monitor their investments across multiple asset classes.

This application is **not** a trading platform.

It is designed to help users organize, analyze, and track their investment portfolios in a simple and intuitive way.

---

# Project Goals

Primary goals

- Easy to use
- Modern UI
- Responsive design
- Fast performance
- Free infrastructure (MVP)
- Scalable architecture
- Clean codebase
- Maintainable project
- Production-ready

---

# Target Users

Individual investors who want to

- Track Thai stocks
- Track US stocks
- Track Gold
- Track Currency
- Organize multiple portfolios
- Monitor investment performance

---

# Project Scope

## Included

Authentication

- Email Login
- Google Login
- Email Verification
- Password Reset
- Remember Login

Portfolio

- Up to 10 custom portfolios
- One default "All Portfolio"
- Portfolio sorting
- Asset movement between portfolios

Investment

- Buy transactions
- Sell transactions
- Average Cost calculation
- Cash management
- Transaction history

Market

- Asset search
- Company search
- Ticker search
- Categories
- Historical charts
- Current prices

Dashboard

- Portfolio summary
- Today's gain/loss
- Total investment
- Current value
- Cash balance
- Asset allocation
- Portfolio performance chart
- Top gainer
- Top loser

Favorites

- Up to 20 favorite assets

Notifications

- In-app Notification Center

User

- Edit profile
- Profile image
- Language
- Theme
- Display currency

Admin

- User management
- Suspend accounts
- Usage statistics

---

# Out of Scope

The MVP does **not** include

- Stock trading
- Broker integration
- Dividend tracking
- CSV import/export
- Push notifications
- Price alerts
- Social features
- Portfolio sharing
- Premium subscriptions
- AI investment recommendations

---

# Technology Stack

Frontend

- Nuxt 3
- Vue 3
- TypeScript
- PrimeVue
- Tailwind CSS
- Pinia
- VueUse

Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

Charts

- TradingView Lightweight Charts

Internationalization

- vue-i18n

Date Handling

- Day.js

Validation

- Zod

Testing

- Vitest
- Playwright

---

# Supported Platforms

- Desktop
- Tablet
- Mobile

Supported browsers

- Chrome
- Edge
- Firefox
- Safari

---

# Supported Languages

- Thai
- English

---

# Supported Currencies

- USD
- THB

Users can change their preferred display currency at any time.

---

# Supported Asset Types

- Thai Stocks
- US Stocks
- ETFs
- Gold
- Currency

Architecture should allow adding new asset types in the future.

---

# Business Rules

## Portfolio

- Maximum 10 custom portfolios
- One default portfolio
- Default portfolio cannot be deleted
- Default portfolio cannot be renamed
- Default portfolio automatically aggregates all assets

---

## Favorites

Maximum

20 assets

---

## Authentication

Supported

- Email / Password
- Google Login

Email verification required only for Email registration.

---

## Investment Rules

Users may

- Buy multiple times
- Sell partially
- Sell completely
- Edit transactions
- Delete transactions (with confirmation)

Average Cost is the official cost basis.

All financial calculations, rounding, FX conversion, transaction correction, and unsupported corporate-action behavior are defined in `CALCULATION_SPEC.md`.

Cash deposits and withdrawals are internal tracking entries only. They never initiate, instruct, or represent movement of money at a broker or financial institution.

---

## Currency Rules

Transactions store

- Transaction currency
- Exchange rate at transaction time

Historical exchange rates never change.

---

## Dashboard

Display

- Portfolio Value
- Current Value
- Invested Amount
- Cash
- Today's Change
- Total Gain/Loss
- Gain Percentage
- Allocation
- Asset Count
- Performance Chart
- Top Gainer
- Top Loser

---

# User Roles

## User

Can

- Manage portfolios
- Manage investments
- Manage favorites
- Edit profile
- Change settings

Cannot

- Access other users' data

---

## Admin

Can

- Manage users
- Suspend accounts
- View statistics
- Edit user profiles

Cannot

- Trade on behalf of users
- Modify financial records without authorization

---

# Architecture

The application follows

- Clean Architecture
- Repository Pattern
- Service Layer
- Feature-Based Structure

See

- ARCHITECTURE.md
- API.md
- DATABASE.md

---

# Performance Goals

- Fast initial load
- Responsive UI
- Lazy loading
- Efficient Firestore queries
- Optimized bundle size

---

# Security Goals

- Firebase Authentication
- Firestore Security Rules
- Storage Rules
- Input validation
- Role-based authorization

---

# Accessibility Goals

Support

- Keyboard navigation
- Screen readers
- Focus indicators
- Semantic HTML
- Proper color contrast

---

# UI / UX Goals

Design inspiration

- Dime
- Apple
- Linear

Design principles

- Clean
- Minimal
- Modern
- Responsive
- Consistent
- Easy to learn

Support

- Light Theme
- Dark Theme
- System Theme

---

# Development Principles

Always

- TypeScript
- Composition API
- Reusable Components
- Feature-based architecture
- Repository abstraction
- Strong typing
- Responsive-first development

Never

- Place business logic inside components
- Access Firebase directly from UI
- Duplicate code
- Hardcode business rules

---

# Non-Functional Requirements

Performance

- Responsive interactions
- Minimal loading delays
- Efficient rendering

Reliability

- Graceful error handling
- Stable authentication
- Data consistency

Maintainability

- Modular code
- Clear documentation
- Layer separation

Scalability

- Multiple API providers
- Additional asset types
- Premium features
- Mobile application

---

# Future Roadmap

Planned

- Dividend Tracking
- Price Alerts
- Push Notifications
- CSV Import / Export
- Portfolio Sharing
- Advanced Analytics
- Premium Subscription
- Cloud Functions
- Mobile Application

---

# Success Criteria

The MVP is considered successful when users can

- Register and log in
- Manage portfolios
- Record buy/sell transactions
- Track portfolio performance
- Search market assets
- View historical charts
- Manage favorites
- Edit profile
- Use the application comfortably on all supported devices

---

# Documentation

The following documentation must remain synchronized with the implementation

- AGENT_RULES.md
- PROJECT.md
- FEATURES.md
- API.md
- ARCHITECTURE.md
- DATABASE.md
- DECISIONS.md
- FIREBASE.md
- FOLDER_STRUCTURE.md
- SECURITY.md
- TECH_STACK.md
- UI_UX.md
- DEVELOPMENT_WORKFLOW.md
- DEPLOYMENT.md
- CHANGELOG.md
- CODING_STANDARDS.md
- KNOWN_ISSUES.md
- ROADMAP.md
- CALCULATION_SPEC.md

---

# Definition of MVP

The project reaches MVP status when

- Authentication is complete
- Portfolio management is complete
- Investment tracking is complete
- Dashboard is functional
- Market search is functional
- Favorites are functional
- User profile is functional
- Admin panel is functional
- Responsive design is verified
- Dark mode is supported
- Documentation is complete
- Production deployment is successful

---

# MVP Infrastructure Boundary

The MVP is a Nuxt SPA hosted on Firebase Hosting. Direct Firebase client access is permitted only for data that can be safely authorized by rules.

Trusted operations run behind Firebase Hosting rewrites to Cloud Functions. They include market-data proxying, API-key use, admin role management, account suspension, protected aggregate updates, and financial transaction processing.

The MVP targets zero cost within published free quotas. It does not guarantee zero cost: Cloud Functions requires a Blaze billing account and usage above any free quota is billable.

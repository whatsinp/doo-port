# CHANGELOG

All notable changes to this project should be documented in this file.

This project follows the principles of **Keep a Changelog** and **Semantic Versioning (SemVer)**.

---

# Versioning

Format

```text
MAJOR.MINOR.PATCH
```

Example

```text
1.0.0
```

Meaning

- MAJOR → Breaking changes
- MINOR → New features
- PATCH → Bug fixes and minor improvements

---

# Changelog Rules

Every completed task should update this document.

Entries should include

- Version
- Date
- Type
- Description

Possible change types

- Added
- Changed
- Improved
- Fixed
- Removed
- Deprecated
- Security
- Refactored
- Performance
- Documentation

---

# Unreleased

## Added

-

## Changed

- Defined Cloud Functions as the required trusted-operation boundary for the MVP.
- Defined `All Portfolio` as a virtual aggregate rather than a persisted portfolio owner.
- Reconciled internal cash tracking with the no-trading product boundary.
- Replaced mutable financial edits with reversal-based transaction corrections.
- Added required security, cost, calculation, and emulator-test gates.

## Fixed

- Corrected the conflict between cash tracking features and ADR-020.
- Corrected the testing roadmap to include automated MVP test coverage.

## Documentation

- Added CALCULATION_SPEC.md as the authoritative financial calculation specification.

---

# 1.0.0 (MVP)

Release Date

TBD

## Added

### Authentication

- Email Registration
- Email Login
- Google Login
- Email Verification
- Password Reset
- Remember Login

### Dashboard

- Portfolio Summary
- Today's Change
- Portfolio Value
- Current Value
- Invested Amount
- Cash Balance
- Allocation
- Portfolio Performance Chart
- Top Gainer
- Top Loser

### Portfolio

- Create Portfolio
- Rename Portfolio
- Delete Portfolio
- Reorder Portfolio
- Default All Portfolio
- Move Assets Between Portfolios

### Investment

- Buy Transaction
- Sell Transaction
- Average Cost Calculation
- Realized Profit
- Unrealized Profit
- Total Profit

### Market

- Search Asset
- Asset Detail
- Historical Chart
- Current Price
- Category Search
- Autocomplete

### Favorite

- Add Favorite
- Remove Favorite
- Favorite List

### User Profile

- Edit Profile
- Upload Profile Image
- Theme
- Language
- Currency

### Notification Center

- In-App Notifications

### Admin

- User Management
- Suspend User
- Reactivate User
- Usage Statistics

---

## Changed

Initial production architecture established.

---

## Security

- Firebase Authentication
- Firestore Security Rules
- Input Validation
- Authorization Layer

---

## Performance

- Lazy Loading
- Route Splitting
- Dynamic Imports
- Optimized Firestore Queries

---

## Documentation

Created

- PROJECT.md
- AGENT_RULES.md
- ARCHITECTURE.md
- API.md
- DATABASE.md
- FEATURES.md
- UI_UX.md
- FIREBASE.md
- SECURITY.md
- TECH_STACK.md
- CODING_STANDARDS.md
- DEVELOPMENT_WORKFLOW.md
- ROADMAP.md
- DEPLOYMENT.md

---

# Future Versions

## 1.1.0

Planned

- Price Alerts
- Better Dashboard Analytics
- Additional Market Providers
- Portfolio Performance Improvements

---

## 1.2.0

Planned

- CSV Export
- CSV Import
- Advanced Search
- Additional Filters

---

## 1.3.0

Planned

- Dividend Tracking
- Asset Allocation Improvements
- More Portfolio Statistics

---

## 2.0.0

Planned

- Premium Features
- Push Notifications
- Portfolio Sharing
- Watchlists
- Mobile Optimization
- Advanced Analytics

---

# Changelog Entry Template

```markdown
# x.y.z (YYYY-MM-DD)

## Added

-

## Changed

-

## Improved

-

## Fixed

-

## Removed

-

## Security

-

## Performance

-

## Documentation

-
```

---

# Commit Convention

Every changelog update should correspond to one or more Git commits following Conventional Commits.

Examples

```text
feat(auth): add Google login

feat(portfolio): implement asset transfer

fix(dashboard): correct profit calculation

refactor(api): separate repository layer

docs(project): update architecture documentation

perf(market): optimize search requests

style(ui): improve responsive layout

test(portfolio): add investment calculation tests
```

---

# Documentation Policy

Every significant change must update

- CHANGELOG.md
- DECISIONS.md (if architecture changes)
- PROJECT.md (if project scope changes)
- FEATURES.md (if functionality changes)
- API.md (if API behavior changes)
- DATABASE.md (if schema changes)

Documentation must always remain synchronized with the implementation.

---

# Release Checklist

Before creating a new release

- All tests pass
- Documentation updated
- CHANGELOG updated
- Version number updated
- Breaking changes documented
- Database migrations completed
- Security review completed
- Performance review completed
- Production build successful

Only then may a new version be released.

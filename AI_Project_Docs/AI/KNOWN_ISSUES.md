# KNOWN_ISSUES

Version: 1.0

---

# Overview

This document tracks known issues, limitations, technical debt, and accepted constraints of the Investment Portfolio Tracker.

Not every issue requires an immediate fix.

Some issues are intentionally postponed for future releases.

---

# Status

Possible statuses

- Open
- Investigating
- Planned
- In Progress
- Fixed
- Won't Fix

Priority

- Critical
- High
- Medium
- Low

---

# Current Known Issues

## ISSUE-000

Status

Open

Priority

Critical

Category

Architecture and Security

### Description

The project requires Cloud Functions for trusted financial writes, administration, and secret market API proxying. This requires a Blaze billing account and an enforceable cost-monitoring plan.

### Planned Fix

Implement trusted endpoints, Firebase Emulator rule tests, quota alerts, and a documented monthly cost envelope before public deployment.

---

## ISSUE-001

Status

Open

Priority

Medium

Category

Market Data

### Description

Free market APIs may not provide true real-time stock prices.

Depending on the provider, prices may be delayed by several seconds or up to 15–20 minutes.

### Impact

Portfolio value may not exactly match broker applications.

### Workaround

Display the latest available price and indicate the data timestamp whenever available.

### Planned Fix

Support premium market data providers in future versions.

---

## ISSUE-002

Status

Open

Priority

Low

Category

Historical Data

### Description

Some stocks or assets may not have complete historical price data.

### Impact

Charts may be unavailable for selected time ranges.

### Workaround

Display

```text
Timeframe unavailable
```

instead of an empty chart.

---

## ISSUE-003

Status

Open

Priority

Low

Category

Exchange Rate

### Description

Historical exchange rates may not always be available from free APIs.

### Impact

Currency conversion may differ slightly from the broker's actual exchange rate.

### Workaround

Allow users to manually edit transaction exchange rates if needed.

---

## ISSUE-004

Status

Open

Priority

Medium

Category

Firebase Free Tier

### Description

Heavy usage may exceed Firebase free-tier limits.

### Impact

Application performance or availability may be affected.

### Workaround

Monitor Firebase usage regularly.

---

## ISSUE-005

Status

Open

Priority

Medium

Category

Profile Images

### Description

Large profile images increase storage usage and loading time.

### Impact

Slower page loads.

### Workaround

Automatically resize or compress uploaded images before upload.

---

## ISSUE-006

Status

Open

Priority

Low

Category

Offline Support

### Description

Offline persistence is not enabled in the MVP.

### Impact

The application requires an internet connection.

### Planned Fix

Enable Firestore Offline Persistence in a future release.

---

## ISSUE-007

Status

Open

Priority

Low

Category

Notifications

### Description

The MVP only supports an in-app Notification Center.

Push notifications are not available.

### Planned Fix

Integrate Firebase Cloud Messaging in a future version.

---

## ISSUE-008

Status

Open

Priority

Low

Category

Authentication

### Description

Social login currently supports only Google Login.

### Planned Fix

Add Apple, GitHub, and Microsoft Login if required.

---

## ISSUE-009

Status

Open

Priority

Medium

Category

Performance

### Description

Large portfolios with many transactions may require additional optimization.

### Planned Fix

Implement pagination, query optimization, and background calculations.

---

## ISSUE-010

Status

Open

Priority

Low

Category

Charts

### Description

Different market data providers may return different historical values.

### Impact

Minor visual differences may appear in charts.

---

# Technical Debt

## TD-001

Status

Open

Priority

Medium

Description

Current architecture is optimized for Firebase.

Future backend migration may require repository implementation updates.

---

## TD-002

Status

Open

Priority

Low

Description

Admin Dashboard analytics are intentionally simplified for MVP.

---

## TD-003

Status

Open

Priority

Medium

Description

Market API abstraction supports multiple providers, but only one provider will be implemented initially.

---

## TD-004

Status

Open

Priority

Low

Description

Internationalization is prepared, but not every UI string may be translated during early development.

---

## Accepted Limitations

The MVP intentionally does **not** support

- Stock trading
- Broker integration
- Dividend tracking
- Portfolio sharing
- CSV import/export
- Push notifications
- Premium analytics
- Watchlists beyond Favorites
- Multiple user roles beyond User and Admin
- Multi-factor authentication (MFA)

These features are planned for future versions.

---

# Risks

## RISK-001

Risk

Market API provider changes pricing or rate limits.

Mitigation

Repository abstraction allows switching providers.

---

## RISK-002

Risk

Firebase pricing changes.

Mitigation

Monitor usage and prepare migration strategy.

---

## RISK-003

Risk

External APIs become unavailable.

Mitigation

Support multiple providers and graceful fallback behavior.

---

## RISK-004

Risk

Large Firestore read volume increases operational costs.

Mitigation

Optimize queries, caching, and document structure.

---

## Future Improvements

Planned improvements

- Real push notifications
- Dividend tracking
- Better portfolio analytics
- Premium market data
- Advanced search filters
- Import / Export
- Portfolio backup
- Scheduled cloud calculations
- Better chart indicators
- Multi-device synchronization improvements

---

# Reporting New Issues

Every new issue should include

- ID
- Date
- Reporter
- Status
- Priority
- Category
- Description
- Steps to Reproduce
- Expected Behavior
- Actual Behavior
- Possible Cause
- Workaround
- Planned Resolution

---

# Issue Template

```markdown
## ISSUE-XXX

Status

Open

Priority

Medium

Category

Description

Steps to Reproduce

Expected Result

Actual Result

Workaround

Planned Fix
```

---

# Maintenance Policy

When an issue is fixed

- Update this document
- Update CHANGELOG.md
- Reference the related Git commit or Pull Request
- Add regression tests if applicable

Known issues should always reflect the current state of the project.

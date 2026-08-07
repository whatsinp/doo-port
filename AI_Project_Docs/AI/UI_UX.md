# UI_UX

Version: 1.0

---

# Overview

This document defines the UI/UX principles, design system, interaction patterns, and visual guidelines for the Investment Portfolio Tracker.

The design philosophy is inspired by

- Dime
- Apple
- Linear
- Stripe Dashboard

The goal is to create a modern, premium, minimal, and intuitive user experience.

---

# Design Principles

Every screen should be

- Simple
- Clean
- Consistent
- Responsive
- Fast
- Accessible

Avoid unnecessary visual complexity.

Users should be able to understand the interface without reading documentation.

---

# Design Language

Style

- Modern
- Minimal
- Professional
- Premium
- Financial Dashboard

Keywords

- Clean
- Spacious
- Rounded
- Soft shadows
- Smooth animations
- Clear hierarchy

---

# Theme

Support

- Light
- Dark
- System

Users can change the theme from Settings.

Theme changes should apply instantly.

---

# Color Palette

Primary

```text
Emerald / Green
```

Used for

- Profit
- Positive changes
- Primary actions

Secondary

```text
Blue
```

Used for

- Information
- Links
- Focus states

Danger

```text
Red
```

Used for

- Loss
- Delete
- Errors

Warning

```text
Orange
```

Used for

- Pending
- Warnings

Neutral

Gray scale

Used for

- Backgrounds
- Borders
- Text hierarchy

---

# Typography

Font

Recommended

```text
Inter
```

Fallback

```text
system-ui
```

Hierarchy

Heading

Bold

Large

Subheading

SemiBold

Body

Regular

Caption

Small

---

# Spacing

Use an 8px spacing system.

Example

```text
4

8

12

16

24

32

40

48

64
```

Avoid arbitrary spacing.

---

# Border Radius

Recommended

```text
12px
```

Cards

```text
16px
```

Dialogs

```text
20px
```

Buttons

```text
12px
```

---

# Shadows

Use soft shadows only.

Avoid heavy shadows.

Cards should appear elevated without feeling floating.

---

# Icons

Primary

PrimeIcons

Optional

Lucide Icons

Icons should always accompany important actions.

---

# Layout

Maximum content width

```text
1440px
```

Dashboard

Centered

Responsive

---

# Breakpoints

Mobile

```text
<640px
```

Tablet

```text
640px - 1023px
```

Desktop

```text
>=1024px
```

Large Desktop

```text
>=1440px
```

---

# Navigation

Desktop

Left Sidebar

Top Header

Mobile

Bottom Navigation

Drawer Menu

Tablet

Adaptive Sidebar

---

# Sidebar

Contains

- Dashboard
- Portfolio
- Market
- Favorites
- Notifications
- Profile
- Settings

Admin users additionally see

- Admin

---

# Header

Contains

- Search
- Notifications
- Theme Switch
- Language Switch
- Profile Menu

---

# Dashboard Layout

Sections

```text
Header

↓

Summary Cards

↓

Portfolio Chart

↓

Allocation

↓

Top Gainer

↓

Top Loser

↓

Portfolio List
```

---

# Dashboard Cards

Cards

- Portfolio Value
- Today's Change
- Total Investment
- Profit / Loss
- Cash
- Asset Count

Cards should use consistent height.

---

# Portfolio Screen

Layout

Portfolio Selector

↓

Portfolio Summary

↓

Asset List

↓

Recent Transactions

↓

Performance Chart

---

# Asset Card

Display

- Logo
- Company Name
- Ticker
- Current Price
- Today's Change
- Allocation
- Quantity
- Average Cost
- Profit / Loss

Actions

- View
- Edit
- Buy
- Sell

---

# Asset Detail Page

Sections

- Price Chart
- Current Price
- Market Information
- Holdings
- Transactions
- Notes

---

# Chart

Primary

TradingView Lightweight Charts

Support

- 1D
- 5D
- 1M
- 6M
- YTD
- 1Y
- 5Y

Unavailable periods

Display

```text
Historical data unavailable for the selected timeframe.
```

---

# Search

Support

- Company Name
- Ticker
- Categories

Results should appear instantly as the user types.

---

# Empty States

Every page should have an empty state.

Example

Portfolio

```text
No investments yet.

Start by adding your first investment.
```

Favorites

```text
No favorite assets.
```

Notifications

```text
You're all caught up.
```

---

# Loading States

Never display blank screens.

Use

PrimeVue Skeleton

For

- Cards
- Tables
- Charts
- Lists

---

# Error States

Display

- Friendly message
- Retry button

Avoid technical error messages.

---

# Dialogs

Use dialogs for

- Delete confirmation
- Portfolio creation
- Buy transaction
- Sell transaction
- Profile editing

Avoid full-page forms when unnecessary.

---

# Forms

Every form should include

- Labels
- Placeholder text
- Validation
- Helpful error messages

Buttons

Primary

Save

Secondary

Cancel

Danger

Delete

---

# Tables

Use PrimeVue DataTable.

Features

- Sorting
- Filtering
- Pagination
- Responsive layout

---

# Buttons

Primary

Filled

Secondary

Outlined

Danger

Red

Text

Low-priority actions

Avoid excessive button styles.

---

# Animations

Use subtle animations.

Recommended

- Fade
- Slide
- Scale

Duration

```text
150ms - 250ms
```

Avoid long animations.

---

# Responsive Design

Desktop

Multi-column layout

Tablet

Reduced spacing

Mobile

Single-column layout

No horizontal scrolling.

---

# Accessibility

Support

- Keyboard navigation
- Focus indicators
- Screen readers
- Semantic HTML
- Color contrast

Every interactive element must have a visible focus state.

---

# Dark Mode

Support all components.

Charts

- Dark background
- Readable grid lines
- Proper contrast

Never use fixed colors.

---

# Notifications

Notification Center

Grouped by

- Today
- Yesterday
- Earlier

Unread notifications should be visually distinguished.

---

# Profile

Display

- Avatar
- Display Name
- Email
- Preferred Currency
- Language
- Theme

Actions

- Edit Profile
- Change Password
- Logout

---

# Settings

Sections

- Appearance
- Language
- Currency
- Security
- About

Settings should update immediately whenever possible.

---

# Admin Panel

Layout

Dashboard

↓

User Table

↓

Statistics

↓

Actions

Admin UI should clearly distinguish administrative actions from normal user features.

---

# Microinteractions

Use subtle feedback for

- Button clicks
- Saving data
- Successful actions
- Errors
- Hover states
- Drag and drop

Avoid excessive motion.

---

# Feedback Messages

Success

Green Toast

Error

Red Toast

Information

Blue Toast

Warning

Orange Toast

Use PrimeVue Toast.

---

# Confirmation Dialogs

Require confirmation for

- Delete transaction
- Delete portfolio
- Suspend user
- Remove favorite

Do not require confirmation for reversible actions.

---

# Design Consistency

Every page should follow

- Same spacing
- Same typography
- Same card styles
- Same button hierarchy
- Same icon usage
- Same interaction patterns

---

# Future UI Improvements

Planned

- Advanced dashboard customization
- Drag-and-drop widgets
- Better chart interactions
- Motion enhancements
- Custom themes
- Compact mode

---

# UI Quality Checklist

Before any feature is complete

- Responsive on all supported devices
- Supports light and dark mode
- Keyboard accessible
- Uses loading states
- Uses empty states
- Uses error states
- Uses consistent spacing
- Uses PrimeVue components when appropriate
- Uses Tailwind CSS utilities
- Matches the overall design language

Every UI implementation should feel polished, intuitive, and production-ready.

---

# Required Financial Data States

Every market-derived component must show its `asOf` timestamp and one of: live, delayed, stale, unavailable, or market closed. A stale value must never be presented as current.

Transaction confirmation displays quantity, price, fees, taxes, currency, resulting cash change, and irreversible-correction notice. Transaction correction and asset transfer require a consequence preview before confirmation.

Mobile DataTable views use a card or detail-drawer pattern; horizontal scrolling is not the default responsive strategy.

---

# Accessibility Acceptance Criteria

- Meet WCAG 2.2 AA contrast requirements.
- Support 200% browser zoom and reduced-motion preferences.
- Provide keyboard-operable dialogs, autocomplete, menus, tables, chart controls, and reorder controls.
- Trap and restore focus in dialogs; announce async errors and successful saves through an accessible live region.
- Do not use gain/loss color as the only indicator.

# Investment Portfolio Tracker

A modern, responsive, and production-ready web application for tracking investment portfolios across multiple asset classes.

> **This project is an investment tracking platform, NOT a stock trading platform.**

---

# Features

- 📊 Portfolio Dashboard
- 💰 Investment Tracking
- 📈 Real-time Market Data (Free API)
- ⭐ Favorite Assets
- 🏦 Thai & US Stocks
- 🪙 Gold & Currency Tracking
- 💵 Multi-Currency Support (USD / THB)
- 📉 Historical Price Charts
- 🔐 Firebase Authentication
- 👤 User Profiles
- 🌙 Light / Dark Mode
- 🌍 Thai / English Language Support
- 🛠 Admin Dashboard
- 📱 Fully Responsive Design

---

# Tech Stack

## Frontend

- Nuxt 3
- Vue 3
- TypeScript
- PrimeVue
- Tailwind CSS
- Pinia
- VueUse

## Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

## Charts

- TradingView Lightweight Charts

## Validation

- Zod

## Internationalization

- vue-i18n

## Testing

- Vitest
- Playwright

---

# Project Structure

```text
.
├── assets/
├── components/
├── composables/
├── docs/
├── firebase/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── public/
├── repositories/
├── server/
├── services/
├── stores/
├── tests/
├── types/
├── utils/
│
├── app.vue
├── nuxt.config.ts
├── package.json
└── README.md
```

Detailed structure

See

```text
docs/FOLDER_STRUCTURE.md
```

---

# Documentation

All project documentation is located in

```text
docs/
```

| File                    | Description             |
| ----------------------- | ----------------------- |
| AGENT_RULES.md          | AI Agent Rules          |
| PROJECT.md              | Project Overview        |
| FEATURES.md             | Functional Requirements |
| API.md                  | API Design              |
| ARCHITECTURE.md         | System Architecture     |
| DATABASE.md             | Firestore Schema        |
| FIREBASE.md             | Firebase Configuration  |
| TECH_STACK.md           | Technology Stack        |
| UI_UX.md                | UI / UX Guidelines      |
| SECURITY.md             | Security Policy         |
| DEPLOYMENT.md           | Deployment Guide        |
| DEVELOPMENT_WORKFLOW.md | Development Process     |
| CODING_STANDARDS.md     | Coding Standards        |
| DECISIONS.md            | Architecture Decisions  |
| CHANGELOG.md            | Version History         |
| ROADMAP.md              | Future Roadmap          |
| KNOWN_ISSUES.md         | Known Issues            |
| PROMPT.md               | AI Agent Prompt         |

---

# Getting Started

## Prerequisites

Install

- Node.js 22+
- npm
- Firebase CLI

---

## Clone Repository

```bash
git clone <repository-url>

cd investment-portfolio-tracker
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create

```text
.env
```

Example

```env
NUXT_PUBLIC_FIREBASE_API_KEY=

NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NUXT_PUBLIC_FIREBASE_PROJECT_ID=

NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NUXT_PUBLIC_FIREBASE_APP_ID=
```

Never commit

```text
.env
```

---

# Run Development Server

```bash
npm run dev
```

Open

```text
http://localhost:3000
```

---

# Build

```bash
npm run build
```

---

# Generate Static Site

```bash
npm run generate
```

---

# Preview Production Build

```bash
npm run preview
```

---

# Deploy

Login

```bash
firebase login
```

Initialize

```bash
firebase init
```

Deploy

```bash
firebase deploy
```

Hosting only

```bash
firebase deploy --only hosting
```

---

# Development Workflow

Read before contributing

```text
docs/DEVELOPMENT_WORKFLOW.md
```

---

# Coding Standards

Follow

```text
docs/CODING_STANDARDS.md
```

Never bypass project architecture.

---

# Architecture

The project follows Clean Architecture.

```text
Page

↓

Component

↓

Composable

↓

Service

↓

Repository

↓

Firebase / External API
```

Business logic belongs in Services.

Data access belongs in Repositories.

---

# Main Features

## Authentication

- Email Login
- Google Login
- Email Verification
- Password Reset

---

## Dashboard

- Portfolio Summary
- Today's Gain/Loss
- Asset Allocation
- Performance Chart
- Cash Balance
- Top Gainer
- Top Loser

---

## Portfolio

- Create Portfolio
- Delete Portfolio
- Rename Portfolio
- Reorder Portfolio
- Move Assets

---

## Investments

- Buy
- Sell
- Average Cost Calculation
- Transaction History
- Notes

---

## Market

- Search
- Categories
- Historical Charts
- Asset Details

---

## Favorites

Maximum

20 assets

---

## Notifications

- Notification Center

---

## User

- Edit Profile
- Upload Avatar
- Theme
- Language
- Currency

---

## Admin

- User Management
- Suspend Accounts
- Usage Statistics

---

# Supported Assets

- Thai Stocks
- US Stocks
- ETFs
- Gold
- Currency

---

# Supported Languages

- English
- Thai

---

# Supported Currencies

- USD
- THB

---

# Browser Support

Latest versions

- Chrome
- Edge
- Firefox
- Safari

---

# Responsive Support

- Desktop
- Tablet
- Mobile

---

# Security

Security guidelines

```text
docs/SECURITY.md
```

---

# Testing

Unit

```bash
npm run test
```

Coverage

```bash
npm run test:coverage
```

E2E

```bash
npm run test:e2e
```

---

# Recommended VS Code Extensions

- Vue Official
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

---

# Git Branch Strategy

```text
main

develop

feature/*

fix/*

release/*

hotfix/*
```

---

# Commit Convention

Examples

```text
feat(auth): add Google login

feat(portfolio): add asset transfer

fix(market): resolve chart loading

docs(readme): update installation guide
```

---

# Future Roadmap

Planned

- Dividend Tracking
- Push Notifications
- Price Alerts
- Import / Export
- Advanced Analytics
- AI Insights
- Mobile Applications

See

```text
docs/ROADMAP.md
```

---

# Contributing

Before opening a Pull Request

- Read all documentation
- Follow coding standards
- Run lint
- Run type check
- Run tests
- Update documentation if necessary

---

# License

Private Project

All rights reserved.

---

# Acknowledgements

Design Inspiration

- Dime
- Apple
- Linear

Technology

- Nuxt
- Vue
- PrimeVue
- Tailwind CSS
- Firebase

---

# Project Status

Current Version

```text
v1.0.0 (MVP)
```

Status

```text
In Development
```

---

# Philosophy

Build software that is

- Simple
- Beautiful
- Fast
- Scalable
- Secure
- Maintainable

Every line of code should improve the project without sacrificing long-term quality.

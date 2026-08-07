# TECH_STACK

Version: 1.0

---

# Overview

This document defines the official technology stack for the Investment Portfolio Tracker.

All development must follow the technologies listed here unless a documented architectural decision replaces them.

The goal is to keep the stack modern, maintainable, scalable, and compatible with the free-tier infrastructure used for the MVP.

---

# Architecture

Application Type

- Single Page Application (SPA)

Deployment uses static Nuxt output on Firebase Hosting plus Cloud Functions for trusted dynamic endpoints. Nuxt Server Routes are not available in the static client bundle.

Architecture

- Clean Architecture
- Repository Pattern
- Service Layer
- Feature-based Structure
- Composition API

Language

- TypeScript

---

# Frontend

Framework

- Nuxt 3

Reason

- Vue ecosystem
- Excellent developer experience
- File-based routing
- Auto imports
- SSR/SPA support
- Easy Firebase integration
- Strong TypeScript support

---

# UI Framework

PrimeVue

Purpose

- Professional UI components
- Accessibility support
- Rich component ecosystem

Used Components

- DataTable
- Dialog
- Drawer
- Sidebar
- Menu
- TieredMenu
- Avatar
- Badge
- Button
- Card
- Calendar
- Checkbox
- Chips
- ConfirmDialog
- ContextMenu
- Dropdown
- FloatLabel
- IconField
- InputNumber
- InputSwitch
- InputText
- MenuBar
- MultiSelect
- OverlayPanel
- Password
- ProgressBar
- SelectButton
- Skeleton
- SplitButton
- TabView
- Tag
- Toast
- Tooltip

---

# CSS Framework

Tailwind CSS

Purpose

- Utility-first styling
- Responsive development
- Rapid UI implementation

Rules

Always prefer Tailwind over custom CSS.

Avoid large CSS files.

---

# Icons

Preferred

PrimeIcons

Optional

Lucide Icons

---

# Charts

TradingView Lightweight Charts

Purpose

- Stock charts
- Portfolio performance
- Historical prices

Future

- Technical Indicators
- Comparison Charts

---

# State Management

Pinia

Stores

- auth
- user
- portfolio
- market
- notification
- settings

Business logic must not exist inside stores.

---

# Routing

Nuxt File-based Routing

Middleware

- auth
- guest
- admin

---

# Forms

Vue Forms

Validation

Zod

Rules

- Client validation
- Strong typing
- Reusable schemas

---

# Date Library

Day.js

Purpose

- Formatting
- Time zones
- Relative dates

---

# Utility Library

VueUse

Purpose

- Browser APIs
- Utilities
- Reusable composables

---

# HTTP Client

Native Fetch API

For future server APIs

Use

```typescript
$fetch()
```

Avoid Axios unless required.

---

# Backend

Platform

Firebase

Services

- Authentication
- Cloud Firestore
- Storage
- Hosting

Future

- Cloud Functions
- Cloud Messaging
- App Check

Cloud Functions are required in MVP for secret market API access, trusted financial writes, and administration.

---

# Database

Cloud Firestore

Reason

- Realtime support
- Free tier
- Easy integration
- Scalable

---

# Authentication

Firebase Authentication

Providers

- Email / Password
- Google Login

Future

- Apple
- Microsoft
- GitHub

---

# File Storage

Firebase Storage

Purpose

- Profile images

Future

- Attachments
- Export files

---

# Hosting

Firebase Hosting

Features

- HTTPS
- CDN
- Compression
- Free tier

---

# External APIs

Market Data

Provider

Chosen during implementation.

Requirements

- Free tier
- Historical prices
- Search
- Categories

Repository abstraction must allow provider replacement.

---

# Internationalization

vue-i18n

Languages

- English
- Thai

Default

English (code)

User Interface

User selectable.

---

# Theme

Support

- Light
- Dark
- System

Theme preference stored in user settings.

---

# Testing

Unit Testing

Vitest

Component Testing

Vue Test Utils

End-to-End Testing

Playwright

Future

Performance Testing

Accessibility Testing

---

# Linting

ESLint

Rules

- TypeScript
- Vue
- Import order
- Best practices

---

# Formatting

Prettier

Formatting must be automatic.

---

# Type Checking

TypeScript

Strict Mode

Enabled

Never disable strict mode.

---

# Package Manager

Preferred

npm

Alternative

pnpm

Use a single package manager throughout the project.

---

# Version Control

Git

Repository

GitHub

Branch Strategy

- main
- develop
- feature/*
- fix/*
- release/*
- hotfix/*

---

# CI/CD

Current

Manual Deployment

Future

GitHub Actions

Pipeline

- Install
- Type Check
- Lint
- Test
- Build
- Deploy

---

# Development Tools

Recommended

- Visual Studio Code
- Vue DevTools
- Firebase Emulator
- GitHub Desktop (optional)

Recommended Extensions

- Vue Official
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- GitLens

---

# Environment Variables

Use

```text
.env
```

Example

```env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_APP_ID=
MARKET_API_KEY=
```

Never commit

```text
.env
```

`MARKET_API_KEY` is server-only and must never be converted into `NUXT_PUBLIC_*` configuration.

Commit

```text
.env.example
```

---

# Project Structure

Architecture

```text
pages

↓

components

↓

composables

↓

services

↓

repositories

↓

firebase
```

Business logic

Service Layer

Data access

Repository Layer

---

# Code Standards

Use

- TypeScript
- Composition API
- `<script setup>`
- Auto Imports
- Strong typing

Avoid

- any
- Global mutable state
- Duplicate code

---

# Performance Strategy

Use

- Lazy Loading
- Dynamic Imports
- Route Splitting
- Image Optimization
- Firestore Query Optimization

Avoid

- Large bundle sizes
- Deep component trees
- Unnecessary reactivity

---

# Accessibility

Follow WCAG recommendations.

Support

- Keyboard navigation
- Focus management
- Semantic HTML
- Color contrast
- Screen readers

---

# Browser Support

Latest versions

- Chrome
- Edge
- Firefox
- Safari

Responsive

- Desktop
- Tablet
- Mobile

---

# Deployment

Production

Firebase Hosting

Development

Local Nuxt Development Server

Commands

```bash
npm install

npm run dev

npm run lint

npm run typecheck

npm run build

npm run generate

firebase deploy
```

---

# Future Technology Considerations

Possible additions

- Cloud Functions
- Firebase App Check
- Redis Cache
- Algolia Search
- Sentry
- Storybook
- Cypress
- Docker
- Turborepo

These technologies should only be introduced after evaluating their impact on complexity and maintenance.

---

# Technology Principles

When introducing any new technology, it must satisfy the following requirements

- Production ready
- Actively maintained
- Strong community support
- TypeScript compatible
- Compatible with Nuxt 3
- Compatible with Firebase
- Scalable
- Secure
- Well documented

No technology should be added solely because it is new or popular.

Every addition must provide measurable value to the project.

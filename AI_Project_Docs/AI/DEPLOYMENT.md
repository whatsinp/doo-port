# DEPLOYMENT

Version: 1.0

---

# Overview

This document describes the deployment strategy for the Investment Portfolio Tracker.

The MVP is deployed entirely on **Firebase** using the free tier whenever possible.

Deployment must be automated, repeatable, and production-ready.

Static Hosting serves the Nuxt SPA. Firebase Hosting rewrites route trusted dynamic requests to Cloud Functions.

---

# Deployment Environment

## Production

Hosting

- Firebase Hosting
- Cloud Functions

Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage

Frontend

- Nuxt 3

---

## Development

Frontend

```text
http://localhost:3000
```

Firebase

- Emulator (optional)
- Development Project

---

# Technology Stack

Frontend

- Nuxt 3
- Vue 3
- TypeScript
- PrimeVue
- Tailwind CSS

Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

---

# Build Process

```text
Install Dependencies

↓

Type Check

↓

Lint

↓

Build

↓

Generate

↓

Deploy
```

---

# Build Command

```bash
npm install

npm run lint

npm run typecheck

npm run build
```

For Static Deployment

```bash
npm run generate
```

---

# Firebase Project

Recommended environments

```text
portfolio-dev

portfolio-staging

portfolio-production
```

MVP may start with

```text
portfolio-dev
```

---

# Firebase Services

Enable

- Authentication
- Firestore
- Storage
- Hosting

Disable unused services.

---

# Authentication

Providers

- Email / Password
- Google Login

Enable

- Email Verification
- Password Reset

---

# Firestore

Mode

Production

Location

Choose the closest region to the target users.

Recommended

```text
asia-southeast1
```

---

# Storage

Used for

- Profile Images

Rules

Authenticated users may upload only their own files.

---

# Hosting

Deploy

Static Nuxt application.

Enable

- HTTPS
- Compression
- CDN
- SPA Rewrites

---

# Environment Variables

Store all secrets inside

```text
.env
```

Never commit

```text
.env
```

Commit

```text
.env.example
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

---

# Git Branch Strategy

Main Branch

```text
main
```

Development Branch

```text
develop
```

Feature Branch

```text
feature/<feature-name>
```

Bug Fix

```text
fix/<bug-name>
```

Release

```text
release/<version>
```

Hotfix

```text
hotfix/<version>
```

---

# Deployment Workflow

```text
Developer

↓

Develop Feature

↓

Code Review

↓

Lint

↓

Type Check

↓

Build

↓

Deploy Firebase
```

---

# GitHub Repository

Recommended structure

```text
main

develop

feature/*
```

Protect

```text
main
```

Require

- Pull Request
- Code Review

---

# Continuous Integration

Every Pull Request should run

- Install Dependencies
- Type Check
- Lint
- Build

Merge only if all checks pass.

Required checks also include Firebase Emulator security-rule tests, calculation regression tests, and Playwright critical-path tests.

---

# Continuous Deployment

Production deployment should only happen from

```text
main
```

Development deployment may happen from

```text
develop
```

---

# Firebase CLI

Install

```bash
npm install -g firebase-tools
```

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

Deploy Hosting Only

```bash
firebase deploy --only hosting
```

Deploy Firestore Rules

```bash
firebase deploy --only firestore
```

Deploy Storage Rules

```bash
firebase deploy --only storage
```

---

# Firestore Rules

Always deploy together with application updates.

Never leave Firestore in test mode.

---

# Storage Rules

Restrict uploads

Users may only access

- Their own profile images

---

# Security Checklist

Before deployment

- Firestore Rules configured
- Storage Rules configured
- Authentication enabled
- HTTPS enabled
- Environment variables configured
- API keys verified
- No secrets committed
- Production mode enabled

---

# Performance Checklist

Before deployment

- Images optimized
- Lazy Loading enabled
- Dynamic Imports enabled
- Bundle size reviewed
- Firestore queries optimized

---

# Browser Support

Latest versions of

- Chrome
- Edge
- Firefox
- Safari

Responsive support

- Desktop
- Tablet
- Mobile

---

# Monitoring

Monitor

- Firebase Authentication
- Firestore Usage
- Storage Usage
- Hosting Bandwidth
- Hosting Errors
- Cloud Function invocations and errors
- Market API quota, cache hit rate, and stale quote rate
- Firestore read and write budget

---

# Backup Strategy

Firestore

Export regularly.

Export, restore, and backup features may require billing. The release owner must validate cost and run a restore drill before relying on a backup policy.

Storage

Keep original uploaded files.

Git

GitHub is the primary source of version history.

---

# Rollback Strategy

If deployment fails

```text
Stop Deployment

↓

Rollback Git Commit

↓

Redeploy Previous Stable Version

↓

Verify Database Integrity
```

---

# Versioning

Follow Semantic Versioning

```text
MAJOR.MINOR.PATCH
```

Example

```text
1.0.0
```

---

# Release Checklist

Before every production release

- All tests pass
- TypeScript passes
- ESLint passes
- Build succeeds
- Documentation updated
- CHANGELOG updated
- Firestore Rules verified
- Storage Rules verified
- Environment variables verified
- Security review completed
- Performance review completed

---

# Production Definition

Production is considered ready when

- Application builds successfully
- Firebase deployment succeeds
- Authentication works
- Firestore access works
- Storage uploads work
- Responsive layout verified
- Dark Mode verified
- English and Thai languages verified
- Dashboard functions correctly
- Portfolio management works
- Investment tracking works
- Market search works
- No critical bugs remain

```

```

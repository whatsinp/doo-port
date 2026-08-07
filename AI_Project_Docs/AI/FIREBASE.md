# FIREBASE

Version: 1.0

---

# Overview

This project uses **Firebase** as the Backend-as-a-Service (BaaS).

Firebase is responsible for

- Authentication
- Database
- File Storage
- Hosting

Firebase should be accessed only through the Repository Layer.

Components must never communicate with Firebase directly.

---

# Firebase Services

Enabled services

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Hosting

Future services

- Cloud Functions
- Cloud Messaging
- Remote Config
- Analytics
- App Check

Cloud Functions are required for the MVP trusted-operation boundary. They are not optional for market API proxying, financial transaction processing, or administration.

---

# Firebase Project Structure

Recommended projects

```text
portfolio-dev

portfolio-staging

portfolio-production
```

MVP may begin with

```text
portfolio-dev
```

---

# Authentication

## Providers

Supported

- Email / Password
- Google Login

Not supported

- Facebook
- Apple
- GitHub
- Phone Number

---

# Authentication Flow

```text
Register

↓

Email Verification

↓

Login

↓

Create Session

↓

Load User Profile

↓

Dashboard
```

Google Login

```text
Google Login

↓

Create Account (if first login)

↓

Load User Profile

↓

Dashboard
```

---

# Authentication Rules

Email Registration

- Email verification required
- Password reset supported

Google Login

- No email verification required
- Automatically trusted by Google

Remember Login

- Enabled

Multiple Sessions

- Allowed

---

# User Profile

User document

```text
users/{uid}
```

Created

Immediately after successful registration.

Contains

- Profile Information
- Preferences
- Role
- Status

---

# Firestore

Primary database

Cloud Firestore

Collections

```text
users

portfolios

assets

transactions

favorites

notifications

settings
```

All collection definitions are documented in

DATABASE.md

---

# Firestore Rules

General Rules

Users may access only

- Their own documents

Admins may

- View users
- Edit users
- Suspend users

Never allow public write access.

---

# Recommended Firestore Rules

```javascript
rules_version = '2';

service cloud.firestore {

    match /databases/{database}/documents {

        match /users/{userId} {

            allow read, write:

            if request.auth != null

            && request.auth.uid == userId;

        }

    }

}
```

Actual rules should cover every collection.

The example rule is not production-safe and must not be deployed. Production rules must protect privileged and server-owned fields, validate create and update payloads separately, and use Firebase custom claims for administration.

---

# Firestore Indexes

Recommended

```text
portfolios

userId + order
```

```text
assets

userId + portfolioId
```

```text
transactions

userId + transactionDate
```

```text
favorites

userId + ticker
```

```text
notifications

userId + createdAt
```

---

# Firestore Best Practices

Always

- Keep documents small
- Use indexes
- Query by indexed fields
- Use references when appropriate

Avoid

Large arrays

Large nested objects

Deep document hierarchies

---

# Storage

Purpose

Store

- Profile Images

Future

- Attachments
- Export Files

---

# Storage Structure

```text
profile-images/

    {uid}/

        avatar.jpg
```

Future

```text
exports/

attachments/
```

---

# Storage Rules

Users may

- Upload their own image
- Read their own image
- Replace their own image

Users may not

- Access other users' files

Admins

May view files if required.

---

# Storage File Limits

Profile Image

Maximum

```text
5 MB
```

Allowed Types

```text
jpg

jpeg

png

webp
```

Reject

- GIF
- SVG
- Executables

---

# Hosting

Hosting Platform

Firebase Hosting

Deployment

Static Nuxt Application

Features

- HTTPS
- CDN
- Compression
- SPA Rewrites

---

# Environment Variables

Never hardcode Firebase configuration.

Use

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

Commit

```text
.env.example
```

---

# Firebase SDK

Required Packages

```bash
firebase
```

Use the Modular SDK.

Never use the legacy namespace SDK.

---

# Repository Pattern

Firebase access must follow

```text
Component

↓

Composable

↓

Service

↓

Repository

↓

Firebase
```

Never

```text
Component

↓

Firebase
```

---

# Authentication Repository

Responsibilities

- Register
- Login
- Logout
- Google Login
- Password Reset
- Email Verification

Must not contain UI logic.

---

# Firestore Repository

Responsibilities

- CRUD Operations
- Queries
- Pagination
- Transactions

Must not contain business logic.

---

# Storage Repository

Responsibilities

- Upload
- Replace
- Delete
- Generate Download URL

---

# Security

Never expose

- Admin SDK
- Service Accounts
- Secrets

Always

- Validate Authentication
- Validate Authorization
- Use Firestore Rules
- Use Storage Rules

---

# Offline Support

Firestore offline persistence

Optional for MVP.

Architecture should support enabling it later.

---

# Transactions

Use Firestore Transactions when

- Buying assets
- Selling assets
- Updating cash balance
- Updating portfolio summaries

Prevent race conditions.

Client Firestore transactions are insufficient for financial invariants because clients are untrusted. Trusted Cloud Functions own transaction validation, ledger writes, projection updates, and idempotency.

---

# Batch Writes

Use Batch Writes when

- Updating multiple documents
- Moving assets between portfolios
- Large administrative operations

---

# Timestamps

Always use

```typescript
serverTimestamp()
```

Never rely solely on client time.

---

# Error Handling

Every Firebase request must handle

- Permission Denied
- Network Error
- Timeout
- Authentication Expired
- Document Not Found

Return standardized errors through the Service Layer.

---

# Logging

Log

- Authentication failures
- Firestore failures
- Storage failures

Never log

- Passwords
- Tokens
- Personal sensitive information

---

# Performance

Optimize

- Indexed queries
- Pagination
- Lazy loading
- Document size
- Number of reads

Avoid unnecessary listeners.

---

# Future Firebase Services

Planned

Cloud Functions

Purpose

- Scheduled Jobs
- Portfolio Calculations
- Price Alert Processing

MVP responsibilities

- Market and FX API proxying
- API-key protection and rate limiting
- Financial ledger processing and projection updates
- Portfolio valuation snapshots
- Admin custom claims, suspension, token revocation, and audit logging

Cloud Messaging

Purpose

- Push Notifications

Remote Config

Purpose

- Feature Flags
- Runtime Configuration

Analytics

Purpose

- Usage Tracking

App Check

Purpose

- Abuse Protection

---

# Firebase Emulator

Recommended for local development.

Services

- Authentication
- Firestore
- Storage

Never connect production data during development.

---

# Backup Strategy

Firestore

Export regularly.

Storage

Keep original uploaded files.

Git

Source code backup.

---

# Monitoring

Monitor

- Authentication Usage
- Firestore Reads
- Firestore Writes
- Storage Usage
- Hosting Bandwidth
- Error Rates

Review Firebase usage periodically to remain within the free tier.

---

# Deployment Checklist

Before deployment

- Authentication enabled
- Google Login configured
- Email Login configured
- Firestore Rules deployed
- Storage Rules deployed
- Required indexes created
- Environment variables configured
- Production build successful

---

# Future Migration

The application architecture must allow migration from Firebase to another backend with minimal changes.

Repository abstraction should isolate Firebase from the business logic.

Only Repository implementations should require replacement.

# SECURITY

Version: 1.0

---

# Overview

This document defines the security requirements and best practices for the Investment Portfolio Tracker.

Security is a core requirement and must be considered during every phase of development.

The MVP uses Firebase Authentication, Cloud Firestore, and Firebase Storage.

---

# Security Principles

Always

- Authenticate users
- Authorize every request
- Validate all input
- Sanitize user data
- Follow the Principle of Least Privilege
- Protect user privacy
- Keep secrets out of source code

Never

- Trust client-side data
- Expose API keys
- Store passwords
- Bypass Firestore Security Rules

---

# Authentication

Supported Providers

- Email / Password
- Google Login

Email Login

- Email verification required
- Password reset supported

Google Login

- Trusted identity provider
- No additional email verification required

Remember Login

- Enabled

---

# Authorization

Every authenticated request must verify

- User identity
- User status
- User permissions

Roles

```text
user

admin
```

Users

- Access only their own resources

Admins

- Manage users
- Suspend accounts
- View statistics

---

# Firestore Security Rules

General Rule

Users may only access their own data.

Example

```javascript
allow read, write:

if request.auth != null

&& request.auth.uid == resource.data.userId;
```

Every collection must have explicit rules.

Never rely only on frontend validation.

---

# Storage Security

Users may upload

- Profile images only

Users may access

- Their own files only

Maximum file size

```text
5 MB
```

Allowed formats

- JPG
- JPEG
- PNG
- WEBP

Reject

- Executables
- SVG
- GIF
- Unknown file types

---

# API Security

External API keys must never be exposed to the client.

If an API requires a secret key

Use

```text
Nuxt Server Routes

↓

External API
```

Never call secret APIs directly from the browser.

---

# Environment Variables

Store secrets in

```text
.env
```

Never commit

```text
.env
```

Commit only

```text
.env.example
```

Examples

```env
NUXT_PUBLIC_FIREBASE_API_KEY=

NUXT_PUBLIC_FIREBASE_PROJECT_ID=

MARKET_API_KEY=
```

Public Firebase configuration is acceptable.

Private API keys are never public.

---

# Input Validation

Validate

- Forms
- Query Parameters
- Route Parameters
- API Responses
- Firestore Documents

Use

Zod

for schema validation.

---

# Client Validation

Purpose

Improve user experience.

Client validation is **not** a security mechanism.

All important validation must also exist on the server or in Firestore Security Rules.

---

# Password Policy

Minimum length

```text
8
```

Recommended

- Uppercase
- Lowercase
- Number
- Special character

Passwords are managed by Firebase Authentication.

Never store passwords manually.

---

# Session Security

Firebase Authentication manages

- Secure tokens
- Token refresh
- Session persistence

Always verify authentication state before accessing protected resources.

---

# Route Protection

Protect routes using Nuxt middleware.

Protected

- Dashboard
- Portfolio
- Favorites
- Notifications
- Profile
- Settings
- Admin

Public

- Login
- Register
- Forgot Password

---

# Admin Protection

Every admin page must verify

- Authentication
- Admin role
- Active account status

Never rely only on hidden UI elements.

---

# XSS Protection

Never render untrusted HTML.

Avoid

```vue
v-html
```

unless content is fully sanitized.

---

# CSRF

Firebase Authentication significantly reduces CSRF risks.

Future server endpoints should

- Validate authentication
- Verify origin when applicable

---

# SQL Injection

Not applicable.

Cloud Firestore is a NoSQL database.

Still validate all user input.

---

# File Upload Security

Validate

- File type
- File size
- Upload path

Reject invalid uploads immediately.

Future enhancements

- Image compression
- Malware scanning
- Automatic resizing

---

# Logging

Log

- Authentication failures
- Permission errors
- Unexpected exceptions

Never log

- Passwords
- Access tokens
- Refresh tokens
- Sensitive personal data

---

# Error Messages

Display user-friendly messages.

Avoid exposing

- Stack traces
- Internal errors
- Database structure
- API secrets

Example

Good

```text
Unable to load your portfolio.
```

Bad

```text
Firestore permission denied on collection users/123.
```

---

# Dependency Security

Before every release

- Update dependencies
- Review vulnerabilities
- Remove unused packages

Run

```bash
npm audit
```

Regularly.

---

# HTTPS

Production must always use

HTTPS

Never deploy production over HTTP.

Firebase Hosting provides HTTPS by default.

---

# Browser Security

Recommended HTTP Headers

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

These should be configured through Firebase Hosting or Nuxt server configuration.

---

# Content Security Policy

Recommended

- Restrict script sources
- Restrict image sources
- Restrict frame sources

Avoid

```text
unsafe-inline

unsafe-eval
```

whenever possible.

---

# Third-Party Libraries

Only use libraries that

- Are actively maintained
- Have acceptable security history
- Are widely adopted

Remove unused dependencies.

---

# Rate Limiting

External APIs

Respect provider limits.

Future server endpoints should support

- Request throttling
- Abuse detection

---

# Firebase App Check

Not required for MVP.

Planned for future versions.

Purpose

Reduce abuse and automated traffic.

---

# Backup Strategy

Firestore

Regular exports.

Storage

Retain original uploaded files.

Source Code

GitHub repository.

---

# Incident Response

If a security issue is discovered

1. Assess impact
2. Disable affected functionality if necessary
3. Fix the vulnerability
4. Deploy the patch
5. Update CHANGELOG.md
6. Document the decision in DECISIONS.md if architecture changes

---

# Security Checklist

Before deployment

- Authentication enabled
- Firestore Rules deployed
- Storage Rules deployed
- Environment variables configured
- HTTPS verified
- No secrets committed
- Dependencies reviewed
- Build successful

---

# Future Security Enhancements

Planned

- Firebase App Check
- Multi-Factor Authentication (MFA)
- Login history
- Device management
- Security notifications
- Automatic anomaly detection

---

# Security Responsibilities

Frontend

- Validate user input
- Protect routes
- Display safe error messages

Repository Layer

- Secure Firebase access
- Handle permission errors

Firebase

- Authentication
- Authorization
- Data protection

Developers

- Follow coding standards
- Review dependencies
- Keep documentation updated

---

# Security Policy

Every new feature must answer the following questions before implementation

- Does it require authentication?
- Does it require authorization?
- What data can be accessed?
- Who can modify the data?
- Can the input be abused?
- Are secrets protected?
- Are Firestore rules sufficient?
- Are uploaded files validated?

If any answer is unclear, implementation must pause until the security requirements are defined.

---

# Mandatory Authorization Model

- Admin authorization uses Firebase custom claims set only by trusted backend code.
- A user document is never an authorization source that the user can write.
- A suspended account is disabled through Firebase Admin SDK and its refresh tokens are revoked.
- Client-write rules allow only explicitly listed profile and preference fields. They deny writes to `role`, `status`, `emailVerified`, aggregate balances, holdings projections, quotes, valuations, metrics, audit logs, and provider metadata.
- Financial writes are accepted only by trusted transaction endpoints. The browser does not write holdings, cash projections, or valuation snapshots directly.

---

# Firestore and Storage Rule Requirements

Rules must separately validate create, read, update, delete, allowed field names, field types, owner identity, immutable fields, and document relationships. A query must be denied unless its constraints satisfy the ownership rule.

Storage paths are limited to `profile-images/{uid}/avatar`. Rules validate `request.auth.uid`, a 5 MB maximum, and `image/jpeg`, `image/png`, or `image/webp` content types. Uploads, replacement, and deletion require rule tests in the Firebase Emulator.

---

# Required Security Tests

- Unauthenticated, cross-user, and malformed Firestore requests are denied.
- A user cannot elevate role, reactivate an account, alter email verification, or write server-owned fields.
- A user cannot oversell, create negative cash, exceed portfolio/favorite limits, or replay an idempotent operation.
- A non-admin cannot invoke admin endpoints; an admin action creates an audit record and requires a reason.
- Secret values are absent from the client bundle and `NUXT_PUBLIC_*` configuration.
- App Check is enabled before public production launch unless a documented risk exception is accepted.

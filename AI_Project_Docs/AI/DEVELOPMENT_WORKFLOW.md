# DEVELOPMENT_WORKFLOW

Version: 1.0

---

# Overview

This document defines the standard development workflow for the Investment Portfolio Tracker.

Every feature, bug fix, refactor, and enhancement must follow this workflow.

The primary goals are

- High quality
- Predictable development
- Maintainable code
- Consistent architecture
- Low technical debt

---

# Development Lifecycle

Every task must follow this order.

```text
Requirement

↓

Analysis

↓

Planning

↓

Architecture

↓

Database Design

↓

API Design

↓

UI/UX Design

↓

Approval

↓

Implementation

↓

Testing

↓

Code Review

↓

Documentation

↓

Deployment
```

No step should be skipped.

---

# Phase 1

## Requirement Analysis

Understand the business requirements.

Questions to answer

- What problem is being solved?
- Who will use this feature?
- What is the expected outcome?
- Are there edge cases?
- Are there existing related features?

Deliverables

- Requirement summary
- Clarified requirements
- Open questions

---

# Phase 2

## Technical Planning

Determine

- Components
- Pages
- Composables
- Services
- Repositories
- Stores
- Types

Deliverables

- Technical plan
- Estimated complexity

---

# Phase 3

## Architecture

Design

- Folder structure
- Data flow
- Dependency flow
- Layer responsibilities

Deliverables

Architecture proposal.

---

# Phase 4

## Database Design

Determine

- Collections
- Documents
- Fields
- Indexes
- Relationships

Deliverables

Updated

DATABASE.md

---

# Phase 5

## API Design

Determine

- Repository methods
- Service methods
- API endpoints
- Request flow
- Error handling

Deliverables

Updated

API.md

---

# Phase 6

## UI / UX

Define

- User Flow
- Wireframe
- Components
- Loading State
- Empty State
- Error State

Deliverables

UI specification.

---

# Phase 7

## Approval

Before implementation

Review

- Requirement
- Architecture
- Database
- API
- UI

Implementation begins only after approval.

---

# Phase 8

## Implementation

Implementation order

1.

Types

↓

2.

Repositories

↓

3.

Services

↓

4.

Composables

↓

5.

Pinia Stores

↓

6.

Components

↓

7.

Pages

Never implement Pages first.

---

# Phase 9

## Testing

Required testing

- Manual Testing
- Unit Testing
- Integration Testing

Verify

- Business Logic
- UI
- Responsive Design
- Dark Mode

---

# Phase 10

## Code Review

Review

- Readability
- Architecture
- Performance
- Security
- Type Safety

Reject

- Duplicate Code
- Large Components
- Hardcoded Values
- Business Logic inside UI

---

# Phase 11

## Documentation

Update

- CHANGELOG.md
- DECISIONS.md
- PROJECT.md
- DATABASE.md
- API.md
- FEATURES.md

Only update files affected by the change.

---

# Phase 12

## Deployment

Before deployment

Verify

- Build
- TypeScript
- ESLint
- Tests
- Firestore Rules
- Storage Rules

Deploy

Firebase Hosting.

---

# Feature Development Workflow

```text
Requirement

↓

Analysis

↓

Database

↓

API

↓

Service

↓

Composable

↓

Store

↓

Component

↓

Page

↓

Testing

↓

Review

↓

Deploy
```

---

# Bug Fix Workflow

```text
Identify Bug

↓

Reproduce

↓

Root Cause Analysis

↓

Implement Fix

↓

Regression Test

↓

Review

↓

Deploy
```

---

# Refactoring Workflow

```text
Identify Problem

↓

Review Architecture

↓

Implement Refactor

↓

Run Tests

↓

Review

↓

Update Documentation
```

Refactoring must not change business behavior.

---

# Documentation Workflow

Whenever architecture changes

Update

- ARCHITECTURE.md
- DECISIONS.md

Whenever database changes

Update

- DATABASE.md
- API.md

Whenever features change

Update

- FEATURES.md
- CHANGELOG.md

---

# Git Workflow

Branch

```text
feature/dashboard

feature/auth

feature/portfolio

fix/login

refactor/services
```

Never commit directly to

```text
main
```

---

# Commit Convention

Use Conventional Commits.

Examples

```text
feat(auth): add Google login

feat(portfolio): create portfolio management

fix(dashboard): correct profit calculation

refactor(api): simplify repository structure

docs(database): update collection schema

style(ui): improve responsive layout

test(investment): add average cost tests
```

---

# Pull Request Checklist

Before opening a Pull Request

- Feature completed
- No TypeScript errors
- ESLint passes
- Build passes
- Responsive verified
- Dark Mode verified
- Documentation updated
- CHANGELOG updated

---

# Review Checklist

Review

Architecture

Business Logic

Naming

Performance

Security

Type Safety

Accessibility

Responsiveness

Maintainability

Reusability

---

# Testing Checklist

Verify

Authentication

Portfolio

Investment

Cash

Favorites

Dashboard

Search

Notifications

Profile

Settings

Admin

---

# Responsive Checklist

Verify

Desktop

Tablet

Mobile

Landscape

Portrait

---

# Accessibility Checklist

Verify

Keyboard Navigation

Focus States

ARIA Labels

Color Contrast

Semantic HTML

---

# Performance Checklist

Verify

Lazy Loading

Route Splitting

Dynamic Imports

Optimized Firestore Queries

Minimal Re-renders

Image Optimization

---

# Security Checklist

Verify

Authentication

Authorization

Firestore Rules

Storage Rules

Input Validation

No exposed secrets

---

# Release Workflow

```text
Feature Complete

↓

Testing

↓

Code Review

↓

Documentation

↓

Version Update

↓

CHANGELOG

↓

Production Build

↓

Deploy

↓

Post Deployment Verification
```

---

# Definition of Ready

A task is ready when

- Requirements are clear
- Business rules are defined
- UI is understood
- Database impact is known
- API impact is known
- Dependencies are identified
- Financial calculations reference `CALCULATION_SPEC.md` when applicable.
- Authorization owner, Firestore/Storage rule impact, and trusted-backend impact are identified.
- Acceptance criteria include loading, empty, error, offline, responsive, and accessibility states.

---

# Definition of Done

A task is complete only when

- Requirements satisfied
- Code reviewed
- Tests passed
- Responsive verified
- Dark Mode verified
- Accessibility checked
- Documentation updated
- CHANGELOG updated
- Production build successful
- Ready for deployment
- Firebase Emulator rule tests pass when access control changes.
- Calculation regression tests pass when financial behavior changes.
- A cost and quota impact is documented for Firebase or market-data changes.

---

# AI Agent Workflow

For every request

```text
Understand

↓

Analyze

↓

Ask Questions (if needed)

↓

Design

↓

Explain

↓

Wait for Approval

↓

Implement

↓

Test

↓

Review

↓

Document
```

AI must never skip the approval step when requirements are unclear.

---

# Project Principles

Every contribution should improve

- Readability
- Scalability
- Maintainability
- Performance
- User Experience

Never sacrifice long-term quality for short-term speed.

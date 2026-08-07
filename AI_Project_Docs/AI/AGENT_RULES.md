# AI Agent Rules

> Version: 1.0
>
> Project: Investment Portfolio Tracker
>
> Last Updated: 2026-08-05

---

# Mission

Your primary goal is NOT to generate code.

Your primary goal is to build a high-quality, maintainable, scalable, production-ready software system.

Always think like:

- Senior Software Architect
- Senior Full Stack Engineer
- Senior UI/UX Designer
- Technical Lead
- Product Owner

---

# Communication Rules

## Language

Always communicate with the user in **Thai**.

This includes

- Questions
- Explanations
- Suggestions
- Progress Updates
- Code Reviews
- Architecture Discussions

---

## Programming Language

Everything related to software must remain in English.

Examples

- Variables
- Functions
- Classes
- Interfaces
- Types
- Folder names
- File names
- API names
- Firestore collections
- Database fields
- Comments
- Git Commit Messages

Never translate programming terminology into Thai.

---

# Development Philosophy

Never rush into coding.

Think first.

Design first.

Discuss first.

Code last.

---

Every feature must follow

1. Requirement Analysis
2. Technical Design
3. Database Design
4. API Design
5. UI Component Design
6. Edge Case Analysis
7. User Approval
8. Implementation
9. Testing
10. Code Review

Never skip steps.

---

# Requirement Rules

If any requirement is unclear

DO NOT GUESS.

Always ask questions.

Never invent business logic.

Never assume hidden requirements.

---

# Architecture Rules

Always follow

- Clean Architecture
- SOLID Principles
- Feature-based Architecture
- Modular Design
- Reusable Components
- Separation of Concerns

Business Logic must never live inside UI Components.

---

Layers

UI

↓

Composable

↓

Service

↓

Repository

↓

Firebase / External API

---

# Frontend Stack

Always use

- Nuxt 3
- Vue 3
- TypeScript
- PrimeVue
- Tailwind CSS
- Pinia
- VueUse

Never replace these technologies unless explicitly instructed.

---

# Vue Rules

Always use

- Composition API
- <script setup>

- TypeScript
- Auto Imports
- defineProps
- defineEmits
- defineModel (when appropriate)

Avoid

- Options API
- Mixins
- Large Components

Prefer

Small reusable components.

---

# PrimeVue Rules

PrimeVue is the primary component library.

Always use PrimeVue first.

Examples

- Button
- Card
- Dialog
- Drawer
- Sidebar
- Menu
- Tabs
- Accordion
- DataTable
- Avatar
- Badge
- Tag
- Skeleton
- ProgressBar
- ConfirmDialog
- Toast
- AutoComplete
- Password
- InputText

Never recreate components that already exist.

---

# Tailwind Rules

Tailwind should only be used for

- Layout
- Grid
- Flex
- Spacing
- Responsive Design
- Minor Styling

Avoid creating custom utility systems.

---

# Pinia Rules

Use Pinia for

- Authentication State
- User State
- Portfolio State
- Theme
- Settings

Avoid storing temporary component state inside Pinia.

---

# Firebase Rules

Always use

Firebase Authentication

Cloud Firestore

Firebase Storage

Firebase Hosting

Never expose API Keys unnecessarily.

Always validate security rules.

---

# API Rules

Never call external APIs directly from Vue Components.

Always create

API Layer

↓

Repository

↓

Composable

↓

Page

Every API must support

- Error Handling
- Retry
- Timeout
- Fallback

---

# Firestore Rules

Collections should be normalized.

Avoid duplicated data.

Prefer document references.

Always consider future scalability.

---

# Folder Rules

Follow Feature-based Architecture.

Never place unrelated files together.

Group by feature rather than file type whenever practical.

---

# Coding Standards

Always write

Readable code.

Maintainable code.

Scalable code.

Production-ready code.

Avoid

Magic Numbers

Hardcoded Strings

Duplicate Code

Nested Logic

Huge Components

---

# TypeScript Rules

Never use

any

unless absolutely necessary.

Prefer

interface

type

generic

utility types

strict typing

---

# Component Rules

Each component should have only one responsibility.

Large components should be split.

Prefer composition over inheritance.

---

# Composable Rules

Business logic belongs inside composables.

Avoid business logic inside Vue Components.

Composable names

useAuth()

usePortfolio()

useDashboard()

useMarket()

---

# Error Handling

Always handle

Loading

Empty

Error

Success

Offline

Timeout

API Failure

Authentication Failure

Permission Failure

---

# UI Rules

Design Style

Modern

Minimal

Responsive

Fast

Simple

Inspired by

- Dime
- Apple
- Linear

Support

Light

Dark

System Theme

---

# UX Rules

Always consider

Loading State

Empty State

Error State

Success Feedback

Confirmation Dialog

Undo (if appropriate)

Never leave users confused.

---

# Accessibility

Use semantic HTML.

Support keyboard navigation.

Provide aria labels when appropriate.

Maintain sufficient color contrast.

---

# Performance

Lazy load pages.

Lazy load heavy components.

Optimize Firestore queries.

Avoid unnecessary re-renders.

Cache when appropriate.

---

# Security

Never trust client input.

Validate everything.

Follow Firebase Security Rules.

Never expose secrets.

---

# Git Rules

Small commits.

Meaningful commit messages.

Use Conventional Commits.

Examples

feat:

fix:

refactor:

docs:

style:

test:

---

# Documentation

Every important architectural decision should be documented.

Update

DECISIONS.md

when major decisions change.

---

# Development Workflow

For every feature

Analyze

↓

Explain

↓

Design

↓

Ask for approval

↓

Implement

↓

Test

↓

Review

↓

Commit

Never skip approval.

---

# AI Behavior

You are not just a code generator.

You are an engineering partner.

Always

Challenge poor decisions professionally.

Suggest better alternatives.

Explain trade-offs.

Think long-term.

Prefer maintainability over shortcuts.

Never optimize prematurely.

Always prioritize code quality.

---

# Final Rule

When uncertain,

ASK.

Never GUESS.

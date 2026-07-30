# ROLE

You are a Principal Software Architect, Staff Frontend Engineer, Staff Backend Engineer, TypeScript Expert, Code Quality Auditor, Performance Engineer, Security Auditor, and Technical Lead.

Continue the existing project.

DO NOT recreate previous prompts.

This is the FINAL CODE AUDIT phase.

Your task is to review, refactor, optimize, and standardize the entire codebase produced from Prompt 01–10.

Everything must be production-grade.

--------------------------------------------------
GLOBAL RULES
--------------------------------------------------

Never change business logic unless a bug is found.

Never remove working features.

Never introduce breaking changes.

Preserve all existing functionality.

Refactor safely.

Use TypeScript Strict Mode.

Never use "any".

Never suppress errors with ts-ignore unless absolutely necessary and documented.

--------------------------------------------------
OBJECTIVE
--------------------------------------------------

Transform the codebase from

"AI-generated"

into

"Professional maintainable software."

The final result should be clean enough that a senior engineer can continue working on it comfortably.

--------------------------------------------------
AUDIT SCOPE
--------------------------------------------------

Review the entire repository.

Frontend

Backend

Firebase

AI

PDF

Wizard

Dashboard

Upload System

Utilities

Hooks

Types

Constants

Config

Styles

Build Configuration

--------------------------------------------------
DUPLICATE DETECTION
--------------------------------------------------

Find duplicated

Components

Hooks

Services

Utilities

Types

Constants

Validation Schemas

Icons

Styles

Animations

Merge duplicates into a single source of truth.

--------------------------------------------------
NAMING CONVENTION
--------------------------------------------------

Standardize

PascalCase

Components

camelCase

Functions

Hooks

Variables

UPPER_SNAKE_CASE

Constants

kebab-case

Routes

Files

Folders

Ensure naming is consistent across the entire project.

--------------------------------------------------
FOLDER CONSISTENCY
--------------------------------------------------

Verify every file is located in the correct layer.

app/

components/

features/

hooks/

services/

types/

schemas/

constants/

config/

utils/

firebase/

Move misplaced files.

--------------------------------------------------
TYPE SAFETY
--------------------------------------------------

Eliminate

any

unknown misuse

implicit any

unsafe casts

missing return types

missing interface definitions

missing generics

Ensure complete type coverage.

--------------------------------------------------
ZOD AUDIT
--------------------------------------------------

Verify every external input has schema validation.

Form input

Firebase data

AI response

URL params

Query params

File metadata

--------------------------------------------------
SERVICE LAYER AUDIT
--------------------------------------------------

Ensure UI never accesses Firebase directly.

All data access must go through

ProjectService

StorageService

AuthService

AIService

PdfService

Refactor any direct Firebase usage.

--------------------------------------------------
HOOK AUDIT
--------------------------------------------------

Review all hooks.

Remove duplicated state.

Ensure proper dependency arrays.

Prevent stale closures.

Prevent unnecessary re-renders.

--------------------------------------------------
REACT PERFORMANCE
--------------------------------------------------

Audit

Memoization

useMemo

useCallback

React.memo

Lazy loading

Dynamic imports

Suspense boundaries

Avoid premature optimization.

Optimize only where beneficial.

--------------------------------------------------
NEXT.JS AUDIT
--------------------------------------------------

Review

Server Components

Client Components

Metadata

Route loading

Error boundaries

Image optimization

Dynamic rendering

Caching strategy

Use Server Components whenever possible.

--------------------------------------------------
TAILWIND AUDIT
--------------------------------------------------

Remove duplicated utility chains.

Extract reusable variants.

Use class-variance-authority if already installed.

Avoid arbitrary values unless necessary.

--------------------------------------------------
DESIGN TOKEN AUDIT
--------------------------------------------------

Ensure all colors, spacing, radius, shadows, transitions, and z-index values come from centralized tokens.

No hardcoded design values.

--------------------------------------------------
ACCESSIBILITY AUDIT
--------------------------------------------------

Verify

Keyboard navigation

Focus management

ARIA labels

Semantic HTML

Color contrast

Reduced motion

Form labels

Dialog focus trap

Table accessibility

--------------------------------------------------
SECURITY AUDIT
--------------------------------------------------

Review

Firebase Rules

Storage Rules

Environment variables

Sensitive data exposure

XSS vectors

Unsafe HTML rendering

File upload validation

Client-side trust assumptions

Ensure no secrets are exposed to the browser.

--------------------------------------------------
ERROR HANDLING AUDIT
--------------------------------------------------

Verify

Try/catch coverage

User-friendly messages

Retry mechanisms

Fallback UI

Offline tolerance architecture

--------------------------------------------------
LOGGING AUDIT
--------------------------------------------------

Remove debug logs.

Remove console.log.

Keep only structured logging.

No sensitive information in logs.

--------------------------------------------------
AI AUDIT
--------------------------------------------------

Verify

JSON-only responses

Zod validation

Retry strategy

Fallback handling

Prompt versioning

Token usage tracking

Model metadata

Ensure AI failures never block project submission.

--------------------------------------------------
PDF AUDIT
--------------------------------------------------

Verify

Template separation

Page overflow handling

Long text wrapping

Image fallback

Version metadata

Filename generation

--------------------------------------------------
UPLOAD AUDIT
--------------------------------------------------

Verify

storagePath usage

No permanent downloadURL storage

File validation

Size validation

Extension validation

Memory cleanup

Preview object URL cleanup

Upload queue stability

--------------------------------------------------
DATABASE AUDIT
--------------------------------------------------

Review Firestore structure.

Ensure

No oversized documents

Proper subcollections

Indexed queries

Consistent timestamps

Consistent IDs

Consistent schemaVersion usage

--------------------------------------------------
QUERY AUDIT
--------------------------------------------------

Review all Firestore queries.

Prevent

N+1 patterns

Unnecessary listeners

Unbounded queries

Missing limits

Missing ordering

--------------------------------------------------
TIMESTAMP STANDARDIZATION
--------------------------------------------------

Use Firebase server timestamps consistently.

createdAt

updatedAt

submittedAt

completedAt

lastLogin

generatedAt

--------------------------------------------------
ID STANDARDIZATION
--------------------------------------------------

Use

Firestore Document ID

Internal only.

Human Project ID

WPB-000001

Display everywhere in UI and PDF.

--------------------------------------------------
BUILD AUDIT
--------------------------------------------------

Run

Type check

ESLint

Production build

Analyze warnings.

Fix all actionable issues.

--------------------------------------------------
BUNDLE AUDIT
--------------------------------------------------

Identify large dependencies.

Remove unused packages.

Replace heavy libraries when possible.

Keep the bundle lean.

--------------------------------------------------
DEPENDENCY AUDIT
--------------------------------------------------

Review package.json.

Remove unused dependencies.

Move tooling to devDependencies.

Pin critical versions if necessary.

--------------------------------------------------
ENV AUDIT
--------------------------------------------------

Verify

.env.example completeness

No missing variables

No production secrets committed

--------------------------------------------------
DOCUMENTATION AUDIT
--------------------------------------------------

Review

README

Setup instructions

Firebase setup

Vercel deployment

Environment variables

Troubleshooting

Architecture overview

Update outdated information.

--------------------------------------------------
QUALITY REPORT
--------------------------------------------------

Generate a final audit report.

Include

Issues Found

Severity

Critical

High

Medium

Low

Fix Applied

Files Changed

Performance Improvements

Security Improvements

Accessibility Improvements

Developer Experience Improvements

--------------------------------------------------
CODE FREEZE
--------------------------------------------------

After refactoring

Generate a CODE_FREEZE.md document.

Record

Date

Version

Architecture summary

Known limitations

Future improvements

--------------------------------------------------
RELEASE VERSION
--------------------------------------------------

Set initial release version

v1.0.0

Generate release notes.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Generate

Refactored codebase

Standardized naming

Merged duplicates

Updated types

Updated services

Updated hooks

Updated validation

Updated documentation

Audit report

CODE_FREEZE.md

RELEASE_NOTES.md

Final production-ready project.

--------------------------------------------------
DO NOT
--------------------------------------------------

Do NOT add new features.

Do NOT redesign the UI.

Do NOT change business requirements.

Do NOT introduce experimental patterns.

Do NOT remove working functionality.

This prompt is about quality, consistency, security, maintainability, and production readiness only.
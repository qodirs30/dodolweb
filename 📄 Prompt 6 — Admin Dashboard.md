# ROLE

You are a Principal Product Designer, Senior Full Stack Engineer, Dashboard UX Specialist, Firebase Expert, and Enterprise Software Architect.

Continue the existing project.

DO NOT recreate previous work.

Extend the existing architecture from Prompt 01–05.

Build ONLY the complete Admin Dashboard.

Everything must be production-ready.

--------------------------------------------------
GLOBAL RULES
--------------------------------------------------

Never rename existing folders.

Never duplicate components.

Always reuse existing services.

Never rewrite architecture.

Follow SOLID.

Follow Clean Architecture.

Follow TypeScript Strict Mode.

Never use "any".

Never hardcode project status.

Everything must be reusable.

Everything must be scalable.

Everything must be strongly typed.

--------------------------------------------------
PROJECT
--------------------------------------------------

Website Project Brief

Internal Agency Management Tool

One Agency

One Admin

Many Public Clients

--------------------------------------------------
OBJECTIVE
--------------------------------------------------

Build a premium Admin Dashboard that feels similar to

Linear

Stripe Dashboard

Notion

Vercel Dashboard

Framer CMS

Do NOT build a generic CRUD dashboard.

The dashboard should become the daily workspace of the agency.

--------------------------------------------------
ROUTES
--------------------------------------------------

/admin

Dashboard Home

/admin/projects

Project List

/admin/projects/[projectId]

Project Detail

/admin/settings

Settings

--------------------------------------------------
ADMIN AUTH
--------------------------------------------------

Only authenticated admin can access.

Use existing Firebase Authentication.

Protect every admin route.

Redirect unauthorized users to

/admin/login

--------------------------------------------------
LAYOUT
--------------------------------------------------

Persistent Sidebar

Top Navigation

Responsive Layout

Content Container

Breadcrumb

Page Header

Page Actions

Global Search

Notification Area (prepare only)

--------------------------------------------------
SIDEBAR
--------------------------------------------------

Dashboard

Projects

Settings

Collapse Sidebar

Dark mode architecture ready

Logout

--------------------------------------------------
TOPBAR
--------------------------------------------------

Breadcrumb

Search

Admin Avatar

Profile Menu

--------------------------------------------------
DASHBOARD HOME
--------------------------------------------------

Create a modern overview page.

Cards

Total Projects

Draft

Submitted

Review

Quotation

Development

Completed

Cancelled

Recent Activity

Latest Projects

Quick Actions

Project Status Distribution

Empty State

Loading State

Skeleton

--------------------------------------------------
PROJECT LIST
--------------------------------------------------

Display every submitted project.

Modern data table.

Support

Search

Sort

Pagination

Filtering

Responsive Cards on Mobile

--------------------------------------------------
TABLE COLUMNS
--------------------------------------------------

Project ID

Client Name

Company

Website Type

Status

Created Date

Updated Date

Project Score (AI Placeholder)

Priority (AI Placeholder)

Actions

--------------------------------------------------
SEARCH
--------------------------------------------------

Instant Search

Search by

Project ID

Client Name

Company

Email

Phone

Website Type

--------------------------------------------------
FILTER
--------------------------------------------------

Status

Website Type

Date Range

Newest

Oldest

Recently Updated

--------------------------------------------------
SORT
--------------------------------------------------

Created Date

Updated Date

Alphabetical

Project Score

--------------------------------------------------
PROJECT STATUS
--------------------------------------------------

Status must come from shared constants.

Never hardcode.

Supported

Draft

Submitted

Review

Quotation

Approved

Development

Revision

Completed

Cancelled

Render beautiful status badges.

--------------------------------------------------
PROJECT DETAIL
--------------------------------------------------

Create beautiful detail page.

Use Tabs.

Tabs

Overview

Brief

Files

AI Summary

Notes

History

--------------------------------------------------
OVERVIEW TAB
--------------------------------------------------

Display

Project ID

Status

Client

Business

Website Type

Created Date

Updated Date

Submission Date

Deadline

Budget

Project Completion

Quick Actions

--------------------------------------------------
BRIEF TAB
--------------------------------------------------

Render all answers dynamically.

Do NOT hardcode fields.

Read from Dynamic Form Engine.

Group answers by section.

Business

Project

Audience

Branding

Features

Design

Assets

--------------------------------------------------
FILES TAB
--------------------------------------------------

Display uploaded assets.

Grid View

List View

Search

Filter

Preview

Download

Replace

Delete

Image Preview

PDF Icon

Video Icon

Document Icon

Use StorageService.

Never access Firebase directly.

--------------------------------------------------
AI SUMMARY TAB
--------------------------------------------------

Prepare UI.

No Gemini implementation yet.

Show placeholders.

Cards

Project Summary

Complexity

Estimated Timeline

Recommended Pages

Recommended Features

Missing Information

Risk Analysis

Follow-up Questions

Everything should support loading states.

--------------------------------------------------
NOTES TAB
--------------------------------------------------

Internal Admin Notes.

CRUD.

Timestamp

Author

Rich Text not required.

Plain Text only.

Newest first.

--------------------------------------------------
HISTORY TAB
--------------------------------------------------

Timeline UI.

Show

Project Created

Status Changed

File Uploaded

Note Added

AI Generated

Newest first.

--------------------------------------------------
PROJECT ACTIONS
--------------------------------------------------

Top Right

Edit

Generate PDF (placeholder)

Export JSON

Change Status

Archive

Delete

--------------------------------------------------
STATUS CHANGE
--------------------------------------------------

Use Dialog.

Require confirmation.

Automatically create history record.

--------------------------------------------------
SEARCH EXPERIENCE
--------------------------------------------------

Debounced Search

300ms

Highlight matching text.

--------------------------------------------------
EMPTY STATES
--------------------------------------------------

Beautiful illustration placeholders.

Examples

No Projects

No Files

No Notes

No History

--------------------------------------------------
LOADING STATES
--------------------------------------------------

Skeleton UI.

Never show blank page.

--------------------------------------------------
ERROR STATES
--------------------------------------------------

Graceful Error UI.

Retry Button.

--------------------------------------------------
COMPONENTS
--------------------------------------------------

Create reusable components.

DashboardCard

StatCard

StatusBadge

ProjectTable

ProjectCard

DetailSection

InfoItem

Timeline

HistoryItem

NotesList

EmptyState

Skeleton

PageHeader

SearchInput

FilterBar

ActionMenu

ConfirmDialog

--------------------------------------------------
HOOKS
--------------------------------------------------

Create

useProjects()

useProject()

useProjectSearch()

useProjectFilters()

useProjectStatus()

Do not duplicate logic.

--------------------------------------------------
SERVICES
--------------------------------------------------

Use

ProjectService

StorageService

Never access Firestore directly from UI.

--------------------------------------------------
RESPONSIVE
--------------------------------------------------

Desktop

Tablet

Mobile

Cards replace table on mobile.

Sticky Bottom Actions if needed.

--------------------------------------------------
ACCESSIBILITY
--------------------------------------------------

Keyboard Navigation

Focus Ring

ARIA Labels

Semantic HTML

--------------------------------------------------
PERFORMANCE
--------------------------------------------------

Server Components whenever possible.

Client Components only if required.

Lazy Load Tabs.

Memoization.

Code Splitting.

--------------------------------------------------
SECURITY
--------------------------------------------------

Never expose Firebase internals.

Never expose Storage paths.

Never expose admin data publicly.

Always validate permissions.

--------------------------------------------------
DESIGN SYSTEM
--------------------------------------------------

Follow Prompt 01.

Use existing theme.

No inline styles.

No duplicated Tailwind classes.

Reuse existing UI components.

--------------------------------------------------
ANIMATION
--------------------------------------------------

Use Framer Motion.

Subtle only.

Fade

Slide

Scale

Never distract users.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Generate

Complete Admin Layout

Sidebar

Topbar

Dashboard Home

Projects List

Project Detail

Dynamic Brief Viewer

Files Manager UI

Notes Module

History Timeline

Search

Filters

Hooks

Services Integration

Responsive UI

Production-ready code.

--------------------------------------------------
DO NOT
--------------------------------------------------

Do NOT implement Gemini API.

Do NOT implement PDF generation.

Do NOT recreate Firebase.

Do NOT recreate Upload System.

Do NOT recreate Dynamic Form Engine.

Do NOT hardcode form fields.

Do NOT use mock architecture.

Everything must extend the existing project.
🔥 Tambahan CTO yang sudah saya masukkan langsung ke prompt

Versi di atas SUDAH termasuk revisi-revisi berikut (jadi tidak perlu ditambahkan lagi):

✅ Dynamic Brief Viewer

Admin tidak membuat halaman detail yang hardcode.

Semua jawaban dibaca dari Dynamic Form Engine.

Jadi kalau nanti lo tambah pertanyaan baru, halaman admin otomatis ikut berubah.

✅ Shared Constants

Status project tidak ditulis manual di banyak file.

Gunakan satu source of truth.

Misalnya:

constants/project-status.ts
✅ Service Layer

Dashboard tidak boleh memanggil Firestore langsung.

Seluruh akses data wajib lewat:

ProjectService
StorageService

Jadi nanti kalau backend berubah, UI tetap aman.

✅ Mobile Dashboard

Banyak dashboard jelek di HP.

Di prompt ini sudah gue paksa:

Desktop → Table
Mobile → Card Layout
# ROLE

You are a Senior Staff Software Engineer, Product Designer, UI/UX Designer, Firebase Architect, Next.js Expert, and AI Engineer.

Your mission is to build a premium internal web application called:

Website Project Brief

This application is NOT a SaaS.
It is an internal project management and client briefing system for a web development agency.

Think like Linear, Notion, Framer, Stripe Dashboard, and Apple Human Interface Guidelines.

The UI must feel premium, modern, clean, spacious, and extremely intuitive.

Never generate beginner-level code.

Everything must be scalable, modular, reusable, maintainable, production-ready, and strongly typed.

--------------------------------------------

# PROJECT GOAL

This application replaces WhatsApp conversations when collecting client requirements.

Instead of chatting for hours, clients will complete a beautiful guided wizard.

After submission:

• Data is stored in Firebase
• Images and documents are uploaded
• AI generates project summaries
• Admin reviews everything from a dashboard

This system is for INTERNAL USE ONLY.

--------------------------------------------

# CORE STACK

Use ONLY these technologies.

Frontend

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Lucide Icons

Backend

- Firebase Authentication
- Firestore
- Firebase Storage

Deployment

- Vercel

AI

- Google Gemini API
(API key will be stored in Vercel Environment Variables)

--------------------------------------------

# CODE STYLE

Use

- Clean Architecture
- Feature Based Folder Structure
- SOLID Principles
- DRY
- KISS
- Reusable Components
- Custom Hooks
- Server Components whenever possible
- Client Components only when necessary

Never duplicate logic.

--------------------------------------------

# TYPESCRIPT

Enable strict mode.

Never use any.

Always create interfaces and types.

--------------------------------------------

# UI STYLE

Inspired by

- Linear
- Notion
- Stripe Dashboard
- Framer
- Apple

Theme

Minimal

Professional

Elegant

Modern

Lots of whitespace

Rounded corners

Soft shadows

Beautiful typography

Responsive

Animation should be subtle.

No flashy effects.

--------------------------------------------

# COLOR

Light mode first.

Primary

Black

White

Neutral Gray

Accent

Blue

Use Tailwind variables.

Support Dark Mode architecture, but don't implement it yet.

--------------------------------------------

# TYPOGRAPHY

Use Geist Font.

Perfect hierarchy.

Large headings.

Readable paragraph spacing.

--------------------------------------------

# RESPONSIVENESS

Desktop

Laptop

Tablet

Mobile

Everything must be responsive.

--------------------------------------------

# FOLDER STRUCTURE

Create a scalable folder structure.

Example

app/

components/

features/

hooks/

lib/

services/

types/

schemas/

config/

constants/

utils/

firebase/

public/

Do NOT place everything inside components.

--------------------------------------------

# FIREBASE

Prepare architecture only.

Do not hardcode keys.

Create

firebase.ts

Support

Firestore

Authentication

Storage

Use Environment Variables.

--------------------------------------------

# ENVIRONMENT VARIABLES

Prepare

NEXT_PUBLIC_FIREBASE_API_KEY

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

NEXT_PUBLIC_FIREBASE_PROJECT_ID

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

NEXT_PUBLIC_FIREBASE_APP_ID

GEMINI_API_KEY

Never hardcode secrets.

--------------------------------------------

# ROUTES

Prepare routing architecture.

/

Landing Page

/start

Client Wizard

/success

Submission Success

/admin/login

Admin Login

/admin

Dashboard

/admin/projects

Project List

/admin/projects/[id]

Project Detail

/settings

Admin Settings

--------------------------------------------

# GLOBAL LAYOUT

Create

Navbar

Container

Footer

Sidebar Architecture

Page Wrapper

Loading

Empty State

Error State

404

Skeleton Loader

--------------------------------------------

# SHADCN

Initialize Shadcn properly.

Create reusable UI components.

Buttons

Cards

Inputs

Textarea

Select

Checkbox

Radio Group

Badge

Alert

Dialog

Tabs

Progress

Tooltip

Popover

Dropdown

Accordion

Calendar

Toast

--------------------------------------------

# FORM

Prepare architecture only.

React Hook Form

Zod

Dynamic Fields

Validation

Autosave ready

--------------------------------------------

# FILE STRUCTURE

Prepare storage utilities.

No upload implementation yet.

--------------------------------------------

# AI

Prepare AI service architecture.

Create

/services/ai/

Gemini Service

Prompt Builder

Response Parser

Do NOT implement prompts yet.

--------------------------------------------

# DATABASE

Prepare Firestore architecture.

Collections

projects

admins

settings

logs

Do not implement CRUD yet.

--------------------------------------------

# SECURITY

Admin authentication architecture.

Protected Routes.

Middleware ready.

--------------------------------------------

# PERFORMANCE

Use

Lazy Loading

Dynamic Import

Image Optimization

Code Splitting

Memoization when needed

--------------------------------------------

# ACCESSIBILITY

Keyboard Navigation

ARIA Labels

Color Contrast

Focus Ring

Semantic HTML

--------------------------------------------

# SEO

Prepare metadata architecture.

--------------------------------------------

# OUTPUT

Generate:

1. Complete folder structure

2. Dependency list

3. Installation commands

4. Firebase setup instructions

5. Project architecture

6. Type definitions

7. Config files

8. Tailwind setup

9. Shadcn setup

10. Reusable utility structure

11. Global layout

12. Best practices

13. README

14. All code should be production-ready.

IMPORTANT

Do NOT build any pages yet.

Do NOT create the Landing Page.

Do NOT create the Wizard.

Do NOT create the Admin Dashboard.

This prompt ONLY builds the project foundation.

Everything should be ready for the next prompts.
🔥 Sedikit revisi dari gue (CTO mode)

Ada 2 hal yang sengaja gue ubah dari ide awal karena menurut gue akan menghemat banyak waktu nanti.

1. Tambahkan services/

Jangan semua logic di lib/.

Lebih rapi kalau seperti ini:

services/
   firebase/
   ai/
   upload/
   project/
2. Pisahkan features/

Daripada semua page bercampur.

Contoh:

features/
   landing/
   wizard/
   admin/
   auth/
   project/

Jadi kalau nanti project makin besar, maintenance jauh lebih mudah.
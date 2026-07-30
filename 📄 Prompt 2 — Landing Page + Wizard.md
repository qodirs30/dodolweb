# ROLE

You are a Principal Product Designer, Senior Frontend Engineer, UX Researcher, and Conversion Rate Optimization Specialist.

Continue the existing project from Prompt 01.

Do NOT recreate the project.

Use the existing architecture.

Build ONLY:

1. Landing Page
2. Client Brief Wizard

Everything must be production-ready.

--------------------------------------------

# OBJECTIVE

This page replaces WhatsApp conversations.

The client should feel guided step-by-step instead of filling out a boring form.

The experience should feel like:

• Apple onboarding
• Stripe onboarding
• Typeform
• Framer
• Linear

Simple.

Elegant.

Premium.

Comfortable.

Fast.

--------------------------------------------

# PAGE

Route

/

Landing Page

--------------------------------------------

# NAVBAR

Left

Agency Logo

Center

Nothing

Right

Start Brief Button

Sticky

Glassmorphism

Blur background

Thin border

Minimal

--------------------------------------------

# HERO

Headline

Website Project Brief

Subheadline

Help us understand your business and project goals.

The more complete your answers are, the better solution we can build.

Estimated time

10–15 Minutes

Primary CTA

Start Project Brief

Secondary CTA

How It Works

--------------------------------------------

# HOW IT WORKS

3 cards

01

Fill Project Brief

02

AI analyzes your project

03

Agency reviews and contacts you

Simple timeline

--------------------------------------------

# BENEFITS

Use icon cards

No long paragraphs

Examples

✓ Save time

✓ Better project estimation

✓ Less misunderstanding

✓ Faster proposal

✓ Organized files

--------------------------------------------

# FAQ

Accordion

5–8 questions

--------------------------------------------

# FOOTER

Simple

Copyright

Privacy

Contact

--------------------------------------------

# START BUTTON

Navigate

/start

--------------------------------------------

# WIZARD

Route

/start

--------------------------------------------

# EXPERIENCE

Never show a giant form.

Build a beautiful multi-step wizard.

Every step must feel lightweight.

Use Framer Motion transitions.

Smooth animation.

--------------------------------------------

# HEADER

Logo

Progress

Save Status

--------------------------------------------

Example

Step 3 of 9

38%

About 8 minutes remaining

--------------------------------------------

# FOOTER

Back

Next

Save Draft

--------------------------------------------

# AUTO SAVE

Every field change

Automatically save to Local Storage.

If browser closes

Restore progress.

--------------------------------------------

# STEP 1

Welcome

Friendly introduction

Explain

Why this brief matters.

Button

Let's Start

--------------------------------------------

# STEP 2

Business Information

Fields

Business Name

Business Category

Business Description

Years in Business

Website

Instagram

Facebook

TikTok

WhatsApp

Email

Location

Company Size

Question Type

Text

Textarea

Select

All select inputs must have

Other

When user chooses Other

Show custom text input.

--------------------------------------------

# STEP 3

Project Goal

Website Type

Cards

Company Profile

Landing Page

E-Commerce

Portfolio

Web Application

Booking

Custom

Other

Each card contains

Icon

Title

Short description

Selection animation.

Conditional logic starts here.

--------------------------------------------

# CONDITIONAL LOGIC

If

Company Profile

Hide e-commerce questions.

If

Landing Page

Hide admin questions.

If

Booking

Show booking questions.

If

Web App

Show user management questions.

If

Other

Show custom input.

--------------------------------------------

# STEP 4

Target Audience

Age

Location

Industry

Customer Type

Problem solved

Unique Selling Point

Competitors

Reference Websites

Every select

Supports Other.

--------------------------------------------

# STEP 5

Branding

Do you already have

Logo

Brand Guideline

Color Palette

Typography

Photos

Videos

Each answer

Yes

No

If Yes

Show Upload component.

If No

Hide upload.

--------------------------------------------

# STEP 6

Features

Beautiful card grid.

Examples

Contact Form

WhatsApp

Blog

CMS

Authentication

Payment Gateway

Gallery

Maps

Newsletter

Booking

Multi Language

Live Chat

Analytics

Search

Dashboard

Membership

AI Feature

Other

Support multiple selection.

Other

Show custom input.

--------------------------------------------

# STEP 7

Design Preferences

Preferred Style

Card Selection

Minimal

Luxury

Corporate

Technology

Dark

Playful

Elegant

Modern

Classic

Other

Preferred Colors

Multiple

Reference Websites

Mood

Animations

Illustrations

Icons

--------------------------------------------

# STEP 8

Project Details

Deadline

Budget Range

Already Own Domain

Already Own Hosting

Need Copywriting

Need SEO

Need Logo

Need Photography

Need Maintenance

Need CMS

Need Training

Other

--------------------------------------------

# STEP 9

Upload Files

Beautiful Dropzone

Drag and Drop

Accept

PNG

JPG

JPEG

WEBP

PDF

DOCX

ZIP

SVG

AI

PSD

CDR

Maximum

50 MB

Multiple Files

Preview

Remove File

--------------------------------------------

# STEP 10

Review

Display all answers.

Grouped by section.

User can edit previous steps.

--------------------------------------------

# FINAL

Submit Button

Loading animation.

Do NOT submit yet.

Backend comes later.

--------------------------------------------

# COMPONENTS

Create reusable components.

Wizard

Wizard Step

Progress

Question Card

Card Selector

Upload Area

Section Header

Step Header

Step Footer

Empty State

--------------------------------------------

# VALIDATION

React Hook Form

Zod

Validate every step.

Cannot continue if required fields are missing.

--------------------------------------------

# UX

Large spacing.

Readable typography.

No overwhelming pages.

One clear action per screen.

--------------------------------------------

# MOBILE

Must work perfectly.

Card selection should become carousel if needed.

Sticky bottom navigation.

--------------------------------------------

# ACCESSIBILITY

Keyboard navigation.

Screen reader labels.

Focus management.

--------------------------------------------

# ANIMATION

Framer Motion

Fade

Slide

Scale

Never overuse animation.

--------------------------------------------

# DESIGN QUALITY

Think like Apple.

Think like Linear.

Think like Framer.

Everything must feel premium.

--------------------------------------------

# OUTPUT

Generate complete production-ready code for:

Landing Page

Wizard

Reusable Components

Hooks

Validation

Local Storage Autosave

Progress System

Conditional Question Engine

Responsive UI

Do NOT build Firebase integration yet.

Do NOT build Admin Dashboard.

Do NOT build AI.

Those will come in the next prompts.
🔥 Sekarang gue kasih revisi sebagai CTO

Ini bagian yang gue rasa jauh lebih penting daripada codingnya sendiri.

❌ Jangan pakai "Step 1, Step 2"

Bikin section yang manusiawi.

Misalnya:

👋 Welcome

↓

🏢 Business

↓

🎯 Goals

↓

👥 Audience

↓

🎨 Branding

↓

⚙ Features

↓

✨ Design

↓

📁 Assets

↓

✅ Review

UX jauh lebih enak.

Jangan tulis "38%"

Lebih bagus:

━━━━━━━━━━━━━━━

Business Information

About 10 minutes remaining

━━━━━━━━━━━━━━━

Lebih natural.

Wizard jangan terasa seperti Google Form

Misalnya pilih jenis website.

Jangan radio button.

Bikin card seperti ini.

┌────────────────────┐

🏢

Company Profile

Professional business website

└────────────────────┘

Saat dipilih

Border berubah.

Ada animasi.

Scale 1.02

Shadow naik sedikit.

Jangan gunakan Select kalau bisa Card

Misalnya

Target Website

Lebih bagus card.

🏢 Company Profile

🛒 E-Commerce

🚀 Landing Page

📱 Web App

Daripada dropdown.

⭐ Tambahan fitur yang menurut gue wajib (belum ada di prompt)

Tambahkan instruksi ini ke Prompt 02.

# MICRO UX

The application must reduce user fatigue.

Whenever possible:

- Replace dropdowns with visual cards.
- Replace radio buttons with selectable cards.
- Use icons beside every important option.
- Show helpful descriptions under every option.
- Keep one primary action per screen.
- Break long sections into smaller chunks if necessary.
- Show encouraging messages between sections.
- Never overwhelm users with too many questions at once.

If a question is optional, clearly indicate it.

Always allow users to skip optional questions.

The experience should feel conversational rather than administrative.
⭐ Tambahan fitur kedua (favorit gue)

Ini yang menurut gue bakal bikin aplikasi lo beda dari Typeform.

# SMART FOLLOW-UP QUESTIONS

Support dynamic follow-up questions.

Example:

If user selects:

Company Profile

Show relevant business questions.

If user selects:

Restaurant

Ask:

Do you have menu?

Do you accept reservations?

Need Google Maps?

Need online ordering?

Need WhatsApp ordering?

Need gallery?

Need QR Menu?

All follow-up questions must be configurable and data-driven.

Do not hardcode business logic.

Build a rule engine that reads question conditions from configuration files.
🚨 Nah ini yang menurut gue keputusan paling penting

Di prompt tadi gue sengaja menyuruh AI membuat Rule Engine, bukan sekadar Conditional Rendering.

Artinya, kalau 6 bulan lagi lo mau nambah jenis brief baru (misalnya brief logo, branding, aplikasi mobile, atau SEO), lo cukup menambah konfigurasi pertanyaan, bukan mengubah kode React di banyak tempat.
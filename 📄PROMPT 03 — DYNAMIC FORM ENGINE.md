# ROLE

You are a Principal Software Architect.

Continue the existing project.

Do NOT rebuild previous prompts.

Use the existing architecture.

Your task is ONLY to build the Dynamic Form Engine.

Everything must be scalable.

Everything must be configuration-driven.

Never hardcode questions inside React components.

--------------------------------------------

# OBJECTIVE

The Wizard must render itself from configuration files.

Developers should be able to add new questions without touching UI components.

Future changes should only require editing configuration files.

--------------------------------------------

# ARCHITECTURE

Create a Dynamic Form Engine.

The UI reads question configuration.

Never hardcode fields.

--------------------------------------------

# FOLDER STRUCTURE

features/

    wizard/

        configs/

            company-profile.ts

            landing-page.ts

            ecommerce.ts

            booking.ts

            web-app.ts

        engine/

        hooks/

        components/

        utils/

--------------------------------------------

# QUESTION MODEL

Every question must have

id

type

title

description

placeholder

required

validation

step

section

options

condition

defaultValue

helpText

hint

icon

width

order

metadata

--------------------------------------------

# QUESTION TYPES

Support

text

textarea

email

phone

url

number

currency

date

time

select

multiselect

checkbox

radio

switch

card-selector

color-picker

file-upload

image-upload

rating

slider

tags

repeater

section

divider

heading

paragraph

--------------------------------------------

# OPTION MODEL

Every option

label

value

icon

description

color

followUpQuestions

--------------------------------------------

# OTHER OPTION

Every select

Every radio

Every card

Must support

Other

When selected

Automatically render

Custom text input.

No additional coding required.

--------------------------------------------

# CONDITION ENGINE

Support conditions.

Examples

websiteType == company-profile

websiteType == ecommerce

hasLogo == true

needCMS == true

budget > 5000000

country == Indonesia

Multiple AND conditions

Multiple OR conditions

Nested conditions

--------------------------------------------

# RULE ENGINE

Create a Rule Engine.

Question visibility must be controlled by rules.

NOT React components.

--------------------------------------------

# VALIDATION

Every field

Supports

Required

Minimum

Maximum

Regex

Email

Phone

URL

Custom validator

Conditional validator

--------------------------------------------

# DEFAULT VALUES

Every question

Supports default value.

--------------------------------------------

# REPEATABLE GROUPS

Support repeating sections.

Example

Team Members

Add Member

Name

Position

Photo

Repeat infinitely.

--------------------------------------------

# FILE QUESTIONS

Support

Single File

Multiple Files

Allowed Types

Maximum File Size

Maximum File Count

Preview

Remove

Replace

--------------------------------------------

# PROGRESS ENGINE

Calculate progress automatically.

Do NOT hardcode.

Completed Questions

Visible Questions

Hidden Questions

Skipped Questions

Progress %

Estimated Time Remaining

--------------------------------------------

# AUTOSAVE

Build Autosave Engine.

Save

Current Step

Current Answers

Timestamp

Draft ID

Version

Restore automatically.

--------------------------------------------

# STORAGE

Prepare abstraction.

Current implementation

Local Storage

Future implementation

Firestore

Should require zero UI changes.

--------------------------------------------

# FORM STATE

Use React Hook Form.

Never create duplicated state.

--------------------------------------------

# CONFIG DRIVEN

Every wizard must be generated from config.

Never manually create JSX for questions.

--------------------------------------------

# COMPONENT FACTORY

Create QuestionRenderer.

It receives

Question

Value

Errors

State

It decides which component to render.

--------------------------------------------

# SUPPORTED COMPONENTS

TextInput

Textarea

Number

Currency

Date

Select

Card Selector

Upload

Color Picker

Switch

Checkbox

Tags

Rating

Slider

--------------------------------------------

# SECTION ENGINE

Render

Heading

Description

Divider

Help Text

Automatically.

--------------------------------------------

# SEARCHABLE SELECT

Support searching.

--------------------------------------------

# CARD SELECTOR

Premium UI.

Animation.

Hover.

Selected state.

Icon.

Description.

--------------------------------------------

# CONDITIONAL FOLLOW-UP

Example

Restaurant

↓

Need Reservation?

↓

Need QR Menu?

↓

Need Delivery?

Everything driven by configuration.

--------------------------------------------

# STEP ENGINE

Generate steps automatically.

Do NOT hardcode.

--------------------------------------------

# NAVIGATION

Previous

Next

Skip

Jump

Review

Everything generated dynamically.

--------------------------------------------

# REVIEW PAGE

Automatically group answers.

Display by section.

Support edit.

--------------------------------------------

# TYPESCRIPT

Strong typing.

No any.

--------------------------------------------

# PERFORMANCE

Memoization.

Lazy Rendering.

Virtualization if needed.

Avoid unnecessary re-render.

--------------------------------------------

# ERROR HANDLING

Graceful fallback.

Unknown question type.

Invalid config.

Broken condition.

--------------------------------------------

# DEVELOPER EXPERIENCE

Create helper functions.

createQuestion()

createSection()

createOption()

evaluateCondition()

calculateProgress()

estimateTime()

--------------------------------------------

# TESTABILITY

Architecture must be unit-test friendly.

--------------------------------------------

# OUTPUT

Generate:

Dynamic Form Engine

Rule Engine

Condition Engine

Question Renderer

Config System

Progress Engine

Autosave Engine

Type Definitions

Utilities

Hooks

Reusable Components

Everything production-ready.

Do NOT connect Firebase yet.

Do NOT build Admin Dashboard.

Do NOT build AI integration.

Only build the Dynamic Form Engine.
🔥 Sekarang gue kasih revisi (ini menurut gue yang bikin aplikasi lo naik level)
1. Jangan pakai JSON

Gue ubah keputusan kita.

Awalnya gue bilang JSON.

Sekarang menurut gue lebih bagus pakai:

company-profile.ts

Contoh:

export const companyProfileQuestions = [
  createQuestion({
    id: "business_name",
    type: "text",
    title: "Business Name",
    required: true,
  }),
];

Kenapa?

Karena:

autocomplete
type-safe
gampang refactor
tidak typo
bisa import icon
bisa pakai function
lebih enak di Codex

Daripada:

{
  "id":"business_name"
}
2. Tambahkan Layout Engine

Supaya pertanyaan tidak selalu satu kolom.

Tambahkan ini ke prompt:

# LAYOUT ENGINE

Support

1 Column

2 Columns

3 Columns

Full Width

Responsive Grid

Questions should define their layout size.

Example

full

half

third

quarter

The renderer should automatically build the layout.
3. Tambahkan Wizard Analytics

Ini favorit gue.

Tambahkan:

# WIZARD ANALYTICS

Track

Current Step

Time per Step

Skipped Questions

Completion %

Draft Saved

Resume Count

Abandon Step

This data will be useful for future optimization.

Walaupun sekarang cuma dipakai internal, nanti lo bisa tahu:

"Kenapa banyak client berhenti di Branding?"

Mungkin pertanyaannya terlalu banyak.

4. Tambahkan Schema Version

Ini sangat penting.

Misalnya nanti lo ubah pertanyaan.

Draft lama jangan rusak.

Tambahkan:

# SCHEMA VERSION

Every form configuration must contain

schemaVersion

When schema changes

Old drafts should still be readable.

Create migration-ready architecture.
⭐ Menurut gue ini keputusan terbaik di seluruh project

Jangan anggap aplikasi ini sebagai "form builder".

Anggap ini sebagai Question Engine.

Artinya nanti lo bisa bikin:

Website Brief
Logo Brief
Branding Brief
UI/UX Brief
Mobile App Brief
SEO Brief
Social Media Brief

Tanpa membuat ulang aplikasi.

Cukup buat file konfigurasi baru seperti:

configs/
  website-company-profile.ts
  website-ecommerce.ts
  logo-design.ts
  branding.ts
  mobile-app.ts
  seo.ts

Lalu engine yang sama akan merender semuanya secara otomatis.
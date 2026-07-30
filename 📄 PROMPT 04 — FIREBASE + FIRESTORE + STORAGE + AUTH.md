# ROLE

You are a Google Firebase Architect, Senior Backend Engineer, Firestore Database Expert, Security Engineer, and Next.js Full Stack Developer.

Continue the project from Prompt 01, Prompt 02, and Prompt 03.

DO NOT rebuild previous work.

Only implement Firebase architecture and backend integration.

Everything must be production-ready.

--------------------------------------------
PROJECT
--------------------------------------------

Project Name

Website Project Brief

This project is NOT SaaS.

Only one agency uses it.

One admin account.

Many public clients.

--------------------------------------------
TECH STACK
--------------------------------------------

Use

Firebase Authentication

Firestore

Firebase Storage

Firebase Security Rules

Firebase Emulator Support

Next.js 15

TypeScript

--------------------------------------------
AUTHENTICATION
--------------------------------------------

Only Admin can login.

Clients DO NOT login.

Prepare

Firebase Authentication

Email Password

Session Persistence

Logout

Protected Routes

Middleware

Auth Provider

Auth Context

useAuth()

--------------------------------------------
ADMIN
--------------------------------------------

Only authenticated admin can access

/admin

/admin/projects

/admin/settings

Everything else is public.

--------------------------------------------
FIREBASE STRUCTURE
--------------------------------------------

Create

firebase/

config.ts

auth.ts

firestore.ts

storage.ts

collections.ts

types.ts

rules.md

--------------------------------------------
ENV
--------------------------------------------

Support

NEXT_PUBLIC_FIREBASE_API_KEY

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

NEXT_PUBLIC_FIREBASE_PROJECT_ID

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

NEXT_PUBLIC_FIREBASE_APP_ID

Never hardcode credentials.

--------------------------------------------
COLLECTIONS
--------------------------------------------

admins

projects

system

--------------------------------------------
ADMINS
--------------------------------------------

Document ID

Firebase UID

Fields

name

email

photo

role

createdAt

updatedAt

lastLogin

--------------------------------------------
PROJECTS
--------------------------------------------

Every submission creates ONE project.

Fields

projectId

status

draft

client

business

project

branding

features

design

uploads

answers

summary

createdAt

updatedAt

submittedAt

completedAt

schemaVersion

--------------------------------------------
STATUS
--------------------------------------------

Allowed values

draft

submitted

review

quotation

approved

development

revision

completed

cancelled

--------------------------------------------
CLIENT OBJECT
--------------------------------------------

name

email

phone

whatsapp

company

position

--------------------------------------------
BUSINESS OBJECT
--------------------------------------------

category

industry

location

website

instagram

facebook

tiktok

description

--------------------------------------------
PROJECT OBJECT
--------------------------------------------

websiteType

goal

deadline

budget

targetAudience

competitors

references

--------------------------------------------
BRANDING OBJECT
--------------------------------------------

logo

brandGuide

colors

fonts

photos

videos

--------------------------------------------
FEATURES OBJECT
--------------------------------------------

selected

custom

--------------------------------------------
DESIGN OBJECT
--------------------------------------------

style

references

animations

preferences

--------------------------------------------
UPLOADS
--------------------------------------------

Store only metadata.

Never store files inside Firestore.

Store

fileName

storagePath

downloadURL

size

mimeType

uploadedAt

--------------------------------------------
ANSWERS
--------------------------------------------

Save every answer.

Dynamic object.

Compatible with Dynamic Form Engine.

--------------------------------------------
SUBCOLLECTIONS
--------------------------------------------

Each Project

notes

history

ai

--------------------------------------------
NOTES
--------------------------------------------

Internal only.

Admin Notes.

createdBy

message

createdAt

--------------------------------------------
HISTORY
--------------------------------------------

Every important action.

Example

Project Created

Project Updated

Status Changed

AI Generated

File Uploaded

--------------------------------------------
AI
--------------------------------------------

Save

summary

projectScore

estimatedComplexity

recommendedPages

recommendedFeatures

missingInformation

followUpQuestions

timelineSuggestion

riskAnalysis

generatedAt

model

--------------------------------------------
SYSTEM
--------------------------------------------

One document

settings

Fields

agencyName

logo

email

phone

whatsapp

address

timezone

geminiModel

schemaVersion

--------------------------------------------
FIRESTORE INDEXES
--------------------------------------------

Prepare indexes for

status

createdAt

client.name

client.email

project.websiteType

--------------------------------------------
STORAGE
--------------------------------------------

Create folders

logos/

projects/

photos/

documents/

brand-guides/

temp/

--------------------------------------------
FILE PATH
--------------------------------------------

Example

projects/{projectId}/logo/logo.png

projects/{projectId}/photos/

projects/{projectId}/documents/

Everything organized by projectId.

--------------------------------------------
UPLOAD SERVICE
--------------------------------------------

Create reusable upload service.

Functions

uploadFile()

deleteFile()

replaceFile()

getDownloadURL()

validateFile()

--------------------------------------------
FILE VALIDATION
--------------------------------------------

Support

PNG

JPG

JPEG

WEBP

SVG

PDF

DOCX

ZIP

AI

PSD

CDR

Maximum

50MB

--------------------------------------------
SECURITY RULES
--------------------------------------------

Public

Can Create Project

Cannot Read Project

Cannot Update Submitted Project

Cannot Delete

Admin

Full Access

Storage Rules

Public Upload

Only inside project folder

Admin can delete

--------------------------------------------
SERVICE LAYER
--------------------------------------------

Create

ProjectService

StorageService

AuthService

FirestoreService

Everything reusable.

--------------------------------------------
HELPERS
--------------------------------------------

generateProjectId()

formatTimestamp()

createHistory()

createNote()

--------------------------------------------
ERROR HANDLING
--------------------------------------------

Graceful

Retry upload

Network error

Permission denied

Validation error

--------------------------------------------
LOADING
--------------------------------------------

Global loading states.

Upload progress.

Optimistic UI.

--------------------------------------------
TYPESCRIPT
--------------------------------------------

Strict typing.

No any.

--------------------------------------------
OUTPUT
--------------------------------------------

Generate

Firebase Configuration

Authentication

Firestore Collections

Storage Service

Security Rules

Types

Services

Hooks

Utilities

Indexes

Folder Structure

Everything production-ready.

Do NOT build Admin UI.

Do NOT build AI integration.

Do NOT create Dashboard.

Only Firebase architecture and backend integration.
🔥 Sekarang revisi dari gue (ini jangan dihapus)

Menurut gue AI banyak coding assistant sering salah mendesain Firestore.

Mereka suka bikin seperti ini:

projects
    answers
    uploads
    ai
    notes

Semuanya jadi field.

Padahal nanti ukuran document bisa cepat membengkak.

Yang menurut gue lebih bagus
projects
   projectId

      notes
      history
      ai

Dan untuk uploads, kalau file nanti bisa banyak (misalnya puluhan foto produk), lebih baik juga dijadikan subcollection:

projects
   projectId
      uploads

Daripada array panjang di satu document.

Jadi revisi kecil yang gue sarankan untuk prompt di atas:

SUBCOLLECTIONS

projects/{projectId}

notes

history

ai

uploads

Lalu metadata upload (fileName, storagePath, mimeType, dsb.) disimpan di subcollection uploads, sedangkan file fisiknya tetap berada di Firebase Storage.

⭐ Satu revisi terakhir (paling penting menurut gue)

Jangan gunakan ID Firestore random sebagai identitas proyek yang dilihat admin.

Buat dua ID:

1. Firestore Document ID

qA7dP0x9Lm...

(digunakan internal oleh Firestore)

2. Human Project ID

Misalnya:

WPB-20260730-0001

atau

WPB-000001

Yang muncul di dashboard, PDF, pencarian, dan komunikasi dengan client.

Ini jauh lebih profesional daripada menyebut:

"Mas, project dengan ID 8HnQa7LmP2x... ya."
# ROLE

You are a Senior Full Stack Engineer, Firebase Storage Architect, Cloud Storage Specialist, and UX Engineer.

Continue the existing project.

Do NOT rebuild previous prompts.

Implement ONLY the complete File Management System.

Everything must be production-ready.

--------------------------------------------
PROJECT
--------------------------------------------

Website Project Brief

Internal Agency Tool

One Admin

Public Client

--------------------------------------------
OBJECTIVE
--------------------------------------------

Build a premium upload experience.

The upload experience should feel similar to:

Google Drive

Dropbox

Notion

Framer

Linear

Everything should feel modern.

--------------------------------------------
FIREBASE STORAGE
--------------------------------------------

Use Firebase Storage.

Never store binary files inside Firestore.

Firestore only stores metadata.

--------------------------------------------
STORAGE STRUCTURE
--------------------------------------------

Organize every upload by project.

Example

projects/

    {projectId}/

        logo/

        brand-guideline/

        photos/

        products/

        documents/

        references/

        videos/

        assets/

        temp/

Never upload files directly into root.

--------------------------------------------
UPLOAD ARCHITECTURE
--------------------------------------------

Create

StorageService

UploadService

FileValidator

ImageCompressor

ThumbnailGenerator (prepare interface only)

PreviewGenerator

FileMapper

--------------------------------------------
SUPPORTED FILES
--------------------------------------------

Images

PNG

JPG

JPEG

WEBP

SVG

GIF

Documents

PDF

DOC

DOCX

XLSX

PPTX

ZIP

RAR

AI

PSD

CDR

FIG

TXT

MP4

MOV

Maximum

50 MB

--------------------------------------------
FILE METADATA
--------------------------------------------

Every uploaded file stores

id

projectId

category

originalName

displayName

extension

mimeType

size

storagePath

downloadURL

uploadedBy

uploadedAt

updatedAt

checksum

isImage

width

height

status

version

--------------------------------------------
UPLOAD CATEGORIES
--------------------------------------------

logo

brand-guide

business-photo

product-photo

team-photo

banner

document

reference

video

other

--------------------------------------------
FILE NAMING
--------------------------------------------

Automatically sanitize file names.

Remove spaces.

Remove special characters.

Prevent duplicate names.

Example

logo-final.png

↓

logo-final-2.png

--------------------------------------------
UPLOAD EXPERIENCE
--------------------------------------------

Support

Drag and Drop

Browse

Paste Image

Multiple Files

Replace File

Remove File

Cancel Upload

Retry Upload

Pause Upload (architecture ready)

Resume Upload (architecture ready)

--------------------------------------------
UPLOAD UI
--------------------------------------------

Modern Dropzone.

Large upload area.

Animated border.

Hover state.

Drag state.

Success state.

Error state.

Empty state.

--------------------------------------------
PROGRESS
--------------------------------------------

Show upload progress.

Example

Uploading...

72%

Support multiple uploads.

--------------------------------------------
IMAGE PREVIEW
--------------------------------------------

Preview immediately.

Before upload.

After upload.

Support

Zoom

Remove

Replace

Open Fullscreen

--------------------------------------------
DOCUMENT PREVIEW
--------------------------------------------

Display

File Icon

Extension

Size

Filename

Uploaded Time

--------------------------------------------
IMAGE OPTIMIZATION
--------------------------------------------

Before upload

Compress large images.

Keep quality high.

Never compress PNG logos aggressively.

--------------------------------------------
VALIDATION
--------------------------------------------

Reject unsupported files.

Reject oversized files.

Display friendly errors.

--------------------------------------------
ERROR MESSAGES
--------------------------------------------

Example

Unsupported format

File too large

Upload failed

Connection lost

Retry available

--------------------------------------------
UPLOAD QUEUE
--------------------------------------------

Support queue.

Example

5 files selected

Upload sequentially.

Prepare architecture for parallel uploads.

--------------------------------------------
FILE VERSIONING
--------------------------------------------

Support replacing files.

Old metadata remains archived.

Latest version becomes active.

--------------------------------------------
DELETE
--------------------------------------------

Soft Delete

Mark

deleted=true

Delete Storage file only after confirmation.

--------------------------------------------
RESTORE
--------------------------------------------

Support restoring deleted metadata.

--------------------------------------------
FIRESTORE
--------------------------------------------

Store metadata only.

Collection

projects/{projectId}/uploads

--------------------------------------------
SEARCH
--------------------------------------------

Search uploaded files.

By

filename

category

extension

--------------------------------------------
FILTER
--------------------------------------------

Images

Documents

Videos

Brand Assets

Recently Uploaded

--------------------------------------------
SORT
--------------------------------------------

Newest

Oldest

Largest

Smallest

Alphabetical

--------------------------------------------
HELPERS
--------------------------------------------

createStoragePath()

validateExtension()

validateFileSize()

generateChecksum()

formatBytes()

formatUploadDate()

--------------------------------------------
SECURITY
--------------------------------------------

Never trust client file name.

Validate everything.

Never expose storage internals.

--------------------------------------------
FIREBASE STORAGE RULES
--------------------------------------------

Public

Can upload during project submission.

Cannot browse Storage.

Cannot list folders.

Cannot delete.

Admin

Full access.

--------------------------------------------
PERFORMANCE
--------------------------------------------

Lazy load previews.

Generate object URLs.

Release object URLs when unused.

Avoid memory leaks.

--------------------------------------------
RESPONSIVE
--------------------------------------------

Desktop

Tablet

Mobile

--------------------------------------------
ACCESSIBILITY
--------------------------------------------

Keyboard upload.

Focus states.

Screen reader labels.

--------------------------------------------
OUTPUT
--------------------------------------------

Generate

StorageService

UploadService

Upload Components

Dropzone

Preview Components

Validators

Types

Hooks

Utilities

Firebase Storage Integration

Security Rules

Everything production-ready.

Do NOT build Admin Dashboard.

Do NOT build AI.

Only implement complete file upload architecture.
🔥 SEKARANG REVISI CTO (WAJIB DITAMBAHKAN)

Menurut gue ada beberapa hal yang hampir semua AI coding assistant lupa.

1. JANGAN SIMPAN downloadURL

Ini revisi paling penting.

Banyak AI akan menyimpan:

downloadURL

di Firestore.

Menurut gue jangan.

Kenapa?

Karena kalau nanti token Firebase berubah atau file di-replace, URL bisa berubah.

Lebih baik simpan:

storagePath

projects/WPB-0001/logo/logo.png

Kalau butuh URL:

getDownloadURL(storageRef)

Generate saat dibutuhkan.

Jadi tambahkan ini ke prompt:

Never permanently store downloadURL inside Firestore.

Store only

storagePath

Generate downloadURL dynamically when requested.
2. Tambahkan IMAGE TRANSFORM

Kalau client upload:

logo.png

5000 x 5000

Frontend jangan langsung render.

Bikin service:

ImageService

↓

Resize

↓

Compress

↓

Preview
3. Tambahkan THUMBNAIL

Untuk dashboard nanti.

Misalnya

Client upload

30 foto.

Dashboard jangan load semuanya.

Tambahkan.

Thumbnail Architecture

Prepare support for thumbnail generation.

Current version

Client-side preview.

Future version

Cloud Function thumbnail generation.
4. Tambahkan FILE TAG

Misalnya.

Logo

bisa diberi tag.

Brand

Primary


atau

Reference

Homepage


Nanti admin lebih gampang mencari.

5. Upload Session

Ini favorit gue.

Misalnya internet putus.

Kalau upload 40 file.

Begitu refresh.

Upload bisa dilanjutkan.

Tambahkan.

Prepare Upload Session architecture.

Track

Pending

Uploading

Failed

Completed

Cancelled
⭐ REVISI TERAKHIR (PALING PENTING)

Menurut gue jangan anggap upload sebagai komponen.

Anggap upload sebagai Asset Manager.

Artinya nanti sistem yang sama bisa dipakai untuk:

Logo
Project Brief
Invoice
Proposal
Screenshot
Video Demo
Source Code
File Revisi
Dokumen Serah Terima

Tanpa mengubah arsitektur upload.
# ROLE

You are a Principal AI Engineer, Senior Product Manager, Business Analyst, Solution Architect, UX Consultant, Technical Writer, and Google Gemini API Expert.

Continue the existing project.

DO NOT recreate previous prompts.

Extend the architecture from Prompt 01–06.

Implement ONLY the AI Project Manager module.

Everything must be production-ready.

--------------------------------------------------
GLOBAL RULES
--------------------------------------------------

Never rewrite existing architecture.

Never rename folders.

Never duplicate services.

Always reuse existing ProjectService.

Always use TypeScript strict mode.

Never use "any".

Never hardcode AI responses.

Always parse structured JSON responses.

Never trust AI output.

Always validate responses.

Always implement graceful fallback.

--------------------------------------------------
PROJECT
--------------------------------------------------

Website Project Brief

Internal Agency Tool

One Admin

Many Public Clients

Gemini API running on Vercel.

--------------------------------------------------
OBJECTIVE
--------------------------------------------------

Build an AI Project Manager.

This AI should NOT behave like a chatbot.

This AI behaves like

Senior Project Manager

Business Analyst

UX Consultant

Technical Consultant

Solution Architect

Estimator

Copywriter

The AI analyzes every submitted project.

--------------------------------------------------
FOLDER STRUCTURE
--------------------------------------------------

services/

    ai/

        GeminiService.ts

        PromptBuilder.ts

        JsonParser.ts

        Validators.ts

        RetryService.ts

        AIMapper.ts

        AIErrorHandler.ts

        AIResultCache.ts

types/

    ai.ts

schemas/

    ai-response.ts

--------------------------------------------------
API
--------------------------------------------------

Use

Google Gemini API

API Key

Environment Variable

GEMINI_API_KEY

Never hardcode.

--------------------------------------------------
AI WORKFLOW
--------------------------------------------------

Client submits brief

↓

Project saved

↓

Gemini analyzes project

↓

Gemini returns JSON

↓

Validate JSON

↓

Save into Firestore

↓

Display in Admin Dashboard

--------------------------------------------------
PROMPT STRATEGY
--------------------------------------------------

Use System Prompt.

Use Developer Prompt.

Use User Prompt.

Never concatenate huge strings.

PromptBuilder must generate prompts dynamically.

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

Gemini MUST return JSON ONLY.

Never allow markdown.

Never allow explanations.

Never allow free text outside JSON.

--------------------------------------------------
JSON SCHEMA
--------------------------------------------------

Return

summary

businessOverview

websiteGoal

targetAudience

projectReadiness

complexity

estimatedDuration

estimatedDifficulty

recommendedPages

recommendedFeatures

recommendedIntegrations

recommendedTechStack

recommendedCMS

recommendedSEO

contentChecklist

assetChecklist

missingInformation

followUpQuestions

riskAnalysis

developerNotes

clientExpectation

estimatedPriceRange

priority

confidence

--------------------------------------------------
PROJECT READINESS
--------------------------------------------------

Score

0–100

Status

Ready

Almost Ready

Need Follow Up

Incomplete

--------------------------------------------------
PROJECT COMPLEXITY
--------------------------------------------------

Easy

Medium

Complex

Enterprise

--------------------------------------------------
PRIORITY
--------------------------------------------------

Low

Medium

High

Urgent

--------------------------------------------------
CONFIDENCE
--------------------------------------------------

0–100

--------------------------------------------------
RECOMMENDED PAGES
--------------------------------------------------

Examples

Home

About

Services

Portfolio

Gallery

FAQ

Contact

Career

Blog

Privacy Policy

Terms

Dashboard

Login

Register

Checkout

Booking

--------------------------------------------------
RECOMMENDED FEATURES
--------------------------------------------------

Examples

Contact Form

WhatsApp

CMS

Maps

Analytics

Newsletter

Live Chat

Payment Gateway

Authentication

Search

Wishlist

Booking

Blog

Role Permission

Admin Panel

Multi Language

Dark Mode

--------------------------------------------------
RECOMMENDED INTEGRATIONS
--------------------------------------------------

Examples

Google Analytics

Google Maps

Meta Pixel

Midtrans

WhatsApp

Mailchimp

Firebase

Cloudinary

--------------------------------------------------
SEO
--------------------------------------------------

Generate

Title Recommendation

Meta Description

Target Keywords

Schema Recommendation

--------------------------------------------------
CONTENT CHECKLIST
--------------------------------------------------

Generate

About Us

Vision

Mission

Services

Products

Gallery

Testimonials

FAQ

Contact

Privacy Policy

Terms

--------------------------------------------------
ASSET CHECKLIST
--------------------------------------------------

Generate

Logo

Favicon

Hero Banner

Company Photos

Product Photos

Team Photos

Videos

Brand Guideline

--------------------------------------------------
FOLLOW-UP QUESTIONS
--------------------------------------------------

Generate only missing questions.

Maximum

10

Questions.

Questions must be concise.

--------------------------------------------------
RISK ANALYSIS
--------------------------------------------------

Examples

Deadline unrealistic

Budget too low

No branding

No product photos

No content

No references

--------------------------------------------------
DEVELOPER NOTES
--------------------------------------------------

Generate notes for internal developers.

Not visible to clients.

--------------------------------------------------
CLIENT EXPECTATION
--------------------------------------------------

Estimate

High

Medium

Low

Expectation Risk.

--------------------------------------------------
ESTIMATED PRICE RANGE
--------------------------------------------------

Estimate only.

Internal.

Never display to client.

--------------------------------------------------
ESTIMATED DURATION
--------------------------------------------------

Estimate

Working Days

--------------------------------------------------
PROMPT BUILDER
--------------------------------------------------

Create PromptBuilder.

Generate prompts dynamically.

Never hardcode long prompts.

Reuse templates.

--------------------------------------------------
JSON VALIDATION
--------------------------------------------------

Validate with Zod.

Reject invalid responses.

Retry automatically.

Maximum

2 retries.

--------------------------------------------------
FALLBACK
--------------------------------------------------

If Gemini fails

Retry.

If still fails

Save project without AI.

Display

AI Pending.

--------------------------------------------------
CACHE
--------------------------------------------------

Cache AI responses.

Avoid duplicate requests.

--------------------------------------------------
TOKEN MANAGEMENT
--------------------------------------------------

Optimize prompt length.

Avoid sending unnecessary fields.

--------------------------------------------------
RATE LIMIT
--------------------------------------------------

Prepare retry strategy.

Backoff

1 second

2 seconds

4 seconds

--------------------------------------------------
SECURITY
--------------------------------------------------

Never expose API key.

Never expose internal prompts.

Never expose developer notes publicly.

--------------------------------------------------
ADMIN DASHBOARD
--------------------------------------------------

Display

Project Readiness

Summary

Complexity

Priority

Estimated Duration

Recommended Pages

Recommended Features

Missing Information

Risk Analysis

Follow-up Questions

Developer Notes

--------------------------------------------------
RESPONSIVE
--------------------------------------------------

Desktop

Tablet

Mobile

--------------------------------------------------
PERFORMANCE
--------------------------------------------------

Lazy Load AI.

Generate AI only after project submission.

Never generate AI while typing.

--------------------------------------------------
OUTPUT
--------------------------------------------------

Generate

GeminiService

PromptBuilder

JSON Schema

Zod Validation

Retry System

Cache Layer

AI Mapper

Firestore Integration

Types

Hooks

Utilities

Everything production-ready.

--------------------------------------------------
DO NOT
--------------------------------------------------

Do NOT build chatbot.

Do NOT stream responses.

Do NOT return markdown.

Do NOT generate HTML.

Do NOT use free-form AI responses.

Everything must be structured JSON.
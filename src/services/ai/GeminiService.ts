import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectDocument } from '../project/ProjectService';
import { AIAnalysisResponseSchema, AIAnalysisResponse } from '@/schemas/ai-response';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Priority list of Gemini models to try in case of deprecations (404) or rate/demand spikes (503)
const MODELS_TO_TRY = ['gemini-3.6-flash', 'gemini-3.5-flash'];

// Exponential backoff sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GeminiService = {
  // Generate project analysis brief with robust fallback routing and strict JSON schema
  async generateAnalysis(project: ProjectDocument, retries = 2, delay = 1000): Promise<AIAnalysisResponse> {
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    // 1. Build the system/context prompt with the exact TypeScript interface schema
    const systemPrompt = `You are a Principal Software Architect, Enterprise Solution Architect, Senior Business Analyst, and Technical Project Manager.
Your task is to analyze the Website Project Brief submitted by a client and return a structured JSON response matching the following TypeScript interface definition exactly:

interface AIAnalysisResponse {
  summary: string; // A 2-sentence professional executive summary.
  businessOverview: string; // Detailed summary of client business model.
  websiteGoal: string; // Main goal the website aims to solve.
  targetAudience: string[]; // Identified demographic/target groups.
  projectReadiness: number; // A score from 0-100 indicating how complete client assets are (logo, guideline, description).
  complexity: 'Easy' | 'Medium' | 'Complex' | 'Enterprise';
  estimatedDuration: number; // Estimated working days (number) required to build this. Minimum 1.
  estimatedDifficulty: string; // Text explanation of complexity factors.
  recommendedPages: string[]; // List of specific page names.
  recommendedFeatures: string[]; // List of specific functional components needed.
  recommendedIntegrations: string[]; // Third party integrations (e.g. ["Midtrans", "WhatsApp API"]).
  recommendedTechStack: string[]; // Tech recommendations as a list of strings (e.g. ["Next.js", "TailwindCSS", "React", "Node.js"]).
  recommendedCMS: string; // Which CMS is best suited (e.g. Payload CMS, Strapi, Sanity, or None).
  recommendedSEO: {
    title: string; // Suggested home page title tag.
    description: string; // Suggested home meta description.
    keywords: string[]; // 5 target SEO keywords.
  };
  contentChecklist: string[]; // Key copywriting sections to draft.
  assetChecklist: string[]; // Files the client needs to supply.
  missingInformation: string[]; // Items the client forgot to specify.
  followUpQuestions: string[]; // Max 10 questions to ask the client.
  riskAnalysis: string[]; // List of technical, timeline, or budget risks.
  developerNotes: string; // Internal technical guidelines for engineers.
  clientExpectation: 'High' | 'Medium' | 'Low'; // Client price/expectations sensitivity.
  estimatedPriceRange: string; // Price estimation based on features.
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'; // Project urgency rating.
  confidence: number; // Score from 0-100 indicating your confidence in this estimation.
  prdPrompt: string; // A highly optimized, detailed developer PRD.md prompt (in Indonesian) that can be pasted into AI agents (like Claude Code, Cursor, Codex) to build the website's pages, folder structures, APIs, and Firestore database schemas.
  stylePrompt: string; // A comprehensive Style.md prompt (in Indonesian) specifying branding colors, layout tokens, Tailwind CSS setups, and glassmorphism/aesthetic instructions.
  designPrompt: string; // A comprehensive Design.md prompt (in Indonesian) specifying layout wireframes, scroll animations, section details, and design references analysis.
}

Do not output markdown code blocks.
Do not output explanations or conversational text.
Return ONLY raw JSON conforming to the specified structure.`;

    // 2. Build the client data details prompt
    const userPrompt = `Analyze this client project brief and output the conforming JSON response:

PROJECT BRIEF DATA:
Human Project ID: ${project.projectId}
Business Name: ${project.client.company}
Business Category: ${project.business.category}
Location: ${project.business.location}
Company Size: ${project.business.companySize}
Years in Business: ${project.business.yearsInBusiness || '—'}
Business Description: ${project.business.description}

WEBSITE PREFERENCES:
Type of Website: ${project.project.websiteType}
Budget Range: ${project.project.budget}
Target Deadline: ${project.project.deadline}
Target Audience (Ages): ${project.project.targetAudience?.join(', ') || 'None selected'}
Competitors: ${project.project.competitors || 'None listed'}

BRANDING:
Has Logo: ${project.branding.hasLogo}
Has Brand Guideline: ${project.branding.hasBrandGuideline}
Preferred Colors: ${project.branding.preferredColors?.join(', ') || 'None listed'}

REQUIRED FEATURES:
Selected Features: ${project.features.selected.join(', ') || 'None selected'}
Custom Features/Integrations Requested: ${project.features.custom || 'None'}

PREFERRED DESIGN STYLE:
Design Styles: ${project.design.style.join(', ')}
Design References/Websites: ${project.design.references || 'None listed'}
Animation Preference: ${project.design.animations || 'None listed'}`;

    let lastError: any = null;

    // Outer loop tries each model in order of priority
    for (const modelName of MODELS_TO_TRY) {
      console.log(`Attempting Gemini analysis with model: ${modelName}`);
      
      // Inner loop executes retries for the selected model
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
            },
          });

          const result = await model.generateContent([
            { text: systemPrompt },
            { text: userPrompt },
          ]);

          const responseText = result.response.text();
          if (!responseText) {
            throw new Error('Received empty response from Gemini API.');
          }

          // Parse and validate with Zod
          const json = JSON.parse(responseText.trim());
          const validated = AIAnalysisResponseSchema.parse(json);
          
          return validated; // Success! Return immediately
        } catch (e: any) {
          lastError = e;
          console.warn(`Gemini analysis with ${modelName} (attempt ${attempt + 1}) failed: ${e.message}`);
          
          // Switch model immediately if we get a 503 Service Unavailable / High demand spike
          if (e.message?.includes('503') || e.message?.includes('high demand') || e.message?.includes('Unavailable')) {
            console.warn(`Model ${modelName} is experiencing high demand. Aborting retries and moving to fallback model...`);
            break;
          }

          if (attempt < retries) {
            await sleep(delay * Math.pow(2, attempt)); // Exponential backoff
          }
        }
      }
    }

    throw new Error(`AI Analysis failed on all fallback models. Last error: ${lastError?.message}`);
  },

  // Call Gemini for developer mentorship chat discussion with robust fallback routing
  async askMentor(
    project: ProjectDocument,
    analysis: any,
    message: string,
    history: { role: 'user' | 'model'; parts: string }[]
  ): Promise<string> {
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    // Construct Context Prompt
    const contextPrompt = `You are a Coding Mentor and Senior Lead Developer for an agency called qRSEngine.
Your job is to mentor developers on how to code, build, and deploy the website requested by the client.

CLIENT BRIEF CONTEXT:
- Project ID: ${project.projectId}
- Client Name: ${project.client.name} (${project.client.company})
- Category: ${project.business.category}
- Description: ${project.business.description}
- Website Type: ${project.project.websiteType}
- Budget: ${project.project.budget}
- Deadline: ${project.project.deadline}
- Features: ${project.features.selected.join(', ')}
- Custom Features: ${project.features.custom || 'None'}
- Colors: ${project.branding.preferredColors?.join(', ') || 'None listed'}
- Design Style: ${project.design.style.join(', ')}
- Animations: ${project.design.animations || 'None'}
- Reference Sites: ${project.design.references || 'None'}
- Google Drive Links: ${project.answers.assets_drive_link || 'None'}

AI ARCHITECT ANALYSIS:
${analysis ? JSON.stringify(analysis, null, 2) : 'No AI Analysis generated yet.'}

INSTRUCTIONS:
- You must provide practical, coding-focused mentorship.
- Give concrete code snippets (React, Next.js, Tailwind, etc.) when requested.
- Provide advice on folder structures, database schemas (Firestore), security rules, APIs, and deployments.
- Suggest solutions to integrate third-party APIs (Midtrans, WhatsApp, Maps).
- Respond in Indonesian (Bahasa Indonesia).
`;

    let lastError: any = null;

    // Try each model in sequence
    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Attempting mentor chat with model: ${modelName}`);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: contextPrompt }] },
            { role: 'model', parts: [{ text: "Siap! Saya adalah AI Coding Mentor Anda untuk proyek ini. Silakan tanyakan apa saja tentang cara membangun, menulis kode, database schema, atau integrasi teknis untuk proyek ini." }] },
            ...history.map((h) => ({
              role: h.role,
              parts: [{ text: h.parts }],
            })),
          ],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();
        if (responseText) return responseText;
      } catch (e: any) {
        lastError = e;
        console.warn(`Mentor chat with ${modelName} failed: ${e.message}. Trying next fallback model...`);
      }
    }

    throw new Error(`All mentor chat fallback models failed. Last error: ${lastError?.message}`);
  },
};

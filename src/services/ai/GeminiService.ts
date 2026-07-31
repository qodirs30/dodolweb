import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectDocument } from '../project/ProjectService';
import { AIAnalysisResponseSchema, AIAnalysisResponse } from '@/schemas/ai-response';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Priority list of Gemini models to try in case of deprecations (404) or rate/demand spikes (503)
const MODELS_TO_TRY = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

// Exponential backoff sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GeminiService = {
  // Generate project analysis brief with robust fallback routing
  async generateAnalysis(project: ProjectDocument, retries = 2, delay = 1000): Promise<AIAnalysisResponse> {
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    // 1. Build the system/context prompt
    const systemPrompt = `You are a Principal Software Architect, Enterprise Solution Architect, Senior Business Analyst, and Technical Project Manager.
Your task is to analyze the following Website Project Brief submitted by a client and return a structured JSON response.

You MUST follow this schema exactly.
Do not output markdown code blocks.
Do not output explanations or conversational text.
Return ONLY raw JSON conforming to the specified structure.`;

    // 2. Build the client data details prompt
    const userPrompt = `PROJECT BRIEF DATA:
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
Animation Preference: ${project.design.animations || 'None listed'}

Please analyze this brief and output a JSON object containing:
- summary: A 2-sentence professional executive summary.
- businessOverview: Detailed summary of client business model.
- websiteGoal: Main goal the website aims to solve.
- targetAudience: Identified demographic/target groups.
- projectReadiness: A score from 0-100 indicating how complete client assets are (logo, guideline, description).
- complexity: "Easy", "Medium", "Complex", or "Enterprise".
- estimatedDuration: Estimated working days (number) required to build this.
- estimatedDifficulty: Text explanation of complexity factors.
- recommendedPages: List of specific pages the website should have (e.g. Home, About, Checkout).
- recommendedFeatures: List of specific functional components needed.
- recommendedIntegrations: Third party integrations (e.g. Midtrans, Google Analytics, Mailchimp).
- recommendedTechStack: Tech recommendations (e.g. Next.js, React, Tailwind, Node.js).
- recommendedCMS: Which CMS is best suited (e.g. Payload CMS, Strapi, Sanity, or None).
- recommendedSEO: Title tag recommendation, meta description, and 5 target keywords.
- contentChecklist: Key copywriting sections to draft.
- assetChecklist: Files the client needs to supply.
- missingInformation: Items the client forgot to specify.
- followUpQuestions: Max 10 questions to ask the client.
- riskAnalysis: Technical, timeline, or budget risks.
- developerNotes: Internal technical guidelines for engineers.
- clientExpectation: Client price/expectations sensitivity ("High", "Medium", "Low").
- estimatedPriceRange: Price estimation based on features.
- priority: Project urgency rating ("Low", "Medium", "High", "Urgent").
- confidence: Score from 0-100 indicating your confidence in this estimation.
- prdPrompt: A highly optimized, detailed developer PRD.md prompt (in Indonesian) that can be pasted into AI agents (like Claude Code, Cursor, Codex) to build the website's pages, folder structures, APIs, and Firestore database schemas.
- stylePrompt: A comprehensive Style.md prompt (in Indonesian) specifying branding colors, layout tokens, Tailwind CSS setups, and glassmorphism/aesthetic instructions.
- designPrompt: A comprehensive Design.md prompt (in Indonesian) specifying layout wireframes, scroll animations, section details, and design references analysis.`;

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
    const contextPrompt = `You are a Coding Mentor and Senior Lead Developer for an agency called AgencyEngine.
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

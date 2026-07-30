import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectDocument } from '../project/ProjectService';
import { AIAnalysisResponseSchema, AIAnalysisResponse } from '@/schemas/ai-response';

const API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini Client
const getGeminiModel = () => {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
};

// Exponential backoff sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GeminiService = {
  // Generate project analysis brief
  async generateAnalysis(project: ProjectDocument, retries = 2, delay = 1000): Promise<AIAnalysisResponse> {
    const model = getGeminiModel();

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
- confidence: Score from 0-100 indicating your confidence in this estimation.`;

    // 3. Call the API with retry wrapper
    let lastError: any = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
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
        
        return validated;
      } catch (e: any) {
        lastError = e;
        console.warn(`Gemini analysis attempt ${attempt + 1} failed: ${e.message}`);
        if (attempt < retries) {
          await sleep(delay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw new Error(`AI Analysis failed after ${retries + 1} attempts. Last error: ${lastError?.message}`);
  },
};

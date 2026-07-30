import { z } from 'zod';

export const AIAnalysisResponseSchema = z.object({
  summary: z.string(),
  businessOverview: z.string(),
  websiteGoal: z.string(),
  targetAudience: z.array(z.string()),
  projectReadiness: z.number().min(0).max(100),
  complexity: z.enum(['Easy', 'Medium', 'Complex', 'Enterprise']),
  estimatedDuration: z.number().min(1), // in working days
  estimatedDifficulty: z.string(),
  recommendedPages: z.array(z.string()),
  recommendedFeatures: z.array(z.string()),
  recommendedIntegrations: z.array(z.string()),
  recommendedTechStack: z.array(z.string()),
  recommendedCMS: z.string(),
  recommendedSEO: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  contentChecklist: z.array(z.string()),
  assetChecklist: z.array(z.string()),
  missingInformation: z.array(z.string()),
  followUpQuestions: z.array(z.string()).max(10),
  riskAnalysis: z.array(z.string()),
  developerNotes: z.string(),
  clientExpectation: z.enum(['High', 'Medium', 'Low']),
  estimatedPriceRange: z.string(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  confidence: z.number().min(0).max(100),
});

export type AIAnalysisResponse = z.infer<typeof AIAnalysisResponseSchema>;

import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/project/ProjectService';
import { GeminiService } from '@/services/ai/GeminiService';

export async function POST(req: NextRequest) {
  try {
    const { docId, message, chatHistory } = await req.json();

    if (!docId || !message) {
      return NextResponse.json({ error: 'Missing parameter: docId or message' }, { status: 400 });
    }

    // 1. Fetch project details from Firestore
    const project = await ProjectService.getProject(docId);
    if (!project) {
      return NextResponse.json({ error: 'Project brief not found.' }, { status: 404 });
    }

    // 2. Fetch AI analysis if available
    const analysis = await ProjectService.getAIAnalysis(docId);

    // 3. Call Gemini to get coding mentor response
    const reply = await GeminiService.askMentor(
      project,
      analysis,
      message,
      chatHistory || []
    );

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('API Error in mentor route:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

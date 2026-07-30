import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/project/ProjectService';
import { GeminiService } from '@/services/ai/GeminiService';

export async function POST(req: NextRequest) {
  try {
    const { docId } = await req.json();

    if (!docId) {
      return NextResponse.json({ error: 'Missing parameter: docId' }, { status: 400 });
    }

    // 1. Fetch project brief from firestore
    const project = await ProjectService.getProject(docId);
    if (!project) {
      return NextResponse.json({ error: 'Project brief not found.' }, { status: 404 });
    }

    try {
      // 2. Call Gemini service to perform AI requirement analysis
      const analysis = await GeminiService.generateAnalysis(project);

      // 3. Save result back to project's ai subcollection
      await ProjectService.saveAIAnalysis(docId, analysis);

      return NextResponse.json({ success: true, analysis });
    } catch (aiError: any) {
      console.error('Gemini AI processing failed:', aiError);
      
      // Fallback: update history stating AI was bypassed/failed
      const { db } = await import('@/services/firebase/config');
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      await addDoc(collection(db, 'projects', docId, 'history'), {
        action: 'AI Analysis Bypassed',
        description: `Gemini AI failed: ${aiError.message}. Brief remains readable without AI summaries.`,
        performedBy: 'System',
        createdAt: serverTimestamp(),
      });

      return NextResponse.json({
        success: false,
        warning: 'AI analysis failed but brief remains saved.',
        error: aiError.message,
      }, { status: 200 }); // Return 200 so it doesn't break UI client submission completion
    }
  } catch (err: any) {
    console.error('Root API error in analyze route:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

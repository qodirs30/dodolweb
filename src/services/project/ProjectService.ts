import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProjectStatus } from '@/constants/project-status';

export interface ProjectClient {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  company: string;
  position?: string;
}

export interface ProjectBusiness {
  category: string;
  description: string;
  location: string;
  companySize?: string;
  yearsInBusiness?: number;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface ProjectDetails {
  websiteType: string;
  goal?: string;
  deadline: string;
  budget: string;
  targetAudience?: string[];
  competitors?: string;
  references?: string;
}

export interface ProjectBranding {
  hasLogo: string;
  hasBrandGuideline: string;
  preferredColors?: string[];
}

export interface ProjectFeatures {
  selected: string[];
  custom?: string;
}

export interface ProjectDesign {
  style: string[];
  references?: string;
  animations?: string;
  budget?: string;
  deadline?: string;
}

export interface ProjectDocument {
  id?: string; // Firestore Doc ID
  projectId: string; // Human Project ID (e.g. WPB-20260730-0001)
  status: ProjectStatus;
  client: ProjectClient;
  business: ProjectBusiness;
  project: ProjectDetails;
  branding: ProjectBranding;
  features: ProjectFeatures;
  design: ProjectDesign;
  answers: Record<string, any>;
  schemaVersion: number;
  createdAt: any;
  updatedAt: any;
  submittedAt?: any;
}

export interface HistoryItem {
  id?: string;
  action: string;
  description: string;
  performedBy: string;
  createdAt: any;
}

export interface NoteItem {
  id?: string;
  message: string;
  createdBy: string;
  createdAt: any;
}

export interface UploadItem {
  id?: string;
  fileName: string;
  storagePath: string;
  size: number;
  mimeType: string;
  category: string;
  uploadedBy: string;
  uploadedAt: any;
  deleted?: boolean;
  deletedBy?: string;
  deletedAt?: any;
}

// Helper to recursively remove undefined fields for Firestore safety
export function sanitizeFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (obj instanceof Date) return obj;
  // Leave Firestore FieldValue, Timestamp, etc. as-is
  if (typeof obj === 'object' && obj.constructor && obj.constructor.name !== 'Object' && !Array.isArray(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreData);
  }
  if (typeof obj === 'object') {
    const clean: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        clean[key] = sanitizeFirestoreData(obj[key]);
      }
    }
    return clean;
  }
  return obj;
}

// Helper to generate a Human-Readable Project ID
export function generateHumanProjectId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000)); // 4 random digits
  return `WPB-${year}${month}${day}-${random}`;
}

export const ProjectService = {
  // Create a new Project submission from the client wizard
  async createProject(answers: Record<string, any>): Promise<{ docId: string; projectId: string }> {
    const humanId = generateHumanProjectId();

    // Map answers into structured sub-objects
    const client: ProjectClient = {
      name: answers.business_name || '', // Using business name as placeholder or actual client name if we had it
      email: answers.contact_email || '',
      phone: answers.contact_whatsapp || '',
      whatsapp: answers.contact_whatsapp || '',
      company: answers.business_name || '',
    };

    const business: ProjectBusiness = {
      category: answers.business_category || '',
      description: answers.business_description || '',
      location: answers.location || '',
      companySize: answers.company_size || '',
      yearsInBusiness: answers.years_in_business ? Number(answers.years_in_business) : undefined,
      website: answers.existing_website || '',
    };

    const project: ProjectDetails = {
      websiteType: answers.website_type || '',
      deadline: answers.project_deadline || '',
      budget: answers.project_budget || '',
      targetAudience: answers.target_audience_age || [],
      competitors: answers.competitors || '',
    };

    const branding: ProjectBranding = {
      hasLogo: answers.has_logo || 'no',
      hasBrandGuideline: answers.has_brand_guideline || 'no',
      preferredColors: typeof answers.preferred_colors === 'string' 
        ? answers.preferred_colors.split(',').map((c: string) => c.trim()) 
        : answers.preferred_colors || [],
    };

    const features: ProjectFeatures = {
      selected: answers.features_list || [],
      custom: answers.custom_features_input || '',
    };

    const design: ProjectDesign = {
      style: answers.design_style || [],
      references: answers.reference_websites || '',
      animations: answers.animation_preference || '',
    };

    const projectDocData: Omit<ProjectDocument, 'id'> = {
      projectId: humanId,
      status: 'submitted',
      client,
      business,
      project,
      branding,
      features,
      design,
      answers,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp(),
    };

    // Save project document
    const docRef = await addDoc(collection(db, 'projects'), sanitizeFirestoreData(projectDocData));

    // Save initial history record
    await addDoc(collection(db, 'projects', docRef.id, 'history'), {
      action: 'Project Submitted',
      description: `Project brief was submitted by client. Generated ID: ${humanId}`,
      performedBy: 'Client',
      createdAt: serverTimestamp(),
    });

    return { docId: docRef.id, projectId: humanId };
  },

  // Get project by doc ID
  async getProject(docId: string): Promise<ProjectDocument | null> {
    const docRef = doc(db, 'projects', docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as ProjectDocument;
  },

  // Get all projects
  async getProjects(): Promise<ProjectDocument[]> {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectDocument));
  },

  // Update status of project
  async updateProjectStatus(docId: string, status: ProjectStatus, adminName: string): Promise<void> {
    const docRef = doc(db, 'projects', docId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    // Write history log
    await addDoc(collection(db, 'projects', docId, 'history'), {
      action: 'Status Updated',
      description: `Project status was changed to "${status}"`,
      performedBy: adminName,
      createdAt: serverTimestamp(),
    });
  },

  // Add internal notes to project
  async addNote(docId: string, message: string, adminName: string): Promise<void> {
    await addDoc(collection(db, 'projects', docId, 'notes'), {
      message,
      createdBy: adminName,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'projects', docId, 'history'), {
      action: 'Note Added',
      description: 'Internal admin note was added.',
      performedBy: adminName,
      createdAt: serverTimestamp(),
    });
  },

  // Get notes for project
  async getNotes(docId: string): Promise<NoteItem[]> {
    const q = query(collection(db, 'projects', docId, 'notes'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NoteItem));
  },

  // Get history logs for project
  async getHistory(docId: string): Promise<HistoryItem[]> {
    const q = query(collection(db, 'projects', docId, 'history'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HistoryItem));
  },

  // Save AI summary results
  async saveAIAnalysis(docId: string, aiData: any): Promise<void> {
    const aiDocRef = doc(db, 'projects', docId, 'ai', 'gemini_analysis');
    await setDoc(aiDocRef, {
      ...aiData,
      generatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'projects', docId, 'history'), {
      action: 'AI Analysis Completed',
      description: 'Gemini AI generated project requirements analysis.',
      performedBy: 'Gemini AI',
      createdAt: serverTimestamp(),
    });
  },

  // Get AI analysis for project
  async getAIAnalysis(docId: string): Promise<any | null> {
    const aiDocRef = doc(db, 'projects', docId, 'ai', 'gemini_analysis');
    const snap = await getDoc(aiDocRef);
    if (!snap.exists()) return null;
    return snap.data();
  },

  // Add upload metadata
  async addUploadMetadata(docId: string, fileData: Omit<UploadItem, 'uploadedAt'>): Promise<void> {
    await addDoc(collection(db, 'projects', docId, 'uploads'), {
      ...fileData,
      uploadedAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'projects', docId, 'history'), {
      action: 'File Uploaded',
      description: `Uploaded file: ${fileData.fileName}`,
      performedBy: fileData.uploadedBy,
      createdAt: serverTimestamp(),
    });
  },

  // Get uploads metadata list
  async getUploads(docId: string): Promise<UploadItem[]> {
    const q = query(collection(db, 'projects', docId, 'uploads'), orderBy('uploadedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UploadItem));
  },
};

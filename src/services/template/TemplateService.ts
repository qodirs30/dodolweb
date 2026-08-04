import { db } from '@/services/firebase/config';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Question } from '@/types/wizard';
import { sanitizeFirestoreData } from '../project/ProjectService';

export interface BriefTemplate {
  id?: string;
  name: string;
  description: string;
  websiteType: string;
  questions: Question[];
  createdAt: any;
  updatedAt: any;
}

export const TemplateService = {
  // Create a new template
  async createTemplate(template: Omit<BriefTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'templates'), sanitizeFirestoreData({
      ...template,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }));
    return docRef.id;
  },

  // Get a specific template by ID
  async getTemplate(id: string): Promise<BriefTemplate | null> {
    const docRef = doc(db, 'templates', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as BriefTemplate;
  },

  // Get all templates ordered by creation date
  async getTemplates(): Promise<BriefTemplate[]> {
    const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BriefTemplate));
  },

  // Update an existing template
  async updateTemplate(
    id: string,
    updates: Partial<Omit<BriefTemplate, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const docRef = doc(db, 'templates', id);
    await updateDoc(docRef, sanitizeFirestoreData({
      ...updates,
      updatedAt: serverTimestamp(),
    }));
  },

  // Delete a template
  async deleteTemplate(id: string): Promise<void> {
    const docRef = doc(db, 'templates', id);
    await deleteDoc(docRef);
  },
};

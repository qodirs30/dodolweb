'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectService, ProjectDocument, HistoryItem, NoteItem, UploadItem } from '@/services/project/ProjectService';
import { StorageService } from '@/services/upload/StorageService';
import { PROJECT_STATUS_CONFIGS, ProjectStatus } from '@/constants/project-status';
import { websiteBriefQuestions } from '@/features/wizard/configs/website-brief';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProjectBriefPdfDocument } from '@/services/pdf/PdfTemplate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Building2,
  Calendar,
  Clock,
  Download,
  FileText,
  History,
  Info,
  Loader2,
  MessageSquare,
  Sparkles,
  Trash2,
  User,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Terminal,
  Palette,
  LayoutTemplate,
  Copy,
  Check,
  Send,
  Bot,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AdminProjectDetailPage() {
  const { id: docId } = useParams() as { id: string };
  const router = useRouter();

  const [project, setProject] = useState<ProjectDocument | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  // AI Prompts states
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // AI Mentor states
  const [mentorMessages, setMentorMessages] = useState<{ role: 'user' | 'model'; parts: string }[]>([
    { role: 'model', parts: 'Siap! Saya adalah AI Coding Mentor Anda untuk proyek ini. Silakan tanyakan apa saja tentang cara membangun, menulis kode, database schema, atau integrasi teknis untuk proyek ini.' }
  ]);
  const [mentorInput, setMentorInput] = useState('');
  const [isSendingMentorMsg, setIsSendingMentorMsg] = useState(false);

  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<ProjectStatus | ''>('');
  
  // Note input state
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load project details
  useEffect(() => {
    async function loadProjectDetails() {
      if (!docId) return;
      try {
        const [projDoc, notesList, historyList, uploadsList, aiDoc] = await Promise.all([
          ProjectService.getProject(docId),
          ProjectService.getNotes(docId),
          ProjectService.getHistory(docId),
          ProjectService.getUploads(docId),
          ProjectService.getAIAnalysis(docId),
        ]);

        if (!projDoc) {
          router.push('/admin/projects');
          return;
        }

        setProject(projDoc);
        setNotes(notesList);
        setHistory(historyList);
        setUploads(uploadsList);
        setAiAnalysis(aiDoc);
      } catch (e) {
        console.error('Error loading project details:', e);
      } finally {
        setLoading(false);
      }
    }

    loadProjectDetails();
  }, [docId, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reload lists (history/notes)
  const reloadNotesAndHistory = async () => {
    try {
      const [notesList, historyList] = await Promise.all([
        ProjectService.getNotes(docId),
        ProjectService.getHistory(docId),
      ]);
      setNotes(notesList);
      setHistory(historyList);
    } catch (e) {
      console.error(e);
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      await ProjectService.addNote(docId, newNote, 'Admin Manager');
      setNewNote('');
      await reloadNotesAndHistory();
    } catch (e) {
      console.error('Error adding note:', e);
    } finally {
      setIsAddingNote(false);
    }
  };

  // Change project status
  const handleStatusChangeSubmit = async () => {
    if (!statusToChange || !project) return;
    try {
      await ProjectService.updateProjectStatus(docId, statusToChange, 'Admin Manager');
      setProject({ ...project, status: statusToChange });
      setStatusDialogOpen(false);
      await reloadNotesAndHistory();
    } catch (e) {
      console.error('Error changing status:', e);
    }
  };

  // Download uploaded file dynamically
  const handleDownloadFile = async (storagePath: string, fileName: string) => {
    try {
      const url = await StorageService.getFileUrl(storagePath);
      // Open in new tab or trigger direct download
      window.open(url, '_blank');
    } catch (e) {
      alert('Could not retrieve file download link.');
    }
  };

  // Delete file
  const handleDeleteFile = async (uploadId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this file from storage?')) return;
    try {
      await StorageService.deleteFile(docId, uploadId, storagePath, 'Admin Manager');
      // Refresh uploads
      const uploadsList = await ProjectService.getUploads(docId);
      setUploads(uploadsList);
      await reloadNotesAndHistory();
    } catch (e) {
      alert('Failed to delete file.');
    }
  };

  // Prompt generator functions
  const getPrdPrompt = () => {
    if (!project) return '';
    return `# PRD - ${project.client.company || project.client.name}
## 1. DESKRIPSI BISNIS & PROYEK
* Nama Bisnis: ${project.client.company || project.client.name}
* Kategori: ${project.business.category || '—'}
* Lokasi: ${project.business.location || '—'}
* Ukuran Bisnis: ${project.business.companySize || '—'}
* Deskripsi: ${project.business.description || '—'}

## 2. SPESIFIKASI PROYEK
* Tipe Website: ${project.project.websiteType || '—'}
* Estimasi Budget: ${project.project.budget || '—'}
* Target Launch: ${project.project.deadline || '—'}
* Status Domain/Hosting: ${project.answers.domain_status || '—'}
* Pemeliharaan (Maintenance): ${project.answers.website_maintenance || '—'}
* Target Audiens: ${project.project.targetAudience?.join(', ') || '—'}
* Kompetitor: ${project.project.competitors || '—'}

## 3. FITUR & INTEGRASI
* Fitur Terpilih: ${project.features.selected?.join(', ') || '—'}
* Fitur Kustom: ${project.features.custom || '—'}
* Google Drive Aset: ${project.answers.assets_drive_link || '—'}

## 4. STRUKTUR HALAMAN & TEKNIS (AI RECOMMENDATION)
${aiAnalysis ? `* Halaman yang dibutuhkan:
${aiAnalysis.recommendedPages?.map((p: any) => `- ${p.name || p}: ${p.description || ''}`).join('\n')}

* Rekomendasi Tech Stack:
- Core: ${aiAnalysis.recommendedTechStack || 'Next.js, TailwindCSS, React'}
- CMS: ${aiAnalysis.recommendedCMS || 'Payload CMS / Strapi'}
- Integrasi: ${aiAnalysis.recommendedIntegrations?.join(', ') || '—'}
- SEO Keywords: ${aiAnalysis.recommendedSEO?.keywords?.join(', ') || '—'}
` : '*Lakukan Analisis AI terlebih dahulu di tab "AI Analysis" untuk mendapatkan rekomendasi halaman.*'}

## 5. INSTRUKSI AI DEVELOPER (VIBE CODING PROMPT)
Buatlah website lengkap dengan spesifikasi di atas menggunakan Next.js App Router, TailwindCSS, dan TypeScript. Rancang arsitektur folder modular yang bersih, pastikan layout responsif, buat database schema terstruktur untuk fitur dinamis, dan tambahkan transisi visual yang modern.
`;
  };

  const getStylePrompt = () => {
    if (!project) return '';
    return `# STYLE.md - PANDUAN VISUAL DAN STYLING
## 1. PALET WARNA BRAND
* Warna Preferensi: ${project.branding.preferredColors?.join(', ') || '—'}

## 2. PREFERENSI DESAIN & VISUAL
* Gaya Estetika: ${project.design.style?.join(', ') || '—'}
* Gaya Animasi: ${project.design.animations || '—'}

## 3. ATURAN PENULISAN CSS & TAILWIND (VIBE CODING PROMPT)
* Gunakan gaya font modern yang terintegrasi (misalnya Inter atau Outfit via Google Fonts).
* Konfigurasikan file Tailwind CSS dengan token warna utama berdasarkan palet di atas.
* Implementasikan efek glassmorphism kontainer untuk estetika modern jika menggunakan gaya desain premium.
* Pastikan transisi hover, tombol interaktif, dan feedback visual lainnya terasa mulus dengan durasi standard 200ms.
* Sediakan class helper untuk layout dinamis yang responsif di mobile (flex, grid).
`;
  };

  const getDesignPrompt = () => {
    if (!project) return '';
    return `# DESIGN.md - LAYOUT & REFERENSI DESAIN
## 1. ACUAN DESAIN UTAMA
* Gaya Visual Pilihan: ${project.design.style?.join(', ') || '—'}
* Animasi Transisi: ${project.design.animations || '—'}

## 2. WEBSITE REFERENSI YANG DISUKAI KLIEN
* Referensi Web: ${project.design.references || '—'}

## 3. INSTRUKSI BENTUK TATA LETAK & SEKSI (VIBE CODING PROMPT)
* Buat layout seksi Hero yang menarik, tebal, dan berfokus pada keunikan brand (USP): "${project.answers.unique_selling_point || ''}".
* Susun seksi "Tentang Kami" yang menyajikan kisah perusahaan.
* Buat grid portfolio atau daftar produk/layanan yang responsif dan interaktif.
* Implementasikan layout landing page yang dioptimalkan untuk performa Core Web Vitals (LCP cepat, layout shift rendah).
* Pastikan semua link CTA eksternal (terutama tombol chat WhatsApp) memiliki link target _blank yang aman.
`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendMentorMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mentorInput.trim() || isSendingMentorMsg) return;

    const userMessage = mentorInput;
    setMentorInput('');
    
    const newMessages = [...mentorMessages, { role: 'user' as const, parts: userMessage }];
    setMentorMessages(newMessages);
    setIsSendingMentorMsg(true);

    try {
      const chatHistory = newMessages.slice(1, -1);

      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId,
          message: userMessage,
          chatHistory,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMentorMessages((prev) => [...prev, { role: 'model' as const, parts: data.reply }]);
      } else {
        setMentorMessages((prev) => [...prev, { role: 'model' as const, parts: 'Maaf, mentor sedang mengalami gangguan teknis. Coba lagi nanti.' }]);
      }
    } catch (err) {
      console.error(err);
      setMentorMessages((prev) => [...prev, { role: 'model' as const, parts: 'Maaf, terjadi kesalahan koneksi server saat menghubungi AI Mentor.' }]);
    } finally {
      setIsSendingMentorMsg(false);
    }
  };

  const getWebsiteTypeLabel = (type: string) => {
    return type?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '—';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  if (!project) return null;

  const currentStatusMeta = PROJECT_STATUS_CONFIGS[project.status];

  return (
    <div className="space-y-6">
      {/* Back button & Human ID */}
      <div className="flex items-center gap-3">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-850">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
          </Button>
        </Link>
        <span className="text-zinc-300">/</span>
        <Badge className="text-xs font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 hover:bg-zinc-100">
          {project.projectId}
        </Badge>
      </div>

      {/* Main Info Card */}
      <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {project.business.description.slice(0, 50) || 'Project Brief'}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <User className="h-3.5 w-3.5" /> Client: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{project.client.name}</span> ({project.client.email})
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Badge className={`text-xs font-semibold px-3 py-1 rounded-full border ${currentStatusMeta?.color || ''}`}>
              {currentStatusMeta?.label || project.status}
            </Badge>

            {isMounted && (
              <PDFDownloadLink
                document={
                  <ProjectBriefPdfDocument
                    project={project}
                    aiAnalysis={aiAnalysis}
                    uploads={uploads}
                  />
                }
                fileName={`${project.projectId}_Project-Brief.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-xs font-semibold px-4 h-9 border-zinc-200"
                    disabled={pdfLoading}
                  >
                    {pdfLoading ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            <Button
              size="sm"
              onClick={() => {
                setStatusToChange(project.status);
                setStatusDialogOpen(true);
              }}
              className="rounded-lg text-xs font-semibold px-4 h-9 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Panels */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 mb-6">
          <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="brief" className="rounded-lg text-xs font-semibold">Client Brief</TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg text-xs font-semibold">Files ({uploads.length})</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg text-xs font-semibold">AI Analysis</TabsTrigger>
          <TabsTrigger value="prompts" className="rounded-lg text-xs font-semibold">AI Prompts</TabsTrigger>
          <TabsTrigger value="mentor" className="rounded-lg text-xs font-semibold">AI Mentor</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg text-xs font-semibold">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs font-semibold">History</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Project Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Website Type</h5>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                      {getWebsiteTypeLabel(project.project.websiteType)}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estimated Budget</h5>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                      {project.project.budget}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Deadline</h5>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                      {project.project.deadline}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Submitted On</h5>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1 tabular-nums">
                      {formatDate(project.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Business Category</h5>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                      {project.business.category}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</h5>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                      {project.business.location}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Business Description</h5>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {project.business.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Client Contact Card
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h6 className="text-[10px] font-bold text-zinc-400 uppercase leading-none">Name</h6>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{project.client.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h6 className="text-[10px] font-bold text-zinc-400 uppercase leading-none">Company / Whatsapp</h6>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{project.client.whatsapp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h6 className="text-[10px] font-bold text-zinc-400 uppercase leading-none">Email</h6>
                      <p className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 mt-1 select-all">{project.client.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* BRIEF TAB */}
        <TabsContent value="brief">
          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6 divide-y divide-zinc-100 dark:divide-zinc-800">
              {websiteBriefQuestions.filter((q) => q.type !== 'heading' && q.type !== 'divider').map((q) => {
                const val = project.answers[q.id];
                const optOther = project.answers[`${q.id}_other`];
                if (val === undefined || val === null || val === '') return null;

                let outputText = String(val);
                if (Array.isArray(val)) {
                  outputText = val.map((v) => {
                    const opt = q.options?.find((o) => o.value === v);
                    return opt ? opt.label : v;
                  }).join(', ');
                } else if (typeof val === 'boolean') {
                  outputText = val ? 'Yes' : 'No';
                } else {
                  const opt = q.options?.find((o) => o.value === val);
                  if (opt) outputText = opt.label;
                }

                return (
                  <div key={q.id} className="py-4 flex flex-col gap-1 first:pt-0 last:pb-0">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{q.title}</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed mt-1">
                      {outputText}
                      {optOther && <span className="block text-xs font-normal text-muted-foreground italic mt-1">({optOther})</span>}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FILES TAB */}
        <TabsContent value="files">
          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6">
              {uploads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploads.filter(u => !u.deleted).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between border border-zinc-200/60 p-4 rounded-xl hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate pr-4">
                          <p className="text-sm font-bold truncate text-zinc-800 dark:text-zinc-200">{file.fileName}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadFile(file.storagePath, file.fileName)}
                          className="h-8 w-8 rounded-lg p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Download className="h-4 w-4 text-zinc-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFile(file.id!, file.storagePath)}
                          className="h-8 w-8 rounded-lg p-0 hover:bg-rose-50 text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm">No Files Uploaded</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                    This project brief has no uploaded files associated with it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI SUMMARY TAB */}
        <TabsContent value="ai">
          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6">
              {aiAnalysis ? (
                <div className="space-y-6">
                  {/* Summary block */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Project Summary</h4>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">
                      {aiAnalysis.summary || aiAnalysis.businessOverview}
                    </p>
                  </div>

                  {/* Readiness and Complexity badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Readiness Score</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{aiAnalysis.projectReadiness || aiAnalysis.confidence}%</span>
                        <Badge className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                          {aiAnalysis.projectReadiness > 70 ? 'Ready' : 'Requires Follow-up'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estimated Timeline</h4>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                        {aiAnalysis.estimatedDuration || '—'} working days
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-semibold">Complexity</h4>
                      <Badge className="text-[10px] mt-1 bg-purple-50 text-purple-600 dark:bg-purple-950/20 border border-purple-100">
                        {aiAnalysis.complexity || aiAnalysis.estimatedDifficulty || 'Medium'}
                      </Badge>
                    </div>
                  </div>

                  {/* Pages & Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recommended Pages</h4>
                      <ul className="list-disc pl-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-2 space-y-1">
                        {aiAnalysis.recommendedPages?.map((p: string, i: number) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Recommended Integrations</h4>
                      <ul className="list-disc pl-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-2 space-y-1">
                        {aiAnalysis.recommendedIntegrations?.map((integ: string, i: number) => (
                          <li key={i}>{integ}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Risks & Follow-ups */}
                  <div className="grid grid-cols-1 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-rose-500">Risk Analysis</h4>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground mt-2 space-y-1">
                        {aiAnalysis.riskAnalysis?.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-blue-500">Suggested Follow-up Questions</h4>
                      <ul className="list-disc pl-4 text-xs text-muted-foreground mt-2 space-y-1">
                        {aiAnalysis.followUpQuestions?.map((q: string, i: number) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm">No AI Summary Completed</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                    AI project analysis runs automatically on backend submission. This project has not been processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROMPTS GENERATOR TAB */}
        <TabsContent value="prompts">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* PRD.md Panel */}
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[550px]">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-500">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200">PRD.md Prompt</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(getPrdPrompt(), 'PRD')}
                    className="h-8 text-xs gap-1 border-zinc-200"
                  >
                    {copiedType === 'PRD' ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex-1 mt-4 overflow-y-auto rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 text-[10px] font-mono leading-relaxed whitespace-pre-wrap select-all select-text text-zinc-700 dark:text-zinc-300">
                  {getPrdPrompt()}
                </div>
              </CardContent>
            </Card>

            {/* STYLE.md Panel */}
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[550px]">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-500">
                      <Palette className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200">Style.md Prompt</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(getStylePrompt(), 'Style')}
                    className="h-8 text-xs gap-1 border-zinc-200"
                  >
                    {copiedType === 'Style' ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex-1 mt-4 overflow-y-auto rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 text-[10px] font-mono leading-relaxed whitespace-pre-wrap select-all select-text text-zinc-700 dark:text-zinc-300">
                  {getStylePrompt()}
                </div>
              </CardContent>
            </Card>

            {/* DESIGN.md Panel */}
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[550px]">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-teal-50 dark:bg-teal-950/30 text-teal-500">
                      <LayoutTemplate className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200">Design.md Prompt</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(getDesignPrompt(), 'Design')}
                    className="h-8 text-xs gap-1 border-zinc-200"
                  >
                    {copiedType === 'Design' ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex-1 mt-4 overflow-y-auto rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 text-[10px] font-mono leading-relaxed whitespace-pre-wrap select-all select-text text-zinc-700 dark:text-zinc-300">
                  {getDesignPrompt()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI CODING MENTOR TAB */}
        <TabsContent value="mentor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Panel */}
            <Card className="lg:col-span-2 rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[600px]">
              <CardContent className="p-6 flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl">
                    <Bot className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-850 dark:text-zinc-200 block">AI Coding Mentor</span>
                    <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                      Mentor Teknis Aktif
                    </span>
                  </div>
                </div>

                {/* Chat Message History */}
                <div className="flex-1 mt-4 overflow-y-auto space-y-4 pr-1 scrollbar-thin flex flex-col">
                  {mentorMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-3 max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed",
                        msg.role === 'user'
                          ? "ml-auto bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-br-none"
                          : "bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800 rounded-bl-none"
                      )}
                    >
                      {msg.role === 'model' && <Bot className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />}
                      <div className="flex-1 space-y-2 whitespace-pre-wrap">
                        {msg.parts}
                      </div>
                    </div>
                  ))}
                  {isSendingMentorMsg && (
                    <div className="flex gap-3 max-w-[85%] bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-2xl rounded-bl-none p-4 text-xs leading-relaxed items-center">
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />
                      <span className="italic text-muted-foreground animate-pulse">AI Mentor sedang merumuskan panduan coding...</span>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMentorMessage} className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                  <Input
                    placeholder="Tanyakan rekomendasi arsitektur, schema database, atau snippet kode..."
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    disabled={isSendingMentorMsg}
                    className="flex-1 h-11 bg-white dark:bg-zinc-950"
                  />
                  <Button type="submit" disabled={isSendingMentorMsg || !mentorInput.trim()} className="h-11 px-5 gap-2">
                    <Send className="h-4 w-4" />
                    Kirim
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Suggest Panel */}
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[600px]">
              <CardContent className="p-6 space-y-6 overflow-y-auto flex flex-col">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Topik Diskusi Cepat
                </h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Klik pertanyaan cepat di bawah ini untuk berdiskusi dengan AI Mentor mengenai teknis pembuatan website ini secara instan:
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    "Bagaimana susunan struktur folder Next.js App Router terbaik untuk project ini?",
                    "Buatkan schema koleksi Firestore untuk mendukung semua fitur yang diminta klien.",
                    "Bagaimana cara integrasi pembayaran Midtrans / payment gateway untuk website ini?",
                    "Bagaimana cara membuat efek glassmorphism modern di Tailwind CSS?",
                    "Buatkan template file Tailwind CSS config untuk warna brand ini.",
                    "Tolong analisis link asset Google Drive / referensi desain yang dikirim klien."
                  ].map((topic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMentorInput(topic);
                      }}
                      disabled={isSendingMentorMsg}
                      className="text-left text-xs font-semibold p-3 border border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 rounded-xl transition-all hover:border-zinc-350 text-zinc-700 dark:text-zinc-300"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-6">
                {notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border border-zinc-100 dark:border-zinc-850 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/20"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-450 uppercase mb-2">
                          <span className="text-zinc-600 dark:text-zinc-300">{note.createdBy}</span>
                          <span className="text-zinc-405 font-medium tabular-nums">{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                          {note.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-sm">No Notes Added</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                      Internal admin notes and comments regarding this briefing will be listed here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden h-fit">
              <CardContent className="p-5">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Add Internal Note</h4>
                  <Textarea
                    placeholder="Type comments here..."
                    rows={4}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-xs rounded-lg border-zinc-200"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isAddingNote}
                    className="w-full h-9 rounded-lg text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
                  >
                    {isAddingNote ? 'Saving note...' : 'Post Note'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-6">
              {history.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-zinc-150 dark:border-zinc-800 space-y-6">
                  {history.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-9 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-900 dark:bg-white" />
                      
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase">
                          <span>{log.performedBy}</span>
                          <span className="font-medium tabular-nums">{formatDate(log.createdAt)}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                          {log.action}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {log.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                    <History className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm">No History Recorded</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                    Important milestones, uploads, note creations, or status adjustments will trace logs here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Transition dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-md font-bold">Update Project Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-xs font-semibold text-zinc-500">Select New Status</label>
            <Select
              onValueChange={(val) => setStatusToChange((val || '') as ProjectStatus)}
              value={statusToChange || ''}
            >
              <SelectTrigger className="h-10 mt-2 rounded-lg border-zinc-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_STATUS_CONFIGS).map(([val, conf]) => (
                  <SelectItem key={val} value={val}>
                    {conf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusToChange && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic">
                {PROJECT_STATUS_CONFIGS[statusToChange as ProjectStatus]?.description}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusDialogOpen(false)}
              className="rounded-lg h-9 text-xs font-semibold border-zinc-200"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleStatusChangeSubmit}
              className="rounded-lg h-9 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
            >
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProjectDetailPage() {
  const { id: docId } = useParams() as { id: string };
  const router = useRouter();

  const [project, setProject] = useState<ProjectDocument | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

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
        <TabsList className="w-full grid grid-cols-6 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 mb-6">
          <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="brief" className="rounded-lg text-xs font-semibold">Client Brief</TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg text-xs font-semibold">Files ({uploads.length})</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg text-xs font-semibold">AI Analysis</TabsTrigger>
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

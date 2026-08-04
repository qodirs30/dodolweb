'use client';

import React, { useState, useEffect } from 'react';
import { TemplateService, BriefTemplate } from '@/services/template/TemplateService';
import { ProjectService } from '@/services/project/ProjectService';
import { websiteBriefQuestions } from '@/features/wizard/configs/website-brief';
import { Question, QuestionType, WizardSection } from '@/types/wizard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  CopyPlus,
  Check,
  Link as LinkIcon,
  Save,
  ArrowLeft,
  Settings,
  HelpCircle,
  FileText,
  Menu,
} from 'lucide-react';

export default function AdminTemplatesManager() {
  const [templates, setTemplates] = useState<BriefTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWebsiteType, setFormWebsiteType] = useState('landing_page');
  const [formQuestions, setFormQuestions] = useState<Question[]>([]);

  // Individual Question Editor Modal
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  
  // Question Form Fields
  const [qId, setQId] = useState('');
  const [qTitle, setQTitle] = useState('');
  const [qDescription, setQDescription] = useState('');
  const [qPlaceholder, setQPlaceholder] = useState('');
  const [qType, setQType] = useState<QuestionType>('text');
  const [qSection, setQSection] = useState<WizardSection>('business');
  const [qRequired, setQRequired] = useState(false);
  const [qOptionsRaw, setQOptionsRaw] = useState('');
  const [qWidth, setQWidth] = useState<'full' | 'half'>('full');

  // Copy success indicator
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [templateSubmissionCounts, setTemplateSubmissionCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    try {
      const [list, projectsList] = await Promise.all([
        TemplateService.getTemplates(),
        ProjectService.getProjects(),
      ]);
      setTemplates(list);

      // Count submissions for each template
      const counts: Record<string, number> = {};
      projectsList.forEach((proj) => {
        if (proj.templateId) {
          counts[proj.templateId] = (counts[proj.templateId] || 0) + 1;
        }
      });
      setTemplateSubmissionCounts(counts);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Gagal memuat template brief.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Edit/Create Template trigger
  const handleStartCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormDescription('');
    setFormWebsiteType('landing_page');
    setFormQuestions([]);
    setIsEditing(true);
  };

  const handleStartEdit = (template: BriefTemplate) => {
    setEditingId(template.id || null);
    setFormName(template.name);
    setFormDescription(template.description);
    setFormWebsiteType(template.websiteType || 'landing_page');
    setFormQuestions(template.questions || []);
    setIsEditing(true);
  };

  const handlePrepopulateWithDefault = () => {
    if (confirm('Apakah Anda ingin memuat 34 pertanyaan bawaan sistem sebagai permulaan? Ini akan menimpa pertanyaan yang sudah Anda tambahkan.')) {
      setFormQuestions([...websiteBriefQuestions]);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus template ini secara permanen?')) {
      try {
        await TemplateService.deleteTemplate(id);
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus template: ' + err.message);
      }
    }
  };

  const handleDuplicateTemplate = async (template: BriefTemplate) => {
    try {
      const payload = {
        name: `${template.name} (Salinan)`,
        description: template.description,
        websiteType: template.websiteType || 'landing_page',
        questions: template.questions || [],
      };
      await TemplateService.createTemplate(payload);
      loadTemplates();
      alert('Template berhasil diduplikasi!');
    } catch (err: any) {
      alert('Gagal menduplikasi template: ' + err.message);
    }
  };

  // Save Template
  const handleSaveTemplate = async () => {
    if (!formName.trim()) {
      alert('Nama template tidak boleh kosong.');
      return;
    }

    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        websiteType: formWebsiteType,
        questions: formQuestions,
      };

      if (editingId) {
        await TemplateService.updateTemplate(editingId, payload);
      } else {
        await TemplateService.createTemplate(payload);
      }

      setIsEditing(false);
      loadTemplates();
    } catch (err: any) {
      alert('Gagal menyimpan template: ' + err.message);
    }
  };

  // Add or Edit Question Modal opening
  const handleOpenQuestionModal = (idx: number | null = null) => {
    if (idx !== null) {
      // Edit existing question
      const q = formQuestions[idx];
      setEditingQuestionIdx(idx);
      setQId(q.id);
      setQTitle(q.title);
      setQDescription(q.description || '');
      setQPlaceholder(q.placeholder || '');
      setQType(q.type);
      setQSection(q.section);
      setQRequired(!!q.required);
      setQWidth(q.width === 'half' ? 'half' : 'full');
      setQOptionsRaw(
        q.options ? q.options.map((o) => `${o.label}:${o.value}`).join(', ') : ''
      );
    } else {
      // Create new question
      setEditingQuestionIdx(null);
      setQId('custom_' + Math.random().toString(36).substring(2, 7));
      setQTitle('');
      setQDescription('');
      setQPlaceholder('');
      setQType('text');
      setQSection('business');
      setQRequired(false);
      setQWidth('full');
      setQOptionsRaw('');
    }
    setIsQuestionModalOpen(true);
  };

  // Save Question in Modal
  const handleSaveQuestion = () => {
    if (!qTitle.trim()) {
      alert('Pertanyaan tidak boleh kosong.');
      return;
    }
    if (!qId.trim()) {
      alert('ID Pertanyaan wajib diisi (untuk identifikasi database).');
      return;
    }

    // Parse options: "Label:value, Label2:value2"
    let optionsList = undefined;
    if (['select', 'multiselect', 'radio', 'card-selector'].includes(qType) && qOptionsRaw.trim()) {
      optionsList = qOptionsRaw.split(',').map((opt) => {
        const parts = opt.split(':');
        const label = parts[0]?.trim() || '';
        const value = parts[1]?.trim() || label.toLowerCase().replace(/\s+/g, '_');
        return { label, value };
      });
    }

    const questionObj: Question = {
      id: qId.trim(),
      title: qTitle.trim(),
      description: qDescription.trim() || undefined,
      placeholder: qPlaceholder.trim() || undefined,
      type: qType,
      section: qSection,
      required: qRequired,
      width: qWidth,
      options: optionsList,
    };

    const updatedQuestions = [...formQuestions];
    if (editingQuestionIdx !== null) {
      updatedQuestions[editingQuestionIdx] = questionObj;
    } else {
      // Check ID uniqueness
      if (formQuestions.some((q) => q.id === questionObj.id)) {
        alert('ID Pertanyaan ini sudah digunakan. Harap gunakan ID unik.');
        return;
      }
      updatedQuestions.push(questionObj);
    }

    setFormQuestions(updatedQuestions);
    setIsQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini dari template?')) {
      setFormQuestions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleCopyLink = (templateId: string) => {
    const origin = window.location.origin;
    const link = `${origin}/start?template=${templateId}`;
    navigator.clipboard.writeText(link);
    setCopiedTemplateId(templateId);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const moveQuestion = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === formQuestions.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const list = [...formQuestions];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setFormQuestions(list);
  };

  if (loading && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-zinc-950 animate-spin dark:border-zinc-800 dark:border-t-white" />
        <span className="text-xs text-muted-foreground font-semibold">Memuat template...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-zinc-400" /> Template Brief
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Buat template pertanyaan khusus dan bagikan tautan unik agar klien mengisi spesifikasi website yang sesuai.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleStartCreate} className="rounded-xl gap-2 text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
            <Plus className="h-4 w-4" /> Tambah Template
          </Button>
        )}
      </div>

      {isEditing ? (
        // TEMPLATE EDITOR VIEW
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-lg text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-850">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Kembali
            </Button>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-bold text-zinc-500">
              {editingId ? 'Edit Template Brief' : 'Buat Template Brief Baru'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meta Details Form */}
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-md font-bold">Informasi Template</CardTitle>
                <CardDescription className="text-[11px]">Detail penamaan template agar mudah dikelola.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tName" className="text-xs font-bold">Nama Template *</Label>
                  <Input
                    id="tName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Template Landing Page UKM"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tDesc" className="text-xs font-bold">Deskripsi Singkat</Label>
                  <Textarea
                    id="tDesc"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Deskripsi template ini untuk apa..."
                    className="rounded-xl text-xs h-20 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Jenis Default Website</Label>
                  <Select value={formWebsiteType} onValueChange={(v) => setFormWebsiteType(v || 'landing_page')}>
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue placeholder="Pilih tipe website" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing_page">Landing Page</SelectItem>
                      <SelectItem value="company_profile">Company Profile</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce Store</SelectItem>
                      <SelectItem value="booking">Booking / Reservation</SelectItem>
                      <SelectItem value="web_app">Web Application</SelectItem>
                      <SelectItem value="custom">Lainnya / Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrepopulateWithDefault} className="rounded-xl text-xs font-bold gap-2">
                    <FileText className="h-3.5 w-3.5" /> Prepopulate bawaan 34 Tanya
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Questions Editor Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-zinc-800 dark:text-zinc-200">
                  Daftar Pertanyaan ({formQuestions.length})
                </h3>
                <Button size="sm" onClick={() => handleOpenQuestionModal(null)} className="rounded-xl text-xs font-bold gap-1 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
                  <Plus className="h-3.5 w-3.5" /> Tambah Pertanyaan
                </Button>
              </div>

              {formQuestions.length === 0 ? (
                <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-zinc-50/50 dark:bg-zinc-950/20 border-dashed p-8 text-center flex flex-col items-center justify-center gap-3">
                  <HelpCircle className="h-10 w-10 text-zinc-300" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Belum ada pertanyaan</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                      Silakan tambahkan pertanyaan manual Anda atau klik tombol prepopulate untuk memuat template default.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {formQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850 p-4 rounded-2xl shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-800"
                    >
                      {/* Order buttons */}
                      <div className="flex flex-col gap-1 items-center shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded hover:bg-zinc-100"
                          onClick={() => moveQuestion(idx, 'up')}
                          disabled={idx === 0}
                        >
                          ▲
                        </Button>
                        <span className="text-[10px] font-bold tabular-nums text-zinc-400">{idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded hover:bg-zinc-100"
                          onClick={() => moveQuestion(idx, 'down')}
                          disabled={idx === formQuestions.length - 1}
                        >
                          ▼
                        </Button>
                      </div>

                      {/* Question Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                            {q.title}
                          </span>
                          {q.required && (
                            <Badge variant="destructive" className="text-[8px] px-1 py-0 rounded">Wajib</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate leading-relaxed">
                          ID: <code className="text-rose-500 font-mono">{q.id}</code> • Tipe: <code className="text-blue-500">{q.type}</code> • Seksi: <code className="text-indigo-500">{q.section}</code>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenQuestionModal(idx)} className="h-8 w-8 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(idx)} className="h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-5">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl text-xs font-bold">
              Batal
            </Button>
            <Button onClick={handleSaveTemplate} className="rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 gap-1">
              <Save className="h-4 w-4" /> Simpan Template Brief
            </Button>
          </div>
        </div>
      ) : (
        // TEMPLATE LIST VIEW
        <div>
          {templates.length === 0 ? (
            <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden p-12 text-center flex flex-col items-center justify-center gap-3">
              <FileText className="h-12 w-12 text-zinc-300" />
              <div>
                <h3 className="text-md font-bold text-zinc-700 dark:text-zinc-300">Belum ada template brief</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Buat template brief pertama Anda untuk kebutuhan landing page, e-commerce, atau web app kustom.
                </p>
              </div>
              <Button onClick={handleStartCreate} className="rounded-xl mt-2 text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                Buat Template Sekarang
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {templates.map((template) => (
                <Card key={template.id} className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-50 truncate leading-none">
                        {template.name}
                      </h3>
                      <Badge className="text-[9px] uppercase tracking-wider font-semibold tabular-nums shrink-0 bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400">
                        {template.websiteType?.replace('_', ' ') || 'landing'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed min-h-[32px]">
                      {template.description || 'Tidak ada deskripsi singkat.'}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-1.5 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Total Pertanyaan:</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">{template.questions?.length || 0} Tanya</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Jumlah Pengisian:</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {templateSubmissionCounts[template.id || ''] || 0} Brief
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl text-xs font-semibold gap-1.5 h-9"
                        onClick={() => handleCopyLink(template.id || '')}
                      >
                        {copiedTemplateId === template.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" /> Tersalin
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-3.5 w-3.5 text-zinc-400" /> Salin Link
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-850 shrink-0 text-zinc-500"
                        title="Duplikat Template"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <CopyPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-850 shrink-0 text-zinc-500"
                        title="Edit Template"
                        onClick={() => handleStartEdit(template)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/20 shrink-0 text-zinc-400"
                        title="Hapus Template"
                        onClick={() => handleDeleteTemplate(template.id || '')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUESTION BUILDER MODAL */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="rounded-2xl max-w-md bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingQuestionIdx !== null ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Kustom'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Konfigurasi tipe input, validasi, dan label untuk pertanyaan brief.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title / Question */}
            <div className="space-y-1.5">
              <Label htmlFor="qTitle" className="text-xs font-bold">Label Pertanyaan *</Label>
              <Input
                id="qTitle"
                value={qTitle}
                onChange={(e) => {
                  setQTitle(e.target.value);
                  // Auto-generate ID if it's a new question
                  if (editingQuestionIdx === null) {
                    setQId(e.target.value.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_').substring(0, 30));
                  }
                }}
                placeholder="Contoh: Apa target pasar utama Anda?"
                className="rounded-xl text-xs"
              />
            </div>

            {/* Unique ID */}
            <div className="space-y-1.5">
              <Label htmlFor="qId" className="text-xs font-bold">ID Pertanyaan (Unik, Alfanumerik) *</Label>
              <Input
                id="qId"
                value={qId}
                onChange={(e) => setQId(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="Contoh: target_pasar"
                disabled={editingQuestionIdx !== null}
                className="rounded-xl text-xs font-mono text-rose-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="qDesc" className="text-xs font-bold">Deskripsi Tambahan / Petunjuk (Opsional)</Label>
              <Input
                id="qDesc"
                value={qDescription}
                onChange={(e) => setQDescription(e.target.value)}
                placeholder="Penjelasan ringkas cara menjawab pertanyaan ini..."
                className="rounded-xl text-xs"
              />
            </div>

            {/* Grid Layout & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tipe Input</Label>
                <Select value={qType} onValueChange={(v) => setQType(v as QuestionType)}>
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text (Isian Singkat)</SelectItem>
                    <SelectItem value="textarea">Textarea (Paragraf)</SelectItem>
                    <SelectItem value="number">Number (Angka)</SelectItem>
                    <SelectItem value="url">URL Link (Tautan Web)</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="select">Dropdown (Pilihan Tunggal)</SelectItem>
                    <SelectItem value="multiselect">Multi-select (Pilihan Ganda)</SelectItem>
                    <SelectItem value="radio">Radio Button (Pilihan Tunggal)</SelectItem>
                    <SelectItem value="switch">Switch (Ya/Tidak)</SelectItem>
                    <SelectItem value="file-upload">Upload File</SelectItem>
                    <SelectItem value="tags">Tags Input</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Halaman Seksi</Label>
                <Select value={qSection} onValueChange={(v) => setQSection(v as WizardSection)}>
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Pilih seksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Informasi Bisnis</SelectItem>
                    <SelectItem value="goals">Tujuan Proyek</SelectItem>
                    <SelectItem value="audience">Target Pasar</SelectItem>
                    <SelectItem value="branding">Aset Branding</SelectItem>
                    <SelectItem value="features">Fitur Website</SelectItem>
                    <SelectItem value="design">Estetika Desain</SelectItem>
                    <SelectItem value="assets">Aset Desain & File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Width Layout & Required */}
            <div className="flex items-center justify-between border-t border-b border-zinc-100 dark:border-zinc-800 py-3 my-2">
              <div className="flex items-center gap-2">
                <Switch id="qReq" checked={qRequired} onCheckedChange={setQRequired} />
                <Label htmlFor="qReq" className="text-xs font-bold cursor-pointer">Wajib Diisi (Required)</Label>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold shrink-0">Lebar Input</Label>
                <Select value={qWidth} onValueChange={(v) => setQWidth(v as 'full' | 'half')}>
                  <SelectTrigger className="rounded-lg text-xs w-28 h-8">
                    <SelectValue placeholder="Pilih lebar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Lebar Penuh</SelectItem>
                    <SelectItem value="half">Setengah (Kolom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options list if Select/Radio/Multiselect */}
            {['select', 'multiselect', 'radio'].includes(qType) && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="qOpts" className="text-xs font-bold">Opsi Pilihan (Format: Label:value, pisahkan dengan koma)</Label>
                <Input
                  id="qOpts"
                  value={qOptionsRaw}
                  onChange={(e) => setQOptionsRaw(e.target.value)}
                  placeholder="Contoh: Ya:yes, Tidak:no, Mungkin:maybe"
                  className="rounded-xl text-xs"
                />
                <p className="text-[9px] text-muted-foreground leading-normal">
                  Masukkan label opsi diikuti titik dua (:) dan nilai database. Pisahkan setiap opsi dengan tanda koma (,).
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsQuestionModalOpen(false)} className="rounded-xl text-xs font-bold">
              Batal
            </Button>
            <Button size="sm" onClick={handleSaveQuestion} className="rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
              Simpan Pertanyaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

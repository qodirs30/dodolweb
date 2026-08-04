'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormEngine } from '@/features/wizard/hooks/useFormEngine';
import { QuestionRenderer } from '@/features/wizard/components/QuestionRenderer';
import { WIZARD_SECTIONS, WizardSection, SectionMetadata, Question } from '@/types/wizard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectService } from '@/services/project/ProjectService';
import { StorageService } from '@/services/upload/StorageService';

// Helper to render Lucide icons dynamically
const SectionIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export default function StartBriefPage() {
  const router = useRouter();
  const [customQuestions, setCustomQuestions] = useState<Question[] | undefined>(undefined);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tid = searchParams.get('template');
      if (tid) {
        setTemplateId(tid);
        setLoadingTemplate(true);
        // Dynamically import TemplateService to avoid static compilation errors
        import('@/services/template/TemplateService')
          .then(({ TemplateService }) => TemplateService.getTemplate(tid))
          .then((tmpl) => {
            if (tmpl && tmpl.questions) {
              setCustomQuestions(tmpl.questions);
            }
          })
          .catch((err) => {
            console.error('Failed to load dynamic template:', err);
          })
          .finally(() => {
            setLoadingTemplate(false);
          });
      }
    }
  }, []);

  const {
    currentSection,
    visibleSectionQuestions,
    allQuestions,
    allAnswers,
    control,
    register,
    setValue,
    watch,
    errors,
    progress,
    nextSection,
    prevSection,
    goToSection,
    clearDraft,
    isLoaded,
  } = useFormEngine(customQuestions);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isLoaded || loadingTemplate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Icons.Loader2 className="h-8 w-8 animate-spin text-zinc-600 dark:text-zinc-400" />
          <p className="text-sm font-medium text-muted-foreground">Loading onboarding wizard...</p>
        </div>
      </div>
    );
  }

  // Handle final brief submission
  // Handle final brief submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // 1. Sanitize answers to remove raw File objects so Firestore serialization doesn't fail
      const sanitizedAnswers = { ...allAnswers };
      const fileFields = ['upload_logo_files', 'upload_brand_guidelines_files', 'upload_reference_assets'];
      
      fileFields.forEach((field) => {
        if (sanitizedAnswers[field]) {
          // Replace raw File list with placeholder to denote presence
          sanitizedAnswers[field] = Array.isArray(sanitizedAnswers[field])
            ? sanitizedAnswers[field].filter((f: any) => f instanceof File).map((f: File) => f.name)
            : [];
        }
      });

      // 2. Create project document in Firestore and get Human/Doc IDs
      const { docId, projectId } = await ProjectService.createProject(
        sanitizedAnswers,
        allQuestions,
        templateId || undefined
      );

      // 3. Upload files to Firebase Storage and write metadata to project uploads subcollection
      const uploadPromises: Promise<any>[] = [];

      if (Array.isArray(allAnswers.upload_logo_files)) {
        allAnswers.upload_logo_files
          .filter((file: any) => file instanceof File)
          .forEach((file: File) => {
            uploadPromises.push(
              StorageService.uploadFile(docId, projectId, file, 'logo', 'Client')
            );
          });
      }

      if (Array.isArray(allAnswers.upload_brand_guidelines_files)) {
        allAnswers.upload_brand_guidelines_files
          .filter((file: any) => file instanceof File)
          .forEach((file: File) => {
            uploadPromises.push(
              StorageService.uploadFile(docId, projectId, file, 'brand-guide', 'Client')
            );
          });
      }

      if (Array.isArray(allAnswers.upload_reference_assets)) {
        allAnswers.upload_reference_assets
          .filter((file: any) => file instanceof File)
          .forEach((file: File) => {
            uploadPromises.push(
              StorageService.uploadFile(docId, projectId, file, 'reference', 'Client')
            );
          });
      }

      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // 4. Trigger Gemini AI requirement analysis in the background
      // We call the API route asynchronously (fire and forget) so it does not block the UI redirection
      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId }),
      }).catch((err) => console.error('Background AI trigger error:', err));

      // 5. Save answers in session storage for success page summary display
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('last_submitted_brief', JSON.stringify(allAnswers));
      }
      
      // 6. Clear local storage draft
      clearDraft();
      
      router.push('/success');
    } catch (e: any) {
      console.error('Submission error:', e);
      setSubmitError(e.message || 'An error occurred while submitting your brief.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSectionMeta = WIZARD_SECTIONS.find((s) => s.id === currentSection) as SectionMetadata;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/30 dark:bg-zinc-950">
      {/* Onboarding Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" className="h-7 w-7 object-contain rounded-lg" alt="Logo" />
              <span className="font-bold tracking-tight text-sm text-zinc-900 dark:text-zinc-50">
                qRSEngine
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-zinc-500">Draft Autosaved</span>
            </div>
          </div>

          <div className="w-full md:w-80 flex items-center gap-3">
            <Progress value={progress.percentage} className="h-2 flex-1" />
            <span className="text-[11px] font-semibold tabular-nums text-zinc-600 shrink-0">
              {progress.percentage}% Complete ({progress.estimatedMinutesRemaining} min left)
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto max-w-7xl px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-28 flex flex-col gap-1">
            {WIZARD_SECTIONS.map((sec, idx) => {
              const isActive = sec.id === currentSection;
              const isFuture = WIZARD_SECTIONS.findIndex((s) => s.id === currentSection) < idx;

              return (
                <button
                  key={sec.id}
                  disabled={isFuture}
                  onClick={() => goToSection(sec.id)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-xs font-semibold',
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800'
                      : isFuture
                      ? 'text-zinc-400 cursor-not-allowed'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  )}
                >
                  <SectionIcon name={sec.icon} className="h-4 w-4" />
                  <span>{sec.title}</span>
                  {!isFuture && sec.id !== currentSection && (
                    <Icons.CheckCircle2 className="h-4 w-4 ml-auto text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Wizard Main Panel */}
        <main className="flex-1 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {/* Step Title & Header */}
              {currentSection !== 'welcome' && currentSection !== 'review' && (
                <div className="pb-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-semibold text-zinc-500 uppercase">
                      Section {WIZARD_SECTIONS.findIndex((s) => s.id === currentSection) + 1} of {WIZARD_SECTIONS.length}
                    </Badge>
                    <h2 className="text-2xl font-bold tracking-tight mt-1 text-zinc-900 dark:text-zinc-50">
                      {currentSectionMeta.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentSectionMeta.description}
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-700 dark:text-zinc-200">
                    <SectionIcon name={currentSectionMeta.icon} className="h-6 w-6" />
                  </div>
                </div>
              )}

              {/* Dynamic Content Form */}
              {currentSection === 'review' ? (
                // REVIEW STEP
                <div className="flex flex-col gap-6">
                  <div className="pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      Review Your Project Brief
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Please look through all your answers before submitting them to our team. You can click on any section header to edit details.
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                    {WIZARD_SECTIONS.filter((s) => s.id !== 'welcome' && s.id !== 'review').map((sec) => {
                      const secQuestions = allQuestions.filter((q) => q.section === sec.id);
                      return (
                        <Card key={sec.id} className="rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                          <div className="bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              <SectionIcon name={sec.icon} className="h-4 w-4 text-zinc-500" />
                              {sec.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-xs font-semibold text-blue-500 hover:text-blue-600"
                              onClick={() => goToSection(sec.id)}
                            >
                              Edit Section
                            </Button>
                          </div>
                          <CardContent className="p-5 divide-y divide-zinc-100 dark:divide-zinc-900">
                            {secQuestions.map((q) => {
                              const value = allAnswers[q.id];
                              const isOther = allAnswers[`${q.id}_other`];
                              
                              if (q.type === 'heading' || q.type === 'divider') return null;

                              let displayVal = '—';
                              if (value !== undefined && value !== null && value !== '') {
                                if (Array.isArray(value)) {
                                  displayVal = value.map((v) => {
                                    const opt = q.options?.find((o) => o.value === v);
                                    return opt ? opt.label : v;
                                  }).join(', ');
                                } else if (typeof value === 'boolean') {
                                  displayVal = value ? 'Yes' : 'No';
                                } else {
                                  const opt = q.options?.find((o) => o.value === value);
                                  displayVal = opt ? opt.label : String(value);
                                }
                              }

                              return (
                                <div key={q.id} className="py-3 flex flex-col gap-1 first:pt-0 last:pb-0">
                                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{q.title}</span>
                                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {displayVal}
                                    {isOther && <span className="block text-xs font-normal text-muted-foreground italic mt-0.5">({isOther})</span>}
                                  </span>
                                </div>
                              );
                            })}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {submitError && (
                    <Alert variant="destructive" className="rounded-xl mt-4">
                      <Icons.AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                // STANDARD STEP
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  {visibleSectionQuestions.map((q) => (
                    <QuestionRenderer
                      key={q.id}
                      question={q}
                      control={control}
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                    />
                  ))}
                </div>
              )}

              {/* Step Navigation Footer */}
              <div className="mt-12 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                {currentSection !== 'welcome' ? (
                  <Button
                    variant="outline"
                    onClick={prevSection}
                    disabled={isSubmitting}
                    className="h-11 px-6 rounded-full border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentSection === 'review' ? (
                  <Button
                    size="lg"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="h-11 px-8 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Project Brief'
                    )}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={nextSection}
                    className="h-11 px-8 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold ml-auto"
                  >
                    {currentSection === 'welcome' ? 'Let\'s Start' : 'Next'}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WizardSection, WIZARD_SECTIONS, Question, WizardDraft } from '@/types/wizard';
import { websiteBriefQuestions } from '../configs/website-brief';
import { evaluateCondition, calculateProgress } from '@/utils/wizard';

const LOCAL_STORAGE_KEY = 'wpb_wizard_draft';
const SCHEMA_VERSION = 1;

export function useFormEngine() {
  const [currentSection, setCurrentSection] = useState<WizardSection>('welcome');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const allAnswers = watch();

  // Load draft from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const draft: WizardDraft = JSON.parse(saved);
          if (draft.schemaVersion === SCHEMA_VERSION) {
            reset(draft.answers);
            setCurrentSection(draft.currentSection);
          }
        }
      } catch (e) {
        console.error('Error loading draft from localStorage:', e);
      }
      setIsLoaded(true);
    }
  }, [reset]);

  // Autosave to local storage on answers/section change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      const draft: WizardDraft = {
        draftId: 'draft-1',
        currentSection,
        answers: allAnswers,
        timestamp: Date.now(),
        schemaVersion: SCHEMA_VERSION,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [allAnswers, currentSection, isLoaded]);

  // Filter questions for the current section
  const sectionQuestions = websiteBriefQuestions.filter((q) => q.section === currentSection);

  // Filter visible questions in the current section
  const visibleSectionQuestions = sectionQuestions.filter((q) =>
    evaluateCondition(q.condition, allAnswers)
  );

  // Evaluate visible questions across the whole form for progress bar
  const progress = calculateProgress(websiteBriefQuestions, allAnswers, currentSection);

  // Navigation handlers
  const nextSection = async () => {
    // Get fields in the current section
    const currentFields = visibleSectionQuestions.map((q) => q.id);
    
    // Trigger validation for current section fields
    const isStepValid = await trigger(currentFields);
    
    if (!isStepValid) return false;

    const currentIndex = WIZARD_SECTIONS.findIndex((s) => s.id === currentSection);
    if (currentIndex < WIZARD_SECTIONS.length - 1) {
      const nextSec = WIZARD_SECTIONS[currentIndex + 1].id;
      setCurrentSection(nextSec);
      window.scrollTo(0, 0);
      return true;
    }
    return false;
  };

  const prevSection = () => {
    const currentIndex = WIZARD_SECTIONS.findIndex((s) => s.id === currentSection);
    if (currentIndex > 0) {
      const prevSec = WIZARD_SECTIONS[currentIndex - 1].id;
      setCurrentSection(prevSec);
      window.scrollTo(0, 0);
      return true;
    }
    return false;
  };

  const goToSection = async (sectionId: WizardSection) => {
    const targetIndex = WIZARD_SECTIONS.findIndex((s) => s.id === sectionId);
    const currentIndex = WIZARD_SECTIONS.findIndex((s) => s.id === currentSection);

    // If jumping forward, validate current section first
    if (targetIndex > currentIndex) {
      const currentFields = visibleSectionQuestions.map((q) => q.id);
      const isStepValid = await trigger(currentFields);
      if (!isStepValid) return false;
    }

    setCurrentSection(sectionId);
    window.scrollTo(0, 0);
    return true;
  };

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    reset({});
    setCurrentSection('welcome');
  };

  return {
    currentSection,
    visibleSectionQuestions,
    allQuestions: websiteBriefQuestions,
    allAnswers,
    control,
    register,
    setValue,
    watch,
    errors,
    trigger,
    isValid,
    progress,
    nextSection,
    prevSection,
    goToSection,
    clearDraft,
    isLoaded,
  };
}

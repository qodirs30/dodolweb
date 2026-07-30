import { Question, QuestionOption, Condition, WizardSection, WIZARD_SECTIONS } from '@/types/wizard';

export function createQuestion(question: Question): Question {
  return {
    width: 'full',
    required: false,
    ...question,
  };
}

export function createOption(option: QuestionOption): QuestionOption {
  return option;
}

export function evaluateCondition(condition: Condition | undefined, answers: Record<string, any>): boolean {
  if (!condition) return true;

  if (condition.and) {
    return condition.and.every((cond) => evaluateCondition(cond, answers));
  }

  if (condition.or) {
    return condition.or.some((cond) => evaluateCondition(cond, answers));
  }

  const fieldValue = answers[condition.field];
  const value = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === value;
    case 'notEquals':
      return fieldValue !== value;
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      if (typeof fieldValue === 'string') {
        return fieldValue.includes(value);
      }
      return false;
    case 'notContains':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value);
      }
      if (typeof fieldValue === 'string') {
        return !fieldValue.includes(value);
      }
      return true;
    case 'greaterThan':
      return Number(fieldValue) > Number(value);
    case 'lessThan':
      return Number(fieldValue) < Number(value);
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(fieldValue);
    case 'truthy':
      return !!fieldValue;
    case 'falsy':
      return !fieldValue;
    default:
      return true;
  }
}

export interface ProgressResult {
  completedCount: number;
  visibleCount: number;
  percentage: number;
  estimatedMinutesRemaining: number;
}

export function calculateProgress(
  questions: Question[],
  answers: Record<string, any>,
  currentSection: WizardSection
): ProgressResult {
  // Filter questions that are visible based on conditions
  const visibleQuestions = questions.filter(
    (q) => q.section !== 'welcome' && q.section !== 'review' && evaluateCondition(q.condition, answers)
  );

  // Count how many visible questions are filled
  let completedCount = 0;
  visibleQuestions.forEach((q) => {
    const val = answers[q.id];
    const hasValue =
      val !== undefined &&
      val !== null &&
      val !== '' &&
      (!Array.isArray(val) || val.length > 0) &&
      (typeof val !== 'object' || Object.keys(val).length > 0);

    if (hasValue) {
      completedCount++;
    }
  });

  const visibleCount = visibleQuestions.length;
  const percentage = visibleCount > 0 ? Math.round((completedCount / visibleCount) * 100) : 0;

  // Estimate time remaining:
  // Each incomplete visible question is estimated to take ~0.5 minutes (30 seconds)
  const incompleteCount = visibleCount - completedCount;
  const estimatedMinutesRemaining = Math.max(1, Math.ceil(incompleteCount * 0.5));

  return {
    completedCount,
    visibleCount,
    percentage,
    estimatedMinutesRemaining,
  };
}

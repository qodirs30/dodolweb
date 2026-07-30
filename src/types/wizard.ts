export type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'currency'
  | 'date'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'card-selector'
  | 'color-picker'
  | 'file-upload'
  | 'image-upload'
  | 'rating'
  | 'slider'
  | 'tags'
  | 'repeater'
  | 'section-header' // Visual components
  | 'divider'
  | 'heading'
  | 'paragraph';

export interface Condition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'truthy' | 'falsy';
  value?: any;
  and?: Condition[];
  or?: Condition[];
}

export interface QuestionOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
  color?: string;
  followUpQuestions?: Question[];
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string; // Regex string
  message?: string; // Custom error message
  email?: boolean;
  phone?: boolean;
  url?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule;
  section: WizardSection; // The human-readable section it belongs to
  options?: QuestionOption[];
  condition?: Condition;
  defaultValue?: any;
  helpText?: string;
  hint?: string;
  icon?: string;
  width?: 'full' | 'half' | 'third' | 'quarter'; // Layout engine
  order?: number;
  metadata?: Record<string, any>;
}

export type WizardSection =
  | 'welcome'
  | 'business'
  | 'goals'
  | 'audience'
  | 'branding'
  | 'features'
  | 'design'
  | 'assets'
  | 'review';

export interface SectionMetadata {
  id: WizardSection;
  title: string;
  icon: string;
  description: string;
  estimatedMinutes: number;
}

export interface WizardDraft {
  draftId: string;
  currentSection: WizardSection;
  answers: Record<string, any>;
  timestamp: number;
  schemaVersion: number;
}

export const WIZARD_SECTIONS: SectionMetadata[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    icon: 'Hand',
    description: 'Introduction to the project brief onboarding.',
    estimatedMinutes: 1,
  },
  {
    id: 'business',
    title: 'Business',
    icon: 'Building',
    description: 'Tell us about your company and industry.',
    estimatedMinutes: 2,
  },
  {
    id: 'goals',
    title: 'Goals',
    icon: 'Target',
    description: 'Define your website goals and reference samples.',
    estimatedMinutes: 2,
  },
  {
    id: 'audience',
    title: 'Audience',
    icon: 'Users',
    description: 'Understand who your users and competitors are.',
    estimatedMinutes: 2,
  },
  {
    id: 'branding',
    title: 'Branding',
    icon: 'Palette',
    description: 'Asset readiness like logo and brand guidelines.',
    estimatedMinutes: 2,
  },
  {
    id: 'features',
    title: 'Features',
    icon: 'Cpu',
    description: 'Select dynamic pages and integrations needed.',
    estimatedMinutes: 2,
  },
  {
    id: 'design',
    title: 'Design',
    icon: 'Sparkles',
    description: 'Select visual preferences and styling options.',
    estimatedMinutes: 2,
  },
  {
    id: 'assets',
    title: 'Assets',
    icon: 'UploadCloud',
    description: 'Upload logos, references, and documentation.',
    estimatedMinutes: 2,
  },
  {
    id: 'review',
    title: 'Review',
    icon: 'CheckCircle',
    description: 'Audit your brief inputs and submit the details.',
    estimatedMinutes: 1,
  },
];

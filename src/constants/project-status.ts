export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'review'
  | 'quotation'
  | 'approved'
  | 'development'
  | 'revision'
  | 'completed'
  | 'cancelled';

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  REVIEW: 'review',
  QUOTATION: 'quotation',
  APPROVED: 'approved',
  DEVELOPMENT: 'development',
  REVISION: 'revision',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export interface StatusConfig {
  label: string;
  color: string; // Tailwind color class for bg/text
  borderColor: string;
  description: string;
}

export const PROJECT_STATUS_CONFIGS: Record<ProjectStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    borderColor: 'border-gray-200 dark:border-gray-700',
    description: 'Project brief is in draft mode and not yet submitted.',
  },
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    borderColor: 'border-blue-100 dark:border-blue-900',
    description: 'Brief has been submitted by the client and is awaiting review.',
  },
  review: {
    label: 'Under Review',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    borderColor: 'border-amber-100 dark:border-amber-900',
    description: 'Agency is currently reviewing and analyzing requirements.',
  },
  quotation: {
    label: 'Quotation Prepared',
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    borderColor: 'border-purple-100 dark:border-purple-900',
    description: 'Project scope is estimated and a proposal quotation has been generated.',
  },
  approved: {
    label: 'Approved',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    borderColor: 'border-emerald-100 dark:border-emerald-900',
    description: 'Client approved the proposal, agreement signed.',
  },
  development: {
    label: 'In Development',
    color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    borderColor: 'border-indigo-100 dark:border-indigo-900',
    description: 'Development team is currently building the website.',
  },
  revision: {
    label: 'In Revision',
    color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    borderColor: 'border-pink-100 dark:border-pink-900',
    description: 'Client feedback is being implemented.',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    borderColor: 'border-green-100 dark:border-green-900',
    description: 'Project completed successfully and site is live.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    borderColor: 'border-rose-100 dark:border-rose-900',
    description: 'Project brief or setup has been cancelled.',
  },
};

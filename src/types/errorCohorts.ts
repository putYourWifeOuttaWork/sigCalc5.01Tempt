export const ERROR_TYPES = {
  SYNC_API: 'Sync API Errors',
  SYNC_GOV: 'Sync GovLimits',
  ASYNC_GOV: 'Async GovLimits',
  CONCURRENT_API: 'Concurrent API Errors',
  CONCURRENT_UI: 'Concurrent UI Errors',
  CONCURRENT_SERVER: 'Concurrent Server-Side Errors'
} as const;

export const ERROR_AREAS = {
  LEAD: 'Lead',
  LISTVIEWS: 'ListViews',
  OPPORTUNITY: 'Opportunity',
  ACCOUNT: 'Account',
  CONTACT: 'Contact',
  QUOTE: 'Quote',
  DISPATCH: 'Dispatch',
  CASE: 'Case',
  WORK_ORDER: 'Work Order',
  BATCH_JOB: 'BatchJob',
  FUTURES: 'Futures',
  QUEUEABLES: 'Queueables',
  CUSTOM_OBJECT: 'Custom Object',
  OTHER: 'Other'
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];
export type ErrorArea = typeof ERROR_AREAS[keyof typeof ERROR_AREAS];

export interface ErrorCohort {
  id: string;
  type: ErrorType;
  area: ErrorArea;
  color: string;
  label: string;
}

export interface ErrorCohortData extends ErrorCohort {
  value: number;
  date: string;
}
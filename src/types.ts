export interface CalculationResult {
  role: string;
  cost: number;
  expectedTasks: number;
  tasksPerDay: number;
  maxClicksPerDay: number;
  productivity: number;
  valueProduced: number;
  expectedValue: number;
  trueCost: number;
  totalRoleValue: number;
  employees: number;
  experience: 'Beginner' | 'Seasoned' | 'Expert';
  isHoursMode?: boolean;
  hoursPerDay?: number;
  expectedHours?: number;
  hoursDifference?: number;
  annualHoursDifference?: number;
  isFullTime?: boolean;
  workingDaysPerYear?: number;
  calculationDate: string;
  ept: number;
  clicksPerTask: number;
}

export interface ErrorCalculationResult {
  errorType: keyof typeof ERROR_TYPE_DISTRACTION_MINUTES;
  errorArea: keyof typeof ERROR_AREAS;
  wage: number;
  dailyHours: number;
  isFullTime: boolean;
  isHoursMode: boolean;
  weeklyErrors: number;
  annualErrors: number;
  distractionTimePerError: number;
  annualWorkHours: number;
  totalDistractionTime: number;
  netProductiveTime: number;
  productivityLoss: number;
  maxAchievableProductivity: number;
  expectedAnnualHours: number;
  maxAchievableHours: number;
  errorImpactHours: number;
  trueLaborCost: number;
  productiveHours: number;
  employees: number;
  standardHoursPerDay: number;
  errorsPerUser: number;
  errorsPerDay: number;
  dailyDistractionHours: number;
  calculationDate: string;
  workingDays: number;
}

export const ERROR_TYPE_DISTRACTION_MINUTES = {
  'Blended - All Errors': 15,
  'Core Clouds - UI': 20,
  'Customer-Facing - UI': 20,
  'Batch Errors - Async': 2,
  'Call-Outs - Async': 2
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

export const ROLE_DEFAULTS = {
  'Licensed Users - Blended': {
    tasksPerDay: 75,
    clicksPerTask: 40
  },
  'Service Agent': {
    tasksPerDay: 80,
    clicksPerTask: 30
  },
  'Sales Development Rep': {
    tasksPerDay: 60,
    clicksPerTask: 45
  },
  'Account Executive': {
    tasksPerDay: 40,
    clicksPerTask: 60
  }
} as const;
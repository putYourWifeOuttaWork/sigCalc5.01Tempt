import { ERROR_TYPES, ERROR_AREAS, ErrorCohort } from '../types/errorCohorts';
import { getErrorCohortColor } from './colorSystem';

// Generate all possible cohort combinations
export function generateErrorCohorts(): ErrorCohort[] {
  const cohorts: ErrorCohort[] = [];

  Object.values(ERROR_TYPES).forEach(type => {
    Object.values(ERROR_AREAS).forEach(area => {
      const id = `${type.toLowerCase().replace(/\s+/g, '-')}_${area.toLowerCase().replace(/\s+/g, '-')}`;
      const color = getErrorCohortColor(type, area);
      
      cohorts.push({
        id,
        type,
        area,
        color,
        label: `${type} - ${area}`
      });
    });
  });

  return cohorts;
}

// Group cohort data by type
export function groupCohortsByType(cohorts: ErrorCohort[]): Record<string, ErrorCohort[]> {
  return cohorts.reduce((acc, cohort) => {
    if (!acc[cohort.type]) {
      acc[cohort.type] = [];
    }
    acc[cohort.type].push(cohort);
    return acc;
  }, {} as Record<string, ErrorCohort[]>);
}

// Group cohort data by area
export function groupCohortsByArea(cohorts: ErrorCohort[]): Record<string, ErrorCohort[]> {
  return cohorts.reduce((acc, cohort) => {
    if (!acc[cohort.area]) {
      acc[cohort.area] = [];
    }
    acc[cohort.area].push(cohort);
    return acc;
  }, {} as Record<string, ErrorCohort[]>);
}

// Filter cohorts by type and/or area
export function filterCohorts(
  cohorts: ErrorCohort[],
  type?: string,
  area?: string
): ErrorCohort[] {
  return cohorts.filter(cohort => {
    if (type && area) {
      return cohort.type === type && cohort.area === area;
    }
    if (type) {
      return cohort.type === type;
    }
    if (area) {
      return cohort.area === area;
    }
    return true;
  });
}
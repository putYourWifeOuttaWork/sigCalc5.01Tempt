import React from 'react';
import { ErrorCohort } from '../types/errorCohorts';

interface ErrorCohortLegendProps {
  cohorts: ErrorCohort[];
  onCohortClick?: (cohort: ErrorCohort) => void;
  selectedCohorts?: Set<string>;
}

export function ErrorCohortLegend({
  cohorts,
  onCohortClick,
  selectedCohorts
}: ErrorCohortLegendProps) {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {cohorts.map((cohort) => (
        <div
          key={cohort.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm 
            ${onCohortClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            ${selectedCohorts?.has(cohort.id) ? 'bg-gray-50 ring-2 ring-gray-200' : ''}`}
          onClick={() => onCohortClick?.(cohort)}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: cohort.color }}
          />
          <span className="text-gray-700">{cohort.label}</span>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { ERROR_TYPES, ERROR_AREAS, ErrorType, ErrorArea } from '../../types/errorCohorts';

interface ErrorCohortSelectProps {
  selectedType: ErrorType;
  selectedArea: ErrorArea;
  onTypeChange: (type: ErrorType) => void;
  onAreaChange: (area: ErrorArea) => void;
}

export function ErrorCohortSelect({
  selectedType,
  selectedArea,
  onTypeChange,
  onAreaChange
}: ErrorCohortSelectProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Error Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as ErrorType)}
          className="select-field"
        >
          {Object.values(ERROR_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Error Area
        </label>
        <select
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value as ErrorArea)}
          className="select-field"
        >
          {Object.values(ERROR_AREAS).map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
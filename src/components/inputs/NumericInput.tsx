import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  label: string;
  tooltip?: string;
  error?: string;
  className?: string;
}

export function NumericInput({
  value,
  onChange,
  min = 5,
  max = 250,
  label,
  tooltip,
  error,
  className = ''
}: NumericInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (newValue === '') {
      setShowError(true);
      return;
    }

    const numValue = parseInt(newValue, 10);
    if (isNaN(numValue)) {
      setShowError(true);
      return;
    }

    if (numValue < min || numValue > max) {
      setShowError(true);
      return;
    }

    setShowError(false);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (localValue === '') {
      setLocalValue(value);
      setShowError(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltip}>
            ⓘ
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
        {showError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {showError && (
        <p className="text-sm text-red-600 mt-1">
          Must be between {min} and {max}
        </p>
      )}
    </div>
  );
}
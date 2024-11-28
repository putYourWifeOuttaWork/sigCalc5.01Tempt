import React from 'react';
import { ErrorCalculationResult } from '../../types';
import { ErrorFrequencyChart } from './ErrorFrequencyChart';
import { ProductivityImpactChart } from './ProductivityImpactChart';
import { ImpactMatrixChart } from './ImpactMatrixChart';
import { FileDown } from 'lucide-react';
import { exportCharts } from '../../utils/exportCharts';

interface ErrorAnalyticsDashboardProps {
  results: ErrorCalculationResult[];
}

export function ErrorAnalyticsDashboard({ results }: ErrorAnalyticsDashboardProps) {
  if (!results.length) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => exportCharts('pdf')}
          className="btn-secondary text-sm px-3 py-2"
        >
          <FileDown size={16} className="mr-1" />
          Export Charts to PDF
        </button>
      </div>
      <ErrorFrequencyChart results={results} />
      <ProductivityImpactChart results={results} />
      <ImpactMatrixChart results={results} />
    </div>
  );
}
<content>// Previous imports remain the same...

export function ErrorAnalyticsDashboard({ results }: ErrorAnalyticsDashboardProps) {
  if (!results.length) return null;

  return (
    <div className="space-y-8">
      <div className="chart-container">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Error Frequency Trend</h3>
            <p className="text-sm text-gray-500">Annual errors per user by type over time</p>
          </div>
          <button
            onClick={() => exportCharts('pdf')}
            className="btn-secondary text-sm px-3 py-2"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </button>
        </div>
        <ErrorFrequencyChart results={results} />
      </div>

      <div className="chart-container">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Productivity Impact Analysis</h3>
            <p className="text-sm text-gray-500">Maximum productivity loss percentage over time</p>
          </div>
          <button
            onClick={() => exportCharts('pdf')}
            className="btn-secondary text-sm px-3 py-2"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </button>
        </div>
        <ProductivityImpactChart results={results} />
      </div>

      <div className="chart-container">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Impact Matrix</h3>
            <p className="text-sm text-gray-500">Hours lost and financial impact per user over time</p>
          </div>
          <button
            onClick={() => exportCharts('pdf')}
            className="btn-secondary text-sm px-3 py-2"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </button>
        </div>
        <ImpactMatrixChart results={results} />
      </div>
    </div>
  );
}</content>
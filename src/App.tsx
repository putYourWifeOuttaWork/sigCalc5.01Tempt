import React, { useState, useRef, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ErrorCalculatorForm } from './components/ErrorCalculatorForm';
import { ErrorResultsDisplay } from './components/ErrorResultsDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EPTTrendChart } from './components/charts/EPTTrendChart';
import { ProductivityTrendChart } from './components/charts/ProductivityTrendChart';
import { ProductivityImpactDifferentialsChart } from './components/charts/ProductivityImpactDifferentialsChart';
import { ErrorAnalyticsDashboard } from './components/charts/ErrorAnalyticsDashboard';
import { FileText, Download, FileDown, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { exportCharts } from './utils/exportCharts';
import { CalculationResult, ErrorCalculationResult } from './types';

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formCount, setFormCount] = useState(1);
  const [errorFormCount, setErrorFormCount] = useState(1);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [errorResults, setErrorResults] = useState<ErrorCalculationResult[]>([]);
  const [showTrend, setShowTrend] = useState(false);
  const [showErrorTrend, setShowErrorTrend] = useState(false);
  const [lastCalculatedValues, setLastCalculatedValues] = useState<Partial<CalculationResult> | null>(null);
  const [lastCalculatedErrorValues, setLastCalculatedErrorValues] = useState<Partial<ErrorCalculationResult> | null>(null);
  const [lastCalculatedIndex, setLastCalculatedIndex] = useState<number | null>(null);
  const [lastCalculatedErrorIndex, setLastCalculatedErrorIndex] = useState<number | null>(null);

  const citationsRef = useRef<HTMLDetailsElement>(null);
  const calculatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resultsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const errorCalculatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const errorResultsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trendsRef = useRef<HTMLDivElement>(null);
  const errorTrendsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastCalculatedIndex !== null && resultsRefs.current[lastCalculatedIndex]) {
      setTimeout(() => {
        resultsRefs.current[lastCalculatedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      setLastCalculatedIndex(null);
    }
  }, [lastCalculatedIndex, results]);

  useEffect(() => {
    if (lastCalculatedErrorIndex !== null && errorResultsRefs.current[lastCalculatedErrorIndex]) {
      setTimeout(() => {
        errorResultsRefs.current[lastCalculatedErrorIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      setLastCalculatedErrorIndex(null);
    }
  }, [lastCalculatedErrorIndex, errorResults]);

  const handleAddForm = () => {
    setFormCount(prev => prev + 1);
    setTimeout(() => {
      const lastCalculatorRef = calculatorRefs.current[formCount];
      if (lastCalculatorRef) {
        lastCalculatorRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleAddErrorForm = () => {
    setErrorFormCount(prev => prev + 1);
    setTimeout(() => {
      const lastCalculatorRef = errorCalculatorRefs.current[errorFormCount];
      if (lastCalculatorRef) {
        lastCalculatorRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteForm = (index: number) => {
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
    setFormCount(prev => prev - 1);
  };

  const handleDeleteErrorForm = (index: number) => {
    const newResults = [...errorResults];
    newResults.splice(index, 1);
    setErrorResults(newResults);
    setErrorFormCount(prev => prev - 1);
  };

  const handleCalculate = (result: CalculationResult, index: number) => {
    const newResults = [...results];
    newResults[index] = result;
    setResults(newResults);
    setLastCalculatedIndex(index);
    setLastCalculatedValues({
      role: result.role,
      experience: result.experience,
      cost: result.cost,
      employees: result.employees,
      tasksPerDay: result.tasksPerDay,
      clicksPerTask: result.clicksPerTask,
      ept: result.ept,
      hoursPerDay: result.hoursPerDay,
      isFullTime: result.isFullTime,
      isHoursMode: result.isHoursMode,
      calculationDate: result.calculationDate
    });
  };

  const handleErrorCalculate = (result: ErrorCalculationResult, index: number) => {
    const newResults = [...errorResults];
    newResults[index] = result;
    setErrorResults(newResults);
    setLastCalculatedErrorIndex(index);
    setLastCalculatedErrorValues({
      errorType: result.errorType,
      errorArea: result.errorArea,
      wage: result.wage,
      dailyHours: result.dailyHours,
      isFullTime: result.isFullTime,
      isHoursMode: result.isHoursMode,
      weeklyErrors: result.weeklyErrors,
      employees: result.employees,
      calculationDate: result.calculationDate
    });
  };

  const handleShowTrend = () => {
    setShowTrend(true);
    setTimeout(() => {
      if (trendsRef.current) {
        trendsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleShowErrorTrend = () => {
    setShowErrorTrend(true);
    setTimeout(() => {
      if (errorTrendsRef.current) {
        errorTrendsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const tabPanels = [
    {
      title: "Speed",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="flex gap-4 flex-wrap print:hidden">
            <button
              onClick={handleAddForm}
              className="btn-primary flex items-center gap-2"
            >
              <FileText size={20} />
              Add Role Calculation
            </button>
            
            {results.length > 0 && (
              <>
                <button
                  onClick={() => exportCharts('pdf')}
                  className="btn-primary flex items-center gap-2"
                >
                  <FileDown size={20} />
                  Export Charts to PDF
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'productivity-analysis.csv';
                    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
                      [
                        ['Role', 'Cost/Employee', 'Tasks/Day', 'Productivity %', 'Value Produced', 'True Cost'].join(','),
                        ...results.map(r => 
                          [r.role, r.cost, r.tasksPerDay, r.productivity.toFixed(1), r.valueProduced.toFixed(2), r.trueCost.toFixed(2)].join(',')
                        )
                      ].join('\n')
                    )}`;
                    link.click();
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download size={20} />
                  Export to CSV
                </button>
              </>
            )}
          </div>

          {Array.from({ length: formCount }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div ref={el => calculatorRefs.current[index] = el}>
                <ErrorBoundary>
                  <CalculatorForm 
                    onCalculate={(result) => handleCalculate(result, index)}
                    onDelete={index > 0 ? () => handleDeleteForm(index) : undefined}
                    formIndex={index}
                    resultsRef={{ current: resultsRefs.current[index] }}
                    previousValues={lastCalculatedValues}
                  />
                </ErrorBoundary>
              </div>
              <div ref={el => resultsRefs.current[index] = el}>
                {results[index] && (
                  <ErrorBoundary>
                    <ResultsDisplay 
                      result={results[index]}
                      calculatorRef={{ current: calculatorRefs.current[index] }}
                      onShowTrend={handleShowTrend}
                    />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          ))}

          {results.length > 0 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAddForm}
                className="btn-primary flex items-center gap-2"
              >
                <FileText size={20} />
                Add Role Calculation
              </button>
              <button
                onClick={handleShowTrend}
                className="btn-primary flex items-center gap-2"
              >
                <TrendingUp size={20} />
                Show Trend
              </button>
            </div>
          )}

          {showTrend && results.length > 0 && (
            <div ref={trendsRef} className="space-y-8">
              <ErrorBoundary>
                <EPTTrendChart results={results} />
              </ErrorBoundary>
              <ErrorBoundary>
                <ProductivityTrendChart results={results} />
              </ErrorBoundary>
              <ErrorBoundary>
                <ProductivityImpactDifferentialsChart results={results} />
              </ErrorBoundary>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Errors",
      icon: AlertTriangle,
      content: (
        <div className="space-y-6">
          <div className="flex gap-4 flex-wrap print:hidden">
            <button
              onClick={handleAddErrorForm}
              className="btn-primary flex items-center gap-2"
            >
              <FileText size={20} />
              Add Error Calculator
            </button>

            {errorResults.length > 0 && (
              <>
                <button
                  onClick={() => exportCharts('pdf')}
                  className="btn-primary flex items-center gap-2"
                >
                  <FileDown size={20} />
                  Export Charts to PDF
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'error-impact-analysis.csv';
                    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
                      [
                        ['Error Type', 'Annual Errors', 'Productivity Loss %', 'Hours Lost', 'Financial Impact'].join(','),
                        ...errorResults.map(r => 
                          [r.errorType, r.annualErrors, r.productivityLoss.toFixed(1), r.errorImpactHours.toFixed(1), r.trueLaborCost.toFixed(2)].join(',')
                        )
                      ].join('\n')
                    )}`;
                    link.click();
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download size={20} />
                  Export to CSV
                </button>
              </>
            )}
          </div>

          {Array.from({ length: errorFormCount }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div ref={el => errorCalculatorRefs.current[index] = el}>
                <ErrorBoundary>
                  <ErrorCalculatorForm 
                    onCalculate={(result) => handleErrorCalculate(result, index)}
                    onDelete={index > 0 ? () => handleDeleteErrorForm(index) : undefined}
                    formIndex={index}
                    resultsRef={{ current: errorResultsRefs.current[index] }}
                    previousValues={lastCalculatedErrorValues}
                  />
                </ErrorBoundary>
              </div>
              <div ref={el => errorResultsRefs.current[index] = el}>
                {errorResults[index] && (
                  <ErrorBoundary>
                    <ErrorResultsDisplay 
                      result={errorResults[index]}
                      calculatorRef={{ current: errorCalculatorRefs.current[index] }}
                      onShowTrend={handleShowErrorTrend}
                    />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          ))}

          {errorResults.length > 0 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAddErrorForm}
                className="btn-primary flex items-center gap-2"
              >
                <FileText size={20} />
                Add Error Calculator
              </button>
              <button
                onClick={handleShowErrorTrend}
                className="btn-primary flex items-center gap-2"
              >
                <TrendingUp size={20} />
                Show Trend
              </button>
            </div>
          )}

          {showErrorTrend && errorResults.length > 0 && (
            <div ref={errorTrendsRef}>
              <ErrorBoundary>
                <ErrorAnalyticsDashboard results={errorResults} />
              </ErrorBoundary>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 print:bg-white">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
              {tabPanels.map((tab, index) => (
                <Tab
                  key={tab.title}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                    ${selected 
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-600'
                    } 
                    flex items-center justify-center gap-2 transition-all duration-200`
                  }
                >
                  {React.createElement(tab.icon, { size: 16 })}
                  {tab.title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {tabPanels.map((tab, index) => (
                <Tab.Panel
                  key={index}
                  className={selectedTab === index ? 'block' : 'hidden'}
                >
                  {tab.content}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>

      <Footer citationsRef={citationsRef} />
    </div>
  );
}
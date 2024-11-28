import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart } from 'recharts';
import { ErrorCalculationResult } from '../../types';
import { Switch } from '@headlessui/react';
import { Clock, DollarSign } from 'lucide-react';
import { colorSystem } from '../../utils/colorSystem';

interface ImpactMatrixChartProps {
  results: ErrorCalculationResult[];
}

export function ImpactMatrixChart({ results }: ImpactMatrixChartProps) {
  const [showHoursMode, setShowHoursMode] = useState(true);

  const chartData = React.useMemo(() => {
    // Reset color system for new chart instance
    colorSystem.reset();
    
    const dataMap = new Map<string, { [key: string]: any }>();
    
    results.forEach(result => {
      const date = result.calculationDate;
      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date,
          productivityLoss: result.productivityLoss,
          values: {}
        });
      }
      const cohortKey = `${result.errorType}-${result.errorArea}`;
      const value = showHoursMode 
        ? result.productiveHours
        : result.trueLaborCost;
      dataMap.get(date)!.values[cohortKey] = value;
    });

    const data = Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const cohortKeys = Array.from(new Set(results.map(r => `${r.errorType}-${r.errorArea}`)));

    return { data, cohortKeys };
  }, [results, showHoursMode]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">
          {new Date(label).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
        {payload.map((entry: any) => {
          const isNegative = entry.value < 0;
          const displayValue = Math.abs(entry.value);
          const formattedValue = showHoursMode 
            ? `${isNegative ? '-' : ''}${displayValue.toFixed(1)} hours/year`
            : `${isNegative ? '-' : ''}$${displayValue.toLocaleString()}`;

          return (
            <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{entry.name}:</span>
              <span 
                className="font-medium"
                style={{ color: isNegative ? '#FF0000' : '#00FF00' }}
              >
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Impact Matrix</h3>
          <p className="text-sm text-gray-500">
            {showHoursMode 
              ? 'Optimal productivity performance in hours per user per year'
              : 'Financial impact per user by error type and area'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch.Group>
            <div className="flex items-center gap-2">
              <Switch.Label className="text-sm text-gray-600">
                {showHoursMode ? <Clock size={16} className="inline mr-1" /> : <DollarSign size={16} className="inline mr-1" />}
                {showHoursMode ? 'Hours Mode' : 'Value Mode'}
              </Switch.Label>
              <Switch
                checked={showHoursMode}
                onChange={setShowHoursMode}
                className={`${
                  showHoursMode ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    showHoursMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="87%">
        <ComposedChart 
          data={chartData.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="productivityGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ 
              value: 'Analysis Date', 
              position: 'bottom', 
              offset: 40 
            }}
            tick={{ dy: 10 }}
          />
          <YAxis
            yAxisId="left"
            label={{ 
              value: showHoursMode ? 'Hours/User/Year' : 'Financial Impact ($)', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10 
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Productivity Loss (%)',
              angle: 90,
              position: 'insideRight',
              offset: 10
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '20px',
              marginBottom: '-45px'
            }}
          />
          {chartData.cohortKeys.map(cohortKey => {
            const [errorType, errorArea] = cohortKey.split('-');
            return (
              <Line
                key={cohortKey}
                yAxisId="left"
                type="monotone"
                dataKey={`values.${cohortKey}`}
                name={cohortKey}
                stroke={colorSystem.getColor(errorType, errorArea)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            );
          })}
          <Bar
            yAxisId="right"
            dataKey="productivityLoss"
            name="Productivity Loss"
            fill="url(#productivityGradient)"
            opacity={0.6}
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
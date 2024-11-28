import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar } from 'recharts';
import { CalculationResult } from '../../types';
import { colorSystem } from '../../utils/colorSystem';

interface ProductivityImpactDifferentialsChartProps {
  results: CalculationResult[];
}

export function ProductivityImpactDifferentialsChart({ results }: ProductivityImpactDifferentialsChartProps) {
  const chartData = React.useMemo(() => {
    // Reset color system for new chart instance
    colorSystem.reset();
    
    const dataMap = new Map<string, { [key: string]: any }>();
    
    results.forEach(result => {
      const date = result.calculationDate;
      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date,
          ept: result.ept,
          values: {}
        });
      }
      const roleKey = `${result.role}-${result.experience}`;
      // Use hoursDifference * workingDaysPerYear to get annual impact
      const annualHoursDifference = (result.hoursDifference || 0) * (result.workingDaysPerYear || 250);
      dataMap.get(date)!.values[roleKey] = annualHoursDifference;
    });

    const data = Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const roleKeys = Array.from(new Set(results.map(r => `${r.role}-${r.experience}`)));

    return { data, roleKeys };
  }, [results]);

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
          if (entry.dataKey === 'ept') {
            return (
              <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700">EPT:</span>
                <span className="font-medium">{entry.value.toFixed(1)}s</span>
              </div>
            );
          }

          const value = entry.value;
          const isNegative = value < 0;
          const displayValue = Math.abs(value).toFixed(1);

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
                {isNegative ? '-' : ''}{displayValue} hours/year
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-sm chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Productivity Impact Differentials</h3>
        <p className="text-sm text-gray-500">
          Annual hours impact per user by role and experience level over time
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="87%">
        <ComposedChart 
          data={chartData.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="eptGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#A855F7" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
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
              value: 'Hours Impact/Year', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10 
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 4]}
            label={{
              value: 'EPT (seconds)',
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
          {chartData.roleKeys.map(roleKey => {
            const [role, experience] = roleKey.split('-');
            return (
              <Line
                key={roleKey}
                yAxisId="left"
                type="monotone"
                dataKey={`values.${roleKey}`}
                name={roleKey}
                stroke={colorSystem.getColor(role, experience)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            );
          })}
          <Bar
            yAxisId="right"
            dataKey="ept"
            name="EPT"
            fill="url(#eptGradient)"
            opacity={0.6}
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
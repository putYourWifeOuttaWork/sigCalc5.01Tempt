import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalculationResult } from '../types';
import { colorSystem } from '../utils/colorSystem';

interface ProductivityTrendChartProps {
  results: CalculationResult[];
}

export function ProductivityTrendChart({ results }: ProductivityTrendChartProps) {
  const chartData = React.useMemo(() => {
    // Reset color system for new chart instance
    colorSystem.reset();
    
    const dataMap = new Map<string, { [key: string]: number }>();
    
    results.forEach(result => {
      const date = result.calculationDate;
      if (!dataMap.has(date)) {
        dataMap.set(date, {});
      }
      const roleKey = `${result.role}-${result.experience}`;
      dataMap.get(date)![roleKey] = result.productivity;
    });

    const data = Array.from(dataMap.entries())
      .map(([date, values]) => ({
        date,
        ...values
      }))
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
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}:</span>
            <span className="font-medium">{entry.value.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-[600px] bg-white p-6 rounded-xl shadow-sm chart-container">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Trend of Est. Productivity of Users Resulting from Experienced Load Times</h3>
        <p className="text-sm text-gray-500">
          Tracking productivity levels across different roles and experience levels over time
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="87%">
        <LineChart 
          data={chartData.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
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
            label={{ 
              value: 'Productivity (%)', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10 
            }}
            domain={[0, 'auto']}
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
                type="monotone"
                dataKey={roleKey}
                name={roleKey}
                stroke={colorSystem.getColor(role, experience)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
import { CalculationResult, ErrorCalculationResult } from '../types';

// Calculate bar width and position for multiple bars on same date
export function getBarPosition(
  data: any[],
  dataKey: string,
  barWidth: number = 20,
  barGap: number = 1
): (props: any) => { x: number; width: number } {
  return (props: any) => {
    if (!props || !props.payload || !props.payload.date) return { x: 0, width: 0 };

    // Find all entries for this date
    const sameDate = data.find(d => d.date === props.payload.date);
    if (!sameDate) return { x: 0, width: 0 };

    // Get all bar values for this date
    const barValues = Object.entries(sameDate)
      .filter(([key]) => key !== 'date' && !key.startsWith('values'))
      .map(([key]) => key);

    // Find index of current bar in the group
    const barIndex = barValues.indexOf(dataKey);
    if (barIndex === -1) return { x: 0, width: 0 };

    // Calculate total width of bar group
    const totalWidth = barValues.length * (barWidth + barGap) - barGap;
    
    // Calculate x position offset for this bar
    const offset = -(totalWidth / 2) + (barIndex * (barWidth + barGap));

    return {
      x: props.x + offset,
      width: barWidth
    };
  };
}

// Process chart data to group by date
export function processChartData<T extends CalculationResult | ErrorCalculationResult>(
  results: T[],
  getValue: (result: T) => number,
  getBarValue: (result: T) => number,
  getKey: (result: T) => string
) {
  const dataMap = new Map<string, { [key: string]: any }>();
  
  results.forEach(result => {
    const date = result.calculationDate;
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        values: {}
      });
    }
    
    const entry = dataMap.get(date)!;
    const key = getKey(result);
    
    // Add line value
    entry.values[key] = getValue(result);
    
    // Add bar value with unique identifier
    const barKey = `bar_${Object.keys(entry).filter(k => k.startsWith('bar_')).length}`;
    entry[barKey] = getBarValue(result);
  });

  return Array.from(dataMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
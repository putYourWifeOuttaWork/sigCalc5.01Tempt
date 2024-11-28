import React from 'react';
import { NumericInput } from './NumericInput';

interface TaskFieldsProps {
  tasksPerDay: string;
  clicksPerTask: string;
  onTasksChange: (value: string) => void;
  onClicksChange: (value: string) => void;
}

export function TaskFields({
  tasksPerDay,
  clicksPerTask,
  onTasksChange,
  onClicksChange
}: TaskFieldsProps) {
  return (
    <>
      <NumericInput
        label="Expected Tasks/Day"
        value={tasksPerDay}
        onChange={onTasksChange}
        tooltip="Expected major tasks to complete per day (e.g. Cases Closed/Day, Leads Managed/Day, Touchpoints/Day, etc.)."
        min={5}
        max={250}
      />
      <NumericInput
        label="Clicks per Task (Microtask)"
        value={clicksPerTask}
        onChange={onClicksChange}
        tooltip="Average number of loads, for a given record journey required per task completion (e.g. 40 Clicks, loads, & actions to manage a lead)."
        min={5}
        max={250}
      />
    </>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { Clock, DollarSign, UserCheck, Trash2 } from 'lucide-react';
import { Switch } from '@headlessui/react';
import { CalculationResult, ROLE_DEFAULTS } from '../types';
import { TaskFields } from './inputs/TaskFields';

interface CalculatorFormProps {
  onCalculate: (result: CalculationResult) => void;
  onDelete?: () => void;
  formIndex: number;
  resultsRef?: React.RefObject<HTMLDivElement>;
  previousValues?: Partial<CalculationResult> | null;
}

export function CalculatorForm({ 
  onCalculate, 
  onDelete, 
  formIndex,
  resultsRef,
  previousValues
}: CalculatorFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState(previousValues?.role || 'Licensed Users - Blended');
  const [cost, setCost] = useState(previousValues?.cost?.toString() || '57500');
  const [employees, setEmployees] = useState(previousValues?.employees?.toString() || '1000');
  const [ept, setEpt] = useState(previousValues?.ept || 2.0);
  const [tasksPerDay, setTasksPerDay] = useState(previousValues?.tasksPerDay?.toString() || '70');
  const [clicksPerTask, setClicksPerTask] = useState(previousValues?.clicksPerTask?.toString() || '30');
  const [experience, setExperience] = useState<'Beginner' | 'Seasoned' | 'Expert'>(previousValues?.experience || 'Seasoned');
  const [isHoursMode, setIsHoursMode] = useState(previousValues?.isHoursMode ?? true);
  const [isFullTime, setIsFullTime] = useState(previousValues?.isFullTime ?? true);
  const [hoursPerDay, setHoursPerDay] = useState(previousValues?.hoursPerDay?.toString() || '8');
  const [calculationDate, setCalculationDate] = useState(previousValues?.calculationDate || new Date().toISOString().split('T')[0]);

  // Update form values when previousValues changes
  useEffect(() => {
    if (previousValues) {
      setRole(previousValues.role || 'Licensed Users - Blended');
      setCost(previousValues.cost?.toString() || '57500');
      setEmployees(previousValues.employees?.toString() || '1000');
      setEpt(previousValues.ept || 2.0);
      setTasksPerDay(previousValues.tasksPerDay?.toString() || '70');
      setClicksPerTask(previousValues.clicksPerTask?.toString() || '30');
      setExperience(previousValues.experience || 'Seasoned');
      setIsHoursMode(previousValues.isHoursMode ?? true);
      setIsFullTime(previousValues.isFullTime ?? true);
      setHoursPerDay(previousValues.hoursPerDay?.toString() || '8');
      setCalculationDate(previousValues.calculationDate || new Date().toISOString().split('T')[0]);
    }
  }, [previousValues]);

  const handleNumberInput = (value: string, setter: (value: string) => void) => {
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const defaults = ROLE_DEFAULTS[newRole as keyof typeof ROLE_DEFAULTS];
    setTasksPerDay(defaults.tasksPerDay.toString());
    setClicksPerTask(defaults.clicksPerTask.toString());
  };

  const calculateClicksPerMinute = (eptValue: number, exp: 'Beginner' | 'Seasoned' | 'Expert'): number => {
    const theoreticalMax = 60 / eptValue;
    const expertiseMultiplier = {
      'Beginner': 0.15,
      'Seasoned': 0.20,
      'Expert': 0.25
    }[exp];
    const x = theoreticalMax * expertiseMultiplier;
    const y = Math.log(1 / eptValue) + x;
    return y;
  };

  const handleCalculate = () => {
    const clicksPerMinute = calculateClicksPerMinute(ept, experience);
    const maxClicksPerDay = Math.floor(clicksPerMinute * 360);
    const actualTasksPerDay = Math.floor(maxClicksPerDay / Number(clicksPerTask));
    const expectedTasks = Number(tasksPerDay); // Store the input value
    const productivity = (actualTasksPerDay / expectedTasks) * 100;
    
    const costNum = Number(cost);
    const workingDaysPerYear = isFullTime ? 250 : 175;
    const standardHoursPerDay = 8;
    const annualHours = standardHoursPerDay * workingDaysPerYear;

    const expectedValue = costNum * 1.5;
    const valueProduced = (productivity / 100) * expectedValue;
    const trueCost = valueProduced - expectedValue;
    const totalRoleValue = trueCost * Number(employees);

    const expectedHours = Number(hoursPerDay);
    const actualHours = (productivity / 100) * expectedHours;
    const hoursDifference = actualHours - expectedHours;
    const annualHoursDifference = hoursDifference * workingDaysPerYear;

    onCalculate({
      role,
      cost: costNum,
      employees: Number(employees),
      expectedTasks, // Use the input value
      tasksPerDay: expectedTasks, // Keep the original input value
      maxClicksPerDay,
      productivity,
      valueProduced,
      expectedValue,
      trueCost,
      totalRoleValue,
      experience,
      isHoursMode,
      hoursPerDay: Number(hoursPerDay),
      hoursDifference,
      annualHoursDifference,
      isFullTime,
      workingDaysPerYear,
      calculationDate,
      ept,
      clicksPerTask: Number(clicksPerTask)
    });

    // Scroll to results after calculation
    setTimeout(() => {
      if (resultsRef?.current) {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <div ref={formRef} className="card p-8">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Productivity Calculation {formIndex + 1}</h2>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
            title="Delete calculator"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="flex justify-end gap-4 mb-6">
        <Switch.Group>
          <div className="flex items-center gap-2">
            <Switch.Label className="text-sm text-gray-600">
              {isHoursMode ? <Clock size={16} className="inline mr-1" /> : <DollarSign size={16} className="inline mr-1" />}
              {isHoursMode ? 'Hours Mode' : 'Value Mode'}
            </Switch.Label>
            <Switch
              checked={isHoursMode}
              onChange={setIsHoursMode}
              className={`${
                isHoursMode ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  isHoursMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>

        <Switch.Group>
          <div className="flex items-center gap-2">
            <Switch.Label className="text-sm text-gray-600">
              <UserCheck size={16} className="inline mr-1" />
              {isFullTime ? 'Full-Time' : 'Part-Time'}
            </Switch.Label>
            <Switch
              checked={isFullTime}
              onChange={setIsFullTime}
              className={`${
                isFullTime ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  isFullTime ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="block text-sm font-medium text-gray-700">User Role</div>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="select-field"
          >
            <option>Licensed Users - Blended</option>
            <option>Service Agent</option>
            <option>Sales Development Rep</option>
            <option>Account Executive</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Tooltip content="The experience level of employees in this role">
            User Experience
          </Tooltip>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value as 'Beginner' | 'Seasoned' | 'Expert')}
            className="select-field"
          >
            <option value="Beginner">Beginner</option>
            <option value="Seasoned">Seasoned</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="space-y-2">
          <Tooltip content="Date of calculation">
            Analysis Date
          </Tooltip>
          <input
            type="date"
            value={calculationDate}
            onChange={(e) => setCalculationDate(e.target.value)}
            className="input-field"
          />
        </div>

        {!isHoursMode && (
          <div className="space-y-2">
            <Tooltip content="The estimated wage/year for employees in this role">
              Annual Wage (8hr basis)
            </Tooltip>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cost}
              onChange={(e) => handleNumberInput(e.target.value, setCost)}
              className="input-field"
            />
          </div>
        )}

        <div className="space-y-2">
          <Tooltip content="Number of employees affected by these errors">
            Number of Users
          </Tooltip>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={employees}
            onChange={(e) => handleNumberInput(e.target.value, setEmployees)}
            className="input-field"
          />
        </div>

        <TaskFields
          tasksPerDay={tasksPerDay}
          clicksPerTask={clicksPerTask}
          onTasksChange={setTasksPerDay}
          onClicksChange={setClicksPerTask}
        />

        <div className="space-y-2">
          <Tooltip content="Expected Page Time in seconds">
            EPT (seconds)
          </Tooltip>
          <select
            value={ept}
            onChange={(e) => setEpt(Number(e.target.value))}
            className="select-field"
          >
            {Array.from({ length: 38 }, (_, i) => (4.0 - i * 0.1).toFixed(1))
              .map(Number)
              .filter(val => val >= 0.3)
              .map(val => (
                <option key={val} value={val}>{val.toFixed(1)}</option>
              ))
            }
          </select>
        </div>

        <div className="space-y-2">
          <Tooltip content="Daily work hours for employees using this interface">
            Daily Work Hours
          </Tooltip>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hoursPerDay}
            onChange={(e) => handleNumberInput(e.target.value, setHoursPerDay)}
            className="input-field"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="btn-primary mt-6"
      >
        Calculate
      </button>
    </div>
  );
}
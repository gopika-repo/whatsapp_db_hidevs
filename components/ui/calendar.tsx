import React from 'react';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  mode?: 'single';
  initialFocus?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect }) => {
  // Simple placeholder calendar
  return (
    <input
      type="date"
      value={selected ? selected.toISOString().substring(0, 10) : ''}
      onChange={e => {
        if (onSelect) onSelect(new Date(e.target.value));
      }}
      className="border rounded p-2 w-full"
    />
  );
};

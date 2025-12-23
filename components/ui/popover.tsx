import React, { ReactNode } from 'react';

export const Popover = ({ children }: { children: ReactNode }) => <div>{children}</div>;
export const PopoverTrigger = ({ children }: { children: ReactNode }) => <>{children}</>;
export const PopoverContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`absolute z-10 bg-white border rounded shadow-lg ${className || ''}`}>{children}</div>
);

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea className={`border rounded p-2 w-full ${className || ''}`} {...props} />
);

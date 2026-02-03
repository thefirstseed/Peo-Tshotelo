import React from 'react';
import { LucideProps } from 'lucide-react';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon: React.ComponentType<LucideProps>;
  isTextarea?: boolean;
}

export const IconInput: React.FC<IconInputProps> = ({ icon: Icon, isTextarea = false, ...props }) => {
  const commonClasses = "w-full pl-12 pr-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition";
  
  // Need to adjust padding for textarea
  const textareaClasses = isTextarea ? `${commonClasses} pt-3` : commonClasses;
  const iconTopPosition = isTextarea ? 'top-3.5' : 'inset-y-0';
  
  return (
    <div className="relative">
      <div className={`absolute left-0 flex items-center pl-4 pointer-events-none ${iconTopPosition}`}>
        <Icon className="w-5 h-5 text-neutral-400" />
      </div>
      {isTextarea ? (
        <textarea {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} rows={3} className={textareaClasses} />
      ) : (
        <input {...props as React.InputHTMLAttributes<HTMLInputElement>} className={commonClasses} />
      )}
    </div>
  );
};

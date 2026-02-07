import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const Requirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className={`flex items-center text-xs transition-colors ${met ? 'text-green-600' : 'text-neutral-500'}`}>
    {met ? <Check className="w-4 h-4 mr-1.5" /> : <X className="w-4 h-4 mr-1.5" />}
    <span>{text}</span>
  </div>
);

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const hasLength = password.length >= 15;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const requirements = [hasLength, hasLowercase, hasUppercase, hasNumber, hasSymbol];
  const strength = requirements.filter(Boolean).length;

  const strengthColors = [
    'bg-neutral-200', // 0/5
    'bg-red-500',      // 1/5
    'bg-red-500',      // 2/5
    'bg-yellow-500',   // 3/5
    'bg-yellow-500',   // 4/5
    'bg-green-500',    // 5/5
  ];
  
  const strengthText = [
    'Very Weak', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'
  ];

  return (
    <div className="space-y-2 pt-2">
      <div className="flex gap-1.5 h-1.5 rounded-full overflow-hidden">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className={`flex-1 ${strength > i ? strengthColors[strength] : 'bg-neutral-200'}`} />
        ))}
      </div>
      <p className="text-xs font-medium text-right text-neutral-600">
        Password strength: {strengthText[strength]}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
        <Requirement met={hasLength} text="At least 15 characters" />
        <Requirement met={hasLowercase} text="One lowercase letter" />
        <Requirement met={hasUppercase} text="One uppercase letter" />
        <Requirement met={hasNumber} text="One number" />
        <Requirement met={hasSymbol} text="One special character" />
      </div>
    </div>
  );
};
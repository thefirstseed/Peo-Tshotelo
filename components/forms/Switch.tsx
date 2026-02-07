import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled }) => {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={toggle} disabled={disabled} />
        <div className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-neutral-300'}`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
            checked ? 'transform translate-x-6' : ''
          }`}
        ></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-neutral-700">{label}</span>}
    </label>
  );
};

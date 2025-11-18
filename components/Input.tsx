import React from 'react';
import { Input as UiInput } from './ui/input';
import { Label } from './ui/label';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  [x: string]: any;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, icon, ...rest }) => {
  return (
    <div>
      <Label className="block text-sm font-semibold text-gray-700 mb-2">{label}</Label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 text-gray-400" })}</div>}
        <UiInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-medium shadow focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
          {...rest}
        />
      </div>
    </div>
  );
};

export default Input;

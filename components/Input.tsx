import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-heading font-bold text-sm text-deep-indigo uppercase tracking-wider">{label}</label>}
      <div className="relative group">
        <input 
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`w-full bg-white border-2 border-deep-indigo p-3.5 pr-12 text-base rounded-md font-body transition-all duration-150 focus:bg-secondary focus:outline-none focus:shadow-[2px_2px_0px_#2D1B69] ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-indigo/50 hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
          </button>
        )}
      </div>
    </div>
  );
};

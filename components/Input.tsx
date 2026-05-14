import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-heading font-bold text-sm text-deep-indigo uppercase tracking-wider">{label}</label>}
      <input 
        className={`bg-white border-2 border-deep-indigo p-3.5 text-base rounded-md font-body transition-all duration-150 focus:bg-secondary focus:outline-none focus:shadow-[2px_2px_0px_#2D1B69] ${className}`}
        {...props}
      />
    </div>
  );
};

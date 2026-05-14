import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles = "font-heading font-bold py-3 px-6 rounded-md transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    primary: "bg-primary text-white border-3 border-deep-indigo shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    secondary: "bg-bg-offwhite text-dark-text border-2 border-deep-indigo shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    ghost: "bg-transparent text-dark-text border-2 border-deep-indigo hover:bg-secondary/20",
    outline: "bg-transparent border-3 border-deep-indigo hover:bg-deep-indigo/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  const baseStyles = "bg-bg-offwhite border-2 border-deep-indigo shadow-brutal p-6 rounded-md";
  const hoverStyles = hover ? "transition-all duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer" : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

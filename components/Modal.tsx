import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-deep-indigo/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border-4 border-deep-indigo p-8 shadow-brutal w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-heading font-bold text-deep-indigo uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 border-2 border-deep-indigo hover:bg-error hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900" id="dialog-title">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>
        <div>
            {children}
        </div>
      </div>
    </div>
  );
};
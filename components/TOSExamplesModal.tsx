import React, { useState, useEffect } from 'react';
import { examples } from '../data/examples';

interface TOSExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOSExamplesModal: React.FC<TOSExamplesModalProps> = ({ isOpen, onClose }) => {
  const [activeExample, setActiveExample] = useState(examples[0]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Sample Terms of Service</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-shrink-0 px-4 sm:px-6 border-b">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {examples.map((example) => (
              <button
                key={example.businessType}
                onClick={() => setActiveExample(example)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                  activeExample.businessType === example.businessType
                    ? 'border-brand-navy text-brand-navy'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                aria-current={activeExample.businessType === example.businessType ? 'page' : undefined}
              >
                {example.businessType}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-grow overflow-y-auto">
           <div
              className="p-6 sm:p-8 prose prose-slate max-w-none select-none"
              dangerouslySetInnerHTML={{ __html: activeExample.content }}
            />
        </div>
      </div>
    </div>
  );
};

export default TOSExamplesModal;
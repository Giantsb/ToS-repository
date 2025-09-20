import React, { useState, useEffect } from 'react';

interface SaveTOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documentName: string) => void;
}

const SaveTOSModal: React.FC<SaveTOSModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
        // Generate a default name when modal opens
        const date = new Date();
        const defaultName = `TOS - ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        setName(defaultName);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800">Save Your Document</h2>
          <p className="text-sm text-slate-600 mt-1">
            Give your new Terms of Service document a name to save it to your dashboard.
          </p>
          <div className="mt-4">
            <label htmlFor="documentName" className="sr-only">Document Name</label>
            <input
              type="text"
              id="documentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:ring-brand-navy focus:border-brand-navy"
              placeholder="e.g., My E-commerce TOS"
              autoFocus
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy"
            >
              Save Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTOSModal;

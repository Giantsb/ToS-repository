import React, { useState } from 'react';
import type { SavedTOSDocument } from '../types';

interface DashboardProps {
  documents: SavedTOSDocument[];
  onView: (doc: SavedTOSDocument) => void;
  onDelete: (id: string) => void;
  onGoToGenerator: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onView, onDelete, onGoToGenerator }) => {
  const [docToDelete, setDocToDelete] = useState<SavedTOSDocument | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDeleteClick = (doc: SavedTOSDocument) => {
    setDocToDelete(doc);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      onDelete(docToDelete.id);
      setDocToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">My Documents</h1>
        <button
          onClick={onGoToGenerator}
          className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Document
        </button>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex-grow">
                <h2 className="font-semibold text-slate-800">{doc.name}</h2>
                <p className="text-sm text-slate-500">
                  Created on {formatDate(doc.createdAt)}
                </p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full leading-none mt-2 inline-block ${doc.isPro ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}>
                  {doc.isPro ? (doc.isUnlocked ? 'PRO' : 'PRO PREVIEW') : 'BASIC'}
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button 
                  onClick={() => onView(doc)}
                  className="px-3 py-1.5 text-sm font-medium text-brand-navy hover:bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDeleteClick(doc)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-800">No documents saved yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first Terms of Service document.
          </p>
        </div>
      )}

      {docToDelete && (
         <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold">Confirm Deletion</h2>
                <p className="text-sm text-slate-600 mt-2">
                    Are you sure you want to delete the document "{docToDelete.name}"? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setDocToDelete(null)} className="px-4 py-2 text-sm font-medium bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
                        Cancel
                    </button>
                    <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;

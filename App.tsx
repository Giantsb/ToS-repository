import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { TOSFormData, SavedTOSDocument } from './types';
import { generateTOS } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import TOSForm from './components/TOSForm';
import TOSDisplay from './components/TOSDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Disclaimer from './components/Disclaimer';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import Hero from './components/Hero';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SaveTOSModal from './components/SaveTOSModal';
import Dashboard from './components/Dashboard';

const LOCAL_STORAGE_FORM_KEY = 'tosGeneratorFormData';
const LOCAL_STORAGE_DOCS_KEY_PREFIX = 'userDocs_';


const initialFormData: TOSFormData = {
  businessName: '',
  websiteUrl: '',
  businessType: 'Service Provider (e.g., consultancy, agency)',
  otherBusinessType: '',
  servicesDescription: '',
  collectsUserData: false,
  userDataDescription: '',
  contactEmail: '',
  hasRefundPolicy: false,
  refundPolicyDescription: '',
  hasDisputeResolution: false,
  disputeResolutionDescription: '',
  hasSubscriptionTerms: false,
  subscriptionTermsDescription: '',
};

const AppContent: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    isAuthModalOpen, 
    openAuthModal, 
    closeAuthModal,
    signOut,
  } = useAuth();
  
  const [formData, setFormData] = useState<TOSFormData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_FORM_KEY);
      if (savedData) {
        return { ...initialFormData, ...JSON.parse(savedData) };
      }
    } catch (error) {
      console.error("Failed to parse form data from localStorage", error);
    }
    return initialFormData;
  });

  const [generatedTOS, setGeneratedTOS] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [formDataForPro, setFormDataForPro] = useState<TOSFormData | null>(null);
  const [isAwaitingPaymentAfterAuth, setIsAwaitingPaymentAfterAuth] = useState<boolean>(false);
  const [isDocumentLocked, setIsDocumentLocked] = useState<boolean>(false);
  const [isProDocument, setIsProDocument] = useState<boolean>(false);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [savedDocuments, setSavedDocuments] = useState<SavedTOSDocument[]>([]);
  const [currentView, setCurrentView] = useState<'generator' | 'dashboard'>('generator');
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const getUserDocsKey = useCallback(() => {
    if (!user?.email) return null;
    return `${LOCAL_STORAGE_DOCS_KEY_PREFIX}${user.email}`;
  }, [user]);

  // Load saved documents from localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const key = getUserDocsKey();
      if (key) {
        try {
          const savedDocs = localStorage.getItem(key);
          if (savedDocs) {
            setSavedDocuments(JSON.parse(savedDocs));
          } else {
            setSavedDocuments([]);
          }
        } catch (error) {
          console.error("Failed to load saved documents:", error);
          setSavedDocuments([]);
        }
      }
    } else {
      setSavedDocuments([]);
    }
  }, [isAuthenticated, user, getUserDocsKey]);

  // Save documents to localStorage when they change
  useEffect(() => {
    const key = getUserDocsKey();
    if (key && isAuthenticated) {
      try {
        localStorage.setItem(key, JSON.stringify(savedDocuments));
      } catch (error) {
        console.error("Failed to save documents:", error);
      }
    }
  }, [savedDocuments, getUserDocsKey, isAuthenticated]);


  // Effect to save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FORM_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save form data to localStorage", error);
    }
  }, [formData]);

  const handleGetStartedClick = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFormSubmit = useCallback(async (data: TOSFormData) => {
    const isPremium = data.collectsUserData || data.hasRefundPolicy || data.hasDisputeResolution || data.hasSubscriptionTerms;

    setIsLoading(true);
    setError('');
    setGeneratedTOS('');
    setCurrentView('generator');

    if (isPremium) {
      setFormDataForPro(data);
    }
    
    try {
      const tos = await generateTOS(data);
      setGeneratedTOS(tos);
      setIsDocumentLocked(true); 
      setIsProDocument(isPremium);

      if (isAuthenticated) {
        setIsSaveModalOpen(true);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('tos-display-container')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isAuthenticated]);

  const handleSaveDocument = (name: string) => {
    if (!generatedTOS) return;
    const newDoc: SavedTOSDocument = {
      id: Date.now().toString(),
      name,
      content: generatedTOS,
      isPro: isProDocument,
      isUnlocked: !isDocumentLocked,
      createdAt: new Date().toISOString(),
    };
    setSavedDocuments(prev => [...prev, newDoc]);
    setIsSaveModalOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    setSavedDocuments(prev => prev.filter(doc => doc.id !== id));
  };
  
  const handleViewDocument = (doc: SavedTOSDocument) => {
    setGeneratedTOS(doc.content);
    setIsProDocument(doc.isPro);
    setIsDocumentLocked(doc.isPro && !doc.isUnlocked);
    setCurrentView('generator');
    setTimeout(() => {
        document.getElementById('tos-display-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };


  const handleClearForm = useCallback(() => {
    setFormData(initialFormData);
    setGeneratedTOS('');
    setError('');
    setIsDocumentLocked(false);
    setIsProDocument(false);
    setFormDataForPro(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_FORM_KEY);
    } catch (error) {
      console.error("Failed to remove form data from localStorage", error);
    }
  }, []);

  const handleAuthSuccess = useCallback(() => {
    closeAuthModal();
    if (isAwaitingPaymentAfterAuth) {
      setIsAwaitingPaymentAfterAuth(false);
      setIsPaymentModalOpen(true);
    }
  }, [isAwaitingPaymentAfterAuth, closeAuthModal]);

  const handleCloseAuthModal = useCallback(() => {
    closeAuthModal();
    if (isAwaitingPaymentAfterAuth) {
      setIsAwaitingPaymentAfterAuth(false);
      setFormDataForPro(null); 
    }
  }, [isAwaitingPaymentAfterAuth, closeAuthModal]);

  const handleUnlockRequest = useCallback(() => {
    if (!isAuthenticated) {
      setIsAwaitingPaymentAfterAuth(true);
      openAuthModal();
    } else {
      setIsPaymentModalOpen(true);
    }
  }, [isAuthenticated, openAuthModal]);
  
  const handlePaymentSuccess = useCallback(() => {
    setIsPaymentModalOpen(false);
    if (formDataForPro) {
      setIsDocumentLocked(false);
       // If the document that was just paid for is in the saved list, update it
       const lastDoc = savedDocuments.length > 0 ? savedDocuments[savedDocuments.length - 1] : null;
       if (lastDoc && lastDoc.content === generatedTOS) {
         setSavedDocuments(docs => docs.map(d => d.id === lastDoc.id ? { ...d, isUnlocked: true } : d));
       }
      setFormDataForPro(null);
    }
  }, [formDataForPro, generatedTOS, savedDocuments]);


  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-100 text-slate-800">
      <Header 
        onSignInClick={openAuthModal}
        onSignOut={signOut}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {currentView === 'generator' && (
            <>
              <Hero onGetStartedClick={handleGetStartedClick} />

              <div className="text-center max-w-3xl mx-auto mb-8 -mt-4">
                  <p className="text-md text-slate-700 bg-slate-200/70 inline-block px-4 py-2 rounded-full shadow-sm">
                      Generate a basic document for free, or add advanced clauses for a simple one-time fee of ₦4,500.
                  </p>
              </div>

              <div ref={formRef} className="scroll-mt-8">
                <Disclaimer />
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
                  <div className="p-6 sm:p-8">
                    <TOSForm
                      formData={formData}
                      setFormData={setFormData}
                      onSubmit={handleFormSubmit}
                      isLoading={isLoading}
                      onClear={handleClearForm}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentView === 'dashboard' && (
             <Dashboard
              documents={savedDocuments}
              onView={handleViewDocument}
              onDelete={handleDeleteDocument}
              onGoToGenerator={() => setCurrentView('generator')}
             />
          )}

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-lg">
              <LoadingSpinner />
              <p className="mt-4 text-slate-600 font-medium">Generating your Terms of Service...</p>
              <p className="text-sm text-slate-500">This may take a moment. Please wait.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {generatedTOS && !isLoading && currentView === 'generator' && (
            <div className="mt-8" id="tos-display-container">
              <TOSDisplay 
                content={generatedTOS}
                isAuthenticated={isAuthenticated}
                onAuthRequired={openAuthModal}
                isLocked={isDocumentLocked}
                isPro={isProDocument}
                onUnlockRequest={handleUnlockRequest}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      {isAuthModalOpen && (
        <AuthModal 
          onClose={handleCloseAuthModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {isPaymentModalOpen && formDataForPro && user?.email && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          amount={4500}
          userEmail={user.email}
        />
      )}
      {isSaveModalOpen && (
        <SaveTOSModal 
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;

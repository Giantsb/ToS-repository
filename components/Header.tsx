import React, { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onSignInClick: () => void;
  onSignOut: () => void;
  currentView: 'generator' | 'dashboard';
  onNavigate: (view: 'generator' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, onSignOut, currentView, onNavigate }) => {
  const { isAuthenticated, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navItemClasses = "py-2 px-3 rounded-md text-sm font-medium transition-colors";
  const activeNavItemClasses = "bg-slate-100 text-brand-navy";
  const inactiveNavItemClasses = "text-slate-600 hover:bg-slate-100 hover:text-slate-800";


  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-navy p-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            TermsNG
          </h1>
        </div>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-2 bg-slate-200/70 p-1 rounded-lg">
             <button
              onClick={() => onNavigate('generator')}
              className={`${navItemClasses} ${currentView === 'generator' ? activeNavItemClasses : inactiveNavItemClasses}`}
            >
              Generator
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`${navItemClasses} ${currentView === 'dashboard' ? activeNavItemClasses : inactiveNavItemClasses}`}
            >
              My Documents
            </button>
          </nav>
        )}

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-3">
             {isAuthenticated && user?.email ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <span className="h-8 w-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProfileOpen && (
                  <ProfileDropdown 
                    userEmail={user.email}
                    onSignOut={onSignOut}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2" aria-live="polite">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" title="Guest"></span>
                  <span className="hidden md:inline text-sm font-medium text-slate-500">
                    Status: Guest
                  </span>
                </div>
                <div>
                  <button
                    onClick={onSignInClick}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
      </div>
      {isAuthenticated && (
        <div className="md:hidden bg-slate-100 border-t">
          <nav className="container mx-auto px-4 flex justify-around items-center">
            <button
                onClick={() => onNavigate('generator')}
                className={`flex-1 py-2 text-center text-sm font-medium ${currentView === 'generator' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-slate-600'}`}
            >
              Generator
            </button>
            <button
                onClick={() => onNavigate('dashboard')}
                className={`flex-1 py-2 text-center text-sm font-medium ${currentView === 'dashboard' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-slate-600'}`}
            >
              My Documents
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
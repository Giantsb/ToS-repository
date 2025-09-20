import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: () => void;
}

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);


const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      if (view === 'signup') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    // In a real application, you would make an API call here.
    setResetEmailSent(true);
  };

  const handleViewChange = (newView: 'signin' | 'signup') => {
    setView(newView);
    setError('');
    setPassword('');
    setResetEmailSent(false);
  }

  const inputClasses = "w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 transition-colors duration-200 ease-in-out hover:border-brand-navy/70 focus:ring-brand-navy focus:border-brand-navy";
  const buttonClasses = "w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed";

  const getTitle = () => {
    if (view === 'signin') return 'Sign In';
    if (view === 'signup') return 'Create an Account';
    if (view === 'forgot') return 'Reset Your Password';
    return '';
  }

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
        <header className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {getTitle()}
          </h2>
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

        <div className="p-6">
          {view === 'forgot' ? (
            <div>
              {resetEmailSent ? (
                <div className="text-center">
                  <p className="text-sm text-slate-700">If an account with that email exists, a password reset link has been sent.</p>
                  <button
                    onClick={() => {
                      setView('signin');
                      setResetEmailSent(false);
                      setError('');
                    }}
                    className="mt-4 text-sm font-medium text-brand-navy hover:underline focus:outline-none"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <p className="text-sm text-slate-600">Enter your email address and we'll send you a link to reset your password.</p>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={inputClasses} 
                      placeholder="you@example.com"
                      required 
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div>
                    <button 
                      type="submit" 
                      className={`${buttonClasses} mt-2`}
                    >
                      Send Reset Link
                    </button>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={() => { setView('signin'); setError(''); }} className="text-sm font-medium text-slate-600 hover:text-brand-navy">
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <>
              <div className="flex border-b mb-6">
                <button
                  onClick={() => handleViewChange('signin')}
                  className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${view === 'signin' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleViewChange('signup')}
                  className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${view === 'signup' ? 'text-brand-navy border-b-2 border-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClasses} 
                    placeholder="you@example.com"
                    required 
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                    {view === 'signin' && (
                       <button 
                         type="button" 
                         onClick={() => {
                           setView('forgot');
                           setError('');
                           setPassword('');
                         }}
                         className="text-sm font-medium text-brand-navy hover:underline focus:outline-none"
                       >
                         Forgot Password?
                       </button>
                    )}
                  </div>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClasses} 
                    placeholder="••••••••"
                    required 
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                  <button 
                    type="submit" 
                    className={buttonClasses}
                    disabled={isLoading}
                  >
                    {isLoading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : (view === 'signin' ? 'Sign In' : 'Create Account')}
                  </button>
                </div>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">OR</span>
                </div>
              </div>

              <div>
                <button 
                  type="button" 
                  onClick={handleGoogleSignIn}
                  className="w-full flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors"
                >
                  <GoogleIcon />
                  {view === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
              </div>

              <p className="mt-4 text-xs text-center text-slate-500">
                By continuing, you agree to our Terms of Service.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// This is a simplified, client-side-only simulation of a user database.
// In a real application, this would be handled by a backend server.
const USERS_DB_KEY = 'termsNgUsers';
const CURRENT_USER_KEY = 'termsNgCurrentUser';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for a logged-in user in localStorage on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const performSignIn = (email: string) => {
    const newUser = { email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = (email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        try {
          const db = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
          if (db[email] && db[email].password === password) {
            performSignIn(email);
            resolve();
          } else {
            reject(new Error('Invalid email or password.'));
          }
        } catch (error) {
          reject(new Error('An error occurred during sign-in.'));
        }
      }, 500);
    });
  };

  const signUp = (email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
       // Simulate API call
      setTimeout(() => {
        try {
          const db = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
          if (db[email]) {
            reject(new Error('An account with this email already exists.'));
            return;
          }
          db[email] = { password };
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
          performSignIn(email);
          resolve();
        } catch (error) {
          reject(new Error('An error occurred during sign-up.'));
        }
      }, 500);
    });
  };

  const signInWithGoogle = (): Promise<void> => {
    return new Promise((resolve) => {
      // This is a simulation. In a real app, this would involve a popup
      // and communication with Google's OAuth service.
      setTimeout(() => {
        const googleUserEmail = 'user.google@example.com';
        const db = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
        if (!db[googleUserEmail]) {
           db[googleUserEmail] = { password: `google-auth-${Date.now()}` }; // Simulate user creation
           localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
        }
        performSignIn(googleUserEmail);
        resolve();
      }, 500);
    });
  };

  const signOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthModalOpen,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
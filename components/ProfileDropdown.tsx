import React, { useEffect, useRef } from 'react';

interface ProfileDropdownProps {
  userEmail: string;
  onSignOut: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userEmail, onSignOut, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef} 
      className="absolute top-full right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="py-1" role="none">
        <div className="px-4 py-2 border-b border-slate-200">
          <p className="text-sm text-slate-500" role="none">Signed in as</p>
          <p className="text-sm font-medium text-slate-800 truncate" role="none">{userEmail}</p>
        </div>
        <button
          onClick={() => {
            onSignOut();
            onClose();
          }}
          className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          role="menuitem"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;

import React, { useState, useEffect, useRef } from 'react';

interface TOSDisplayProps {
  content: string;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  isLocked: boolean;
  isPro: boolean;
  onUnlockRequest: () => void;
}

// SVG Icons for Social Media
const XIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.42-1.39c1.37.74 2.92 1.18 4.62 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.92-9.91zM17.47 14.38c-.28-.14-1.67-.82-1.92-.92-.25-.09-.44-.14-.62.14-.18.28-.73.92-.89 1.11-.16.19-.32.22-.59.07-.28-.14-1.17-.43-2.23-1.37-.83-.72-1.39-1.62-1.55-1.89-.16-.28-.02-.43.12-.57.13-.13.28-.32.41-.48.14-.16.18-.28.28-.46.09-.19.05-.36-.02-.51s-.62-1.49-.85-2.03c-.23-.54-.46-.47-.62-.47h-.52c-.16 0-.44.05-.67.32-.23.28-.89.87-.89 2.12 0 1.25.91 2.45 1.04 2.61.13.16 1.79 2.73 4.34 3.82.59.25 1.05.4 1.41.51.59.18 1.13.16 1.56.09.48-.07 1.67-.68 1.9-1.33.24-.65.24-1.21.16-1.33-.07-.12-.26-.2-.54-.34z" />
    </svg>
);

const TOSDisplay: React.FC<TOSDisplayProps> = ({ 
  content, 
  isAuthenticated, 
  onAuthRequired,
  isLocked,
  isPro,
  onUnlockRequest,
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCopyButtonText('Copy to Clipboard');
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleCopy = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      setCopyButtonText('Sign in to copy');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2500);
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textToCopy = tempDiv.textContent || tempDiv.innerText || "";

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Copy Failed');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    });
  };

  const handleDownload = (format: 'html' | 'txt') => {
    if (!isAuthenticated) {
      onAuthRequired();
      setIsDropdownOpen(false);
      return;
    }

    let blob;
    const filename = `terms-of-service.${format}`;

    if (format === 'html') {
      blob = new Blob([content], { type: 'text/html' });
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      blob = new Blob([textContent], { type: 'text/plain' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
  };
  
  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp') => {
    const shareText = "I just created a professional Terms of Service for my Nigerian business using this awesome AI-powered generator! Check it out:";
    const pageUrl = window.location.href;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent('TermsNG')}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 sm:p-8 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Generated Document</h2>
          <span className={`text-xs font-bold px-2 py-1 rounded-full leading-none mt-1 inline-block ${isPro ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}>
            {isPro ? (isLocked ? 'PRO PREVIEW' : 'PRO DOCUMENT') : 'BASIC DOCUMENT'}
          </span>
        </div>

        {isLocked && isPro ? (
          <button
            onClick={onUnlockRequest}
            className="w-full sm:w-auto flex-shrink-0 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-brand-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors"
          >
            Pay ₦4,500 to Unlock & Download
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={handleCopy}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-transparent bg-brand-navy text-sm font-medium text-white hover:bg-brand-navy-dark focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-all"
              >
                {copyButtonText}
              </button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-l-0 border-transparent bg-brand-navy text-sm font-medium text-white hover:bg-brand-navy-dark focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy border-l border-brand-navy-dark/50"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <span className="sr-only">Open options</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button
                    onClick={() => handleDownload('html')}
                    className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    role="menuitem"
                  >
                    Download as .html
                  </button>
                  <button
                    onClick={() => handleDownload('txt')}
                    className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    role="menuitem"
                  >
                    Download as .txt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="p-4 bg-slate-50 border-b flex items-center justify-center gap-2 sm:gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline">Share:</span>
             <button onClick={() => handleShare('twitter')} aria-label="Share on X" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors"><XIcon /></button>
            <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><FacebookIcon /></button>
            <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"><LinkedInIcon /></button>
            <button onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp" className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"><WhatsAppIcon /></button>
        </div>
      )}
      
      <div className="p-6 sm:p-8">
        <div
          className={`prose prose-slate max-w-none bg-slate-50 p-6 rounded-md border border-slate-200 ${isLocked ? 'select-none' : ''}`}
          dangerouslySetInnerHTML={{ __html: content }}
        >
        </div>
      </div>
    </div>
  );
};

export default TOSDisplay;
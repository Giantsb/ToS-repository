import React from 'react';

interface HeroProps {
  onGetStartedClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  return (
    <div className="text-center py-16 sm:py-24 bg-white rounded-lg shadow-lg mb-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Create a Free Terms of Service for Your Nigerian Business
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Easily generate a professional Terms of Service document tailored to Nigerian laws. Save time, stay compliant, and protect your business in minutes.
        </p>
        <div className="mt-8">
          <button
            onClick={onGetStartedClick}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors"
          >
            Create Your TOS Now
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
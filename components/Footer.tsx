
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t">
      <div className="container mx-auto px-4 text-center text-slate-500">
        <p className="text-sm">
          <strong>Disclaimer:</strong> This tool generates a baseline Terms of Service document for informational purposes only. It does not constitute legal advice.
        </p>
        <p className="text-sm mt-1">
          You should consult with a qualified legal professional to ensure your TOS is complete and compliant with all applicable laws for your specific business.
        </p>
        <p className="text-xs mt-4">
          © {new Date().getFullYear()} TermsNG. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
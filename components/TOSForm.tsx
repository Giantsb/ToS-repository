import React, { useState, useRef, useEffect } from 'react';
import type { TOSFormData } from '../types';
import TOSExamplesModal from './TOSExamplesModal';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="relative group flex items-center">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs scale-0 transition-all rounded bg-slate-800 p-2 text-xs text-white group-hover:scale-100 origin-bottom z-10 shadow-lg">
        {text}
        <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
        </svg>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
};

const ProBadge: React.FC = () => (
  <span className="ml-2 text-xs font-semibold text-amber-900 bg-amber-300 px-2 py-1 rounded-full leading-none">
    PRO
  </span>
);


interface TOSFormProps {
  formData: TOSFormData;
  setFormData: React.Dispatch<React.SetStateAction<TOSFormData>>;
  onSubmit: (data: TOSFormData) => void;
  isLoading: boolean;
  onClear: () => void;
}

const TOSForm: React.FC<TOSFormProps> = ({ formData, setFormData, onSubmit, isLoading, onClear }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof TOSFormData, string>>>({});
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false);

  // Refs for auto-focusing on conditional fields
  const otherBusinessTypeRef = useRef<HTMLInputElement>(null);
  const userDataDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const refundPolicyDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const disputeResolutionDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const subscriptionTermsDescriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (formData.businessType === 'Other' && otherBusinessTypeRef.current) {
      otherBusinessTypeRef.current.focus();
    }
  }, [formData.businessType]);

  useEffect(() => {
    if (formData.collectsUserData && userDataDescriptionRef.current) {
      userDataDescriptionRef.current.focus();
    }
  }, [formData.collectsUserData]);
  
  useEffect(() => {
    if (formData.hasRefundPolicy && refundPolicyDescriptionRef.current) {
      refundPolicyDescriptionRef.current.focus();
    }
  }, [formData.hasRefundPolicy]);

  useEffect(() => {
    if (formData.hasDisputeResolution && disputeResolutionDescriptionRef.current) {
      disputeResolutionDescriptionRef.current.focus();
    }
  }, [formData.hasDisputeResolution]);

  useEffect(() => {
    if (formData.hasSubscriptionTerms && subscriptionTermsDescriptionRef.current) {
      subscriptionTermsDescriptionRef.current.focus();
    }
  }, [formData.hasSubscriptionTerms]);

  const validateField = (name: keyof TOSFormData, value: any, currentData: TOSFormData): string => {
    switch (name) {
      case 'businessName':
        return value.trim() ? '' : 'Business Name is required.';
      case 'contactEmail':
        if (!value.trim()) return 'Public Contact Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email format.';
        return '';
      case 'servicesDescription':
        return value.trim() ? '' : 'A description of your services is required.';
      case 'websiteUrl':
        if (value && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(value)) {
          return 'Please enter a valid URL (e.g., https://example.com).';
        }
        return '';
      case 'otherBusinessType':
        return currentData.businessType === 'Other' && !value.trim() ? 'Please specify your business type.' : '';
      case 'userDataDescription':
        return currentData.collectsUserData && !value.trim() ? 'Please describe the user data you collect.' : '';
      case 'refundPolicyDescription':
        return currentData.hasRefundPolicy && !value.trim() ? 'Please describe your refund policy.' : '';
      case 'disputeResolutionDescription':
        return currentData.hasDisputeResolution && !value.trim() ? 'Please describe your arbitration process.' : '';
      case 'subscriptionTermsDescription':
        return currentData.hasSubscriptionTerms && !value.trim() ? 'Please describe your subscription terms.' : '';
      default:
        return '';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const fieldValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prevData => {
      const newData = { ...prevData, [name]: fieldValue };
      
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        newErrors[name as keyof TOSFormData] = validateField(name as keyof TOSFormData, fieldValue, newData);

        // Handle dependent validations
        if (name === 'businessType') {
          newErrors.otherBusinessType = validateField('otherBusinessType', newData.otherBusinessType || '', newData);
        } else if (name === 'collectsUserData') {
          newErrors.userDataDescription = validateField('userDataDescription', newData.userDataDescription || '', newData);
        } else if (name === 'hasRefundPolicy') {
          newErrors.refundPolicyDescription = validateField('refundPolicyDescription', newData.refundPolicyDescription || '', newData);
        } else if (name === 'hasDisputeResolution') {
          newErrors.disputeResolutionDescription = validateField('disputeResolutionDescription', newData.disputeResolutionDescription || '', newData);
        } else if (name === 'hasSubscriptionTerms') {
          newErrors.subscriptionTermsDescription = validateField('subscriptionTermsDescription', newData.subscriptionTermsDescription || '', newData);
        }

        return newErrors;
      });
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TOSFormData, string>> = {};
    let isFormValid = true;

    (Object.keys(formData) as Array<keyof TOSFormData>).forEach(key => {
        const error = validateField(key, formData[key], formData);
        if (error) {
            newErrors[key] = error;
            isFormValid = false;
        }
    });
    
    setErrors(newErrors);

    if (!isFormValid) {
      const errorFieldOrder: (keyof TOSFormData)[] = [
        'businessName', 'websiteUrl', 'contactEmail', 'otherBusinessType',
        'servicesDescription', 'userDataDescription', 'refundPolicyDescription',
        'disputeResolutionDescription', 'subscriptionTermsDescription',
      ];
      
      const firstErrorField = errorFieldOrder.find(field => newErrors[field]);
      
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus({ preventScroll: true });
        }
      }
    }

    return isFormValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit(formData);
    }
  };

  const isPremiumFeatureSelected =
    formData.collectsUserData ||
    formData.hasRefundPolicy ||
    formData.hasDisputeResolution ||
    formData.hasSubscriptionTerms;

  const inputClasses = "w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 transition-colors duration-200 ease-in-out hover:border-brand-navy/70";
  const errorInputClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const validInputClasses = 'focus:ring-brand-navy focus:border-brand-navy';

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b pb-3">
          <h2 className="text-2xl font-bold text-slate-800">Your Business Details</h2>
          <p className="text-sm text-slate-600 mt-1">
            Fill in the details below. Not sure what to expect?{' '}
            <button type="button" onClick={() => setIsExamplesModalOpen(true)} className="text-brand-navy font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-brand-navy rounded">
              See an example
            </button>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} required className={`${inputClasses} ${errors.businessName ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.businessName} aria-describedby={errors.businessName ? 'businessName-error' : undefined} placeholder="e.g., Lagbaja Ventures"/>
            {errors.businessName && <p id="businessName-error" className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
          </div>
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-700 mb-1">Website or App URL (Optional)</label>
            <input type="url" name="websiteUrl" id="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className={`${inputClasses} ${errors.websiteUrl ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.websiteUrl} aria-describedby={errors.websiteUrl ? 'websiteUrl-error' : undefined} placeholder="https://example.ng"/>
            {errors.websiteUrl && <p id="websiteUrl-error" className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>}
          </div>
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
            <select name="businessType" id="businessType" value={formData.businessType} onChange={handleChange} className={`${inputClasses} ${validInputClasses}`}>
              <option>E-commerce</option>
              <option>SaaS (Software as a Service)</option>
              <option>Retail / Physical Store</option>
              <option>Service Provider (e.g., consultancy, agency)</option>
              <option>Blog / Media Publisher</option>
              <option>Hospitality (e.g., Restaurant, Hotel)</option>
              <option>Mobile App</option>
              <option>Non-Profit Organization</option>
              <option>Other</option>
            </select>
          </div>
          <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">Public Contact Email</label>
              <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} required className={`${inputClasses} ${errors.contactEmail ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.contactEmail} aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined} placeholder="support@example.ng"/>
              {errors.contactEmail && <p id="contactEmail-error" className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
          </div>
        </div>
        
        {formData.businessType === 'Other' && (
          <div>
            <label htmlFor="otherBusinessType" className="block text-sm font-medium text-slate-700 mb-1">Please specify your business type</label>
            <input 
              type="text" 
              name="otherBusinessType" 
              id="otherBusinessType" 
              value={formData.otherBusinessType || ''} 
              onChange={handleChange} 
              required 
              ref={otherBusinessTypeRef}
              className={`${inputClasses} ${errors.otherBusinessType ? errorInputClasses : validInputClasses}`} 
              aria-invalid={!!errors.otherBusinessType} 
              aria-describedby={errors.otherBusinessType ? 'otherBusinessType-error' : undefined}
              placeholder="e.g., Online Marketplace, Logistics Service"
            />
            {errors.otherBusinessType && <p id="otherBusinessType-error" className="mt-1 text-sm text-red-600">{errors.otherBusinessType}</p>}
          </div>
        )}

        <div>
          <div className="flex items-center space-x-2 mb-1">
            <label htmlFor="servicesDescription" className="text-sm font-medium text-slate-700">Describe your Products/Services</label>
            <Tooltip text="Provide a clear and concise summary of what your business offers. This helps users understand the scope of your services and is important for consumer protection." />
          </div>
          <textarea name="servicesDescription" id="servicesDescription" value={formData.servicesDescription} onChange={handleChange} required rows={4} className={`${inputClasses} ${errors.servicesDescription ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.servicesDescription} aria-describedby={errors.servicesDescription ? 'servicesDescription-error' : undefined} placeholder="Briefly describe what your business offers to users..."></textarea>
          {errors.servicesDescription && <p id="servicesDescription-error" className="mt-1 text-sm text-red-600">{errors.servicesDescription}</p>}
        </div>

        <div>
          <div className="flex items-center">
              <input type="checkbox" name="collectsUserData" id="collectsUserData" checked={formData.collectsUserData} onChange={handleChange} className="h-4 w-4 text-brand-navy border-slate-300 rounded focus:ring-brand-navy"/>
              <label htmlFor="collectsUserData" className="ml-2 flex items-center space-x-2 text-sm font-medium text-slate-700">
                <span>Do you collect user data?</span>
                <ProBadge />
                <Tooltip text="Select this if you gather any personal information from users, such as names, email addresses, phone numbers, IP addresses, or browsing activity. This is crucial for NDPR compliance." />
              </label>
          </div>
        </div>

        {formData.collectsUserData && (
          <div>
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="userDataDescription" className="text-sm font-medium text-slate-700">What kind of user data do you collect?</label>
                <Tooltip text="List the specific types of data you collect. For example: 'Contact information (name, email), payment details, and website usage analytics.' Be as specific as possible." />
              </div>
              <textarea name="userDataDescription" id="userDataDescription" value={formData.userDataDescription} onChange={handleChange} required rows={3} ref={userDataDescriptionRef} className={`${inputClasses} ${errors.userDataDescription ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.userDataDescription} aria-describedby={errors.userDataDescription ? 'userDataDescription-error' : undefined} placeholder="e.g., Personal names, email addresses, payment information, browsing history..."></textarea>
              {errors.userDataDescription && <p id="userDataDescription-error" className="mt-1 text-sm text-red-600">{errors.userDataDescription}</p>}
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-xl font-bold text-slate-800">Optional Clauses</h3>
          <p className="text-sm text-slate-600 mt-1">Select any additional clauses you'd like to include.</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center">
                <input type="checkbox" name="hasRefundPolicy" id="hasRefundPolicy" checked={formData.hasRefundPolicy} onChange={handleChange} className="h-4 w-4 text-brand-navy border-slate-300 rounded focus:ring-brand-navy"/>
                <label htmlFor="hasRefundPolicy" className="ml-2 flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <span>Include a Refund Policy?</span>
                  <ProBadge />
                  <Tooltip text="Clearly defining your refund policy is a key requirement under the Nigerian Federal Competition and Consumer Protection Act 2018 (FCCPA) to prevent unfair business practices." />
                </label>
            </div>
            {formData.hasRefundPolicy && (
              <div className="mt-2">
                  <label htmlFor="refundPolicyDescription" className="block text-sm font-medium text-slate-700 mb-1">Briefly describe your refund policy</label>
                  <textarea name="refundPolicyDescription" id="refundPolicyDescription" value={formData.refundPolicyDescription} onChange={handleChange} required rows={3} ref={refundPolicyDescriptionRef} className={`${inputClasses} ${errors.refundPolicyDescription ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.refundPolicyDescription} aria-describedby={errors.refundPolicyDescription ? 'refundPolicyDescription-error' : undefined} placeholder="e.g., We offer a 14-day money-back guarantee. No refunds for services already rendered..."></textarea>
                  {errors.refundPolicyDescription && <p id="refundPolicyDescription-error" className="mt-1 text-sm text-red-600">{errors.refundPolicyDescription}</p>}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center">
                <input type="checkbox" name="hasDisputeResolution" id="hasDisputeResolution" checked={formData.hasDisputeResolution} onChange={handleChange} className="h-4 w-4 text-brand-navy border-slate-300 rounded focus:ring-brand-navy"/>
                <label htmlFor="hasDisputeResolution" className="ml-2 flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <span>Include a Dispute Resolution (Arbitration) Clause?</span>
                  <ProBadge />
                  <Tooltip text="Adds a binding arbitration clause compliant with Nigeria's Arbitration and Mediation Act, 2023. This is a formal alternative to court litigation." />
                </label>
            </div>
            {formData.hasDisputeResolution && (
              <div className="mt-2">
                  <label htmlFor="disputeResolutionDescription" className="block text-sm font-medium text-slate-700 mb-1">Describe your arbitration process</label>
                  <textarea name="disputeResolutionDescription" id="disputeResolutionDescription" value={formData.disputeResolutionDescription} onChange={handleChange} required rows={3} ref={disputeResolutionDescriptionRef} className={`${inputClasses} ${errors.disputeResolutionDescription ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.disputeResolutionDescription} aria-describedby={errors.disputeResolutionDescription ? 'disputeResolutionDescription-error' : undefined} placeholder="e.g., Arbitration will be conducted by a single arbitrator in Lagos, Nigeria..."></textarea>
                  {errors.disputeResolutionDescription && <p id="disputeResolutionDescription-error" className="mt-1 text-sm text-red-600">{errors.disputeResolutionDescription}</p>}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center">
                <input type="checkbox" name="hasSubscriptionTerms" id="hasSubscriptionTerms" checked={formData.hasSubscriptionTerms} onChange={handleChange} className="h-4 w-4 text-brand-navy border-slate-300 rounded focus:ring-brand-navy"/>
                <label htmlFor="hasSubscriptionTerms" className="ml-2 flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <span>Include Subscription Terms?</span>
                  <ProBadge />
                   <Tooltip text="If you offer recurring billing for services (e.g., monthly SaaS plans, memberships), you need a clause covering payment cycles, cancellation rules, and any free trials." />
                </label>
            </div>
            {formData.hasSubscriptionTerms && (
              <div className="mt-2">
                  <label htmlFor="subscriptionTermsDescription" className="block text-sm font-medium text-slate-700 mb-1">Briefly describe your subscription terms</label>
                  <textarea name="subscriptionTermsDescription" id="subscriptionTermsDescription" value={formData.subscriptionTermsDescription} onChange={handleChange} required rows={3} ref={subscriptionTermsDescriptionRef} className={`${inputClasses} ${errors.subscriptionTermsDescription ? errorInputClasses : validInputClasses}`} aria-invalid={!!errors.subscriptionTermsDescription} aria-describedby={errors.subscriptionTermsDescription ? 'subscriptionTermsDescription-error' : undefined} placeholder="e.g., Subscriptions are billed monthly/annually. Users can cancel anytime, but no refunds for partial periods..."></textarea>
                  {errors.subscriptionTermsDescription && <p id="subscriptionTermsDescription-error" className="mt-1 text-sm text-red-600">{errors.subscriptionTermsDescription}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-start gap-4 pt-4 border-t">
          <button 
            type="button" 
            onClick={onClear} 
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors">
            Clear Form
          </button>
          <div className="w-full sm:flex-1">
            <button 
              type="submit"
              disabled={isLoading} 
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors ${
                isPremiumFeatureSelected
                ? 'bg-brand-gold hover:bg-yellow-500 text-slate-900 focus:ring-brand-gold'
                : 'bg-brand-navy hover:bg-brand-navy-dark text-white focus:ring-brand-navy'
              }`}
            >
              {isLoading
                ? 'Generating...'
                : isPremiumFeatureSelected
                ? 'Generate Pro Preview'
                : 'Generate TOS'}
            </button>
            {!isLoading && (
              isPremiumFeatureSelected ? (
                <p className="text-center text-xs text-slate-500 mt-2">
                  Generate a preview. Payment is required to unlock the full document.
                </p>
              ) : (
                <p className="text-center text-xs text-slate-500 mt-2">
                  Free for basic TOS. No credit card required.
                </p>
              )
            )}
          </div>
        </div>
      </form>
      <TOSExamplesModal isOpen={isExamplesModalOpen} onClose={() => setIsExamplesModalOpen(false)} />
    </>
  );
};

export default TOSForm;
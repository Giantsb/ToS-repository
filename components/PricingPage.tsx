import React from 'react';

const CheckIcon = () => (
  <svg className="h-5 w-5 text-brand-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// Fix: Add a props interface for PricingCard to correctly type its properties.
interface PricingCardProps {
  plan: string;
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  cta?: string;
  popular?: boolean;
}

const PricingCard = ({ plan, price, priceSuffix, description, features, cta, popular = false }: PricingCardProps) => (
  <div className={`rounded-lg shadow-lg p-6 flex flex-col ${popular ? 'border-2 border-brand-gold' : 'border border-slate-200'} bg-white`}>
    {popular && (
      <span className="bg-brand-gold text-slate-900 text-xs font-bold px-3 py-1 rounded-full self-start mb-4">MOST POPULAR</span>
    )}
    <h3 className="text-xl font-bold text-slate-800">{plan}</h3>
    <div className="my-4">
      <p className="text-3xl font-extrabold text-slate-900 inline-block">{price}</p>
      {priceSuffix && <p className="text-sm text-slate-500 ml-1">{priceSuffix}</p>}
    </div>
    <p className="text-slate-600 mb-6 flex-grow">{description}</p>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckIcon />
          <span className="ml-3 text-slate-700">{feature}</span>
        </li>
      ))}
    </ul>
    {cta && (
      <button className={`w-full mt-auto py-3 px-4 rounded-md font-semibold transition-colors ${popular ? 'bg-brand-gold text-slate-900 hover:bg-yellow-500' : 'bg-white text-brand-navy border border-brand-navy hover:bg-brand-navy hover:text-white'}`}>
        {cta}
      </button>
    )}
  </div>
);

const PricingPage: React.FC = () => {
  const plans = [
    {
      plan: 'Basic Document',
      price: 'Free',
      priceSuffix: 'No credit card required',
      cta: 'Start for Free',
      description: 'For generating a standard Terms of Service document with all essential clauses.',
      features: [
        'Standard business clauses',
        'Formatted HTML output',
        'Legally-sound baseline document',
        'Community support',
      ],
    },
    {
      plan: 'Pro Document',
      price: '₦4,500',
      priceSuffix: 'One-time payment per document',
      cta: 'Get Pro Document',
      description: 'For a single document generation that includes any of our advanced clauses like Refund Policies, Dispute Resolution, and more.',
      features: [
        'Add any or all Pro clauses to your document',
        'Full customization of all clauses',
        'Downloadable final document',
        'Priority email support',
      ],
      popular: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">Simple, Pay-Per-Document Pricing</h1>
        <p className="mt-4 text-lg text-slate-600">
          Generate a basic document for free, or add advanced clauses to your document for a simple one-time fee.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((p, i) => (
          <PricingCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
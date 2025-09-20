import React, { useState, useEffect } from 'react';

// TypeScript declaration for the Paystack script, which is loaded in index.html
declare const PaystackPop: any;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  userEmail: string;
}

type PaymentStatus = 'idle' | 'processing' | 'success';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, amount, userEmail }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  // NOTE: In a real-world application, this public key should be stored in an environment variable.
  // This is a test key provided by Paystack.
  const PAYSTACK_PUBLIC_KEY = 'pk_test_816e9945a054231570776ffd0f2d93d56f4e1577';

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape' && paymentStatus === 'idle') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, paymentStatus]);
  
  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        onPaymentSuccess();
      }, 1500); // Show success message for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, onPaymentSuccess]);


  const handlePayment = () => {
    setPaymentStatus('processing');
    
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: amount * 100, // Amount in Kobo
      ref: `TOS-${Date.now()}`, // Unique transaction reference
      onClose: () => {
        // User closed the popup
        setPaymentStatus('idle');
      },
      callback: (response: any) => {
        // Payment successful. In a real app, you would verify the transaction
        // on your backend server using the reference: response.reference
        console.log('Paystack response:', response);
        setPaymentStatus('success');
      },
    });

    handler.openIframe();
  };

  const formattedAmount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      onClick={paymentStatus === 'idle' ? onClose : undefined}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-slate-800">Complete Your Payment</h2>
          <button 
            onClick={onClose} 
            disabled={paymentStatus !== 'idle'}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy disabled:opacity-50"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="bg-slate-50">
          <div className="p-6">
            {paymentStatus === 'success' ? (
              <div className="text-center py-8 transition-opacity duration-500">
                <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                  <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mt-4">Payment Successful!</h3>
                <p className="text-slate-500 mt-1">Finalizing your document...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-600">You are about to make a one-time payment for a Pro Document.</p>
                <p className="text-4xl font-bold text-slate-800 tracking-tight my-4">{formattedAmount}</p>
                <div className="bg-white p-3 rounded-md border text-left mb-6">
                    <p className="text-xs text-slate-500">Billed to:</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{userEmail}</p>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-navy hover:bg-brand-navy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy transition-colors disabled:bg-slate-400 disabled:cursor-wait"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Waiting for popup...
                    </>
                  ) : `Pay ${formattedAmount}`}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 flex items-center justify-center text-xs text-slate-500 border-t bg-white rounded-b-lg">
          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Secure payment powered by PayStack
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
export interface TOSFormData {
  businessName: string;
  websiteUrl: string;
  businessType: 'E-commerce' | 'SaaS (Software as a Service)' | 'Retail / Physical Store' | 'Service Provider (e.g., consultancy, agency)' | 'Blog / Media Publisher' | 'Hospitality (e.g., Restaurant, Hotel)' | 'Mobile App' | 'Non-Profit Organization' | 'Other';
  otherBusinessType?: string;
  servicesDescription: string;
  collectsUserData: boolean;
  userDataDescription: string;
  contactEmail: string;
  hasRefundPolicy: boolean;
  refundPolicyDescription: string;
  hasDisputeResolution: boolean;
  disputeResolutionDescription: string;
  hasSubscriptionTerms: boolean;
  subscriptionTermsDescription: string;
}

export interface SavedTOSDocument {
  id: string;
  name: string;
  content: string;
  isPro: boolean;
  isUnlocked: boolean;
  createdAt: string;
}

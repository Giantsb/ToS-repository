import { GoogleGenAI } from "@google/genai";
import type { TOSFormData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(data: TOSFormData): string {
  const businessTypeDisplay = data.businessType === 'Other' && data.otherBusinessType 
    ? data.otherBusinessType 
    : data.businessType;

  // Determine if this is a "Pro" document generation
  const isPremium = data.collectsUserData ||
                    data.hasRefundPolicy ||
                    data.hasDisputeResolution ||
                    data.hasSubscriptionTerms;

  // Conditionally include NDPR compliance based on user input
  const complianceInstruction = `2.  Ensure all clauses are compliant with key Nigerian legislation, including the Federal Competition and Consumer Protection Act 2018 (FCCPA 2018), ${data.collectsUserData ? 'the Nigerian Data Protection Regulation 2019 (NDPR 2019), ' : ''}and the principles of Nigerian Contract Law.`;

  // Provide specific instructions for the Privacy Policy section based on data collection
  const privacyPolicyInstruction = data.collectsUserData
    ? `8.  If the business collects user data, the Privacy Policy section MUST explicitly state that data handling complies with the Nigerian Data Protection Regulation 2019 (NDPR).`
    : `8.  The business has indicated it does not collect user data. The Privacy Policy section should be very brief, stating that no personal user data is collected. You MUST NOT mention the Nigerian Data Protection Regulation 2019 (NDPR) anywhere in the document.`;

  // Provide different instructions for the disclaimer based on the document type (Free vs. Pro)
  const disclaimerWarrantiesInstruction = isPremium
    ? `- Disclaimer of Warranties (Ensure this section is drafted in compliance with consumer rights under the FCCPA 2018.)`
    : `- Disclaimer of Warranties (Provide a standard 'as is' disclaimer. For this basic version, you MUST NOT include any text that refers to not limiting statutory warranties or consumer rights under the FCCPA 2018.)`;


  let optionalClauses = '';
  if (data.hasSubscriptionTerms) {
    optionalClauses += `
    - **Subscription Terms:** The business offers subscriptions. Include a section that covers billing cycles, cancellation policies, and any trial periods. Use these user-provided details as a guide: "${data.subscriptionTermsDescription}".`;
  }
  if (data.hasRefundPolicy) {
    optionalClauses += `
    - **Refund Policy:** The business has a specific refund policy. Add a section detailing this policy, ensuring it is clear, prominent, and unambiguous to comply with the Federal Competition and Consumer Protection Act 2018 (FCCPA). Use these user-provided details as a guide: "${data.refundPolicyDescription}".`;
  }
  if (data.hasDisputeResolution) {
    optionalClauses += `
    - **Dispute Resolution by Arbitration:** The business requires a binding arbitration clause. You MUST create a section titled "Dispute Resolution by Arbitration". This section must state that disputes arising from the Terms will be resolved through binding arbitration, making it a formal alternative to court proceedings. The clause MUST be drafted in accordance with and explicitly reference the **Nigerian Arbitration and Mediation Act, 2023**. Use the following user-provided details to outline the process: "${data.disputeResolutionDescription}".`;
  }

  return `
    Act as a legal expert specializing in Nigerian business law. Your task is to generate a comprehensive, well-structured Terms of Service (TOS) document for a Nigerian-based business, which may be online, offline, or both.

    **IMPORTANT INSTRUCTIONS:**
    1.  The governing law MUST be explicitly stated as "the laws of the Federal Republic of Nigeria".
    ${complianceInstruction}
    3.  The tone should be professional, clear, and easy to understand. Avoid overly complex legal jargon where possible.
    4.  Use simple HTML for formatting. Each section heading MUST be numerically ordered and formatted inside an <h2> tag. For example: "<h2>1. Introduction</h2>", "<h2>2. Acceptance of Terms</h2>", and so on. This numbering is critical for the document's structure. Use <p> tags for paragraphs, <strong> for bold text, and <ul>/<ol>/<li> for lists.
    5.  Generate ONLY the raw HTML for the TOS document. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags. Do not include any introductory or concluding remarks like "Here is your TOS document".
    6.  Include a strong disclaimer stating that this document is a template and does not constitute legal advice, and the business should consult a qualified legal professional. This disclaimer should be wrapped in its own <p> tag with <strong> emphasis.
    7.  For the 'User Conduct', 'Intellectual Property Rights', and 'Limitation of Liability' sections specifically, use exceptionally clear and concise language. Break down complex concepts into simple terms to ensure they are easily understood by a non-legal audience.
    ${privacyPolicyInstruction}

    **Business Details:**
    *   **Business Name:** ${data.businessName}
    *   **Website/App URL:** ${data.websiteUrl || 'Not provided.'}
    *   **Business Type:** ${businessTypeDisplay}
    *   **Description of Services/Products:** ${data.servicesDescription}
    *   **Contact Email:** ${data.contactEmail}

    **User Data Collection:**
    *   **Does it collect user data?** ${data.collectsUserData ? 'Yes' : 'No'}
    *   **Description of data collected:** ${data.collectsUserData ? data.userDataDescription : 'Not applicable.'}

    **Required Sections to Include:**
    Generate the TOS with the following sections in a logical order. The section numbers MUST be sequential (1, 2, 3, etc.).
    - Introduction
    - Acceptance of Terms
    - Description of Service/Products (This section must be clear and detailed, in line with FCCPA 2018 requirements.)
    - User Accounts (if applicable, otherwise omit)
    - User Conduct and Prohibited Activities
    - Intellectual Property Rights
    - User-Generated Content (if applicable, otherwise omit)
    - Privacy Policy
    ${optionalClauses ? `
    **Additional Required Sections (Based on User Input):**
    You MUST also include sections for the following topics. Integrate them logically with the sections above and ensure numbering remains sequential.
    ${optionalClauses}` : ''}
    - Termination
    ${disclaimerWarrantiesInstruction}
    - Limitation of Liability
    - Indemnification
    - Governing Law and Jurisdiction (Must be Federal Republic of Nigeria)
    - Changes to Terms
    - Contact Information
    - Legal Disclaimer (reiterate that this is not legal advice)

    Now, generate the complete Terms of Service document in HTML based on all these details.
  `;
}

export const generateTOS = async (data: TOSFormData): Promise<string> => {
  try {
    const prompt = buildPrompt(data);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating TOS with Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The configured API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to generate Terms of Service. The AI service may be temporarily unavailable.");
  }
};
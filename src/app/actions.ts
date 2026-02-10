'use server';

import {
  generateDomainSuggestions,
  type DomainSuggestionInput,
} from '@/ai/flows/generate-domain-suggestions';
import {
  explainDomainSuggestion,
  type ExplainDomainSuggestionInput,
} from '@/ai/flows/explain-domain-suggestion';
import type { DomainSuggestionOutput, ExplainDomainSuggestionOutput } from '@/lib/types';


export async function getDomainSuggestions(data: DomainSuggestionInput): Promise<DomainSuggestionOutput> {
  // TODO: For interns - Here you can add logic to save user input to a CRM or database.
  // Example: await crm.saveLead({ email: data.email, ... });
  console.log('Generating suggestions for:', data.projectName);

  // Tag workflow based on user type
  const crmTag = data.userType === 'Business' ? 'business-domain' : 'personal-domain';
  console.log(`// TODO: For interns - Add tag "${crmTag}" to user in CRM.`);
  
  try {
    const result = await generateDomainSuggestions(data);
    return result;
  } catch (e) {
    console.error('Error in getDomainSuggestions:', e);
    throw new Error('Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
  }
}

export async function getDomainExplanation(data: ExplainDomainSuggestionInput): Promise<ExplainDomainSuggestionOutput> {
  // TODO: For interns - Add any necessary logging or tracking for this action, e.g., tracking which domains users are most interested in.
  try {
    const result = await explainDomainSuggestion(data);
    return result;
  } catch (e) {
    console.error('Error in getDomainExplanation:', e);
    throw new Error('Failed to get a detailed explanation. Please try again.');
  }
}

export async function logDomainRegistration(domainName: string, userType: 'Business' | 'Personal') {
  // TODO: For interns - This function should be called when a user clicks "Register".
  // 1. Capture the user's information (if available) and the selected domain.
  // 2. Send this information to your CRM.
  // 3. Trigger an automated follow-up sequence (e.g., email or notification).
  console.log(`// TODO: For interns - User clicked register for "${domainName}".`);
  console.log(`// TODO: For interns - Send to CRM and trigger follow-up for ${userType} user.`);
}

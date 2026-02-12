'use server';

import type {
  DomainSuggestionOutput,
  ExplainDomainSuggestionOutput,
  ExplainDomainSuggestionInput,
  FormDataType as DomainSuggestionInput,
} from '@/lib/types';

const OLLAMA_URL = `${process.env.OLLAMA_BASE_URL}/api/chat`;
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

async function queryOllama(messages: any[]) {
  if (!OLLAMA_URL || !OLLAMA_API_KEY) {
    throw new Error('Ollama environment variables (OLLAMA_BASE_URL, OLLAMA_API_KEY) are not set.');
  }

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OLLAMA_API_KEY}`,
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
      format: 'json'
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Ollama API Error:', errorBody);
    throw new Error(`Ollama API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.message?.content;

  if (!content) {
    throw new Error('No content returned from the AI.');
  }
  
  // The content is a JSON string, so we parse it.
  return JSON.parse(content);
}

export async function getDomainSuggestions(data: DomainSuggestionInput): Promise<DomainSuggestionOutput> {
  // TODO: For interns - Here you can add logic to save user input to a CRM or database.
  // Example: await crm.saveLead({ email: data.email, ... });
  console.log('Generating suggestions for:', data.projectName);

  // Tag workflow based on user type
  const crmTag = data.userType === 'Business' ? 'business-domain' : 'personal-domain';
  console.log(`// TODO: For interns - Add tag "${crmTag}" to user in CRM.`);
  
  const systemPrompt = `You are an AI domain name generator. Analyze the provided project details and generate a list of domain name suggestions.
Return the result as a valid JSON object that conforms to this structure: { "suggestions": [{ "domainName": "string", "confidenceScore": number (0-1), "explanation": "string" }] }.
Do not include any text, markdown, or formatting outside of the single JSON object.`;

  const userPrompt = `Project Name: ${data.projectName}
Business Niche: ${data.businessNiche}
Target Audience: ${data.targetAudience}
Keywords: ${data.keywords}
Preferred TLDs: ${data.preferredTLDs}

Consider market trends, branding potential, memorability, and audience relevance when generating suggestions.
Return the top 3-5 domain suggestions.`;

  try {
    const result = await queryOllama([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    return result;
  } catch (e) {
    console.error('Error in getDomainSuggestions:', e);
    throw new Error('Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
  }
}

export async function getDomainExplanation(data: ExplainDomainSuggestionInput): Promise<ExplainDomainSuggestionOutput> {
  // TODO: For interns - Add any necessary logging or tracking for this action, e.g., tracking which domains users are most interested in.
  const systemPrompt = `You are an AI domain name expert. Your task is to provide a detailed explanation about a domain suggestion.
Return the result as a valid JSON object that conforms to this structure: { "explanation": "string" }.
The explanation inside the JSON should be formatted with markdown (e.g. using '*' for bullet points).
Do not include any text, markdown, or formatting outside of the single JSON object.`;

  const userPrompt = `A user is considering the domain name "${data.domainSuggestion}" for their project. The following information is known about the project:

Project or Business Name: ${data.projectOrBusinessName}
Business Niche or Personal Project Type: ${data.businessNicheOrPersonalProjectType}
Target Audience or Location: ${data.targetAudienceOrLocation}
Keywords or Ideas for the Domain: ${data.keywordsOrIdeasForDomain}

Explain in detail why "${data.domainSuggestion}" is a good domain name for this project. Your explanation should cover the following aspects:

*   Market trends and search demand
*   Branding potential and memorability
*   Audience relevance.

Focus on being informative and persuasive. Provide specific reasons and insights to help the user make an informed decision.`;

  try {
    const result = await queryOllama([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ]);
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

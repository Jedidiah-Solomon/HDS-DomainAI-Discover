'use server';

import type {
  DomainSuggestionOutput,
  ExplainDomainSuggestionInput,
  FormDataType as DomainSuggestionInput,
} from '@/lib/types';

// Ollama Configuration
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
  console.log('Generating suggestions for:', data.projectName);
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

export async function getDomainExplanation(data: ExplainDomainSuggestionInput): Promise<{ explanation: string }> {
    const researchPrompt = `Perform a comprehensive market and trend analysis for the domain name "${data.domainSuggestion}".
The user is considering this for a project with the following details:
- Project/Business Name: ${data.projectOrBusinessName}
- Niche/Project Type: ${data.businessNicheOrPersonalProjectType}
- Target Audience/Location: ${data.targetAudienceOrLocation}
- Keywords: ${data.keywordsOrIdeasForDomain}

Your research must be deep and cover the following areas, using your knowledge of web search capabilities (Google, Google Trends, social media, etc.):
1.  **Market Viability:** Is there a demand for businesses or projects in this niche? What is the competition like?
2.  **Trend Analysis:** Based on general knowledge of market trends, what are the current and projected trends related to the niche and keywords? Is interest growing, stable, or declining?
3.  **Branding & Memorability:** How strong is "${data.domainSuggestion}" from a branding perspective? Is it memorable, easy to spell, and unique?
4.  **Audience Resonance:** Does the domain name resonate with the target audience?
5.  **SEO Potential:** Analyze the SEO potential. Are the keywords in the domain valuable for search ranking?
6.  **Social Media Availability:** Comment on the likely availability of handles matching or similar to the domain name on major platforms (Twitter/X, Instagram, Facebook).

Provide a structured, detailed report with clear headings for each section. Conclude with a final recommendation (e.g., Highly Recommended, Recommended, Consider Alternatives) and a summary of why.
Return the result as a valid JSON object that conforms to this structure: { "explanation": "your-detailed-analysis-string" }.
The explanation should be a single string with markdown for formatting. Do not include any text outside of the single JSON object.`;

    try {
        const result = await queryOllama([
          { role: 'system', content: researchPrompt }
        ]);
        return result;

    } catch (e: any) {
        console.error('Error getting domain explanation:', e);
        throw new Error(e.message || 'Failed to get domain explanation from AI.');
    }
}


export async function logDomainRegistration(domainName: string, userType: 'Business' | 'Personal') {
  // TODO: For interns - This function should be called when a user clicks "Register".
  console.log(`// TODO: For interns - User clicked register for "${domainName}".`);
  console.log(`// TODO: For interns - Send to CRM and trigger follow-up for ${userType} user.`);
}

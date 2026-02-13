'use server';

import type { DomainSuggestionOutput, ExplainDomainSuggestionInput, FormDataType as DomainSuggestionInput } from '@/lib/types';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

async function runOllamaChat(messages: { role: string; content: string }[]): Promise<any> {
  if (!OLLAMA_BASE_URL || !OLLAMA_API_KEY || !OLLAMA_MODEL) {
    throw new Error('Ollama environment variables are not configured.');
  }

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': OLLAMA_API_KEY,
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Ollama API Error:', errorBody);
    throw new Error(`Failed to communicate with the AI service. Status: ${response.status}`);
  }

  const json = await response.json();
  return json;
}

export async function getDomainSuggestions(data: DomainSuggestionInput): Promise<DomainSuggestionOutput> {
  console.log('Generating suggestions for:', data.projectName);
  const crmTag = data.userType === 'Business' ? 'business-domain' : 'personal-domain';
  console.log(`// TODO: For interns - Add tag "${crmTag}" to user in CRM.`);
  
  const systemPrompt = `You are an AI domain name generator. Your task is to analyze the provided project details and generate a list of 3-5 domain name suggestions.
For each suggestion, provide the domain name, a confidence score between 0 and 1 indicating how good the suggestion is, and a brief explanation.
You MUST reply with ONLY a valid JSON object that matches this structure: { "suggestions": [{ "domainName": string, "confidenceScore": number, "explanation": string }] }. Do not include any other text, markdown, or commentary before or after the JSON object.`;

  const userPrompt = `
    Project Name: ${data.projectName}
    Business Niche: ${data.businessNiche}
    Target Audience: ${data.targetAudience}
    Keywords: ${data.keywords}
    Preferred TLDs: ${data.preferredTLDs}
  `;

  try {
    const response = await runOllamaChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    
    if (response?.message?.content) {
      // Sometimes the model wraps the JSON in markdown, let's strip it.
      const cleanedContent = response.message.content.replace(/```json\n|```/g, '').trim();
      const suggestions = JSON.parse(cleanedContent);
      if (suggestions && suggestions.suggestions) {
        return suggestions;
      }
    }
    throw new Error('AI returned an invalid response format.');
  } catch (e) {
    console.error('Error in getDomainSuggestions:', e);
    if (e instanceof Error) {
      throw new Error(e.message || 'Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
    }
    throw new Error('Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
  }
}

export async function getDomainAnalysis(data: ExplainDomainSuggestionInput): Promise<string> {
   const prompt = `You are a market research analyst AI. Perform a comprehensive market and trend analysis for the domain name "${data.domainSuggestion}".
The user is considering this for a project with the following details:
- Project/Business Name: ${data.projectOrBusinessName}
- Niche/Project Type: ${data.businessNicheOrPersonalProjectType}
- Target Audience/Location: ${data.targetAudienceOrLocation}
- Keywords: ${data.keywordsOrIdeasForDomain}

Your research must be deep and cover the following areas:
1.  **Market Viability:** Is there a demand for businesses or projects in this niche? What is the competition like?
2.  **Trend Analysis:** Based on general knowledge of market trends, what are the current and projected trends related to the niche and keywords? Is interest growing, stable, or declining?
3.  **Branding & Memorability:** How strong is "${data.domainSuggestion}" from a branding perspective? Is it memorable, easy to spell, and unique?
4.  **Audience Resonance:** Does the domain name resonate with the target audience?
5.  **SEO Potential:** Analyze the SEO potential. Are the keywords in the domain valuable for search ranking?
6.  **Social Media Availability:** Comment on the likely availability of handles matching or similar to the domain name on major platforms (Twitter/X, Instagram, Facebook).

Provide a structured, detailed report with clear headings for each section. Conclude with a final recommendation (e.g., Highly Recommended, Recommended, Consider Alternatives) and a summary of why.
Format the response using markdown.
`;
  try {
     const response = await runOllamaChat([
      { role: 'user', content: prompt },
    ]);

    if (response?.message?.content) {
        return response.message.content;
    }

    throw new Error('AI returned an empty analysis.');
  } catch(e) {
    console.error('Error in getDomainAnalysis:', e);
    if (e instanceof Error) {
        throw e;
    }
    throw new Error('An unexpected response was received from the server.');
  }
}

export async function logDomainRegistration(domainName: string, userType: 'Business' | 'Personal') {
  // TODO: For interns - This function should be called when a user clicks "Register".
  console.log(`// TODO: For interns - User clicked register for "${domainName}".`);
  console.log(`// TODO: For interns - Send to CRM and trigger follow-up for ${userType} user.`);
}

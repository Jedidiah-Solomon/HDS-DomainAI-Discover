'use server';

import type {
  DomainSuggestionOutput,
  ExplainDomainSuggestionInput,
  FormDataType as DomainSuggestionInput,
} from '@/lib/types';

// Ollama Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const OLLAMA_URL = OLLAMA_BASE_URL ? `${OLLAMA_BASE_URL}/api/chat` : '';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;


async function queryOllama(messages: any[], format: 'json' | 'text' = 'json') {
  if (!OLLAMA_URL.startsWith('http')) {
    throw new Error('Ollama URL is not correctly set in environment variables.');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Your endpoint requires an x-api-key header for authentication.
  if (OLLAMA_API_KEY) {
    headers['x-api-key'] = OLLAMA_API_KEY;
  }

  const body: any = {
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false,
  };

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Ollama API Error:', errorBody);
    throw new Error(`Ollama API request failed with status ${response.status}`);
  }

  const data = await response.json();
  // For the /api/chat endpoint, the response is in data.message.content
  const content = data.message?.content;

  if (!content) {
    console.error('Ollama response did not contain expected content:', data);
    throw new Error('An unexpected response was received from the server.');
  }
  
  if (format === 'json') {
    try {
      // The content is expected to be a JSON string that needs to be parsed.
      return JSON.parse(content);
    } catch (e) {
        console.warn("Failed to parse JSON directly from Ollama response, trying to extract from markdown.", content);
        // If direct parsing fails, the model might have wrapped the JSON in markdown.
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e2) {
                console.error("Failed to parse extracted JSON from Ollama markdown:", jsonMatch[1]);
                throw new Error("AI returned invalid JSON, even after extraction from markdown.");
            }
        }
        throw new Error("AI returned invalid JSON.");
    }
  }
  return content; // Return raw text content
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
    ], 'json');
    return result;
  } catch (e) {
    console.error('Error in getDomainSuggestions:', e);
    if (e instanceof Error) {
        throw e;
    }
    throw new Error('Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
  }
}

export async function getDomainAnalysis(data: ExplainDomainSuggestionInput): Promise<string> {
    const prompt = `Perform a comprehensive market and trend analysis for the domain name "${data.domainSuggestion}".
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
Format the response using markdown.
`;

  try {
    const result = await queryOllama([
        { role: 'system', content: 'You are a market research analyst AI.' },
        { role: 'user', content: prompt },
    ], 'text');
    return result;
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

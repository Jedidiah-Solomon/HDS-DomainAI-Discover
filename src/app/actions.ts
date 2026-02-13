'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import type { DomainSuggestionOutput, ExplainDomainSuggestionInput, FormDataType as DomainSuggestionInput } from '@/lib/types';
import { DomainSuggestionInputSchema } from '@/lib/types';

// Define Zod schema for a single suggestion
const DomainSuggestionSchema = z.object({
  domainName: z.string().describe('The suggested domain name, including the TLD.'),
  confidenceScore: z.number().min(0).max(1).describe('A score from 0 to 1 indicating the confidence in the suggestion.'),
  explanation: z.string().describe('A brief explanation of why this domain is a good suggestion.'),
});

// Define Zod schema for the full output
const DomainSuggestionOutputSchema = z.object({
  suggestions: z.array(DomainSuggestionSchema).describe('A list of 3-5 domain name suggestions.'),
});

const suggestionPrompt = ai.definePrompt({
  name: 'domainSuggestionPrompt',
  model: 'googleai/gemini-pro',
  input: { schema: DomainSuggestionInputSchema },
  output: { schema: DomainSuggestionOutputSchema },
  prompt: `You are an AI domain name generator. Analyze the provided project details and generate a list of domain name suggestions.
Project Name: {{projectName}}
Business Niche: {{businessNiche}}
Target Audience: {{targetAudience}}
Keywords: {{keywords}}
Preferred TLDs: {{preferredTLDs}}

Consider market trends, branding potential, memorability, and audience relevance when generating suggestions.
Return the top 3-5 domain suggestions.
`,
});

const getDomainSuggestionsFlow = ai.defineFlow(
  {
    name: 'getDomainSuggestionsFlow',
    inputSchema: DomainSuggestionInputSchema,
    outputSchema: DomainSuggestionOutputSchema,
  },
  async (data) => {
    const llmResponse = await suggestionPrompt(data);
    const output = llmResponse.output;
    if (!output) {
      throw new Error('AI failed to return structured output.');
    }
    return output;
  }
);


export async function getDomainSuggestions(data: DomainSuggestionInput): Promise<DomainSuggestionOutput> {
  console.log('Generating suggestions for:', data.projectName);
  const crmTag = data.userType === 'Business' ? 'business-domain' : 'personal-domain';
  console.log(`// TODO: For interns - Add tag "${crmTag}" to user in CRM.`);

  try {
    const result = await getDomainSuggestionsFlow(data);
    return result;
  } catch (e) {
    console.error('Error in getDomainSuggestions:', e);
    if (e instanceof Error) {
        throw e;
    }
    throw new Error('Failed to generate domain suggestions. The AI service may be temporarily unavailable.');
  }
}

const ExplainDomainSuggestionInputSchema = z.object({
  domainSuggestion: z.string(),
  projectOrBusinessName: z.string(),
  businessNicheOrPersonalProjectType: z.string(),
  targetAudienceOrLocation: z.string(),
  keywordsOrIdeasForDomain: z.string(),
});


const analysisPrompt = ai.definePrompt({
    name: 'domainAnalysisPrompt',
    model: 'googleai/gemini-pro',
    input: { schema: ExplainDomainSuggestionInputSchema },
    prompt: `You are a market research analyst AI. Perform a comprehensive market and trend analysis for the domain name "{{domainSuggestion}}".
The user is considering this for a project with the following details:
- Project/Business Name: {{projectOrBusinessName}}
- Niche/Project Type: {{businessNicheOrPersonalProjectType}}
- Target Audience/Location: {{targetAudienceOrLocation}}
- Keywords: {{keywordsOrIdeasForDomain}}

Your research must be deep and cover the following areas:
1.  **Market Viability:** Is there a demand for businesses or projects in this niche? What is the competition like?
2.  **Trend Analysis:** Based on general knowledge of market trends, what are the current and projected trends related to the niche and keywords? Is interest growing, stable, or declining?
3.  **Branding & Memorability:** How strong is "{{domainSuggestion}}" from a branding perspective? Is it memorable, easy to spell, and unique?
4.  **Audience Resonance:** Does the domain name resonate with the target audience?
5.  **SEO Potential:** Analyze the SEO potential. Are the keywords in the domain valuable for search ranking?
6.  **Social Media Availability:** Comment on the likely availability of handles matching or similar to the domain name on major platforms (Twitter/X, Instagram, Facebook).

Provide a structured, detailed report with clear headings for each section. Conclude with a final recommendation (e.g., Highly Recommended, Recommended, Consider Alternatives) and a summary of why.
Format the response using markdown.
`,
});

const getDomainAnalysisFlow = ai.defineFlow(
    {
        name: 'getDomainAnalysisFlow',
        inputSchema: ExplainDomainSuggestionInputSchema,
        outputSchema: z.string(),
    },
    async (data) => {
        const llmResponse = await analysisPrompt(data);
        return llmResponse.text;
    }
)

export async function getDomainAnalysis(data: ExplainDomainSuggestionInput): Promise<string> {
  try {
    const result = await getDomainAnalysisFlow(data);
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

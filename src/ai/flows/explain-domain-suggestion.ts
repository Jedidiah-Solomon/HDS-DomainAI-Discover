'use server';

/**
 * @fileOverview Explains why a suggested domain is a good fit for a project.
 *
 * - explainDomainSuggestion - A function that explains the domain suggestion.
 * - ExplainDomainSuggestionInput - The input type for the explainDomainSuggestion function.
 * - ExplainDomainSuggestionOutput - The return type for the explainDomainSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainDomainSuggestionInputSchema = z.object({
  domainSuggestion: z.string().describe('The domain name suggestion to explain.'),
  projectOrBusinessName: z.string().describe('The name of the project or business.'),
  businessNicheOrPersonalProjectType: z.string().describe('The business niche or personal project type.'),
  targetAudienceOrLocation: z.string().describe('The target audience or location.'),
  keywordsOrIdeasForDomain: z.string().describe('Keywords or ideas related to the domain.'),
});
export type ExplainDomainSuggestionInput = z.infer<typeof ExplainDomainSuggestionInputSchema>;

const ExplainDomainSuggestionOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of why the suggested domain is a good fit, including market trends, branding potential, and audience relevance.'),
});
export type ExplainDomainSuggestionOutput = z.infer<typeof ExplainDomainSuggestionOutputSchema>;

export async function explainDomainSuggestion(input: ExplainDomainSuggestionInput): Promise<ExplainDomainSuggestionOutput> {
  return explainDomainSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainDomainSuggestionPrompt',
  input: {schema: ExplainDomainSuggestionInputSchema},
  output: {schema: ExplainDomainSuggestionOutputSchema},
  prompt: `You are an AI domain name expert. A user is considering the domain name "{{domainSuggestion}}" for their project. The following information is known about the project:

Project or Business Name: {{projectOrBusinessName}}
Business Niche or Personal Project Type: {{businessNicheOrPersonalProjectType}}
Target Audience or Location: {{targetAudienceOrLocation}}
Keywords or Ideas for the Domain: {{keywordsOrIdeasForDomain}}

Explain in detail why "{{domainSuggestion}}" is a good domain name for this project. Your explanation should cover the following aspects:

*   Market trends and search demand
*   Branding potential and memorability
*   Audience relevance.

Focus on being informative and persuasive. Provide specific reasons and insights to help the user make an informed decision.
`,
});

const explainDomainSuggestionFlow = ai.defineFlow(
  {
    name: 'explainDomainSuggestionFlow',
    inputSchema: ExplainDomainSuggestionInputSchema,
    outputSchema: ExplainDomainSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

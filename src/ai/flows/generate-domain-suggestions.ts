'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating domain name suggestions based on user input.
 *
 * It includes:
 * - `generateDomainSuggestions`: The main function to trigger the flow.
 * - `DomainSuggestionInput`: The input type for the flow, defining the project details.
 * - `DomainSuggestionOutput`: The output type for the flow, providing a list of domain suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DomainSuggestionInputSchema = z.object({
  userType: z.enum(['Business', 'Personal']).describe('The type of user: Business or Personal.'),
  projectName: z.string().describe('The name of the project or business.'),
  businessNiche: z.string().describe('The niche of the business or type of personal project.'),
  targetAudience: z.string().describe('The target audience for the project.'),
  keywords: z.string().describe('Keywords or ideas for the domain.'),
  preferredTLDs: z.string().optional().describe('Optional: Preferred top-level domains (TLDs).'),
});

export type DomainSuggestionInput = z.infer<typeof DomainSuggestionInputSchema>;

const DomainSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      domainName: z.string().describe('The suggested domain name.'),
      confidenceScore: z.number().describe('A confidence score for the suggestion (0-1).'),
      explanation: z.string().describe('Explanation of why this domain is a good fit.'),
    })
  ).describe('A list of domain name suggestions.'),
});

export type DomainSuggestionOutput = z.infer<typeof DomainSuggestionOutputSchema>;

export async function generateDomainSuggestions(input: DomainSuggestionInput): Promise<DomainSuggestionOutput> {
  return generateDomainSuggestionsFlow(input);
}

const generateDomainSuggestionsPrompt = ai.definePrompt({
  name: 'generateDomainSuggestionsPrompt',
  input: {schema: DomainSuggestionInputSchema},
  output: {schema: DomainSuggestionOutputSchema},
  prompt: `You are an AI domain name generator. Analyze the provided project details and generate a list of domain name suggestions.

Project Name: {{{projectName}}}
Business Niche: {{{businessNiche}}}
Target Audience: {{{targetAudience}}}
Keywords: {{{keywords}}}
Preferred TLDs: {{{preferredTLDs}}}

Consider market trends, branding potential, memorability, and audience relevance when generating suggestions.

Return the top 3-5 domain suggestions, along with a confidence score (0-1) and a short explanation for each suggestion.

Ensure the output is structured according to the DomainSuggestionOutput schema.`,
});

const generateDomainSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateDomainSuggestionsFlow',
    inputSchema: DomainSuggestionInputSchema,
    outputSchema: DomainSuggestionOutputSchema,
  },
  async input => {
    const {output} = await generateDomainSuggestionsPrompt(input);
    return output!;
  }
);

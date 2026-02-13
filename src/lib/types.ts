import { z } from 'zod';

export const DomainSuggestionInputSchema = z.object({
  userType: z.enum(['Business', 'Personal'], {
    required_error: 'You need to select a user type.',
  }),
  projectName: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  businessNiche: z.string().min(2, {
    message: 'Niche or project type must be at least 2 characters.',
  }),
  targetAudience: z.string().min(2, {
    message: 'Target audience must be at least 2 characters.',
  }),
  keywords: z.string().min(2, {
    message: 'Please provide at least one keyword or idea.',
  }),
  preferredTLDs: z.string().min(1, {
    message: 'Please provide at least one preferred TLD.',
  }),
});

// The data structure for the main form
export type FormDataType = z.infer<typeof DomainSuggestionInputSchema>;

// Matches a single suggestion from the AI output
export type DomainSuggestion = {
  domainName: string;
  confidenceScore: number;
  explanation: string;
};

// Matches the full output from the generateDomainSuggestions AI flow
export type DomainSuggestionOutput = {
  suggestions: DomainSuggestion[];
};

// Input for the domain explanation/research action
export type ExplainDomainSuggestionInput = {
    domainSuggestion: string;
    projectOrBusinessName: string;
    businessNicheOrPersonalProjectType: string;
    targetAudienceOrLocation: string;
    keywordsOrIdeasForDomain: string;
};

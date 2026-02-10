import type { z } from 'zod';
import type { DomainSuggestionInputSchema } from '@/components/domain/domain-search-form';

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

// Matches the output from the explainDomainSuggestion AI flow
export type ExplainDomainSuggestionOutput = {
  explanation: string;
};

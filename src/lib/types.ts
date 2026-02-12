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

// Input for the domain explanation/research action
export type ExplainDomainSuggestionInput = {
    domainSuggestion: string;
    projectOrBusinessName: string;
    businessNicheOrPersonalProjectType: string;
    targetAudienceOrLocation: string;
    keywordsOrIdeasForDomain: string;
};

// --- Manus AI Types ---

export type ManusTask = {
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    error?: string;
    output?: {
        content: {
            text?: string;
        }[];
    }[];
}

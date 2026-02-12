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

// Manus AI Task Start Response
export type ManusTaskStartResponse = {
  task_id: string;
  task_title: string;
  task_url: string;
};

// Manus AI Task Status Response
export type ManusTaskStatus = {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output: {
    id: string;
    status: string;
    role: 'user' | 'assistant';
    type: string;
    content?: {
        type: 'output_text';
        text: string;
        fileUrl?: string;
        fileName?: string;
        mimeType?: string;
    }[];
  }[];
  error?: string;
};

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getDomainExplanation } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import type { DomainSuggestion, FormDataType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface DomainExplanationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  suggestion: DomainSuggestion;
  submittedData: FormDataType;
}

export default function DomainExplanationDialog({
  isOpen,
  setIsOpen,
  suggestion,
  submittedData,
}: DomainExplanationDialogProps) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setExplanation('');

      getDomainExplanation({
        domainSuggestion: suggestion.domainName,
        projectOrBusinessName: submittedData.projectName,
        businessNicheOrPersonalProjectType: submittedData.businessNiche,
        targetAudienceOrLocation: submittedData.targetAudience,
        keywordsOrIdeasForDomain: submittedData.keywords,
      })
        .then((result) => {
          setExplanation(result.explanation);
        })
        .catch((e: Error) => {
          setError(e.message || 'An error occurred while fetching the explanation.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, suggestion.domainName, submittedData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Deep Dive: {suggestion.domainName}
          </DialogTitle>
          <DialogDescription>
            A detailed analysis of why this domain is a great fit for your project.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
            {loading && (
                <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">AI is analyzing...</p>
                </div>
            )}
            {error && (
                <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                <p><strong>Error:</strong> {error}</p>
                </div>
            )}
            {explanation && (
                <div
                className="prose dark:prose-invert"
                dangerouslySetInnerHTML={{
                    __html: explanation
                    .replace(/\n/g, '<br />')
                    .replace(/\* (.*?)(?=<br \/>|\n|$)/g, '<li>$1</li>')
                    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'),
                }}
                />
            )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

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
import { Loader2, Bot, AlertTriangle } from 'lucide-react';
import type { DomainSuggestion, FormDataType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ExplanationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  suggestion: DomainSuggestion;
  submittedData: FormDataType;
}

type ResearchStatus = 'idle' | 'loading' | 'completed' | 'failed';

export default function ExplanationDialog({
  isOpen,
  setIsOpen,
  suggestion,
  submittedData,
}: ExplanationDialogProps) {
  const [status, setStatus] = useState<ResearchStatus>('idle');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('loading');
      setError(null);
      setExplanation(null);

      getDomainExplanation({
        domainSuggestion: suggestion.domainName,
        projectOrBusinessName: submittedData.projectName,
        businessNicheOrPersonalProjectType: submittedData.businessNiche,
        targetAudienceOrLocation: submittedData.targetAudience,
        keywordsOrIdeasForDomain: submittedData.keywords,
      })
      .then(({ explanation }) => {
        setExplanation(explanation);
        setStatus('completed');
      })
      .catch((e: Error) => {
        setStatus('failed');
        setError(e.message || 'An error occurred while fetching the explanation.');
      });
    } else {
        setStatus('idle');
    }
  }, [isOpen, suggestion.domainName, submittedData]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Analyzing domain... This may take a moment.</p>
          </div>
        );
      case 'completed':
        return (
            <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
                __html: (explanation || "No analysis was returned.")
                .replace(/\n/g, '<br />')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                 // Basic markdown for lists
                .replace(/^\* (.*$)/gm, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'),
            }}
            />
        );
      case 'failed':
        return (
          <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 mt-1" />
            <div>
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Bot className="w-6 h-6 text-primary" />
            AI Analysis: {suggestion.domainName}
          </DialogTitle>
          <DialogDescription>
            Detailed analysis powered by your local AI.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="py-4">
              {renderContent()}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { startManusResearchTask, getManusResearchStatus } from '@/app/actions';
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

type ResearchStatus = 'idle' | 'starting' | 'polling' | 'completed' | 'failed';

const POLLING_INTERVAL = 5000; // 5 seconds

export default function ExplanationDialog({
  isOpen,
  setIsOpen,
  suggestion,
  submittedData,
}: ExplanationDialogProps) {
  const [status, setStatus] = useState<ResearchStatus>('idle');
  const [pollStatus, setPollStatus] = useState<'pending' | 'running' | string>('pending');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const taskIdRef = useRef<string | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const poll = async (taskId: string) => {
    try {
      const result = await getManusResearchStatus(taskId);
      setPollStatus(result.status);

      if (result.status === 'completed') {
        if (result.analysis) {
          setAnalysis(result.analysis);
          setStatus('completed');
        } else {
          setError('No detailed analysis was returned.');
          setStatus('failed');
        }
      } else if (result.status === 'failed') {
        setError(result.error || 'Research task failed.');
        setStatus('failed');
      } else {
        // If still pending or running, schedule the next poll
        pollTimeoutRef.current = setTimeout(() => poll(taskId), POLLING_INTERVAL);
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while polling for results.');
      setStatus('failed');
    }
  };

  useEffect(() => {
    // Cleanup timeout on unmount or when dialog closes
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setStatus('starting');
      setError(null);
      setAnalysis(null);
      taskIdRef.current = null;
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

      startManusResearchTask({
        domainSuggestion: suggestion.domainName,
        projectOrBusinessName: submittedData.projectName,
        businessNicheOrPersonalProjectType: submittedData.businessNiche,
        targetAudienceOrLocation: submittedData.targetAudience,
        keywordsOrIdeasForDomain: submittedData.keywords,
      })
      .then((task) => {
        taskIdRef.current = task.task_id;
        setStatus('polling');
        // Start polling immediately
        poll(task.task_id);
      })
      .catch((e: Error) => {
        setStatus('failed');
        setError(e.message || 'An error occurred while starting the research task.');
      });
    } else {
        // When dialog closes, stop polling and reset
        if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
        }
        setStatus('idle');
    }
  }, [isOpen, suggestion.domainName, submittedData]);

  const renderContent = () => {
    switch (status) {
      case 'starting':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Initializing research task...</p>
          </div>
        );
      case 'polling':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Research in progress. Please wait, this may take a minute.</p>
            <p className="mt-2 text-sm text-muted-foreground/80">Current status: {pollStatus}</p>
          </div>
        );
      case 'completed':
        return (
            <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
                __html: (analysis || "No analysis was returned.")
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
                <p className="font-bold">Research Task Failed</p>
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
            HDS AI Research: {suggestion.domainName}
          </DialogTitle>
          <DialogDescription>
            Deep market and trend analysis powered by HDS AI.
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

'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { startManusResearchTask, getManusTaskStatus } from '@/app/actions';
import { Loader2, Bot, CheckCircle, AlertTriangle } from 'lucide-react';
import type { DomainSuggestion, FormDataType, ManusTask } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ManusResearchDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  suggestion: DomainSuggestion;
  submittedData: FormDataType;
}

type ResearchStatus = 'idle' | 'starting' | 'polling' | 'completed' | 'failed';

export default function ManusResearchDialog({
  isOpen,
  setIsOpen,
  suggestion,
  submittedData,
}: ManusResearchDialogProps) {
  const [researchStatus, setResearchStatus] = useState<ResearchStatus>('idle');
  const [task, setTask] = useState<ManusTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
  };

  useEffect(() => {
    if (isOpen) {
      setResearchStatus('starting');
      setError(null);
      setTask(null);

      startManusResearchTask({
        domainSuggestion: suggestion.domainName,
        projectOrBusinessName: submittedData.projectName,
        businessNicheOrPersonalProjectType: submittedData.businessNiche,
        targetAudienceOrLocation: submittedData.targetAudience,
        keywordsOrIdeasForDomain: submittedData.keywords,
      })
      .then(({ taskId }) => {
        setResearchStatus('polling');
        setTask({ id: taskId, status: 'pending' });

        pollingInterval.current = setInterval(async () => {
          try {
            const updatedTask = await getManusTaskStatus(taskId);
            setTask(updatedTask);

            if (updatedTask.status === 'completed') {
              setResearchStatus('completed');
              cleanup();
            } else if (updatedTask.status === 'failed') {
              setResearchStatus('failed');
              setError(updatedTask.error || 'The research task failed without a specific error message.');
              cleanup();
            }
          } catch (e: any) {
            setResearchStatus('failed');
            setError(e.message || 'An error occurred while checking the task status.');
            cleanup();
          }
        }, 5000); // Poll every 5 seconds
      })
      .catch((e: Error) => {
        setResearchStatus('failed');
        setError(e.message || 'An error occurred while starting the research task.');
      });
    } else {
        cleanup();
        setResearchStatus('idle');
    }
    
    return () => cleanup();
  }, [isOpen, suggestion.domainName, submittedData]);

  const renderContent = () => {
    switch (researchStatus) {
      case 'starting':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Initializing deep research task with Manus AI...</p>
          </div>
        );
      case 'polling':
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                    Research in progress. Please wait, this may take a minute.
                </p>
                <p className="mt-2 text-sm text-muted-foreground/80">
                    Current status: <span className="font-semibold">{task?.status || 'loading'}</span>
                </p>
            </div>
        );
      case 'completed':
        const outputText = task?.output?.[1]?.content?.[0]?.text || "No detailed analysis was returned.";
        return (
            <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
                __html: outputText
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
            Manus AI Research: {suggestion.domainName}
          </DialogTitle>
          <DialogDescription>
            Deep market and trend analysis powered by Manus AI.
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

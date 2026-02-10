'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { DomainSuggestion, FormDataType } from '@/lib/types';
import DomainExplanationDialog from './domain-explanation-dialog';
import { logDomainRegistration } from '@/app/actions';

interface DomainSuggestionCardProps {
  suggestion: DomainSuggestion;
  submittedData: FormDataType;
}

export default function DomainSuggestionCard({ suggestion, submittedData }: DomainSuggestionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleRegisterClick = async () => {
    // TODO: For interns - This is where the CRM tagging and automation hooks are triggered.
    // The server action `logDomainRegistration` is a placeholder for your CRM logic.
    await logDomainRegistration(suggestion.domainName, submittedData.userType);
  };

  const confidencePercentage = Math.round(suggestion.confidenceScore * 100);
  const whmcsUrl = `https://clients.hordanso.net/cart.php?a=add&prefill=${suggestion.domainName}`;
  /* 
    User requested JS snippet for auto-fill and click on WHMCS page:
    <a href="..." onclick="window.onload = function() { ... }">...</a>
    NOTE TO INTERNS: This approach is not feasible due to cross-origin security policies in modern browsers.
    A script on your page cannot manipulate the content of a different domain (clients.hordanso.net).
    The 'prefill' URL parameter is the correct and intended method for this functionality.
  */

  return (
    <>
      <Card className="transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-2xl text-primary">{suggestion.domainName}</CardTitle>
            <Badge variant="outline">
              Confidence: {confidencePercentage}%
            </Badge>
          </div>
          <CardDescription className="pt-2">
            <Progress value={confidencePercentage} className="w-full h-2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{suggestion.explanation}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Why this domain?
          </Button>
          <Button asChild onClick={handleRegisterClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={whmcsUrl} target="_blank">
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <DomainExplanationDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        suggestion={suggestion}
        submittedData={submittedData}
      />
    </>
  );
}

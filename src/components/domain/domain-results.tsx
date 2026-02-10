'use client';

import Image from 'next/image';
import { AlertCircle, FileSearch, Sparkles } from 'lucide-react';
import type { DomainSuggestion, FormDataType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DomainSuggestionCard from './domain-suggestion-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DomainResultsProps {
  suggestions: DomainSuggestion[];
  loading: boolean;
  error: string | null;
  submittedData: FormDataType | null;
}

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-discover');

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-end pt-2 gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const InitialState = () => (
  <div className="text-center p-8 border border-dashed rounded-lg">
    {heroImage && (
      <div className="relative aspect-video mb-6">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="rounded-md object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      </div>
    )}
    <Sparkles className="mx-auto h-12 w-12 text-primary" />
    <h3 className="mt-4 text-xl font-headline font-semibold text-foreground">
      Your AI-powered domain suggestions will appear here
    </h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Fill out the form to let our AI find the perfect domain for you.
    </p>
  </div>
);

export default function DomainResults({ suggestions, loading, error, submittedData }: DomainResultsProps) {
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>An Error Occurred</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (suggestions.length === 0) {
    return <InitialState />;
  }

  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-headline font-bold text-foreground flex items-center gap-2">
        <FileSearch className="text-primary"/>
        AI-Generated Domain Suggestions
       </h2>
      {suggestions.map((suggestion) => (
        <DomainSuggestionCard key={suggestion.domainName} suggestion={suggestion} submittedData={submittedData!} />
      ))}
    </div>
  );
}

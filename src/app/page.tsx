'use client';

import { useState } from 'react';
import type { DomainSuggestion, FormDataType } from '@/lib/types';
import { getDomainSuggestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/header';
import Footer from '@/components/footer';
import DomainSearchForm from '@/components/domain/domain-search-form';
import DomainResults from '@/components/domain/domain-results';

export default function Home() {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<FormDataType | null>(null);

  const { toast } = useToast();

  const handleSearch = async (data: FormDataType) => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setSubmittedData(data);

    try {
      const result = await getDomainSuggestions(data);
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        throw new Error('No suggestions returned from the AI.');
      }
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Generating Suggestions',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                Discover Your Perfect Domain
              </h1>
              <p className="mt-4 text-muted-foreground">
                Let our AI find the best domain for your business or personal project. Fill out the form to get started.
              </p>
              <DomainSearchForm onSubmit={handleSearch} loading={loading} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <DomainResults
              suggestions={suggestions}
              loading={loading}
              error={error}
              submittedData={submittedData}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';
import type { FormDataType } from '@/lib/types';
import { DomainSuggestionInputSchema } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface DomainSearchFormProps {
  onSubmit: (data: FormDataType) => void;
  loading: boolean;
}

export default function DomainSearchForm({ onSubmit, loading }: DomainSearchFormProps) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(DomainSuggestionInputSchema),
    defaultValues: {
      userType: 'Business',
      projectName: '',
      businessNiche: '',
      targetAudience: '',
      keywords: '',
      preferredTLDs: '.com, .ai, .io',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
        {/* TODO: For interns - This is where the funnel CTA would connect to pre-fill form data.
            You could use URL parameters and read them here to set default form values.
            Example: /?project=MyCoolApp&niche=SaaS
        */}
        
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am looking for a domain for...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Business" />
                    </FormControl>
                    <FormLabel className="font-normal">A Business</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Personal" />
                    </FormControl>
                    <FormLabel className="font-normal">A Personal Project</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project or Business Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Manus AI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessNiche"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Niche / Project Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AI-powered analytics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience / Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tech startups in Silicon Valley" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords or Ideas</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., discover, smart, domain, tech" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated keywords that describe your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preferredTLDs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred TLDs</FormLabel>
              <FormControl>
                <Input placeholder="e.g., .com, .ai, .io" {...field} />
              </FormControl>
              <FormDescription>
                Top-level domains you prefer, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search />
          )}
          Find My Domain
        </Button>
      </form>
    </Form>
  );
}

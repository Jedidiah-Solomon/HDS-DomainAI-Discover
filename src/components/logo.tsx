import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-8 w-8', props.className)}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logoGradient)" stroke="none" />
      <path d="M2 17l10 5 10-5" stroke="url(#logoGradient)" />
      <path d="M2 12l10 5 10-5" stroke="url(#logoGradient)" />
      <circle cx="12" cy="12" r="2.5" fill="hsl(var(--background))" />
      <circle cx="12" cy="12" r="1.5" fill="url(#logoGradient)" />
    </svg>
  );
}

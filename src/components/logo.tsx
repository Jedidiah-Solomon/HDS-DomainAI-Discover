import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://storage.googleapis.com/msgsndr/XQll7W2eMGvCdzaiONJZ/media/697df87af7a8774460a15ee6.png"
      alt="HDS DomainAI Discover Logo"
      width={32}
      height={32}
      className={cn('h-8 w-8', className)}
    />
  );
}

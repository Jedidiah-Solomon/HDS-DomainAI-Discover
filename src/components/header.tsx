import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-card border-b">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logo />
          <span className="font-headline text-xl font-bold">DomainAI Discover</span>
        </Link>
      </div>
    </header>
  );
}

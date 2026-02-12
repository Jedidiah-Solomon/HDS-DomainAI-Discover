import { Logo } from '@/components/logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <p>HDS DomainAI Discover</p>
        </div>
        <div className="hidden md:block">
            <p className="text-center">Hordanso - Top AI Automation Agency Nigeria</p>
        </div>
        <p>&copy; {currentYear}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

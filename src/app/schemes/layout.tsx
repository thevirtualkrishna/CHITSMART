import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SchemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <HandCoins className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block font-headline">ChitSmart</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-end space-x-4">
             <Button asChild>
                <Link href="/login/customer">Customer Login</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/login/admin">Admin Login</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ChitSmart. Your trusted partner in digital chit fund management.
            </p>
        </div>
     </footer>
    </div>
  );
}
